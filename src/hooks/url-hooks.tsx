import { useEffect, useState } from "react";

export const useUrlHooks = () => {
  const [mounted, setMounted] = useState(false);

  const url =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return "";
  }

  return url;
};
