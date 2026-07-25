import Head from "next/head";
import { useEffect } from "react";

export default function Docs() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js";
    script.onload = () => {
      // eslint-disable-next-line no-undef
      window.SwaggerUIBundle({
        url: "/api/openapi",
        dom_id: "#swagger-ui",
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <Head>
        <title>BusinessFinder API Docs</title>
        <link
          rel="stylesheet"
          href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css"
        />
      </Head>
      <div id="swagger-ui" />
    </>
  );
}
