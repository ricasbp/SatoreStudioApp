import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { vrInfo } from 'src/vrInfo';
import { SseService } from 'src/app/services/sse-services/sse-services';
import { tap } from 'rxjs';
import { VRHeadsetService } from '../../services/vrheadset-service.service';

@Component({
  selector: 'app-vr-info',
  templateUrl: './vr-info.component.html',
  styleUrls: ['./vr-info.component.css']
})
export class VRInfoComponent implements OnInit {

  headsetsList: any;
  newHeadset: vrInfo = { ipAddress: '', port: '', name: '', status: 'offline'};

  imagePathAdd: string = 'assets/images/add_button.png';
  imagePathQuest3: string = 'assets/images/metaquest3.png';
  imagePathQuest3Grey: string = 'assets/images/metaquest3_grey.png';
  imagePathSettings: string = 'assets/images/settings_button.png';

  imagePathUpload: string = 'assets/images/upload_button.png';
  imagePathPlay: string = 'assets/images/play_button.png';
  imagePathStopGrey: string = 'assets/images/stop_button_grey.png';
  imagePathRestartGrey: string = 'assets/images/restart_button_grey.png';

  //Refresh the DOM if receives value from event
  data$ = this.sseService.events$.pipe(
    tap((value) => {
      console.log(value);
      this.cdRef.detectChanges();
  }))

  constructor(protected readonly sseService: SseService, 
    private cdRef: ChangeDetectorRef,
    private vrHeadsetService: VRHeadsetService) {
  }
      
  ngOnInit(): void {
    this.loadVRHeadsets();
  }

  private loadVRHeadsets(): void {
    //Get VRHeadsets from vrHeadsetService (FromMongoDB)
    this.vrHeadsetService.getVRHeadsets().subscribe(
      (data) => {
        this.headsetsList = data;
        console.log('VR Headsets:', this.headsetsList);
      },
      (error) => {
        console.error('Error retrieving VR headsets', error);
      }
    );
  }

  addVRHeadset() {
    console.log('Submitting new headset:', this.newHeadset);
    this.vrHeadsetService.addVRHeadset(this.newHeadset).subscribe(
      data => {
        this.headsetsList.push(data);
        this.newHeadset = { ipAddress: '', port: '', name: '', status: 'offline' }; // Reset the form
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
