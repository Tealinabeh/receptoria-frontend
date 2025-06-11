export function DifficultyBadge({ difficulty }) {
    return (
        <span className={`px-2 py-1 w-min rounded-full text-xs font-medium 
            ${difficulty == 1
            ? 'bg-green-100 text-green-800'
            : difficulty == 2
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
            {['Легко', 'Середньо', 'Складно'][difficulty - 1]}
        </span>
    )
}
