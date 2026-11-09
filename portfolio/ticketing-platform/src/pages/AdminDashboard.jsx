import { HelmetProvider, Helmet } from "react-helmet-async";
import AdminDashboard from "../views/AdminDashboard";
import Footerbox from "../components/construct/Footer";
import ScrollToTop from "../components/ui/Scoll-Up";
function Index() {
  return (
    <>
      <ScrollToTop />
      <Helmet>
        <title>Admin Dashboard</title>
      </Helmet>
      <AdminDashboard />
      <Footerbox />
    </>
  );
}

export default Index;
