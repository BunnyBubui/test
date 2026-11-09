import { HelmetProvider, Helmet } from "react-helmet-async";
import AdminSearchHistory from "../components/render/AdminSearchHistory";
import Footerbox from "../components/construct/Footer";
import ScrollToTop from "../components/ui/Scoll-Up";
function Index() {
  return (
    <>
      <ScrollToTop />
      <Helmet>
        <title>Admin Search Logs</title>
      </Helmet>
      <AdminSearchHistory />
      <Footerbox />
    </>
  );
}

export default Index;
