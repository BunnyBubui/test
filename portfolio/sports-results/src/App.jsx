import { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import LoadingScreen from "./scripts/LoadingScreen";
const UserLogin = lazy(() => import("./pages/UserLogin"));
const MedalBoard = lazy(() => import("./pages/MedalBoard"));
const Matches = lazy(() => import("./pages/Matches"));
const MatchResult = lazy(() => import("./pages/MatchResult"));
const DailyMatchResults = lazy(() => import("./pages/DailyMatchResults"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Load = lazy(() => import("./scripts/LoadingScreen"));
const UserChangePassword = lazy(() => import("./pages/UserChangePassword"));

const RouteWithLoader = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => setIsLoading(false), 600);

    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <>
      {isLoading && <LoadingScreen />}
      {children}
    </>
  );
};

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingScreen />}>
          <div className="app">
            <RouteWithLoader>
              <Routes>
                <Route path="/" element={<DailyMatchResults />} />
                <Route path="/login" element={<UserLogin />} />
                <Route path="/load" element={<Load />} />
                <Route path="/calendar" element={<Matches />} />
                <Route path="/results" element={<MatchResult />} />
                <Route path="/medal" element={<MedalBoard />} />
                <Route path="/admin-dashboard" element={<Dashboard />} />
                <Route path="/reset-password" element={<UserChangePassword />} />
              </Routes>
            </RouteWithLoader>
          </div>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
