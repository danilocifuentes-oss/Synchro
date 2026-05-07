export default function useA11yAnnounce() {
  return {
    announce: (msg: string) => {
      if (typeof window !== "undefined" && window.__CRONISTA_ANNOUNCE) {
        window.__CRONISTA_ANNOUNCE(msg);
      } else {
        console.log("[A11Y ANNOUNCE]", msg);
      }
    },
  };
}

