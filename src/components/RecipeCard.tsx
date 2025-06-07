import React from 'react';
import { ShoppingCart, Plus, Clock, Users, IndianRupee } from 'lucide-react';
import { Recipe } from '../types';
import { useStore } from '../store';

interface Props {
  recipe: Recipe;
}

export const RecipeCard: React.FC<Props> = ({ recipe }) => {
  const addToCart = useStore((state) => state.addToCart);
  const recipeRequest = useStore((state) => state.recipeRequest);

  const handleAddToCart = () => {
    const cartItems = recipe.ingredients.map(ingredient => ({
      ...ingredient,
      recipeId: recipe.id
    }));
    addToCart(cartItems);
  };

  const totalPrice = recipe.ingredients.reduce((sum, item) => sum + item.price, 0);
  const isOverBudget = recipeRequest && totalPrice > recipeRequest.maxPrice;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="relative">
        <img 
          src={recipe.image} 
          alt={recipe.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">{recipe.name}</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Users size={16} />
                <span>Serves {recipe.servings}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>30-45 mins</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {isOverBudget && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            <p className="text-sm">
              Total cost exceeds your budget by ₹{(totalPrice - recipeRequest.maxPrice).toFixed(2)}
            </p>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold mb-4">Ingredients Required:</h4>
            <div className="grid gap-4">
              {recipe.ingredients.map((ingredient) => (
                <div 
                  key={ingredient.id} 
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <img
                    src={ingredient.image}
                    alt={ingredient.name}
                    className="w-20 h-20 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1495195134817-aeb325a55b65?auto=format&fit=crop&q=80&w=300';
                    }}
                  />
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{ingredient.name}</h5>
                    <p className="text-sm text-gray-600">{ingredient.quantity}</p>
                    <div className="flex items-center gap-1 text-blue-600 font-medium mt-1">
                      <IndianRupee size={16} />
                      <span>{ingredient.price}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart([{ ...ingredient, recipeId: recipe.id }])}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Add to cart"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium">Total Cost:</span>
              <div className="flex items-center gap-1 text-xl font-semibold text-blue-600">
                <IndianRupee size={20} />
                <span>{totalPrice}</span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} />
              Add All Ingredients to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;