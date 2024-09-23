import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {fromEvent, Observable, ReplaySubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SseService {

  private eventsService= new ReplaySubject<any>(1);
  events$ = this.eventsService.asObservable();

  constructor() {
    const headers = {
      headers: {
        "ngrok-skip-browser-warning": "69420",
      },
    }
    const sse = new EventSource("https://d376-95-94-97-38.ngrok-free.app/events");
    sse.addEventListener('message', (event: MessageEvent) => {
      this.eventsService.next(JSON.parse(event.data));
    });
  }
} 