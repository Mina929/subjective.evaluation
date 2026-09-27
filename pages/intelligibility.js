import { useState } from 'react';
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
    setScores(prev => ({
      ...prev,
      [wordIndex]: score
    }));
  };

  const handleSubmitSpeaker = async () => {
    const values = Object.values(scores);

    if (values.length !== wordsPerSpeaker.length) {
      alert('Please evaluate all words.');
      return;
    }

    // Calculate the proportion of correctly identified words
    const correctWords = values.filter(score => score === 1).length;
    const intelligibilityScore =
      correctWords / wordsPerSpeaker.length;

    setSpeakerAverage(intelligibilityScore.toFixed(2));

    try {
      await fetch('/api/save-intelligibility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          participantId,
          speakerId: speakers[currentSpeakerIndex],
          intelligibilityScore
        })
      });
    } catch (error) {
      console.error('Error saving intelligibility:', error);
    }
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
    <div
      style={{
        backgroundColor: '#024',
        color: 'white',
        minHeight: '100vh',
        padding: '2rem'
      }}
    >
      <h1 style={{ textAlign: 'center' }}>
        Word Intelligibility Test
      </h1>

      <p
        style={{
          textAlign: 'center',
          fontSize: '1rem',
          maxWidth: '800px',
          margin: '1rem auto'
        }}
      >
        In this Word Intelligibility Test, you will hear individual
        words spoken by different speakers. The target word will be
        displayed on the screen before each audio sample.
        <br /><br />

        After listening to the audio, determine whether you correctly
        understood the spoken word:
        <br />
        <strong>1 = Correctly understood</strong>
        <br />
        <strong>0 = Not correctly understood</strong>
        <br /><br />

        After evaluating all words for one speaker, submit your
        evaluation to proceed to the next speaker.
      </p>

      {submitted ? (
        <h2
          style={{
            textAlign: 'center',
            marginTop: '3rem'
          }}
        >
          Thank you for participating in this evaluation!
        </h2>
      ) : (
        <>
          <h2 style={{ textAlign: 'center' }}>
            Speaker {speakers[currentSpeakerIndex]}
          </h2>

          {wordsPerSpeaker.map((item, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#135',
                padding: '1rem',
                borderRadius: '10px',
                marginBottom: '1.5rem'
              }}
            >
              <p>
                <strong>Target word:</strong> {item.word}
              </p>

              <audio
                controls
                src={item.audio}
                style={{
                  width: '300px',
                  display: 'block',
                  margin: '0 auto'
                }}
              />

              <div
                style={{
                  textAlign: 'center',
                  marginTop: '1rem'
                }}
              >
                <p>Did you correctly understand the word?</p>

                <button
                  onClick={() => handleScore(index, 1)}
                  style={{
                    backgroundColor:
                      scores[index] === 1 ? '#4CAF50' : '#777',
                    color: 'white',
                    padding: '0.7rem 1.5rem',
                    margin: '0.5rem',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  1 — Yes
                </button>

                <button
                  onClick={() => handleScore(index, 0)}
                  style={{
                    backgroundColor:
                      scores[index] === 0 ? '#d9534f' : '#777',
                    color: 'white',
                    padding: '0.7rem 1.5rem',
                    margin: '0.5rem',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  0 — No
                </button>
              </div>
            </div>
          ))}

          {speakerAverage !== null && (
            <>
              <p
                style={{
                  textAlign: 'center',
                  fontSize: '1.2rem'
                }}
              >
                Intelligibility score for Speaker{' '}
                {speakers[currentSpeakerIndex]}:{' '}
                <strong>{speakerAverage}</strong>
              </p>

              <div
                style={{
                  textAlign: 'center',
                  marginTop: '2rem'
                }}
              >
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
                  {currentSpeakerIndex < speakers.length - 1
                    ? 'Next Speaker'
                    : 'Submit Evaluation'}
                </button>
              </div>
            </>
          )}

          {speakerAverage === null && (
            <div
              style={{
                textAlign: 'center',
                marginTop: '2rem'
              }}
            >
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