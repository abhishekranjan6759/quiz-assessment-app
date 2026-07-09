import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import Celebration from '../components/Celebration';
import { spiritAnimalProfiles } from '../data/questions';

function SpiritAnimalResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers, userName } = location.state;
  const [openDialog, setOpenDialog] = useState(false);

  // Count votes per animal
  const animalCounts = {};
  answers.forEach((animal) => {
    animalCounts[animal] = (animalCounts[animal] || 0) + 1;
  });

  // Sort by count and get top animal
  const sorted = Object.entries(animalCounts).sort((a, b) => b[1] - a[1]);
  const topAnimal = sorted[0][0];
  const profile = spiritAnimalProfiles[topAnimal];

  // Get secondary animal if exists
  const secondaryAnimal = sorted.length > 1 ? sorted[1] : null;
  const secondaryProfile = secondaryAnimal ? spiritAnimalProfiles[secondaryAnimal[0]] : null;

  const handleReturnHome = () => setOpenDialog(true);
  const handleConfirmReturn = () => { setOpenDialog(false); navigate('/'); };
  const handleCancelReturn = () => setOpenDialog(false);

  return (
    <div className="app-container">
      <div className="results-container">
        <Celebration />
        <h1 className="results-title">Your Spirit Animal</h1>
        <div className="results-divider"></div>

        {/* Main Result Card */}
        <div style={{
          maxWidth: '900px',
          width: '100%',
          background: 'white',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          marginBottom: '24px'
        }}>
          {/* Animal Image */}
          <div style={{ width: '100%', height: '250px', overflow: 'hidden', position: 'relative' }}>
            <img
              src={profile.image}
              alt={profile.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
              padding: '30px 30px 20px',
              color: 'white'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '4px' }}>{profile.emoji}</div>
              <h2 style={{ fontSize: '28px', fontFamily: 'Montserrat', fontWeight: 800, margin: 0 }}>
                {userName ? `${userName}, you are ` : 'You are '}{profile.name}!
              </h2>
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: '30px' }}>
            {/* Traits */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {profile.traits.map((trait) => (
                <span key={trait} style={{
                  background: '#EEF2FF',
                  color: '#0B2A5B',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  fontFamily: 'Montserrat'
                }}>
                  {trait}
                </span>
              ))}
            </div>

            {/* Description */}
            <p style={{ color: '#333', fontSize: '16px', lineHeight: '1.8', marginBottom: '20px' }}>
              {profile.description}
            </p>

            {/* Strengths & Growth */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{
                flex: 1,
                minWidth: '200px',
                background: '#F0FFF4',
                borderRadius: '12px',
                padding: '16px',
                borderLeft: '4px solid #34A853'
              }}>
                <h4 style={{ color: '#34A853', fontSize: '14px', marginBottom: '6px', fontFamily: 'Montserrat' }}>
                  Your Strengths
                </h4>
                <p style={{ color: '#333', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
                  {profile.strengths}
                </p>
              </div>
              <div style={{
                flex: 1,
                minWidth: '200px',
                background: '#FFF8E1',
                borderRadius: '12px',
                padding: '16px',
                borderLeft: '4px solid #FF6B00'
              }}>
                <h4 style={{ color: '#FF6B00', fontSize: '14px', marginBottom: '6px', fontFamily: 'Montserrat' }}>
                  Growth Area
                </h4>
                <p style={{ color: '#333', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
                  {profile.growthArea}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Animal */}
        {secondaryProfile && (
          <div style={{
            maxWidth: '900px',
            width: '100%',
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <div style={{ fontSize: '40px' }}>{secondaryProfile.emoji}</div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <h4 style={{ color: '#0B2A5B', fontFamily: 'Montserrat', margin: '0 0 4px' }}>
                Your Secondary Animal: {secondaryProfile.name}
              </h4>
              <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                You also share strong traits with {secondaryProfile.name.toLowerCase()} — {secondaryProfile.traits.slice(0, 3).join(', ').toLowerCase()}.
              </p>
            </div>
            <div style={{
              background: '#EEF2FF',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#0B2A5B'
            }}>
              {secondaryAnimal[1]}/{answers.length} answers
            </div>
          </div>
        )}

        {/* All Results Breakdown */}
        <div style={{
          maxWidth: '900px',
          width: '100%',
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          marginBottom: '24px'
        }}>
          <h4 style={{ color: '#0B2A5B', fontFamily: 'Montserrat', marginBottom: '16px' }}>Your Animal Breakdown</h4>
          {sorted.map(([animal, count]) => {
            const pct = (count / answers.length) * 100;
            const p = spiritAnimalProfiles[animal];
            return (
              <div key={animal} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>{p.emoji} {p.name}</span>
                  <span style={{ fontSize: '14px', color: '#666' }}>{pct.toFixed(0)}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#e0e0e0', borderRadius: '4px' }}>
                  <div style={{
                    width: `${pct}%`,
                    height: '100%',
                    background: animal === topAnimal ? '#0B2A5B' : '#1E5EFF',
                    borderRadius: '4px'
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', padding: '0 12px' }}>
          <button className="download-button" onClick={handleReturnHome}>
            Return to Home
          </button>
        </div>

        <Dialog open={openDialog} onClose={handleCancelReturn}
          PaperProps={{ style: { borderRadius: '20px', padding: '10px' } }}>
          <DialogTitle style={{ color: '#0B2A5B', fontWeight: 600 }}>Return to Home Page?</DialogTitle>
          <DialogContent>
            <p style={{ color: '#333', fontSize: '16px', lineHeight: '1.6' }}>
              Are you sure you want to leave? Make sure you've saved your results.
            </p>
          </DialogContent>
          <DialogActions style={{ padding: '20px' }}>
            <Button onClick={handleCancelReturn} variant="outlined"
              style={{ borderColor: '#0B2A5B', color: '#0B2A5B', borderRadius: '20px', padding: '8px 24px', fontWeight: 600 }}>Cancel</Button>
            <Button onClick={handleConfirmReturn} variant="contained" autoFocus
              style={{ backgroundColor: '#0B2A5B', borderRadius: '20px', padding: '8px 24px', fontWeight: 600 }}>Yes, Return Home</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default SpiritAnimalResults;
