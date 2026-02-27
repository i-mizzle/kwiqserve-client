import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = (props) => {
  const location = useLocation();
  
  useEffect(() => {
    // Scroll immediately
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    
    // Also scroll after a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
    }, 0);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return <>{props.children}</>
};

export default ScrollToTop;