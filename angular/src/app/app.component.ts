import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SseService } from 'src/app/services/sse-services/sse-services';
import { tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SatoreGUI';

  imagePathLogo: string = 'assets/images/SatoreStudio.png';

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

}


