import { HelmetProvider, Helmet } from "react-helmet-async";
import Matches from "../routers/Matches";
import ScrollToTop from "../scripts/Scoll-Up";
function Index() {
  return (
    <HelmetProvider>
      <ScrollToTop />
      <Helmet>
        <title>PRADU GAME - Match</title>
      </Helmet>
      <Matches />
    </HelmetProvider>
  );
}

export default Index;
