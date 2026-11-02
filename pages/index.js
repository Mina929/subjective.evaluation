import styles from '../styles/home.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function Home() {
  const [datetime, setDatetime] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [job, setJob] = useState('');
  const router = useRouter();

  useEffect(() => {
    const now = new Date();
    setDatetime(now.toLocaleString('en-GB'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/save-participant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, job })
    });

    const data = await res.json();
    const participantId = data.participantId;
    router.push(`/mos?participantId=${participantId}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.overlay}>

        <p className={styles.datetime}>{datetime}</p>

        {/* Logo + Titre ensemble */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem'
        }}>
          
          <h1 className={styles.title} style={{ marginLeft: '1rem' }}>
            Subjective Evaluation of Enhanced Dysarthric Speech
          </h1>
		  <Image
            src="/logo.png"
            alt="Speech Evaluation Logo"
            width={100}
            height={100}
          />
        </div>

        <p className={styles.intro}>
          This platform is part of an ongoing doctoral research project focused on improving the intelligibility of dysarthric speech. It aims to collect subjective assessments of enhanced speech quality and intelligibility, complementing objective evaluation metrics with human perception.

Your participation will contribute to advancing research in pathological speech processing and enhancement. Thank you for your valuable contribution!
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            First Name:
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>

          <label>
            Last Name:
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label>

          <label>
            Job:
            <select
              value={job}
              onChange={(e) => setJob(e.target.value)}
              required
            >
              <option value="">Select...</option>
              <option value="Speech Therapist">Speech Therapist</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <button type="submit">Start Evaluation</button>
        </form>

      </div>
    </div>
  );
}
