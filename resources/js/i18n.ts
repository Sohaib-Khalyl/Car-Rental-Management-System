import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          nav: {
            home: 'Home',
            cars: 'Browse Cars',
            wizard: 'Smart AI',
            dashboard: 'Dashboard',
            profile: 'Profile',
          },
          hero: {
            title: 'Drive the Future',
            subtitle: 'Experience premium automotive mobility with our Al-powered rental platform.',
            search: 'Find your car',
          },
        },
      },
      fr: {
        translation: {
          nav: {
            home: 'Accueil',
            cars: 'Parcourir',
            wizard: 'IA Intelligente',
            dashboard: 'Tableau de bord',
            profile: 'Profil',
          },
          hero: {
            title: 'Conduisez le futur',
            subtitle: 'Découvrez la mobilité automobile premium avec notre plateforme de location propulsée par l\'IA.',
            search: 'Trouver votre voiture',
          },
        },
      },
      ar: {
        translation: {
          nav: {
            home: 'الرئيسية',
            cars: 'تصفح السيارات',
            wizard: 'الذكاء الاصطناعي',
            dashboard: 'لوحة التحكم',
            profile: 'الملف الشخصي',
          },
          hero: {
            title: 'قد المستقبل',
            subtitle: 'اختبر التنقل المتميز مع منصتنا لتأجير السيارات المدعومة بالذكاء الاصطناعي.',
            search: 'ابحث عن سيارتك',
          },
        },
      },
    },
  });

export default i18n;
