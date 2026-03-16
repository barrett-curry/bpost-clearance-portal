import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  // In a real app, detect from cookies/headers. For demo, use localStorage via a cookie.
  const locale = "en";

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
