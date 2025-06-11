import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { PasswordInput } from '../components/forms/PasswordInput'; 

export default function ProfileEditPage() {
    const navigate = useNavigate();
    const { state: authState, login } = useAuth();

    const [formState, setFormState] = useState({
        userName: '',
        bio: '',
        newEmail: '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('/User.png');
    const [showPassword, setShowPassword] = useState(false);

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const { loading: queryLoading } = useQuery(gql`
      query GetMe {
        me { id userName email bio avatarUrl }
      }
    `, {
        onCompleted: (data) => {
            if (data.me) {
                setFormState(prev => ({
                    ...prev,
                    userName: data.me.userName || '',
                    bio: data.me.bio || '',
                    newEmail: data.me.email || '',
                }));
                if (data.me.avatarUrl) setAvatarPreview(data.me.avatarUrl);
            }
        },
        fetchPolicy: 'network-only',
    });

    const [updateProfile, { loading: mutationLoading }] = useMutation(gql`
        mutation UpdateProfile($input: UpdateProfileInput!) {
            updateProfile(input: $input) { id userName bio avatarUrl email }
        }
    `, {
        onCompleted: (data) => {
            setMessage('Профіль успішно оновлено!');
            const { __typename, ...userData } = data.updateProfile;
            const updatedAuthData = { ...authState.user, ...userData, nickname: userData.userName };
            login(updatedAuthData, authState.token);
            setTimeout(() => navigate(`/user/${authState.user.id}`), 1500);
        },
        onError: (err) => {
            setError(err.graphQLErrors[0]?.message || 'Сталася помилка.');
            setMessage('');
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setAvatarPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (formState.newPassword && formState.newPassword !== formState.confirmNewPassword) {
            setError('Нові паролі не співпадають.');
            return;
        }

        const input = {
            userName: formState.userName,
            bio: formState.bio,
            avatar: avatarFile,
            newEmail: formState.newEmail,
            currentPassword: formState.currentPassword,
            newPassword: formState.newPassword,
        };

        Object.keys(input).forEach(key => {
            if (!input[key]) delete input[key];
        });

        if (Object.keys(input).length === 0 && !avatarFile) {
            setError('Ви нічого не змінили.');
            return;
        }

        updateProfile({ variables: { input } });
    };

    if (queryLoading) return <div><Header /><p className="text-center py-10">Завантаження даних профілю...</p></div>;

    return (
        <div className="bg-gray-50">
            <Header />
            <div className="max-w-2xl mx-auto py-24 px-4">
                <h1 className="text-3xl font-bold text-center text-orange-600 mb-8">Редагування профілю</h1>
                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg">
                    <div className="flex flex-col items-center space-y-3">
                        <img src={avatarPreview} alt="Аватар" className="w-32 h-32 rounded-full object-cover border-4 border-gray-200" />
                        <label htmlFor="avatarInput" className="cursor-pointer px-4 py-2 bg-orange-100 text-orange-600 rounded-md hover:bg-orange-200 text-sm font-medium">Змінити аватар</label>
                        <input id="avatarInput" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                    </div>

                    <div>
                        <label htmlFor="userName" className="block text-sm font-medium text-gray-700">Ім'я користувача</label>
                        <input type="text" name="userName" id="userName" value={formState.userName} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>

                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Про себе</label>
                        <textarea name="bio" id="bio" rows="4" value={formState.bio} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea>
                    </div>

                    <div>
                        <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700">Електронна пошта</label>
                        <input type="email" name="newEmail" id="newEmail" value={formState.newEmail} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>

                    <div className="border-t pt-6 space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Зміна пароля</h3>
                        <p className="text-sm text-gray-500">Залиште поля порожніми, якщо не хочете змінювати пароль.</p>

                        <PasswordInput
                            id="currentPassword"
                            name="currentPassword"
                            label="Поточний пароль"
                            value={formState.currentPassword}
                            onChange={handleChange}
                            showPassword={showPassword}
                            onToggleVisibility={() => setShowPassword(!showPassword)}
                            autoComplete="current-password"
                            isRequired={false}
                        />
                        <PasswordInput
                            id="newPassword"
                            name="newPassword"
                            label="Новий пароль"
                            value={formState.newPassword}
                            onChange={handleChange}
                            showPassword={showPassword}
                            onToggleVisibility={() => setShowPassword(!showPassword)}
                            autoComplete="new-password"
                            isRequired={false}
                        />
                        <PasswordInput
                            id="confirmNewPassword"
                            name="confirmNewPassword"
                            label="Підтвердіть новий пароль"
                            value={formState.confirmNewPassword}
                            onChange={handleChange}
                            showPassword={showPassword}
                            onToggleVisibility={() => setShowPassword(!showPassword)}
                            autoComplete="new-password"
                            isRequired={false}
                        />
                    </div>

                    {message && <p className="text-sm text-green-600 bg-green-100 p-3 rounded-md text-center">{message}</p>}
                    {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md text-center">{error}</p>}

                    <div className="pt-2">
                        <button type="submit" disabled={mutationLoading} className="w-full flex justify-center py-3 px-4 rounded-lg shadow-md text-lg font-medium text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-70">
                            {mutationLoading ? 'Збереження...' : 'Зберегти зміни'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}