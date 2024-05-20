import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { vrInfo } from 'src/vrInfo';
import { HEADSETS } from '../../mock-vrInfo';
import { SseService } from 'src/app/services/sse-services/sse-services';
import { tap } from 'rxjs';

@Component({
  selector: 'app-vr-info',
  templateUrl: './vr-info.component.html',
  styleUrls: ['./vr-info.component.css']
})
export class VRInfoComponent implements OnInit {

  headsetsList = HEADSETS; 

  imagePathQuest3: string = 'assets/images/metaquest3.png';
  imagePathQuest3Grey: string = 'assets/images/metaquest3_grey.png';
  imagePathDownload: string = 'assets/images/download_button.png';
  imagePathPlay: string = 'assets/images/play_button.png';
  imagePathStopGrey: string = 'assets/images/stop_button_grey.png';
  imagePathRestartGrey: string = 'assets/images/restart_button_grey.png';

  //Refresh the DOM if receives value from event
  data$ = this.sseService.events$.pipe(
    tap((value) => {
      console.log(value);
      this.cdRef.detectChanges();
    }))

  constructor(protected readonly sseService: SseService, private cdRef: ChangeDetectorRef) {
  }
  
  ngOnInit(): void {
  }

  sendDownloadAssetsOSC(headset: vrInfo) {
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
