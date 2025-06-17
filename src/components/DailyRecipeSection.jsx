import { gql, useQuery } from "@apollo/client";
import { DailyRecipe } from "./DailyRecipe.jsx";
import { DailyRecipeSkeleton } from "./placeholders/DailyRecipeSkeleton.jsx";

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

export function DailyRecipeSection({ onLoadComplete }) {
  const { data, loading, error } = useQuery(GET_RECIPE_OF_THE_DAY, {
    fetchPolicy: "cache-and-network",
    onCompleted: onLoadComplete,
    onError: onLoadComplete,
  });

  if (loading) {
    return <DailyRecipeSkeleton />;
  }

  if (error) {
    console.error(error);
    return null;
  }

  const recipeOfTheDay = data?.dailyRecipe;

  return recipeOfTheDay ? (
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
  );
}