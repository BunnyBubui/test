import { HelmetProvider, Helmet } from "react-helmet-async";
import UserHome from "../routers/UserHome";
import ScrollToTop from "../scripts/Scoll-Up";
function Index() {
  return (
    <HelmetProvider>
      <ScrollToTop />
      <Helmet>
        <title>PRADU GAME - Home</title>
      </Helmet>
      <UserHome />
    </HelmetProvider>
  );
}

export default Index;
