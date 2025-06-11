import { DifficultyBadge } from "./DifficultyBadge";
import { Timer } from "./Timer";
import { Rating } from "./Rating";
import { Link } from "react-router-dom";

export function DailyRecipe({ image, title, time, rating, difficulty, href }) {
  return (
    <div className="group relative h-96 w-full rounded-xl overflow-hidden shadow-lg">
      <img src={image} alt={title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/15 to-30% flex flex-col justify-end p-4 text-white">
        <div className="mb-52 translate-y-14">
          <h1 className="text-5xl font-semibold">Рецепт дня</h1>
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
