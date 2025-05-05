import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { config } from "../../config";

export default function RedirectShortUrl() {
  const { shortCode } = useParams();

  useEffect(() => {
    window.location.href = `${config.backendUrl}/shorturl/${shortCode}`;
  }, [shortCode]);

  return <p>Redirecting...</p>;
}
