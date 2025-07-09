'use client';

import { useState } from 'react';

export default function Home() {
  const [timetable, setTimetable] = useState('');
  const [tasks, setTasks] = useState('');
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse([]);

    const tasksArray = tasks.split('\n').filter(t => t.trim() !== '');

    try {
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timetable, tasks: tasksArray }),
      });

      const data = await res.json();
      if (Array.isArray(data.schedule)) {
        setResponse(data.schedule);
      } else {
        setResponse([{ time: '', task: data.schedule || data.error || 'No response' }]);
      }
    } catch (err) {
      setResponse([{ time: '', task: 'Error sending request.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🧠 AI Task Scheduler</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>🕒 Timetable</label>
          <textarea
            style={styles.textarea}
            rows="6"
            value={timetable}
            onChange={(e) => setTimetable(e.target.value)}
            placeholder="Example: 9AM-10AM: Free\n10AM-11AM: Meeting"
          />

          <label style={styles.label}>📋 Tasks (one per line)</label>
          <textarea
            style={styles.textarea}
            rows="6"
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
            placeholder="Example: Buy groceries\nCall mom"
          />

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? '⏳ Scheduling...' : '🚀 Submit Tasks'}
          </button>
        </form>

        {response.length > 0 && (
          <div style={styles.responseBox}>
            <h3>📅 Updated Schedule</h3>
            <ul style={styles.list}>
              {response.map((item, index) => (
                <li key={index} style={styles.listItem}>
                  <strong>{item.time}</strong>{item.time && ':'} {item.task}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}

const styles = {
  container: {
    padding: '2rem',
    background: '#f7f9fc',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    background: '#fff',
    borderRadius: '1rem',
    padding: '2rem',
    maxWidth: '700px',
    width: '100%',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
  },
  title: {
    marginBottom: '1.5rem',
    textAlign: 'center',
    color: '#2c3e50',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  label: {
    fontWeight: 'bold',
    color: '#34495e',
  },
  textarea: {
    padding: '1rem',
    borderRadius: '0.5rem',
    border: '1px solid #ccc',
    fontSize: '1rem',
    resize: 'vertical',
  },
  button: {
    padding: '0.75rem 1rem',
    border: 'none',
    borderRadius: '0.5rem',
    backgroundColor: '#3498db',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  responseBox: {
    marginTop: '2rem',
    background: '#f0f8ff',
    padding: '1rem',
    borderRadius: '0.75rem',
  },
  list: {
    paddingLeft: '1rem',
    marginTop: '0.5rem',
  },
  listItem: {
    marginBottom: '0.5rem',
    lineHeight: '1.6',
  },
};
