import { Component } from '@angular/core';
import { vrInfo } from 'src/vrInfo';

@Component({
  selector: 'app-vr-custom',
  templateUrl: './vr-custom.component.html',
  styleUrls: ['./vr-custom.component.css']
})
export class VrCustomComponent {
  headset: vrInfo = {
    id: 1,
    ipAddress: '10.101.0.192',
    port: '8001',
    name: 'VR1',
    isOnline: true
  };

  imagePathQuest3: string = 'assets/images/metaquest3.png';
  imagePathUpload: string = 'assets/images/upload_button.png';
  imagePathSettings: string = 'assets/images/settings_button.png';


  sendDownloadAssetsOSC() {
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
