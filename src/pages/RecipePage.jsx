import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useAuth } from '../context/AuthContext';
import { Header } from "../components/Header";
import { UserLink } from "../components/UserLink";
import { RecipeStep } from "../components/RecipeStep";
import { DifficultyBadge } from '../components/DifficultyBadge';
import { StarRating } from '../components/StarRating';
import { Plus, X } from 'lucide-react';
import { MarqueeTitle } from '../components/MarqueeTitle';
import { formatTime } from '../utils/formatTime';
import { RecipePageSkeleton } from '../components/placeholders/RecipePageSkeleton';
import { ErrorDisplay } from '../components/ErrorDisplay';

const GET_RECIPE_BY_ID = gql`
  query GetRecipeById($id: UUID!) {
    recipeById(id: $id) {
      id
      title
      description
      imageUrl
      ingredients
      steps {
        description
        imageUrl
        stepNumber
      }
      timeToCook
      averageRating
      difficulty
      created
      categories
      author {
        id
        userName
        avatarUrl
      }
    }
  }
`;

const RATE_RECIPE_MUTATION = gql`
    mutation RateRecipe($recipeId: UUID!, $score: Int!) {
        rateRecipe(recipeId: $recipeId, score: $score) {
            id
            averageRating
        }
    }
`;

const REMOVE_RATING_MUTATION = gql`
    mutation RemoveRating($recipeId: UUID!) {
        removeRating(recipeId: $recipeId) {
            id
            averageRating
        }
    }
`;

const ADD_FAVORITE_MUTATION = gql`
    mutation AddFavorite($recipeId: UUID!) {
        addFavoriteRecipe(recipeId: $recipeId) {
            id
            favoriteRecipes
        }
    }
`;


const REMOVE_FAVORITE_MUTATION = gql`
    mutation RemoveFavorite($recipeId: UUID!) {
        removeFavoriteRecipe(recipeId: $recipeId) {
            id
            favoriteRecipes
        }
    }
`;

const GET_MY_RATING = gql`
    query GetMyRating($recipeId: UUID!) {
        myRatingForRecipe(recipeId: $recipeId) {
            score
        }
    }
`;


export default function RecipePage() {
    const { id } = useParams();
    const { state: authState, login } = useAuth();
    const navigate = useNavigate();

    const [ratingError, setRatingError] = useState('');
    const [initialUserRating, setInitialUserRating] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);

    const { loading, error, data } = useQuery(GET_RECIPE_BY_ID, { variables: { id }, skip: !id, fetchPolicy: "cache-and-network" });
    const { loading: myRatingLoading } = useQuery(GET_MY_RATING, { variables: { recipeId: id }, skip: !authState.isAuthenticated || !id, fetchPolicy: "cache-and-network", onCompleted: (d) => setInitialUserRating(d.myRatingForRecipe?.score || 0) });
    const [removeRating, { loading: removeRatingLoading }] = useMutation(REMOVE_RATING_MUTATION, {
        onCompleted: () => {
            setInitialUserRating(0);
            setRatingError('');
        },
        onError: (e) => setRatingError(e.graphQLErrors[0]?.message || 'Помилка')
    });
    const [rateRecipe, { loading: ratingLoading }] = useMutation(RATE_RECIPE_MUTATION, {
        refetchQueries: [{ query: GET_RECIPE_BY_ID, variables: { id } }]
    });


    const updateFavoritesInContext = (updatedUser) => {
        const newUserData = { ...authState.user, favoriteRecipes: updatedUser.favoriteRecipes };
        login(newUserData, authState.token);
    };

    const [addFavorite] = useMutation(ADD_FAVORITE_MUTATION, { onCompleted: (d) => updateFavoritesInContext(d.addFavoriteRecipe) });
    const [removeFavorite] = useMutation(REMOVE_FAVORITE_MUTATION, { onCompleted: (d) => updateFavoritesInContext(d.removeFavoriteRecipe) });

    const recipe = data?.recipeById;

    useEffect(() => {
        if (authState.user && recipe) {
            setIsFavorite(authState.user.favoriteRecipes?.includes(recipe.id));
        }
    }, [authState.user, recipe]);

    const handleRatingSubmit = async (score) => {
        if (!authState.isAuthenticated) {
            setRatingError('Потрібно увійти в систему.');
            return;
        }
        setRatingError('');

        try {
            await rateRecipe({ variables: { recipeId: id, score } });
            setInitialUserRating(score);

        } catch (err) {
            setRatingError(err.graphQLErrors[0]?.message || 'Помилка оцінки');
        }
    };


    const handleRemoveRating = () => {
        removeRating({ variables: { recipeId: id } });
    };

    const handleToggleFavorite = () => {
        if (!authState.isAuthenticated) { navigate('/login'); return; }
        const action = isFavorite ? removeFavorite : addFavorite;
        action({ variables: { recipeId: id } });
    };

    if (loading) return (
        <>
            <Header />
            <RecipePageSkeleton />
        </>
    );

    if (error || !id || !recipe) return (
        <div>
            <Header />
            <ErrorDisplay
                message={error?.message || "Рецепт не знайдено."}
                onRetry={() => window.location.reload()}
            />
        </div>
    );
    const isOwner = authState.isAuthenticated && authState.user?.id === recipe.author?.id;
    const sortedSteps = recipe.steps?.slice().sort((a, b) => a.stepNumber - b.stepNumber);

    return (
        <div className="bg-gray-100 min-h-screen pt-20 pb-10">
            <Header />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex-grow group">
                        <MarqueeTitle text={recipe.title || "Назва страви"} />
                    </div>
                    {isOwner && (<Link to={`/recipe/${recipe.id}/edit`} className="ml-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex-shrink-0">Редагувати</Link>)}
                </div>
                <article className="flex flex-col md:flex-row justify-around items-center text-center bg-white p-6 rounded-lg shadow-sm mb-8 gap-6 md:gap-4">
                    <div className="flex flex-col items-center justify-center order-1 md:order-2">
                        <h2 className="text-lg font-semibold text-gray-500 mb-1">
                            {isOwner ? 'Оцінка' : 'Ваша оцінка'}
                        </h2>
                        {!isOwner && (
                            <>
                                {!myRatingLoading && (<StarRating key={initialUserRating} initialRating={initialUserRating} onRatingSubmit={handleRatingSubmit} />)}
                                {(ratingLoading || removeRatingLoading) && <p className="text-sm text-gray-500 mt-1">Збереження...</p>}
                                {ratingError && <p className="text-sm text-red-500 mt-1">{ratingError}</p>}
                                {initialUserRating > 0 && !ratingError && (
                                    <button onClick={handleRemoveRating} className="text-xs text-gray-400 hover:text-red-500 mt-1">Скасувати оцінку</button>
                                )}
                            </>
                        )}
                        <p className="text-sm text-gray-400 mt-2">Середня: {parseFloat(recipe.averageRating).toFixed(1)}</p>
                    </div>
                    <div className="flex flex-row justify-around w-full items-center order-2 md:contents">
                        <div className="md:order-1">
                            <h2 className="text-lg font-semibold text-gray-500">Час приготування</h2>
                            <p className="text-xl font-bold text-gray-700">{formatTime(recipe.timeToCook)}</p>
                        </div>
                        <div className="md:order-3">
                            <h2 className="text-lg font-semibold text-gray-500">Складність</h2>
                            <div className="flex justify-center mt-1"><DifficultyBadge difficulty={recipe.difficulty} /></div>
                        </div>
                    </div>

                </article>

                <article className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-0 mb-8 rounded-lg shadow-lg overflow-hidden">
                    <div className="relative w-full aspect-w-1 aspect-h-1">
                        <img src={recipe.imageUrl || "/fallback-preview.jpeg"} alt={recipe.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-white p-6 flex flex-col">
                        <h2 className="text-2xl text-center font-semibold text-orange-400 mb-4 border-b pb-2">Опис страви</h2>
                        <p className="text-gray-600 leading-relaxed flex-grow">
                            {recipe.description || "Опис не додано."}
                        </p>
                        <div className="mt-auto pt-4 border-t">
                            <h3 className="text-lg font-semibold text-orange-400 mb-3 text-center">Теги</h3>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {recipe.categories?.length > 0 ? (
                                    recipe.categories.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full"
                                        >
                                            #{tag}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">Теги не вказані.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </article>
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <div className="flex items-center space-x-4 text-gray-600 order-1 md:order-2">
                        <p className="font-medium">Дата створення:</p>
                        <p>{new Date(recipe.created).toLocaleDateString('uk-UA')}</p>
                    </div>
                    <div className="flex items-center justify-between w-full md:w-auto md:justify-start md:gap-4 order-2 md:order-1">
                        <button onClick={handleToggleFavorite} className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-medium transition-colors ${isFavorite ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>
                            {isFavorite ? <X size={18} /> : <Plus size={18} />}
                            <span>Зберегти</span>
                        </button>
                        <div className="md:hidden">
                            <UserLink picture={recipe.author?.avatarUrl || "/User.png"} username={recipe.author?.userName} link={`/user/${recipe.author?.id}`} />
                        </div>
                    </div>
                    <div className="hidden md:flex md:order-3">
                        <UserLink picture={recipe.author?.avatarUrl || "/User.png"} username={recipe.author?.userName} link={`/user/${recipe.author?.id}`} />
                    </div>
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
                    <aside className="lg:sticky top-24 self-start">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl text-center font-semibold text-gray-700 mb-4 border-b pb-2">Інгредієнти</h2>
                            <ul className="list-disc list-inside space-y-2 text-gray-600">
                                {recipe.ingredients?.length > 0 ? (recipe.ingredients.map((ing, i) => (<li key={i}>{ing}</li>))) : (<li>Інгредієнти не вказані.</li>)}
                            </ul>
                        </div>
                    </aside>
                    <article className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl text-center font-semibold text-gray-700 mb-4 border-b pb-2">Кроки приготування</h2>
                        <div className="space-y-6">
                            {sortedSteps?.length > 0 ? (sortedSteps.map((step) => (<RecipeStep key={step.stepNumber} number={step.stepNumber} image={step.imageUrl || null} description={step.description} />))) : (<li>Кроки не вказані.</li>)}
                        </div>
                    </article>
                </div>
            </div>
        </div>
    );
}