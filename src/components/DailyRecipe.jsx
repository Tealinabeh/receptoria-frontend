import { DifficultyBadge } from "./DifficultyBadge";
import { Timer } from "./Timer";
import { Rating } from "./Rating";
import { Link } from "react-router-dom";
import { OptimizedPicture } from "../utils/OptimizedPicture";

export function DailyRecipe({ image, title, time, rating, difficulty, href, isLcp = false }) {
  return (
    <div className="group relative h-96 w-full rounded-xl overflow-hidden shadow-lg">
      <OptimizedPicture
        src={image}
        alt={title}
        className="w-full h-full object-cover"
        isLcp={isLcp}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/10 to-60% md:from-black/60 md:to-black/15 md:to-30% flex flex-col justify-end p-4 text-white">
        <div className="mb-52 translate-y-16">
          <h1 className="text-5xl mb-3 font-semibold">Рецепт дня</h1>
          <Rating rating={rating} />
        </div>
        <DifficultyBadge difficulty={difficulty} />
        <p className="text-3xl font-semibold mb-2 truncate">{title}</p>
        <Timer time={time} />
        <button className="mt-4 max-w-max px-4 py-2 bg-orange-400 group-hover:bg-red-700 rounded text-sm font-medium transition duration-700">
          Дивитись рецепт
        </button>
      </div>
      <Link to={href}>
        <span className="inset-0 absolute z-10" />
      </Link>
    </div>
  );
}
