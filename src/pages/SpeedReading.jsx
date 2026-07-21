import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist';
import ePub from 'epubjs';

// Set PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

const readingTexts = {
  brain: {
    label: "The Human Brain",
    text: "The human brain is the most complex organ in the known universe containing approximately eighty six billion neurons each forming thousands of connections with other neurons creating an intricate network that allows us to think feel remember and create. Every experience we have physically changes the structure of our brain through a process called neuroplasticity. When we learn something new neurons form fresh connections strengthening pathways that are used frequently and weakening those that are not. This is why consistent practice is so powerful as the more we repeat a skill or revisit information the stronger those neural pathways become. Sleep plays a crucial role in this process as the brain consolidates memories and clears metabolic waste during rest. Without adequate sleep our ability to learn and retain information drops dramatically. The brain uses twenty percent of our total energy despite being only two percent of body weight making it the most energy hungry organ. It processes eleven million bits of information every second though we are consciously aware of only about fifty bits at any given moment. The hippocampus our memory center can grow new neurons throughout life a process called neurogenesis which is enhanced by exercise learning and good nutrition. Emotional experiences create stronger memories because the amygdala tags them as important ensuring they are consolidated more thoroughly during sleep. Working memory can hold only four to seven items at once which is why chunking information into groups helps us learn more effectively. The brain generates enough electricity to power a small light bulb and information travels through neural pathways at speeds up to two hundred sixty eight miles per hour faster than a Formula One race car. Understanding how our brain works gives us the power to optimize learning unlock potential and build the life we want through deliberate practice and consistent effort. The prefrontal cortex responsible for planning decision making and self control does not fully mature until age twenty five which explains why teenagers sometimes struggle with impulse control. Meditation has been shown to physically thicken the prefrontal cortex improving focus attention and emotional regulation. Exercise increases brain derived neurotrophic factor a protein that acts like fertilizer for brain cells promoting growth and survival of new neurons. The brain is approximately seventy three percent water and even mild dehydration of two percent can impair attention memory and cognitive skills significantly.",
  },
  gandhi: {
    label: "Gandhi's Salt March",
    text: "The Salt March also known as the Dandi March was a pivotal act of nonviolent civil disobedience in colonial India led by Mohandas Karamchand Gandhi. It began on March twelve nineteen thirty when Gandhi and seventy eight followers set out from his ashram in Sabarmati near Ahmedabad on a three hundred eighty eight kilometer journey to the coastal village of Dandi in Gujarat. The purpose was simple yet revolutionary to make salt from seawater in defiance of the British salt tax which prohibited Indians from collecting or selling salt forcing them to buy expensive salt from British monopolies. Gandhi chose salt as the symbol of resistance because it affected every Indian regardless of caste class or religion making it a unifying issue. As Gandhi walked village to village for twenty four days the group grew from dozens to thousands with people joining along the route inspired by his determination and simplicity. He wore a simple white dhoti carried a bamboo walking stick and walked approximately nineteen kilometers each day despite being sixty years old. On April six nineteen thirty Gandhi reached Dandi beach bent down and picked up a handful of natural salt from the mud declaring this simple act to be a defiance of British law. This single gesture ignited a massive wave of civil disobedience across India with millions of people making their own salt holding demonstrations and boycotting British goods. The British authorities responded with brutal force arresting over sixty thousand people including Gandhi himself on May fifth. However the violence of the British response attracted international attention and sympathy for the Indian independence movement. The Salt March demonstrated the power of nonviolent resistance proving that ordinary people united by a just cause could challenge the mightiest empire in the world. It inspired future movements worldwide including the American civil rights movement led by Martin Luther King Jr who studied Gandhi's methods extensively. The march showed that courage does not require weapons that dignity cannot be taken by force and that the moral authority of the oppressed is more powerful than the physical authority of the oppressor. Gandhi's leadership during this period earned him the title Mahatma meaning great soul and cemented his place as one of history's most influential leaders. The Salt March remains a powerful reminder that systemic change begins with individual acts of courage multiplied by collective will.",
  },
  tesla: {
    label: "Nikola Tesla",
    text: "Nikola Tesla was born on July ten eighteen fifty six in Smiljan a small village in what is now Croatia during a lightning storm which his mother reportedly said was a sign he would be a child of light. From childhood Tesla displayed an extraordinary mind with a photographic memory and the ability to visualize complete machines in his head down to exact measurements before building them. He could perform complex mathematical calculations in his mind and spoke eight languages fluently. After studying engineering in Graz and Prague Tesla worked briefly for Thomas Edison in Paris before emigrating to America in eighteen eighty four with little more than a letter of introduction and four cents in his pocket. Edison hired him immediately recognizing his genius but their working relationship quickly soured over fundamental disagreements about electrical systems. Edison championed direct current while Tesla advocated for alternating current which could transmit electricity over much longer distances. Tesla eventually partnered with George Westinghouse and their alternating current system won the famous War of Currents powering the nineteen ninety three World's Fair in Chicago and eventually becoming the global standard for electrical distribution. Tesla held over three hundred patents and his inventions include the AC induction motor the Tesla coil radio technology fluorescent lighting remote control and early contributions to radar X-ray technology and robotics. His vision extended far beyond his era as he described concepts resembling smartphones wireless internet and renewable energy over a hundred years before they became reality. Despite his genius Tesla was a poor businessman who gave away valuable patents and died nearly penniless in a New York hotel room on January seven nineteen forty three at age eighty six. He never married choosing to devote all his energy to his work believing that celibacy enhanced his scientific abilities. Tesla's legacy is experiencing a renaissance in the twenty first century with the electric car company bearing his name and growing recognition of his contributions that were overshadowed during his lifetime. His story teaches us that true genius often goes unrecognized in its time that the pursuit of knowledge can be its own reward and that one person's vision can literally illuminate the world for generations to come.",
  },
  edison: {
    label: "Thomas Edison",
    text: "Thomas Alva Edison born February eleven eighteen forty seven in Milan Ohio became one of the most prolific inventors in history holding one thousand ninety three United States patents. His early life was marked by challenges including hearing loss that began in childhood and a teacher who called him addled leading his mother to homeschool him. This apparent disadvantage became an advantage as Edison developed extraordinary powers of concentration undistracted by the noise around him. He was an avid reader who consumed entire libraries and conducted chemistry experiments from age ten eventually setting up a laboratory in a train baggage car where he sold newspapers. Edison established his famous research laboratory in Menlo Park New Jersey in eighteen seventy six creating what many consider the world's first industrial research facility. Here he developed a systematic approach to invention employing teams of engineers and researchers to solve problems methodically rather than relying solely on individual genius. His most famous invention the practical incandescent light bulb required over one thousand failed experiments before success. When asked about these failures Edison reportedly said I have not failed I have just found ten thousand ways that won't work demonstrating a growth mindset decades before the term was coined. Beyond the light bulb Edison's inventions include the phonograph the motion picture camera improvements to the telegraph the alkaline storage battery and systems for electrical power distribution. He created the first commercial electrical power station on Pearl Street in Manhattan in eighteen eighty two bringing electric light to homes and businesses for the first time. Edison was famous for his work ethic often sleeping only four hours a night and spending days in his laboratory driven by insatiable curiosity and competitive fire. He believed genius was one percent inspiration and ninety nine percent perspiration a philosophy he lived daily. His Menlo Park laboratory produced a minor invention every ten days and a major invention every six months during its most productive period. Edison died on October eighteen nineteen thirty one leaving behind a legacy that transformed modern civilization. His approach to innovation combining systematic experimentation team collaboration and relentless persistence became the blueprint for modern research and development. His story reminds us that persistence determination and the willingness to fail are more important than raw talent in achieving extraordinary things.",
  },
  memory: {
    label: "The Science of Memory",
    text: "Memory is not a single system but rather a collection of different processes distributed across multiple brain regions working together to encode store and retrieve information. The journey of a memory begins with encoding when sensory information from the environment is converted into a form the brain can process. Attention acts as a gatekeeper determining which of the millions of sensory inputs reaching your brain each second will be processed deeply enough to form a memory. Information that receives focused attention moves into working memory a temporary holding space with limited capacity of about four to seven items that lasts only twenty to thirty seconds without active rehearsal. For information to move from working memory into long term storage it must be consolidated a process that occurs primarily during sleep when the hippocampus replays the day's experiences and transfers important information to the cerebral cortex for permanent storage. Long term memory itself has multiple forms including explicit memory which covers facts and events you can consciously recall and implicit memory which covers skills habits and conditioned responses that operate below conscious awareness. The forgetting curve discovered by Hermann Ebbinghaus in eighteen eighty five shows that without review we lose approximately fifty percent of new information within one hour and up to ninety percent within a week. However each time we successfully retrieve a memory it becomes stronger and more resistant to forgetting a phenomenon called the testing effect. This is why active recall practicing retrieving information from memory is dramatically more effective for learning than passive review like re-reading notes. Spaced repetition leverages the forgetting curve by scheduling reviews at optimal intervals just before you would forget allowing minimal study time to produce maximum retention. Emotional arousal enhances memory formation because the amygdala signals the hippocampus to pay extra attention to emotionally significant events explaining why we remember emotionally charged moments vividly. Sleep deprivation severely impairs memory consolidation with studies showing that students who sleep well after studying retain significantly more than those who stay up late cramming. The method of loci also called the memory palace technique used since ancient Greece works by associating information with vivid imaginary locations leveraging our powerful spatial memory system. Elaborative encoding which involves connecting new information to existing knowledge through questions explanations and analogies creates richer more retrievable memory traces. Understanding these principles empowers us to study smarter not harder replacing ineffective habits with evidence based strategies that work with our brain rather than against it.",
  },
};

function SpeedReading() {
  const navigate = useNavigate();
  const [selectedText, setSelectedText] = useState('brain');
  const [scanMode, setScanMode] = useState(1); // 1, 2, 3, or 5 words
  const [isRunning, setIsRunning] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [speed, setSpeed] = useState(150); // words per minute
  const [isComplete, setIsComplete] = useState(false);
  const [customText, setCustomText] = useState(null); // { label, text } from uploaded file
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [pacerType, setPacerType] = useState('highlight'); // 'highlight' or 'line'
  const intervalRef = useRef(null);
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);

  const activeText = customText && selectedText === 'custom' ? customText.text : readingTexts[selectedText]?.text || '';
  const words = activeText.split(/\s+/).filter(w => w.length > 0);
  const totalWords = words.length;

  // File upload handler
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setUploadError('');
    resetReading();

    try {
      const fileName = file.name.toLowerCase();

      if (fileName.endsWith('.pdf')) {
        // Parse PDF
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map(item => item.str).join(' ');
          fullText += pageText + ' ';
        }
        const cleanText = fullText.replace(/\s+/g, ' ').trim();
        if (cleanText.length < 20) throw new Error('Could not extract readable text from this PDF.');
        setCustomText({ label: file.name, text: cleanText });
        setSelectedText('custom');
      } else if (fileName.endsWith('.epub')) {
        // Parse EPUB
        const arrayBuffer = await file.arrayBuffer();
        const book = ePub(arrayBuffer);
        await book.ready;
        const spine = book.spine;
        let fullText = '';
        for (let i = 0; i < spine.items.length; i++) {
          const item = spine.items[i];
          const doc = await book.load(item.href);
          // doc is a Document, extract text
          const body = doc.querySelector ? doc.querySelector('body') : doc.body;
          if (body) {
            fullText += body.textContent + ' ';
          }
        }
        const cleanText = fullText.replace(/\s+/g, ' ').trim();
        if (cleanText.length < 20) throw new Error('Could not extract readable text from this EPUB.');
        setCustomText({ label: file.name, text: cleanText });
        setSelectedText('custom');
      } else if (fileName.endsWith('.txt')) {
        // Plain text
        const text = await file.text();
        if (text.trim().length < 20) throw new Error('File is too short or empty.');
        setCustomText({ label: file.name, text: text.trim() });
        setSelectedText('custom');
      } else {
        throw new Error('Unsupported file format. Please upload PDF, EPUB, or TXT.');
      }
    } catch (err) {
      setUploadError(err.message || 'Failed to read file.');
      console.error('File upload error:', err);
    } finally {
      setIsLoading(false);
    }
  };

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
      const interval = (60000 / speed) * scanMode; // time per group
      intervalRef.current = setTimeout(() => {
        setCurrentWordIndex((prev) => {
          const next = prev + scanMode;
          if (next >= totalWords) {
            setIsRunning(false);
            setIsComplete(true);
            return prev;
          }
          return next;
        });
      }, interval);
    }
    return () => clearTimeout(intervalRef.current);
  }, [isRunning, currentWordIndex, speed, totalWords, scanMode]);

  useEffect(() => {
    if (containerRef.current && isRunning) {
      const highlighted = containerRef.current.querySelector('.word-highlighted');
      if (highlighted) {
        highlighted.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentWordIndex, isRunning]);

  const handleTextChange = (key) => {
    setSelectedText(key);
    resetReading();
  };

  const handleScanChange = (mode) => {
    setScanMode(mode);
    resetReading();
  };

  const progress = totalWords > 0 ? (Math.min(currentWordIndex + scanMode, totalWords) / totalWords) * 100 : 0;
  const estimatedTime = Math.ceil(totalWords / speed);
  const isAboveAverage = speed > 250;

  return (
    <div className="app-container">
      <div style={{ minHeight: '100vh', padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px', paddingTop: '20px' }}>
          <h1 style={{ color: 'white', fontFamily: 'Montserrat', fontSize: '26px', fontWeight: 800, marginBottom: '6px' }}>
            👁️ Speed Reading Practice
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
            Rapid Eye Movement Training — Train your eyes to scan faster
          </p>
        </div>

        {/* Controls Card */}
        <div style={{
          background: 'white', borderRadius: '16px', padding: '20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)', marginBottom: '14px'
        }}>
          {/* Text Selection Dropdown */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '12px', color: '#666', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Reading Text:
            </label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <select
                value={selectedText}
                onChange={(e) => handleTextChange(e.target.value)}
                style={{
                  flex: 1, minWidth: '180px', padding: '10px 14px', borderRadius: '10px',
                  border: '2px solid #e0e0e0', fontSize: '14px', fontFamily: 'Inter',
                  color: '#333', cursor: 'pointer', appearance: 'auto'
                }}
              >
                {Object.entries(readingTexts).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
                {customText && <option value="custom">📄 {customText.label}</option>}
              </select>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                style={{
                  padding: '10px 16px', borderRadius: '10px', border: '2px solid #0B2A5B',
                  background: 'white', color: '#0B2A5B', fontFamily: 'Montserrat',
                  fontWeight: 600, fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap'
                }}
              >
                {isLoading ? '⏳ Loading...' : '📁 Upload PDF / EPUB / TXT'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.epub,.txt"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </div>
            {uploadError && (
              <p style={{ color: '#E53935', fontSize: '12px', marginTop: '6px' }}>{uploadError}</p>
            )}
            {customText && selectedText === 'custom' && (
              <p style={{ color: '#34A853', fontSize: '11px', marginTop: '4px' }}>
                ✓ Reading from: {customText.label} ({words.length.toLocaleString()} words)
              </p>
            )}
          </div>

          {/* Scan Mode */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '12px', color: '#666', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Scan Mode (words per fixation):
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[1, 2, 3, 5].map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleScanChange(mode)}
                  style={{
                    padding: '8px 18px', borderRadius: '20px',
                    border: scanMode === mode ? '2px solid #0B2A5B' : '2px solid #e0e0e0',
                    background: scanMode === mode ? '#0B2A5B' : 'white',
                    color: scanMode === mode ? 'white' : '#333',
                    fontFamily: 'Montserrat', fontWeight: 600, fontSize: '13px', cursor: 'pointer'
                  }}
                >
                  {mode} Word{mode > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Pacer Type */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '12px', color: '#666', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Pacer Type:
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => { setPacerType('highlight'); resetReading(); }}
                style={{
                  padding: '8px 18px', borderRadius: '20px',
                  border: pacerType === 'highlight' ? '2px solid #0B2A5B' : '2px solid #e0e0e0',
                  background: pacerType === 'highlight' ? '#0B2A5B' : 'white',
                  color: pacerType === 'highlight' ? 'white' : '#333',
                  fontFamily: 'Montserrat', fontWeight: 600, fontSize: '13px', cursor: 'pointer'
                }}
              >
                🟡 Word Highlight
              </button>
              <button
                onClick={() => { setPacerType('line'); resetReading(); }}
                style={{
                  padding: '8px 18px', borderRadius: '20px',
                  border: pacerType === 'line' ? '2px solid #0B2A5B' : '2px solid #e0e0e0',
                  background: pacerType === 'line' ? '#0B2A5B' : 'white',
                  color: pacerType === 'line' ? 'white' : '#333',
                  fontFamily: 'Montserrat', fontWeight: 600, fontSize: '13px', cursor: 'pointer'
                }}
              >
                📏 Line Pacer
              </button>
            </div>
          </div>

          {/* Speed Control */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '12px', color: '#666', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Speed: <span style={{ color: '#0B2A5B' }}>{speed} WPM</span>
              {isAboveAverage && <span style={{ color: '#34A853', marginLeft: '8px' }}>⚡ Above world average!</span>}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: '#999' }}>150</span>
              <input
                type="range"
                min="150"
                max="800"
                step="10"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                style={{ flex: 1, accentColor: isAboveAverage ? '#34A853' : '#0B2A5B' }}
              />
              <span style={{ fontSize: '11px', color: '#999' }}>800</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              <span style={{ fontSize: '11px', color: '#999' }}>Beginner</span>
              <span style={{ fontSize: '11px', color: speed > 250 ? '#34A853' : '#999', fontWeight: speed > 250 ? 600 : 400 }}>
                {speed <= 200 ? 'Slow Reader' : speed <= 250 ? 'Average Reader' : speed <= 400 ? 'Fast Reader' : speed <= 600 ? 'Speed Reader' : 'Ultra Fast'}
              </span>
              <span style={{ fontSize: '11px', color: '#999' }}>Expert</span>
            </div>
          </div>

          {/* Info Row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: '#666' }}>📖 {totalWords} words</span>
            <span style={{ fontSize: '12px', color: '#666' }}>⏱️ ~{estimatedTime} min at current speed</span>
            <span style={{ fontSize: '12px', color: '#666' }}>👁️ {scanMode} word{scanMode > 1 ? 's' : ''}/fixation</span>
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

          {/* Progress */}
          <div style={{ marginTop: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', color: '#666' }}>Word {Math.min(currentWordIndex + scanMode, totalWords)} / {totalWords}</span>
              <span style={{ fontSize: '11px', color: '#666' }}>{progress.toFixed(0)}%</span>
            </div>
            <div style={{ width: '100%', height: '5px', background: '#e0e0e0', borderRadius: '3px' }}>
              <div style={{
                width: `${progress}%`, height: '100%',
                background: isAboveAverage ? '#34A853' : '#0B2A5B',
                borderRadius: '3px', transition: 'width 0.1s linear'
              }} />
            </div>
          </div>
        </div>

        {/* Reading Content */}
        <div
          ref={containerRef}
          style={{
            background: 'white', borderRadius: '16px', padding: '28px 22px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            maxHeight: '45vh', overflowY: 'auto',
            lineHeight: '2.4', fontSize: '17px', fontFamily: 'Inter, sans-serif'
          }}
        >
          {isComplete ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
              <h3 style={{ color: '#34A853', fontFamily: 'Montserrat', fontSize: '22px', marginBottom: '12px' }}>
                Exercise Complete!
              </h3>
              <p style={{ color: '#333', fontSize: '16px', marginBottom: '8px' }}>
                You read <strong>{totalWords} words</strong> at <strong>{speed} WPM</strong> with <strong>{scanMode}-word scan</strong>
              </p>
              {isAboveAverage && (
                <div style={{
                  background: '#E8F5E9', borderRadius: '12px', padding: '14px 20px',
                  marginTop: '16px', display: 'inline-block'
                }}>
                  <p style={{ color: '#34A853', fontSize: '15px', fontWeight: 600, margin: 0 }}>
                    ⚡ You're reading faster than the world average (250 WPM)! Keep pushing your limits.
                  </p>
                </div>
              )}
              <p style={{ color: '#666', fontSize: '14px', marginTop: '16px' }}>
                Next: Try increasing speed by 50 WPM or switch to a wider scan mode.
              </p>
            </div>
          ) : (
            <p style={{ margin: 0 }}>
              {pacerType === 'highlight' ? (
                // Word Highlight mode
                words.map((word, index) => {
                  const isHighlighted = index >= currentWordIndex && index < currentWordIndex + scanMode;
                  const isPast = index < currentWordIndex;
                  return (
                    <span
                      key={index}
                      className={isHighlighted ? 'word-highlighted' : ''}
                      style={{
                        padding: '2px 1px',
                        borderRadius: '3px',
                        backgroundColor: isHighlighted ? '#FFC107' : 'transparent',
                        color: isPast ? '#bbb' : isHighlighted ? '#0B2A5B' : '#333',
                        fontWeight: isHighlighted ? 700 : 400,
                        transition: 'background-color 0.05s',
                      }}
                    >
                      {word}{' '}
                    </span>
                  );
                })
              ) : (
                // Line Pacer mode
                words.map((word, index) => {
                  const isPast = index < currentWordIndex;
                  const isCurrent = index === currentWordIndex;
                  return (
                    <span key={index}>
                      <span
                        className={isCurrent ? 'word-highlighted' : ''}
                        style={{
                          color: isPast ? '#ccc' : '#333',
                          fontWeight: 400,
                          transition: 'color 0.1s',
                        }}
                      >
                        {word}
                      </span>
                      {isCurrent && (
                        <span style={{
                          display: 'inline-block',
                          width: '2px',
                          height: '1.2em',
                          background: '#E74C3C',
                          verticalAlign: 'middle',
                          marginLeft: '1px',
                          marginRight: '1px',
                          animation: 'none',
                          boxShadow: '0 0 4px rgba(231,76,60,0.6)',
                        }} />
                      )}
                      {!isCurrent && ' '}
                    </span>
                  );
                })
              )}
            </p>
          )}
        </div>

        {/* Tips */}
        <div style={{
          background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 18px',
          marginTop: '14px', border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', margin: 0, lineHeight: '1.7' }}>
            💡 <strong>How to practice:</strong> Start with 1-word scan at 150 WPM. Once comfortable, increase to 2-word scan. Gradually move to 3 and 5 word groups. Increase speed only when you can comprehend at the current speed. Practice daily for 5-10 minutes.
          </p>
        </div>

        {/* Back button */}
        <div style={{ textAlign: 'center', marginTop: '16px', paddingBottom: '30px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '10px 28px', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.1)', color: 'white', fontFamily: 'Montserrat',
              fontWeight: 600, fontSize: '13px', cursor: 'pointer'
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
