import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { Header } from "../components/Header.jsx";
import { DailyRecipe } from "../components/DailyRecipe.jsx";
import { RecipePreviewCard } from "../components/RecipePreviewCard.jsx";
import { Navigation } from "../components/Navigation.jsx";
import { Pagination } from "../components/Pagination.jsx";
import { DailyRecipeSkeleton } from "../components/placeholders/DailyRecipeSkeleton.jsx";
import { RecipePreviewCardSkeleton } from "../components/placeholders/RecipePreviewCardSkeleton.jsx";
import { FilterControls } from "../components/FilterControls.jsx";

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
        created # Added created field
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

const GET_RECIPE_OF_THE_DAY = gql`
  query GetDailyRecipe {
    dailyRecipe {
      id
      title
      imageUrl
      timeToCook
      averageRating
      difficulty
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
  const page = parseInt(searchParams.get('page') || '1', 10);

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

  const { data: dailyData, loading: dailyLoading, error: dailyError } = useQuery(GET_RECIPE_OF_THE_DAY, {
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

  if (error || dailyError) {
    return (
      <div>
        <Header />
        <div className="px-4 pt-20 flex justify-center items-center min-h-[calc(100vh-80px)]">
          <p className="text-red-500 text-xl">
            Помилка завантаження даних: {error?.message || dailyError?.message}
          </p>
        </div>
      </div>
    );
  }

  const isLoading = (loading && !data) || (dailyLoading && !dailyData);
  const recipeOfTheDay = dailyData?.dailyRecipe;
  const recipesToDisplay = data?.recipes?.items || [];
  const totalRecipes = data?.recipes?.totalCount || 0;
  const totalPages = Math.ceil(totalRecipes / PAGE_SIZE);

  return (
    <div>
      <Header />
      <div className="px-4 pt-20 flex">
        <div className="px-4 pt-4 w-3/4">
          {isLoading ? (
            <DailyRecipeSkeleton />
          ) : recipeOfTheDay ? (
            <DailyRecipe
              title={recipeOfTheDay.title}
              image={recipeOfTheDay.imageUrl || "fallback-preview.jpeg"}
              time={recipeOfTheDay.timeToCook}
              rating={recipeOfTheDay.averageRating}
              difficulty={recipeOfTheDay.difficulty}
              href={`/recipe/${recipeOfTheDay.id}`}
            />
          ) : (
            <p className="text-center text-gray-500 py-10">Рецепт дня не знайдено.</p>
          )}

          <div className="mt-8">
            <FilterControls
              title="Всі рецепти"
              sortConfig={sortConfig}
              onSortChange={handleSortChange}
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
            />
          </div>

          <div className="pl-10 pt-6 grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-9 items-start">
            {isLoading ? (
              [...Array(6)].map((_, index) => <RecipePreviewCardSkeleton key={index} />)
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
                  created={recipe.created} // Pass the created prop
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
        </div>
        <div className="w-1/4 pl-4 pt-4 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto">
          <Navigation />
        </div>
      </div>
    </div>
  );
}