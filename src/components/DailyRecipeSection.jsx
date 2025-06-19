import { gql, useQuery } from "@apollo/client";
import { DailyRecipe } from "./DailyRecipe.jsx";
import { DailyRecipeSkeleton } from "./placeholders/DailyRecipeSkeleton.jsx";
import { useBreakpoint } from '../hooks/useBreakpoint.jsx';

const GET_RECIPE_OF_THE_DAY = gql`
  query GetDailyRecipe($imageWidth: Int!) {
    dailyRecipe {
      id
      title
      imageUrl(width: $imageWidth)
      timeToCook
      averageRating
      difficulty
    }
  }
`;

export function DailyRecipeSection({ onLoadComplete }) {
  const isDesktop = useBreakpoint(768); 
  const desiredImageWidth = isDesktop ? 1200 : 600;

  const { data, loading, error } = useQuery(GET_RECIPE_OF_THE_DAY, {
    variables: { imageWidth: desiredImageWidth },
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
      isLcp={true}
    />
  ) : (
    <p className="text-center text-gray-500 py-10">Рецепт дня не знайдено.</p>
  );
}