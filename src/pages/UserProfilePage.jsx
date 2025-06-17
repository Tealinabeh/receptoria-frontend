import { useParams, useSearchParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { UserInfo } from '../components/UserInfo';
import { RecipeGrid } from '../components/RecipeGrid';
import { ErrorDisplay } from '../components/ErrorDisplay';

const CREATED_PAGE_SIZE = 9;
const FAVORITE_PAGE_SIZE = 20;

const GET_USER_PROFILE = gql`
  query GetUserProfile($userId: String!) {
    userById(id: $userId) {
      id
      userName
      avatarUrl
      bio
      recipeCount
      registrationDate
    }
  }
`;

const GET_FAVORITE_RECIPES = gql`
  query GetMyFavorites($where: RecipeFilterInput, $order: [RecipeSortInput!], $skip: Int, $take: Int) {
      myFavorites(where: $where, order: $order, skip: $skip, take: $take) {
          items { 
            id, 
            title, 
            imageUrl, 
            averageRating, 
            difficulty, 
            timeToCook, 
            created, 
            author { 
              id, 
              userName, 
              avatarUrl
            } 
          }
        totalCount
    }
  }
`;


const GET_USER_CREATED_RECIPES = gql`
  query GetUserCreatedRecipes($where: RecipeFilterInput, $order: [RecipeSortInput!], $skip: Int, $take: Int) {
    recipes(where: $where, order: $order, skip: $skip, take: $take) {
      items { 
        id, 
        title, 
        imageUrl, 
        averageRating, 
        difficulty, 
        timeToCook, 
        created, 
        author { 
          id, 
          userName, 
          avatarUrl
        } 
      }
      totalCount
    }
  }
`;

export default function UserProfilePage() {
  const { userId } = useParams();
  const { state: authState } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const createdPage = parseInt(searchParams.get('my_page') || '1', 10);
  const favoritesPage = parseInt(searchParams.get('fav_page') || '1', 10);
  const createdSortField = searchParams.get('my_sort') || 'created';
  const createdSortDir = searchParams.get('my_dir') || 'DESC';
  const favoritesSortField = searchParams.get('fav_sort') || 'created';
  const favoritesSortDir = searchParams.get('fav_dir') || 'DESC';
  const favoritesSearchTerm = searchParams.get('fav_q') || '';

  const createdSortConfig = { field: createdSortField, direction: createdSortDir };
  const favoritesSortConfig = { field: favoritesSortField, direction: favoritesSortDir };

  const handleCreatedPageChange = (newPage) => { setSearchParams(prev => { prev.set('my_page', newPage.toString()); return prev; }); };
  const handleFavoritesPageChange = (newPage) => { setSearchParams(prev => { prev.set('fav_page', newPage.toString()); return prev; }); };

  const handleCreatedSortChange = (newSortConfig) => {
    setSearchParams(prev => {
      prev.set('my_sort', newSortConfig.field);
      prev.set('my_dir', newSortConfig.direction);
      return prev;
    });
  };

  const handleFavoritesSortChange = (newSortConfig) => {
    setSearchParams(prev => {
      prev.set('fav_sort', newSortConfig.field);
      prev.set('fav_dir', newSortConfig.direction);
      return prev;
    });
  };

  const handleFavoritesSearchChange = (newTerm) => {
    setSearchParams(prev => {
      prev.set('fav_q', newTerm);
      prev.set('fav_page', '1');
      return prev;
    });
  };

  const isOwner = authState.isAuthenticated && authState.user?.id === userId;

  const { data: profileData, loading: profileLoading, error: profileError } = useQuery(GET_USER_PROFILE, { variables: { userId }, skip: !userId, fetchPolicy: "cache-and-network" });

  const { data: createdRecipesData, loading: createdLoading } = useQuery(GET_USER_CREATED_RECIPES, {
    variables: {
      where: { authorId: { eq: userId } },
      order: { [createdSortConfig.field]: createdSortConfig.direction },
      skip: (createdPage - 1) * CREATED_PAGE_SIZE,
      take: CREATED_PAGE_SIZE,
    },
    skip: !userId,
    fetchPolicy: "cache-and-network",
  });

  const favoritesWhereClause = { title: { contains: favoritesSearchTerm } };

  const { data: favoriteRecipesData, loading: favoritesLoading } = useQuery(GET_FAVORITE_RECIPES, {
    variables: {
      where: favoritesSearchTerm ? favoritesWhereClause : null,
      order: { [favoritesSortConfig.field]: favoritesSortConfig.direction },
      skip: (favoritesPage - 1) * FAVORITE_PAGE_SIZE,
      take: FAVORITE_PAGE_SIZE,
    },
    skip: !isOwner,
    fetchPolicy: "cache-and-network",
  });

  const isLoading = profileLoading || createdLoading || (isOwner && favoritesLoading);

  if (isLoading) return <div><Header /><p className="text-center py-10">Завантаження профілю...</p></div>;
  if (profileError) return <div><Header /><p className="text-center py-10 text-red-500">Помилка: {profileError.message}</p></div>;

  const user = profileData?.userById;
  if (profileError || !user ) return (
          <div>
              <Header />
              <ErrorDisplay
                  message={profileError?.message || "Користувача не знайдено."}
                  onRetry={() => window.location.reload()}
              />
          </div>
      );

  const mapRecipeData = r => ({ ...r, img: r.imageUrl, userpicture: r.author.avatarUrl, username: r.author.userName, userId: r.author.id });

  const createdRecipes = createdRecipesData?.recipes.items.map(mapRecipeData) || [];
  const createdTotalPages = Math.ceil((createdRecipesData?.recipes.totalCount || 0) / CREATED_PAGE_SIZE);

  const favoriteRecipes = favoriteRecipesData?.myFavorites.items.map(mapRecipeData) || [];
  const favoriteTotalPages = Math.ceil((favoriteRecipesData?.myFavorites.totalCount || 0) / FAVORITE_PAGE_SIZE);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto py-24 px-4">
        <UserInfo key={user.id} user={user} isOwner={isOwner} />
        {isOwner && (
          <RecipeGrid
            title="Збережені рецепти"
            recipes={favoriteRecipes}
            sortConfig={favoritesSortConfig}
            onSortChange={handleFavoritesSortChange}
            searchTerm={favoritesSearchTerm}
            onSearchChange={handleFavoritesSearchChange}
            currentPage={favoritesPage}
            totalPages={favoriteTotalPages}
            onPageChange={handleFavoritesPageChange}
          />
        )}

        <RecipeGrid
          title="Мої рецепти"
          recipes={createdRecipes}
          sortConfig={createdSortConfig}
          onSortChange={handleCreatedSortChange}
          isOwner={isOwner}
          currentPage={createdPage}
          totalPages={createdTotalPages}
          onPageChange={handleCreatedPageChange}
        />
      </main>
    </div>
  );
}