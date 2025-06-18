export function TimeInput({ label, value, onChange }) {

    const handleInputChange = (field, inputValue) => {
        const numValue = Math.max(0, parseInt(inputValue, 10) || 0);
        onChange({
            ...value,
            [field]: numValue,
        });
    };

    return (
        <fieldset className="border border-gray-300 p-4 rounded-md">
            <legend className="text-lg font-medium text-gray-700 px-2">
                {label}
            </legend>
            <div className="flex items-center space-x-4">
                <div className="flex-1">
                    <label htmlFor="time-days" className="block text-sm font-medium text-gray-500 mb-1">Дн.</label>
                    <input
                        id="time-days"
                        type="number"
                        value={value.days || ''}
                        onChange={(e) => handleInputChange('days', e.target.value)}
                        min="0"
                        className="w-full px-3 py-2 text-center rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="time-hours" className="block text-sm font-medium text-gray-500 mb-1">Год.</label>
                    <input
                        id="time-hours"
                        type="number"
                        value={value.hours || ''}
                        onChange={(e) => handleInputChange('hours', e.target.value)}
                        min="0"
                        className="w-full px-3 py-2 text-center rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="time-minutes" className="block text-sm font-medium text-gray-500 mb-1">Хв.</label>
                    <input
                        id="time-minutes"
                        type="number"
                        value={value.minutes || ''}
                        onChange={(e) => handleInputChange('minutes', e.target.value)}
                        min="0"
                        className="w-full px-3 py-2 text-center rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                </div>
            </div>
        </fieldset>
    );
}
