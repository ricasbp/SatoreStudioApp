import { Component } from '@angular/core';
import { map } from 'rxjs';
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

  sendOSCCommandToAllOnlineVRHeadsets2(): void {
    // Check in list what are all the headsets that are online
    this.headsetsList$.pipe(
        map((headsets) => headsets.filter((headset) => headset.status === 'online')) // Filter online headsets
      ).subscribe((onlineHeadsets) => {
        onlineHeadsets.forEach((headset) => {
          headset.status = 'experience running'; // Change status to running
          this.vrHeadsetService.updateVRHeadset(headset); // make an updateVRHeadset in all headsets that are online into experience running
        });
      });
      // HOW TO DO THIS: Ask the service to send command to express to send OSCCommand to start or stop experience to all online devices.
  }

  sendOSCCommandToAllOnlineVRHeadsets(action: string) {
    console.log(`Action: ${action}`);
    let url = "";

    if(action == 'Stop'){
      url = "http://localhost:3000/StopExperience";
      this.isExperienceActive = false;
    }else{
      url = "http://localhost:3000/StartExperience";
      this.isExperienceActive = true;
    }
    
    const data = { action: action };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
  }
}
