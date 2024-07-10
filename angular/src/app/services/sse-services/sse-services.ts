import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {fromEvent, Observable, ReplaySubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SseService {

  private eventsService= new ReplaySubject<any>(1);
  events$ = this.eventsService.asObservable();

  constructor() {
    const sse = new EventSource("http://localhost:3000/events");
    sse.addEventListener('message', (event: MessageEvent) => {
      this.eventsService.next(JSON.parse(event.data));
    });
  }
}