# On The Docket - Content Manager

Una dashboard moderna per gestire e pubblicare i contenuti SCOTUS su social media.

## 🚀 Caratteristiche

### 📅 Timeline Prossimi Contenuti
- Visualizza i contenuti programmati per i prossimi 14 giorni
- Badge di priorità: "OGGI", "DOMANI", "URGENTE"
- Espandi per vedere tutti i dettagli
- Icone per piattaforme (YouTube, TikTok, X)

### 📦 Archivio Pubblicazioni
- Accedi a tutti i contenuti già pubblicati
- Ricerca avanzata per titolo, case, descrizione
- Filtri per tipo di contenuto
- Layout card con dettagli completi

### ➕ Crea Nuove Pubblicazioni
- Form intuitivo per aggiungere contenuti
- Validazione dati in tempo reale
- Salvataggio automatico nel JSON
- Feedback immediato (success/error)

### 🎨 Design Moderno
- Icone SVG (no emoji)
- Layout pulito e spazioso
- Responsive (mobile, tablet, desktop)
- Sidebar navigazione
- Tema chiaro e professionale

## 📁 Struttura del Progetto

```
onthedocket-cms/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── contents/
│   │   │       └── route.ts      # API GET/POST per contenuti
│   │   ├── page.tsx             # Pagina principale
│   │   ├── layout.tsx           # Layout root
│   │   └── globals.css          # Stili Tailwind
│   ├── components/
│   │   ├── Timeline.tsx         # Prossimi contenuti
│   │   ├── Archive.tsx          # Archivio pubblicazioni
│   │   ├── CreateContent.tsx    # Form nuovo contenuto
│   │   ├── Sidebar.tsx          # Menu laterale
│   │   └── Icons.tsx            # Icone SVG
│   ├── data/
│   │   └── contents.json        # Database (fonte di verità)
│   └── lib/
│       └── utils.ts             # Utility functions
├── public/
│   └── on_the_docket_full_white.png
├── package.json
└── tsconfig.json
```

## 📊 Struttura JSON

Ogni contenuto nel file `src/data/contents.json` ha questa struttura:

```json
{
  "File Name": "Welcome to On the Docket",
  "Post Title": "Welcome to On the Docket",
  "Description": "...",
  "Publication Date": "2026-02-11",
  "Duration": "02:30:00",
  "YouTube": "https://youtube.com/...",
  "TikTok": "https://tiktok.com/...",
  "X.com": "https://x.com/...",
  "Type": "Opinion",
  "Case": "Trump v. US",
  "SCOTUS Docket no.": "24-1"
}
```

## 🚀 Come Iniziare

### Installare dipendenze
```bash
npm install
```

### Avviare dev server
```bash
npm run dev
```

Vai a **http://localhost:3000**

### Build per produzione
```bash
npm run build
npm start
```

## 📝 Modificare i Contenuti

### Opzione 1: Form nella Dashboard
1. Accedi a "Nuovo Contenuto"
2. Compila il form
3. Clicca "Crea Contenuto"
4. Torna a "Prossimi Contenuti" per verificare

### Opzione 2: Editare JSON direttamente
1. Modifica `src/data/contents.json`
2. Il sito si aggiorna in automatico

### Opzione 3: Export/Import da Excel
```bash
python3 scripts/excel_to_json.py
```

## 🔍 Audit Database

Contenuti totali: **27**

**Piattaforme:**
- YouTube: 17 items
- TikTok: 8 items
- X.com: 7 items

**Tipi di contenuto:**
- Primary: 5
- Short (landscape): 2
- Short (portrait): 20

**Case principali:**
- Trump v. United States: 24
- Trump v. CASA Inc.: 2
- N/A: 1

**Date:** 2026-02-11 → 2026-02-23

## 🎨 Personalizzazione

- **Colori**: `tailwind.config.js`
- **Font**: `src/app/globals.css`
- **Layout**: Componenti in `src/components/`
- **Icone**: `src/components/Icons.tsx`

## 📈 Scaling Futuri

Attualmente supporta **5.000-10.000 contenuti** senza problemi.

Quando crescerete oltre:
- Google Sheets API (real-time sync)
- Database PostgreSQL
- Webhook per social APIs
- Rate limiting e caching

## 🛠️ Stack Tecnico

- **Next.js 14**: Full-stack React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **JSON**: Database locale
- **API Routes**: Server-side logic

## 📱 Responsive Breakpoints

- Mobile: < 640px (full menu)
- Tablet: 640px - 1024px
- Desktop: > 1024px (sidebar fisso)

## 🔒 Features di Sicurezza

- Validazione dati server-side
- Type safety con TypeScript
- API routes protette
- No hardcoded credentials

## 🤝 Team Collaboration

Il JSON è versionabile con Git:
- Commit message: "Add: [Case name] content"
- Branch per feature
- Pull request review

## 📞 Support

Hai domande? Leggi i commenti nel codice!

---

**Versione**: 0.2.0
**Ultimo aggiornamento**: Feb 2026
**Contenuti**: 27
