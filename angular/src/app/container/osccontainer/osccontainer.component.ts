import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { filter, map, Observable, switchMap, take, tap } from 'rxjs';

import { SseService } from 'src/app/services/sse-services/sse-services';
import { VRHeadsetService } from 'src/app/services/vrheadset-service.service';
import { vrHeadset } from 'src/vrHeadset';


@Component({
  selector: 'app-osccontainer',
  templateUrl: './osccontainer.component.html',
  styleUrls: ['./osccontainer.component.css']
})
export class OSCContainerComponent {

  @Input() current: any;
  title = 'angular-tour-of-heroes';
  random = 1;

  headsetsList$ =  this.vrHeadsetService.headsetsList$
  
  // Subscription to the SSE service, listening for incoming events
  data$ = this.sseService.events$.pipe(
    tap(receivedData => {
      this.headsetsList$.pipe(
        take(1), // Take the current value of the headsets list
        map(headsetsList => 
          headsetsList.find(headset => headset.ipAddress === receivedData.ipAddress)
        ),
        filter(headset => !!headset) // Ensure the headset is found
      ).subscribe(matchingHeadset => {
        if (matchingHeadset) {
          this.vrHeadsetService.updateVRHeadset({...matchingHeadset, status:"online"});
        }else{
          throw new Error("VRHeadsets not found with specific ID.")
        }
      });
    })
  );

  constructor(protected readonly sseService: SseService, private cdRef: ChangeDetectorRef, private vrHeadsetService: VRHeadsetService) {
  }

}
