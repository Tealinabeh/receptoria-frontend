export function FilterControls({
  sortConfig,
  onSortChange,
  searchTerm,
  onSearchChange,
  title
}) {

  const handleSortFieldChange = (e) => {
    if (onSortChange) onSortChange({ ...sortConfig, field: e.target.value });
  };

  const toggleSortDirection = () => {
    if (onSortChange) onSortChange({ ...sortConfig, direction: sortConfig.direction === 'DESC' ? 'ASC' : 'DESC' });
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center space-x-4 w-full md:w-auto">
        <h3 className="text-2xl font-bold text-gray-700 whitespace-nowrap">{title}</h3>
        {onSearchChange && (
          <input
            type="search"
            placeholder="Пошук..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        )}
      </div>
      <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
        <span className="text-gray-600 hidden sm:inline">Сортувати:</span>
        <select
          value={sortConfig?.field || 'created'}
          onChange={handleSortFieldChange}
          className="p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="created">Даті</option>
          <option value="averageRating">Оцінці</option>
          <option value="timeToCook">Часу</option>
          <option value="difficulty">Складності</option>
        </select>
        <button onClick={toggleSortDirection} className="p-2 rounded-md hover:bg-gray-100" title="Змінити напрямок сортування">
          <span className="text-2xl font-bold">{sortConfig?.direction === 'DESC' ? '↓' : '↑'}</span>
        </button>
      </div>
    </div>
  );
} 