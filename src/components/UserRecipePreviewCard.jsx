import { Link } from 'react-router-dom';
import { DifficultyBadge } from "./DifficultyBadge";
import { Timer } from "./Timer";
import { Rating } from "./Rating";
import { UserLink } from "./UserLink";
import { MarqueeTitle } from './MarqueeTitle';

export function UserRecipePreviewCard({ id, title, img, timeToCook, difficulty, averageRating, author, created, searchTerm }) {
    const creationDate = created ? new Date(created).toLocaleDateString('uk-UA') : '';

    return (
        <div className="group relative flex flex-col w-auto max-w-96 rounded-xl overflow-hidden border-2 shadow-lg bg-white duration-300 hover:scale-105 hover:shadow-xl">
            <Link to={`/recipe/${id}`} className="absolute inset-0 z-10" />

            <div className="relative h-52 w-full">
                <img src={img || '/fallback-preview.jpeg'} alt={title} className="w-full h-full object-cover" />
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <MarqueeTitle text={title} highlight={searchTerm} />

                <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
                    <Timer time={timeToCook} />
                    <Rating rating={averageRating} />
                    <DifficultyBadge difficulty={difficulty} />
                </div>

                <div className="mt-auto pt-4">
                    <div className='relative z-20 mt-auto pt-2'>
                        <Link to={`/recipe/${id}`} className="w-full block text-center py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
                            Дивитись рецепт
                        </Link>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-2 border-t">
                        <UserLink picture={author?.avatarUrl || '/User.png'} username={author?.userName} link={`/user/${author?.id}`} />
                        <span className="text-xs text-gray-400">{creationDate}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}