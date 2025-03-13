interface SYS {
  systemName: string;
  systemBaseboard: string;
  systemType: string;
}

interface CPU {
  cpuName: string;
  cpuUsage: string;
  cpuTemp: string;
}

interface GPU {
  gpuName: string;
  gpuUsage: string;
  gpuTemp: string;
  gpuMemoryTotal: string;
  gpuMemoryUsed: string;
}

interface RAM {
  ramUsage: string;
  ramTotal: string;
}

interface NET {
  interface: string;  
  type: string;
  mac: string;
  default: string;
  speed: string;
  ip4: string;
  ip6: string;
}

export interface systemData {
  SYS: SYS;
  CPU: CPU;
  GPU: GPU[];
  RAM: RAM;
  NET: NET[];
}
