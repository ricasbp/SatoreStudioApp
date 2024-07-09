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
  newHeadset: vrInfo = {ipAddress: '', port: '', name: '', status: 'offline', id: undefined};


  imagePathQuest3: string = 'assets/images/metaquest3.png';
  imagePathQuest3Grey: string = 'assets/images/metaquest3_grey.png';
  imagePathSettings: string = 'assets/images/settings_button.png';

  imagePathUpload: string = 'assets/images/upload_button.png';
  imagePathPlay: string = 'assets/images/play_button.png';
  imagePathStopGrey: string = 'assets/images/stop_button_grey.png';
  imagePathRestartGrey: string = 'assets/images/restart_button_grey.png';

  // Variables for handling edit modal
  isEditModalOpen = true;
  editedHeadset: vrInfo | any;

  //Refresh the DOM if receives value from event
  data$ = this.sseService.events$.pipe(
    tap((value) => {
      console.log(value);
      this.cdRef.detectChanges();
  }))

  constructor(
    protected readonly sseService: SseService, 
    private cdRef: ChangeDetectorRef,
    private vrHeadsetService: VRHeadsetService
  ) {}
  
  ngOnInit(): void {
    this.loadVRHeadsets();
  }

  loadVRHeadsets(): void {
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

  
  // Modal Code
  openEditModal(headset: vrInfo): void {
    // Open the edit modal and populate with the selected headset data
    this.isEditModalOpen = true;
    this.editedHeadset = { ...headset }; // Make a copy to prevent direct mutation
  }

  saveEditedHeadset(): void {
    // Update the edited headset via the service
    this.vrHeadsetService.addVRHeadset(this.editedHeadset).subscribe(
      (updatedHeadset) => {
        // Replace the original headset in the list with the updated one
        const index = this.headsetsList.findIndex((h: { id: any; }) => h.id === updatedHeadset.id);
        if (index !== -1) {
          this.headsetsList[index] = updatedHeadset;
        }
        this.closeEditModal(); // Close the modal after successful update
      },
      (error) => {
        console.error('Error updating headset:', error);
      }
    );
  }

  closeEditModal(): void {
    // Close the edit modal without saving changes
    this.isEditModalOpen = false;
    this.editedHeadset = null;
  }
    

  addVRHeadset() {
    console.log('Submitting new headset:', this.newHeadset);
    this.vrHeadsetService.addVRHeadset(this.newHeadset).subscribe(
      data => {
        this.headsetsList.push(data);
        this.newHeadset = { ipAddress: '', port: '', name: '', status: 'offline' , id: ''}; // Reset the form
      },
      error => console.error('Error adding VR headset', error)
    );
  }
}
