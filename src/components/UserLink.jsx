import { HighlightedText } from "./HighlightedText";
import { OptimizedPicture } from "../utils/OptimizedPicture.jsx";

export function UserLink({ picture = "/User.png", username = "Користувач", link = "#user", searchTerm }) {
  return (
    <a href={link} className="flex items-center space-x-3 hover:opacity-80 transition z-30">
      <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
        <OptimizedPicture
          src={picture}
          alt={username}
          className="object-cover w-full h-full"
        />
      </div>
      <p className="truncate max-w-[120px] font-medium text-gray-800">
        <HighlightedText text={username} highlight={searchTerm} />
      </p>
    </a>
  );
}