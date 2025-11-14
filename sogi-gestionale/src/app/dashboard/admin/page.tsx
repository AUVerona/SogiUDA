
export default function AdminPage() {
	return (
		<div style={{ padding: 40, maxWidth: 900, margin: "0 auto" }}>
			<h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 10, color: '#1e293b', letterSpacing: -1 }}>Area Amministratore</h1>
			<p style={{ fontSize: 18, color: '#475569', marginBottom: 36 }}>
				Benvenuto nell'area amministrativa. Seleziona una sezione per iniziare la gestione.
			</p>
			<div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
						<a href="/dashboard/admin/storico" style={{
							flex: 1,
							minWidth: 240,
							background: '#fff',
							borderRadius: 14,
							padding: '32px 28px',
							textDecoration: 'none',
							color: '#1e293b',
							boxShadow: '0 2px 12px #0001',
							fontWeight: 700,
							fontSize: 22,
							border: '1.5px solid #e2e8f0',
							transition: 'box-shadow 0.18s, border 0.18s',
							display: 'block',
						}}
						>Storico Assegnazioni</a>
						<a href="/dashboard/admin/utenti" style={{
							flex: 1,
							minWidth: 240,
							background: '#fff',
							borderRadius: 14,
							padding: '32px 28px',
							textDecoration: 'none',
							color: '#1e293b',
							boxShadow: '0 2px 12px #0001',
							fontWeight: 700,
							fontSize: 22,
							border: '1.5px solid #e2e8f0',
							transition: 'box-shadow 0.18s, border 0.18s',
							display: 'block',
						}}
						>Gestione Utenti</a>
						<a href="/dashboard/admin/cestino" style={{
							flex: 1,
							minWidth: 240,
							background: '#fff',
							borderRadius: 14,
							padding: '32px 28px',
							textDecoration: 'none',
							color: '#1e293b',
							boxShadow: '0 2px 12px #0001',
							fontWeight: 700,
							fontSize: 22,
							border: '1.5px solid #e2e8f0',
							transition: 'box-shadow 0.18s, border 0.18s',
							display: 'block',
						}}
						>Cestino</a>
			</div>
		</div>
	);
}



