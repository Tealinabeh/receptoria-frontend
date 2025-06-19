import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { Header } from "../components/Header.jsx";
import { useAuth } from '../context/AuthContext.jsx';
import { PasswordInput } from "../components/forms/PasswordInput.jsx";

const LOGIN_MUTATION = gql`
  mutation LoginUser($input: LoginUserInput!) {
    loginUser(input: $input) {
      token
      user { id email userName avatarUrl(width: 200) }
    }
  }
`;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const [loginUser, { loading: mutationLoading }] = useMutation(LOGIN_MUTATION, {
    onError: (err) => setError(err.graphQLErrors[0]?.message || "Сталася помилка.")
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      return setError("Будь ласка, введіть адресу електронної пошти та пароль.");
    }

    try {
      const response = await loginUser({ variables: { input: { email: email.trim(), password } } });
      if (response.data?.loginUser) {
        const { token, user } = response.data.loginUser;
        const userData = { id: user.id, email: user.email, nickname: user.userName, avatarUrl: user.avatarUrl };
        login(userData, token);
        navigate("/");
      }
    } catch (err) {
      console.error("Помилка входу:", err);
    }
  };

  return (
    <div>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 sm:p-10 md:p-12 rounded-xl shadow-2xl w-full max-w-md">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-orange-500 mb-8">Увійти до акаунту</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Електронна пошта <span className="text-red-500">*</span></label>
              <input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400" placeholder="example@mail.com" disabled={mutationLoading} />
            </div>

            <PasswordInput
              id="password"
              name="password"
              label="Пароль"
              placeholder="Ваш пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              showPassword={showPassword}
              onToggleVisibility={() => setShowPassword(!showPassword)}
              autoComplete="current-password"
              isRequired={true}
            />

            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md text-center">{error}</p>}

            <div>
              <button type="submit" disabled={mutationLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-lg font-medium text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-60">
                {mutationLoading ? "Вхід..." : "Увійти"}
              </button>
            </div>
          </form>
          <p className="mt-10 text-center text-sm text-gray-600">Не маєте акаунту? <Link to="/register" className="font-medium text-orange-500 hover:text-orange-400">Створити акаунт</Link></p>
        </div>
      </div>
    </div>
  );
}