import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const passages = {
  '1min': {
    label: '1 Minute',
    wpm: 250,
    text: `The human brain is the most complex organ in the known universe. It contains approximately eighty six billion neurons, each forming thousands of connections with other neurons. This intricate network allows us to think, feel, remember, and create. Every experience we have physically changes the structure of our brain through a process called neuroplasticity. When we learn something new, neurons form fresh connections, strengthening pathways that are used frequently and weakening those that are not. This is why consistent practice is so powerful. The more we repeat a skill or revisit information, the stronger those neural pathways become. Sleep plays a crucial role in this process, as the brain consolidates memories and clears metabolic waste during rest. Without adequate sleep, our ability to learn and retain information drops dramatically. Exercise also benefits the brain by increasing blood flow and promoting the release of growth factors that support new neural connections. Understanding how our brain works gives us the power to optimize our learning and unlock our full potential.`,
  },
  '2min': {
    label: '2 Minutes',
    wpm: 250,
    text: `Reading is one of the most transformative skills a human being can develop. It opens doors to knowledge, empathy, creativity, and critical thinking. Yet many people read far below their potential speed, often because of habits formed in childhood that were never updated. The average adult reads at approximately two hundred to two hundred fifty words per minute, but with deliberate practice, this can be increased significantly without sacrificing comprehension. Speed reading is not about rushing through text carelessly. It is about training your eyes and brain to process information more efficiently. One of the biggest barriers to faster reading is subvocalization, the habit of silently pronouncing every word in your head as you read. While some internal voice is natural, excessive subvocalization slows you down because your reading speed becomes limited to your speaking speed. Another barrier is regression, the tendency to re-read sentences or paragraphs. This often happens when attention wanders, and the solution is not to go back but to train focus so that comprehension happens on the first pass. Your eyes do not move smoothly across a line of text. Instead, they make small jumps called saccades, landing on groups of words called fixation points. Untrained readers fixate on every single word, but skilled readers learn to take in groups of three to five words per fixation. This is where rapid eye movement training becomes valuable. By practicing moving your eyes rhythmically across text, you train your visual system to process larger chunks of information at once. The key is consistency. Just ten minutes of daily practice can produce noticeable improvements within two weeks. Start slowly, focus on smooth eye movements, and gradually increase your speed as comfort grows. Remember that comprehension should never be sacrificed for speed. The goal is efficient understanding, not merely fast eye movement. With time, your brain will adapt to processing information at higher speeds, and what once felt rushed will become your new comfortable pace.`,
  },
  '5min': {
    label: '5 Minutes',
    wpm: 250,
    text: `The science of learning has evolved dramatically over the past few decades. Researchers in cognitive psychology and neuroscience have uncovered principles that challenge many traditional study methods while validating others. Understanding these principles can transform how effectively you absorb, retain, and apply new information. The most powerful learning technique supported by research is active recall, also known as retrieval practice. This involves actively trying to remember information from memory rather than passively reviewing it. When you close your textbook and try to write down everything you remember about a topic, you are engaging in active recall. This process strengthens memory traces far more effectively than simply re-reading highlighted notes. Studies consistently show that students who test themselves retain two to three times more information than those who spend the same time re-reading. The second most powerful technique is spaced repetition. Instead of cramming all your study into one long session, spreading it across multiple shorter sessions over days and weeks produces dramatically better long-term retention. The forgetting curve, first described by Hermann Ebbinghaus in the eighteen eighties, shows that we forget approximately fifty percent of new information within one hour and up to seventy percent within twenty four hours unless we actively review it. Spaced repetition works by reviewing material just as you are about to forget it, which forces your brain to reconstruct the memory and strengthens it each time. A practical schedule might involve reviewing new material after one day, then three days, then one week, then one month. Each successful retrieval makes the memory more durable. Interleaving is another powerful technique that involves mixing different topics or problem types during a study session rather than focusing on one topic at a time. While this feels harder and less organized, research shows it produces superior long-term retention and transfer ability. This is because interleaving forces your brain to discriminate between different concepts and select the appropriate strategy for each problem, building deeper understanding. Elaborative interrogation involves asking yourself why and how questions about the material you are studying. Instead of simply accepting that a fact is true, asking why it is true or how it connects to other things you know creates richer memory networks. The more connections a piece of information has to other knowledge in your brain, the easier it is to retrieve. Dual coding theory suggests that combining verbal information with visual representations creates stronger memories than either alone. When you read about a biological process and also draw a diagram of it, you create two separate mental representations that reinforce each other. This is why mind maps, concept diagrams, and illustrated notes are so effective. The testing effect demonstrates that the act of being tested on material produces better long-term memory than additional study time. This means that practice tests, flashcards, and self-quizzing are not just assessment tools but powerful learning tools. Even getting answers wrong during testing benefits learning, as long as you receive feedback and correct your understanding afterward. Sleep is not optional for learning. During sleep, particularly during slow wave sleep and rapid eye movement sleep, your brain replays and consolidates the day's learning, transferring information from short-term to long-term memory. Students who sleep well after studying retain significantly more than those who stay up late cramming. Exercise has been shown to boost learning and memory through multiple mechanisms. Physical activity increases blood flow to the brain, promotes the release of brain derived neurotrophic factor which supports new neural growth, reduces stress hormones that impair memory, and improves mood and motivation. Even a twenty minute walk before studying can enhance focus and retention. Mindset matters enormously. Carol Dweck's research on growth mindset shows that students who believe intelligence is malleable and can grow through effort learn more effectively than those who believe ability is fixed. When you view challenges as opportunities to grow rather than threats to your ego, you persist longer, try harder strategies, and ultimately achieve more. Finally, teaching others is one of the most effective ways to solidify your own understanding. When you explain a concept to someone else, you are forced to organize your knowledge coherently, identify gaps in your understanding, and retrieve information from memory. This combination of elaboration, retrieval, and social accountability makes teaching a uniquely powerful learning strategy. The message from learning science is clear. Effective studying is not about time spent but about strategies used. Replace passive re-reading with active recall. Replace cramming with spaced repetition. Replace single topic study blocks with interleaving. Replace silent acceptance with elaborative questioning. These evidence based techniques respect how your brain actually works and will transform your learning outcomes.`,
  },
};

function SpeedReading() {
  const navigate = useNavigate();
  const [selectedDuration, setSelectedDuration] = useState('1min');
  const [isRunning, setIsRunning] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [speed, setSpeed] = useState(250); // words per minute
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef(null);
  const containerRef = useRef(null);

  const words = passages[selectedDuration].text.split(/\s+/);
  const totalWords = words.length;

  const startReading = useCallback(() => {
    setIsRunning(true);
    setIsComplete(false);
  }, []);

  const pauseReading = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetReading = useCallback(() => {
    setIsRunning(false);
    setCurrentWordIndex(0);
    setIsComplete(false);
  }, []);

  useEffect(() => {
    if (isRunning && currentWordIndex < totalWords) {
      const interval = 60000 / speed; // ms per word
      intervalRef.current = setTimeout(() => {
        setCurrentWordIndex((prev) => {
          if (prev + 1 >= totalWords) {
            setIsRunning(false);
            setIsComplete(true);
            return prev;
          }
          return prev + 1;
        });
      }, interval);
    }
    return () => clearTimeout(intervalRef.current);
  }, [isRunning, currentWordIndex, speed, totalWords]);

  // Auto-scroll to keep highlighted word visible
  useEffect(() => {
    if (containerRef.current && isRunning) {
      const highlighted = containerRef.current.querySelector('.word-highlighted');
      if (highlighted) {
        highlighted.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentWordIndex, isRunning]);

  const handleDurationChange = (duration) => {
    setSelectedDuration(duration);
    resetReading();
  };

  const progress = totalWords > 0 ? ((currentWordIndex + 1) / totalWords) * 100 : 0;

  return (
    <div className="app-container">
      <div style={{ minHeight: '100vh', padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px', paddingTop: '20px' }}>
          <h1 style={{ color: 'white', fontFamily: 'Montserrat', fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>
            👁️ Speed Reading Practice
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
            Rapid Eye Movement Training — Follow the highlighted word
          </p>
        </div>

        {/* Controls Card */}
        <div style={{
          background: 'white', borderRadius: '16px', padding: '20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)', marginBottom: '16px'
        }}>
          {/* Duration Selector */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
            {Object.entries(passages).map(([key, val]) => (
              <button
                key={key}
                onClick={() => handleDurationChange(key)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '20px',
                  border: selectedDuration === key ? '2px solid #0B2A5B' : '2px solid #e0e0e0',
                  background: selectedDuration === key ? '#0B2A5B' : 'white',
                  color: selectedDuration === key ? 'white' : '#333',
                  fontFamily: 'Montserrat',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {val.label}
              </button>
            ))}
          </div>

          {/* Speed Control */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', color: '#666', fontWeight: 500 }}>Speed:</span>
            <button
              onClick={() => setSpeed(Math.max(100, speed - 50))}
              style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontSize: '16px', fontWeight: 700 }}
            >−</button>
            <span style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: '18px', color: '#0B2A5B', minWidth: '80px', textAlign: 'center' }}>
              {speed} WPM
            </span>
            <button
              onClick={() => setSpeed(Math.min(800, speed + 50))}
              style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontSize: '16px', fontWeight: 700 }}
            >+</button>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {!isRunning ? (
              <button
                onClick={startReading}
                style={{
                  padding: '12px 32px', borderRadius: '25px', border: 'none',
                  background: '#34A853', color: 'white', fontFamily: 'Montserrat',
                  fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(52,168,83,0.3)'
                }}
              >
                {currentWordIndex > 0 && !isComplete ? '▶ Resume' : '▶ Start'}
              </button>
            ) : (
              <button
                onClick={pauseReading}
                style={{
                  padding: '12px 32px', borderRadius: '25px', border: 'none',
                  background: '#FF6B00', color: 'white', fontFamily: 'Montserrat',
                  fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(255,107,0,0.3)'
                }}
              >
                ⏸ Pause
              </button>
            )}
            <button
              onClick={resetReading}
              style={{
                padding: '12px 32px', borderRadius: '25px', border: '2px solid #ddd',
                background: 'white', color: '#333', fontFamily: 'Montserrat',
                fontWeight: 600, fontSize: '14px', cursor: 'pointer'
              }}
            >
              ↺ Reset
            </button>
          </div>

          {/* Progress Bar */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', color: '#666' }}>Word {currentWordIndex + 1} / {totalWords}</span>
              <span style={{ fontSize: '12px', color: '#666' }}>{progress.toFixed(0)}%</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: '#e0e0e0', borderRadius: '3px' }}>
              <div style={{
                width: `${progress}%`, height: '100%', background: '#34A853',
                borderRadius: '3px', transition: 'width 0.1s linear'
              }} />
            </div>
          </div>
        </div>

        {/* Reading Content */}
        <div
          ref={containerRef}
          style={{
            background: 'white', borderRadius: '16px', padding: '30px 24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            maxHeight: '50vh', overflowY: 'auto',
            lineHeight: '2.2', fontSize: '18px', fontFamily: 'Inter, sans-serif'
          }}
        >
          {isComplete ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
              <h3 style={{ color: '#34A853', fontFamily: 'Montserrat', fontSize: '22px', marginBottom: '12px' }}>
                Exercise Complete!
              </h3>
              <p style={{ color: '#333', fontSize: '16px', marginBottom: '8px' }}>
                You read <strong>{totalWords} words</strong> at <strong>{speed} WPM</strong>
              </p>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Great work! Consistent daily practice will noticeably improve your reading speed.
              </p>
            </div>
          ) : (
            <p style={{ margin: 0 }}>
              {words.map((word, index) => (
                <span
                  key={index}
                  className={index === currentWordIndex ? 'word-highlighted' : ''}
                  style={{
                    padding: '2px 1px',
                    borderRadius: '3px',
                    backgroundColor: index === currentWordIndex ? '#FFC107' : 'transparent',
                    color: index < currentWordIndex ? '#999' : index === currentWordIndex ? '#0B2A5B' : '#333',
                    fontWeight: index === currentWordIndex ? 700 : 400,
                    transition: 'background-color 0.1s',
                  }}
                >
                  {word}{' '}
                </span>
              ))}
            </p>
          )}
        </div>

        {/* Tips */}
        <div style={{
          background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px 20px',
          marginTop: '16px', border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', margin: 0, lineHeight: '1.7' }}>
            💡 <strong>Tips:</strong> Follow only the highlighted word with your eyes. Don't go back. Resist the urge to sub-vocalize (say words in your head). Start at a comfortable speed and increase gradually over days.
          </p>
        </div>

        {/* Back button */}
        <div style={{ textAlign: 'center', marginTop: '20px', paddingBottom: '30px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '12px 32px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.1)', color: 'white', fontFamily: 'Montserrat',
              fontWeight: 600, fontSize: '14px', cursor: 'pointer'
            }}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default SpeedReading;
