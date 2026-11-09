import { HelmetProvider, Helmet } from "react-helmet-async";
import DailyMatchResults from "../routers/DailyMatchResults";
import ScrollToTop from "../scripts/Scoll-Up";
function Index() {
  return (
    <HelmetProvider>
      <ScrollToTop />
      <Helmet>
        <title>PRADU GAME</title>
      </Helmet>
      <DailyMatchResults />
    </HelmetProvider>
  );
}

export default Index;
