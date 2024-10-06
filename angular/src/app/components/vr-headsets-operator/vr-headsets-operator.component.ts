import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

import { vrHeadset } from 'src/vrHeadset';
import { SseService } from 'src/app/services/sse-services/sse-services';
import { VRHeadsetService } from '../../services/vrheadset-service.service';

@Component({
  selector: 'app-vr-headsets-operator',
  templateUrl: './vr-headsets-operator.component.html',
  styleUrls: ['./vr-headsets-operator.component.css']
})
export class VrHeadsetsOperatorComponent {

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

  loadVRHeadsetsIntoObservable(): void {
    this.vrHeadsetsFromService = this.vrHeadsetService.getVRHeadsets();
  }

  onEditingVRHeadsetHTML(item : any){
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
    const data = { ipAddress: headset.ipAddress};

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
