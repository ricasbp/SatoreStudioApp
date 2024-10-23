import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';

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

  vrHeadsetsFromService: Observable<vrHeadset[]> = this.vrHeadsetService.headsetsList$
  
  // Subscription to the SSE service, listening for incoming events
  data$ = this.sseService.events$.pipe(
    switchMap((receivedData) => { // Michael Bug Fix: Swapped tap with switchMap 
      console.log("OscContainter received data", receivedData);

      // Get the vrHeadsetsFromService observable (assuming it's an observable) and map over it
      return this.vrHeadsetsFromService.pipe(
        tap((headsets: vrHeadset[]) => {

          // Find the VR headset by IP address
          // Const is better approach vs let, Since const its immutable.
          const headset: vrHeadset | undefined = headsets.find(h => h.ipAddress === receivedData.ipAddress);
          console.log("Found in the MongoDB VRHeadset with IP = " + headset?.ipAddress);
          

          // TO_FIX: Should use a builder for this headset. 
          // https://refactoring.guru/design-patterns/builder/typescript/example
          if (headset) {
            if (receivedData.status === 'online') {
              return this.vrHeadsetService.updateVRHeadset({...headset,status: "online"});   
            } else if (receivedData.status === 'ready') {
              return this.vrHeadsetService.updateVRHeadset({...headset,status: "experience running"});
            }
            return this.vrHeadsetService.updateVRHeadset({...headset,status: "error"});
          }else{
            throw new Error("No headset found");
          }


        })
      ) // .subscribe();  Michael Bug Fix: This was incorrect. Doesn't make sense two subscribes.
    })
  );

  constructor(protected readonly sseService: SseService, private cdRef: ChangeDetectorRef, private vrHeadsetService: VRHeadsetService) {
  }

  
  ngOnInit(): void {
  }
}
