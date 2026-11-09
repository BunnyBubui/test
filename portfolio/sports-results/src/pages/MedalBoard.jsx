import { HelmetProvider, Helmet } from "react-helmet-async";
import MedalBoard from "../routers/MedalBoard";
import ScrollToTop from "../scripts/Scoll-Up";
function Index() {
  return (
    <HelmetProvider>
      <ScrollToTop />
      <Helmet>
        <title>PRADU GAME - Medals</title>
      </Helmet>
      <MedalBoard />
    </HelmetProvider>
  );
}

export default Index;
