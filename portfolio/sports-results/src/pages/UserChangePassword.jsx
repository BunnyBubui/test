import { HelmetProvider, Helmet } from "react-helmet-async";
import UserChangePassword from "../routers/UserChangePassword";
import ScrollToTop from "../scripts/Scoll-Up";
function Index() {
  return (
    <HelmetProvider>
      <ScrollToTop />
      <Helmet>
        <title>PRADU GAME - Password Reset</title>
      </Helmet>
      <UserChangePassword />
    </HelmetProvider>
  );
}

export default Index;
