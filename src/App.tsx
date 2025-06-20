import "./styles/global.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./routes/home"; // This will be your sophisticated welcome page
import Ideas from "./routes/ideas"; // Renamed from Community
import Profile from "./routes/profile";
import Login from "./routes/login";
import CreateAccount from "./routes/create-account";
import { useEffect, useState } from "react";
import LoadingScreen from "./components/loading-screen";
import { auth } from "./firebase"; // Make sure your firebase.ts exports 'auth'
import ProtectedRoute from "./components/protected-route";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Layout remains the parent for common UI elements (header, nav)
    children: [
      {
        path: "", // This is the root path "/"
        element: <Home />, // Your new sophisticated welcome page
      },
      {
        // This group uses ProtectedRoute for authentication checks
        element: <ProtectedRoute />,
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "ideas", // Renamed from "community"
            element: <Ideas />,
          },
          // Add more protected routes here if needed, e.g., "/settings"
        ],
      },
    ],
  },
  // Routes without the main Layout
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/create-account",
    element: <CreateAccount />,
  },
  // You might want a 404 Not Found page here as well
  // {
  //   path: "*",
  //   element: <NotFoundPage />,
  // },
]);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const init = async () => {
    // Firebase waits for the user's authentication state to be confirmed.
    await auth.authStateReady();
    setIsLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  return isLoading ? <LoadingScreen /> : <RouterProvider router={router} />;
}

export default App;