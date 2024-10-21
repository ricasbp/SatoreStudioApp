import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import { vrHeadset } from 'src/vrHeadset';
import { SseService } from 'src/app/services/sse-services/sse-services';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { VRHeadsetService } from '../../services/vrheadset-service.service';

@Component({
  selector: 'app-vr-headsets-director',
  templateUrl: './vr-headsets-director.component.html',
  styleUrls: ['./vr-headsets-director.component.css']
})
export class VrHeadsetsDirectorComponent implements OnInit{
  newHeadset: vrHeadset = { _id: '', ipAddress: '', name: '', status: 'offline', directingMode: false, isInEditMode: false};

  isUserAddingNewVRHeadset: boolean = false;

  imagePathAdd: string = 'assets/images/add_button.png';
  imagePathQuest3: string = 'assets/images/metaquest3.png';
  imagePathQuest3Grey: string = 'assets/images/metaquest3_grey.png';
  imagePathSettings: string = 'assets/images/settings_button.png';
  imagePathAddButton: string = 'assets/image/add_button.png';

  // headsetsList: vrHeadset[] = [];
  // vrHeadsetsFromService$: Observable<vrHeadset[]> = this.vrHeadsetService.getVRHeadsets();


  /* 
    Important aspect of Angular. You can manipulate easily data with .pipe().
    This website expalins the concept well: https://www.rxjs-fruits.com/subscribe-next

    vrHeadsetsFromService: Observable<vrHeadset[]> = 
      this.vrHeadsetService.getVRHeadsets().pipe(
        map((data) => {
          return {...data,banana:true}
        })
      )
  */

  ngOnInit(){
    this.vrHeadsetService.getVRHeadsets().subscribe(
      (vrHeadsetArray) => {
        this.headsetsListSubject.next(vrHeadsetArray);
      },
      error => console.error('Error getting VR headset', error)
    );
  }

  constructor(private vrHeadsetService: VRHeadsetService) {
    this.loadVRHeadsetsIntoObservable();
  }

  activateDirectorMode(headset: vrHeadset): void {
    headset.directingMode = !headset.directingMode;
    this.updateVRHeadsetAndRefreshDOM(headset)

    if (headset.directingMode) {
        // Logic when directing mode is turned ON
        console.log(`${headset.name} is now in directing mode.`);
        // You could also make an API call to update the server, e.g.:
        // this.vrService.activateDirectingMode(headset.id).subscribe();
    } else {
        // Logic when directing mode is turned OFF
        console.log(`${headset.name} has exited directing mode.`);
        // Similarly, an API call to deactivate directing mode could be made:
        // this.vrService.deactivateDirectingMode(headset.id).subscribe();
    }
  }

  activateDirectorModeOnAll(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    this.vrHeadsetsFromService$.pipe(
      tap((headsets) => { // Anonymous function, hedasets is the value from observable
        headsets.forEach((headset: vrHeadset) => {
          // Set directingMode explicitly to match the checkbox state
          if (headset.directingMode !== isChecked) {
            this.activateDirectorMode(headset);
          }
        })
      })
    ).subscribe();
  }

  updateVRHeadsetAndRefreshDOM(headset: vrHeadset): void {
    // Update VRHeadset from vrHeadsetService (FromMongoDB)
    headset.isInEditMode = false;
    this.vrHeadsetService.updateVRHeadset(headset).subscribe(
      (response) => {
        console.log('Headset updated successfully', response);
        this.loadVRHeadsetsIntoObservable(); // Refresh the DOM list after a successful update
        //TO FIX: Observable should do automatically the load.
      },
      (error) => {
        console.error('Error updating headset', error);
      }
    );
  }

  loadVRHeadsetsIntoObservable(): void {
    this.vrHeadsetsFromService$ = this.vrHeadsetService.getVRHeadsets();
  }

  onEditingHTMLOfVRHeadset(item : any){
    item.isInEditMode = true;
  }


  deleteVRHeadset(headset: vrHeadset): void {
    headset.isInEditMode = false;
    console.log(headset);
    if (confirm(`Are you sure you want to delete the VR Headset: ${headset.name}?`)) {
      this.vrHeadsetService.deleteVRHeadset(headset._id!).subscribe(
        response => {
          console.log('VR Headset deleted:', response);
          this.loadVRHeadsetsIntoObservable(); // Refresh the list after a successful update
          //TO FIX: Observable should do automatically the load.
        },
        error => {
          console.error('Error deleting VR Headset:', error);
        }
      );
    }
  }

  addVRHeadset() {
    console.log('Submitting new headset:', this.newHeadset);
    this.vrHeadsetService.addVRHeadset(this.newHeadset).subscribe(
      (vrHeadsetArray) => {
        console.log('Headset updated successfully', vrHeadsetArray);
        this.headsetsListSubject.next(vrHeadsetArray);
      },
      error => console.error('Error adding VR headset', error)
    );
  }

  getVRHeadsetStatusClass(status: string): { [key: string]: boolean } {
    return {
      'offline-class': status === 'offline',
      'online-class': status === 'online',
      'ready-class': status === 'ready',
      'error-class': status === 'error',
      'running-experience-class': status === 'experience running'
    };
  }

}
