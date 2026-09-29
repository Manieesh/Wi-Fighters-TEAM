import { en } from "./en.js";
import { ta } from "./ta.js";
import { hi } from "./hi.js";

export const translations = { en, ta, hi };

export const getTranslation = (lang, path, fallback = "") => {
  if (!path || typeof path !== "string") return fallback || "";

  const dict = translations[lang] || translations.en;
  const parts = path.split(".");

  let cur = dict;
  let found = true;

  for (const part of parts) {
    if (cur && typeof cur === "object" && cur[part] !== undefined) {
      cur = cur[part];
    } else {
      found = false;
      break;
    }
  }

  if (found && (typeof cur === "string" || typeof cur === "number")) {
    return String(cur);
  }

  // Fallback safely to English
  let enCur = translations.en;
  let enFound = true;
  for (const enPart of parts) {
    if (enCur && typeof enCur === "object" && enCur[enPart] !== undefined) {
      enCur = enCur[enPart];
    } else {
      enFound = false;
      break;
    }
  }

  if (enFound && (typeof enCur === "string" || typeof enCur === "number")) {
    return String(enCur);
  }

  if (fallback) return fallback;
  const lastPart = parts[parts.length - 1];
  return lastPart ? lastPart.charAt(0).toUpperCase() + lastPart.slice(1) : path;
};

export default translations;
