let nextId = 0;
const generateId = () => (nextId++).toString();

export function DynamicListInput({
  label,
  items,
  setItems,
  placeholder,
  required = false
}) {
  const handleItemChange = (id, text) => {
    setItems(items.map((item) => (item.id === id ? { ...item, text } : item)));
  };

  const addItem = () => {
    setItems([...items, { id: generateId(), text: "" }]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  return (
    <fieldset className="border border-gray-300 p-4 rounded-md">
      <legend className="text-lg font-medium text-gray-700 px-2">
        {label} {required && <span className="text-red-500">*</span>}
      </legend>
      {items.map((item, index) => (
        <div key={item.id} className="flex items-center space-x-2 mb-2">
          <input
            type="text"
            value={item.text}
            onChange={(e) => handleItemChange(item.id, e.target.value)}
            placeholder={`${placeholder} ${index + 1}`}
            className="flex-grow px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
            >
              Видалити
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
      >
        + Додати
      </button>
    </fieldset>
  );
}