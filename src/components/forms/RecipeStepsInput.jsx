const DEFAULT_IMAGE_PREVIEW = "/sample_img.jpg";
let nextId = 0;
const generateId = () => (nextId++).toString();

export function RecipeStepsInput({ steps, setSteps, setFormError }) {

    const handleDescriptionChange = (id, description) => {
        setSteps(steps.map((step) => (step.id === id ? { ...step, description } : step)));
    };

    const handleImageChange = (id, event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                setFormError(`Зображення для кроку: оберіть файл зображення.`);
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setSteps(steps.map((step) => step.id === id ? { ...step, imageFile: file, imagePreview: reader.result } : step));
            };
            reader.readAsDataURL(file);
            setFormError("");
        }
    };
    const handleImageRemove = (id) => {
        setSteps(steps.map((step) => step.id === id ? { ...step, imageFile: null, imagePreview: DEFAULT_IMAGE_PREVIEW, existingImageUrl: null } : step));
    };


    const addStep = () => {
        setSteps([...steps, { id: generateId(), description: "", imageFile: null, imagePreview: DEFAULT_IMAGE_PREVIEW }]);
    };

    const removeStep = (id) => {
        if (steps.length > 1) {
            setSteps(steps.filter((step) => step.id !== id));
        }
    };

    return (
        <fieldset className="border border-gray-300 p-4 rounded-md">
            <legend className="text-lg font-medium text-gray-700 px-2">Кроки приготування <span className="text-red-500">*</span></legend>
            {steps.map((step, index) => (
                <div key={step.id} className="mb-6 p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <h4 className="text-md font-semibold text-gray-600 mb-2">Крок {index + 1}</h4>
                    <textarea
                        value={step.description}
                        onChange={(e) => handleDescriptionChange(step.id, e.target.value)}
                        placeholder={`Опис кроку ${index + 1}`}
                        rows="3"
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-500 mb-2"
                    />
                    <div className="flex flex-col items-center space-y-2 mt-2">
                        <div className="w-full sm:w-2/3 md:w-1/2 h-48 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center border border-gray-300">
                            <img
                                src={step.imagePreview}
                                alt={`Крок ${index + 1}`}
                                className="object-contain w-full h-full"
                            />
                        </div>
                        <label
                            htmlFor={`stepImageInput-${step.id}`}
                            className="cursor-pointer px-4 py-2 bg-orange-100 text-orange-600 rounded-md hover:bg-orange-200 transition text-xs font-medium"
                        >
                            {step.imageFile ? "Змінити фото кроку" : "Завантажити фото кроку"}
                        </label>
                        <input
                            id={`stepImageInput-${step.id}`}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(step.id, e)}
                            className="hidden"
                        />
                        {(step.imageFile || step.existingImageUrl) && (
                            <button
                                type="button"
                                onClick={() => handleImageRemove(step.id)}
                                className="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition text-xs font-medium"
                            >
                                Видалити фото
                            </button>
                        )}
                    </div>
                    {steps.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeStep(step.id)}
                            className="mt-3 px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                        >
                            Видалити крок
                        </button>
                    )}
                </div>
            ))}
            <button
                type="button"
                onClick={addStep}
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
            >
                + Додати крок
            </button>
        </fieldset>
    );
}