import { create } from 'zustand';
import { CartItem, Recipe, RecipeRequest, Ingredient, Address, Order } from './types';

interface StoreState {
  recipes: Recipe[];
  cart: CartItem[];
  recipeRequest: RecipeRequest | null;
  currentOrder: Order | null;
  checkoutStep: 'cart' | 'address' | 'payment' | 'confirmation';
  setRecipeRequest: (request: RecipeRequest) => void;
  addToCart: (items: CartItem[]) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  suggestRecipe: (request: RecipeRequest) => Recipe;
  setCheckoutStep: (step: 'cart' | 'address' | 'payment' | 'confirmation') => void;
  submitOrder: (address: Address, paymentMethod: string) => void;
}

const calculateIngredients = (baseIngredients: Ingredient[], servings: number): Ingredient[] => {
  return baseIngredients.map(ing => ({
    ...ing,
    quantity: `${parseFloat(ing.perServing) * servings} ${ing.perServing.split(' ')[1]}`,
    price: parseFloat((ing.price * servings).toFixed(2))
  }));
};

const recipeKeywords = {
  'pizza': ['pizza', 'margherita', 'italian pizza', 'cheese pizza'],
  'pasta': ['pasta', 'fettuccine', 'alfredo', 'white sauce pasta', 'italian pasta'],
  'biryani': ['biryani', 'hyderabadi biryani', 'chicken biryani', 'dum biryani'],
  'noodles': ['noodles', 'schezwan noodles', 'chinese noodles', 'hakka noodles'],
  'burger': ['burger', 'cheese burger', 'hamburger', 'beef burger'],
  'haleem': ['haleem', 'hyderabadi haleem', 'mutton haleem'],
  'roti': ['roti', 'chapati', 'butter roti', 'dal roti']
};

const baseRecipes: { [key: string]: Recipe } = {
  'pizza': {
    id: 'pizza',
    name: 'Margherita Pizza',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=800',
    servings: 1,
    priceRange: { min: 200, max: 600 },
    ingredients: [
      {
        id: 'pizza-flour',
        name: '00 Pizza Flour',
        quantity: '250g',
        price: 40,
        perServing: '250g',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'yeast',
        name: 'Active Dry Yeast',
        quantity: '7g',
        price: 15,
        perServing: '7g',
        image: 'https://images.unsplash.com/photo-1585996560233-a81c58eacde7?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'mozzarella',
        name: 'Fresh Mozzarella',
        quantity: '200g',
        price: 120,
        perServing: '200g',
        image: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'tomato-sauce',
        name: 'San Marzano Tomatoes',
        quantity: '200g',
        price: 60,
        perServing: '200g',
        image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'olive-oil-pizza',
        name: 'Extra Virgin Olive Oil',
        quantity: '30ml',
        price: 40,
        perServing: '30ml',
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'basil-pizza',
        name: 'Fresh Basil Leaves',
        quantity: '10 leaves',
        price: 30,
        perServing: '10 leaves',
        image: 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?auto=format&fit=crop&q=80&w=300'
      }
    ]
  },
  'pasta': {
    id: 'pasta',
    name: 'Fettuccine Alfredo',
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&q=80&w=800',
    servings: 1,
    priceRange: { min: 150, max: 500 },
    ingredients: [
      {
        id: 'fettuccine',
        name: 'Fresh Fettuccine',
        quantity: '200g',
        price: 80,
        perServing: '200g',
        image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'heavy-cream',
        name: 'Heavy Cream',
        quantity: '200ml',
        price: 60,
        perServing: '200ml',
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'parmesan',
        name: 'Parmesan Cheese',
        quantity: '100g',
        price: 120,
        perServing: '100g',
        image: 'https://images.unsplash.com/photo-1566454825481-9c4cadf8c7dd?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'butter',
        name: 'Unsalted Butter',
        quantity: '60g',
        price: 40,
        perServing: '60g',
        image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'garlic-pasta',
        name: 'Fresh Garlic',
        quantity: '4 cloves',
        price: 15,
        perServing: '4 cloves',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=300'
      }
    ]
  },
  'biryani': {
    id: 'biryani',
    name: 'Hyderabadi Chicken Biryani',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=800',
    servings: 1,
    priceRange: { min: 250, max: 800 },
    ingredients: [
      {
        id: 'basmati',
        name: 'Aged Basmati Rice',
        quantity: '200g',
        price: 80,
        perServing: '200g',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'chicken-biryani',
        name: 'Chicken Thighs',
        quantity: '300g',
        price: 150,
        perServing: '300g',
        image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'yogurt-biryani',
        name: 'Plain Yogurt',
        quantity: '100g',
        price: 30,
        perServing: '100g',
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'biryani-masala',
        name: 'Biryani Masala',
        quantity: '30g',
        price: 40,
        perServing: '30g',
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'saffron-biryani',
        name: 'Saffron Strands',
        quantity: '0.5g',
        price: 100,
        perServing: '0.5g',
        image: 'https://images.unsplash.com/photo-1584104582789-c48d23cd4c12?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'ghee-biryani',
        name: 'Pure Ghee',
        quantity: '50g',
        price: 60,
        perServing: '50g',
        image: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&q=80&w=300'
      }
    ]
  },
  'noodles': {
    id: 'noodles',
    name: 'Schezwan Noodles',
    image: 'https://images.unsplash.com/photo-1634864572865-1c31d5929cda?auto=format&fit=crop&q=80&w=800',
    servings: 1,
    priceRange: { min: 150, max: 450 },
    ingredients: [
      {
        id: 'egg-noodles',
        name: 'Egg Noodles',
        quantity: '200g',
        price: 60,
        perServing: '200g',
        image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'schezwan-sauce',
        name: 'Schezwan Sauce',
        quantity: '50g',
        price: 40,
        perServing: '50g',
        image: 'https://images.unsplash.com/photo-1599909092372-f22c0d9b5156?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'mixed-veggies',
        name: 'Mixed Vegetables',
        quantity: '200g',
        price: 50,
        perServing: '200g',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'soy-sauce-noodles',
        name: 'Dark Soy Sauce',
        quantity: '30ml',
        price: 30,
        perServing: '30ml',
        image: 'https://images.unsplash.com/photo-1598457005530-83d4d86bc720?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'sesame-oil-noodles',
        name: 'Sesame Oil',
        quantity: '30ml',
        price: 40,
        perServing: '30ml',
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=300'
      }
    ]
  },
  'burger': {
    id: 'burger',
    name: 'Classic Cheese Burger',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
    servings: 1,
    priceRange: { min: 200, max: 500 },
    ingredients: [
      {
        id: 'beef-patty',
        name: 'Ground Beef Patty',
        quantity: '200g',
        price: 150,
        perServing: '200g',
        image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'burger-buns',
        name: 'Sesame Burger Buns',
        quantity: '2 pieces',
        price: 40,
        perServing: '2 pieces',
        image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'cheese-slice',
        name: 'Cheddar Cheese',
        quantity: '2 slices',
        price: 40,
        perServing: '2 slices',
        image: 'https://images.unsplash.com/photo-1566454825481-9c4cadf8c7dd?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'lettuce',
        name: 'Iceberg Lettuce',
        quantity: '50g',
        price: 20,
        perServing: '50g',
        image: 'https://images.unsplash.com/photo-1622205313162-be1d5712a43c?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'tomato-burger',
        name: 'Fresh Tomatoes',
        quantity: '2 slices',
        price: 15,
        perServing: '2 slices',
        image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&q=80&w=300'
      }
    ]
  },
  'haleem': {
    id: 'haleem',
    name: 'Hyderabadi Haleem',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=800',
    servings: 1,
    priceRange: { min: 200, max: 600 },
    ingredients: [
      {
        id: 'mutton',
        name: 'Mutton',
        quantity: '250g',
        price: 200,
        perServing: '250g',
        image: 'https://images.unsplash.com/photo-1608877907149-a206d75ba011?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'wheat',
        name: 'Broken Wheat',
        quantity: '100g',
        price: 30,
        perServing: '100g',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'lentils-mix',
        name: 'Mixed Lentils',
        quantity: '100g',
        price: 40,
        perServing: '100g',
        image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'ghee-haleem',
        name: 'Pure Ghee',
        quantity: '50g',
        price: 60,
        perServing: '50g',
        image: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'spices-haleem',
        name: 'Haleem Spice Mix',
        quantity: '30g',
        price: 50,
        perServing: '30g',
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=300'
      }
    ]
  },
  'roti': {
    id: 'roti',
    name: 'Butter Roti with Dal',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=800',
    servings: 1,
    priceRange: { min: 100, max: 300 },
    ingredients: [
      {
        id: 'wheat-flour',
        name: 'Whole Wheat Flour',
        quantity: '200g',
        price: 30,
        perServing: '200g',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'butter-roti',
        name: 'Butter',
        quantity: '30g',
        price: 25,
        perServing: '30g',
        image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'yellow-dal',
        name: 'Yellow Dal',
        quantity: '100g',
        price: 40,
        perServing: '100g',
        image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'tomatoes-dal',
        name: 'Tomatoes',
        quantity: '100g',
        price: 20,
        perServing: '100g',
        image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&q=80&w=300'
      },
      {
        id: 'onions-dal',
        name: 'Onions',
        quantity: '100g',
        price: 20,
        perServing: '100g',
        image: 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?auto=format&fit=crop&q=80&w=300'
      }
    ]
  }
};

export const useStore = create<StoreState>((set, get) => ({
  recipes: [],
  cart: [],
  recipeRequest: null,
  currentOrder: null,
  checkoutStep: 'cart',
  setRecipeRequest: (request) => set({ recipeRequest: request }),
  addToCart: (items) => set((state) => ({ cart: [...state.cart, ...items] })),
  removeFromCart: (itemId) => set((state) => ({
    cart: state.cart.filter((item) => item.id !== itemId)
  })),
  clearCart: () => set({ cart: [], checkoutStep: 'cart', currentOrder: null }),
  suggestRecipe: (request) => {
    set({ recipes: [] });
    
    const query = request.dishName.toLowerCase();
    let matchedRecipe = null;

    // Find exact matches first
    for (const [key, keywords] of Object.entries(recipeKeywords)) {
      if (keywords.includes(query)) {
        matchedRecipe = baseRecipes[key];
        break;
      }
    }

    // If no exact match, try partial matches
    if (!matchedRecipe) {
      for (const [key, keywords] of Object.entries(recipeKeywords)) {
        if (keywords.some(keyword => query.includes(keyword) || keyword.includes(query))) {
          matchedRecipe = baseRecipes[key];
          break;
        }
      }
    }

    if (!matchedRecipe) {
      return null;
    }

    const scaledRecipe = {
      ...matchedRecipe,
      servings: request.servings,
      ingredients: calculateIngredients(matchedRecipe.ingredients, request.servings),
      priceRange: {
        min: matchedRecipe.priceRange.min * request.servings,
        max: matchedRecipe.priceRange.max * request.servings
      }
    };

    set({ recipes: [scaledRecipe] });
    return scaledRecipe;
  },
  setCheckoutStep: (step) => set({ checkoutStep: step }),
  submitOrder: (address, paymentMethod) => {
    const { cart } = get();
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const order: Order = {
      id: Math.random().toString(36).substring(2, 15),
      items: cart,
      total,
      address,
      paymentMethod,
      status: 'confirmed',
      createdAt: new Date()
    };
    set({ currentOrder: order, checkoutStep: 'confirmation' });
  }
}));