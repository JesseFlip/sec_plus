import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          "app_title": "Security+ Sprint",
          "study_map": "Study Map",
          "flashcards": "Flashcards",
          "total_progress": "Total Progress",
          "topics_done": "Topics Done",
          "daily_streak": "Daily Streak",
          "ask_question": "Ask a question...",
          "daily_checkin": "Daily Check-in",
          "tap_reveal": "Tap to reveal",
          "prev": "Prev",
          "next": "Next",
          "sy0_701_prep": "SY0-701 PREP"
        }
      }
    }
  });

export default i18n;
