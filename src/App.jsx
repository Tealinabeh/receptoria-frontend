import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RecipePage from "./pages/RecipePage";
import NotFoundPage from "./pages/NotFoundPage";
import RegistrationPage from "./pages/RegistrationPage";
import LoginPage from "./pages/LoginPage";
import RecipeBuilderPage from "./pages/RecipeBuilderPage"
import UserProfilePage from "./pages/UserProfilePage"
import ProfileEditPage from "./pages/ProfileEditPage";
import RecipeEditPage from "./pages/RecipeEditPage";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="*" element={<NotFoundPage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/recipe/:id" element={<RecipePage />} />
                <Route path="/recipe/:id/edit" element={<RecipeEditPage />} />
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/builder" element={<RecipeBuilderPage />} />
                <Route path="/user/:userId" element={<UserProfilePage />} />
                <Route path="/profile/edit" element={<ProfileEditPage />} />
            </Routes>
        </Router>
    );
}