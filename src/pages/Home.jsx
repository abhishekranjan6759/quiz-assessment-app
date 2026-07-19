import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';

const quotes = [
  // Education Quotes
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "The mind is not a vessel to be filled, but a fire to be kindled.", author: "Plutarch" },
  { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
  { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "Education is not the filling of a pail, but the lighting of a fire.", author: "W.B. Yeats" },
  { text: "The only person who is educated is the one who has learned how to learn and change.", author: "Carl Rogers" },
  { text: "Learning is not attained by chance, it must be sought for with ardor and diligence.", author: "Abigail Adams" },
  { text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
  { text: "Intelligence is not about knowing everything, but about knowing what to do when you don't know.", author: "Albert Einstein" },
  { text: "Anyone who stops learning is old, whether at twenty or eighty.", author: "Henry Ford" },
  { text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", author: "Brian Herbert" },
  { text: "What we learn with pleasure we never forget.", author: "Alfred Mercier" },
  { text: "The roots of education are bitter, but the fruit is sweet.", author: "Aristotle" },
  { text: "A person who never made a mistake never tried anything new.", author: "Albert Einstein" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "Knowledge is power. Information is liberating. Education is the premise of progress.", author: "Kofi Annan" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "The brain is wider than the sky.", author: "Emily Dickinson" },
  // Brain Facts - Structure
  { text: "Your brain has 86 billion neurons, each connected to 10,000 others. That's more connections than stars in the Milky Way.", author: "Brain Fact" },
  { text: "Your brain uses 20% of your body's total energy — even though it's only 2% of your body weight.", author: "Brain Fact" },
  { text: "The human brain has 100,000 miles of blood vessels — enough to circle the earth four times.", author: "Brain Fact" },
  { text: "Your brain is about 73% water. Even 2% dehydration affects attention, memory, and cognitive skills.", author: "Brain Fact" },
  { text: "The brain weighs about 1.4 kg but contains more connections than there are grains of sand on all the world's beaches.", author: "Brain Fact" },
  { text: "Your brain generates about 12-25 watts of electricity — enough to power a low-wattage LED light bulb.", author: "Brain Fact" },
  { text: "Brain information travels at speeds up to 268 miles per hour — faster than a Formula 1 race car.", author: "Brain Fact" },
  { text: "The brain can process an image in as little as 13 milliseconds — faster than you can blink.", author: "Brain Fact" },
  { text: "Your brain has about 100 trillion synaptic connections. That's 1,000 times more than stars in our galaxy.", author: "Brain Fact" },
  { text: "The left and right hemispheres of the brain are connected by 200-300 million nerve fibers called the corpus callosum.", author: "Brain Fact" },
  // Brain Facts - Memory & Learning
  { text: "Every time you learn something new, your brain physically changes its structure through neuroplasticity.", author: "Brain Fact" },
  { text: "Sleep is when your brain consolidates memories. Without it, learning is nearly impossible.", author: "Brain Fact" },
  { text: "Your brain processes 11 million bits of information per second, but you're only conscious of about 50.", author: "Brain Fact" },
  { text: "Repetition strengthens neural pathways. That's why practice makes permanent, not just perfect.", author: "Brain Fact" },
  { text: "The hippocampus — your memory center — can grow new neurons throughout your entire life.", author: "Brain Fact" },
  { text: "Emotional experiences create stronger memories because the amygdala tags them as important.", author: "Brain Fact" },
  { text: "Your working memory can hold only 4-7 items at once. That's why chunking information helps you learn.", author: "Brain Fact" },
  { text: "Memories are not stored in one place — they're distributed across multiple brain regions.", author: "Brain Fact" },
  { text: "You forget 50% of new information within one hour unless you actively review it.", author: "Brain Fact" },
  { text: "Teaching someone else is the most effective way to learn — it forces your brain to organize knowledge deeply.", author: "Brain Fact" },
  { text: "Multitasking reduces productivity by 40%. Your brain actually switches rapidly between tasks, not doing them simultaneously.", author: "Brain Fact" },
  { text: "Exercise increases BDNF (Brain-Derived Neurotrophic Factor) — a protein that helps grow new brain cells.", author: "Brain Fact" },
  { text: "Your brain is more active when you sleep than when you watch TV.", author: "Brain Fact" },
  { text: "Stress shrinks the prefrontal cortex (thinking brain) and enlarges the amygdala (fear brain).", author: "Brain Fact" },
  { text: "Reading rewires your brain. People who read fiction develop stronger empathy and social understanding.", author: "Brain Fact" },
  { text: "The spacing effect: studying in short bursts over days is 200% more effective than cramming.", author: "Brain Fact" },
  { text: "Music activates more areas of the brain simultaneously than any other activity studied.", author: "Brain Fact" },
  { text: "Your brain cannot feel pain — it has no pain receptors. That's why brain surgery can be done while awake.", author: "Brain Fact" },
  { text: "Handwriting activates more brain regions than typing, leading to better memory retention.", author: "Brain Fact" },
  { text: "Laughter activates 5 different areas of the brain simultaneously.", author: "Brain Fact" },
  // Brain Facts - Performance
  { text: "A 20-minute nap improves memory, creativity, and alertness more effectively than caffeine.", author: "Brain Fact" },
  { text: "Your brain's storage capacity is virtually unlimited — estimated at 2.5 petabytes (2.5 million gigabytes).", author: "Brain Fact" },
  { text: "Meditation physically thickens the prefrontal cortex — the area responsible for focus and decision-making.", author: "Brain Fact" },
  { text: "Your brain makes 35,000 decisions every day — most of them unconscious.", author: "Brain Fact" },
  { text: "Chronic stress kills brain cells and reduces the size of the brain, especially the memory areas.", author: "Brain Fact" },
  { text: "Walking increases creative output by an average of 60% compared to sitting.", author: "Brain Fact" },
  { text: "Your brain is 60% fat — making it the fattiest organ in your body. Omega-3 is essential for brain health.", author: "Brain Fact" },
  { text: "Children's brains can form 700-1,000 new neural connections every second in the first few years of life.", author: "Brain Fact" },
  { text: "It takes 21 days to form a habit — because that's how long it takes for new neural pathways to solidify.", author: "Brain Fact" },
  { text: "Boredom is actually your brain asking for stimulation. It's a signal to learn something new.", author: "Brain Fact" },
  { text: "Your brain produces approximately 70,000 thoughts per day. Most are repetitive and automatic.", author: "Brain Fact" },
  { text: "Gratitude literally rewires the brain — practicing it regularly strengthens neural pathways for positivity.", author: "Brain Fact" },
  { text: "The brain's processing speed peaks around age 18, but wisdom and vocabulary keep growing until 65-70.", author: "Brain Fact" },
  { text: "Novelty triggers dopamine release. That's why new experiences feel exciting and help you remember better.", author: "Brain Fact" },
  { text: "Your brain has a negativity bias — it takes 5 positive experiences to counteract 1 negative one.", author: "Brain Fact" },
  // Memory Techniques & Learning Science
  { text: "The method of loci (memory palace) technique has been used since ancient Greece — and it still works.", author: "Memory Fact" },
  { text: "Spaced repetition can help you remember 90% of what you learn, compared to 20% with traditional study.", author: "Memory Fact" },
  { text: "Associating new information with vivid images makes it 65% more memorable.", author: "Memory Fact" },
  { text: "Your short-term memory lasts only 20-30 seconds without rehearsal.", author: "Memory Fact" },
  { text: "The testing effect: actively recalling information strengthens memory more than re-reading notes.", author: "Memory Fact" },
  { text: "Scent is the strongest trigger for memories because the olfactory bulb connects directly to the hippocampus.", author: "Memory Fact" },
  { text: "Interleaving (mixing different topics while studying) improves long-term retention by 43%.", author: "Memory Fact" },
  { text: "Your brain remembers beginnings and endings best — the serial position effect. Put key info there.", author: "Memory Fact" },
  { text: "Drawing a concept is more effective for memory than writing it, reading it, or looking at images.", author: "Memory Fact" },
  { text: "Elaborative interrogation — asking 'why?' and 'how?' — deepens understanding and memory.", author: "Memory Fact" },
  // More Education Quotes
  { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates" },
  { text: "In learning you will teach, and in teaching you will learn.", author: "Phil Collins" },
  { text: "Develop a passion for learning. If you do, you will never cease to grow.", author: "Anthony J. D'Angelo" },
  { text: "The greatest enemy of knowledge is not ignorance, it is the illusion of knowledge.", author: "Stephen Hawking" },
  { text: "I have no special talents. I am only passionately curious.", author: "Albert Einstein" },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  { text: "The function of education is to teach one to think intensively and to think critically.", author: "Martin Luther King Jr." },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "It is not that I'm so smart. But I stay with the questions much longer.", author: "Albert Einstein" },
  { text: "The illiterate of the 21st century will not be those who cannot read and write, but those who cannot learn, unlearn, and relearn.", author: "Alvin Toffler" },
  { text: "Every accomplishment starts with the decision to try.", author: "John F. Kennedy" },
  { text: "Your brain doesn't distinguish between a vividly imagined experience and a real one. Visualization literally practices success.", author: "Brain Fact" },
  { text: "Curiosity activates the hippocampus and dopamine system together — making you learn AND enjoy it simultaneously.", author: "Brain Fact" },
  { text: "The Pomodoro Technique works because the brain can only maintain peak focus for 25-30 minutes at a time.", author: "Brain Fact" },
  { text: "Doodling while listening improves recall by 29% because it keeps the brain in an active state.", author: "Brain Fact" },
  { text: "Your brain rewires itself based on what you repeatedly think. Choose your thoughts like you choose your food.", author: "Brain Fact" },
  { text: "Social learning activates mirror neurons — we literally learn by watching others.", author: "Brain Fact" },
  { text: "Cold water on your face triggers the 'dive reflex' — instantly calming your nervous system and improving focus.", author: "Brain Fact" },
  { text: "Your brain treats social pain (rejection) the same as physical pain — they activate identical brain regions.", author: "Brain Fact" },
  { text: "Bilingual brains have denser grey matter and better executive function — learning languages is brain exercise.", author: "Brain Fact" },
  { text: "The best time to study new information is right before sleep — your brain processes it during the night.", author: "Brain Fact" },
  { text: "Chewing gum increases blood flow to the brain by 25-40%, improving alertness and concentration.", author: "Brain Fact" },
  { text: "Your brain can only maintain willpower for so long — that's why important decisions should be made early in the day.", author: "Brain Fact" },
  { text: "Brains grow stronger from struggle. The harder you work to understand something, the more solidly it's encoded.", author: "Brain Fact" },
  { text: "Looking at nature for just 40 seconds improves concentration and cognitive performance.", author: "Brain Fact" },
  { text: "The growth mindset is not just motivation — it physically produces more neural connections during learning.", author: "Brain Fact" },
];

function Home() {
  const navigate = useNavigate();
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const quizSections = [
    {
      title: "Start Here",
      quizzes: [
        { path: 'mood-check', label: '🎭 Mood Check', subtitle: 'How ready are you?' },
        { path: 'focus', label: '🎯 Focus Check', subtitle: 'How present is your mind?' },
        { path: 'inner-world', label: '🌊 Inner World', subtitle: "What's on your mind?" },
        { path: 'limiting-beliefs', label: '🔓 Self-Limiting Beliefs', subtitle: 'What holds you back?' },
        { path: 'fomo', label: '📱 FOMO Check', subtitle: 'Fear of missing out level' },
        { path: 'self-image', label: '🪞 Self-Image', subtitle: 'How you see yourself' },
      ],
    },
    {
      title: "Know Your Personality",
      quizzes: [
        { path: 'spirit-animal', label: '🐾 Spirit Animal', subtitle: 'Your personality archetype' },
        { path: 'social-type', label: '👥 Social Type', subtitle: 'How you interact with others' },
        { path: 'brain-dominance', label: '🧠 Brain Dominance', subtitle: 'Left or right brain?' },
      ],
    },
    {
      title: "Learning & Growth",
      quizzes: [
        { path: 'study-strategy', label: '🗺️ Study Strategy', subtitle: 'Personalized study plan for your subject' },
        { path: 'topper-mindset', label: '🏆 Topper Mindset', subtitle: 'Do you think like a topper?' },
        { path: 'study-effort', label: '📊 Study Effort & Habits', subtitle: 'Your current effort level' },
        { path: 'vark', label: '📚 VARK Learning Style', subtitle: 'How you learn best' },
        { path: 'motivation', label: '🎯 Motivation Type', subtitle: 'Intrinsic vs extrinsic' },
        { path: 'learning-agility', label: '📈 Learning Agility', subtitle: 'Your adaptability' },
      ],
    },
    {
      title: "Intelligence & Well-being",
      quizzes: [
        { path: 'eq', label: '💡 EQ Assessment', subtitle: 'Emotional intelligence' },
        { path: 'iq', label: '🧩 IQ Assessment', subtitle: 'Cognitive ability' },
        { path: 'happiness', label: '😊 Happiness Check', subtitle: 'Your well-being score' },
      ],
    },
  ];

  return (
    <div className="app-container">
      <div className="home-container">
        <div className="home-content">
          <div className="home-left">
            <div className="profile-card">
              <div className="profile-header">Super Learner Academy</div>
              <div style={{ padding: '20px', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={`${import.meta.env.BASE_URL}Logo.png`}
                  alt="Super Learner Academy Logo"
                  style={{
                    width: '100%',
                    maxWidth: '280px',
                    height: 'auto',
                    display: 'block',
                    borderRadius: '10px'
                  }}
                />
              </div>
            </div>
            <div className="social-icons">
              <a href="https://www.instagram.com/abhishek_ranjan_mnnit/" target="_blank" rel="noopener noreferrer" className="social-icon-link">
                <InstagramIcon className="social-icon" />
              </a>
              <a href="https://www.youtube.com/@RanjanNotes" target="_blank" rel="noopener noreferrer" className="social-icon-link">
                <YouTubeIcon className="social-icon" />
              </a>
              <a href="https://www.facebook.com/Ranjan705" target="_blank" rel="noopener noreferrer" className="social-icon-link">
                <FacebookIcon className="social-icon" />
              </a>
            </div>
          </div>

          <div className="home-right">
            <h1 className="quiz-title">Know Yourself Better</h1>

            {/* Quotes Carousel */}
            <div className="quotes-carousel">
              <div className="quote-card" key={currentQuote}>
                <p className="quote-text">"{quotes[currentQuote].text}"</p>
                <span className="quote-author">— {quotes[currentQuote].author}</span>
              </div>
              <div className="quote-progress">
                <div
                  className="quote-progress-bar"
                  style={{ animationDuration: '5s' }}
                  key={currentQuote}
                />
              </div>
            </div>

            {/* Quiz Sections */}
            {quizSections.map((section) => (
              <div key={section.title} className="quiz-section">
                <h3 className="quiz-section-title">{section.title}</h3>
                <div className="quiz-grid">
                  {section.quizzes.map((quiz) => (
                    <button
                      key={quiz.path}
                      className="quiz-button"
                      onClick={() => navigate(`/username/${quiz.path}`)}
                    >
                      <span className="quiz-button-label">{quiz.label}</span>
                      <span className="quiz-button-subtitle">{quiz.subtitle}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <button
              className="quiz-button about-button"
              onClick={() => navigate('/speed-reading')}
              style={{ marginBottom: '12px' }}
            >
              <span className="quiz-button-label">👁️ Speed Reading Practice</span>
              <span className="quiz-button-subtitle">Rapid Eye Movement training exercise</span>
            </button>

            <button
              className="quiz-button about-button"
              onClick={() => navigate('/focus-grid')}
              style={{ marginBottom: '12px' }}
            >
              <span className="quiz-button-label">🎯 Focus Grid</span>
              <span className="quiz-button-subtitle">Peripheral vision & focus training</span>
            </button>

            <button
              className="quiz-button about-button"
              onClick={() => navigate('/peg-system')}
              style={{ marginBottom: '12px' }}
            >
              <span className="quiz-button-label">🧠 Peg System</span>
              <span className="quiz-button-subtitle">Memory training with visual pegs</span>
            </button>

            <button
              className="quiz-button about-button"
              onClick={() => navigate('/reflects')}
              style={{ marginBottom: '12px' }}
            >
              <span className="quiz-button-label">🪞 Reflects</span>
              <span className="quiz-button-subtitle">Turn negative self-talk into positive affirmations</span>
            </button>

            <button
              className="quiz-button about-button"
              onClick={() => navigate('/ball-focus')}
              style={{ marginBottom: '12px' }}
            >
              <span className="quiz-button-label">🎱 Ball Focus Trainer</span>
              <span className="quiz-button-subtitle">Track bouncing balls to train your attention</span>
            </button>

            <button
              className="quiz-button about-button"
              onClick={() => navigate('/audio')}
              style={{ marginBottom: '12px' }}
            >
              <span className="quiz-button-label">🎧 Reset Your Brain</span>
              <span className="quiz-button-subtitle">Audio tracks to reset and recharge your mind</span>
            </button>

            <button
              className="quiz-button about-button"
              onClick={() => navigate('/nlp')}
              style={{ marginBottom: '12px' }}
            >
              <span className="quiz-button-label">🫧 NLP: Positive Affirmation</span>
              <span className="quiz-button-subtitle">Transform your self-image with guided exercises</span>
            </button>

            <button
              className="quiz-button about-button"
              onClick={() => navigate('/mental-math')}
              style={{ marginBottom: '12px' }}
            >
              <span className="quiz-button-label">🧮 Mental Math</span>
              <span className="quiz-button-subtitle">Train your brain with quick calculations</span>
            </button>

            <button
              className="quiz-button about-button"
              onClick={() => navigate('/timer')}
              style={{ marginBottom: '12px' }}
            >
              <span className="quiz-button-label">⏱️ Timer</span>
              <span className="quiz-button-subtitle">Speed Reading, Pomodoro & custom focus timers</span>
            </button>

            <button
              className="quiz-button about-button"
              onClick={() => navigate('/eye-exercise')}
              style={{ marginBottom: '12px' }}
            >
              <span className="quiz-button-label">👁️ Eye Movement Exercise</span>
              <span className="quiz-button-subtitle">Train reading eye movement with a tracking ball</span>
            </button>

            <button
              className="quiz-button about-button"
              onClick={() => navigate('/about')}
            >
              <span className="quiz-button-label">ℹ️ About These Quizzes</span>
              <span className="quiz-button-subtitle">Learn more about each assessment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
