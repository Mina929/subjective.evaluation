import { useState } from 'react';
import { useRouter } from 'next/router';

export default function IntelligibilityPage() {
  const router = useRouter();
  const { participantId } = router.query;

  const [scores, setScores] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const words = [
    { word: 'Apple', audio: '/audio/apple.wav' },
    { word: 'Table', audio: '/audio/table.wav' },
    { word: 'Chair', audio: '/audio/chair.wav' },
  ];

  const handleScore = (index, score) => {
    setScores((previous) => ({
      ...previous,
      [index]: score,
    }));
  };

  const handleSubmit = async () => {
    if (!participantId) {
      alert('Participant information is missing. Please try again.');
      return;
    }

    if (words.some((_, index) => scores[index] === undefined)) {
      alert('Please evaluate all words before submitting.');
      return;
    }

    const correctWords = Object.values(scores).filter(
      (score) => score === 1
    ).length;

    const intelligibilityScore = correctWords / words.length;

    setSaving(true);

    try {
      const response = await fetch('/api/save-intelligibility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantId,
          speakerId: 'ALL',
          intelligibilityScore,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save intelligibility score.');
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Error saving intelligibility:', error);
      alert('Unable to save your evaluation. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f4f7fb',
        padding: '40px 20px',
        fontFamily: 'Arial, sans-serif',
        color: '#1f2937',
      }}
    >
      <div
        style={{
          maxWidth: '750px',
          margin: '0 auto',
          backgroundColor: '#ffffff',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
        }}
      >
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <h1>Thank You!</h1>
            <p>
              Your intelligibility evaluation has been submitted successfully.
            </p>
          </div>
        ) : (
          <>
            <h1 style={{ textAlign: 'center', color: '#17365d' }}>
              Intelligibility Test
            </h1>

            <p style={{ textAlign: 'center', lineHeight: 1.6 }}>
              Listen to each audio recording and indicate whether you can
              understand the word.
            </p>

            {words.map((item, index) => (
              <div
                key={item.word}
                style={{
                  marginTop: '25px',
                  padding: '20px',
                  border: '1px solid #dbe3ee',
                  borderRadius: '8px',
                }}
              >
                <h3>Audio {index + 1}</h3>

                <audio
                  controls
                  preload="none"
                  style={{ width: '100%', margin: '10px 0' }}
                >
                  <source src={item.audio} type="audio/wav" />
                  Your browser does not support audio playback.
                </audio>

                <p>Can you understand the word?</p>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => handleScore(index, 1)}
                    aria-pressed={scores[index] === 1}
                    style={{
                      padding: '10px 24px',
                      borderRadius: '6px',
                      border: '1px solid #176b45',
                      backgroundColor:
                        scores[index] === 1 ? '#176b45' : '#ffffff',
                      color: scores[index] === 1 ? '#ffffff' : '#176b45',
                      cursor: 'pointer',
                    }}
                  >
                    Yes
                  </button>

                  <button
                    type="button"
                    onClick={() => handleScore(index, 0)}
                    aria-pressed={scores[index] === 0}
                    style={{
                      padding: '10px 24px',
                      borderRadius: '6px',
                      border: '1px solid #b42318',
                      backgroundColor:
                        scores[index] === 0 ? '#b42318' : '#ffffff',
                      color: scores[index] === 0 ? '#ffffff' : '#b42318',
                      cursor: 'pointer',
                    }}
                  >
                    No
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              style={{
                display: 'block',
                width: '100%',
                marginTop: '30px',
                padding: '14px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: saving ? '#9ca3af' : '#17365d',
                color: '#ffffff',
                fontSize: '16px',
                cursor: saving ? 'not-allowed' : 'pointer',
              }}
            >
              {saving ? 'Submitting...' : 'Submit Evaluation'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}