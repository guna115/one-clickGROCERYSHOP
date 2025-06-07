export interface Recipe {
  id: string;
  name: string;
  image: string;
  servings: number;
  priceRange: {
    min: number;
    max: number;
  };
  ingredients: Ingredient[];
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  price: number;
  perServing: string;
  image: string;
}

export interface CartItem extends Ingredient {
  recipeId: string;
}

export interface RecipeRequest {
  dishName: string;
  servings: number;
  maxPrice: number;
}

export interface Address {
  fullName: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  address: Address;
  paymentMethod: string;
  status: 'pending' | 'confirmed';
  createdAt: Date;
}