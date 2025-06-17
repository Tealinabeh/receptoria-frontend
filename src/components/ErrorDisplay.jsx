import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export function ErrorDisplay({
    title = "Ой, сталася помилка",
    message,
    onRetry
}) {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                    <AlertTriangle className="h-10 w-10 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
                <p className="text-gray-600 mb-6">
                    Схоже, щось пішло не так під час завантаження даних.
                </p>
                {message && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm text-left mb-6">
                        <strong>Технічна інформація:</strong>
                        <code className="block mt-1">{message}</code>
                    </div>
                )}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="w-full sm:w-auto px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            Спробувати ще
                        </button>
                    )}
                    <Link
                        to="/"
                        className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        На головну
                    </Link>
                </div>
            </div>
        </div>
    );
}