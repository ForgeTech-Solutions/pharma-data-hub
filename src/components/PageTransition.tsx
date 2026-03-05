import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState<"fadeIn" | "fadeOut">("fadeIn");
  const prevLocation = useRef(location.pathname);

  useEffect(() => {
    if (prevLocation.current !== location.pathname) {
      setTransitionStage("fadeOut");
    }
  }, [location]);

  useEffect(() => {
    if (transitionStage === "fadeOut") {
      const t = setTimeout(() => {
        setDisplayChildren(children);
        setTransitionStage("fadeIn");
        prevLocation.current = location.pathname;
      }, 220);
      return () => clearTimeout(t);
    }
  }, [transitionStage, children, location.pathname]);

  return (
    <div
      style={{
        animation:
          transitionStage === "fadeIn"
            ? "pageFadeIn 0.35s cubic-bezier(0.16,1,0.3,1) both"
            : "pageFadeOut 0.22s ease-in both",
      }}
    >
      {displayChildren}
    </div>
  );
}
