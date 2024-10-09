import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import { vrHeadset } from 'src/vrHeadset';
import { SseService } from 'src/app/services/sse-services/sse-services';
import { Observable, tap } from 'rxjs';
import { VRHeadsetService } from '../../services/vrheadset-service.service';

@Component({
  selector: 'app-vr-headsets-director',
  templateUrl: './vr-headsets-director.component.html',
  styleUrls: ['./vr-headsets-director.component.css']
})
export class VrHeadsetsDirectorComponent {
  headsetsList: vrHeadset[] = [];
  newHeadset: vrHeadset = { _id: '', ipAddress: '', name: '', status: 'offline', directingMode: false, isInEditMode: false};

  isUserAddingNewVRHeadset: boolean = false;

  imagePathAdd: string = 'assets/images/add_button.png';
  imagePathQuest3: string = 'assets/images/metaquest3.png';
  imagePathQuest3Grey: string = 'assets/images/metaquest3_grey.png';
  imagePathSettings: string = 'assets/images/settings_button.png';
  imagePathAddButton: string = 'assets/image/add_button.png';


  vrHeadsetsFromService: Observable<vrHeadset[]> = this.vrHeadsetService.getVRHeadsets();

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


  constructor(private vrHeadsetService: VRHeadsetService) {
    this.loadVRHeadsetsIntoObservable();
  }

  activateDirectorMode(headset: vrHeadset): void {
    // Toggle the directingMode for the given headset
    headset.directingMode = !headset.directingMode;

    // You can add additional logic here if needed
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
    
    // Toggle directingMode for all headsets based on master switch's state
    this.headsetsList.forEach((headset: {
      name: any; directingMode: boolean; 
      }) => {
              headset.directingMode = isChecked;
              console.log(`${headset.name} is now in directing mode.`);
          });
  }

  loadVRHeadsetsIntoObservable(): void {
    this.vrHeadsetsFromService = this.vrHeadsetService.getVRHeadsets();
  }

  onEditingHTMLOfVRHeadset(item : any){
    item.isInEditMode = true;
  }

  updateVRHeadset(headset: vrHeadset): void {
    // Update VRHeadset from vrHeadsetService (FromMongoDB)
    headset.isInEditMode = false;
    this.vrHeadsetService.updateVRHeadset(headset).subscribe(
      (response) => {
        console.log('Headset updated successfully', response);
        this.loadVRHeadsetsIntoObservable(); // Refresh the list after a successful update
        //TO FIX: Observable should do automatically the load.
      },
      (error) => {
        console.error('Error updating headset', error);
      }
    );
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
      (response) => {
        console.log('Headset updated successfully', response);
        this.loadVRHeadsetsIntoObservable(); // Refresh the list after a successful update
        //TO FIX: Observable should do automatically the load.
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
