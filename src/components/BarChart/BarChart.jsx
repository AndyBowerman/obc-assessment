import { Bar } from "react-chartjs-2";
import "./BarChart.scss";

const BarChart = ({ data, options }) => {
  return (
    <div className="bar-chart">
      <Bar options={options} data={data} />
    </div>
  );
};

export default BarChart;
