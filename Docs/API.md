# GluGluPop API Reference

## Indice

API.md  
├── [Auth Endpoints](#-auth-endpoints)  
├── [Movie Endpoints](#-movie-endpoints)  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── [GET /movies/discover](#get-moviesdiscover)  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── [GET /movies/trending](#get-moviestrending)  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── [GET /movies/search](#get-moviessearch)  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── [GET /movies/:id](#get-moviesid)  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── [GET /movies/:id/trailer](#get-moviesidtrailer)  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── [GET /movies/:id/similar](#get-moviesidsimilar)  
│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── [GET /movies/genres](#get-moviesgenres)  
├── [Swipe Endpoints](#-swipe-endpoints)  
├── [Group Endpoints](#-group-endpoints)  
└── [Recommendation Endpoints](#-recommendation-endpoints)  

---

## 🔐 Auth Endpoints

_Da documentare_


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

_Da documentare_

---

## 👥 Group Endpoints

_Da documentare_

---

## 🎯 Recommendation Endpoints

_Da documentare_