import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";

import { NavigationSkeleton } from './components/placeholders/NavigationSkeleton';
import { DailyRecipeSkeleton } from './components/placeholders/DailyRecipeSkeleton';
import { RecipePreviewCardSkeleton } from './components/placeholders/RecipePreviewCardSkeleton';
import { RecipePageSkeleton } from './components/placeholders/RecipePageSkeleton';

const HomePage = lazy(() => import("./pages/HomePage"));
const RecipePage = lazy(() => import("./pages/RecipePage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const RegistrationPage = lazy(() => import("./pages/RegistrationPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RecipeBuilderPage = lazy(() => import("./pages/RecipeBuilderPage"));
const UserProfilePage = lazy(() => import("./pages/UserProfilePage"));
const ProfileEditPage = lazy(() => import("./pages/ProfileEditPage"));
const RecipeEditPage = lazy(() => import("./pages/RecipeEditPage"));

function HomePageLoader() {
    return (
        <div className="px-4 pt-20 flex flex-col md:flex-row">
            <main className="px-2 md:px-4 pt-4 w-full md:w-3/4">
                <DailyRecipeSkeleton />
                <div className="mt-8 h-20 bg-gray-200 rounded-lg animate-pulse"></div> {/* Плейсхолдер для FilterControls */}
                <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-9 items-start">
                    {[...Array(9)].map((_, index) => <RecipePreviewCardSkeleton key={index} />)}
                </div>
            </main>
            <aside className="hidden md:block md:w-1/4 md:pt-4 md:pl-4">
                <NavigationSkeleton />
            </aside>
        </div>
    );
}

function RecipePageLoader() {
    return <RecipePageSkeleton />;
}

function GenericPageLoader() {
    return (
        <div className="flex justify-center items-center h-screen pt-20">
            <p className="text-xl text-gray-500">Завантаження...</p>
        </div>
    );
}

export default function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="*" element={<Suspense fallback={<GenericPageLoader />}><NotFoundPage /></Suspense>} />
                <Route path="/" element={<Suspense fallback={<HomePageLoader />}><HomePage /></Suspense>} />
                <Route path="/recipe/:id" element={<Suspense fallback={<RecipePageLoader />}><RecipePage /></Suspense>} />

                <Route path="/recipe/:id/edit" element={<Suspense fallback={<GenericPageLoader />}><RecipeEditPage /></Suspense>} />
                <Route path="/register" element={<Suspense fallback={<GenericPageLoader />}><RegistrationPage /></Suspense>} />
                <Route path="/login" element={<Suspense fallback={<GenericPageLoader />}><LoginPage /></Suspense>} />
                <Route path="/builder" element={<Suspense fallback={<GenericPageLoader />}><RecipeBuilderPage /></Suspense>} />
                <Route path="/user/:userId" element={<Suspense fallback={<GenericPageLoader />}><UserProfilePage /></Suspense>} />
                <Route path="/profile/edit" element={<Suspense fallback={<GenericPageLoader />}><ProfileEditPage /></Suspense>} />
            </Routes>
        </Router>
    );
}