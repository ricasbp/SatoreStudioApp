import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {fromEvent, Observable, ReplaySubject, Subject} from 'rxjs';
import { customEventSource } from '../custom-event-source';


import { LocalStorageService } from './../local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class SseService {

  private eventsService= new ReplaySubject<any>(1);
  events$ = this.eventsService.asObservable();

  expressUrl = "";

  constructor(private localStorageService: LocalStorageService) {
    this.setExpressUrl(localStorageService);
    this.setEventSource();
  }

  private setExpressUrl(localStorageService: LocalStorageService){
    this.expressUrl = this.localStorageService.getItem('expressIP') ?? "NoIp";  // Use the nullish coalescing operator (??) to provide a fallback in case of null
    if (this.expressUrl === "NoIp") {
      console.error('No IP Received from LocalStorage');
    }
    // console.log("Sse-Services connected to backend at: " + this.expressUrl);
  }

  private setEventSource(){
    // EventSource opens channel and starts listening for new incoming OSC packages, and prints it with next:
    customEventSource(`${this.expressUrl}/events`)
    .subscribe({
      next: (data) => {
        // console.log('Sse-Services received data', data)
        this.eventsService.next(data)
      },
      
      error: (err) => console.error('Error occurred', err),
      complete: () => console.log('Stream completed'),
    }); //TO FIX: Not good practice. Should not have things inside subscribe
  }
} 

