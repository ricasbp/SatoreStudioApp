import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { delay, map, Observable, of, take, tap, timer } from 'rxjs';

import { vrHeadset } from 'src/vrHeadset';
import { SseService } from 'src/app/services/sse-services/sse-services';
import { VRHeadsetService } from '../../services/vrheadset-service.service';

@Component({
  selector: 'app-vr-headsets-operator',
  templateUrl: './vr-headsets-operator.component.html',
  styleUrls: ['./vr-headsets-operator.component.css']
})
export class VrHeadsetsOperatorComponent {

  newHeadset: vrHeadset = { _id: '', ipAddress: '', name: '', status: 'offline',  isInEditMode: false};

  isUserAddingNewVRHeadset: boolean = false;

  imagePathAdd: string = 'assets/images/add_button.png';
  imagePathQuest3: string = 'assets/images/metaquest3.png';
  imagePathQuest3Grey: string = 'assets/images/metaquest3_grey.png';
  imagePathSettings: string = 'assets/images/settings_button.png';
  imagePathAddButton: string = 'assets/image/add_button.png';

  headsetsList$ =  this.vrHeadsetService.headsetsList$

  constructor(private vrHeadsetService: VRHeadsetService) {
  }

  onEditingHTMLOfVRHeadset(item : any){
    item.isInEditMode = true;
  }

  clickedSwitchToSync(headset: vrHeadset): void {

    if(headset.status == "ready (Assets Uploaded)"){
      this.vrHeadsetService.updateVRHeadset({...headset, status: 'online'});
      console.log(`${headset.name} has exited synced mode.`);

    }else if(headset.status == "online"){
      this.vrHeadsetService.updateVRHeadset({...headset, status: 'uploading...'});

      // Sleep 3 seconds using RxJS timer/delay
      of(null).pipe(
        delay(3000) // delay of 3000ms = 3 seconds
      ).subscribe(() => {
        this.vrHeadsetService.updateVRHeadset({ ...headset, status: 'ready (Assets Uploaded)' });
        console.log(`${headset.name} is now in synced mode.`);
  
        // Sleep for 1 seconds
        timer(1000).subscribe(() => {
          console.log('Slept for 1 seconds.');
        });

        // Check if all VR headsets are in the 'ready (Assets Uploaded)' or 'offline' state
        this.headsetsList$.subscribe((headsets) => {
          const allReady = headsets.every(h => h.status === 'ready (Assets Uploaded)' || h.status === 'offline');
  
          if (allReady) { 
            
            // Change only the ready headsets to 'all devices ready' status
            headsets.forEach(h => {
              if (h.status === 'ready (Assets Uploaded)') {
                this.vrHeadsetService.updateVRHeadset({ ...h, status: 'all devices ready' });
              }
            });
            console.log("All devices are now set to 'all devices ready' status.");
          } else {
            console.log("Not all headsets are ready yet.");
          }
        });
      });
    }
  }

  
  updateVRHeadset(headset: vrHeadset): void {
    headset.isInEditMode = false;
    this.vrHeadsetService.updateVRHeadset(headset);
    console.log("Updatting new headset:", this.newHeadset);
  }

  deleteVRHeadset(headset: vrHeadset): void {
    headset.isInEditMode = false;
    console.log(headset);
    if (confirm(`Are you sure you want to delete the VR Headset: ${headset.name}?`)) {
      this.vrHeadsetService.deleteVRHeadset(headset._id!)
    }
  }

  addVRHeadset() {
    console.log('Submitting new headset:', this.newHeadset);
    this.isUserAddingNewVRHeadset = false;
    this.vrHeadsetService.addVRHeadset(this.newHeadset)
  }

  getVRHeadsetStatusClass(status: string): { [key: string]: boolean } {
    return {
      'offline-class': status === 'offline',
      'online-class': status === 'online',
      'uploading-class': status === 'uploading...',
      'running-experience-class': status === 'experience running',
      'allReady-class': status === 'all devices ready',
      'ready-class': status === 'ready (Assets Uploaded)',
      'error-class': status === 'error'
    };
  }

}
