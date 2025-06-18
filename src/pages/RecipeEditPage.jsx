import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { RecipeForm } from '../components/forms/RecipeForm';
import { DeleteConfirmationModal } from '../components/modals/DeleteConfirmationModal';

const GET_RECIPE_FOR_EDIT = gql`
  query GetRecipeForEdit($id: UUID!) {
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
      difficulty
      categories
      author {
        id
      }
    }
  }
`;

const UPDATE_RECIPE_MUTATION = gql`
  mutation UpdateRecipe($input: UpdateRecipeInput!) {
    updateRecipe(input: $input) {
      id
    }
  }
`;

const DELETE_RECIPE_MUTATION = gql`
  mutation DeleteRecipe($recipeId: UUID!) {
    deleteRecipe(recipeId: $recipeId) {
      success
      message
    }
  }
`;

export default function RecipeEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { state: authState } = useAuth();
    const [successMessage, setSuccessMessage] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const { data, loading: queryLoading, error: queryError } = useQuery(GET_RECIPE_FOR_EDIT, {
        variables: { id },
        fetchPolicy: 'network-only'
    });

    const [updateRecipe, { loading: mutationLoading, error: mutationError }] = useMutation(UPDATE_RECIPE_MUTATION, {
        onCompleted: (data) => {
            setSuccessMessage('Рецепт успішно оновлено!');
            setTimeout(() => {
                navigate(`/recipe/${data.updateRecipe.id}`);
            }, 1000);
        }
    });

    const [deleteRecipe, { loading: deleteLoading }] = useMutation(DELETE_RECIPE_MUTATION, {
        onCompleted: () => {
            navigate(`/user/${authState.user.id}`);
        },
        onError: (err) => {
            alert(`Помилка видалення: ${err.message}`);
            setIsDeleteModalOpen(false);
        }
    });

    const handleSubmit = (formData) => {
        const input = { recipeId: id, ...formData };
        updateRecipe({ variables: { input } });
    };


    const handleDeleteConfirm = () => {
        deleteRecipe({ variables: { recipeId: id } });
    };

    if (queryLoading) return <div><p className="text-center py-20">Завантаження рецепту...</p></div>;
    if (queryError) return <div><p className="text-center py-20 text-red-500">Помилка: {queryError.message}</p></div>;

    const recipe = data?.recipeById;
    if (!recipe) return <div><p className="text-center py-20">Рецепт не знайдено.</p></div>;

    if (!authState.isAuthenticated || authState.user?.id !== recipe.author.id) {
        return (
            <div>
                <div className="max-w-6xl mx-auto px-6 pt-20 text-center">
                    <h1 className="text-2xl font-bold mb-4">Доступ заборонено</h1>
                    <p>У вас немає прав на редагування цього рецепту.</p>
                    <Link to="/" className="text-orange-500 hover:underline mt-4 inline-block">На головну</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50">
            <Header />
            <div className="translate-y-10">
                <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-10">
                        <h1 className="text-3xl font-bold text-orange-600">
                            Редагування рецепту
                        </h1>
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="px-4 py-2 bg-red-100 text-red-700 border-2 border-dashed border-red-300 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm"
                        >
                            Видалити рецепт
                        </button>
                    </div>

                    <RecipeForm
                        initialData={recipe}
                        onSubmit={handleSubmit}
                        isLoading={mutationLoading}
                        serverError={mutationError?.graphQLErrors[0]?.message}
                        successMessage={successMessage}
                        submitButtonText="Зберегти зміни"
                    />
                </div>
            </div>

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                isLoading={deleteLoading}
            />
        </div>
    );
}