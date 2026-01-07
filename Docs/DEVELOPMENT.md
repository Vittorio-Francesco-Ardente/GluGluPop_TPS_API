# Quick Start
> **Documentazione API completa**: vedi [API.md](API.md)  

## Prerequisiti
- Node.js v16+
- npm o yarn

## Installazione

1. Clona il repository
2. Installa le dipendenze:
   ```bash
   npm install
3. Configura le variabili d'ambiente:
    - Copia .env.example in .env
    - Ottieni l'API Key da TMDB
    - Inserisci il valore in TMDB_API_KEY
    - inserisci anche le altre chiavi se necessario
4. Avvia il server:
   ```bash
    npm start
    ```

## Inviare Richieste API
> Di seguito trovi degli esempi per inviare richieste al server.

Una volta avviato il server su `http://localhost:5000`, puoi testare le API in 3 modi:

### 1. **cURL** (Terminale)

>  **Windows 10+**: curl dovrebbe essere già incluso. In caso installa con: `winget curl`

#### Health Check
```bash
curl http://localhost:5000/api/health
```

#### Alternativa: PowerShell (Funziona su Tutti i Windows)
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/health" | ConvertTo-Json
```


#### Registrazione
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!",
    "username": "testuser"
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!"
  }'
```

#### Richiesta Protetta (con Token)
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 2. **Bash Script**

Crea un file `test_api.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:5000/api"

# 1. Health Check
echo "=== Health Check ==="
curl -s $BASE_URL/health | json_pp
echo "\n"

# 2. Registrazione
echo "=== Registrazione ==="
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!",
    "username": "testuser"
  }')
echo $REGISTER_RESPONSE | json_pp
echo "\n"

# 3. Login
echo "=== Login ==="
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }')
echo $LOGIN_RESPONSE | json_pp

# Estrai il token
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token: $TOKEN"
echo "\n"

# 4. Richiesta Protetta
echo "=== Get User Info (Protetto) ==="
curl -s $BASE_URL/auth/me \
  -H "Authorization: Bearer $TOKEN" | json_pp
```

Esegui con:
```bash
bash test_api.sh
```

### 3. **Postman**

#### Opzione A: Importa la Collection
1. Apri Postman
2. Clicca **Import** → Seleziona `postman/collections/GluGluPop.postman_collection.json`
3. Le richieste sono già configurate con i corpi (body)
    - è comunque necessario fornire il bearer token alle richieste con autenticazione.

#### Opzione B: Configura Manualmente
1. Crea una nuova **Environment** in Postman con:
   ```
   base_url = http://localhost:5000/api
   token = (lo aggiornerai dopo il login)
   ```

2. **Richiesta: Health Check**
   - Method: `GET`
   - URL: `{{base_url}}/health`

3. **Richiesta: Login**
   - Method: `POST`
   - URL: `{{base_url}}/auth/login`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "email": "user@example.com",
       "password": "Password123!"
     }
     ```
   - Dopo il test, copia il `token` dalla risposta che sarà necessario per altre richieste legate all'utente.

4. **Richiesta: Get Me (Protetto)**
   - Method: `GET`
   - URL: `{{base_url}}/auth/me`
   - Headers: `Authorization: Bearer {{token}}`
        - dovrebbe inserire in automatico il token dalla seconda richiesta in poi. La prima è da inserire manualmente.


## Endpoint Principali

| Metodo | Endpoint | Descrizione | Autenticazione |
|--------|----------|-------------|-----------------|
| GET | `api/health` | Verifica server attivo | ❌ |
| POST | `api/auth/register` | Registra nuovo utente | ❌ |
| POST | `api/auth/login` | Login utente | ❌ |
| GET | `api/auth/me` | Dati utente corrente | ✅ |
| PUT | `api/auth/profile` | Modifica profilo | ✅ |
| PUT | `api/auth/preferences` | Modifica preferenze | ✅ |
| POST | `api/swipes` | Registra uno swipe | ✅ |
| GET | `api/recommendations` | Ottieni raccomandazioni | ✅ |
| GET | `api/movies/:id` | Dettagli film | ❌ |
| POST | `api/groups` | Crea gruppo | ✅ |

---
<br>
<br>

# Note
- L'app frontend (React) sarà deployata come PWA standalone
- Questo backend serve le API per il swipe, le raccomandazioni e il login
- Tutti gli endpoint protetti richiedono il token JWT nell'header `Authorization: Bearer <token>`
- **Documentazione API completa**: vedi [API.md](API.md)