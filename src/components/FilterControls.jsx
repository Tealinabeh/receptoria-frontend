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
    <div className="flex justify-between items-center mb-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center space-x-4">
        <h3 className="text-2xl font-bold text-gray-700">{title}</h3>
        {onSearchChange && (
          <input
            type="search"
            placeholder="Пошук за назвою..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        )}
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-gray-600">Сортувати по:</span>
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
          <span>{sortConfig?.direction === 'DESC' ? '↓' : '↑'}</span>
        </button>
      </div>
    </div>
  );
}