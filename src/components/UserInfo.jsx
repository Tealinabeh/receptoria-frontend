import { Link } from "react-router-dom";
import { OptimizedPicture } from "../utils/OptimizedPicture.jsx";

export function UserInfo({ user, isOwner }) {
    const registrationDate = user.registrationDate
        ? new Date(user.registrationDate).toLocaleDateString('uk-UA')
        : "Невідомо";

    const avatarSrc = user.avatarUrl || "/User.png";

    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <OptimizedPicture
                src={avatarSrc}
                alt="Аватар користувача"
                className="w-32 h-32 rounded-full object-cover border-4 border-orange-400 flex-shrink-0"
            />
            <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start">
                    <div className="flex-grow">
                        <h2 className="text-3xl font-bold text-gray-800">{user.userName}</h2>
                        <p className="text-gray-500 mt-2">Про себе:</p>
                        <p className="mt-1 text-gray-700 bg-gray-50 p-2 rounded-md min-h-[60px] max-h-40 overflow-y-auto text-left break-words">
                            {user.bio || "Опис про себе ще не додано."}
                        </p>
                    </div>
                    <div className="text-left sm:text-right mt-4 sm:mt-0 sm:ml-6 flex-shrink-0">
                        <div className="mb-2">
                            <p className="text-sm text-gray-500">Зроблено рецептів</p>
                            <p className="text-2xl font-bold text-orange-500">{user.recipeCount}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Зареєструвався</p>
                            <p className="text-lg font-medium text-gray-700">{registrationDate}</p>
                        </div>
                    </div>
                </div>
                {isOwner && (
                    <div className="mt-4 flex justify-between">
                        <Link
                            to={`/profile/edit`}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                        >
                            Редагувати профіль
                        </Link>
                        <Link to="/builder" className="px-4 py-2 text-sm font-medium text-orange-600 bg-gray-100 border-2 border-dashed border-orange-400 rounded-lg hover:bg-orange-50 transition-colors">
                            + Створити рецепт
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}