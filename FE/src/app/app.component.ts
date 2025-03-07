import { Component } from '@angular/core';
import { WebSocketService } from './websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'FE';
  systemData: any;

  constructor(private wsService: WebSocketService) {}

  ngOnInit() {
    this.wsService.getSystemData().subscribe((data) => {
      this.systemData = data;
    });
  }
}
