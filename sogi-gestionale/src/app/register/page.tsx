'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../login/auth.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    scuola: '',
    password: '',
    confirmPassword: '',
    ruolo: 'docente' as 'admin' | 'docente',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validazione
    if (formData.password !== formData.confirmPassword) {
      setError('Le password non corrispondono');
      return;
    }

    if (formData.password.length < 6) {
      setError('La password deve essere di almeno 6 caratteri');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nome,
          cognome: formData.cognome,
          email: formData.email,
          scuola: formData.scuola,
          password: formData.password,
          ruolo: formData.ruolo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Errore durante la registrazione');
        setLoading(false);
        return;
      }

      // Registrazione completata, redirect al login
      router.push('/login?registered=true');
    } catch (err) {
      setError('Errore durante la registrazione');
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1>SOGI UDA</h1>
          <p>Gestionale per l'assegnazione ore</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <h2>Registrati</h2>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="nome">Nome</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="cognome">Cognome</label>
              <input
                type="text"
                id="cognome"
                name="cognome"
                value={formData.cognome}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="scuola">Scuola</label>
            <input
              type="text"
              id="scuola"
              name="scuola"
              value={formData.scuola}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="ruolo">Ruolo</label>
            <select
              id="ruolo"
              name="ruolo"
              value={formData.ruolo}
              onChange={handleChange}
              required
            >
              <option value="docente">Docente</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Conferma Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Registrazione in corso...' : 'Registrati'}
          </button>

          <div className={styles.authFooter}>
            <p>
              Hai già un account?{' '}
              <Link href="/login">Accedi</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
