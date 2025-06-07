import React, { useState } from 'react';
import { CookingPot, Users, IndianRupee, Search } from 'lucide-react';
import { useStore } from '../store';

export const RecipeForm: React.FC = () => {
  const [dishName, setDishName] = useState('');
  const [servings, setServings] = useState<number>(2);
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const { suggestRecipe, setRecipeRequest } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const request = { dishName, servings, maxPrice };
    setRecipeRequest(request);
    suggestRecipe(request);
  };

  const handleServingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? 2 : Math.max(1, Math.min(10, parseInt(e.target.value) || 2));
    setServings(value);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? 500 : Math.max(100, parseInt(e.target.value) || 500);
    setMaxPrice(value);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-100 p-2 rounded-lg">
          <CookingPot size={24} className="text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Plan Your Dish</h2>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <Search size={18} />
              <span>What would you like to cook?</span>
            </div>
          </label>
          <input
            type="text"
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
            placeholder="Enter any dish name (e.g., Biryani, Pasta, Noodles)"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Users size={18} />
                <span>Number of People</span>
              </div>
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={servings}
              onChange={handleServingsChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <IndianRupee size={18} />
                <span>Maximum Budget (₹)</span>
              </div>
            </label>
            <input
              type="number"
              min="100"
              step="50"
              value={maxPrice}
              onChange={handleMaxPriceChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <Search size={20} />
          Get Recipe Suggestions
        </button>
      </div>
    </form>
  );
};