import { Component } from '@angular/core';

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


  sendOSC(action: string) {
    console.log(`Action: ${action}`);
    let url = "http://localhost:3000/StartExperience";

    if(action == 'Stop'){
      url = "http://localhost:3000/StopExperience";
      this.isExperienceActive = false;
    }else{
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
