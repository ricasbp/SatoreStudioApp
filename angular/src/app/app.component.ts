import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SseService } from 'src/app/services/sse-services/sse-services';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { LocalStorageService } from './services/local-storage.service';

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

  constructor(protected readonly sseService: SseService, private cdRef: ChangeDetectorRef, private router: Router, private localStorageService: LocalStorageService) {
    
    // Step 1: Check if localStorage has an IP address stored
  const storedIP = this.localStorageService.getItem('expressIP'); // Use appropriate method from your service

  // Step 2: If not stored, prompt the user for an IP and store it in localStorage
  if (!storedIP) {
    const userInput = prompt("Please enter the IP address of the BackEnd.") || 'NoIPInserted';
    this.localStorageService.setItem('expressIP', userInput); // Store the new IP in localStorage
    this.userInputExpressIP = userInput;
  } else {
    // Use the stored IP
    this.userInputExpressIP = storedIP;
  }
  }
  
  ngOnInit(): void {


  }

}


