GluGluPop API Reference

Indice

API.md  
├── Auth Endpoints  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── POST /auth/register  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── POST /auth/login  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── GET /auth/me  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── PUT /auth/preferences  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── PUT /auth/profile  
├── Movie Endpoints  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── GET /movies/discover  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── GET /movies/trending  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── GET /movies/search  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── GET /movies/:id  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── GET /movies/:id/trailer  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── GET /movies/:id/similar  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── GET /movies/genres  
├── Swipe Endpoints  
├── Group Endpoints  
└── Recommendation Endpoints  

---

🔐 Auth Endpoints

POST /auth/register

Registrazione nuovo utente.

Body Parameters:
- email (string, required) - Email utente
- password (string, required) - Password
- username (string, required) - Username univoco

Risposta:
```json
{
  "success": true,
  "message": "Registrazione completata! 🎉",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "moviefan",
      "avatar": null
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

Errori:
- 400 - Email già registrata
- 400 - Username già in uso

Esempio cURL:
```bash
curl -X POST "http://localhost:5000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "username": "moviefan"
  }'
```

---

POST /auth/login

Login utente esistente.

Body Parameters:
- email (string, required) - Email utente
- password (string, required) - Password

Risposta:
```json
{
  "success": true,
  "message": "Login effettuato! 👋",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "moviefan",
      "avatar": null,
      "genresPreferred": [28, 35, 878],
      "totalLikes": 42,
      "totalSkips": 15
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

Errori:
- 401 - Credenziali non valide

Esempio cURL:
```bash
curl -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

---

GET /auth/me

Ottieni profilo utente corrente.

> Richiede autenticazione JWT.

Risposta:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "moviefan",
      "avatar": null,
      "genresPreferred": [28, 35, 878],
      "totalLikes": 42,
      "totalSkips": 15,
      "totalWatched": 57,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

Errori:
- 401 - Token mancante o non valido

Esempio cURL:
```bash
curl "http://localhost:5000/api/auth/me" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

PUT /auth/preferences

Aggiorna preferenze generi utente.

> Richiede autenticazione JWT.

Body Parameters:
- genresPreferred (array, required) - Array di ID generi

Risposta:
```json
{
  "success": true,
  "message": "Preferenze aggiornate! ✅",
  "data": {
    "genresPreferred": [28, 35, 878]
  }
}
```

Note:
- Accetta anche array diretto nel body (senza chiave genresPreferred)
- Utilizzato per personalizzare raccomandazioni

Esempio cURL:
```bash
curl -X PUT "http://localhost:5000/api/auth/preferences" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "genresPreferred": [28, 35, 878]
  }'
```

---

PUT /auth/profile

Aggiorna profilo utente.

> Richiede autenticazione JWT.

Body Parameters:
- username (string, optional) - Nuovo username
- avatar (string, optional) - URL avatar

Risposta:
```json
{
  "success": true,
  "message": "Profilo aggiornato! ✅",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "newusername",
      "avatar": "https://example.com/avatar.jpg",
      "genresPreferred": [28, 35, 878],
      "totalLikes": 42,
      "totalSkips": 15,
      "totalWatched": 57,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-16T14:20:00.000Z"
    }
  }
}
```

Errori:
- 400 - Username già in uso

Esempio cURL:
```bash
curl -X PUT "http://localhost:5000/api/auth/profile" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newusername",
    "avatar": "https://example.com/avatar.jpg"
  }'
```

---
🎬 Movie Endpoints

> Tutti gli endpoint movie richiedono autenticazione JWT.

GET /movies/discover

Scopri film con filtri opzionali. Usato per il feed principale.

Query Parameters:
- page (number, default: 1) - Numero pagina
- genre (string, optional) - ID genere (es. "28" per Action)
- year (number, optional) - Anno di uscita
- sort_by (string, default: "popularity.desc") - Ordinamento

Risposta:
```json
{
  "success": true,
  "data": {
    "movies": [
      {
        "id": 603,
        "title": "Matrix",
        "overview": "Un hacker scopre...",
        "poster": "https://image.tmdb.org/t/p/w500/...",
        "backdrop": "https://image.tmdb.org/t/p/original/...",
        "releaseDate": "1999-03-31",
        "voteAverage": 8.2,
        "voteCount": 23456,
        "genres": [28, 878],
        "trailer": "m8e-FF8MsqU"
      }
    ],
    "page": 1,
    "totalPages": 500,
    "totalResults": 10000
  }
}
```

Esempio cURL:
```bash
curl "http://localhost:5000/api/movies/discover?page=1&genre=28" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

GET /movies/trending

Film più popolari del momento.

Query Parameters:
- timeWindow (string, default: "week") - "day" o "week"

Risposta:
```json
{
  "success": true,
  "data": {
    "movies": [
        {
            "id": 1242898,
            "title": "Predator: Badlands",
            "overview": "...",
            "poster": "https://...",
            "backdrop": "https://...",
            "releaseDate": "2025-11-05",
            "voteAverage": 7.562,
            "genres": [28, ...],
            "trailer": "Vaw9iRihA6o"
        }
    ]
  }
}
```

Esempio cURL:
```bash
curl "http://localhost:5000/api/movies/trending?timeWindow=day" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

GET /movies/search

Cerca film per titolo.

Query Parameters:
- q (string, required) - Titolo da cercare
- page (number, default: 1) - Numero pagina

Risposta:
```json
{
  "success": true,
  "data": {
    "movies": [
      {
        "id": 603,
        "title": "Matrix",
        "overview": "...",
        "poster": "https://...",
        "releaseDate": "1999-03-31",
        "voteAverage": 8.2
      }
    ],
    "page": 1,
    "totalPages": 5,
    "totalResults": 100
  }
}
```

Esempio cURL:
```bash
curl "http://localhost:5000/api/movies/search?q=matrix&page=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

GET /movies/:id

Dettagli completi di un singolo film.

Parametri URL:
- id (number, required) - ID del film su TMDB

Risposta:
```json
{
  "success": true,
  "data": {
    "movie": {
      "id": 603,
      "title": "Matrix",
      "originalTitle": "The Matrix",
      "overview": "Un hacker...",
      "poster": "https://...",
      "backdrop": "https://...",
      "releaseDate": "1999-03-31",
      "runtime": 136,
      "voteAverage": 8.2,
      "voteCount": 23456,
      "genres": [
        { "id": 28, "name": "Azione" },
        { "id": 878, "name": "Fantascienza" }
      ],
      "budget": 63000000,
      "revenue": 463517383,
      "cast": [
        {
          "id": 6384,
          "name": "Keanu Reeves",
          "character": "Neo",
          "profilePath": "https://..."
        }
      ],
      "trailer": "m8e-FF8MsqU"
    }
  }
}
```

Esempio cURL:
```bash
curl "http://localhost:5000/api/movies/603" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

GET /movies/:id/trailer

Ottieni solo il trailer di un film (YouTube key).

Parametri URL:
- id (number, required) - ID del film su TMDB

Risposta:
```json
{
  "success": true,
  "data": {
    "trailer": "m8e-FF8MsqU"
  }
}
```

Note:
- Se trailer non disponibile: "trailer": null
- Prova prima lingua italiana, fallback a inglese
- Cache in memoria per 6 ore

Esempio cURL:
```bash
curl "http://localhost:5000/api/movies/603/trailer" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Utilizzo frontend:
```javascript
// Costruisci URL YouTube
const trailerKey = "m8e-FF8MsqU";
const youtubeUrl = https://www.youtube.com/watch?v=${trailerKey};
const embedUrl = https://www.youtube.com/embed/${trailerKey}?autoplay=1;
```

---

GET /movies/:id/similar

Film simili a quello specificato.


Parametri URL:
- id (number, required) - ID del film su TMDB

Query Parameters:
- page (number, default: 1) - Numero pagina

Risposta:
```json
{
  "success": true,
  "data": {
    "movies": [
      {
        "id": 624,
        "title": "Matrix Reloaded",
        "overview": "...",
        "poster": "https://...",
        "releaseDate": "2003-05-15",
        "voteAverage": 7.1
      }
    ]
  }
}
```

Esempio cURL:
```bash
curl "http://localhost:5000/api/movies/603/similar?page=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

GET /movies/genres

Lista completa dei generi disponibili.

Risposta:
```json
{
  "success": true,
  "data": {
    "genres": [
      { "id": 28, "name": "Azione" },
      { "id": 12, "name": "Avventura" },
      { "id": 16, "name": "Animazione" },
      { "id": 35, "name": "Commedia" },
      { "id": 80, "name": "Crime" }
    ]
  }
}
```

Utilizzo:
- Convertire genre_ids in nomi leggibili
- Popolare filtri nella UI
- Risultati in italiano (grazie a language=it-IT)

Esempio cURL:
```bash
curl "http://localhost:5000/api/movies/genres" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

👆 Swipe Endpoints

Da documentare

---

👥 Group Endpoints

Da documentare

---

🎯 Recommendation Endpoints

Da documentare
