import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: WebSocket;
  private subject: Subject<any> = new Subject<any>();
  private ip: string = 'localhost'; // Thay bằng IP máy đích

  constructor() {
    this.socket = new WebSocket(`ws://${this.ip}:3000`);

    this.socket.onmessage = (event) => {
      this.subject.next(JSON.parse(event.data));
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };
  }

  getSystemData(): Observable<any> {
    return this.subject.asObservable();
  }
}
