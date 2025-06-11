import { useState, useEffect } from 'react';

const CONFIRMATION_WORDS = [
    'Вареник', 'Галушка', 'Дерун', 'Пампушка', 'Сирник',
    'Паприка', 'Цибуля', 'Сало', 'Узвар', 'Квас',
    'Кисіль', 'Смаколик', 'Пательня', 'Друшляк', 'Качалка',
    'Шкварки', 'Млинець', 'Куліш', 'Шпундра', 'Сметана', 
    'Часник', 'Кріп'
];

export function DeleteConfirmationModal({ isOpen, onClose, onConfirm, isLoading }) {
    const [confirmationWord, setConfirmationWord] = useState('');
    const [userInput, setUserInput] = useState('');


    useEffect(() => {
        if (isOpen) {
            const randomIndex = Math.floor(Math.random() * CONFIRMATION_WORDS.length);
            setConfirmationWord(CONFIRMATION_WORDS[randomIndex]);
            setUserInput('');
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    const isConfirmed = userInput === confirmationWord;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-red-600 mb-4">Підтвердьте видалення</h2>
                <p className="text-center text-gray-600 mb-6">
                    Щоб видалити рецепт назавжди, будь ласка, введіть слово:
                </p>
                <p className="text-center text-2xl font-mono select-none bg-gray-100 py-2 rounded-md mb-6">
                    {confirmationWord}
                </p>
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-center focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Введіть слово вище"
                />
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={onClose}
                        className="w-full py-3 px-4 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 font-medium transition-colors"
                    >
                        Скасувати
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={!isConfirmed || isLoading}
                        className="w-full py-3 px-4 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Видалення...' : 'Видалити назавжди'}
                    </button>
                </div>
            </div>
        </div>
    );
}