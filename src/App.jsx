import "./App.scss";
import dataImport from "./data.csv";
import Papa from "papaparse";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import BarChart from "./components/BarChart/BarChart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [data, setData] = useState({ labels: "", datasets: [] });
  const [options, setOptions] = useState({});

  useEffect(() => {
    Papa.parse(dataImport, {
      download: true,
      header: true,
      dynamicTyping: true,
      delimiter: "",
      complete: (result) => {
        setData({
          labels: result.data
            .sort((a, b) => a.POSITION_YARDS - b.POSITION_YARDS)
            .map((position) => [position["POSITION_YARDS"]])
            .filter(Number),
          datasets: [
            {
              label: "Temperature Exceedence Score",
              data: result.data.map((item) => [item["SCORE"]]),
              backgroundColor: result.data.map((item) => {
                if (item.SCORE > 70) {
                  return "red";
                } else if (item.SCORE > 65) {
                  return "orange";
                } else {
                  return "green";
                }
              }),
            },
          ],
        });
        setOptions({
          responsive: true,
          events: ["click"],
          scales: {
            y: {
              suggestedMax: 90,
              min: 30,
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                beforeTitle: function (context) {
                  return "Track Position (Yards):";
                },
                afterTitle: function (context) {
                  return `Reading Date: ${convertUnixTime(
                    result.data[context[0].dataIndex].UNIX_TIME
                  )}`;
                },
                beforeFooter: function (context) {
                  return `Latitude: ${
                    result.data[context[0].dataIndex].LATITUDE
                  }`;
                },
                footer: function (context) {
                  return `Longitude: ${
                    result.data[context[0].dataIndex].LONGITUDE
                  }`;
                },
                afterFooter: function (context) {
                  return `ID: ${
                    result.data[context[0].dataIndex].RECORDING_ID
                  }`;
                },
              },
            },
            legend: {
              display: false,
            },
          },
        });
      },
    });
  }, []);

  const convertUnixTime = (time) => new Date(time * 1000);

  return (
    <div className="app">
      <h1 className="app__header">Temperature Exceedence</h1>
      <p className="app__instruction">Select a position for full information</p>
      {data.datasets.length > 0 ? (
        <BarChart data={data} options={options} />
      ) : (
        <h3>Loading...</h3>
      )}
    </div>
  );
}

export default App;
