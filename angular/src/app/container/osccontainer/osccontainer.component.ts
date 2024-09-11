import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { tap } from 'rxjs';

import { SseService } from 'src/app/services/sse-services/sse-services';


@Component({
  selector: 'app-osccontainer',
  templateUrl: './osccontainer.component.html',
  styleUrls: ['./osccontainer.component.css']
})
export class OSCContainerComponent {

  @Input() current: any;
  title = 'angular-tour-of-heroes';
  random = 1;
  
  // Refresh the DOM if receives value from event.
  // Build Here VR Connection Logic.
  data$ = this.sseService.events$.pipe(
    tap((value) => {
      console.log(value);
      this.cdRef.detectChanges();
  }))

  constructor(protected readonly sseService: SseService, private cdRef: ChangeDetectorRef) {
  }
  
  ngOnInit(): void {
  }
}
