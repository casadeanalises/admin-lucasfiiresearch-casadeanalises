'use client';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { formatCurrency } from '@/app/_utils/currency';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartData {
  labels: string[];
  values: number[];
  colors: string[];
}

interface PieChartProps {
  data: PieChartData;
  title?: string;
  showValues?: boolean;
  isDarkMode?: boolean;
  className?: string;
}

export function PieChart({ 
  data, 
  title, 
  showValues = true, 
  isDarkMode = false,
  className = ""
}: PieChartProps) {
  const totalValue = data.values.reduce((sum, value) => sum + value, 0);

  const chartData: ChartData<'doughnut'> = {
    labels: data.labels,
    datasets: [
      {
        data: data.values,
        backgroundColor: data.colors,
        borderColor: isDarkMode ? '#1f2937' : '#ffffff',
        borderWidth: 2,
        hoverOffset: 10,
        hoverBorderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
        hoverBorderWidth: 3,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        right: 20,
      },
    },
    plugins: {
              legend: {
          position: 'right' as const,
          labels: {
            color: isDarkMode ? '#ffffff' : '#374151',
            font: {
              size: 10,
            },
            padding: 15,
            usePointStyle: true,
            pointStyle: 'circle',
          },
        },
      tooltip: {
        enabled: true,
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        titleColor: isDarkMode ? '#ffffff' : '#374151',
        bodyColor: isDarkMode ? '#d1d5db' : '#6b7280',
        borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 12,
        },
        callbacks: {
          label: (context) => {
            const value = context.parsed;
            const percentage = ((value / totalValue) * 100).toFixed(1);
            return `${context.label}: ${showValues ? formatCurrency(value) : '••••'} (${percentage}%)`;
          },
        },
      },
    },
    cutout: '60%',
  };

  return (
    <Card className={`${className} ${isDarkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
      {title && (
        <CardHeader className={isDarkMode ? 'border-gray-700' : ''}>
          <CardTitle className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={isDarkMode ? 'bg-gray-800' : ''}>
        <div className="relative h-60 sm:h-80">
          <Doughnut 
            data={chartData} 
            options={options}
            style={{ cursor: 'pointer' }}
          />
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 pointer-events-none">
            <div className="text-right">
              <div className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Total
              </div>
              <div className={`text-sm sm:text-base md:text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {showValues ? formatCurrency(totalValue) : '••••'}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
