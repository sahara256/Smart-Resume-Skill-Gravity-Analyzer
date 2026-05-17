import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Upload, Zap, FileText } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/dashboard', { state: { resumeData: response.data.data } });
    } catch (err) {
      console.error(err);
      setError('Failed to process resume. Ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoMode = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:5000/api/demo');
      navigate('/dashboard', { state: { resumeData: response.data.data } });
    } catch (err) {
      console.error(err);
      setError('Failed to fetch demo data. Ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div className="glass-panel" style={{ padding: '4rem 3rem', maxWidth: '800px', width: '100%' }}>
        <h1 className="text-gradient" style={{ fontSize: '3.5rem', marginBottom: '1rem', lineHeight: '1.2' }}>
          Transform Your Resume Into an Interactive Skill Universe
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>
          Upload your resume and let AI visualize your strengths, missing skills, and career opportunities.
        </p>

        {error && <p style={{ color: 'var(--neon-orange)', marginBottom: '1rem' }}>{error}</p>}

        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <label className="glass-button" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
            {loading ? <Zap className="animate-spin" /> : <Upload />}
            {loading ? 'Processing...' : 'Upload Resume (PDF)'}
            <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={handleFileUpload} disabled={loading} />
          </label>

          <button onClick={handleDemoMode} className="glass-button secondary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
            <FileText />
            Try Demo Resume
          </button>
        </div>
      </div>
    </div>
  );
}
