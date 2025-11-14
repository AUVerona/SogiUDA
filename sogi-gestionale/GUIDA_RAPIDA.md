# GUIDA RAPIDA - SOGI UDA

## 🚀 Avvio Veloce

### Opzione 1: Script Automatico
```powershell
.\start.ps1
```

### Opzione 2: Manuale
```powershell
npm run dev
```

Poi apri il browser su: **http://localhost:3000**

## 📝 Primo Accesso

1. Vai su **http://localhost:3000/register**
2. Compila il form di registrazione:
   - Nome e Cognome
   - Email (sarà il tuo username)
   - Scuola
   - Password (minimo 6 caratteri)
   - Ruolo: Admin o Docente

3. Clicca "Registrati"
4. Effettua il login con le credenziali create

## 📂 Struttura Menu

Dopo il login vedrai:

### Menu Alto (Topbar)
- Logo SOGI UDA
- Pulsante menu (per aprire/chiudere sidebar)
- Nome utente e ruolo
- Pulsante "Esci"

### Menu Laterale (Sidebar)
1. **Assegnazione Ore** 📋
   - Seleziona livello (Alpha, Primo, Secondo, AFM)
   - Inserisci ore per ogni descrittore
   - Salva l'assegnazione

2. **Storico Assegnazioni** 📊
   - Visualizza tutte le assegnazioni
   - Filtra per livello
   - Cerca per parole chiave

3. **Impostazioni** ⚙️
   - Visualizza profilo
   - (Altre funzioni in arrivo)

## 💡 Funzionalità Principali

### Assegnazione Ore
1. Clicca su "Assegnazione Ore" nel menu laterale
2. Scegli un livello formativo
3. Per ogni sezione, inserisci:
   - Ore in presenza
   - Ore a distanza
4. Il sistema controlla automaticamente i limiti
5. Clicca "Salva Assegnazione"

### Storico
- Visualizza card con tutte le assegnazioni passate
- Usa i filtri per trovare assegnazioni specifiche
- Clicca "Visualizza Dettagli" per vedere il dettaglio (in sviluppo)

## ⚠️ Troubleshooting

### MongoDB non si avvia
```powershell
# Verifica lo stato
Get-Service -Name "MongoDB"

# Avvia manualmente
Start-Service -Name "MongoDB"
```

### Porta 3000 occupata
```powershell
# Usa una porta diversa
$env:PORT=3001; npm run dev
```

### Errori di connessione al database
Verifica che `.env.local` contenga:
```
MONGODB_URI=mongodb://localhost:27017/sogi-uda
```

## 🔧 Comandi Utili

```powershell
# Installa dipendenze
npm install

# Avvia sviluppo
npm run dev

# Build produzione
npm run build

# Avvia produzione
npm start

# Lint codice
npm run lint
```

## 📱 Responsive

Il gestionale è ottimizzato per:
- Desktop (1920x1080 e superiori)
- Laptop (1366x768)
- Tablet (768x1024)
- Mobile (375x667)

## 🎨 Design

- Colori principali: Viola/Indaco (#667eea, #764ba2)
- Font: Poppins
- Stile: Moderno, pulito, professionale
- No emoji nel UI (come richiesto)

## 📞 Supporto

Per problemi tecnici o domande, consulta il README.md completo.
