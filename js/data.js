/* ------------------------------------------------------------------
 * ALL wedding content lives here. Edit this file only.
 * Source: the printed card (Vandana&Shyam.pdf). The card is bride-side,
 * so the bride is named first everywhere.
 * Text shown to guests is written as { en: "...", hi: "..." } so the
 * EN / हिं switch can show either language.
 * Times use IST offsets (+05:30) so the countdown comes out right.
 * ------------------------------------------------------------------ */
window.WEDDING = {
  couple: {
    bride: {
      first: { en: "Vandana", hi: "वन्दना" },
      honorific: { en: "", hi: "आयु. कु." },
      lines: [
        { en: "Granddaughter of Shri Ramdhan Sahu & Late Smt. Gyan Devi Sahu", hi: "सुपौत्री — श्री रामधन साहू एवं स्व. ज्ञान देवी साहू" },
        { en: "Daughter of Shri Moolchandra Sahu & Late Smt. Santoshi Sahu", hi: "सुपुत्री — श्री मूलचन्द्र साहू एवं स्व. संतोषी साहू" },
      ],
      address: { en: "Sadwa Kala, Power House, Naini, Prayagraj", hi: "सड़वा कला, पावर हाउस, नैनी, प्रयागराज" },
    },
    groom: {
      first: { en: "Shyam", hi: "श्याम" },
      honorific: { en: "", hi: "चि." },
      lines: [
        { en: "Grandson of Late Shri Ramjag Sahu & Late Smt. Gulab Devi", hi: "सुपौत्र — स्व. श्री रामजग साहू एवं स्व. गुलाब देवी" },
        { en: "Son of Shri Motilal Sahu & Smt. Prabhavati Sahu", hi: "सुपुत्र — श्री मोतीलाल साहू एवं प्रभावती साहू" },
      ],
      address: { en: "Kauwa Bazar, Baraon, Karchhana, Prayagraj", hi: "कौवा बाजार, बरांव, करछना, प्रयागराज" },
    },
  },
  monogram: "V & S",

  // Headline date + countdown target: Shubh Vivah, 21 Nov 2026, 8:00 PM (from the card)
  weddingDate: "2026-11-21T20:00:00+05:30",
  city: { en: "Prayagraj", hi: "प्रयागराज" },
  tagline: { en: "Two hearts, one sacred bond", hi: "दो दिल, एक पावन बंधन" },
  intro: {
    en: "By the boundless grace of the Almighty, we joyfully invite you and your family to bless the couple.",
    hi: "परमपिता परमेश्वर की असीम कृपा से, आप सपरिवार सादर आमंत्रित हैं।",
  },

  // Sanskrit invocations printed at the top of the card (same in both languages)
  shlokas: [
    "मंगलम् भगवान् विष्णुः, मंगलम् गरुड़ध्वजः ।\nमंगलम् पुण्डरीकाक्षः, मंगलाय तनो हरिः ॥",
    "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभः ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥",
  ],

  // The card's invitation (Hindi is word for word from the card)
  invitation: {
    en: "Respected guests, by the boundless grace of the Almighty, the auspicious wedding of Vandana and Shyam has been fixed for Saturday, 21 November 2026. We humbly request you to join us with your family and bless the newlyweds.",
    hi: "आदरणीय महोदय, परमपिता परमेश्वर की असीम कृपा से हमारे यहाँ आयु. कु. वन्दना संग चि. श्याम का शुभ विवाह दि. 21 नवम्बर 2026 (शनिवार) को होना सुनिश्चित हुआ है। इस शुभ अवसर पर आप सपरिवार पधारकर नवदम्पति को शुभ आशीर्वाद प्रदान कर हमें अनुग्रहित करें।",
  },
  vineet: { en: "Shri Ramdhan Sahu", hi: "श्री रामधन साहू" },

  // Family blocks from the card
  family: {
    welcome: [ // स्वागताकांक्षी
      { name: { en: "Lalchandra Sahu & Moni Sahu", hi: "लालचन्द्र साहू – मोनी साहू" }, rel: { en: "Uncle & Aunt", hi: "चाचा / चाची" } },
      { name: { en: "Neha Sahu & Deepak Gupta", hi: "नेहा साहू – दीपक गुप्ता" }, rel: { en: "Sister & Brother-in-law", hi: "दीदी / जीजा" } },
    ],
    awaiting: { // दर्शनाभिलाषी
      names: { en: "Phoolchandra Sahu, Lalbahadur Sahu, Jangbahadur Sahu, Shammi Sahu, Shivam, Rakesh, Rajesh", hi: "फूलचन्द्र साहू, लालबहादुर साहू, जंगबहादुर साहू, शम्मी साहू, शिवम, राकेश, राजेश" },
      all: { en: "and the entire Sahu family", hi: "एवं समस्त साहू परिवार" },
    },
    hosts: { // निमंत्रक
      names: [{ en: "Shri Ramdhan Sahu", hi: "श्री रामधन साहू" }, { en: "Shri Moolchandra Sahu", hi: "श्री मूलचन्द्र साहू" }],
      address: { en: "Sadwa Kala, Power House, Naini, Prayagraj", hi: "सड़वा कला, पावर हाउस, नैनी, प्रयागराज" },
      phones: ["9670162965", "6389633953"],
    },
  },

  venue: {
    name: { en: "Vrindavan Garden", hi: "वृंदावन गार्डन" },
    address: { en: "FCI Road, Chaka, Naini, Prayagraj", hi: "एफ़.सी.आई. रोड, चाका, नैनी, प्रयागराज" },
    when: { en: "Shubh Vivah · Saturday, 21 November · 8:00 PM", hi: "शुभ विवाह · शनिवार, 21 नवम्बर · शाम 8:00 बजे" },
    lat: 25.3882864,
    lng: 81.8517184,
    // From the QR code on the card ("Scan for wedding location").
    // "Get Directions" uses lat/lng above so Google Maps opens straight into directions mode.
    mapsUrl: "https://maps.app.goo.gl/iAGPZGiHZKcmYouZ7",
  },

  // मांगलिक कार्यक्रम. The card gives dates for all four but a time + venue only for the
  // wedding, so the time / venue rows show only where `time` / `atVenue` are set.
  // theme: haldi | mehendi | sangeet | wedding | reception (colours + motif)
  events: [
    {
      id: "haldi", theme: "haldi",
      name: { en: "Haldi", hi: "हल्दी" }, subtitle: { en: "Ceremony", hi: "रस्म" },
      start: "2026-11-19T10:00:00+05:30",
      text: {
        en: "Turmeric, marigolds and a lot of laughter — the family blesses the bride with haldi for a golden glow before the big day.",
        hi: "हल्दी, गेंदे के फूल और ढेर सारी हँसी-ख़ुशी — विवाह से पहले परिवारजन हल्दी लगाकर दुल्हन को आशीर्वाद देंगे।",
      },
    },
    {
      id: "silmayan", theme: "mehendi",
      name: { en: "Silmayan", hi: "सिलमायन" }, subtitle: { en: "Ritual", hi: "रस्म" },
      start: "2026-11-20T10:00:00+05:30",
      text: {
        en: "A traditional pre-wedding ritual of puja, mangal geet and the heartfelt blessings of the elders.",
        hi: "विवाह से पूर्व की पारंपरिक रस्म — पूजा, मंगल गीत और बड़ों का स्नेह भरा आशीर्वाद।",
      },
    },
    {
      id: "vivah", theme: "wedding",
      name: { en: "Baraat Aagman", hi: "बारात आगमन" }, subtitle: { en: "& Shubh Vivah", hi: "एवं शुभ विवाह" },
      start: "2026-11-21T20:00:00+05:30", time: { en: "8:00 PM", hi: "शाम 8:00 बजे" }, atVenue: true,
      text: {
        en: "The baraat arrives at Vrindavan Garden, followed by the varmala and the seven sacred pheras of Vandana and Shyam.",
        hi: "वृंदावन गार्डन में बारात का आगमन, फिर वरमाला और पवित्र अग्नि के सात फेरे लेकर वन्दना और श्याम जीवनभर के बंधन में बंधेंगे।",
      },
    },
    {
      id: "vidaai", theme: "reception",
      name: { en: "Vidaai", hi: "विदाई" }, subtitle: { en: "Ceremony", hi: "समारोह" },
      start: "2026-11-22T08:00:00+05:30",
      text: {
        en: "With tears of joy and countless blessings, we bid our daughter farewell to her new home.",
        hi: "ख़ुशी के आँसुओं और अनगिनत आशीर्वादों के साथ, हम अपनी बेटी को उसके नए घर के लिए विदा करेंगे।",
      },
    },
  ],

  // Background track (looped). Volume 0-1; the file is already mastered quiet.
  // Starts on the guest's first tap.
  music: { src: "audio/music.m4a", volume: 0.35 },

  closing: {
    line: { en: "Your presence will make our celebration even more special.", hi: "आपकी उपस्थिति हमारे उत्सव को और भी विशेष बना देगी।" },
    sub: { en: "We look forward to welcoming you and your family.", hi: "आपके और आपके परिवार के स्वागत की हमें प्रतीक्षा रहेगी।" },
    thanks: { en: "With love, the Sahu family", hi: "सादर — समस्त साहू परिवार" },
  },
};
