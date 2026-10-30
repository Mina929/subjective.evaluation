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

  // Reference and enhanced speech for each sample
  const audioPairs = [
    {
      reference: '/audio/mos/reference1.WAV',
      enhanced: '/audio/mos/Copie de ablutions.wav'
    },
    {
      reference: '/audio/mos/reference2.WAV',
      enhanced: '/audio/mos/Copie de absolve.wav'
    },
    {
      reference: '/audio/mos/reference3.WAV',
      enhanced: '/audio/mos/Copie de adhesion.wav'
    },
    {
      reference: '/audio/mos/reference4.WAV',
      enhanced: '/audio/mos/Copie de adjacent.wav'
    },
	{
      reference: '/audio/mos/reference3.WAV',
      enhanced: '/audio/mos/Copie de although.wav'
    },
	{
      reference: '/audio/mos/reference3.WAV',
      enhanced: '/audio/mos/Copie de anxieties.wav'
    },
	{
      reference: '/audio/mos/reference3.WAV',
      enhanced: '/audio/mos/Copie de apothecary.wav'
    },
	{
      reference: '/audio/mos/reference3.WAV',
      enhanced: '/audio/mos/Copie de apprehend.wav'
    },
    {
      reference: '/audio/mos/reference5.WAV',
      enhanced: '/audio/mos/Copie de advantageous.wav'
    },
    {
      reference: '/audio/mos/reference5.WAV',
      enhanced: '/audio/mos/Copie de approach.wav'
    },
    {
      reference: '/audio/mos/reference5.WAV',
      enhanced: '/audio/mos/Copie de astounded.wav'
    },
    {
      reference: '/audio/mos/reference5.WAV',
      enhanced: '/audio/mos/Copie de atrocious.wav'
    },
    {
      reference: '/audio/mos/reference5.WAV',
      enhanced: '/audio/mos/Copie de authoritative.wav'
    },
    {
      reference: '/audio/mos/reference5.WAV',
      enhanced: '/audio/mos/Copie de battlefield.wav'
    },
    {
      reference: '/audio/mos/reference5.WAV',
      enhanced: '/audio/mos/Copie de battlements.wav'
    },
    {
      reference: '/audio/mos/reference5.WAV',
      enhanced: '/audio/mos/Copie de betroth.wav'
    }
  ];

  useEffect(() => {
    const now = new Date();
    setDatetime(now.toLocaleString('en-GB'));
  }, []);

  useEffect(() => {
    if (participantId) {
      fetch(`/api/get-participant/${participantId}`)
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
    setScores((prev) => ({
      ...prev,
      [index]: score
    }));
  };

  const handleSubmit = () => {
    const values = Object.values(scores);

    if (values.length !== audioPairs.length) {
      alert('Please rate all enhanced speech samples.');
      return;
    }

    const average =
      values.reduce((a, b) => a + b, 0) / audioPairs.length;

    fetch('/api/save-mos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        participantId,
        mosScore: average
      })
    })
      .then(() => {
        setSubmitted(true);
        router.push(`/intelligibility?participantId=${participantId}`);
      })
      .catch(() => {
        alert('An error occurred while submitting your evaluation.');
      });
  };

  return (
    <div
      style={{
        backgroundColor: '#024',
        color: 'white',
        fontFamily: 'Arial',
        minHeight: '100vh',
        padding: '2rem'
      }}
    >
      <p style={{ textAlign: 'right', margin: 0 }}>
        {datetime}
      </p>

      <h1 style={{ textAlign: 'center' }}>
        {firstName && lastName
          ? `Welcome ${firstName} ${lastName} to MOS (Mean Opinion Score) Evaluation`
          : 'Loading participant info...'}
      </h1>

      {/* Introduction */}
      <p
        style={{
          textAlign: 'center',
          fontSize: '0.95rem',
          lineHeight: '1.5',
          maxWidth: '1000px',
          margin: '1.5rem auto 2.5rem'
        }}
      >
        In this test, you will listen to a reference speech sample
        followed by its enhanced version. The reference is provided
        only as a guide to help you understand the intended speech.
        Please listen to both samples and then rate the overall quality
        of the enhanced speech on a scale from 1 (very poor) to
        5 (excellent), considering its clarity, naturalness, and
        pleasantness.
      </p>

      {submitted ? (
        <h2
          style={{
            textAlign: 'center',
            marginTop: '2rem'
          }}
        >
          Thank you! Your evaluation has been submitted.
        </h2>
      ) : (
        <>
          {audioPairs.map((pair, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#024',
                padding: '1.5rem',
                borderRadius: '10px',
                marginBottom: '2.5rem'
              }}
            >
              {/* Sample title */}
              <h2
                style={{
                  textAlign: 'center',
                  marginBottom: '1.5rem'
                }}
              >
                Sample {index + 1}
              </h2>

              {/* Two audio samples side by side */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '3rem',
                  flexWrap: 'wrap'
                }}
              >
                {/* Reference */}
                <div
                  style={{
                    flex: '1 1 400px',
                    maxWidth: '500px',
                    textAlign: 'center'
                  }}
                >
                  <p
                    style={{
                      fontWeight: 'bold',
                      marginBottom: '0.8rem'
                    }}
                  >
                    Reference Speech
                  </p>

                  <audio
                    controls
                    src={pair.reference}
                    style={{
                      width: '100%'
                    }}
                  />
                </div>

                {/* Enhanced */}
                <div
                  style={{
                    flex: '1 1 400px',
                    maxWidth: '500px',
                    textAlign: 'center'
                  }}
                >
                  <p
                    style={{
                      fontWeight: 'bold',
                      marginBottom: '0.8rem'
                    }}
                  >
                    Enhanced Speech
                  </p>

                  <audio
                    controls
                    src={pair.enhanced}
                    style={{
                      width: '100%'
                    }}
                  />
                </div>
              </div>

              {/* Rating */}
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '1.5rem'
                }}
              >
                <p
                  style={{
                    marginBottom: '0.5rem'
                  }}
                >
                  Rate the overall quality of the enhanced speech:
                </p>

                {[1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    onClick={() => handleScore(index, score)}
                    style={{
                      margin: '0.5rem',
                      backgroundColor:
                        scores[index] === score
                          ? '#4CAF50'
                          : '#555',
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

          {/* Submit */}
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
                marginTop: '1rem'
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
