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
export class VrHeadsetsDirectorComponent{
  newHeadset: vrHeadset = { _id: '', ipAddress: '', name: '', status: 'offline', directingMode: false, isInEditMode: false};

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

  activateDirectorMode(headset: vrHeadset): void {
    headset.directingMode = !headset.directingMode;

    if (headset.directingMode) {
        // Logic when directing mode is turned ON
        console.log(`${headset.name} is now in directing mode.`);
    } else {
        // Logic when directing mode is turned OFF
        console.log(`${headset.name} has exited directing mode.`);
    }
  }

  activateDirectorModeOnAll(event: Event): void {
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
    this.vrHeadsetService.addVRHeadset(this.newHeadset)
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