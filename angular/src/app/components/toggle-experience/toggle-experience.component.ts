import { Component } from '@angular/core';
import { map, take } from 'rxjs';
import { VRHeadsetService } from 'src/app/services/vrheadset-service.service';

@Component({
  selector: 'app-toggle-experience',
  templateUrl: './toggle-experience.component.html',
  styleUrls: ['./toggle-experience.component.css']
})
export class ToggleExperienceComponent {

  imagePathPlay: string = 'assets/images/play_button.png';  
  imagePathPlayGrey: string = 'assets/images/play_button_grey.png';

  imagePathStop: string = 'assets/images/stop_button.png';
  imagePathStopGrey: string = 'assets/images/stop_button_grey.png';

  isExperienceActive: boolean = false;  

  headsetsList$ =  this.vrHeadsetService.headsetsList$

  constructor(private vrHeadsetService: VRHeadsetService) {
    
  }

  requestExpressToSendOSCCommandToAllOnlineVRHeadsets(action: string): void {
    if(action == 'StartExperience'){
      this.isExperienceActive = true

      this.headsetsList$.pipe(
        map((headsets) => headsets.filter((headset) => headset.status === 'online')),
        take(1) // Only subscribe one time
        ).subscribe((onlineHeadsets) => {
          onlineHeadsets.forEach((headset) => {
            this.vrHeadsetService.updateVRHeadset({...headset, status: "experience running"});
          });
        });
    }
    if(action == 'StopExperienceRunning'){
      this.isExperienceActive = false

      this.headsetsList$.pipe(
        map((headsets) => headsets.filter((headset) => headset.status === 'experience running')),
        take(1) // Only subscribe one time
        ).subscribe((onlineHeadsets) => {
          onlineHeadsets.forEach((headset) => {
            this.vrHeadsetService.updateVRHeadset({...headset, status: "online"});
          });
        });
    }
  }
}
