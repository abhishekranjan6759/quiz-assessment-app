import { useEffect } from 'react';
import confetti from 'canvas-confetti';

function Celebration() {
  useEffect(() => {
    // First burst - center explosion
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#1E5EFF', '#34A853', '#FF6B00', '#FFC107', '#6A3DE8'],
    });

    // Second burst - left side sparkles
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ['#FFC107', '#FF6B00', '#1E5EFF'],
      });
    }, 200);

    // Third burst - right side sparkles
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ['#34A853', '#6A3DE8', '#FFC107'],
      });
    }, 400);

    // Stars/sparkles effect
    setTimeout(() => {
      confetti({
        particleCount: 30,
        spread: 100,
        origin: { y: 0.4 },
        shapes: ['star'],
        colors: ['#FFC107', '#FF6B00'],
        scalar: 1.2,
      });
    }, 600);
  }, []);

  return null;
}

export default Celebration;
