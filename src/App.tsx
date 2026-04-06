import { useState } from 'react';
import type { FormEvent } from 'react';

const employmentOptions = ['salaried', 'self-employed', 'contractor', 'unemployed'];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [name, setName] = useState('');
  const [income, setIncome] = useState('');
  const [creditScore, setCreditScore] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [employmentType, setEmploymentType] = useState(employmentOptions[0]);
  const [result, setResult] = useState<{ decision: string; reason: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setResult(null);

    const payload = {
      name: name.trim(),
      income: Number(income),
      creditScore: Number(creditScore),
      loanAmount: Number(loanAmount),
      employmentType,
    };

    if (!payload.name) {
      setError('Please enter a name.');
      return;
    }

    if (Number.isNaN(payload.income) || payload.income <= 0) {
      setError('Please enter a valid income.');
      return;
    }

    if (Number.isNaN(payload.creditScore) || payload.creditScore < 0 || payload.creditScore > 850) {
      setError('Please enter a credit score between 0 and 850.');
      return;
    }

    if (Number.isNaN(payload.loanAmount) || payload.loanAmount <= 0) {
      setError('Please enter a valid loan amount.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/evaluate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Unable to submit loan application.');
      } else {
        setResult({ decision: data.decision, reason: data.reason });
      }
    } catch (fetchError) {
      setError('Unable to connect to the loan server.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="app-container">
      <section className="card">
        <h1>Loan application</h1>
        <p>Submit your details to receive an instant decision.</p>

        <form onSubmit={handleSubmit}>
          <label>
            Name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Full name"
              required
            />
          </label>

          <label>
            Income
            <input
              type="number"
              value={income}
              onChange={(event) => setIncome(event.target.value)}
              placeholder="Annual income"
              min="0"
              step="0.01"
              required
            />
          </label>

          <label>
            Credit score
            <input
              type="number"
              value={creditScore}
              onChange={(event) => setCreditScore(event.target.value)}
              placeholder="0 - 850"
              min="0"
              max="850"
              step="1"
              required
            />
          </label>

          <label>
            Loan amount
            <input
              type="number"
              value={loanAmount}
              onChange={(event) => setLoanAmount(event.target.value)}
              placeholder="Requested loan amount"
              min="0"
              step="0.01"
              required
            />
          </label>

          <label>
            Employment type
            <select value={employmentType} onChange={(event) => setEmploymentType(event.target.value)}>
              {employmentOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          {error && <div className="message error">{error}</div>}
          {result && (
            <div className="message success">
              <strong>{result.decision}</strong>
              <p>{result.reason}</p>
            </div>
          )}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Evaluate loan'}
          </button>
        </form>
      </section>
    </main>
  );
}

export default App;
