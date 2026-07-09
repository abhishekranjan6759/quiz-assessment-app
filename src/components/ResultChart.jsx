import React, { useRef, useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toPng } from 'html-to-image';

const COLORS = ['#1E5EFF', '#34A853', '#FF6B00', '#6A3DE8'];

function ResultChart({ data, userName, quizType, onReturnHome }) {
  const chartRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    if (isMobile) return `${percentage.toFixed(0)}%`;
    return `${name}: ${percentage.toFixed(1)}%`;
  };

  return (
    <>
      <div className="chart-container" ref={chartRef}>
        <ResponsiveContainer width="100%" height={isMobile ? 300 : 500}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={isMobile ? 90 : 150}
              fill="#8884d8"
              dataKey="percentage"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
            <Legend 
              wrapperStyle={isMobile ? { fontSize: '12px' } : {}}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', padding: '0 12px' }}>
        <button className="download-button" onClick={handleDownload}>
          Download as Image
        </button>
        <button 
          className="download-button" 
          style={{ background: '#0B2A5B', color: 'white' }}
          onClick={onReturnHome}
        >
          Return to Home
        </button>
      </div>
    </>
  );
}

export default ResultChart;