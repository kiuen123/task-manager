import { Component } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { systemData } from './systemData.interface';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'FE';
  systemData: systemData | undefined;

  constructor(
    private wsService: WebSocketService,
    private httpService: HttpClient
  ) {}

  ngOnInit() {
    this.getHardwareData();
  }

  getHardwareData() {
    this.httpService
      .get('http://localhost:3001/HardwareData')
      .subscribe((data: any) => {
        console.log(data);

        this.systemData = JSON.parse(data);
        // this.getRealTimeData();
      });
  }

  getRealTimeData() {
    this.wsService.getSystemData().subscribe((data) => {
      if (this.systemData) {
        this.systemData.CPU.cpuTemp = data.CPU.cpuTemp;
        this.systemData.CPU.cpuUsage = data.CPU.cpuUsage;

        for (let i = 0; i < this.systemData.GPU.length; i++) {
          if (this.systemData.GPU[i].gpuName == data.GPU[i].gpuName) {
            this.systemData.GPU[i].gpuTemp = data.GPU[i].gpuTemp;
            this.systemData.GPU[i].gpuUsage = data.GPU[i].gpuUsage;
          }
        }

        this.systemData.RAM.ramUsage = data.RAM.ramUsage;
      }
    });
  }
}
