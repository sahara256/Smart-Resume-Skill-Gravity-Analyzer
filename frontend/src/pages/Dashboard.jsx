import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GravitySkills from '../components/GravitySkills';
import SkillGapChart from '../components/SkillGapChart';
import { ArrowLeft, Target, Award, Briefcase, Download } from 'lucide-react';

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const resumeData = location.state?.resumeData;

  if (!resumeData) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <h2>No Data Found</h2>
        <button onClick={() => navigate('/')} className="glass-button" style={{ marginTop: '1rem' }}>Go Back</button>
      </div>
    );
  }

  const handleDownload = () => {
    alert("Downloading report..."); // Mock download
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', minHeight: '100vh' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <button onClick={() => navigate('/')} className="glass-button secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={18} /> Back
        </button>
        <h1 className="text-gradient">AI Resume Analysis</h1>
        <button onClick={handleDownload} className="glass-button" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Download size={18} /> Report
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Award size={40} color="var(--neon-blue)" />
          <div>
            <h3 style={{ color: 'var(--text-muted)' }}>Resume Score</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--neon-blue)' }}>{resumeData.score}/100</p>
          </div>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Target size={40} color="var(--neon-purple)" />
          <div>
            <h3 style={{ color: 'var(--text-muted)' }}>ATS Match</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--neon-purple)' }}>{resumeData.ats_score}%</p>
          </div>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Briefcase size={40} color="var(--neon-cyan)" />
          <div>
            <h3 style={{ color: 'var(--text-muted)' }}>Top Roles</h3>
            <p style={{ fontWeight: '500', color: 'var(--neon-cyan)', marginTop: '0.5rem' }}>Full Stack Engineer, Cloud Architect</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', lg: { gridTemplateColumns: '2fr 1fr' }, gap: '2rem' }}>
        
        {/* Main AntiGravity Visualization */}
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <h2 style={{ marginBottom: '1rem', paddingLeft: '1rem' }} className="text-gradient">Skill Universe</h2>
          <GravitySkills skills={resumeData.skills} />
        </div>

        {/* Charts and Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <SkillGapChart skills={resumeData.skills} />
          
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 className="text-gradient" style={{ marginBottom: '1rem' }}>Improvement Roadmap</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ padding: '1rem', background: 'rgba(255,115,0,0.1)', borderLeft: '4px solid var(--neon-orange)', borderRadius: '4px' }}>
                <strong>Cloud Services (AWS)</strong> - Your current score is low compared to market demand.
              </li>
              <li style={{ padding: '1rem', background: 'rgba(57,255,20,0.1)', borderLeft: '4px solid var(--neon-green)', borderRadius: '4px' }}>
                <strong>System Design</strong> - High demand in Senior roles, consider building larger projects.
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
