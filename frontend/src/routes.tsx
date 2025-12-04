import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout/Layout";
import AuthLayout from "./components/layout/AuthLayout";
import RequireAuth from "./components/RequireAuth";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import GamePage from "./pages/Play";
import HistoryPage from "./pages/History";
import ErrorPage from "./pages/ErrorPage";

export const routes = createBrowserRouter([
	{
		id: "public",
		element: <AuthLayout />,
		children: [
			{
				path: "/login",
				element: <LoginPage />,
			},
			{
				path: "/register",
				element: <RegisterPage />,
			},
		],
	},
	{
		path: "/",
		element: <Layout />,
		errorElement: <ErrorPage />,
		children: [
			{
				id: "protected",
				element: <RequireAuth />,
				children: [
					{
						index: true,
						element: <GamePage />,
					},
					{
						path: "/history",
						element: <HistoryPage />,
					},
				],
			},
			{
				path: "*",
				element: <ErrorPage />,
			},
		],
	},
]);
