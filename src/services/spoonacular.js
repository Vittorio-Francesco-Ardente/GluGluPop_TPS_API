// ============================================
// SPOONACULAR API SERVICE
// Abbinamenti cibo per film
// ============================================

import { API_CONFIG } from '../config/api';

const { BASE_URL, API_KEY } = API_CONFIG.SPOONACULAR;

// Helper per le richieste
const fetchSpoonacular = async (endpoint, params = {}) => {
  const searchParams = new URLSearchParams({
    apiKey: API_KEY,
    ...params
  });

  try {
    const response = await fetch(`${BASE_URL}${endpoint}?${searchParams}`);
    if (!response.ok) {
      throw new Error(`Spoonacular API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Spoonacular fetch error:', error);
    throw error;
  }
};

// ============================================
// RECIPE SEARCH
// ============================================

// Cerca ricette per parole chiave
export const searchRecipes = async (query, options = {}) => {
  const {
    cuisine = null,       // italian, american, mexican, etc.
    diet = null,          // vegetarian, vegan, gluten free, etc.
    type = null,          // appetizer, main course, snack, dessert, etc.
    maxReadyTime = null,  // tempo massimo preparazione in minuti
    number = 10           // numero risultati
  } = options;

  const params = { query, number };
  if (cuisine) params.cuisine = cuisine;
  if (diet) params.diet = diet;
  if (type) params.type = type;
  if (maxReadyTime) params.maxReadyTime = maxReadyTime;

  const data = await fetchSpoonacular('/recipes/complexSearch', params);
  return {
    results: data.results?.map(transformRecipe) || [],
    totalResults: data.totalResults
  };
};

// Cerca ricette per ingredienti
export const searchByIngredients = async (ingredients, number = 10) => {
  const data = await fetchSpoonacular('/recipes/findByIngredients', {
    ingredients: ingredients.join(','),
    number,
    ranking: 2, // Massimizza ingredienti usati
    ignorePantry: true
  });

  return data.map(transformRecipeByIngredients);
};

// ============================================
// RECIPE DETAILS
// ============================================

// Ottieni dettagli ricetta
export const getRecipeDetails = async (recipeId) => {
  const data = await fetchSpoonacular(`/recipes/${recipeId}/information`, {
    includeNutrition: false
  });

  return transformRecipeDetails(data);
};

// Ottieni istruzioni passo-passo
export const getRecipeInstructions = async (recipeId) => {
  const data = await fetchSpoonacular(`/recipes/${recipeId}/analyzedInstructions`);
  return data;
};

// ============================================
// MOVIE FOOD PAIRING
// ============================================

// Mapping genere film -> tipo di cibo
const genreFoodMapping = {
  'Azione': {
    keywords: ['finger food', 'spicy', 'nachos', 'wings', 'slider'],
    cuisine: 'american',
    type: 'appetizer',
    description: 'Cibi veloci e intensi da gustare durante scene mozzafiato'
  },
  'Fantascienza': {
    keywords: ['futuristic', 'molecular', 'creative', 'colorful', 'unique'],
    cuisine: null,
    type: 'snack',
    description: 'Snack creativi e originali per viaggi intergalattici'
  },
  'Drammatico': {
    keywords: ['comfort food', 'elegant', 'wine pairing', 'cheese', 'sophisticated'],
    cuisine: 'italian',
    type: 'main course',
    description: 'Piatti raffinati per una visione contemplativa'
  },
  'Commedia': {
    keywords: ['fun', 'party', 'colorful', 'sharing', 'popcorn', 'candy'],
    cuisine: null,
    type: 'snack',
    description: 'Snack divertenti da condividere tra una risata e l\'altra'
  },
  'Horror': {
    keywords: ['dark', 'creative', 'halloween', 'themed', 'spooky'],
    cuisine: null,
    type: 'appetizer',
    description: 'Stuzzichini da brivido per serate spaventose'
  },
  'Romance': {
    keywords: ['romantic', 'chocolate', 'strawberry', 'dessert', 'elegant'],
    cuisine: 'french',
    type: 'dessert',
    description: 'Dolci romantici per serate speciali'
  },
  'Thriller': {
    keywords: ['sophisticated', 'dark', 'intense', 'appetizer'],
    cuisine: null,
    type: 'appetizer',
    description: 'Assaggi sofisticati per tenerti sul filo del rasoio'
  },
  'Avventura': {
    keywords: ['exotic', 'travel', 'international', 'bold'],
    cuisine: null,
    type: 'main course',
    description: 'Sapori esotici per grandi avventure'
  },
  'Animazione': {
    keywords: ['kids', 'fun', 'colorful', 'sweet', 'creative'],
    cuisine: null,
    type: 'snack',
    description: 'Snack colorati e divertenti per tutta la famiglia'
  },
  'Western': {
    keywords: ['bbq', 'grill', 'steak', 'beans', 'cowboy'],
    cuisine: 'american',
    type: 'main course',
    description: 'Sapori rustici del selvaggio West'
  }
};

// Ottieni abbinamento cibo per film
export const getFoodPairingForMovie = async (genre, movieTitle = null) => {
  const genreConfig = genreFoodMapping[genre] || genreFoodMapping['Drammatico'];
  
  // Cerca ricette basate sul genere
  const keyword = genreConfig.keywords[Math.floor(Math.random() * genreConfig.keywords.length)];
  
  try {
    const results = await searchRecipes(keyword, {
      cuisine: genreConfig.cuisine,
      type: genreConfig.type,
      maxReadyTime: 30,
      number: 5
    });

    if (results.results.length > 0) {
      const recipe = results.results[0];
      const details = await getRecipeDetails(recipe.id);
      
      return {
        name: details.title,
        description: genreConfig.description,
        recipe: details,
        genre,
        pairingReason: `Perfetto per film di genere ${genre}`
      };
    }
  } catch (error) {
    console.error('Error getting food pairing:', error);
  }

  // Fallback a suggerimento locale
  return getLocalFoodPairing(genre);
};

// Ottieni più abbinamenti
export const getMultipleFoodPairings = async (genre, count = 3) => {
  const genreConfig = genreFoodMapping[genre] || genreFoodMapping['Drammatico'];
  
  try {
    const allResults = await Promise.all(
      genreConfig.keywords.slice(0, count).map(keyword =>
        searchRecipes(keyword, {
          cuisine: genreConfig.cuisine,
          type: genreConfig.type,
          maxReadyTime: 30,
          number: 1
        })
      )
    );

    const recipes = allResults
      .filter(r => r.results.length > 0)
      .map(r => r.results[0]);

    return {
      recipes,
      genre,
      description: genreConfig.description
    };
  } catch (error) {
    console.error('Error getting multiple food pairings:', error);
    return {
      recipes: [],
      genre,
      description: genreConfig.description
    };
  }
};

// ============================================
// SNACK SUGGESTIONS
// ============================================

// Suggerimenti snack per serata cinema
export const getCinemaSnacks = async (options = {}) => {
  const {
    healthy = false,
    quick = true,
    number = 10
  } = options;

  const keywords = healthy 
    ? ['healthy snack', 'vegetable chips', 'fruit', 'nuts']
    : ['popcorn', 'nachos', 'chips', 'candy'];

  const keyword = keywords[Math.floor(Math.random() * keywords.length)];
  
  return searchRecipes(keyword, {
    type: 'snack',
    maxReadyTime: quick ? 15 : 30,
    number
  });
};

// ============================================
// LOCAL FALLBACK DATA
// ============================================

const localFoodPairings = {
  'Azione': {
    name: 'Nachos con Formaggio e Jalapeños',
    description: 'Croccanti e audaci, perfetti per scene ad alto tasso adrenalinico',
    prepTime: '10 min',
    ingredients: ['Tortilla chips', 'Formaggio cheddar', 'Jalapeños', 'Panna acida']
  },
  'Fantascienza': {
    name: 'Popcorn al Tartufo Nero',
    description: 'Sofisticato e futuristico, un\'esperienza gastronomica oltre i confini',
    prepTime: '5 min',
    ingredients: ['Popcorn', 'Olio al tartufo', 'Sale', 'Parmigiano']
  },
  'Drammatico': {
    name: 'Tagliere di Formaggi Stagionati',
    description: 'Raffinato e contemplativo, da gustare lentamente',
    prepTime: '10 min',
    ingredients: ['Parmigiano 36 mesi', 'Pecorino', 'Gorgonzola', 'Miele', 'Noci']
  },
  'Commedia': {
    name: 'Mini Slider con Salse Colorate',
    description: 'Divertenti e colorati, perfetti da condividere ridendo',
    prepTime: '20 min',
    ingredients: ['Panini mignon', 'Hamburger', 'Ketchup', 'Maionese', 'Senape']
  },
  'Horror': {
    name: 'Stuzzichini a Tema Halloween',
    description: 'Snack creativi e spaventosi per serate da brivido',
    prepTime: '15 min',
    ingredients: ['Wurstel', 'Pasta sfoglia', 'Olive nere', 'Ketchup']
  },
  'Romance': {
    name: 'Fragole con Cioccolato Fondente',
    description: 'Dolce e romantico, per serate speciali a due',
    prepTime: '10 min',
    ingredients: ['Fragole fresche', 'Cioccolato fondente 70%', 'Panna montata']
  },
  'Thriller': {
    name: 'Bruschette Assortite',
    description: 'Eleganti e versatili, per tenerti sul filo del rasoio',
    prepTime: '15 min',
    ingredients: ['Pane tostato', 'Pomodorini', 'Basilico', 'Olive', 'Prosciutto']
  }
};

export const getLocalFoodPairing = (genre) => {
  const pairing = localFoodPairings[genre] || localFoodPairings['Drammatico'];
  return {
    ...pairing,
    genre,
    isLocal: true
  };
};

// ============================================
// TRANSFORMERS
// ============================================

function transformRecipe(recipe) {
  return {
    id: recipe.id,
    title: recipe.title,
    image: recipe.image,
    imageType: recipe.imageType
  };
}

function transformRecipeByIngredients(recipe) {
  return {
    id: recipe.id,
    title: recipe.title,
    image: recipe.image,
    usedIngredients: recipe.usedIngredients?.map(i => i.name) || [],
    missedIngredients: recipe.missedIngredients?.map(i => i.name) || [],
    likes: recipe.likes
  };
}

function transformRecipeDetails(recipe) {
  return {
    id: recipe.id,
    title: recipe.title,
    image: recipe.image,
    readyInMinutes: recipe.readyInMinutes,
    servings: recipe.servings,
    sourceUrl: recipe.sourceUrl,
    summary: recipe.summary?.replace(/<[^>]*>/g, ''), // Rimuovi HTML
    cuisines: recipe.cuisines || [],
    dishTypes: recipe.dishTypes || [],
    diets: recipe.diets || [],
    instructions: recipe.instructions?.replace(/<[^>]*>/g, ''),
    ingredients: recipe.extendedIngredients?.map(i => ({
      name: i.name,
      amount: i.amount,
      unit: i.unit,
      original: i.original
    })) || [],
    vegetarian: recipe.vegetarian,
    vegan: recipe.vegan,
    glutenFree: recipe.glutenFree,
    dairyFree: recipe.dairyFree,
    healthScore: recipe.healthScore,
    pricePerServing: recipe.pricePerServing
  };
}

// Export default
export default {
  searchRecipes,
  searchByIngredients,
  getRecipeDetails,
  getRecipeInstructions,
  getFoodPairingForMovie,
  getMultipleFoodPairings,
  getCinemaSnacks,
  getLocalFoodPairing
};
