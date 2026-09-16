import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function MOSPage() {
  const router = useRouter();
  const { participantId } = router.query;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [scores, setScores] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Correction : chemin vers le dossier /public/audio
  const audios = [
    '/audio/mos/audio1.WAV',
    '/audio/mos/audio2.WAV',
    '/audio/mos/audio3.WAV',
    '/audio/mos/audio4.WAV',
    '/audio/mos/audio5.WAV'
  ];

  useEffect(() => {
    const now = new Date();
    setDatetime(now.toLocaleString('en-GB'));
  }, []);

  useEffect(() => {
    if (participantId) {
      fetch(`http://localhost:3001/api/get-participant/${participantId}`)
        .then((res) => res.json())
        .then((data) => {
          setFirstName(data.first_name);
          setLastName(data.last_name);
        })
        .catch(() => {
          setFirstName('');
          setLastName('');
        });
    }
  }, [participantId]);

  const handleScore = (index, score) => {
    setScores(prev => ({ ...prev, [index]: score }));
  };

  const handleSubmit = () => {
    const values = Object.values(scores);
    if (values.length !== audios.length) {
      alert('Please rate all audio clips.');
      return;
    }

    const average = values.reduce((a, b) => a + b, 0) / audios.length;

    fetch('http://localhost:3001/api/save-mos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        participantId,
        mosScore: average
      })
    }).then(() => {
      router.push(`/intelligibility?participantId=${participantId}`);
    });
  };

  return (
    <div style={{
      backgroundColor: '#024',
      color: 'white',
      fontFamily: 'Arial',
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <p style={{ textAlign: 'right', margin: 0 }}>{datetime}</p>
      <h1 style={{ textAlign: 'center' }}>
        {firstName && lastName
          ? `Welcome ${firstName} ${lastName} to MOS (Mean Opinion Score) Evaluation`
          : 'Loading participant info...'
          }
      </h1>

      <p style={{ textAlign: 'center', fontSize: '0.9rem' }}>
       MOS is a subjective test where you rate the overall quality of the speech, regardless of its content. After listening to each audio sample, please rate how clear, pleasant, and natural the sound is, using a scale from 1 (very poor) to 5 (excellent).
      </p>
      <p>
      </p>
      {submitted ? (
        <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>
          ✅ Thank you! Your evaluation has been submitted.
        </h2>
      ) : (
        <>
          {audios.map((audio, index) => (
            <div key={index} style={{
              backgroundColor: '#024',
              padding: '1rem',
              borderRadius: '10px',
              marginBottom: '2rem'
            }}>
              <audio controls src={audio} style={{ width: '50%' , margin: '0 auto',display: 'block'}} />

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                {[1, 2, 3, 4, 5].map(score => (
                  <button
                    key={score}
                    onClick={() => handleScore(index, score)}
                    style={{
                      margin: '0.5rem',
                      backgroundColor: scores[index] === score ? '#4CAF50' : '#555',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '5px',
                      fontSize: '1rem',
                      cursor: 'pointer'
                    }}
                  >
                    {score}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={handleSubmit}
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                padding: '1rem 2rem',
                fontSize: '1.2rem',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                marginTop: '2rem'
              }}
            >
              Submit Evaluation
            </button>
          </div>
        </>
      )}
    </div>
  );
}
