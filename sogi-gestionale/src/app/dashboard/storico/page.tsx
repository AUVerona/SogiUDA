'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './storico.module.css';

interface Assignment {
  _id: string;
  livello: string;
  livelloNome: string;
  data: string;
  createdAt: string;
  docente?: {
    nome: string;
    cognome: string;
  };
  assegnazioni: any[];
}

export default function StoricoPage() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingAssignment, setViewingAssignment] = useState<Assignment | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{show: boolean, id: string, name: string} | null>(null);
  const [filter, setFilter] = useState({
    livello: '',
    search: '',
  });

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await fetch('/api/assignments');
      if (response.ok) {
        const data = await response.json();
        setAssignments(data.assignments);
      }
    } catch (error) {
      console.error('Errore caricamento:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssignments = assignments.filter((assignment) => {
    if (filter.livello && assignment.livello !== filter.livello) {
      return false;
    }
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      return (
        assignment.livelloNome.toLowerCase().includes(searchLower) ||
        assignment.livello.toLowerCase().includes(searchLower) ||
        (assignment.docente &&
          `${assignment.docente.nome} ${assignment.docente.cognome}`
            .toLowerCase()
            .includes(searchLower))
      );
    }
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTotalHours = (assignment: Assignment) => {
    return assignment.assegnazioni.reduce((total, section) => {
      const sectionTotal = section.subtopics.reduce(
        (sum: number, subtopic: any) =>
          sum + subtopic.hours + subtopic.distanceHours,
        0
      );
      return total + sectionTotal;
    }, 0);
  };

  const handleDelete = (id: string, docenteName: string) => {
    setDeleteConfirm({ show: true, id, name: docenteName });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      const response = await fetch(`/api/assignments/${deleteConfirm.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchAssignments(); // Ricarica la lista
        setDeleteConfirm(null);
      } else {
        alert('❌ Errore durante l\'eliminazione');
      }
    } catch (error) {
      console.error('Errore eliminazione:', error);
      alert('❌ Errore di rete');
    }
  };

  const handleView = (assignment: Assignment) => {
    setViewingAssignment(assignment);
  };

  const handleEdit = (assignment: Assignment) => {
    // Naviga direttamente alla pagina di assegnazione con l'ID
    router.push(`/dashboard/assegnazione?edit=${assignment._id}`);
  };

  const handleDownloadPDF = async (assignment: Assignment) => {
    try {
      const docenteName = assignment.docente 
        ? `${assignment.docente.nome} ${assignment.docente.cognome}`
        : 'Docente';
      
      // Crea il contenuto HTML per il PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Assegnazione ${docenteName}</title>
          <style>
            @media print {
              body { margin: 0; }
            }
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #0066cc; font-size: 24px; margin-bottom: 10px; }
            .meta { color: #666; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; page-break-inside: avoid; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #0066cc; color: white; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .section-title { font-size: 18px; color: #0066cc; margin-top: 30px; margin-bottom: 10px; font-weight: bold; page-break-after: avoid; }
            .totals { margin-top: 30px; font-weight: bold; font-size: 16px; }
          </style>
        </head>
        <body>
          <h1>Assegnazione Ore - ${docenteName}</h1>
          <div class="meta">
            <strong>Livello:</strong> ${assignment.livelloNome || assignment.livello}<br>
            <strong>Data:</strong> ${new Date(assignment.createdAt).toLocaleDateString('it-IT')}
          </div>
          
          ${assignment.assegnazioni.map(section => `
            <div class="section-title">${section.sectionTitle}</div>
            <table>
              <thead>
                <tr>
                  <th>Competenza</th>
                  <th>Ore Assegnate</th>
                  <th>Ore a Distanza</th>
                </tr>
              </thead>
              <tbody>
                ${section.subtopics.map((subtopic: any) => `
                  <tr>
                    <td>${subtopic.label}</td>
                    <td>${subtopic.hours}</td>
                    <td>${subtopic.distanceHours || 0}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `).join('')}
          
          <div class="totals">
            Totale Ore: ${getTotalHours(assignment)} ore
          </div>
        </body>
        </html>
      `;

      // Crea un Blob con il contenuto HTML
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Crea un elemento <a> per il download
      const link = document.createElement('a');
      const filename = `assegnazione_${docenteName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
      link.href = url;
      link.download = filename;
      
      // Aggiungi al DOM, clicca e rimuovi
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Pulisci l'URL
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
      // Mostra messaggio di successo
      alert('✅ File scaricato! Puoi aprirlo e salvarlo come PDF stampando dal browser (Ctrl+P > Salva come PDF)');
    } catch (error) {
      console.error('Errore download:', error);
      alert('❌ Errore durante il download');
    }
  };

  const handlePrint = (assignment: Assignment) => {
    // Crea una finestra di stampa con i dati dell'assegnazione
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Assegnazione ${assignment.livelloNome}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #0066cc; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #0066cc; color: white; }
            .section-title { background-color: #f0f0f0; font-weight: bold; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>${assignment.livelloNome}</h1>
          <p><strong>Livello:</strong> ${assignment.livello}</p>
          <p><strong>Data:</strong> ${formatDate(assignment.createdAt)}</p>
          ${assignment.docente ? `<p><strong>Docente:</strong> ${assignment.docente.nome} ${assignment.docente.cognome}</p>` : ''}
          <p><strong>Ore totali:</strong> ${getTotalHours(assignment)}</p>
          
          <table>
            <thead>
              <tr>
                <th>Competenza</th>
                <th>Ore Totali</th>
                <th>Ore a Distanza</th>
              </tr>
            </thead>
            <tbody>
              ${assignment.assegnazioni.map(section => `
                <tr class="section-title">
                  <td colspan="3">${section.sectionTitle}</td>
                </tr>
                ${section.subtopics.map((subtopic: any) => `
                  <tr>
                    <td>${subtopic.label}</td>
                    <td>${subtopic.hours}</td>
                    <td>${subtopic.distanceHours || 0}</td>
                  </tr>
                `).join('')}
              `).join('')}
            </tbody>
          </table>
          
          <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background: #0066cc; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Stampa
          </button>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  if (viewingAssignment) {
    return (
      <div className={styles.container}>
        <div className={styles.viewHeader}>
          <button onClick={() => setViewingAssignment(null)} className={styles.backButton}>
            ← Indietro
          </button>
          <h1>Visualizza Assegnazione</h1>
        </div>

        <div className={styles.viewCard}>
          <div className={styles.viewCardHeader}>
            <div>
              <h2>{viewingAssignment.livelloNome}</h2>
              <span className={styles.badge}>{viewingAssignment.livello}</span>
            </div>
            <div className={styles.viewMeta}>
              {viewingAssignment.docente && (
                <p><strong>Docente:</strong> {viewingAssignment.docente.nome} {viewingAssignment.docente.cognome}</p>
              )}
              <p><strong>Data:</strong> {formatDate(viewingAssignment.createdAt)}</p>
              <p><strong>Ore totali:</strong> {getTotalHours(viewingAssignment)}</p>
            </div>
          </div>

          <div className={styles.viewContent}>
            {viewingAssignment.assegnazioni.map((section, idx) => (
              <div key={idx} className={styles.viewSection}>
                <h3 className={styles.viewSectionTitle}>{section.sectionTitle}</h3>
                <table className={styles.viewTable}>
                  <thead>
                    <tr>
                      <th>Competenza</th>
                      <th>Ore Totali</th>
                      <th>Ore a Distanza</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.subtopics.map((subtopic: any, subIdx: number) => (
                      <tr key={subIdx}>
                        <td>{subtopic.label}</td>
                        <td>{subtopic.hours}</td>
                        <td>{subtopic.distanceHours || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Caricamento...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Storico Assegnazioni</h1>
          <p>Visualizza tutte le assegnazioni ore effettuate</p>
        </div>
      </div>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Cerca per livello, docente..."
          className={styles.searchInput}
          value={filter.search}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
        />

        <select
          className={styles.filterSelect}
          value={filter.livello}
          onChange={(e) => setFilter({ ...filter, livello: e.target.value })}
        >
          <option value="">Tutti i livelli</option>
          <option value="Alpha">Alpha</option>
          <option value="Primo">Primo</option>
          <option value="Secondo">Secondo</option>
          <option value="SecondoLivello">AFM</option>
        </select>
      </div>

      {filteredAssignments.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Nessuna assegnazione trovata</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredAssignments.map((assignment) => (
            <div key={assignment._id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h3>{assignment.livelloNome}</h3>
                  <span className={styles.badge}>{assignment.livello}</span>
                </div>
                <span className={styles.totalHours}>
                  {getTotalHours(assignment)} ore
                </span>
              </div>

              <div className={styles.cardBody}>
                {assignment.docente && (
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Docente:</span>
                    <span className={styles.value}>
                      {assignment.docente.nome} {assignment.docente.cognome}
                    </span>
                  </div>
                )}

                <div className={styles.infoRow}>
                  <span className={styles.label}>Data:</span>
                  <span className={styles.value}>
                    {formatDate(assignment.createdAt)}
                  </span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.label}>Sezioni:</span>
                  <span className={styles.value}>
                    {assignment.assegnazioni.length}
                  </span>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <button
                  className={styles.actionButton}
                  onClick={() => handleView(assignment)}
                  title="Visualizza"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  Visualizza
                </button>
                <button
                  className={styles.actionButton}
                  onClick={() => handleEdit(assignment)}
                  title="Modifica"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Modifica
                </button>
                <button
                  className={styles.actionButton}
                  onClick={() => handlePrint(assignment)}
                  title="Stampa"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                  </svg>
                  Stampa
                </button>
                <button
                  className={styles.actionButton}
                  onClick={() => handleDownloadPDF(assignment)}
                  title="Scarica PDF"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  PDF
                </button>
                <button
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                  onClick={() => handleDelete(assignment._id, assignment.docente ? `${assignment.docente.nome} ${assignment.docente.cognome}` : 'Questa assegnazione')}
                  title="Elimina"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                  Elimina
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modale di conferma eliminazione */}
      {deleteConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>Conferma Eliminazione</h2>
            <p className={styles.modalText}>
              Sei sicuro di voler eliminare l'assegnazione di <strong>{deleteConfirm.name}</strong>?
            </p>
            <p className={styles.modalWarning}>
              Questa azione non può essere annullata.
            </p>
            <div className={styles.modalButtons}>
              <button
                className={styles.modalButtonCancel}
                onClick={() => setDeleteConfirm(null)}
              >
                Annulla
              </button>
              <button
                className={styles.modalButtonConfirm}
                onClick={confirmDelete}
              >
                Elimina
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
