import React, { useRef } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toPng } from 'html-to-image';

const COLORS = ['#4FC3F7', '#66BB6A', '#FFA726', '#EF5350'];

function ResultChart({ data, userName, quizType, onReturnHome }) {
  const chartRef = useRef(null);

  const handleDownload = () => {
    if (chartRef.current === null) {
      return;
    }

    toPng(chartRef.current, { 
      cacheBust: true,
      backgroundColor: '#ffffff'
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        const filename = userName 
          ? `${userName.replace(/\s+/g, '_')}_${quizType}_results.png`
          : `${quizType}_results.png`;
        link.download = filename;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Failed to download image', err);
      });
  };

  const renderCustomLabel = ({ name, percentage }) => {
    if (percentage === 0) return null;
    return `${name}: ${percentage.toFixed(1)}%`;
  };

  return (
    <>
      <div className="chart-container" ref={chartRef}>
        <ResponsiveContainer width="100%" height={500}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={150}
              fill="#8884d8"
              dataKey="percentage"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="download-button" onClick={handleDownload}>
          Download as Image
        </button>
        <button 
          className="download-button" 
          style={{ background: '#1565C0', color: 'white' }}
          onClick={onReturnHome}
        >
          Return to Home
        </button>
      </div>
    </>
  );
}

export default ResultChart;