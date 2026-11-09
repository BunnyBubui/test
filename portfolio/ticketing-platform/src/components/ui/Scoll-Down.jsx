import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToDown() {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollToBottom = () => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    };

    const timeout = setTimeout(scrollToBottom, 500);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}
