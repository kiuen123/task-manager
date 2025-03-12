import { Component } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { systemData } from './systemData.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'FE';
  systemData: systemData | undefined;

  constructor(private wsService: WebSocketService) {}

  ngOnInit() {
    this.wsService.getSystemData().subscribe((data) => {
      this.systemData = data;
      console.log(this.systemData);
    });
  }
}
