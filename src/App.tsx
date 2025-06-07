import React from 'react';
import { ShoppingBasket, ChefHat } from 'lucide-react';
import { RecipeForm } from './components/RecipeForm';
import { RecipeCard } from './components/RecipeCard';
import { Cart } from './components/Cart';
import { useStore } from './store';

function App() {
  const recipes = useStore((state) => state.recipes);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <ChefHat size={24} />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
                AI Recipe Shopper
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <ShoppingBasket className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <RecipeForm />
            {recipes.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Recipe Suggestion</h2>
                <div className="grid gap-8">
                  {recipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-1 lg:sticky lg:top-24 lg:h-fit">
            <Cart />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;