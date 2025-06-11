import { Link } from 'react-router-dom';
import { DifficultyBadge } from "./DifficultyBadge";
import { Timer } from "./Timer";
import { TagsList } from "./TagsList";
import { Rating } from "./Rating";
import { UserLink } from "./UserLink";
import { MarqueeTitle } from './MarqueeTitle';

export function RecipePreviewCard({ title, img, time, difficulty, tags, rating, userpicture, username, id, userId, searchTerm, created }) {
  const creationDate = created ? new Date(created).toLocaleDateString('uk-UA') : '';

  return (
    <div className="group relative flex flex-col w-auto max-w-96 rounded-xl overflow-hidden border-2 shadow-lg bg-white duration-500 hover:scale-105 hover:z-10 hover:shadow-slate-800">
      <Link to={`/recipe/${id}`} className="absolute inset-0 z-20" />
      <img
        src={img}
        alt={title}
        className="h-50 w-full object-cover"
      />

      <main className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-center">
          <div className="flex-grow w-full">
            <MarqueeTitle text={title} highlight={searchTerm} />
          </div>
          <div className="ml-2 flex-shrink-0">
            <Rating rating={rating} />
          </div>
        </div>
        <TagsList tags={tags} searchTerm={searchTerm} />
        <div className="flex items-center justify-between mt-2">
          <Timer time={time} />
          <DifficultyBadge difficulty={difficulty} />
        </div>

        <div className="mt-auto pt-4">
          <div className='relative z-30'>
            <Link to={`/recipe/${id}`} className="w-full block text-center mt-4 px-4 py-2 bg-orange-400 group-hover:bg-red-700 text-white rounded text-sm font-medium transition">
              Дивитись рецепт
            </Link>
          </div>

          <div className="flex items-center justify-between mt-4 relative z-30 pt-2 border-t">
            <UserLink
              picture={userpicture}
              username={username}
              link={`/user/${userId}`}
              searchTerm={searchTerm}
            />
            {creationDate && (
              <span className="text-xs text-gray-400">{creationDate}</span>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}