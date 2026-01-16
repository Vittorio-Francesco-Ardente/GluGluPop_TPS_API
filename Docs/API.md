# GluGluPop API Reference

## Indice

API.md  
├── [Auth Endpoints](#-auth-endpoints)  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── [POST /auth/register](#post-authregister)  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── [POST /auth/login](#post-authlogin)  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── [GET /auth/me](#get-authme)  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── [PUT /auth/preferences](#put-authpreferences)  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── [PUT /auth/profile](#put-authprofile)  
├── [Movie Endpoints](#-movie-endpoints)  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── [GET /movies/discover](#get-moviesdiscover)  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── [GET /movies/trending](#get-moviestrending)  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── [GET /movies/search](#get-moviessearch)  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── [GET /movies/:id](#get-moviesid)  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── [GET /movies/:id/trailer](#get-moviesidtrailer)  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── [GET /movies/:id/similar](#get-moviesidsimilar)  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── [GET /movies/genres](#get-moviesgenres)  
├── [Swipe Endpoints](#-swipe-endpoints)  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── [POST /swipes](#post-swipes)  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── [GET /swipes/likes](#get-swipeslikes)  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── [GET /swipes/history](#get-swipeshistory)  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── [GET /swipes/seen-ids](#get-swipesseen-ids)  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── [GET /swipes/stats](#get-swipesstats)  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── [DELETE /swipes/:movieId](#delete-swipesmovieid)  
├── [Group Endpoints](#-group-endpoints)  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── [POST /groups](#post-groups)  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── [POST /groups/join](#post-groupsjoin)  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── [GET /groups](#get-groups)  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── [GET /groups/:id](#get-groupsid)  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── [POST /groups/:id/vote](#post-groupsidvote)  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── [GET /groups/:id/matches](#get-groupsidmatches)  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── [DELETE /groups/:id/leave](#delete-groupsidleave)  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── [DELETE /groups/:id](#delete-groupsid)  
└── [Recommendation Endpoints](#-recommendation-endpoints)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── [GET /recommendations/profile](#get-recommendationsprofile)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── [GET /recommendations/similar](#get-recommendationssimilar)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── [GET /recommendations/genres](#get-recommendationsgenres)  

---

## 🔐 Auth Endpoints

### POST /auth/register

Registrazione nuovo utente.

**Body Parameters:**
- `email` (string, required) - Email utente
- `password` (string, required) - Password
- `username` (string, required) - Username univoco

**Risposta:**
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

**Errori:**
- `400` - Email già registrata
- `400` - Username già in uso

**Esempio cURL:**
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

### POST /auth/login

Login utente esistente.

**Body Parameters:**
- `email` (string, required) - Email utente
- `password` (string, required) - Password

**Risposta:**
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

**Errori:**
- `401` - Credenziali non valide

**Esempio cURL:**
```bash
curl -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

---

### GET /auth/me

Ottieni profilo utente corrente.

> Richiede autenticazione JWT.

**Risposta:**
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

**Errori:**
- `401` - Token mancante o non valido

**Esempio cURL:**
```bash
curl "http://localhost:5000/api/auth/me" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### PUT /auth/preferences

Aggiorna preferenze generi utente.

> Richiede autenticazione JWT.

**Body Parameters:**
- `genresPreferred` (array, required) - Array di ID generi

**Risposta:**
```json
{
  "success": true,
  "message": "Preferenze aggiornate! ✅",
  "data": {
    "genresPreferred": [28, 35, 878]
  }
}
```

**Note:**
- Accetta anche array diretto nel body (senza chiave `genresPreferred`)
- Utilizzato per personalizzare raccomandazioni

**Esempio cURL:**
```bash
curl -X PUT "http://localhost:5000/api/auth/preferences" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "genresPreferred": [28, 35, 878]
  }'
```

---

### PUT /auth/profile

Aggiorna profilo utente.

> Richiede autenticazione JWT.

**Body Parameters:**
- `username` (string, optional) - Nuovo username
- `avatar` (string, optional) - URL avatar

**Risposta:**
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

**Errori:**
- `400` - Username già in uso

**Esempio cURL:**
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


## 🎬 Movie Endpoints

> Tutti gli endpoint movie richiedono autenticazione JWT.

### GET /movies/discover

Scopri film con filtri opzionali. Usato per il feed principale.

**Query Parameters:**
- `page` (number, default: 1) - Numero pagina
- `genre` (string, optional) - ID genere (es. "28" per Action)
- `year` (number, optional) - Anno di uscita
- `sort_by` (string, default: "popularity.desc") - Ordinamento

**Risposta:**
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

**Esempio cURL:**
```bash
curl "http://localhost:5000/api/movies/discover?page=1&genre=28" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### GET /movies/trending

Film più popolari del momento.

**Query Parameters:**
- `timeWindow` (string, default: "week") - "day" o "week"

**Risposta:**
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

**Esempio cURL:**
```bash
curl "http://localhost:5000/api/movies/trending?timeWindow=day" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### GET /movies/search

Cerca film per titolo.

**Query Parameters:**
- `q` (string, required) - Titolo da cercare
- `page` (number, default: 1) - Numero pagina

**Risposta:**
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

**Esempio cURL:**
```bash
curl "http://localhost:5000/api/movies/search?q=matrix&page=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### GET /movies/:id

Dettagli completi di un singolo film.

**Parametri URL:**
- `id` (number, required) - ID del film su TMDB

**Risposta:**
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

**Esempio cURL:**
```bash
curl "http://localhost:5000/api/movies/603" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### GET /movies/:id/trailer

Ottieni solo il trailer di un film (YouTube key).

**Parametri URL:**
- `id` (number, required) - ID del film su TMDB

**Risposta:**
```json
{
  "success": true,
  "data": {
    "trailer": "m8e-FF8MsqU"
  }
}
```

**Note:**
- Se trailer non disponibile: `"trailer": null`
- Prova prima lingua italiana, fallback a inglese
- Cache in memoria per 6 ore

**Esempio cURL:**
```bash
curl "http://localhost:5000/api/movies/603/trailer" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Utilizzo frontend:**
```javascript
// Costruisci URL YouTube
const trailerKey = "m8e-FF8MsqU";
const youtubeUrl = `https://www.youtube.com/watch?v=${trailerKey}`;
const embedUrl = `https://www.youtube.com/embed/${trailerKey}?autoplay=1`;
```

---

### GET /movies/:id/similar

Film simili a quello specificato.


**Parametri URL:**
- `id` (number, required) - ID del film su TMDB

**Query Parameters:**
- `page` (number, default: 1) - Numero pagina

**Risposta:**
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

**Esempio cURL:**
```bash
curl "http://localhost:5000/api/movies/603/similar?page=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### GET /movies/genres

Lista completa dei generi disponibili.

**Risposta:**
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

**Utilizzo:**
- Convertire `genre_ids` in nomi leggibili
- Popolare filtri nella UI
- Risultati in italiano (grazie a `language=it-IT`)

**Esempio cURL:**
```bash
curl "http://localhost:5000/api/movies/genres" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 👆 Swipe Endpoints

### POST /swipes

Registra uno swipe (like/skip/superlike) su un film.

> Richiede autenticazione JWT.

**Body Parameters:**
- `movieId` (number, required) - ID del film su TMDB
- `movieTitle` (string, required) - Titolo del film
- `moviePoster` (string, optional) - URL poster del film
- `movieGenres` (array, optional) - Array di ID generi
- `action` (string, required) - Tipo di swipe: "like", "skip", "superlike"

**Risposta:**
```json
{
  "success": true,
  "message": "❤️ Film aggiunto ai preferiti!",
  "data": {
    "swipe": {
      "id": 123,
      "userId": 1,
      "movieId": 603,
      "movieTitle": "Matrix",
      "moviePoster": "https://image.tmdb.org/t/p/w500/...",
      "movieGenres": [28, 878],
      "action": "like",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Note:**
- Se esiste già uno swipe per questo film, viene aggiornato
- Le statistiche utente (totalLikes/totalSkips) vengono aggiornate automaticamente
- Message varia: "❤️ Film aggiunto ai preferiti!" per like, "⭐️ Film saltato" per skip

**Esempio cURL:**
```bash
curl -X POST "http://localhost:5000/api/swipes" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "movieId": 603,
    "movieTitle": "Matrix",
    "moviePoster": "https://image.tmdb.org/t/p/w500/...",
    "movieGenres": [28, 878],
    "action": "like"
  }'
```

---

### GET /swipes/likes

Ottieni tutti i film con like o superlike.

> Richiede autenticazione JWT.

**Query Parameters:**
- `page` (number, default: 1) - Numero pagina
- `limit` (number, default: 20) - Risultati per pagina

**Risposta:**
```json
{
  "success": true,
  "data": {
    "likes": [
      {
        "id": 123,
        "userId": 1,
        "movieId": 603,
        "movieTitle": "Matrix",
        "moviePoster": "https://image.tmdb.org/t/p/w500/...",
        "movieGenres": [28, 878],
        "action": "like",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 42,
      "pages": 3
    }
  }
}
```

**Note:**
- Include sia "like" che "superlike"
- Ordinamento: più recenti prima
- Utile per visualizzare la watchlist dell'utente

**Esempio cURL:**
```bash
curl "http://localhost:5000/api/swipes/likes?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### GET /swipes/history

Ottieni lo storico completo di tutti gli swipe.

> Richiede autenticazione JWT.

**Query Parameters:**
- `page` (number, default: 1) - Numero pagina
- `limit` (number, default: 50) - Risultati per pagina

**Risposta:**
```json
{
  "success": true,
  "data": {
    "swipes": [
      {
        "id": 123,
        "userId": 1,
        "movieId": 603,
        "movieTitle": "Matrix",
        "moviePoster": "https://image.tmdb.org/t/p/w500/...",
        "movieGenres": [28, 878],
        "action": "like",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      },
      {
        "id": 124,
        "userId": 1,
        "movieId": 550,
        "movieTitle": "Fight Club",
        "moviePoster": "https://...",
        "movieGenres": [18],
        "action": "skip",
        "createdAt": "2024-01-15T10:25:00.000Z",
        "updatedAt": "2024-01-15T10:25:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 120,
      "pages": 3
    }
  }
}
```

**Note:**
- Include like, skip e superlike
- Ordinamento: più recenti prima
- Limite default più alto (50) rispetto a /likes

**Esempio cURL:**
```bash
curl "http://localhost:5000/api/swipes/history?page=1&limit=50" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### GET /swipes/seen-ids

Ottieni gli ID di tutti i film già visti (swipati).

> Richiede autenticazione JWT.

**Risposta:**
```json
{
  "success": true,
  "data": {
    "seenIds": [603, 550, 624, 155, 13]
  }
}
```

**Utilizzo:**
- Evitare di riproporre film già visti nel feed discover
- Filtro lato frontend o backend per nuove raccomandazioni
- Ottimizzato: ritorna solo array di ID (no dati completi)

**Esempio cURL:**
```bash
curl "http://localhost:5000/api/swipes/seen-ids" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### GET /swipes/stats

Statistiche dettagliate sugli swipe dell'utente.

> Richiede autenticazione JWT.

**Risposta:**
```json
{
  "success": true,
  "data": {
    "totalLikes": 42,
    "totalSkips": 15,
    "totalSwipes": 57,
    "likeRate": "73.7%",
    "favoriteGenres": [
      { "genreId": 28, "count": 18 },
      { "genreId": 878, "count": 15 },
      { "genreId": 35, "count": 12 },
      { "genreId": 27, "count": 8 },
      { "genreId": 53, "count": 6 }
    ]
  }
}
```

**Note:**
- `likeRate`: Percentuale di like sul totale swipe
- `favoriteGenres`: Top 5 generi più apprezzati (basato su like)
- Utile per dashboard utente o personalizzazione raccomandazioni

**Esempio cURL:**
```bash
curl "http://localhost:5000/api/swipes/stats" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### DELETE /swipes/:movieId

Elimina uno swipe (rimuovi dai preferiti).

> Richiede autenticazione JWT.

**Parametri URL:**
- `movieId` (number, required) - ID del film su TMDB

**Risposta:**
```json
{
  "success": true,
  "message": "Swipe eliminato! 🗑️"
}
```

**Errori:**
- `404` - Swipe non trovato

**Note:**
- Le statistiche utente (totalLikes/totalSkips) vengono aggiornate automaticamente
- Utile per "cambiare idea" o pulire la watchlist

**Esempio cURL:**
```bash
curl -X DELETE "http://localhost:5000/api/swipes/603" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 👥 Group Endpoints

> Tutti gli endpoint group richiedono autenticazione JWT.

### POST /groups

Crea un nuovo gruppo.

**Body Parameters:**
- `name` (string, required) - Nome del gruppo (max 50 caratteri)

**Risposta:**
```json
{
  "success": true,
  "message": "Gruppo creato! 🎉",
  "data": {
    "group": {
      "id": 1,
      "name": "Film Friday",
      "code": "A3F5B2",
      "status": "active"
    }
  }
}
```

**Note:**
- Il creatore viene automaticamente aggiunto come membro
- Viene generato un codice univoco a 6 caratteri per inviti
- Il gruppo scade dopo 24 ore dalla creazione
- Status: "active", "voting", "completed"

**Esempio cURL:**
```bash
curl -X POST "http://localhost:5000/api/groups" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Film Friday"
  }'
```

---

### POST /groups/join

Unisciti a un gruppo tramite codice.

**Body Parameters:**
- `code` (string, required) - Codice gruppo a 6 caratteri

**Risposta:**
```json
{
  "success": true,
  "message": "Ti sei unito al gruppo! 🎬",
  "data": {
    "group": {
      "id": 1,
      "name": "Film Friday",
      "code": "A3F5B2",
      "status": "active",
      "creatorId": 5,
      "expiresAt": "2024-01-16T10:30:00.000Z",
      "members": [
        {
          "id": 5,
          "username": "creator",
          "avatar": null
        },
        {
          "id": 1,
          "username": "newmember",
          "avatar": null
        }
      ]
    }
  }
}
```

**Errori:**
- `404` - Gruppo non trovato o scaduto
- `400` - Già membro del gruppo
- `400` - Gruppo pieno (max 8 membri)

**Esempio cURL:**
```bash
curl -X POST "http://localhost:5000/api/groups/join" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "A3F5B2"
  }'
```

---

### GET /groups

Ottieni tutti i tuoi gruppi.

**Risposta:**
```json
{
  "success": true,
  "data": {
    "groups": [
      {
        "id": 1,
        "name": "Film Friday",
        "code": "A3F5B2",
        "status": "active",
        "creatorId": 5,
        "expiresAt": "2024-01-16T10:30:00.000Z",
        "members": [
          {
            "id": 5,
            "username": "creator",
            "avatar": null
          },
          {
            "id": 1,
            "username": "member1",
            "avatar": null
          }
        ],
        "creator": {
          "id": 5,
          "username": "creator"
        }
      }
    ]
  }
}
```

**Note:**
- Mostra solo gruppi attivi o in votazione (non "completed")
- Include tutti i membri e il creatore

**Esempio cURL:**
```bash
curl "http://localhost:5000/api/groups" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### GET /groups/:id

Ottieni dettagli di un gruppo specifico.

**Parametri URL:**
- `id` (number, required) - ID del gruppo

**Risposta:**
```json
{
  "success": true,
  "data": {
    "group": {
      "id": 1,
      "name": "Film Friday",
      "code": "A3F5B2",
      "status": "active",
      "creatorId": 5,
      "expiresAt": "2024-01-16T10:30:00.000Z",
      "members": [
        {
          "id": 5,
          "username": "creator",
          "avatar": null
        },
        {
          "id": 1,
          "username": "member1",
          "avatar": null
        }
      ],
      "creator": {
        "id": 5,
        "username": "creator",
        "avatar": null
      }
    }
  }
}
```

**Errori:**
- `404` - Gruppo non trovato
- `403` - Non sei membro di questo gruppo

**Esempio cURL:**
```bash
curl "http://localhost:5000/api/groups/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### POST /groups/:id/vote

Vota un film nel gruppo.

**Parametri URL:**
- `id` (number, required) - ID del gruppo

**Body Parameters:**
- `movieId` (number, required) - ID del film su TMDB
- `movieTitle` (string, required) - Titolo del film
- `moviePoster` (string, optional) - URL poster del film
- `vote` (string, required) - Voto: "like" o "skip"

**Risposta:**
```json
{
  "success": true,
  "message": "🎉 MATCH! Tutti hanno messo like!",
  "data": {
    "isMatch": true,
    "votesCount": 3,
    "totalMembers": 3,
    "votes": [
      { "userId": 1, "vote": "like" },
      { "userId": 2, "vote": "like" },
      { "userId": 3, "vote": "like" }
    ]
  }
}
```

**Note:**
- Se il voto esiste già per questo film, viene aggiornato
- `isMatch`: true se tutti i membri hanno votato "like"
- Message varia: "🎉 MATCH!" se tutti like, "Voto registrato! ✅" altrimenti

**Errori:**
- `404` - Gruppo non trovato
- `403` - Non sei membro di questo gruppo

**Esempio cURL:**
```bash
curl -X POST "http://localhost:5000/api/groups/1/vote" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "movieId": 603,
    "movieTitle": "Matrix",
    "moviePoster": "https://image.tmdb.org/t/p/w500/...",
    "vote": "like"
  }'
```

---

### GET /groups/:id/matches

Ottieni tutti i match del gruppo.

**Parametri URL:**
- `id` (number, required) - ID del gruppo

**Risposta:**
```json
{
  "success": true,
  "data": {
    "matches": [
      {
        "movieId": 603,
        "movieTitle": "Matrix",
        "moviePoster": "https://image.tmdb.org/t/p/w500/..."
      },
      {
        "movieId": 550,
        "movieTitle": "Fight Club",
        "moviePoster": "https://image.tmdb.org/t/p/w500/..."
      }
    ],
    "totalMembers": 3
  }
}
```

**Note:**
- Un match è un film dove tutti i membri hanno votato "like"
- Utile per vedere la lista finale dei film da guardare insieme

**Esempio cURL:**
```bash
curl "http://localhost:5000/api/groups/1/matches" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### DELETE /groups/:id/leave

Esci da un gruppo.

**Parametri URL:**
- `id` (number, required) - ID del gruppo

**Risposta:**
```json
{
  "success": true,
  "message": "Hai lasciato il gruppo 👋"
}
```

**Errori:**
- `404` - Gruppo non trovato
- `400` - Il creatore non può abbandonare il gruppo

**Note:**
- Il creatore non può lasciare il gruppo, deve eliminarlo
- Vengono rimossi anche tutti i voti dell'utente

**Esempio cURL:**
```bash
curl -X DELETE "http://localhost:5000/api/groups/1/leave" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### DELETE /groups/:id

Elimina un gruppo (solo creatore).

**Parametri URL:**
- `id` (number, required) - ID del gruppo

**Risposta:**
```json
{
  "success": true,
  "message": "Gruppo eliminato! 🗑️"
}
```

**Errori:**
- `404` - Gruppo non trovato
- `403` - Solo il creatore può eliminare il gruppo

**Note:**
- Elimina tutto: membri, voti e il gruppo stesso
- Azione irreversibile

**Esempio cURL:**
```bash
curl -X DELETE "http://localhost:5000/api/groups/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎯 Recommendation Endpoints

> Tutti gli endpoint recommendation richiedono autenticazione JWT.

### GET /recommendations/profile

Ottieni il profilo di raccomandazione dell'utente.

**Risposta:**
```json
{
  "success": true,
  "data": {
    "favoriteGenres": [
      { "genreId": 28, "count": 18 },
      { "genreId": 878, "count": 15 },
      { "genreId": 35, "count": 12 },
      { "genreId": 27, "count": 8 },
      { "genreId": 53, "count": 6 }
    ],
    "seenMovieIds": [603, 550, 624, 155, 13],
    "stats": {
      "totalLikes": 42,
      "totalSwipes": 57,
      "likeRate": "73.7%"
    }
  }
}
```

**Utilizzo:**
- `favoriteGenres`: Top 5 generi più apprezzati (basato su like/superlike)
- `seenMovieIds`: Array di ID film già visti per evitare duplicati
- `stats`: Statistiche generali sull'attività dell'utente

**Esempio cURL:**
```bash
curl "http://localhost:5000/api/recommendations/profile" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### GET /recommendations/similar

Ottieni dati per film simili ai tuoi like.

**Risposta:**
```json
{
  "success": true,
  "data": {
    "recentLikedMovies": [
      { "movieId": 603, "movieTitle": "Matrix" },
      { "movieId": 550, "movieTitle": "Fight Club" },
      { "movieId": 155, "movieTitle": "The Dark Knight" }
    ]
  }
}
```

**Note:**
- Ritorna gli ultimi 10 film con like/superlike
- Usa questi ID per chiamare TMDb `/movie/{id}/similar`
- Utile per costruire feed personalizzati

**Esempio cURL:**
```bash
curl "http://localhost:5000/api/recommendations/similar" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Utilizzo frontend:**
```javascript
// Per ogni film ritornato, chiama TMDb similar
const movies = data.recentLikedMovies;
for (const movie of movies) {
  // GET /api/movies/${movie.movieId}/similar
}
```

---

### GET /recommendations/genres

Suggerimenti basati sui generi preferiti.

**Risposta:**
```json
{
  "success": true,
  "data": {
    "recommendedGenreIds": [28, 878, 35],
    "excludeMovieIds": [603, 550, 624, 155, 13],
    "message": "Usa questi generi per chiamare TMDb /discover/movie"
  }
}
```

**Utilizzo:**
- `recommendedGenreIds`: Top 3 generi più apprezzati
- `excludeMovieIds`: Film già visti da escludere
- Usa per query TMDb `/discover/movie` con filtri genere

**Esempio cURL:**
```bash
curl "http://localhost:5000/api/recommendations/genres" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Utilizzo frontend:**
```javascript
// Costruisci query TMDb discover
const { recommendedGenreIds, excludeMovieIds } = data;
const genreQuery = recommendedGenreIds.join(','); // "28,878,35"

// GET /api/movies/discover?genre=${genreQuery}
// Poi filtra lato client escludendo excludeMovieIds
```

---
