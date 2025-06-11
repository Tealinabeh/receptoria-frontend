import { Link } from 'react-router-dom';
import { Header } from '../components/Header';

export default function NotFoundPage() {
    return (
        <div>
            <Header />
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 pt-16 pb-7 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 text-center">
                    <div>
                        <h1 className="text-9xl font-extrabold text-orange-400">404</h1>
                        <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Сторінку не знайдено
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Вибачте, ми не можемо знайти сторінку, яку ви шукаєте. Можливо, її було переміщено, видалено або вона ніколи не існувала.
                        </p>
                    </div>
                    <div className="mt-10">
                        <Link
                            to="/" 
                            className="group relative w-full sm:w-auto flex justify-center py-3 px-6 border border-transparent text-lg font-medium rounded-md text-white bg-orange-400 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out"
                        >
                            Повернутися на головну
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
