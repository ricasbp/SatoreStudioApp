import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {fromEvent, Observable, ReplaySubject, Subject} from 'rxjs';
import { customEventSource } from '../custom-event-source';

@Injectable({
  providedIn: 'root'
})
export class SseService {

  private eventsService= new ReplaySubject<any>(1);
  events$ = this.eventsService.asObservable();

  constructor() {
    // EventSource opens channel and starts listening for new incoming packages, and prints it with next:
    customEventSource("https://a6ab-95-94-97-38.ngrok-free.app/events")
    .subscribe({
      next: (data) => {
        console.log('Received data', data)
        this.eventsService.next(data)
      },
      
      error: (err) => console.error('Error occurred', err),
      complete: () => console.log('Stream completed'),
    }); //TO FIX: Not good practice. Should not have things inside subscribe
  }
} 