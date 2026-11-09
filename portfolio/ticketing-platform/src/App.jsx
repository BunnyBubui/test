import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import loadable from '@loadable/component';
import LoadingScreen from "./components/ui/LoadingScreen";
import NotFound from "./components/ui/NotFound";

// ใช้ loadable() และระบุ fallback ไว้ด้านในเลย
const Load = loadable(() => import("./components/ui/LoadingScreen"));
const Contact = loadable(() => import("./components/ui/Contact"));

// shop
const Shop = loadable(() => import("./pages/Shop"), { fallback: <LoadingScreen /> });
const Package = loadable(() => import("./pages/Package"), { fallback: <LoadingScreen /> });

// admin
const AdminLogin = loadable(() => import("./pages/AdminLogin"), { fallback: <LoadingScreen /> });
const AdminChangePassword = loadable(() => import("./pages/AdminChangePassword"));
const AdminDashboard = loadable(() => import("./pages/AdminDashboard"), { fallback: <LoadingScreen /> });
const AdminLog = loadable(() => import("./pages/AdminLog"));
const AdminSearchLog = loadable(() => import("./pages/AdminSearchLog"));

const RouteWithLoader = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setIsFinishing(false);

    const finishTimeout = setTimeout(() => setIsFinishing(true), 400);
    const closeTimeout = setTimeout(() => setIsLoading(false), 1000);

    return () => {
      clearTimeout(finishTimeout);
      clearTimeout(closeTimeout);
    };
  }, [location.pathname]);

  return (
    <>
      {isLoading && <LoadingScreen isFinishing={isFinishing} />}
      {children}
    </>
  );
};

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <div className="app">
          <RouteWithLoader>
            <Routes>
              <Route path="*" element={
                <NotFound
                  title="ไม่พบหน้าที่คุณต้องการ"
                  message="เนื้อหาหน้านี้อาจจะจบลงไปแล้ว หรือ URL ที่คุณเข้าถึงไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง"
                />
              } />
              <Route path="/" element={<Shop />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/load" element={<Load />} />
              <Route path="/package" element={<Package />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin-log" element={<AdminLog />} />
              <Route path="/admin-search-log" element={<AdminSearchLog />} />
              <Route path="/admin-change-password" element={<AdminChangePassword />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Routes>
          </RouteWithLoader>
        </div>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;