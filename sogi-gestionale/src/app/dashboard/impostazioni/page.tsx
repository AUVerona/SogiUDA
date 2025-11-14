'use client';

import { useSession } from 'next-auth/react';
import styles from './impostazioni.module.css';

export default function ImpostazioniPage() {
  const { data: session } = useSession();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Impostazioni</h1>
        <p>Gestisci il tuo profilo e le preferenze</p>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2>Profilo Utente</h2>
          <div className={styles.profileInfo}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Nome Completo:</span>
              <span className={styles.value}>{session?.user?.name}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Email:</span>
              <span className={styles.value}>{session?.user?.email}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Ruolo:</span>
              <span className={styles.value}>
                {session?.user?.role === 'admin' ? 'Amministratore' : 'Docente'}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Scuola:</span>
              <span className={styles.value}>{session?.user?.scuola}</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Funzionalità in Sviluppo</h2>
          <div className={styles.comingSoon}>
            <p>Le seguenti funzionalità saranno disponibili a breve:</p>
            <ul>
              <li>Cambio password</li>
              <li>Modifica dati profilo</li>
              <li>Gestione notifiche</li>
              <li>Esportazione dati</li>
              <li>Preferenze di visualizzazione</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
