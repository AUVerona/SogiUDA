"use client";
import React, { useState, useEffect } from "react";

function IconButton({ label, icon, onClick }: { label: string; icon: React.ReactNode; onClick?: () => void }) {
  return (
    <button title={label} onClick={onClick} style={{ background: "none", border: "none", cursor: "pointer", margin: "0 4px", fontSize: 18 }}>
      {icon}
    </button>
  );
}

export default function StoricoPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<any | null>(null);
  const [toDelete, setToDelete] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [livello, setLivello] = useState("");
  const [docente, setDocente] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("/api/admin/assignments")
      .then(r => {
        if (!r.ok) throw new Error("Errore nel recupero dati");
        return r.json();
      })
      .then(d => setData(d.assignments || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Estrai livelli e docenti unici per i filtri
  const livelli = Array.from(new Set(data.map((row: any) => row.livello).filter(Boolean)));
  const docenti = Array.from(new Set(data.map((row: any) => `${row.createdBy?.nome} ${row.createdBy?.cognome}`.trim()).filter(Boolean)));

  const dataFiltrata = data.filter((row: any) => {
    const testo = `${row.livello} ${row.createdBy?.nome || ""} ${row.createdBy?.cognome || ""} ${row.createdBy?.email || ""}`.toLowerCase();
    const matchSearch = testo.includes(search.toLowerCase());
    const matchLivello = livello ? row.livello === livello : true;
    const matchDocente = docente ? (`${row.createdBy?.nome} ${row.createdBy?.cognome}`.trim() === docente) : true;
    return matchSearch && matchLivello && matchDocente;
  });

  async function handleDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/assignments?id=${toDelete._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Errore durante l'eliminazione");
      setData(d => d.filter(a => a._id !== toDelete._id));
      setToDelete(null);
    } catch (e) {
      alert("Errore durante l'eliminazione");
    } finally {
      setDeleting(false);
    }
  }

  function handlePrint(row: any) {
    const printWindow = window.open('', '', 'width=900,height=700');
    if (!printWindow) return;
    const assegnazioni = row.assegnazioni || [];
    let html = `<html><head><title>Stampa Assegnazione</title></head><body style='font-family:sans-serif;'>`;
    html += `<h2>Distribuzione oraria - ${row.livello} - ${row.createdBy?.nome || ''} ${row.createdBy?.cognome || ''}</h2>`;
    html += `<table border='1' cellpadding='8' cellspacing='0' style='border-collapse:collapse;width:100%;font-size:17px;'>`;
    html += `<thead><tr><th>Sezione</th><th>Descrittore</th><th>Ore in presenza</th><th>Ore a distanza</th><th>Ore totali</th></tr></thead><tbody>`;
    assegnazioni.forEach((section: any, idx: number) => {
      (section.subtopics || []).forEach((sub: any, subIdx: number) => {
        html += `<tr>`;
        html += `<td>${section.sectionTitle || section.titolo || `Sezione ${idx + 1}`}</td>`;
        html += `<td>${sub.label || sub.descrittore || sub.titolo || `Voce ${subIdx + 1}`}</td>`;
        html += `<td style='text-align:center;'>${Math.max(0, (sub.hours ?? 0) - (sub.distanceHours ?? 0))}</td>`;
        html += `<td style='text-align:center;'>${sub.distanceHours ?? 0}</td>`;
        html += `<td style='text-align:center;'>${sub.hours ?? 0}</td>`;
        html += `</tr>`;
      });
    });
    html += `</tbody></table></body></html>`;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }

  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: "0 auto" }}>
      <h2 style={{ fontSize: 24, marginBottom: 24, color: "#222", fontWeight: 700 }}>Storico Assegnazioni</h2>
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Cerca livello, docente, email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: "10px 16px", borderRadius: 8, border: "1.5px solid #cbd5e1", fontSize: 16, flex: 1, minWidth: 220 }}
        />
        <select
          value={livello}
          onChange={e => setLivello(e.target.value)}
          style={{ padding: "10px 16px", borderRadius: 8, border: "1.5px solid #cbd5e1", fontSize: 16, minWidth: 160 }}
        >
          <option value="">Tutti i livelli</option>
          {livelli.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <select
          value={docente}
          onChange={e => setDocente(e.target.value)}
          style={{ padding: "10px 16px", borderRadius: 8, border: "1.5px solid #cbd5e1", fontSize: 16, minWidth: 160 }}
        >
          <option value="">Tutti i docenti</option>
          {docenti.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div style={{ overflowX: "auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #0001", padding: 0 }}>
        {loading ? (
          <div style={{ padding: 32, textAlign: "center" }}>Caricamento...</div>
        ) : error ? (
          <div style={{ color: "#e11d48", padding: 32, textAlign: "center" }}>{error}</div>
        ) : dataFiltrata.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center" }}>Nessuna assegnazione trovata.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
            <thead>
              <tr style={{ background: "#f7f8fa", color: "#222" }}>
                <th style={{ padding: 12, textAlign: "left", fontWeight: 600 }}>Livello</th>
                <th style={{ padding: 12, textAlign: "left", fontWeight: 600 }}>Nome</th>
                <th style={{ padding: 12, textAlign: "left", fontWeight: 600 }}>Cognome</th>
                <th style={{ padding: 12, textAlign: "left", fontWeight: 600 }}>Email</th>
                <th style={{ padding: 12, textAlign: "left", fontWeight: 600 }}>Ora inserimento</th>
                <th style={{ padding: 12, textAlign: "center", fontWeight: 600 }}>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {dataFiltrata.map((row: any, idx: number) => (
                <tr key={row._id} style={{ borderBottom: "1px solid #e2e8f0", background: idx % 2 === 0 ? "#fff" : "#f7fafc", transition: "background 0.18s" }}>
                  <td style={{ padding: 12 }}>{row.livello}</td>
                  <td style={{ padding: 12 }}>{row.createdBy?.nome}</td>
                  <td style={{ padding: 12 }}>{row.createdBy?.cognome}</td>
                  <td style={{ padding: 12 }}>{row.createdBy?.email}</td>
                  <td style={{ padding: 12 }}>{row.createdAt ? new Date(row.createdAt).toLocaleString() : ""}</td>
                  <td style={{ padding: 12, textAlign: "center" }}>
                    <IconButton label="Anteprima" icon={<span role="img" aria-label="anteprima">👁️</span>} onClick={() => setPreview(row)} />
                    <IconButton label="Stampa" icon={<span role="img" aria-label="stampa">🖨️</span>} onClick={() => handlePrint(row)} />
                    <IconButton label="Cancella" icon={<span role="img" aria-label="cancella">🗑️</span>} onClick={() => setToDelete(row)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* MODAL ANTEPRIMA */}
      {preview && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.25)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}
          onClick={() => setPreview(null)}
        >
          <div style={{ background: "#fff", borderRadius: 16, minWidth: 800, maxWidth: 1200, width: '90vw', maxHeight: '90vh', boxShadow: "0 8px 32px #0003", padding: 40, position: "relative", overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreview(null)} style={{ position: "absolute", top: 18, right: 24, background: "none", border: "none", fontSize: 32, cursor: "pointer" }}>&times;</button>
            <h3 style={{ fontSize: 26, marginBottom: 18 }}>Anteprima distribuzione oraria</h3>
            {preview.assegnazioni && preview.assegnazioni.length > 0 ? (
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12, fontSize: 18 }}>
                <thead>
                  <tr style={{ background: "#f7f8fa" }}>
                    <th style={{ padding: 10, textAlign: "left" }}>Sezione</th>
                    <th style={{ padding: 10, textAlign: "left" }}>Descrittore</th>
                    <th style={{ padding: 10, textAlign: "center" }}>Ore in presenza</th>
                    <th style={{ padding: 10, textAlign: "center" }}>Ore a distanza</th>
                    <th style={{ padding: 10, textAlign: "center" }}>Ore totali</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.assegnazioni.flatMap((section: any, idx: number) =>
                    (section.subtopics || []).map((sub: any, subIdx: number) => (
                      <tr key={idx + '-' + subIdx}>
                        <td style={{ padding: 10 }}>{section.sectionTitle || section.titolo || `Sezione ${idx + 1}`}</td>
                        <td style={{ padding: 10 }}>{sub.label || sub.descrittore || sub.titolo || `Voce ${subIdx + 1}`}</td>
                        <td style={{ padding: 10, textAlign: "center" }}>{Math.max(0, (sub.hours ?? 0) - (sub.distanceHours ?? 0))}</td>
                        <td style={{ padding: 10, textAlign: "center" }}>{sub.distanceHours ?? 0}</td>
                        <td style={{ padding: 10, textAlign: "center" }}>{sub.hours ?? 0}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: 24, textAlign: "center" }}>Nessuna distribuzione oraria presente.</div>
            )}
          </div>
        </div>
      )}
      {/* MODAL CONFERMA ELIMINAZIONE */}
      {toDelete && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.25)", zIndex: 1100,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}
          onClick={() => setToDelete(null)}
        >
          <div style={{ background: "#fff", borderRadius: 14, minWidth: 340, maxWidth: 420, boxShadow: "0 8px 32px #0003", padding: 32, position: "relative" }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setToDelete(null)} style={{ position: "absolute", top: 12, right: 16, background: "none", border: "none", fontSize: 28, cursor: "pointer" }}>&times;</button>
            <h3 style={{ fontSize: 20, marginBottom: 18, color: '#e11d48' }}>Conferma eliminazione</h3>
            <div style={{ marginBottom: 18 }}>Sei sicuro di voler eliminare questa assegnazione?<br /><b>{toDelete.livello}</b> - {toDelete.createdBy?.nome} {toDelete.createdBy?.cognome}</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button onClick={() => setToDelete(null)} style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: '#eee', color: '#222', fontWeight: 500, fontSize: 16 }}>Annulla</button>
              <button onClick={handleDelete} disabled={deleting} style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: '#e11d48', color: '#fff', fontWeight: 600, fontSize: 16, opacity: deleting ? 0.7 : 1, cursor: deleting ? 'not-allowed' : 'pointer' }}>Elimina</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
