import { HelmetProvider, Helmet } from "react-helmet-async";
import AdminLogin from "../views/AdminLogin";
import ScrollToTop from "../components/ui/Scoll-Up";
function Index() {
  return (
    <>
      <ScrollToTop />
      <Helmet>
        <title>Admin Login</title>
      </Helmet>
      <AdminLogin />
    </>
  );
}

export default Index;
