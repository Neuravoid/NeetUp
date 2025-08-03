import React from 'react';
import Plot from 'react-plotly.js';

interface ActivityHeatmapChartProps {
  chartData: any;
}

const ActivityHeatmapChart: React.FC<ActivityHeatmapChartProps> = ({ chartData }) => {
  if (!chartData) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">🗓️</div>
          <p className="text-gray-500 dark:text-gray-400">Aktivite haritası yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Plot
        data={chartData.data}
        layout={{
          ...chartData.layout,
          autosize: true,
          responsive: true,
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          font: {
            color: '#374151' // gray-700
          }
        }}
        config={{
          displayModeBar: false,
          responsive: true
        }}
        style={{ width: '100%', height: '300px' }}
        useResizeHandler={true}
      />
    </div>
  );
};

export default ActivityHeatmapChart;
