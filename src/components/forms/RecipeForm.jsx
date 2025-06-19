import React, { useState, useEffect } from 'react';
import { DynamicListInput } from './DynamicListInput';
import { RecipeStepsInput } from './RecipeStepsInput';
import { TimeInput } from './TimeInput';
import { minutesToTime, timeToMinutes } from '../../utils/timeUtils';
import { OptimizedPicture } from "../../utils/OptimizedPicture.jsx";

const DIFFICULTY_LEVELS = [{ value: 1, label: "Легко" }, { value: 2, label: "Середньо" }, { value: 3, label: "Складно" }];
let nextId = 0;
const generateId = () => (nextId++).toString();

const getInitialState = (initialData) => {
    const getInitialList = (items, isStep = false) => {
        if (items && items.length > 0) {
            if (isStep) {
                const sortedSteps = [...items].sort((a, b) => a.stepNumber - b.stepNumber);
                return sortedSteps.map(step => ({
                    id: generateId(),
                    description: step.description,
                    imageFile: null,
                    imagePreview: step.imageUrl || null,
                    existingImageUrl: step.imageUrl
                }));
            }
            return items.map(text => ({ id: generateId(), text }));
        }
        return isStep
            ? [{ id: generateId(), description: "", imageFile: null, imagePreview: null, existingImageUrl: null }]
            : [{ id: generateId(), text: "" }];
    };

    return {
        title: initialData?.title || "",
        description: initialData?.description || "",
        mainImageFile: null,
        mainImagePreview: initialData?.imageUrl || null,
        removeImage: false,
        ingredients: getInitialList(initialData?.ingredients),
        steps: getInitialList(initialData?.steps, true),
        categories: getInitialList(initialData?.categories),
        time: initialData ? minutesToTime(initialData.timeToCook) : { days: 0, hours: 0, minutes: 0 },
        difficulty: initialData?.difficulty || 1,
    };
};

export function RecipeForm({ initialData, onSubmit, isLoading, serverError, successMessage, submitButtonText }) {
    const [formState, setFormState] = useState(() => getInitialState(initialData));
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
            setFormState(prev => ({ ...prev, mainImageFile: file, mainImagePreview: URL.createObjectURL(file), removeImage: false }));
            setFormError("");
        }
    };

    const handleMainImageRemove = () => {
        setFormState(prev => ({ ...prev, mainImageFile: null, mainImagePreview: null, removeImage: true }));
    };

    const setIngredients = (ingredients) => setFormState(prev => ({ ...prev, ingredients }));
    const setSteps = (steps) => setFormState(prev => ({ ...prev, steps }));
    const setCategories = (categories) => setFormState(prev => ({ ...prev, categories }));

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormState(prev => ({ ...prev, [id]: value }));
    };

    const handleTimeChange = (newTime) => {
        setFormState(prev => ({ ...prev, time: newTime }));
    };

    const moveStep = (index, direction) => {
        const newSteps = [...formState.steps];
        const toIndex = index + direction;
        if (toIndex < 0 || toIndex >= newSteps.length) return;
        const element = newSteps.splice(index, 1)[0];
        newSteps.splice(toIndex, 0, element);
        setSteps(newSteps);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setFormError("");

        if (!formState.title.trim()) return setFormError("Назва рецепту є обов'язковими полем.");
        if (formState.ingredients.some(ing => !ing.text.trim()) || formState.ingredients.length === 0) return setFormError("Додайте хоча б один інгредієнт і заповніть усі поля.");
        if (formState.steps.some(step => !step.description.trim()) || formState.steps.length === 0) return setFormError("Додайте хоча б один крок і заповніть усі описи.");

        const totalMinutes = timeToMinutes(formState.time);
        if (totalMinutes <= 0) {
            return setFormError("Будь ласка, вкажіть час приготування.");
        }

        const submissionData = {
            title: formState.title.trim(),
            description: formState.description.trim(),
            timeToCook: totalMinutes,
            difficulty: parseInt(formState.difficulty, 10),
            ingredients: formState.ingredients.map(ing => ing.text.trim()).filter(Boolean),
            categories: formState.categories.map(cat => cat.text.trim()).filter(Boolean),
            steps: formState.steps.map((step, index) => {
                const stepInput = {
                    stepNumber: index + 1,
                    description: step.description.trim(),
                    removeImage: false
                };
                if (step.imageFile) {
                    stepInput.image = step.imageFile;
                } else if (!step.existingImageUrl) {
                    stepInput.removeImage = true;
                }
                return stepInput;
            }),
        };

        if (formState.mainImageFile) {
            submissionData.image = formState.mainImageFile;
        } else if (formState.removeImage) {
            submissionData.removeImage = true;
        }

        onSubmit(submissionData);
    };

    const displayError = serverError || formError;
    const hasMainImage = !!(formState.mainImageFile || formState.mainImagePreview);

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 sm:p-10 rounded-xl shadow-xl">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Назва рецепту <span className="text-red-500">*</span></label>
                <input type="text" id="title" value={formState.title} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Короткий опис</label>
                <textarea id="description" value={formState.description} onChange={handleChange} rows="3" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div className="flex flex-col items-center space-y-3">
                <label className="block text-sm font-medium text-gray-700 self-start">Головне зображення</label>
                <div className="w-full sm:w-2/3 md:w-1/2 h-64 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300">
                    {hasMainImage ? (
                        <OptimizedPicture src={formState.mainImagePreview} alt="Головне зображення" className="object-cover w-full h-full" />
                    ) : (
                        <p className="text-gray-400">Немає зображення</p>
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    <label htmlFor="mainImageInput" className="cursor-pointer px-5 py-2.5 bg-orange-100 text-orange-600 rounded-md hover:bg-orange-200 transition text-sm font-medium">
                        {hasMainImage ? "Змінити зображення" : "Завантажити зображення"}
                    </label>
                    <input id="mainImageInput" type="file" accept="image/*" onChange={handleMainImageChange} className="hidden" />
                    {hasMainImage && (
                        <button
                            type="button"
                            onClick={handleMainImageRemove}
                            className="px-5 py-2.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition text-sm font-medium"
                        >
                            Видалити
                        </button>
                    )}
                </div>
            </div>

            <DynamicListInput label="Інгредієнти" items={formState.ingredients} setItems={setIngredients} placeholder="Інгредієнт" required />
            <RecipeStepsInput steps={formState.steps} setSteps={setSteps} setFormError={setFormError} moveStep={moveStep} />
            <DynamicListInput label="Категорії" items={formState.categories} setItems={setCategories} placeholder="Категорія" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <TimeInput
                        label="Час приготування"
                        value={formState.time}
                        onChange={handleTimeChange}
                    />
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