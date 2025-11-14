# SOGI UDA - Gestionale Assegnazione Ore

Sistema gestionale professionale per l'assegnazione delle ore formative nei percorsi CPIA.

## Caratteristiche

- **Autenticazione completa** con Login e Registrazione
- **Menu laterale e topbar fissi** e richiudibili
- **Sistema di assegnazione ore** step-by-step (selezione livello → inserimento ore)
- **Storico assegnazioni** con filtri e ricerca
- **Gestione ruoli** (Admin e Docente)
- **Database MongoDB** per persistenza dati
- **Design moderno** e professionale

## Tecnologie

- **Next.js 14** (App Router)
- **TypeScript**
- **MongoDB** (locale)
- **NextAuth** per autenticazione
- **CSS Modules** per styling

## Prerequisiti

1. **Node.js** (versione 18 o superiore)
2. **MongoDB** installato localmente

### Installazione MongoDB (Windows)

1. Scarica MongoDB Community Server da [mongodb.com/download-center/community](https://www.mongodb.com/try/download/community)
2. Installa MongoDB con le opzioni di default
3. MongoDB si avvierà automaticamente come servizio Windows

Per verificare che MongoDB sia in esecuzione:
```powershell
mongosh
```

## Installazione

1. **Naviga nella directory del progetto**:
```powershell
cd sogi-gestionale
```

2. **Installa le dipendenze**:
```powershell
npm install
```

3. **Configura le variabili d'ambiente**:

Il file `.env.local` è già presente con la configurazione di default:
```env
MONGODB_URI=mongodb://localhost:27017/sogi-uda
NEXTAUTH_SECRET=your-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
```

**IMPORTANTE**: In produzione, cambia `NEXTAUTH_SECRET` con una chiave sicura generata randomicamente.

## Avvio del Progetto

1. **Assicurati che MongoDB sia in esecuzione** (dovrebbe essere automatico su Windows)

2. **Avvia il server di sviluppo**:
```powershell
npm run dev
```

3. **Apri il browser** su [http://localhost:3000](http://localhost:3000)

## Primo Utilizzo

1. Vai su `/register` per creare il tuo primo account
2. Compila il form con:
   - Nome
   - Cognome
   - Email
   - Scuola
   - Password (minimo 6 caratteri)
   - Ruolo (Admin o Docente)

3. Dopo la registrazione, effettua il login

4. Una volta loggato, verrai reindirizzato al dashboard

## Struttura del Progetto

```
sogi-gestionale/
├── src/
│   ├── app/
│   │   ├── api/                 # API Routes
│   │   │   ├── auth/           # Autenticazione
│   │   │   └── assignments/    # Gestione assegnazioni
│   │   ├── dashboard/          # Pagine dashboard
│   │   │   ├── assegnazione/   # Assegnazione ore
│   │   │   ├── storico/        # Storico assegnazioni
│   │   │   └── impostazioni/   # Impostazioni utente
│   │   ├── login/              # Pagina login
│   │   ├── register/           # Pagina registrazione
│   │   └── layout.tsx          # Layout root
│   ├── components/             # Componenti React
│   │   ├── DashboardLayout.tsx # Layout dashboard con menu
│   │   └── SessionProvider.tsx # Provider sessione
│   ├── models/                 # Modelli MongoDB
│   │   ├── User.ts
│   │   ├── Teacher.ts
│   │   ├── Subject.ts
│   │   └── Assignment.ts
│   ├── lib/
│   │   └── mongodb.ts          # Connessione database
│   ├── data/
│   │   └── curriculum.ts       # Dati curriculum
│   └── types/
│       └── next-auth.d.ts      # Tipi TypeScript
├── package.json
├── tsconfig.json
├── next.config.js
└── .env.local
```

## Funzionalità

### 1. Autenticazione
- Login con email e password
- Registrazione nuovi utenti
- Gestione ruoli (Admin/Docente)
- Sessioni persistenti

### 2. Dashboard
- **Menu laterale** con navigazione tra sezioni
- **Topbar** con informazioni utente e logout
- **Menu richiudibili** per ottimizzare lo spazio

### 3. Assegnazione Ore
- Selezione del livello formativo (Alpha, Primo, Secondo, AFM)
- Inserimento ore per ogni descrittore
- Distinzione tra ore in presenza e a distanza
- Controllo automatico limiti orari
- Salvataggio nel database

### 4. Storico Assegnazioni
- Visualizzazione di tutte le assegnazioni salvate
- Filtri per livello
- Ricerca testuale
- Card con informazioni sintetiche

### 5. Impostazioni
- Visualizzazione profilo utente
- Placeholder per funzionalità future

## Database

Il sistema utilizza MongoDB con le seguenti collections:

- **users**: Utenti del sistema
- **teachers**: Anagrafica docenti
- **subjects**: Materie/discipline
- **assignments**: Assegnazioni ore salvate

### Schema Assignment
```javascript
{
  livello: 'Alpha' | 'Primo' | 'Secondo' | 'SecondoLivello',
  livelloNome: String,
  data: Date,
  docente: { nome, cognome },
  assegnazioni: [
    {
      sectionId: String,
      sectionTitle: String,
      totalHours: Number,
      subtopics: [
        {
          id: String,
          code: String,
          label: String,
          hours: Number,
          distanceHours: Number
        }
      ]
    }
  ],
  createdBy: ObjectId (ref User),
  createdAt: Date,
  updatedAt: Date
}
```

## Build per Produzione

```powershell
npm run build
npm start
```

## Deploy su Vercel

1. Effettua il commit del progetto su GitHub (senza il file `.env.local`).
2. Collega il repository a Vercel.
3. Nella dashboard Vercel, aggiungi le variabili ambiente:
   - `MONGODB_URI` (stringa di connessione MongoDB Atlas)
   - `NEXTAUTH_SECRET` (chiave segreta, puoi generarne una con `openssl rand -base64 32`)
   - `NEXTAUTH_URL` (URL della tua app su Vercel, es: `https://nome-app.vercel.app`)
4. Avvia il deploy.

**Nota:** Usa il file `.env.example` come riferimento per le variabili da configurare su Vercel.

## Sicurezza

- Non committare mai `.env.local` con credenziali reali.
- Usa sempre variabili ambiente su Vercel per le chiavi e le password.

## Sviluppi Futuri

- Export PDF delle assegnazioni
- Gestione completa docenti e materie
- Dashboard con statistiche
- Notifiche e reminder
- Cambio password
- Gestione avanzata permessi

## Supporto

Per problemi o domande, contatta il team di sviluppo.

## Licenza

Uso interno - Tutti i diritti riservati
