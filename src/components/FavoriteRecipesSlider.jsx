import { RecipePreviewCard } from './RecipePreviewCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function FavoriteRecipesSlider({ recipes }) {

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-gray-700 mb-4">Збережені рецепти</h3>
      {recipes.length > 0 ? (
        <div className="relative">
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-orange-100">
            {recipes.map(recipe => (
              <div key={recipe.id} className="flex-shrink-0 w-80">
                <RecipePreviewCard {...recipe} img={recipe.image} />
              </div>
            ))}
          </div>
        </div>
      ) : (
         <div className="text-center py-10 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">Користувач ще нічого не зберіг.</p>
        </div>
      )}
    </div>
  );
}