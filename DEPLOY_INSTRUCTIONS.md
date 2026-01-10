# 📱 Come usare GluGluPop sul telefono

## Metodo 1: Deploy su Vercel (Gratuito - Consigliato)

### Passaggi:

1. **Crea un account su Vercel**
   - Vai su [vercel.com](https://vercel.com)
   - Registrati con GitHub, GitLab o email

2. **Carica il progetto su GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/TUO_USERNAME/gluglupop.git
   git push -u origin main
   ```

3. **Importa su Vercel**
   - Clicca "New Project"
   - Seleziona il repository GitHub
   - Clicca "Deploy"

4. **Aggiungi le API Keys**
   - Vai in Settings > Environment Variables
   - Aggiungi:
     ```
     REACT_APP_TMDB_API_KEY=la_tua_chiave
     REACT_APP_YOUTUBE_API_KEY=la_tua_chiave
     REACT_APP_SPOONACULAR_API_KEY=la_tua_chiave
     ```

5. **Accedi dal telefono**
   - Apri l'URL fornito da Vercel (es: `gluglupop.vercel.app`)
   - L'app è ora accessibile!

---

## Metodo 2: Deploy su Netlify (Gratuito)

1. Vai su [netlify.com](https://netlify.com)
2. Trascina la cartella `build` sulla pagina
3. Ottieni un URL pubblico

---

## Metodo 3: Test in rete locale

### Dal computer:

1. **Installa dipendenze e avvia**
   ```bash
   npm install
   npm start
   ```

2. **Trova il tuo IP locale**
   - Windows: `ipconfig` → cerca "IPv4 Address"
   - Mac/Linux: `ifconfig` → cerca "inet"
   - Tipicamente: `192.168.1.xxx`

3. **Dal telefono**
   - Connettiti alla stessa rete WiFi
   - Apri il browser
   - Vai a `http://192.168.1.xxx:3000`

---

## 📲 Installare come App (PWA)

Una volta che accedi all'app dal telefono:

### iPhone (Safari):
1. Tocca l'icona "Condividi" (quadrato con freccia)
2. Scorri e tocca "Aggiungi a Home"
3. Conferma con "Aggiungi"

### Android (Chrome):
1. Tocca i tre puntini in alto a destra
2. Tocca "Installa app" o "Aggiungi a schermata Home"
3. Conferma

L'app apparirà come un'icona sulla home del telefono! 🎉

---

## 🔑 Ottenere le API Keys

### TMDb (Film Database)
1. Vai su [themoviedb.org](https://www.themoviedb.org/settings/api)
2. Crea un account
3. Richiedi una API key (gratuita)

### YouTube Data API
1. Vai su [console.cloud.google.com](https://console.cloud.google.com)
2. Crea un nuovo progetto
3. Abilita "YouTube Data API v3"
4. Crea credenziali → API Key

### Spoonacular (Ricette)
1. Vai su [spoonacular.com/food-api](https://spoonacular.com/food-api)
2. Registrati (piano gratuito disponibile)
3. Ottieni la API key

### TheCocktailDB
- Gratuita per sviluppo
- API key di test: `1`

---

## 🛠 Configurazione API Keys

Crea un file `.env` nella root del progetto:

```env
REACT_APP_TMDB_API_KEY=your_tmdb_key_here
REACT_APP_YOUTUBE_API_KEY=your_youtube_key_here
REACT_APP_SPOONACULAR_API_KEY=your_spoonacular_key_here
REACT_APP_TASTEDIVE_API_KEY=your_tastedive_key_here
REACT_APP_WATCHMODE_API_KEY=your_watchmode_key_here
```

**⚠️ Importante:** Non condividere mai le tue API keys pubblicamente!

---

## 🚀 Build per produzione

```bash
# Crea la build ottimizzata
npm run build

# La cartella 'build' contiene l'app pronta per il deploy
```

---

## ❓ Problemi comuni

### "L'app non carica i film"
- Verifica che la API key TMDb sia corretta
- Controlla la console del browser per errori

### "Non posso installare l'app"
- Assicurati di usare HTTPS (non HTTP)
- I deploy su Vercel/Netlify usano HTTPS automaticamente

### "L'app non funziona offline"
- La prima volta devi essere online per caricare i dati
- Dopo, i dati salvati sono disponibili offline

---

## 📧 Supporto

Per problemi o domande, apri una issue su GitHub.

Buona visione! 🎬🍿
