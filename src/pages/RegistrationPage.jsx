import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { Header } from "../components/Header.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { PasswordInput } from "../components/forms/PasswordInput.jsx";

const DEFAULT_AVATAR_PREVIEW = "/User.png";

const REGISTER_MUTATION = gql`
  mutation RegisterUser($input: RegisterUserInput!) {
    registerUser(input: $input) {
      token
      user { id email userName avatarUrl }
    }
  }
`;

export default function RegistrationPage() {
  const [formState, setFormState] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(DEFAULT_AVATAR_PREVIEW);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const [registerUser, { loading, error: mutationError }] = useMutation(
    REGISTER_MUTATION, {
    onCompleted: (data) => {
      const { token, user } = data.registerUser;
      const userDataForContext = { id: user.id, email: user.email, nickname: user.userName, avatarUrl: user.avatarUrl };

      setSuccessMessage("Реестрація успешна!");

      setTimeout(() => {
        login(userDataForContext, token);
        navigate("/");
      }, 1000);
    },
    onError: (apolloError) => {
      setFormError(apolloError.graphQLErrors[0]?.message || "Сталася помилка.");
    }
  }
  );

  const handleChange = (e) => {
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePictureChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
      setFormError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    setSuccessMessage("");

    if (formState.password !== formState.confirmPassword) {
      return setFormError("Паролі не співпадають.");
    }

    registerUser({
      variables: {
        input: {
          username: formState.username.trim(),
          email: formState.email.trim(),
          password: formState.password,
          image: profilePictureFile,
        },
      },
    });
  };

  const displayError = mutationError ? (mutationError.graphQLErrors[0]?.message) : formError;

  return (
    <div>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 sm:p-10 md:p-12 rounded-xl shadow-2xl w-full max-w-lg">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-orange-500 mb-8">Створити акаунт</h2>
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="flex flex-col items-center space-y-3">
              <img src={previewImage} alt="Profile Preview" className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-orange-300 shadow-sm" />
              <label htmlFor="profilePictureInput" className="cursor-pointer px-4 py-2 bg-orange-100 text-orange-600 rounded-md hover:bg-orange-200 transition text-sm font-medium">
                {profilePictureFile ? "Змінити фото" : "Завантажити фото"}
              </label>
              <input id="profilePictureInput" type="file" accept="image/*" onChange={handlePictureChange} className="hidden" />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Ім'я користувача <span className="text-red-500">*</span></label>
              <input id="username" name="username" type="text" required value={formState.username} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="Ваше унікальне ім'я" />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Електронна пошта <span className="text-red-500">*</span></label>
              <input id="email" name="email" type="email" required value={formState.email} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="example@mail.com" />
            </div>

            <PasswordInput
              id="password"
              name="password"
              label="Пароль"
              placeholder="Мінімум 8 символів"
              value={formState.password}
              onChange={handleChange}
              showPassword={showPassword}
              onToggleVisibility={() => setShowPassword(!showPassword)}
              autoComplete="new-password"
              isRequired={true}
            />

            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              label="Підтвердіть пароль"
              placeholder="Повторіть пароль"
              value={formState.confirmPassword}
              onChange={handleChange}
              showPassword={showPassword}
              onToggleVisibility={() => setShowPassword(!showPassword)}
              autoComplete="new-password"
            />

            {displayError && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md text-center">{displayError}</p>}
            {successMessage && <p className="text-sm text-green-600 bg-green-100 p-3 rounded-md text-center">{successMessage}</p>}

            <div>
              <button type="submit" disabled={loading || !!successMessage} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-lg font-medium text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-60">
                {loading ? "Реєстрація..." : "Зареєструватися"}
              </button>
            </div>
          </form>
          <p className="mt-10 text-center text-sm text-gray-600">Вже маєте акаунт? <Link to="/login" className="font-medium text-orange-500 hover:text-orange-400">Увійти</Link></p>
        </div>
      </div>
    </div>
  );
}