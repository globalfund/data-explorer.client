import React from "react";
import Box from "@mui/material/Box";

const AnimateInViewContext = React.createContext<boolean | null>(null);

export const useAnimateInView = () => {
  const value = React.useContext(AnimateInViewContext);
  return { inView: value ?? true, enabled: value !== null };
};

export const chartAnimationOptions = (reducedMotion: boolean) => ({
  animation: !reducedMotion,
  animationDuration: 2000,
  animationEasing: "cubicOut" as const,
  animationDelay: (idx: number) => 200 + idx * 60,
  animationDurationUpdate: 1000,
  animationEasingUpdate: "cubicOut" as const,
});

export const AnimateInView: React.FC<React.PropsWithChildren> = (props) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -30% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Box ref={ref}>
      <AnimateInViewContext.Provider value={visible}>
        {props.children}
      </AnimateInViewContext.Provider>
    </Box>
  );
};
