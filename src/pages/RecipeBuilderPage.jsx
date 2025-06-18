import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { Header } from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { RecipeForm } from '../components/forms/RecipeForm';

const CREATE_RECIPE_MUTATION = gql`
  mutation CreateRecipe($input: CreateRecipeInput!) {
    createRecipe(input: $input) {
      id
    }
  }
`;

export default function RecipeBuilderPage() {
  const { state: authState } = useAuth();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');

  const [createRecipe, { loading, error }] = useMutation(CREATE_RECIPE_MUTATION, {
    onCompleted: (data) => {
      const newRecipeId = data.createRecipe?.id;
      if (newRecipeId) {
        setSuccessMessage('Рецепт успішно створено!');
        setTimeout(() => {
          navigate(`/recipe/${newRecipeId}`);
        }, 1000);
      }
    },
  });

  const handleSubmit = (formData) => {
    createRecipe({ variables: { input: formData } });
  };

  if (!authState.isAuthenticated) {
    return (
      <div className="bg-gray-100 min-h-screen pt-16 pb-7">
        <div className="max-w-6xl mx-auto px-6 pt-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Доступ обмежено</h1>
          <p className="text-lg">Для створення рецепту необхідно <Link to="/login" state={{ from: "/builder" }} className="text-orange-500 hover:underline">увійти</Link> в систему.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="translate-y-10">
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-center text-orange-600 mb-10">
            Створити новий рецепт
          </h1>
          <RecipeForm
            onSubmit={handleSubmit}
            isLoading={loading}
            serverError={error?.graphQLErrors[0]?.message}
            successMessage={successMessage}
            submitButtonText="Створити рецепт"
          />
        </div>
      </div>
    </div>
  );
}