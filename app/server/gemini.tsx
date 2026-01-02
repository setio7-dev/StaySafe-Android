import { GoogleGenAI } from "@google/genai";
import { useEffect, useState } from "react";

export const useGemini = () => {
  const [gemini, setGemini] = useState<GoogleGenAI | null>(null);

  useEffect(() => {
    const init = async () => {
      const res = await fetch("https://serverkey.setionugraha.my.id/2");
      const data = await res.json();

      const ai = new GoogleGenAI({
        apiKey: data.key,
      });

      setGemini(ai);
    };

    init();
  }, []);

  return gemini;
};