import { Link, useSearchParams } from 'react-router-dom';

const navigationData = [
    {
        title: "Час / Складність:",
        queryKey: "timeToCook",
        items: [
            { label: "⚡ Швидке", value: "quick" },
            { label: "🛒 Прості інгредієнти", value: "simple-ingredients" },
        ],
    },
    {
        title: "Тип страви:",
        queryKey: "categories",
        items: [
            { label: "🍳 Сніданок", value: "сніданок" },
            { label: "🥘 Обід", value: "обід" },
            { label: "🌙 Вечеря", value: "вечеря" },
            { label: "🥗 Салат", value: "салат" },
            { label: "🍰 Десерт", value: "десерт" },
            { label: "🥩 Паштет", value: "паштет" },
            { label: "🥖 Намазка", value: "намазка" },
            { label: "🧁 Випічка", value: "випічка" },
            { label: "🍞 Тісто", value: "тісто" },
            { label: "🔥 Гриль", value: "гриль" },
        ],
    },
    {
        title: "Дієта:",
        queryKey: "categories",
        items: [
            { label: "🥬 Веганське", value: "веганське" },
            { label: "🌾 Пісне", value: "пісне" },
            { label: "🌾 Безглютенове 🚫", value: "безглютенове" },
            { label: "🍬 Безцукрове 🚫", value: "безцукрове" },
            { label: "📉 Низькокалорійне", value: "низькокалорійне" },
            { label: "❤️ Здорове", value: "здорове" },
            { label: "🏋️‍♀️ Фітнес", value: "фітнес" },
            { label: "🧒 Дитяче", value: "дитяче" },
        ],
    },
    {
        title: "Події / Сезонність:",
        queryKey: "categories",
        items: [
            { label: "🎂 Святкове", value: "святкове" },
            { label: "🏕 На природі", value: "на природі" },
            { label: "🌞 Літнє", value: "літнє" },
            { label: "🍂 Осіннє", value: "осіннє" },
            { label: "🔥 Гаряче", value: "гаряче" },
            { label: "❄️ Холодне", value: "холодне" },
        ],
    },
];


function NavLink({ to, children, isActive, isSpecial, onClick }) {
    const specialActiveClasses = "text-red-500 font-bold underline";
    const defaultActiveClasses = "text-orange-500 font-bold underline";
    const inactiveClasses = "hover:text-orange-400";

    const activeClasses = isSpecial ? specialActiveClasses : defaultActiveClasses;
    const finalClasses = isActive ? activeClasses : inactiveClasses;

    return (
        <Link to={to} className={`transition-colors ${finalClasses}`} onClick={onClick}>
            {children}
        </Link>
    );
} 

export function Navigation({ onCloseClick }) {
    const [searchParams] = useSearchParams();

    const createLink = (key, value) => {
        const newParams = new URLSearchParams(searchParams);

        if (key === 'categories') {
            const allCategories = newParams.getAll(key);
            if (allCategories.includes(value)) {
                const filteredCategories = allCategories.filter(c => c !== value);
                newParams.delete(key);
                filteredCategories.forEach(c => newParams.append(key, c));
            } else {
                newParams.append(key, value);
            }
        } else {
            if (newParams.get(key) === value) {
                newParams.delete(key);
            } else {
                newParams.set(key, value);
            }
        }

        newParams.set('page', '1');
        return `/?${newParams.toString()}`;
    };

    return (
        <nav className="pb-24 p-4 h-full overflow-y-auto md:pb-4 md:border-dashed md:border-2 md:rounded-2xl md:h-auto md:overflow-y-visible">
            <button onClick={onCloseClick} className="absolute top-2 right-4 text-3xl text-gray-400 hover:text-gray-700 md:hidden">×</button>
            <ul className="font-bold text-2xl space-y-4 md:pt-0">
                {navigationData.map((section) => {
                    const isSpecialSection = section.title === "Час / Складність:";
                    return (
                        <li key={section.title}>
                            <span className={isSpecialSection ? 'text-orange-400' : ''}>
                                {section.title}
                            </span>
                            <ul className="font-normal text-gray-700 text-xl space-y-2 pl-3 mt-2">
                                {section.items.map((item) => (
                                    <li key={item.value}>
                                        <NavLink
                                            to={createLink(section.queryKey, item.value)}
                                            isActive={searchParams.getAll(section.queryKey).includes(item.value)}
                                            isSpecial={isSpecialSection}
                                        >
                                            {item.label}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}