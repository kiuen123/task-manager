const axios = require("axios");

async function getHardwareDataWin() {
    try {
        const response = await axios.get("http://localhost:8085/data.json");

        if (!response.data || !response.data.Children) {
            console.error("Lỗi: API không trả về dữ liệu hợp lệ!");
            return { cpuTemp: "N/A", gpuTemp: "N/A", gpuUsage: "N/A", ramUsage: "N/A", totalRam: "N/A" };
        }

        let cpuTemp = "N/A";
        let gpuTemp = "N/A";
        let gpuUsage = "N/A";

        function findSensor(node) {
            if (!node.Children) return;

            for (const child of node.Children) {
                // Tìm nhiệt độ CPU
                if (child.Text === "Temperatures") {
                    const cpuPackageTemp = child.Children.find(s => s.Text === "CPU Package");
                    if (cpuPackageTemp) cpuTemp = cpuPackageTemp.Value.replace("°C", "").trim();
                }

                // Tìm nhiệt độ GPU
                if (child.Text === "Temperatures") {
                    const gpuCoreTemp = child.Children.find(s => s.Text === "GPU Core");
                    if (gpuCoreTemp) gpuTemp = gpuCoreTemp.Value.replace("°C", "").trim();
                }

                // Tìm % sử dụng GPU
                if (child.Text === "Load") {
                    const gpuCoreLoad = child.Children.find(s => s.Text === "GPU Core");
                    if (gpuCoreLoad) gpuUsage = gpuCoreLoad.Value.replace("%", "").trim();
                }

                findSensor(child); // Đệ quy để kiểm tra cấp con
            }
        }

        findSensor(response.data); // Bắt đầu tìm kiếm

        return { cpuTemp, gpuTemp, gpuUsage };
    } catch (error) {
        console.error("Lỗi lấy dữ liệu từ Open Hardware Monitor:", error.message);
        return { cpuTemp: "N/A", gpuTemp: "N/A", gpuUsage: "N/A", ramUsage: "N/A", totalRam: "N/A" };
    }
}

module.exports = getHardwareDataWin;
