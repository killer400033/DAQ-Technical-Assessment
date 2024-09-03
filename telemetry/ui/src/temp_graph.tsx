import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartData, ChartOptions, Plugin } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface TemperatureGraphProps {
  data: Array<{ timestamp: number; temperature: number }>;
}

const shadedAreasPlugin: Plugin<'line'> = {
  id: 'shadedAreas',
  beforeDraw(chart) {
    const ctx = chart.ctx;
    const { scales } = chart;
    const yScale = scales.y;

    const yMin = yScale.getPixelForValue(20);
    const yMax = yScale.getPixelForValue(80);
    const chartArea = chart.chartArea;

    const gradientBelow = ctx.createLinearGradient(0, yScale.getPixelForValue(0), 0, yMin);
    gradientBelow.addColorStop(0, 'rgba(255, 82, 82, 0.4)');
    gradientBelow.addColorStop(1, 'rgba(255, 82, 82, 0)');

    const gradientAbove = ctx.createLinearGradient(0, yMax, 0, yScale.getPixelForValue(100));
    gradientAbove.addColorStop(0, 'rgba(255, 82, 82, 0)');
    gradientAbove.addColorStop(1, 'rgba(255, 82, 82, 0.4)');

    ctx.save();

    ctx.fillStyle = gradientBelow;
    ctx.fillRect(
      chartArea.left,
      chartArea.bottom,
      chartArea.right - chartArea.left,
      yMin - chartArea.bottom
    );

    ctx.fillStyle = gradientAbove;
    ctx.fillRect(
      chartArea.left,
      chartArea.top,
      chartArea.right - chartArea.left,
      yMax - chartArea.top
    );

    ctx.restore();
  }
};

const TemperatureGraph: React.FC<TemperatureGraphProps> = ({ data }) => {
  const chartData = {
    labels: data.map((entry) => new Date(entry.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: "Battery Temperature (°C)",
        data: data.map((entry) => entry.temperature),
        fill: false,
        backgroundColor: "#ff5252",
        borderColor: "#ff5252",
        tension: 0,
      },
    ],
  };

  const options = {
    animation: {
      duration: 0,
    },
    aspectRatio: 3,
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "Temperature (°C)",
        },
        beginAtZero: true,
      },
    }
  };

  return <Line data={chartData} options={options} plugins={[shadedAreasPlugin]} />;
};

export default TemperatureGraph;
