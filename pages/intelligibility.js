import { useState } from 'react';
import { useRouter } from 'next/router';

export default function IntelligibilityPage() {
const router = useRouter();
const { participantId } = router.query;

const [scores, setScores] = useState({});
const [intelligibilityScore, setIntelligibilityScore] = useState(null);
const [submitted, setSubmitted] = useState(false);
const [saving, setSaving] = useState(false);

const words = [
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

const handleSubmit = async () => {
if (!participantId) {
alert('Participant information is missing. Please try again.');
return;
}

```
if (Object.keys(scores).length !== words.length) {
  alert('Please evaluate all words before submitting.');
  return;
}

const correctWords = Object.values(scores).filter(
  score => score === 1
).length;

const score = correctWords / words.length;

setSaving(true);

try {
  const response = await fetch('/api/save-intelligibility', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      participantId,
      speakerId: 'ALL',
      intelligibilityScore: score
    })
  });

  if (!response.ok) {
    throw new Error('Failed to save intelligibility score.');
  }

  setIntelligibilityScore(score);
  setSubmitted(true);
} catch (error) {
  console.error('Error saving intelligibility:', error);
  alert('Unable to save your evaluation. Please try again.');
} finally {
  setSaving(false);
}
```

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
Word Intelligibility Test </h1>

```
  {submitted ? (
    <div
      style={{
        textAlign: 'center',
        marginTop: '3rem'
      }}
    >
      <h2>Thank you for participating!</h2>
      <p>Your evaluation has been saved successfully.</p>
      <p>
        Overall intelligibility score:{' '}
        <strong>
          {(intelligibilityScore * 100).toFixed(0)}%
        </strong>
      </p>
    </div>
  ) : (
    <>
      <p
        style={{
          textAlign: 'center',
          fontSize: '1rem',
          maxWidth: '800px',
          margin: '1rem auto 2rem'
        }}
      >
        You will hear three words. Listen to each audio sample
        and indicate whether you correctly understood the word.
        The target word is displayed on the screen.
        <br /><br />
        <strong>1 = Correctly understood</strong>
        <br />
        <strong>0 = Not correctly understood</strong>
        <br /><br />
        Please evaluate every word before submitting your
        answers.
      </p>

      {words.map((item, index) => (
        <div
          key={item.word}
          style={{
            backgroundColor: '#135',
            padding: '1rem',
            borderRadius: '10px',
            margin: '0 auto 1.5rem',
            maxWidth: '800px'
          }}
        >
          <h2>
            Word {index + 1}: {item.word}
          </h2>

          <audio
            controls
            src={item.audio}
            style={{
              width: '100%',
              maxWidth: '400px',
              display: 'block',
              margin: '1rem auto'
            }}
          />

          <div style={{ textAlign: 'center' }}>
            <p>Did you correctly understand the word?</p>

            <button
              type="button"
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
              type="button"
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

            <p>
              {scores[index] === undefined
                ? 'Not evaluated yet'
                : scores[index] === 1
                ? 'Answer: Correctly understood'
                : 'Answer: Not correctly understood'}
            </p>
          </div>
        </div>
      ))}

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          style={{
            backgroundColor: saving ? '#777' : '#4CAF50',
            color: 'white',
            padding: '1rem 2rem',
            fontSize: '1.2rem',
            border: 'none',
            borderRadius: '10px',
            cursor: saving ? 'not-allowed' : 'pointer'
          }}
        >
          {saving ? 'Submitting...' : 'Submit Evaluation'}
        </button>
      </div>
    </>
  )}
</div>


);
}
