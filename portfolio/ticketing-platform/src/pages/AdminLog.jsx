import { HelmetProvider, Helmet } from "react-helmet-async";
import AdminLogsPage from "../components/render/AdminLog";
import Footerbox from "../components/construct/Footer";
import ScrollToTop from "../components/ui/Scoll-Up";
function Index() {
  return (
    <>
      <ScrollToTop />
      <Helmet>
        <title>Admin Logs</title>
      </Helmet>
      <AdminLogsPage />
      <Footerbox />
    </>
  );
}

export default Index;
