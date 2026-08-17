import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const UI_TRANSLATIONS = {
  en: {
    appName: "Samvidhan Saathi",
    tagline: "Your Constitutional Companion",
    subtitle: "Democratizing constitutional literacy in India through AI-guided, scenario-based learning in your language.",
    searchPlaceholder: "Describe your situation (e.g., 'Can police arrest me without a warrant?')",
    searchBtn: "Find My Rights",
    home: "Home",
    explore: "Explore Articles",
    scenarios: "Scenarios",
    aiAssistant: "Ask AI",
    profile: "My Progress",
    modeSimple: "Simple (Class 6-10)",
    modeStudent: "Student (Class 11-Grad)",
    modeDetailed: "Detailed (Aspirants)",
    points: "Points",
    streak: "Day Streak",
    badges: "Badges Earned",
    tryScenario: "Try Scenario",
    viewSources: "Verified Sources",
    relatedArticles: "Related Articles",
    landmarkCases: "Landmark Cases",
    mythVsReality: "Myth vs Reality",
    topics: "Constitutional Pillars",
    dailyChallenge: "Daily Constitutional Scenario",
    confidence: "Confidence",
    verifiedByLaw: "Verified Constitutional Grounding",
    language: "Language",
    explanationTier: "Explanation Depth",
  },
  hi: {
    appName: "संविधान साथी",
    tagline: "आपका संवैधानिक साथी",
    subtitle: "एआई और वास्तविक परिस्थितियों पर आधारित शिक्षा द्वारा भारत के संविधान को अपनी भाषा में सरलता से समझें।",
    searchPlaceholder: "अपनी स्थिति लिखें (जैसे 'क्या पुलिस मुझे बिना वारंट के गिरफ्तार कर सकती है?')",
    searchBtn: "अधिकार जानें",
    home: "मुख्य पृष्ठ",
    explore: "अनुच्छेद देखें",
    scenarios: "परिस्थितियां",
    aiAssistant: "एआई से पूछें",
    profile: "मेरी प्रगति",
    modeSimple: "सरल (कक्षा 6-10)",
    modeStudent: "विद्यार्थी (कक्षा 11-स्नातक)",
    modeDetailed: "विस्तृत (प्रतियोगी परीक्षा)",
    points: "अंक",
    streak: "दैनिक स्ट्रीक",
    badges: "प्राप्त बैज",
    tryScenario: "परिस्थिति हल करें",
    viewSources: "सत्यापित स्रोत",
    relatedArticles: "संबंधित अनुच्छेद",
    landmarkCases: "ऐतिहासिक निर्णय",
    mythVsReality: "भ्रम बनाम सच्चाई",
    topics: "संवैधानिक स्तंभ",
    dailyChallenge: "आज की संवैधानिक चुनौती",
    confidence: "सटीकता",
    verifiedByLaw: "संवैधानिक रूप से प्रमाणित",
    language: "भाषा",
    explanationTier: "व्याख्या का स्तर",
  },
  hinglish: {
    appName: "Samvidhan Saathi",
    tagline: "Aapka Constitutional Companion",
    subtitle: "AI aur real-life scenarios ke zariye Indian Constitution ko apni language mein aasani se samjhein.",
    searchPlaceholder: "Apni problem ya situation batayein (jaise 'Kya police bina warrant arrest kar sakti hai?')",
    searchBtn: "Rights Jaanein",
    home: "Home",
    explore: "Articles Explore",
    scenarios: "Scenarios",
    aiAssistant: "Ask AI",
    profile: "My Progress",
    modeSimple: "Simple Mode",
    modeStudent: "Student Mode",
    modeDetailed: "Detailed Mode",
    points: "Points",
    streak: "Streak",
    badges: "Badges",
    tryScenario: "Try Scenario",
    viewSources: "Verified Sources",
    relatedArticles: "Related Articles",
    landmarkCases: "Landmark Cases",
    mythVsReality: "Myth vs Reality",
    topics: "Constitutional Topics",
    dailyChallenge: "Daily Scenario Challenge",
    confidence: "Confidence",
    verifiedByLaw: "Verified Constitutional Source",
    language: "Language",
    explanationTier: "Explanation Level",
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('samvidhan_lang') || 'en';
  });

  const [mode, setMode] = useState(() => {
    return localStorage.getItem('samvidhan_mode') || 'simple';
  });

  useEffect(() => {
    localStorage.setItem('samvidhan_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('samvidhan_mode', mode);
  }, [mode]);

  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, mode, setMode, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
