import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function IntelligibilityPage() {
  const router = useRouter();
  const { participantId } = router.query;

  const speakers = ['F02', 'F03', 'F04', 'F05', 'F06', 'F07', 'F08', 'F09'];
  const [currentSpeakerIndex, setCurrentSpeakerIndex] = useState(0);
  const [scores, setScores] = useState({});
  const [speakerAverage, setSpeakerAverage] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const wordsPerSpeaker = [
    { word: 'Apple', audio: '/audio/apple.wav' },
    { word: 'Table', audio: '/audio/table.wav' },
    { word: 'Chair', audio: '/audio/chair.wav' }
  ];

  const handleScore = (wordIndex, score) => {
    setScores(prev => ({ ...prev, [wordIndex]: score }));
  };

  const handleSubmitSpeaker = () => {
    const values = Object.values(scores);
    if (values.length !== wordsPerSpeaker.length) {
      alert('Please score all words.');
      return;
    }

    const average = values.reduce((a, b) => a + parseFloat(b), 0) / wordsPerSpeaker.length;
    setSpeakerAverage(average.toFixed(2));

    fetch('/api/save-intelligibility', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        participantId,
        speakerId: speakers[currentSpeakerIndex],
        intelligibilityScore: average
      })
    });
  };

  const handleNextSpeaker = () => {
    setScores({});
    setSpeakerAverage(null);

    if (currentSpeakerIndex < speakers.length - 1) {
      setCurrentSpeakerIndex(currentSpeakerIndex + 1);
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div style={{ backgroundColor: '#024', color: 'white', minHeight: '100vh', padding: '2rem' }}>
      <h1 style={{ textAlign: 'center' }}>Word Intelligibility Test</h1>

      <p style={{
        textAlign: 'center',
        fontSize: '1rem',
        maxWidth: '800px',
        margin: '1rem auto'
      }}>
        In this Word Intelligibility Test, you will hear individual words spoken by different speakers.
        After listening to each word, please assess how understandable the word was by providing a score between 0 and 1:
        <br /><br />
        After evaluating all words for one speaker, submit your evaluation to proceed to the next speaker.
      </p>

      {submitted ? (
        <h2 style={{ textAlign: 'center', marginTop: '3rem' }}>
          ✅ Thank you for participating in this evaluation!
        </h2>
      ) : (
        <>
          <h2 style={{ textAlign: 'center' }}>
            Speaker {speakers[currentSpeakerIndex]}
          </h2>

          {wordsPerSpeaker.map((item, index) => (
            <div key={index} style={{
              backgroundColor: '#135',
              padding: '1rem',
              borderRadius: '10px',
              marginBottom: '1.5rem'
            }}>
              <p>Word: {item.word}</p>
              <audio controls src={item.audio} style={{
                width: '300px',
                display: 'block',
                margin: '0 auto'
              }} />

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <label>
                  Score (0 or 1):
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={scores[index] || ''}
                    onChange={(e) => handleScore(index, e.target.value)}
                    style={{
                      marginLeft: '0.5rem',
                      padding: '0.5rem',
                      width: '80px'
                    }}
                  />
                </label>
              </div>
            </div>
          ))}

          {speakerAverage !== null && (
            <>
              <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>
                ✅ Average score for Speaker {speakers[currentSpeakerIndex]}: <strong>{speakerAverage}</strong>
              </p>

              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                {currentSpeakerIndex < speakers.length - 1 ? (
                  <button
                    onClick={handleNextSpeaker}
                    style={{
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      padding: '1rem 2rem',
                      fontSize: '1.2rem',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: 'pointer'
                    }}
                  >
                    Next Speaker
                  </button>
                ) : (
                  <button
                    onClick={handleNextSpeaker}
                    style={{
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      padding: '1rem 2rem',
                      fontSize: '1.2rem',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: 'pointer'
                    }}
                  >
                    Submit Evaluation
                  </button>
                )}
              </div>
            </>
          )}

          {speakerAverage === null && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button
                onClick={handleSubmitSpeaker}
                style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  padding: '1rem 2rem',
                  fontSize: '1.2rem',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}
              >
                Submit Speaker {speakers[currentSpeakerIndex]}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
