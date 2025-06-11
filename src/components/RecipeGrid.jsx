import { Link } from 'react-router-dom';
import { UserRecipePreviewCard } from './UserRecipePreviewCard';
import { Pagination } from './Pagination';
import { FilterControls } from './FilterControls';

export function RecipeGrid({
  title,
  recipes,
  sortConfig,
  onSortChange,
  isOwner,
  currentPage,
  totalPages,
  onPageChange,
  searchTerm,
  onSearchChange,
}) {
  return (
    <div className="mt-10">
      <div className="mb-4">
        <FilterControls
          title={title}
          sortConfig={sortConfig}
          onSortChange={onSortChange}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
        />
        {isOwner && title === "Мої рецепти" && (
          <div className="mt-4">
            <Link to="/builder" className="inline-block px-4 py-2 text-sm font-medium text-orange-600 bg-gray-100 border-2 border-dashed border-orange-400 rounded-lg hover:bg-orange-50 transition-colors">
              + Створити рецепт
            </Link>
          </div>
        )}
      </div>

      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {recipes.map(recipe => (
            <UserRecipePreviewCard key={recipe.id} {...recipe} searchTerm={searchTerm} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">Список порожній.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="py-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}