import { Component } from '@angular/core';
import { vrInfo } from 'src/vrInfo';

@Component({
  selector: 'app-add-vrheadset',
  templateUrl: './add-vrheadset.component.html',
  styleUrls: ['./add-vrheadset.component.css']
})
export class AddVRHeadsetComponent {
  imagePathAdd: string = 'assets/images/add_button.png';
  imagePathQuest3: string = 'assets/images/metaquest3.png';
  imagePathUpload: string = 'assets/images/upload_button.png';
  imagePathSettings: string = 'assets/images/settings_button.png';
  
  headset: vrInfo = {
    ipAddress: '10.101.0.192',
    port: '8001',
    name: 'VR1',
    status: 'online',
    id: undefined
  };


  addHeadset() {
    const url = "http://localhost:3000/DownloadAssets";
    const data = { ipAddress: this.headset.ipAddress,  port: this.headset.port};

    
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
