import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function PasswordInput({
    id,
    name,
    value,
    onChange,
    label,
    placeholder,
    showPassword,
    onToggleVisibility,
    autoComplete = "off",
    isRequired = true
}) {
    return (
        <div className="relative">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
                {isRequired && <span className="text-red-500">*</span>}
            </label>
            <input
                id={id}
                name={name}
                type={showPassword ? 'text' : 'password'}
                autoComplete={autoComplete}
                required={isRequired}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 pr-10"
                placeholder={placeholder}
            />
            <button
                type="button"
                onClick={onToggleVisibility}
                className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Сховати пароль" : "Показати пароль"}
            >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
        </div>
    );
}