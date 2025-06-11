import { HighlightedText } from './HighlightedText';

export function TagsList({ tags = [], searchTerm }) {
  const maxVisible = 3;
  const visibleTags = tags.slice(0, maxVisible);
  const hiddenCount = tags.length - maxVisible;

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {visibleTags.map((tag, index) => (
        <span
          key={index}
          className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full border border-orange-300"
        >
          #<HighlightedText text={tag} highlight={searchTerm} />
        </span>
      ))}
      {hiddenCount > 0 && (
        <span className="px-3 py-1 bg-green-200 text-green-600 text-sm rounded-full border border-green-300">
          +{hiddenCount}
        </span>
      )}
    </div>
  );
}