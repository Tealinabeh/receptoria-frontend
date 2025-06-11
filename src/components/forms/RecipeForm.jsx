import React, { useState, useEffect } from 'react';
import { DynamicListInput } from './DynamicListInput';
import { RecipeStepsInput } from './RecipeStepsInput';

const DEFAULT_RECIPE_IMAGE_PREVIEW = "/sample_img.jpg";
const DIFFICULTY_LEVELS = [{ value: 1, label: "Легко" }, { value: 2, label: "Середньо" }, { value: 3, label: "Складно" }];
let nextId = 0;
const generateId = () => (nextId++).toString();

const getInitialState = (initialData) => ({
    title: initialData?.title || "",
    description: initialData?.description || "",
    mainImageFile: null,
    mainImagePreview: initialData?.imageUrl || DEFAULT_RECIPE_IMAGE_PREVIEW,
    ingredients: initialData?.ingredients?.map(text => ({ id: generateId(), text })) || [{ id: generateId(), text: "" }],
    steps: initialData?.steps?.map(step => ({ id: generateId(), description: step.description, imageFile: null, imagePreview: step.imageUrl || DEFAULT_RECIPE_IMAGE_PREVIEW })) || [{ id: generateId(), description: "", imageFile: null, imagePreview: DEFAULT_RECIPE_IMAGE_PREVIEW }],
    categories: initialData?.categories?.map(text => ({ id: generateId(), text })) || [{ id: generateId(), text: "" }],
    timeToCook: initialData?.timeToCook || "",
    difficulty: initialData?.difficulty || 1,
});


export function RecipeForm({ initialData, onSubmit, isLoading, serverError, successMessage, submitButtonText }) {
    const [formState, setFormState] = useState(getInitialState(initialData));
    const [formError, setFormError] = useState("");

    useEffect(() => {
        setFormState(getInitialState(initialData));
    }, [initialData]);

    const handleMainImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                setFormError("Головне зображення: оберіть файл зображення.");
                return;
            }
            setFormState(prev => ({ ...prev, mainImageFile: file }));
            const reader = new FileReader();
            reader.onloadend = () => setFormState(prev => ({ ...prev, mainImagePreview: reader.result }));
            reader.readAsDataURL(file);
            setFormError("");
        }
    };

    const setIngredients = (ingredients) => setFormState(prev => ({ ...prev, ingredients }));
    const setSteps = (steps) => setFormState(prev => ({ ...prev, steps }));
    const setCategories = (categories) => setFormState(prev => ({ ...prev, categories }));

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormState(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setFormError("");

        if (!formState.title.trim() || !formState.description.trim()) return setFormError("Назва та опис рецепту є обов'язковими.");
        if (formState.ingredients.some(ing => !ing.text.trim()) || formState.ingredients.length === 0) return setFormError("Додайте хоча б один інгредієнт і заповніть усі поля.");
        if (formState.steps.some(step => !step.description.trim()) || formState.steps.length === 0) return setFormError("Додайте хоча б один крок і заповніть усі описи.");

        const time = formState.timeToCook ? parseInt(formState.timeToCook, 10) : 0;
        if (isNaN(time) || time < 0) return setFormError("Час приготування має бути позитивним числом.");

        const submissionData = {
            title: formState.title.trim(),
            description: formState.description.trim(),
            image: formState.mainImageFile,
            timeToCook: time,
            difficulty: parseInt(formState.difficulty, 10),
            ingredients: formState.ingredients.map(ing => ing.text.trim()).filter(Boolean),
            categories: formState.categories.map(cat => cat.text.trim()).filter(Boolean),
            steps: formState.steps.map(step => ({ description: step.description.trim(), image: step.imageFile })),
        };

        onSubmit(submissionData);
    };

    const displayError = serverError || formError;

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 sm:p-10 rounded-xl shadow-xl">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Назва рецепту <span className="text-red-500">*</span></label>
                <input type="text" id="title" value={formState.title} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Короткий опис <span className="text-red-500">*</span></label>
                <textarea id="description" value={formState.description} onChange={handleChange} rows="3" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div className="flex flex-col items-center space-y-3">
                <label className="block text-sm font-medium text-gray-700 self-start">Головне зображення</label>
                <div className="w-full sm:w-2/3 md:w-1/2 h-64 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300">
                    <img src={formState.mainImagePreview} alt="Головне зображення" className="object-cover w-full h-full" />
                </div>
                <label htmlFor="mainImageInput" className="cursor-pointer px-5 py-2.5 bg-orange-100 text-orange-600 rounded-md hover:bg-orange-200 transition text-sm font-medium">
                    {formState.mainImageFile ? "Змінити зображення" : "Завантажити зображення"}
                </label>
                <input id="mainImageInput" type="file" accept="image/*" onChange={handleMainImageChange} className="hidden" />
            </div>

            <DynamicListInput label="Інгредієнти" items={formState.ingredients} setItems={setIngredients} placeholder="Інгредієнт" required />
            <RecipeStepsInput steps={formState.steps} setSteps={setSteps} setFormError={setFormError} />
            <DynamicListInput label="Категорії" items={formState.categories} setItems={setCategories} placeholder="Категорія" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="timeToCook" className="block text-sm font-medium text-gray-700 mb-1">Час приготування (хвилин)</label>
                    <input type="number" id="timeToCook" value={formState.timeToCook} onChange={handleChange} min="0" className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-500" />
                </div>
                <div>
                    <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">Складність</label>
                    <select id="difficulty" value={formState.difficulty} onChange={handleChange} className="w-full px-3 py-2.5 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-orange-500">
                        {DIFFICULTY_LEVELS.map(level => <option key={level.value} value={level.value}>{level.label}</option>)}
                    </select>
                </div>
            </div>

            {displayError && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md text-center">{displayError}</p>}

            {successMessage && !displayError && (
                <p className="text-sm text-green-600 bg-green-100 p-3 rounded-md text-center">
                    {successMessage}
                </p>
            )}

            <div className="pt-2">
                <button type="submit" disabled={isLoading || !!successMessage} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-lg font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 disabled:opacity-70">
                    {isLoading ? "Обробка..." : submitButtonText}
                </button>
            </div>
        </form>
    );
}