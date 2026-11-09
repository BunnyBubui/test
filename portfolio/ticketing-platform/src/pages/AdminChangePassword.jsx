import { HelmetProvider, Helmet } from "react-helmet-async";
import AdminChangePassword from "../views/AdminChangePassword";
import ScrollToTop from "../components/ui/Scoll-Up";
function Index() {
  return (
    <>
      <ScrollToTop />
      <Helmet>
        <title>Password Reset</title>
      </Helmet>
      <AdminChangePassword />
    </>
  );
}

export default Index;
