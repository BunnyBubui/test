import { HelmetProvider, Helmet } from "react-helmet-async";
import UserLogin from "../routers/UserLogin";
import ScrollToTop from "../scripts/Scoll-Up";
function Index() {
  return (
    <HelmetProvider>
      <ScrollToTop />
      <Helmet>
        <title>PRADU GAME - Login</title>
      </Helmet>
      <UserLogin />
    </HelmetProvider>
  );
}

export default Index;
