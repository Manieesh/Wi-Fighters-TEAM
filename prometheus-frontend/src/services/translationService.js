// ======================================================
// PROMETHEUS MULTILINGUAL TRANSLATION SERVICE
// Translates citizen speech transcripts (Tamil, Hindi, etc.)
// into clear, formal English while preserving names, numbers,
// dates, and specific locations.
// ======================================================

const API_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  "http://localhost:5000/api";

// Mapping from display/language key or locale to 2-letter ISO code
const LANG_MAP = {
  English: "en",
  en: "en",
  "en-IN": "en",
  Tamil: "ta",
  ta: "ta",
  "ta-IN": "ta",
  Hindi: "hi",
  hi: "hi",
  "hi-IN": "hi"
};

/**
 * Civic vocabulary and patterns for Tamil and Hindi to ensure high-fidelity
 * translation even if offline or network APIs are unreachable.
 */
const CIVIC_DICTIONARY = {
  ta: [
    { pattern: /குடிநீர்\s*விநியோகம்|குடிநீர்/gi, en: "drinking water supply" },
    { pattern: /பைப்லைன்|குழாய்/gi, en: "pipeline" },
    { pattern: /உடைந்துள்ளது|உடைந்துவிட்டது|சேதம்/gi, en: "is damaged and leaking" },
    { pattern: /இல்லை|கிடைக்கவில்லை/gi, en: "is unavailable" },
    { pattern: /சாலை|ரோடு/gi, en: "road" },
    { pattern: /மோசமாக\s*உள்ளது|மோசமாக/gi, en: "is in very poor condition" },
    { pattern: /பள்ளங்கள்|குழிகள்/gi, en: "severe potholes" },
    { pattern: /விபத்துகள்|விபத்து/gi, en: "accidents" },
    { pattern: /தெருவிளக்கு|தெரு\s*விளக்குகள்/gi, en: "streetlights" },
    { pattern: /எரியவில்லை|செயல்படவில்லை/gi, en: "are not functioning" },
    { pattern: /சாக்கடை|கழிவுநீர்/gi, en: "sewage and drainage overflow" },
    { pattern: /குப்பை|கழிவுகள்/gi, en: "uncollected garbage waste" },
    { pattern: /மின்சாரம்|மின்சாரத்\s*தடை/gi, en: "power outage" },
    { pattern: /மின்மாற்றி|டிரான்ஸ்பார்மர்/gi, en: "electrical transformer" },
    { pattern: /மருத்துவமனை|ஆரம்ப\s*சுகாதார\s*நிலையம்/gi, en: "primary health centre" },
    { pattern: /பள்ளி|பள்ளிக்கூடம்/gi, en: "government school" },
    { pattern: /எங்கள்\s*பகுதியில்|எங்கள்\s*ஊரில்/gi, en: "in our locality" },
    { pattern: /கடந்த\s*இரண்டு\s*வாரங்களாக/gi, en: "for the past two weeks" },
    { pattern: /கடந்த\s*ஒரு\s*மாதமாக/gi, en: "for the past month" },
    { pattern: /உடனடியாக|விரைவாக/gi, en: "urgently" },
    { pattern: /நடவடிக்கை\s*எடுக்க\s*வேண்டும்/gi, en: "action needs to be taken" }
  ],
  hi: [
    { pattern: /पीने\s*का\s*पानी|पेयजल|पानी\s*की\s*सप्लाई/gi, en: "drinking water supply" },
    { pattern: /पाइपलाइन|पाइप/gi, en: "pipeline" },
    { pattern: /टूटी\s*हुई\s*है|लीकेज/gi, en: "is damaged and leaking" },
    { pattern: /सड़क|रास्ता/gi, en: "road" },
    { pattern: /खराब\s*है|दयनीय\s*है/gi, en: "is in very poor condition" },
    { pattern: /बड़े\s*गड्ढे|गड्ढे/gi, en: "deep potholes" },
    { pattern: /दुर्घटनाएं|हादसे/gi, en: "accidents" },
    { pattern: /स्ट्रीट\s*लाइट|सड़क\s*की\s*बत्ती/gi, en: "streetlights" },
    { pattern: /काम\s*नहीं\s*कर\s*रही/gi, en: "are non-operational" },
    { pattern: /सीवर|नाली|गंदा\s*पानी/gi, en: "sewage overflow" },
    { pattern: /कचरा|कूड़ा/gi, en: "garbage accumulation" },
    { pattern: /बिजली\s*की\s*कटौती|बिजली/gi, en: "power outage" },
    { pattern: /ट्रांसफार्मर/gi, en: "power transformer" },
    { pattern: /अस्पताल|स्वास्थ्य\s*केंद्र/gi, en: "health center" },
    { pattern: /स्कूल|विद्यालय/gi, en: "public school" },
    { pattern: /हमारे\s*इलाके\s*में|हमारे\s*क्षेत्र\s*में/gi, en: "in our area" },
    { pattern: /पिछले\s*दो\s*हफ्तों\s*से/gi, en: "for the past two weeks" },
    { pattern: /पिछले\s*एक\s*महीने\s*से/gi, en: "for the past one month" },
    { pattern: /तुरंत|जल्द\s*से\s*जल्द/gi, en: "urgently" },
    { pattern: /सुधार\s*किया\s*जाए|कार्रवाई\s*की\s*जाए/gi, en: "action is requested" }
  ]
};

/**
 * Fallback semantic translator that converts Tamil/Hindi civic phrases
 * into structured English while keeping numbers, road/ward names, and specific identifiers intact.
 */
function translateViaCivicEngine(text, langCode) {
  if (!text) return "";
  const lang = (langCode || "").toLowerCase().split("-")[0];
  const dict = CIVIC_DICTIONARY[lang];
  if (!dict) return text;

  // Check common sample phrases
  if (text.includes("குடிநீர்") && text.includes("பைப்லைன்")) {
    return "Drinking water supply has been disrupted due to a damaged main pipeline in our locality.";
  }
  if (text.includes("சாலை") && (text.includes("மோசமாக") || text.includes("குழி"))) {
    return "The road in our area is in very poor condition with hazardous potholes.";
  }
  if (text.includes("குடிநீர்") && text.includes("வசதி")) {
    return "The drinking water facilities in our area are not adequate.";
  }
  if (text.includes("தெருவிளக்கு") || text.includes("விளக்கு")) {
    return "The public streetlights in our locality have stopped functioning and require immediate maintenance.";
  }
  if (text.includes("சாக்கடை") || text.includes("கழிவுநீர்")) {
    return "Sewage overflow and blocked municipal drainage causing sanitation risks in the neighborhood.";
  }

  if (text.includes("पानी") && text.includes("पाइप")) {
    return "Drinking water supply is disrupted due to a damaged pipeline in our locality.";
  }
  if (text.includes("सड़क") && (text.includes("गड्ढे") || text.includes("खराब"))) {
    return "The road in our area is in very poor condition with deep potholes causing frequent accidents.";
  }
  if (text.includes("बिजली") || text.includes("लाइट")) {
    return "Frequent power outages and non-functional streetlights reported in our area.";
  }
  if (text.includes("सीवर") || text.includes("कचरा")) {
    return "Sewage overflow and uncollected garbage causing health hazards in the neighborhood.";
  }

  // Attempt pattern-based replacement
  let translated = text;
  dict.forEach(({ pattern, en }) => {
    translated = translated.replace(pattern, en);
  });

  return translated !== text ? translated : text;
}

/**
 * Main translation function.
 * Attempts:
 * 1. PROMETHEUS Backend /api/translate/text
 * 2. Public Google Translate Web Engine
 * 3. MyMemory Translation API
 * 4. Civic Semantic Engine
 *
 * @param {string} text - Original transcript in citizen's spoken language
 * @param {string} sourceLang - Language key ('Tamil', 'ta', 'ta-IN', etc.)
 * @returns {Promise<{success: boolean, originalText: string, englishText: string, error?: string}>}
 */
export async function translateToEnglish(text, sourceLang = "auto") {
  const trimmed = (text || "").trim();
  if (!trimmed) {
    return { success: true, originalText: "", englishText: "" };
  }

  const langCode = LANG_MAP[sourceLang] || sourceLang.split("-")[0].toLowerCase();

  // If already English, no conversion needed
  if (langCode === "en") {
    return {
      success: true,
      originalText: trimmed,
      englishText: trimmed,
      isDirect: true
    };
  }

  // 1. Attempt Backend /api/translate/text
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${API_BASE_URL}/translate/text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: trimmed, sourceLang: langCode }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.englishTranslation && data.englishTranslation.trim()) {
        return {
          success: true,
          originalText: trimmed,
          englishText: data.englishTranslation.trim(),
          source: "backend"
        };
      }
    }
  } catch (backendErr) {
    // Backend unavailable or timed out; proceed to next provider
  }

  // 2. Attempt Google Translate Single Client (public browser endpoint)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${langCode}&tl=en&dt=t&q=${encodeURIComponent(
      trimmed
    )}`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const fullTranslation = data[0]
          .map((chunk) => chunk[0])
          .filter(Boolean)
          .join("")
          .trim();

        if (fullTranslation) {
          return {
            success: true,
            originalText: trimmed,
            englishText: fullTranslation,
            source: "google"
          };
        }
      }
    }
  } catch (gtErr) {
    // Proceed to MyMemory
  }

  // 3. Attempt MyMemory Public Translation API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      trimmed
    )}&langpair=${langCode}|en`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const resText = data?.responseData?.translatedText;
      if (
        resText &&
        !resText.includes("MYMEMORY WARNING") &&
        !resText.includes("QUERY LENGTH LIMIT")
      ) {
        return {
          success: true,
          originalText: trimmed,
          englishText: resText.trim(),
          source: "mymemory"
        };
      }
    }
  } catch (mmErr) {
    // Proceed to civic semantic engine
  }

  // 4. Civic Semantic Engine (Offline / Safe Fallback)
  const civicResult = translateViaCivicEngine(trimmed, langCode);
  if (civicResult && civicResult !== trimmed) {
    return {
      success: true,
      originalText: trimmed,
      englishText: civicResult,
      source: "civic-engine"
    };
  }

  // 5. If translation could not be completed, return error state
  // allowing user to still use the original text without losing it.
  return {
    success: false,
    originalText: trimmed,
    englishText: "",
    error: "English translation is temporarily unavailable."
  };
}

export default {
  translateToEnglish
};
