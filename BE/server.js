const WebSocket = require("ws");
const si = require("systeminformation");
const getHardwareDataWin = require("./getHardwareDataWin");

const wss = new WebSocket.Server({ port: 3000 });

wss.on("connection", (ws) => {
    console.log("Client connected");

    const sendSystemInfo = async () => {
        try {
            const cpuName = await si.cpu();
            const gpuName = await si.graphics();
            const cpuUsage = await si.currentLoad();
            const mem = await si.mem();
            const { cpuTemp, gpuTemp, gpuUsage } = await getHardwareDataWin();

            const data = {
                cpuName: cpuName.brand,
                cpuUsage: cpuUsage.currentLoad.toFixed(2) + "%",
                cpuTemp: cpuTemp !== "N/A" ? `${cpuTemp}°C` : "N/A",
                ramUsage: (mem.active / 1073741824).toFixed(2) + "GB", // Dung lượng RAM sử dụng
                totalRam: (mem.total / 1073741824).toFixed(2) + " GB", // Tổng RAM
                gpuName: gpuName.controllers[1].model,
                gpuUsage: gpuUsage !== "N/A" ? `${gpuUsage}%` : "N/A",
                gpuTemp: gpuTemp !== "N/A" ? `${gpuTemp}°C` : "N/A"
            };

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
