import { useState } from "react";

export function RecipeStep({ number, description, image }) {
    const isEven = number % 2 === 0;
    const baseBgColor = isEven ? 'bg-gray-200' : 'bg-white';
    
    const [completed, setCompleted] = useState(false);

    const handleClick = () => {
        setCompleted(!completed);
    };

    return (
        <div
            onClick={handleClick}
            className={`
                rounded-xl border-2 p-4 m-2 cursor-pointer transition-all duration-300 
                ${baseBgColor} 
                ${completed ? 'border-orange-500 opacity-50' : 'border-gray-500'}
            `}
        >
            <article className="flex items-start gap-4 mb-4">
                <p className={`border border-orange-400 transition-colors rounded-lg min-w-8 h-8 flex items-center justify-center text-lg font-bold ${completed ? 'bg-orange-200' : ''}`}>
                    {number}
                </p>
                <div className="text-left flex-grow">
                    {description.split('\n').map((line, index) => (
                        <p
                            key={index}
                            className={`leading-snug transition-all duration-300 ${completed ? 'line-through text-gray-500' : ''}`}
                        >
                            {line}
                        </p>
                    ))}
                </div>
            </article>
            {image && (
                <div className={`border-t pt-4 mt-4 text-center ${completed ? 'border-orange-400' : 'border-gray-500'}`}>
                    <img src={image} alt={`Крок ${number}`} className="mx-auto max-h-52 object-contain rounded-md" />
                </div>
            )}
        </div>
    );
}