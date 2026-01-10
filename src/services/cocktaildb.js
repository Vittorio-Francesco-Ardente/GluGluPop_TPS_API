// ============================================
// THECOCKTAILDB API SERVICE
// Suggerimenti drink per film
// ============================================

import { API_CONFIG } from '../config/api';

const { BASE_URL } = API_CONFIG.COCKTAILDB;

// Helper per le richieste
const fetchCocktailDB = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`CocktailDB API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('CocktailDB fetch error:', error);
    throw error;
  }
};

// ============================================
// SEARCH COCKTAILS
// ============================================

// Cerca cocktail per nome
export const searchCocktailByName = async (name) => {
  const data = await fetchCocktailDB(`/search.php?s=${encodeURIComponent(name)}`);
  return data.drinks?.map(transformCocktail) || [];
};

// Cerca cocktail per prima lettera
export const searchCocktailByLetter = async (letter) => {
  const data = await fetchCocktailDB(`/search.php?f=${letter}`);
  return data.drinks?.map(transformCocktail) || [];
};

// Cerca ingrediente per nome
export const searchIngredient = async (ingredient) => {
  const data = await fetchCocktailDB(`/search.php?i=${encodeURIComponent(ingredient)}`);
  return data.ingredients || [];
};

// ============================================
// LOOKUP
// ============================================

// Ottieni dettagli cocktail per ID
export const getCocktailById = async (id) => {
  const data = await fetchCocktailDB(`/lookup.php?i=${id}`);
  return data.drinks?.[0] ? transformCocktailDetails(data.drinks[0]) : null;
};

// Ottieni dettagli ingrediente per ID
export const getIngredientById = async (id) => {
  const data = await fetchCocktailDB(`/lookup.php?iid=${id}`);
  return data.ingredients?.[0] || null;
};

// ============================================
// RANDOM
// ============================================

// Ottieni cocktail casuale
export const getRandomCocktail = async () => {
  const data = await fetchCocktailDB('/random.php');
  return data.drinks?.[0] ? transformCocktailDetails(data.drinks[0]) : null;
};

// Ottieni più cocktail casuali (per API premium, simuliamo con multiple chiamate)
export const getRandomCocktails = async (count = 5) => {
  const promises = Array(count).fill().map(() => getRandomCocktail());
  const results = await Promise.all(promises);
  return results.filter(Boolean);
};

// ============================================
// FILTER
// ============================================

// Filtra per ingrediente
export const filterByIngredient = async (ingredient) => {
  const data = await fetchCocktailDB(`/filter.php?i=${encodeURIComponent(ingredient)}`);
  return data.drinks?.map(transformCocktailBasic) || [];
};

// Filtra per categoria
export const filterByCategory = async (category) => {
  const data = await fetchCocktailDB(`/filter.php?c=${encodeURIComponent(category)}`);
  return data.drinks?.map(transformCocktailBasic) || [];
};

// Filtra per tipo di bicchiere
export const filterByGlass = async (glass) => {
  const data = await fetchCocktailDB(`/filter.php?g=${encodeURIComponent(glass)}`);
  return data.drinks?.map(transformCocktailBasic) || [];
};

// Filtra per alcolico/analcolico
export const filterByAlcoholic = async (alcoholic = true) => {
  const type = alcoholic ? 'Alcoholic' : 'Non_Alcoholic';
  const data = await fetchCocktailDB(`/filter.php?a=${type}`);
  return data.drinks?.map(transformCocktailBasic) || [];
};

// ============================================
// LISTS
// ============================================

// Lista categorie
export const getCategories = async () => {
  const data = await fetchCocktailDB('/list.php?c=list');
  return data.drinks?.map(d => d.strCategory) || [];
};

// Lista bicchieri
export const getGlasses = async () => {
  const data = await fetchCocktailDB('/list.php?g=list');
  return data.drinks?.map(d => d.strGlass) || [];
};

// Lista ingredienti
export const getIngredients = async () => {
  const data = await fetchCocktailDB('/list.php?i=list');
  return data.drinks?.map(d => d.strIngredient1) || [];
};

// Lista tipi alcolici
export const getAlcoholicTypes = async () => {
  const data = await fetchCocktailDB('/list.php?a=list');
  return data.drinks?.map(d => d.strAlcoholic) || [];
};

// ============================================
// MOVIE DRINK PAIRING
// ============================================

// Mapping genere film -> tipo di drink
const genreDrinkMapping = {
  'Azione': {
    keywords: ['whiskey', 'bourbon', 'shot'],
    mood: 'strong',
    suggestions: ['Whiskey Sour', 'Old Fashioned', 'Manhattan'],
    description: 'Drink forti e decisi per scene ad alta adrenalina'
  },
  'Fantascienza': {
    keywords: ['blue', 'vodka', 'gin', 'electric'],
    mood: 'futuristic',
    suggestions: ['Blue Lagoon', 'Cosmopolitan', 'Aviation'],
    description: 'Cocktail colorati e futuristici per viaggi nello spazio'
  },
  'Drammatico': {
    keywords: ['wine', 'martini', 'classic'],
    mood: 'sophisticated',
    suggestions: ['Dry Martini', 'Negroni', 'Manhattan'],
    description: 'Drink eleganti e sofisticati per storie profonde'
  },
  'Commedia': {
    keywords: ['tropical', 'fruity', 'colorful', 'rum'],
    mood: 'fun',
    suggestions: ['Mojito', 'Piña Colada', 'Margarita'],
    description: 'Cocktail freschi e divertenti per risate assicurate'
  },
  'Horror': {
    keywords: ['dark', 'black', 'bloody'],
    mood: 'dark',
    suggestions: ['Bloody Mary', 'Dark and Stormy', 'Black Russian'],
    description: 'Drink oscuri e misteriosi per serate da brivido'
  },
  'Romance': {
    keywords: ['champagne', 'rose', 'sweet', 'romantic'],
    mood: 'romantic',
    suggestions: ['French 75', 'Kir Royal', 'Bellini'],
    description: 'Cocktail romantici e raffinati per serate a due'
  },
  'Thriller': {
    keywords: ['gin', 'dark', 'sophisticated'],
    mood: 'mysterious',
    suggestions: ['Gimlet', 'Last Word', 'Corpse Reviver'],
    description: 'Drink intriganti per trame mozzafiato'
  },
  'Avventura': {
    keywords: ['rum', 'tropical', 'exotic'],
    mood: 'adventurous',
    suggestions: ['Mai Tai', 'Hurricane', 'Jungle Bird'],
    description: 'Cocktail esotici per grandi avventure'
  },
  'Animazione': {
    keywords: ['non alcoholic', 'mocktail', 'sweet'],
    mood: 'family',
    suggestions: ['Shirley Temple', 'Virgin Mojito', 'Fruit Punch'],
    description: 'Bevande analcoliche per tutta la famiglia'
  },
  'Western': {
    keywords: ['whiskey', 'bourbon', 'rye'],
    mood: 'rugged',
    suggestions: ['Whiskey Sour', 'Sazerac', 'Mint Julep'],
    description: 'Drink robusti dal sapore del West'
  }
};

// Ottieni abbinamento drink per film
export const getDrinkPairingForMovie = async (genre, movieTitle = null) => {
  const genreConfig = genreDrinkMapping[genre] || genreDrinkMapping['Drammatico'];
  
  // Prova a cercare uno dei drink suggeriti
  for (const suggestion of genreConfig.suggestions) {
    try {
      const results = await searchCocktailByName(suggestion);
      if (results.length > 0) {
        const cocktail = results[0];
        const details = await getCocktailById(cocktail.id);
        
        return {
          name: details.name,
          description: genreConfig.description,
          cocktail: details,
          genre,
          mood: genreConfig.mood,
          pairingReason: `${details.name}: perfetto per film di genere ${genre}`
        };
      }
    } catch (error) {
      continue;
    }
  }

  // Fallback a cocktail casuale con keyword
  try {
    const keyword = genreConfig.keywords[0];
    const byIngredient = await filterByIngredient(keyword);
    
    if (byIngredient.length > 0) {
      const randomIndex = Math.floor(Math.random() * Math.min(5, byIngredient.length));
      const cocktail = await getCocktailById(byIngredient[randomIndex].id);
      
      return {
        name: cocktail.name,
        description: genreConfig.description,
        cocktail,
        genre,
        mood: genreConfig.mood
      };
    }
  } catch (error) {
    console.error('Error getting drink pairing:', error);
  }

  // Fallback locale
  return getLocalDrinkPairing(genre);
};

// Ottieni più abbinamenti drink
export const getMultipleDrinkPairings = async (genre, count = 3) => {
  const genreConfig = genreDrinkMapping[genre] || genreDrinkMapping['Drammatico'];
  const cocktails = [];

  for (const suggestion of genreConfig.suggestions.slice(0, count)) {
    try {
      const results = await searchCocktailByName(suggestion);
      if (results.length > 0) {
        cocktails.push(results[0]);
      }
    } catch (error) {
      continue;
    }
  }

  return {
    cocktails,
    genre,
    description: genreConfig.description,
    mood: genreConfig.mood
  };
};

// ============================================
// NON-ALCOHOLIC OPTIONS
// ============================================

// Ottieni mocktail per film
export const getMocktailPairing = async (genre) => {
  try {
    const nonAlcoholic = await filterByAlcoholic(false);
    if (nonAlcoholic.length > 0) {
      const randomIndex = Math.floor(Math.random() * Math.min(10, nonAlcoholic.length));
      const details = await getCocktailById(nonAlcoholic[randomIndex].id);
      
      return {
        name: details.name,
        description: 'Bevanda analcolica perfetta per tutta la famiglia',
        cocktail: details,
        genre,
        isNonAlcoholic: true
      };
    }
  } catch (error) {
    console.error('Error getting mocktail:', error);
  }

  return getLocalMocktail();
};

// ============================================
// LOCAL FALLBACK DATA
// ============================================

const localDrinkPairings = {
  'Azione': {
    name: 'Whiskey Sour',
    description: 'Intenso e deciso, come le scene più adrenaliniche',
    ingredients: ['Whiskey bourbon', 'Succo di limone', 'Sciroppo', 'Angostura'],
    glass: 'Old Fashioned',
    instructions: 'Shakerare tutti gli ingredienti con ghiaccio e filtrare nel bicchiere'
  },
  'Fantascienza': {
    name: 'Blue Lagoon',
    description: 'Futuristico e vibrante, come un viaggio nello spazio',
    ingredients: ['Vodka', 'Blue Curaçao', 'Limonata'],
    glass: 'Highball',
    instructions: 'Versare gli ingredienti sul ghiaccio e mescolare'
  },
  'Drammatico': {
    name: 'Dry Martini',
    description: 'Elegante e intellettuale, per storie che fanno riflettere',
    ingredients: ['Gin', 'Vermouth dry', 'Oliva o twist di limone'],
    glass: 'Coppa Martini',
    instructions: 'Mescolare con ghiaccio e filtrare nella coppa raffreddata'
  },
  'Commedia': {
    name: 'Mojito',
    description: 'Fresco e spensierato, perfetto per ridere insieme',
    ingredients: ['Rum bianco', 'Lime', 'Menta', 'Zucchero', 'Soda'],
    glass: 'Highball',
    instructions: 'Pestare menta e lime, aggiungere rum, ghiaccio e soda'
  },
  'Horror': {
    name: 'Bloody Mary',
    description: 'Rosso sangue e piccante, per i palati coraggiosi',
    ingredients: ['Vodka', 'Succo di pomodoro', 'Tabasco', 'Worcestershire', 'Sedano'],
    glass: 'Highball',
    instructions: 'Mescolare tutti gli ingredienti e servire con gambo di sedano'
  },
  'Romance': {
    name: 'French 75',
    description: 'Raffinato e romantico, per serate indimenticabili',
    ingredients: ['Gin', 'Succo di limone', 'Sciroppo', 'Champagne'],
    glass: 'Flute',
    instructions: 'Shakerare gin, limone e sciroppo, versare in flute e completare con champagne'
  },
  'Thriller': {
    name: 'Negroni',
    description: 'Amaro e complesso, come le trame più intricate',
    ingredients: ['Gin', 'Campari', 'Vermouth rosso'],
    glass: 'Old Fashioned',
    instructions: 'Mescolare con ghiaccio e guarnire con fetta d\'arancia'
  }
};

const localMocktails = {
  name: 'Virgin Mojito',
  description: 'Fresco e analcolico, perfetto per tutti',
  ingredients: ['Lime', 'Menta', 'Zucchero', 'Soda', 'Ghiaccio'],
  glass: 'Highball',
  instructions: 'Pestare menta e lime, aggiungere ghiaccio e soda'
};

export const getLocalDrinkPairing = (genre) => {
  const pairing = localDrinkPairings[genre] || localDrinkPairings['Drammatico'];
  return {
    ...pairing,
    genre,
    isLocal: true
  };
};

export const getLocalMocktail = () => ({
  ...localMocktails,
  isLocal: true,
  isNonAlcoholic: true
});

// ============================================
// TRANSFORMERS
// ============================================

function transformCocktailBasic(drink) {
  return {
    id: drink.idDrink,
    name: drink.strDrink,
    image: drink.strDrinkThumb
  };
}

function transformCocktail(drink) {
  return {
    id: drink.idDrink,
    name: drink.strDrink,
    category: drink.strCategory,
    alcoholic: drink.strAlcoholic,
    glass: drink.strGlass,
    image: drink.strDrinkThumb
  };
}

function transformCocktailDetails(drink) {
  // Estrai ingredienti e misure (API li fornisce come strIngredient1-15 e strMeasure1-15)
  const ingredients = [];
  for (let i = 1; i <= 15; i++) {
    const ingredient = drink[`strIngredient${i}`];
    const measure = drink[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        name: ingredient.trim(),
        measure: measure?.trim() || '',
        image: `https://www.thecocktaildb.com/images/ingredients/${encodeURIComponent(ingredient)}-Small.png`
      });
    }
  }

  return {
    id: drink.idDrink,
    name: drink.strDrink,
    category: drink.strCategory,
    alcoholic: drink.strAlcoholic,
    glass: drink.strGlass,
    instructions: drink.strInstructionsIT || drink.strInstructions,
    instructionsEN: drink.strInstructions,
    image: drink.strDrinkThumb,
    ingredients,
    tags: drink.strTags?.split(',').map(t => t.trim()) || [],
    iba: drink.strIBA,
    video: drink.strVideo,
    dateModified: drink.dateModified
  };
}

// ============================================
// UTILITY
// ============================================

// Ottieni immagine ingrediente
export const getIngredientImage = (ingredientName, size = 'Medium') => {
  // Sizes: Small, Medium, Large
  return `https://www.thecocktaildb.com/images/ingredients/${encodeURIComponent(ingredientName)}-${size}.png`;
};

// Export default
export default {
  searchCocktailByName,
  searchCocktailByLetter,
  searchIngredient,
  getCocktailById,
  getIngredientById,
  getRandomCocktail,
  getRandomCocktails,
  filterByIngredient,
  filterByCategory,
  filterByGlass,
  filterByAlcoholic,
  getCategories,
  getGlasses,
  getIngredients,
  getAlcoholicTypes,
  getDrinkPairingForMovie,
  getMultipleDrinkPairings,
  getMocktailPairing,
  getLocalDrinkPairing,
  getLocalMocktail,
  getIngredientImage
};
