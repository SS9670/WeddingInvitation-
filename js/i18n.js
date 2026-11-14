/* English / Hindi switching.
 * - UI: fixed interface text, keyed by name (HTML uses data-i18n="key").
 * - tx(): picks the current language from a { en, hi } value in data.js.
 * Choice is remembered per browser and can be forced with ?lang=hi. */
window.I18N = (() => {
  const UI = {
    en: {
      navHome: "Home", navCouple: "The Couple", navEvents: "Ceremonies", navFamily: "Family", navVenue: "Venue",
      invited: "You are invited", weddingOf: "The wedding of", open: "Open Invitation", skip: "Skip to invitation",
      amp: "&", unionOf: "The auspicious union of", groom: "The Groom", bride: "The Bride",
      joinUs: "Join us for", celebrations: "The Ceremonies", eventsSub: "Four auspicious days, one beautiful beginning.",
      withBlessings: "With the blessings of our elders", familyTitle: "Our Family", vineetLbl: "With humble regards",
      welcomeLbl: "Eagerly awaiting to welcome you", awaitingLbl: "Longing to see you", hostsLbl: "Invited by",
      call: "Call", whenLbl: "When",
      time: "Time", venue: "Venue", dress: "Dress code", directions: "Get directions",
      findWay: "Finding your way", venueTitle: "Venue", getDirections: "Get Directions", north: "N", east: "E",
      days: "days", hours: "hours", minutes: "minutes", seconds: "seconds",
      today: "Today, we say forever — welcome to our wedding day", after: "Thank you for celebrating with us",
      share: "Share on WhatsApp", shareText: "You're invited to the wedding of",
      playMusic: "Play music", play: "Play background music", pause: "Pause background music",
      switchTo: "हिन्दी में देखें", title: "Wedding Invitation",
    },
    hi: {
      navHome: "मुख्य पृष्ठ", navCouple: "वधू-वर", navEvents: "कार्यक्रम", navFamily: "परिवार", navVenue: "विवाह स्थल",
      invited: "आप सादर आमंत्रित हैं", weddingOf: "शुभ विवाह", open: "निमंत्रण खोलें", skip: "सीधे निमंत्रण देखें",
      amp: "संग", unionOf: "मंगल परिणय", groom: "वर", bride: "वधू",
      joinUs: "आप सादर आमंत्रित हैं", celebrations: "मांगलिक कार्यक्रम", eventsSub: "चार मंगल दिन, एक सुंदर शुरुआत।",
      withBlessings: "बड़ों के आशीर्वाद से", familyTitle: "हमारा परिवार", vineetLbl: "विनीत",
      welcomeLbl: "स्वागताकांक्षी", awaitingLbl: "दर्शनाभिलाषी", hostsLbl: "निमंत्रक",
      call: "कॉल करें", whenLbl: "समय",
      time: "समय", venue: "स्थान", dress: "परिधान", directions: "रास्ता देखें",
      findWay: "हम तक पहुँचें", venueTitle: "स्थान", getDirections: "रास्ता देखें", north: "उ.", east: "पू.",
      days: "दिन", hours: "घंटे", minutes: "मिनट", seconds: "सेकंड",
      today: "आज वह शुभ दिन है — हमारे विवाह में आपका हार्दिक स्वागत है", after: "हमारे उत्सव में शामिल होने के लिए हृदय से आभार",
      share: "व्हाट्सऐप पर साझा करें", shareText: "आप सादर आमंत्रित हैं —",
      playMusic: "संगीत चलाएँ", play: "पृष्ठभूमि संगीत चलाएँ", pause: "पृष्ठभूमि संगीत रोकें",
      switchTo: "View in English", title: "विवाह निमंत्रण",
    },
  };

  // Hindi first: the printed card is entirely in Hindi. Guests can switch to English.
  let lang = "hi";
  try {
    const q = new URLSearchParams(location.search).get("lang");
    lang = q === "hi" || q === "en" ? q : localStorage.getItem("invite-lang") || "hi";
  } catch (_) {}
  if (!UI[lang]) lang = "hi";

  const t = (key) => UI[lang][key] ?? UI.en[key] ?? key;
  const tx = (v) => (v && typeof v === "object" && !Array.isArray(v) ? v[lang] ?? v.en : v);
  const locale = () => (lang === "hi" ? "hi-IN-u-nu-deva" : "en-IN");
  const num = (n, digits = 1) => new Intl.NumberFormat(locale(), { minimumIntegerDigits: digits, useGrouping: false }).format(n);

  function applyStatic() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((n) => { n.textContent = t(n.dataset.i18n); });
    document.querySelectorAll(".lang").forEach((b) => {
      b.setAttribute("aria-checked", lang === "hi");
      b.setAttribute("aria-label", t("switchTo"));
    });
  }

  function set(next) {
    if (next === lang || !UI[next]) return;
    lang = next;
    try { localStorage.setItem("invite-lang", lang); } catch (_) {}
    applyStatic();
    document.dispatchEvent(new Event("lang:change"));
  }

  return { t, tx, num, locale, set, applyStatic, get lang() { return lang; } };
})();
