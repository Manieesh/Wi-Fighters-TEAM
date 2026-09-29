import { useState, useRef, useEffect, useCallback } from "react";
import UiIcon from "./UiIcon";
import { translateToEnglish } from "../services/translationService";

// Supported Voice Input Languages (Independent from UI language)
const VOICE_LANGUAGES = [
  { code: "en-IN", id: "en", key: "English", label: "English", native: "English" },
  { code: "ta-IN", id: "ta", key: "Tamil", label: "Tamil", native: "தமிழ் — Tamil" },
  { code: "hi-IN", id: "hi", key: "Hindi", label: "Hindi", native: "हिन्दी — Hindi" }
];

// Curated civic phrases for demo fallback environments
const DEMO_SPEECH_DATA = {
  Tamil: {
    transcript: "எங்கள் பகுதியில் சாலை மிகவும் மோசமாக உள்ளது. குடிநீர் விநியோகம் கடந்த இரண்டு வாரங்களாக இல்லை.",
    translated: "The road in our area is in very poor condition. There has been no drinking water supply for the past two weeks."
  },
  Hindi: {
    transcript: "हमारे इलाके में मुख्य सड़क पर बड़े गड्ढे हैं और पीने के पानी की समस्या गंभीर है।",
    translated: "There are large potholes on the main road in our area and the drinking water problem is severe."
  },
  English: {
    transcript: "The municipal streetlights on 4th cross road have not been working for the past three weeks.",
    translated: "The municipal streetlights on 4th cross road have not been working for the past three weeks."
  }
};

export default function VoiceInput({
  language: initialLanguage = "Tamil",
  onTranscript,
  onApplyTranscript,
  t
}) {
  // Voice states: 'idle' | 'listening' | 'processing' | 'translated' | 'error' | 'unsupported'
  const [voiceState, setVoiceState] = useState("idle");
  const [selectedVoiceLang, setSelectedVoiceLang] = useState(() => {
    const match = VOICE_LANGUAGES.find((l) => l.key.toLowerCase() === (initialLanguage || "").toLowerCase());
    return match ? match.key : "Tamil";
  });

  const [interimText, setInterimText] = useState("");
  const [originalTranscript, setOriginalTranscript] = useState("");
  const [englishTranslation, setEnglishTranslation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditingOriginal, setIsEditingOriginal] = useState(false);
  const [isEditingEnglish, setIsEditingEnglish] = useState(false);
  const [srAnnouncement, setSrAnnouncement] = useState("");
  const [isDemoFallback, setIsDemoFallback] = useState(false);

  const recognitionRef = useRef(null);
  const speechTimeoutRef = useRef(null);
  const isStoppingManually = useRef(false);

  const currentLangObj = VOICE_LANGUAGES.find((l) => l.key === selectedVoiceLang) || VOICE_LANGUAGES[0];

  // Check browser support on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Do not hard error immediately; enable supported fallback if user clicks
    }
  }, []);

  // Announce state changes to screen readers
  const announceToScreenReader = (msg) => {
    setSrAnnouncement(msg);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
    };
  }, []);

  // When speech recognition ends and we need to translate
  const processAndTranslate = async (rawText) => {
    const textToProcess = (rawText || "").trim();

    if (!textToProcess) {
      setVoiceState("error");
      setErrorMessage(
        t?.("voice.noSpeech") || "No speech was detected. Please try again."
      );
      announceToScreenReader("No speech was detected. Please try again.");
      return;
    }

    setOriginalTranscript(textToProcess);
    setVoiceState("processing");
    announceToScreenReader("Converting your request to English...");

    try {
      const res = await translateToEnglish(textToProcess, selectedVoiceLang);
      if (res.success && res.englishText) {
        setEnglishTranslation(res.englishText);
        setVoiceState("translated");
        announceToScreenReader("English translation is ready.");
        if (onTranscript) {
          onTranscript(textToProcess, res.englishText, selectedVoiceLang);
        }
      } else {
        // Translation failed but preserve original transcript
        setEnglishTranslation("");
        setVoiceState("error");
        setErrorMessage(
          res.error || "English translation is temporarily unavailable."
        );
        announceToScreenReader("English translation is temporarily unavailable.");
        if (onTranscript) {
          onTranscript(textToProcess, "", selectedVoiceLang);
        }
      }
    } catch (err) {
      setVoiceState("error");
      setErrorMessage("English translation is temporarily unavailable.");
      announceToScreenReader("English translation is temporarily unavailable.");
    }
  };

  // Stop Recording Handler
  const handleStopSpeaking = useCallback(() => {
    isStoppingManually.current = true;
    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);

    announceToScreenReader("Voice recognition stopped.");

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        processAndTranslate(interimText || originalTranscript);
      }
    } else {
      processAndTranslate(interimText || originalTranscript);
    }
  }, [interimText, originalTranscript, selectedVoiceLang]);

  // Start Recording Handler
  const handleStartSpeaking = () => {
    setErrorMessage("");
    setInterimText("");
    setIsDemoFallback(false);
    setIsEditingOriginal(false);
    setIsEditingEnglish(false);
    isStoppingManually.current = false;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Simulate live speech recognition for unsupported browsers/environments
      setIsDemoFallback(true);
      setVoiceState("listening");
      announceToScreenReader("Voice recognition started.");

      const demo = DEMO_SPEECH_DATA[selectedVoiceLang] || DEMO_SPEECH_DATA.English;
      const words = demo.transcript.split(" ");
      let currentIdx = 0;
      let streamed = "";

      const interval = setInterval(() => {
        if (currentIdx < words.length) {
          streamed += (streamed ? " " : "") + words[currentIdx];
          setInterimText(streamed);
          currentIdx++;
        } else {
          clearInterval(interval);
        }
      }, 260);

      speechTimeoutRef.current = setTimeout(() => {
        clearInterval(interval);
        handleStopSpeaking();
      }, 4200);

      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = currentLangObj.code; // Pass selected locale: en-IN, ta-IN, hi-IN
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      let speechAccumulated = "";

      recognition.onstart = () => {
        setVoiceState("listening");
        announceToScreenReader("Voice recognition started.");
      };

      recognition.onresult = (event) => {
        let interim = "";
        let finalChunk = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalChunk += item[0].transcript;
          } else {
            interim += item[0].transcript;
          }
        }

        if (finalChunk) {
          speechAccumulated += (speechAccumulated ? " " : "") + finalChunk;
        }

        const displayText = speechAccumulated + (interim ? (speechAccumulated ? " " : "") + interim : "");
        setInterimText(displayText);
      };

      recognition.onerror = (event) => {
        if (isStoppingManually.current) return;

        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setVoiceState("error");
          setErrorMessage("Microphone access is required for voice input. You can allow microphone access in your browser settings or type your request instead.");
        } else if (event.error === "no-speech") {
          setVoiceState("error");
          setErrorMessage("No speech was detected. Please try again.");
        } else if (event.error === "network") {
          // Fallback gracefully on network error
          setIsDemoFallback(true);
          const demo = DEMO_SPEECH_DATA[selectedVoiceLang] || DEMO_SPEECH_DATA.English;
          processAndTranslate(demo.transcript);
        } else {
          setVoiceState("error");
          setErrorMessage("Voice recognition error occurred. Please try speaking again or type your request.");
        }
      };

      recognition.onend = () => {
        if (isStoppingManually.current || voiceState === "processing") {
          processAndTranslate(interimText || speechAccumulated || originalTranscript);
        } else if (voiceState === "listening") {
          if (speechAccumulated || interimText) {
            processAndTranslate(speechAccumulated || interimText);
          } else {
            setVoiceState("idle");
          }
        }
      };

      recognition.start();
    } catch (err) {
      // In case of permission or invocation error, provide simulated assist
      setIsDemoFallback(true);
      const demo = DEMO_SPEECH_DATA[selectedVoiceLang] || DEMO_SPEECH_DATA.English;
      processAndTranslate(demo.transcript);
    }
  };

  const handleReset = () => {
    setVoiceState("idle");
    setInterimText("");
    setOriginalTranscript("");
    setEnglishTranslation("");
    setErrorMessage("");
    setIsEditingOriginal(false);
    setIsEditingEnglish(false);
    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }
  };

  // User chooses "Use English Version"
  const handleApplyEnglish = () => {
    const textToApply = englishTranslation || originalTranscript;
    if (!textToApply) return;
    if (onApplyTranscript) {
      onApplyTranscript(textToApply, "English", {
        originalTranscript,
        englishTranslation,
        selectedVoiceLang,
        choice: "english"
      });
    }
  };

  // User chooses "Use Original Version"
  const handleApplyOriginal = () => {
    const textToApply = originalTranscript;
    if (!textToApply) return;
    if (onApplyTranscript) {
      onApplyTranscript(textToApply, selectedVoiceLang, {
        originalTranscript,
        englishTranslation,
        selectedVoiceLang,
        choice: "original"
      });
    }
  };

  return (
    <div className="voice-input-card-formal" role="region" aria-label="Speak your request">
      {/* Hidden screen reader live region for status announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {srAnnouncement}
      </div>

      {/* 1. Header Bar: Speak your request + Dedicated Voice Language Selector */}
      <div className="voice-card-header">
        <div className="voice-header-main">
          <div className="voice-eyebrow-row">
            <span className="voice-official-chip">
              <UiIcon name="mic" size={13} />
              <span>MULTILINGUAL VOICE RECOGNITION</span>
            </span>
            <span className="voice-lang-supported-pills">
              <span>English</span> • <span>தமிழ்</span> • <span>हिन्दी</span>
            </span>
          </div>
          <h3 className="voice-title">Speak your request</h3>
          <p className="voice-subtitle">
            Choose your preferred language and describe the problem naturally.
          </p>
        </div>

        {/* Dedicated Voice Language Selector (Completely decoupled from UI language) */}
        <div className="voice-language-picker">
          <label htmlFor="voice-speech-lang-select" className="voice-picker-label">
            <UiIcon name="globe" size={14} />
            <span>Voice Language:</span>
          </label>
          <div className="select-wrapper">
            <select
              id="voice-speech-lang-select"
              className="voice-lang-select"
              value={selectedVoiceLang}
              onChange={(e) => {
                const newLang = e.target.value;
                setSelectedVoiceLang(newLang);
                if (voiceState === "translated" || voiceState === "error") {
                  setVoiceState("idle");
                  setOriginalTranscript("");
                  setEnglishTranslation("");
                }
              }}
              disabled={voiceState === "listening" || voiceState === "processing"}
            >
              {VOICE_LANGUAGES.map((lang) => (
                <option key={lang.key} value={lang.key}>
                  {lang.native}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Controls Section with SEPARATE Start Speaking and Stop buttons */}
      <div className="voice-controls-panel">
        <div className="voice-action-buttons-group">
          {/* Button 1: START SPEAKING */}
          <button
            type="button"
            className={`voice-gov-btn start-speaking-btn ${voiceState === "listening" ? "is-active" : ""}`}
            onClick={handleStartSpeaking}
            disabled={voiceState === "listening" || voiceState === "processing"}
            aria-label="Start Speaking"
          >
            <span className="btn-icon-wrap">
              <UiIcon name="mic" size={18} />
            </span>
            <span className="btn-label-text">
              {voiceState === "listening" ? "Listening..." : "Start Speaking"}
            </span>
          </button>

          {/* Button 2: STOP */}
          <button
            type="button"
            className={`voice-gov-btn stop-speaking-btn ${voiceState === "listening" ? "can-stop" : ""}`}
            onClick={handleStopSpeaking}
            disabled={voiceState !== "listening"}
            aria-label="Stop"
          >
            <span className="btn-icon-wrap">
              <UiIcon name="stop" size={17} />
            </span>
            <span className="btn-label-text">Stop</span>
          </button>

          {/* Reset button when done or on error */}
          {(voiceState === "translated" || voiceState === "error" || originalTranscript) && (
            <button
              type="button"
              className="voice-clear-btn"
              onClick={handleReset}
              aria-label="Clear Voice Input"
            >
              <UiIcon name="close" size={14} />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* State Indicators & Feedback */}
        <div className="voice-status-feedback">
          {voiceState === "idle" && (
            <div className="voice-state-msg idle-msg">
              <UiIcon name="mic" size={16} className="state-icon" />
              <span>Click <strong>Start Speaking</strong> and talk naturally in {selectedVoiceLang}.</span>
            </div>
          )}

          {voiceState === "listening" && (
            <div className="voice-state-msg listening-msg">
              {/* Subtle 5-bar Waveform Animation */}
              <div className="subtle-waveform" aria-hidden="true">
                <span className="wave-bar bar-1" />
                <span className="wave-bar bar-2" />
                <span className="wave-bar bar-3" />
                <span className="wave-bar bar-4" />
                <span className="wave-bar bar-5" />
              </div>
              <div className="listening-text-block">
                <strong>Listening in {selectedVoiceLang}...</strong>
                <span className="sub-hint">Speak clearly. When finished, click <strong>Stop</strong>.</span>
              </div>
            </div>
          )}

          {voiceState === "processing" && (
            <div className="voice-state-msg processing-msg">
              <div className="voice-spinner" aria-hidden="true" />
              <span>Converting your request to English...</span>
            </div>
          )}

          {voiceState === "error" && (
            <div className="voice-state-msg error-msg" role="alert">
              <UiIcon name="alert" size={16} />
              <span>{errorMessage || "An error occurred. You can type your request or try again."}</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Live Interim Transcript Stream while Citizen Speaks */}
      {voiceState === "listening" && interimText && (
        <div className="voice-interim-box" aria-live="polite">
          <div className="interim-label">
            <span className="pulse-indicator" />
            <span>Live Speech ({selectedVoiceLang}):</span>
          </div>
          <p className="interim-text">"{interimText}"</p>
        </div>
      )}

      {/* 4. TRANSLATED / COMPLETED PANEL */}
      {(voiceState === "translated" || (originalTranscript && voiceState !== "listening" && voiceState !== "processing")) && (
        <div className="voice-result-container" role="region" aria-label="Speech Recognition and Translation Result">
          <div className="result-header-row">
            <div className="result-title-group">
              <UiIcon name="check" size={16} className="text-success" />
              <h4>Voice Transcription Complete</h4>
            </div>
            <span className="result-lang-badge">Language: {selectedVoiceLang}</span>
          </div>

          <div className="result-cards-split">
            {/* Box 1: Original Request — [Language] */}
            <div className="result-card citizen-words-card">
              <div className="card-micro-label">
                <span>ORIGINAL REQUEST — {selectedVoiceLang.toUpperCase()}</span>
                <button
                  type="button"
                  className="btn-edit-inline"
                  onClick={() => setIsEditingOriginal(!isEditingOriginal)}
                  aria-label="Edit original text"
                >
                  {isEditingOriginal ? "Done" : "Edit"}
                </button>
              </div>
              {isEditingOriginal ? (
                <textarea
                  className="inline-edit-textarea"
                  rows="3"
                  value={originalTranscript}
                  onChange={(e) => setOriginalTranscript(e.target.value)}
                />
              ) : (
                <p className="transcript-body">"{originalTranscript}"</p>
              )}
            </div>

            {/* Box 2: English Version */}
            <div className="result-card english-summary-card">
              <div className="card-micro-label">
                <span>ENGLISH VERSION</span>
                {englishTranslation && (
                  <button
                    type="button"
                    className="btn-edit-inline"
                    onClick={() => setIsEditingEnglish(!isEditingEnglish)}
                    aria-label="Edit English version"
                  >
                    {isEditingEnglish ? "Done" : "Edit"}
                  </button>
                )}
              </div>
              {englishTranslation ? (
                isEditingEnglish ? (
                  <textarea
                    className="inline-edit-textarea"
                    rows="3"
                    value={englishTranslation}
                    onChange={(e) => setEnglishTranslation(e.target.value)}
                  />
                ) : (
                  <p className="translated-body">"{englishTranslation}"</p>
                )
              ) : (
                <div className="translation-unavailable-box">
                  <p className="text-warning-muted">English translation is temporarily unavailable.</p>
                  <small>You can still use the original text for submission.</small>
                </div>
              )}
            </div>
          </div>

          {/* Action CTAs: Use English Version / Use Original Version */}
          <div className="result-action-footer">
            <div className="footer-button-pair">
              {englishTranslation && (
                <button
                  type="button"
                  className="btn-use-voice-text primary"
                  onClick={handleApplyEnglish}
                >
                  <UiIcon name="document" size={15} />
                  <span>Use English Version</span>
                </button>
              )}

              <button
                type="button"
                className={`btn-use-voice-text ${englishTranslation ? "secondary" : "primary"}`}
                onClick={handleApplyOriginal}
              >
                <UiIcon name="check" size={15} />
                <span>{englishTranslation ? "Use Original Version" : "Use Original Text"}</span>
              </button>
            </div>

            <span className="auto-fill-hint">
              Inserts the selected version directly into the Problem Description field.
            </span>
          </div>
        </div>
      )}

      {/* Fallback Simulation Notice if Speech API is unavailable in browser */}
      {isDemoFallback && (
        <div className="demo-speech-note">
          <UiIcon name="shield" size={13} />
          <span>Microphone simulation active for environments without Web Speech API.</span>
        </div>
      )}
    </div>
  );
}
