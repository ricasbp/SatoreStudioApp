import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { vrHeadset } from 'src/vrHeadset';
import { SseService } from 'src/app/services/sse-services/sse-services';
import { map, Observable, tap } from 'rxjs';
import { VRHeadsetService } from '../../services/vrheadset-service.service';

@Component({
  selector: 'app-vr-headsets-operator',
  templateUrl: './vr-headsets-operator.component.html',
  styleUrls: ['./vr-headsets-operator.component.css']
})
export class VrHeadsetsOperatorComponent {

  headsetsList: vrHeadset[] = [];
  newHeadset: vrHeadset = { _id: '', ipAddress: '', port: '', name: '', status: 'offline', directingMode: false, isInEditMode: false};

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

  vrHeadsetsFromService: Observable<vrHeadset[]> = this.vrHeadsetService.getVRHeadsets().pipe(
    map((data) => {
      return {...data,banana:true}
    })
  )
  */

  constructor(private vrHeadsetService: VRHeadsetService) {
  }


  /*    
  ngOnInit(): void {
    this.getVRHeadsetsFromService();
  }
  
  getVRHeadsetsFromService(): Observable<vrHeadset[]> {
    return this.vrHeadsetService.getVRHeadsets();
    // console.log('VR Headsets in Component:', this.headsetsList);
  }
  */

  onEdit(item : any){
    item.isInEditMode = true;
  }

  updateVRHeadset(headset: any): void {
    console.log(headset)
    // Update VRHeadset from vrHeadsetService (FromMongoDB)
    this.vrHeadsetService.updateVRHeadset(headset).subscribe(
      (response) => {
        console.log('Headset updated successfully', response);
        // Optionally, you can refresh the headset list or update the UI
        // this.getVRHeadsetsFromService();
      },
      (error) => {
        console.error('Error updating headset', error);
      }
    );
  }

  deleteVRHeadset(headset: vrHeadset): void {
    console.log(headset);
    if (confirm(`Are you sure you want to delete the VR Headset: ${headset.name}?`)) {
      this.vrHeadsetService.deleteVRHeadset(headset._id!).subscribe(
        response => {
          console.log('VR Headset deleted:', response);
          // Remove the deleted headset from the list in the UI
          this.headsetsList = this.headsetsList.filter((h: vrHeadset) => h._id !== headset._id);
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
      data => {
        this.headsetsList.push(data);
        this.newHeadset = { _id: '', ipAddress: '', port: '', name: '', status: 'offline', directingMode: false, isInEditMode: false}; // Reset the form
      },
      error => console.error('Error adding VR headset', error)
    );
  }

  getStatusClass(status: string): { [key: string]: boolean } {
    return {
      'offline-class': status === 'offline',
      'online-class': status === 'online',
      'ready-class': status === 'ready',
      'error-class': status === 'error',
      'running-experience-class': status === 'running experience'
    };
  }
  
  sendDownloadAssetsOSC(headset: vrHeadset) {
    const url = "http://localhost:3000/DownloadAssets";
    const data = { ipAddress: headset.ipAddress,  port: headset.port};

    fetch(url, {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success! :', data);
    })
    .catch((error) => {
      console.error('Error! :', error);
    });
  }

}
