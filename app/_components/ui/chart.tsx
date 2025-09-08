'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartData,
  ChartOptions,
  ArcElement,
  RadialLinearScale
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  RadialLinearScale
);

interface ChartProps<T extends 'line' | 'bar' | 'doughnut'> {
  type: T;
  data: ChartData<T>;
  options: ChartOptions<T>;
}

export default function Chart<T extends 'line' | 'bar' | 'doughnut'>({ type, data, options }: ChartProps<T>) {
  if (type === 'line') {
    return <Line data={data as ChartData<'line'>} options={options as ChartOptions<'line'>} />;
  } else if (type === 'bar') {
    return <Bar data={data as ChartData<'bar'>} options={options as ChartOptions<'bar'>} />;
  } else if (type === 'doughnut') {
    return <Doughnut data={data as ChartData<'doughnut'>} options={options as ChartOptions<'doughnut'>} />;
  }
  return null;
}
