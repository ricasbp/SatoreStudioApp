import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SseService } from 'src/app/services/sse-services/sse-services';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SatoreGUI';

  imagePathLogo: string = 'assets/images/SatoreStudio.png';

  userInputExpressIP: string;

  //Refresh the DOM if receives value from event
  data$ = this.sseService.events$.pipe(
    tap((value) => {
      console.log(value);
      this.cdRef.detectChanges();
  }))

  constructor(protected readonly sseService: SseService, private cdRef: ChangeDetectorRef, private router: Router) {
    
    // Use prompt to get user input
    this.userInputExpressIP = prompt("Please enter the IP address of the BackEnd.") || 'DefaultIP';   
    
    
    // Display the input in the console
    console.log("IP adress of the BackEnd by the user:", this.userInputExpressIP);

    this.router.navigate([`/operator-mode`, this.userInputExpressIP]);
  }
  
  ngOnInit(): void {


  }

}


