import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function SkillGapChart({ skills }) {
  if (!skills || skills.length === 0) return null;

  // Aggregate by category
  const categories = [...new Set(skills.map(s => s.category))];
  
  const avgProficiency = categories.map(cat => {
    const catSkills = skills.filter(s => s.category === cat);
    return catSkills.reduce((acc, s) => acc + s.proficiency, 0) / catSkills.length;
  });

  const avgDemand = categories.map(cat => {
    const catSkills = skills.filter(s => s.category === cat);
    return catSkills.reduce((acc, s) => acc + s.demand_score, 0) / catSkills.length;
  });

  const data = {
    labels: categories,
    datasets: [
      {
        label: 'Your Proficiency',
        data: avgProficiency,
        backgroundColor: 'rgba(0, 240, 255, 0.2)',
        borderColor: 'rgba(0, 240, 255, 1)',
        borderWidth: 2,
      },
      {
        label: 'Market Demand',
        data: avgDemand,
        backgroundColor: 'rgba(176, 38, 255, 0.2)',
        borderColor: 'rgba(176, 38, 255, 1)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: { color: 'var(--text-main)', font: { size: 14 } },
        ticks: { display: false, min: 0, max: 100 }
      }
    },
    plugins: {
      legend: {
        labels: { color: 'var(--text-main)' }
      }
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h3 className="text-gradient" style={{ marginBottom: '1rem' }}>Category Gap Analysis</h3>
      <div style={{ width: '100%', maxWidth: '500px' }}>
        <Radar data={data} options={options} />
      </div>
    </div>
  );
}
