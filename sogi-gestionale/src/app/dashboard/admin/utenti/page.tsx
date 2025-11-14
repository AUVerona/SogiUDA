
"use client";
import React, { useEffect, useState } from "react";


const UtentiPage = () => {
  const [utenti, setUtenti] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [ruolo, setRuolo] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("/api/admin/users")
      .then((r) => {
        if (!r.ok) throw new Error("Errore nel recupero utenti");
        return r.json();
      })
      .then((d) => setUtenti(d.users || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const utentiFiltrati = utenti.filter((user: any) => {
    const testo = `${user.nome} ${user.cognome} ${user.email} ${user.scuola}`.toLowerCase();
    const matchSearch = testo.includes(search.toLowerCase());
    const matchRuolo = ruolo ? user.ruolo === ruolo : true;
    return matchSearch && matchRuolo;
  });

  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: "0 auto" }}>
      <h2 style={{ fontSize: 24, marginBottom: 24, color: "#222", fontWeight: 700 }}>Utenti Registrati</h2>
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Cerca nome, cognome, email, scuola..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: "10px 16px", borderRadius: 8, border: "1.5px solid #cbd5e1", fontSize: 16, flex: 1, minWidth: 220 }}
        />
        <select
          value={ruolo}
          onChange={e => setRuolo(e.target.value)}
          style={{ padding: "10px 16px", borderRadius: 8, border: "1.5px solid #cbd5e1", fontSize: 16, minWidth: 160 }}
        >
          <option value="">Tutti i ruoli</option>
          <option value="admin">Admin</option>
          <option value="docente">Docente</option>
        </select>
      </div>
      <div style={{ overflowX: "auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #0001", padding: 0 }}>
        {loading ? (
          <div style={{ padding: 32, textAlign: "center" }}>Caricamento...</div>
        ) : error ? (
          <div style={{ color: "#e11d48", padding: 32, textAlign: "center" }}>{error}</div>
        ) : utentiFiltrati.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center" }}>Nessun utente trovato.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
            <thead>
              <tr style={{ background: "#f7f8fa", color: "#222" }}>
                <th style={{ padding: 12, textAlign: "left", fontWeight: 600 }}>Nome</th>
                <th style={{ padding: 12, textAlign: "left", fontWeight: 600 }}>Cognome</th>
                <th style={{ padding: 12, textAlign: "left", fontWeight: 600 }}>Email</th>
                <th style={{ padding: 12, textAlign: "left", fontWeight: 600 }}>Scuola</th>
                <th style={{ padding: 12, textAlign: "left", fontWeight: 600 }}>Ruolo</th>
                <th style={{ padding: 12, textAlign: "left", fontWeight: 600 }}>Registrato il</th>
              </tr>
            </thead>
            <tbody>
              {utentiFiltrati.map((user: any, idx: number) => (
                <tr
                  key={user._id}
                  style={{
                    borderBottom: "1px solid #e2e8f0",
                    background: idx % 2 === 0 ? "#fff" : "#f7fafc",
                    transition: "background 0.18s"
                  }}
                >
                  <td style={{ padding: 12 }}>{user.nome}</td>
                  <td style={{ padding: 12 }}>{user.cognome}</td>
                  <td style={{ padding: 12 }}>{user.email}</td>
                  <td style={{ padding: 12 }}>{user.scuola}</td>
                  <td style={{ padding: 12, fontWeight: 600, color: user.ruolo === "admin" ? "#e11d48" : "#2563eb" }}>{user.ruolo}</td>
                  <td style={{ padding: 12 }}>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UtentiPage;
