# Planner Percorsi Formativi

Un'applicazione web single-page per pianificare e distribuire le ore dei percorsi formativi. L'interfaccia guida l'utente nella ripartizione delle ore previste per ogni descrittore, mantenendo sempre in evidenza vincoli e progresso complessivo.

## Percorsi disponibili

- **Alpha** – include i livelli QCER A1 e A2 con tutte le voci e sotto-voci già configurate.
- **Primo** – placeholder per futuri contenuti (attualmente non contiene sezioni).
- **Secondo** – placeholder per futuri contenuti.

## Funzionalità principali

- 🎚️ **Distribuzione intuitiva delle ore**: per ogni sotto-voce è possibile impostare le ore tramite slider o input numerico; il sistema impedisce di superare il monte ore massimo del relativo descrittore.
- 📡 **Gestione ore a distanza**: per ogni sotto-voce puoi indicare quante ore svolgere a distanza, rispettando automaticamente il limite del 20% sul totale della sezione.
- 🧭 **Panoramica strutturata**: i livelli (A1/A2) sono presentati in card moderne con progress bar, stato di completamento e reminder delle ore rimanenti.
- 📊 **Riepilogo dinamico**: un pannello laterale calcola in tempo reale ore totali, assegnate, rimanenti e numero di sezioni completate.
- 🔔 **Feedback immediato**: se si tenta di superare il limite disponibile, compare un toast informativo e i controlli vengono bloccati al valore massimo consentito.

## Come si usa

1. Apri `index.html` in un browser moderno.
2. Seleziona un percorso (per ora, **Alpha** è quello completo).
3. Scorri le card del livello scelto e assegna le ore a ciascuna sotto-voce con slider o campo numerico.
4. Se necessario, imposta quante di quelle ore verranno erogate a distanza: il planner rispetterà il limite complessivo del 20% per la sezione e aggiornerà automaticamente le ore in presenza.
5. Controlla il riepilogo laterale per monitorare l'avanzamento generale, le ore in presenza/distanza e le sezioni completate.

## Struttura delle ore (Percorso Alpha)

- **Livello A1**
  - Ascolto (20 ore) → 2 sotto-voci
  - Lettura (20 ore) → 1 sotto-voce
  - Interazione orale e scritta (20 ore) → 3 sotto-voci
  - Produzione orale (20 ore) → 2 sotto-voci
  - Produzione scritta (20 ore) → 2 sotto-voci
- **Livello A2**
  - Ascolto (15 ore) → 2 sotto-voci
  - Lettura (20 ore) → 1 sotto-voce
  - Interazione orale e scritta (15 ore) → 3 sotto-voci
  - Produzione orale (15 ore) → 2 sotto-voci
  - Produzione scritta (15 ore) → 2 sotto-voci

Tutte le ore sono già impostate nel file `script.js` e vengono salvate solo in memoria (nessun back-end).

## Stack e librerie

- **HTML5** per la struttura della pagina.
- **CSS3** (flexbox, grid, gradient, blur) per il layout moderno e responsive.
- **JavaScript ES2022** per la logica applicativa (nessuna dipendenza esterna).

## File principali

- `index.html` – struttura della pagina e contenitori dinamici.
- `styles.css` – tema, layout e componenti UI.
- `script.js` – modello dei percorsi e logica di interazione.
- `materie_esempio.csv` – file d'esempio ereditato dalla versione precedente (non più necessario, conservato come riferimento).

## Roadmap suggerita

- Popolare i percorsi **Primo** e **Secondo** con la stessa struttura modulare.
- Aggiungere persistenza (es. download JSON o salvataggio locale).
- Consentire configurazione dinamica dei percorsi tramite interfaccia dedicata.