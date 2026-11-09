import { HelmetProvider, Helmet } from "react-helmet-async";
import MatchResult from "../routers/MatchResults";
import ScrollToTop from "../scripts/Scoll-Up";
function Index() {
  return (
    <HelmetProvider>
      <ScrollToTop />
      <Helmet>
        <title>PRADU GAME - Results</title>
      </Helmet>
      <MatchResult />
    </HelmetProvider>
  );
}

export default Index;
