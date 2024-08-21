import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { SseService } from 'src/app/services/sse-services/sse-services';
import { tap } from 'rxjs';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent {

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
