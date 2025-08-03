import React, { useEffect, useRef } from 'react';

interface PlotlyChartProps {
  data: any;
  layout?: any;
  config?: any;
  className?: string;
}

const PlotlyChart: React.FC<PlotlyChartProps> = ({ 
  data, 
  layout = {}, 
  config = {}, 
  className = "w-full h-full" 
}) => {
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadPlotly = async () => {
      try {
        // Dynamically import Plotly to avoid SSR issues
        const Plotly = await import('plotly.js-dist-min');
        
        if (plotRef.current) {
          // Default config for responsive charts
          const defaultConfig = {
            responsive: true,
            displayModeBar: false,
            displaylogo: false,
            ...config
          };

          // Default layout for dark theme support
          const defaultLayout = {
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            font: {
              color: '#374151',
              size: 12
            },
            margin: {
              l: 50,
              r: 50,
              t: 50,
              b: 50
            },
            autosize: true,
            ...layout
          };

          // Create the plot
          await Plotly.newPlot(plotRef.current, data, defaultLayout, defaultConfig);
        }
      } catch (error) {
        console.error('Error loading Plotly:', error);
      }
    };

    if (data && plotRef.current) {
      loadPlotly();
    }

    // Cleanup function
    return () => {
      if (plotRef.current) {
        try {
          const Plotly = require('plotly.js-dist-min');
          Plotly.purge(plotRef.current);
        } catch (error) {
          // Plotly might not be loaded yet
        }
      }
    };
  }, [data, layout, config]);

  return (
    <div 
      ref={plotRef} 
      className={className}
      style={{ minHeight: '300px' }}
    />
  );
};

export default PlotlyChart;
