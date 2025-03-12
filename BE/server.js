const WebSocket = require("ws");
const si = require("systeminformation");

const http = require("http");
const httpPort = 3001;
const wss = new WebSocket.Server({ port: 3000 });

const getHardwareData = async () => {
    // system data
    const systemData = await si.system();
    const systemChassis = await si.chassis();
    const systemBaseboard = await si.baseboard();
    // cpu data
    const cpuData = await si.cpu();
    const cpuUsage = await si.currentLoad();
    const cpuTemp = await si.cpuTemperature();
    // gpu data
    const gpuData = await si.graphics();
    // ram data
    const memData = await si.mem();
    // network data
    const netData = await si.networkInterfaces();

    const showSYS = {
        systemName: systemData.manufacturer + '-' + systemData.model,
        systemBaseboard: systemBaseboard.manufacturer + " " + systemBaseboard.model,
        systemType: systemChassis.type + " " + systemChassis.model,
    }

    const showCPU = {
        cpuName: cpuData.brand,
        cpuUsage: cpuUsage.currentLoad.toFixed(2) + "%",
        cpuTemp: cpuTemp.main !== null ? cpuTemp.main.toFixed(1) + "°C" : "N/A"
    }

    const showGPU = [];
    let index = 0;
    gpuData.controllers.forEach(gpu => {
        showGPU.push({
            gpuName: gpu.model,
            gpuUsage: gpu.utilizationGpu !== undefined ? gpu.utilizationGpu.toFixed(2) + "%" : "N/A",
            gpuTemp: gpu.temperatureGpu !== undefined ? gpu.temperatureGpu.toFixed(1) + "°C" : "N/A"
        });
        index++;
    });

    const showRAM = {
        ramUsage: (memData.active / 1073741824).toFixed(2) + "GB", // Dung lượng RAM sử dụng
        ramTotal: (memData.total / 1073741824).toFixed(2) + "GB" // Tổng RAM
    };

    const showNET = [];
    if (Array.isArray(netData)) {
        netData.forEach(net => {
            showNET.push({
                interface: net.iface,
                type: net.type,
                mac: net.mac,
                default: net.internal ? "internal" : net.default ? "default" : net.virtual ? "virtual" : "",
                speed: net.speed !== null ? net.speed + " Mbps" : "N/A",
                ip4: net.ip4,
                ip6: net.ip6
            });
        });
    }

    const data = {
        SYS: showSYS,
        CPU: showCPU,
        GPU: showGPU,
        RAM: showRAM,
        NET: showNET,
    };
    return data;
}

// create json http response
const server = http.createServer(async (req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(await getHardwareData()));
});

server.listen(httpPort, () => {
    console.log("Server is running on port " + httpPort);
});

// Start WebSocket server
wss.on("connection", (ws) => {
    console.log("Client connected");

    const sendSystemInfo = async () => {
        try {
            const data = await getHardwareData();
            ws.send(JSON.stringify(data));
        } catch (error) {
            console.error("Lỗi gửi dữ liệu:", error.message);
        }
    };

    const interval = setInterval(sendSystemInfo, 1000); // Gửi dữ liệu mỗi 2 giây

    ws.on("close", () => {
        console.log("Client disconnected");
        clearInterval(interval);
    });
});

console.log("WebSocket Server running on ws://localhost:3000");
