import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { vrInfo } from 'src/vrInfo';
import { SseService } from 'src/app/services/sse-services/sse-services';
import { tap } from 'rxjs';
import { VRHeadsetService } from '../../services/vrheadset-service.service';

@Component({
  selector: 'app-vrHeadsets',
  templateUrl: './vrHeadsets.component.html',
  styleUrls: ['./vrHeadsets.component.css']
})
export class vrHeadsetsComponent implements OnInit {

  headsetsList: any;
  newHeadset: vrInfo = { _id: '', ipAddress: '', port: '', name: '', status: 'offline', directingMode: false};

  isUserAddingNewVRHeadset: boolean = false;

  imagePathAdd: string = 'assets/images/add_button.png';
  imagePathQuest3: string = 'assets/images/metaquest3.png';
  imagePathQuest3Grey: string = 'assets/images/metaquest3_grey.png';
  imagePathSettings: string = 'assets/images/settings_button.png';
  imagePathAddButton: string = 'assets/image/add_button.png';


  constructor(private vrHeadsetService: VRHeadsetService) {
  }
      
  ngOnInit(): void {
    this.loadVRHeadsets();
  }

  onEdit(item : any){
    item.isEdit = true;
  }

  activateDirectorMode(headset: vrInfo): void {
    // Toggle the directingMode for the given headset
    headset.directingMode = !headset.directingMode;

    // You can add additional logic here if needed
    if (headset.directingMode) {
        // Logic when directing mode is turned ON
        console.log(`${headset.name} is now in directing mode.`);
        // You could also make an API call to update the server, e.g.:
        // this.vrService.activateDirectingMode(headset.id).subscribe();
    } else {
        // Logic when directing mode is turned OFF
        console.log(`${headset.name} has exited directing mode.`);
        // Similarly, an API call to deactivate directing mode could be made:
        // this.vrService.deactivateDirectingMode(headset.id).subscribe();
    }
}

  activateDirectorModeAll(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    
    // Toggle directingMode for all headsets based on master switch's state
    this.headsetsList.forEach((headset: {
      name: any; directingMode: boolean; 
}) => {
        headset.directingMode = isChecked;
        console.log(`${headset.name} is now in directing mode.`);
    });
  }

  updateVRHeadset(headset: any): void {
    console.log(headset)
    // Update VRHeadset from vrHeadsetService (FromMongoDB)
    this.vrHeadsetService.updateVRHeadset(headset).subscribe(
      (response) => {
        console.log('Headset updated successfully', response);
        // Optionally, you can refresh the headset list or update the UI
        this.loadVRHeadsets();
      },
      (error) => {
        console.error('Error updating headset', error);
      }
    );
  }

  deleteVRHeadset(headset: vrInfo): void {
    console.log(headset);
    if (confirm(`Are you sure you want to delete the VR Headset: ${headset.name}?`)) {
      this.vrHeadsetService.deleteVRHeadset(headset._id!).subscribe(
        response => {
          console.log('VR Headset deleted:', response);
          // Remove the deleted headset from the list in the UI
          this.headsetsList = this.headsetsList.filter((h: { _id: string | undefined; }) => h._id !== headset._id);
        },
        error => {
          console.error('Error deleting VR Headset:', error);
        }
      );
    }
  }

  loadVRHeadsets(): void {
    // Get VRHeadsets from vrHeadsetService (FromMongoDB)
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
        this.newHeadset = { _id: '', ipAddress: '', port: '', name: '', status: 'offline', directingMode: false}; // Reset the form
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
