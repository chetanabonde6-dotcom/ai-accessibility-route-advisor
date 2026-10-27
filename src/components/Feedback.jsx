import { useState } from 'react';
import { ArrowUpRight, Download, MessageSquare, Trash2 } from 'lucide-react';
import {
  FEEDBACK_KEY,
  downloadFile,
  readRecords,
  writeRecords,
} from '../lib/storage.js';
export default function Feedback() {
  const [category, setCategory] = useState('Accessibility detail');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState('');
  const [records, setRecords] = useState(() => readRecords(FEEDBACK_KEY));
  const submit = e => {
    e.preventDefault();
    if (message.trim().length < 10) {
      setStatus('Please describe your feedback in at least 10 characters.');
      return;
    }
    if (!consent) {
      setStatus('Please agree to save the note on this device.');
      return;
    }
    const next = [
      {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        category,
        message: message.trim(),
        source: 'local-demo-feedback',
      },
      ...records,
    ].slice(0, 30);
    if (writeRecords(FEEDBACK_KEY, next)) {
      setRecords(next);
      setMessage('');
      setConsent(false);
      setStatus(
        'Feedback saved on this device. Nothing was sent to the project team.'
      );
    } else
      setStatus(
        'Device storage is unavailable. Copy your note before leaving this page.'
      );
  };
  const clear = () => {
    if (writeRecords(FEEDBACK_KEY, [])) {
      setRecords([]);
      setStatus('Local feedback cleared from this device.');
    } else setStatus('Unable to update browser storage.');
  };
  return (
    <section className="section contact-section" id="contact">
      <div className="container contact-grid reveal">
        <div className="contact-copy">
          <p className="eyebrow">
            <span>05 /</span> BETTER, TOGETHER
          </p>
          <h2>
            Every perspective
            <br />
            moves us <span>forward.</span>
          </h2>
          <p>
            What would make an accessibility advisor more useful to you? Leave a
            note for your project review.
          </p>
          <div className="contact-detail">
            <MessageSquare size={18} />
            <span>
              No account. No personal details.
              <br />
              <strong>Your feedback stays on your device.</strong>
            </span>
          </div>
          <div className="local-data-controls">
            <span>
              {records.length} saved {records.length === 1 ? 'note' : 'notes'}
            </span>
            <button
              type="button"
              className="text-button"
              disabled={!records.length}
              onClick={() =>
                downloadFile(
                  'ai-accessibility-route-advisor-local-feedback.json',
                  JSON.stringify(
                    {
                      notice:
                        'Local educational demo feedback, not verified survey results',
                      records,
                    },
                    null,
                    2
                  ),
                  'application/json'
                )
              }
            >
              <Download size={13} /> Export notes
            </button>
            <button
              type="button"
              className="icon-button"
              disabled={!records.length}
              onClick={clear}
              aria-label="Clear all local feedback"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        <form className="feedback-form" onSubmit={submit}>
          <label htmlFor="feedback-category">WHAT’S ON YOUR MIND?</label>
          <select
            id="feedback-category"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option>Accessibility detail</option>
            <option>Route planner experience</option>
            <option>Directory information</option>
            <option>Something else</option>
          </select>
          <label htmlFor="feedback-message">YOUR PERSPECTIVE</label>
          <textarea
            id="feedback-message"
            rows="4"
            minLength="10"
            maxLength="1500"
            required
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="A small detail can make a big difference…"
          />
          <div className="character-count">{message.length} / 1500</div>
          <label className="consent-label">
            <input
              type="checkbox"
              checked={consent}
              required
              onChange={e => setConsent(e.target.checked)}
            />
            <span>
              Save this note in my browser. I understand it is not sent to
              anyone.
            </span>
          </label>
          <button type="submit" className="button button-lime">
            Save my feedback <ArrowUpRight size={17} />
          </button>
          <p role="status" className="feedback-status">
            {status}
          </p>
        </form>
      </div>
    </section>
  );
}

