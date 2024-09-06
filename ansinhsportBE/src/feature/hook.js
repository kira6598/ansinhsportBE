import { useEffect, useMemo, useState } from "react";
export function useMedia(query) {
  const isBrowser = typeof window !== "undefined";

  if (!isBrowser) {
    return false;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const media = useMemo(() => window.matchMedia(query), [query]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [state, setState] = useState(media.matches);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const onChangeMedia = () => {
      setState(media.matches);
    };

    if (media.addEventListener) {
      media.addEventListener("change", onChangeMedia);
    } else {
      // noinspection JSDeprecatedSymbols
      media.addListener(onChangeMedia);
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", onChangeMedia);
      } else {
        // noinspection JSDeprecatedSymbols
        media.removeListener(onChangeMedia);
      }
    };
  }, [media]);

  return state;
}
export function debounce(func, wait) {
  let timeout;

  const executedFunction = (...args) => {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };

  executedFunction.cancel = () => {
    clearTimeout(timeout);
  };

  return executedFunction;
}

// export default debounce;
