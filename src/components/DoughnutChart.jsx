import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ labels, dataArray, label, backgrounds }) => {
  const backgroundColor = [
    "rgba(236, 6, 6, 0.8)",
    "rgba(225, 237, 0, 0.8)",
    "rgba(0, 237, 22, 0.8)",
  ];
  const plugins = [
    {
      id: "centerTextLine",
      beforeDatasetsDraw: function (chart) {
          const { ctx } = chart;
          const xCenter = chart.getDatasetMeta(0).data[0].x;
          const yCenter = chart.getDatasetMeta(0).data[0].y + 15;
          ctx.save();

          ctx.font = `bold 26px sans-serif`;
          ctx.fillStyle = "black";
          ctx.textAlign = "center";
          ctx.fillText(chart.getDatasetMeta(0).total, xCenter, yCenter - 30);

          ctx.font = `16px sans-serif`;
          ctx.fillStyle = "black";
          ctx.textAlign = "center";
          ctx.fillText(label, xCenter, yCenter);
      },
    },
  ];
  const data = {
    labels: labels,
    datasets: [
      {
        label: label,
        data: dataArray,
        backgroundColor: backgrounds ||backgroundColor,
        borderColor: "rgba(255, 255, 255, 0.8)",
        borderWidth: 2,
        cutout: "60%",
      },
    ],
  };
  return <Doughnut data={data} plugins={plugins} />;
};

export default DoughnutChart;
