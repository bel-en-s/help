import { Pie, Bar, Bubble, Line } from 'react-chartjs-2';
import styles from '../../styles/ChartsPanel.module.css';
import 'chart.js/auto';

export default function Chart({ labels, inputData, chartType, title }) {
    let data = {
        labels: labels,
        datasets: [
            {
                data: inputData,
                label: title,
            },
        ],
    };
    
    return (
        <div className={styles.chart}>
            <h1>{title}</h1>
            {chartType == 'line' && <Line data={data} />}
            {chartType == 'bar' && <Bar data={data} />}
            {chartType == 'bubble' && <Bubble data={data} />}
            {chartType == 'pie' && <Pie data={data} />}
        </div>
    );
}