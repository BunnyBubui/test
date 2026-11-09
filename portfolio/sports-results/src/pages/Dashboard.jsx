import { HelmetProvider, Helmet } from "react-helmet-async";
import Dashboard from "../routers/Dashboard";
import ScrollToTop from "../scripts/Scoll-Up";
function Index() {
  return (
    <HelmetProvider>
      <ScrollToTop />
      <Helmet>
        <title>PRADU GAME - Dashboard</title>
      </Helmet>
      <Dashboard />
    </HelmetProvider>
  );
}

export default Index;
