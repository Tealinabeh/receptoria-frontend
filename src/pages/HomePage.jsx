import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { Header } from "../components/Header.jsx";
import { RecipePreviewCard } from "../components/RecipePreviewCard.jsx";
import { Navigation } from "../components/Navigation.jsx";
import { Pagination } from "../components/Pagination.jsx";
import { RecipePreviewCardSkeleton } from "../components/placeholders/RecipePreviewCardSkeleton.jsx";
import { FilterControls } from "../components/FilterControls.jsx";
import { DailyRecipeSection } from "../components/DailyRecipeSection.jsx";

const PAGE_SIZE = 21;

const GET_RECIPES = gql`
  query GetRecipes($skip: Int, $take: Int, $where: RecipeFilterInput, $order: [RecipeSortInput!]) {
    recipes(skip: $skip, take: $take, where: $where, order: $order) {
      items {
        id
        title
        difficulty
        imageUrl
        timeToCook
        categories
        averageRating
        created
        author {
          id
          userName
          avatarUrl
        }
      }
      totalCount
    }
  }
`;

const buildQueryFilter = (searchParams) => {
  const filterClauses = [];
  const searchTerm = searchParams.get('query')?.trim();

  searchParams.forEach((value, key) => {
    if (['page', 'query', 'sort', 'dir'].includes(key)) return;

    switch (key) {
      case "categories":
        filterClauses.push({ categories: { some: { eq: value } } });
        break;
      case "timeToCook":
        if (value === "quick") {
          filterClauses.push({ timeToCook: { lte: 60 } });
        }
        if (value === "simple-ingredients") {
          filterClauses.push({ ingredientCount: { lte: 5 } });
        }
        break;
      default:
        break;
    }
  });

  if (searchTerm) {
    filterClauses.push({
      or: [
        { title: { contains: searchTerm } },
        { author: { userName: { contains: searchTerm } } },
        { categories: { some: { contains: searchTerm } } },
      ],
    });
  }
  return filterClauses.length > 0 ? { and: filterClauses } : null;
};


export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const page = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    if(isNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isNavOpen]);

  const searchTerm = searchParams.get('query') || '';
  const sortConfig = {
    field: searchParams.get('sort') || 'created',
    direction: searchParams.get('dir') || 'DESC',
  };

  const queryFilter = useMemo(() => buildQueryFilter(searchParams), [searchParams]);

  const variables = {
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    order: [{ [sortConfig.field]: sortConfig.direction }],
  };

  if (queryFilter) {
    variables.where = queryFilter;
  }

  const { data, loading, error } = useQuery(GET_RECIPES, {
    variables: variables,
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (newSortConfig) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', newSortConfig.field);
    newParams.set('dir', newSortConfig.direction);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSearchChange = (newTerm) => {
    const newParams = new URLSearchParams(searchParams);
    if (newTerm) {
      newParams.set('query', newTerm);
    } else {
      newParams.delete('query');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  if (error) {
    return (
      <div>
        <Header />
        <div className="px-4 pt-20 flex justify-center items-center min-h-[calc(100vh-80px)]">
            <p className="text-red-500 text-xl">
            Помилка завантаження даних: {error?.message}
            </p>
        </div>
      </div>
    );
  }

  const isLoading = loading && !data;
  const recipesToDisplay = data?.recipes?.items || [];
  const totalRecipes = data?.recipes?.totalCount || 0;
  const totalPages = Math.ceil(totalRecipes / PAGE_SIZE);

  return (
    <div>
      <Header />
      {isNavOpen && (
          <div
              onClick={() => setIsNavOpen(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              aria-hidden="true"
          />
      )}

      <div className="px-4 pt-20 flex flex-col md:flex-row">
        <main className="px-2 md:px-4 pt-4 w-full md:w-3/4">
          <DailyRecipeSection />

          <div className="mt-8">
            <FilterControls
              title="Всі рецепти"
              sortConfig={sortConfig}
              onSortChange={handleSortChange}
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
            />
          </div>

          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-9 items-start">
            {isLoading ? (
              [...Array(9)].map((_, index) => <RecipePreviewCardSkeleton key={index} />)
            ) : recipesToDisplay.length > 0 ? (
              recipesToDisplay.map((recipe) => (
                <RecipePreviewCard
                  key={recipe.id}
                  id={recipe.id}
                  title={recipe.title}
                  searchTerm={searchTerm}
                  img={recipe.imageUrl || "fallback-preview.jpeg"}
                  time={recipe.timeToCook}
                  difficulty={recipe.difficulty}
                  tags={recipe.categories || []}
                  rating={recipe.averageRating}
                  userpicture={recipe.author?.avatarUrl || "/User.png"}
                  username={recipe.author?.userName || "Користувач"}
                  userId={recipe.author?.id}
                  created={recipe.created}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 py-10">
                Рецепти за вашим запитом не знайдено.
              </p>
            )}
          </div>

          {recipesToDisplay.length > 0 && totalPages > 1 && (
            <div className="py-8 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </main>
        <aside className={`
          fixed top-12 right-0 h-screen w-72 bg-white z-40 shadow-lg 
          transform transition-transform duration-300 ease-in-out 
          ${isNavOpen ? 'translate-x-0' : 'translate-x-full'}       
          md:relative md:top-auto md:pt-4 md:right-auto md:h-auto md:w-1/4 md:translate-x-0 
          md:bg-transparent md:shadow-none md:z-auto
        `}>
          <Navigation onCloseClick={() => setIsNavOpen(false)} />
        </aside>
      </div>
      <button
        onClick={() => setIsNavOpen(!isNavOpen)}
        className={`
          md:hidden fixed top-24 right-0 p-2 bg-orange-500 text-white rounded-l-full shadow-lg z-50 
          transform transition-transform duration-300 ease-in-out
          ${isNavOpen ? '-translate-x-72' : 'translate-x-0'}
        `}
        aria-label="Toggle navigation"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform duration-300 ${isNavOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </div>
  );
}
