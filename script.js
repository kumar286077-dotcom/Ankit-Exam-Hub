/* =========================================================
   ANKIT EXAM HUB — script.js
   UPSSSC PET | 25,000 Questions | Beginner / Medium / Advanced
   ========================================================= */

"use strict";

/* =========================
   BASIC SETTINGS
========================= */

const APP_NAME = "Ankit Exam Hub";
const CREATOR_NAME = "Ankit Pal";
const SUPPORT_EMAIL = "ajay1924773@gmail.com";

const DEFAULT_AVATAR = "ankit.jpeg";
const ADMIN_PIN = "2020";

const TOTAL_QUESTIONS = 25000;
const QUIZ_SIZE = 20;
const QUIZ_TIME_SECONDS = 120;

const STORAGE = {
    profile: "aeh_profile",
    results: "aeh_results",
    bookmarks: "aeh_bookmarks",
    wrong: "aeh_wrong",
    permissions: "aeh_permissions",
    admin: "aeh_admin"
};

/* =========================
   STATE
========================= */

const state = {
    currentView: "home",

    filters: {
        subject: "all",
        level: "all",
        search: ""
    },

    quiz: {
        questions: [],
        index: 0,
        answers: {},
        score: 0,
        timer: null,
        timeLeft: QUIZ_TIME_SECONDS,
        submitted: false
    },

    questionBank: null,
    adminLoggedIn: false
};

/* =========================
   15 PET SUBJECTS
========================= */

const SUBJECTS = [
    { id: "history", name: "इतिहास", icon: "🏛️" },
    { id: "movement", name: "भारतीय राष्ट्रीय आंदोलन", icon: "🇮🇳" },
    { id: "geography", name: "भूगोल", icon: "🌍" },
    { id: "economy", name: "भारतीय अर्थव्यवस्था", icon: "💰" },
    { id: "polity", name: "भारतीय राजव्यवस्था", icon: "⚖️" },
    { id: "science", name: "सामान्य विज्ञान", icon: "🔬" },
    { id: "math", name: "प्रारंभिक गणित", icon: "➗" },
    { id: "hindi", name: "सामान्य हिंदी", icon: "📝" },
    { id: "english", name: "सामान्य अंग्रेजी", icon: "🔤" },
    { id: "reasoning", name: "तार्किक एवं तर्कशक्ति", icon: "🧠" },
    { id: "current", name: "सामयिकी", icon: "📰" },
    { id: "awareness", name: "सामान्य जागरूकता", icon: "💡" },
    { id: "passage", name: "अपठित गद्यांश", icon: "📖" },
    { id: "graph", name: "ग्राफ की व्याख्या", icon: "📊" },
    { id: "table", name: "तालिका की व्याख्या", icon: "📋" }
];

/* =========================
   QUESTION TEMPLATES
========================= */

const QUESTION_TEMPLATES = {

history: [
    ["सिंधु घाटी सभ्यता का प्रमुख नगर कौन-सा था?", ["मोहनजोदड़ो", "पाटलिपुत्र", "कन्नौज", "मदुरै"], 0],
    ["मौर्य साम्राज्य के संस्थापक कौन थे?", ["चंद्रगुप्त मौर्य", "अशोक", "बिंदुसार", "समुद्रगुप्त"], 0],
    ["सम्राट अशोक किस वंश से संबंधित थे?", ["मौर्य", "गुप्त", "कुषाण", "चोल"], 0],
    ["गुप्त काल को सामान्यतः किस नाम से जाना जाता है?", ["स्वर्ण युग", "लौह युग", "अंधकार युग", "आधुनिक युग"], 0],
    ["हर्षवर्धन की राजधानी क्या थी?", ["कन्नौज", "दिल्ली", "पाटलिपुत्र", "उज्जैन"], 0],
    ["पानीपत का प्रथम युद्ध किस वर्ष हुआ?", ["1526", "1556", "1761", "1857"], 0],
    ["मुगल साम्राज्य की स्थापना किसने की?", ["बाबर", "अकबर", "हुमायूँ", "औरंगजेब"], 0],
    ["अकबर का शासनकाल किस अवधि में था?", ["1556–1605", "1526–1530", "1605–1627", "1658–1707"], 0]
],

movement: [
    ["भारतीय राष्ट्रीय कांग्रेस की स्थापना किस वर्ष हुई?", ["1885", "1905", "1919", "1942"], 0],
    ["भारतीय राष्ट्रीय कांग्रेस के प्रथम अध्यक्ष कौन थे?", ["डब्ल्यू. सी. बनर्जी", "दादाभाई नौरोजी", "बाल गंगाधर तिलक", "गोपाल कृष्ण गोखले"], 0],
    ["जलियांवाला बाग हत्याकांड किस वर्ष हुआ?", ["1919", "1905", "1920", "1930"], 0],
    ["असहयोग आंदोलन किस वर्ष प्रारंभ हुआ?", ["1920", "1915", "1930", "1942"], 0],
    ["भारत छोड़ो आंदोलन किस वर्ष शुरू हुआ?", ["1942", "1930", "1920", "1947"], 0],
    ["दांडी मार्च किस आंदोलन से संबंधित था?", ["सविनय अवज्ञा आंदोलन", "असहयोग आंदोलन", "भारत छोड़ो आंदोलन", "स्वदेशी आंदोलन"], 0],
    ["भारत का स्वतंत्रता दिवस कब मनाया जाता है?", ["15 अगस्त", "26 जनवरी", "2 अक्टूबर", "14 नवंबर"], 0],
    ["महात्मा गांधी ने चंपारण सत्याग्रह किस वर्ष किया?", ["1917", "1919", "1922", "1930"], 0]
],

geography: [
    ["भारत का सबसे बड़ा राज्य क्षेत्रफल की दृष्टि से कौन-सा है?", ["राजस्थान", "उत्तर प्रदेश", "मध्य प्रदेश", "महाराष्ट्र"], 0],
    ["भारत की सबसे लंबी नदी कौन-सी है?", ["गंगा", "यमुना", "गोदावरी", "नर्मदा"], 0],
    ["भारत का दक्षिणतम बिंदु कौन-सा है?", ["इंदिरा प्वाइंट", "कन्याकुमारी", "रामेश्वरम", "कोच्चि"], 0],
    ["उत्तर प्रदेश की राजधानी क्या है?", ["लखनऊ", "कानपुर", "प्रयागराज", "वाराणसी"], 0],
    ["भारत में मानसून मुख्यतः किस दिशा से आता है?", ["दक्षिण-पश्चिम", "उत्तर-पूर्व", "दक्षिण-पूर्व", "उत्तर-पश्चिम"], 0],
    ["काली मिट्टी किस फसल के लिए उपयुक्त मानी जाती है?", ["कपास", "चाय", "जूट", "गेहूँ"], 0],
    ["गंगा नदी का उद्गम किस हिमनद से माना जाता है?", ["गंगोत्री", "सियाचिन", "यमुनोत्री", "पिंडारी"], 0],
    ["भारत का सबसे बड़ा पठार कौन-सा है?", ["दक्कन का पठार", "मालवा पठार", "छोटानागपुर पठार", "मेघालय पठार"], 0]
],

economy: [
    ["भारत का केंद्रीय बैंक कौन-सा है?", ["भारतीय रिजर्व बैंक", "SBI", "SEBI", "NABARD"], 0],
    ["GDP का पूरा नाम क्या है?", ["Gross Domestic Product", "General Domestic Price", "Gross Development Plan", "General Development Product"], 0],
    ["भारत में नोट जारी करने का अधिकार मुख्यतः किस संस्था के पास है?", ["RBI", "SBI", "SEBI", "वित्त मंत्रालय"], 0],
    ["GST का पूरा नाम क्या है?", ["Goods and Services Tax", "General Sales Tax", "Goods Supply Tax", "Government Service Tax"], 0],
    ["मुद्रास्फीति का अर्थ क्या है?", ["कीमतों के सामान्य स्तर में वृद्धि", "उत्पादन में वृद्धि", "बेरोजगारी में कमी", "निर्यात में कमी"], 0],
    ["भारत की मुद्रा क्या है?", ["रुपया", "डॉलर", "पाउंड", "येन"], 0],
    ["SEBI मुख्यतः किस क्षेत्र को नियंत्रित करता है?", ["पूंजी बाजार", "कृषि", "रेलवे", "शिक्षा"], 0]
],

polity: [
    ["भारत का संविधान कब लागू हुआ?", ["26 जनवरी 1950", "15 अगस्त 1947", "26 नवंबर 1949", "2 अक्टूबर 1950"], 0],
    ["भारत का संविधान कब अंगीकृत किया गया?", ["26 नवंबर 1949", "26 जनवरी 1950", "15 अगस्त 1947", "9 दिसंबर 1946"], 0],
    ["भारतीय संविधान की प्रस्तावना में कितने प्रमुख आदर्श शब्द हैं?", ["चार", "पाँच", "छह", "सात"], 0],
    ["भारत के राष्ट्रपति का कार्यकाल कितने वर्ष का होता है?", ["5 वर्ष", "4 वर्ष", "6 वर्ष", "7 वर्ष"], 0],
    ["लोकसभा का सामान्य कार्यकाल कितना होता है?", ["5 वर्ष", "4 वर्ष", "6 वर्ष", "7 वर्ष"], 0],
    ["राज्यसभा को क्या कहा जाता है?", ["स्थायी सदन", "अस्थायी सदन", "न्यायिक सदन", "स्थानीय सदन"], 0],
    ["भारत में मौलिक अधिकार किस भाग में हैं?", ["भाग III", "भाग II", "भाग IV", "भाग V"], 0],
    ["भारत का सर्वोच्च न्यायालय कहाँ स्थित है?", ["नई दिल्ली", "मुंबई", "प्रयागराज", "लखनऊ"], 0]
],

science: [
    ["जल का रासायनिक सूत्र क्या है?", ["H₂O", "CO₂", "O₂", "H₂"], 0],
    ["मानव शरीर में रक्त को पंप करने वाला अंग कौन-सा है?", ["हृदय", "फेफड़ा", "यकृत", "गुर्दा"], 0],
    ["पौधे प्रकाश संश्लेषण में किस गैस का उपयोग करते हैं?", ["कार्बन डाइऑक्साइड", "ऑक्सीजन", "नाइट्रोजन", "हाइड्रोजन"], 0],
    ["विटामिन C की कमी से कौन-सा रोग होता है?", ["स्कर्वी", "रिकेट्स", "बेरी-बेरी", "रतौंधी"], 0],
    ["मानव शरीर का सबसे बड़ा अंग कौन-सा है?", ["त्वचा", "हृदय", "यकृत", "फेफड़ा"], 0],
    ["पृथ्वी का प्राकृतिक उपग्रह कौन है?", ["चंद्रमा", "सूर्य", "मंगल", "शुक्र"], 0],
    ["विद्युत धारा की SI इकाई क्या है?", ["एम्पियर", "वोल्ट", "ओम", "वाट"], 0]
],

math: [
    ["25 + 35 = ?", ["60", "50", "70", "55"], 0],
    ["100 का 25% कितना है?", ["25", "20", "30", "15"], 0],
    ["12 × 8 = ?", ["96", "86", "108", "92"], 0],
    ["144 का वर्गमूल क्या है?", ["12", "14", "10", "16"], 0],
    ["एक दर्जन में कितनी वस्तुएँ होती हैं?", ["12", "10", "15", "20"], 0],
    ["200 का 10% कितना है?", ["20", "10", "30", "40"], 0],
    ["3/4 को प्रतिशत में कैसे लिखेंगे?", ["75%", "50%", "25%", "80%"], 0]
],

hindi: [
    ["'सुंदर' शब्द का विलोम क्या है?", ["कुरूप", "अच्छा", "मधुर", "सरल"], 0],
    ["'जल' का पर्यायवाची कौन-सा है?", ["पानी", "अग्नि", "वायु", "धरती"], 0],
    ["'आकाश' का पर्यायवाची क्या है?", ["नभ", "पाताल", "जल", "धरती"], 0],
    ["'दिन' का विलोम क्या है?", ["रात", "सुबह", "दोपहर", "प्रकाश"], 0],
    ["'नाक कटना' मुहावरे का अर्थ क्या है?", ["अपमान होना", "खुश होना", "बीमार होना", "जीतना"], 0],
    ["'आँखों का तारा' का अर्थ क्या है?", ["बहुत प्रिय", "बहुत दूर", "बहुत क्रोधित", "बहुत गरीब"], 0]
],

english: [
    ["What is the opposite of 'Hot'?", ["Cold", "Warm", "Heat", "Fire"], 0],
    ["What is the plural of 'Child'?", ["Children", "Childs", "Childes", "Childrens"], 0],
    ["Choose the correct article: ___ apple.", ["an", "a", "the", "no article"], 0],
    ["What is the opposite of 'Big'?", ["Small", "Tall", "Long", "Wide"], 0],
    ["What is the past tense of 'Go'?", ["Went", "Gone", "Going", "Goes"], 0]
],

reasoning: [
    ["श्रृंखला 2, 4, 6, 8, ? में अगली संख्या क्या होगी?", ["10", "9", "12", "11"], 0],
    ["यदि A = 1, B = 2, तो C = ?", ["3", "4", "2", "5"], 0],
    ["एक व्यक्ति उत्तर की ओर मुँह करके खड़ा है। वह दाएँ मुड़ता है। अब उसका मुँह किस दिशा में है?", ["पूर्व", "पश्चिम", "उत्तर", "दक्षिण"], 0],
    ["श्रृंखला 5, 10, 15, 20, ? में अगली संख्या क्या है?", ["25", "30", "22", "24"], 0],
    ["यदि सभी गुलाब फूल हैं और कुछ फूल लाल हैं, तो कौन-सा निष्कर्ष निश्चित है?", ["सभी गुलाब फूल हैं", "सभी फूल गुलाब हैं", "सभी गुलाब लाल हैं", "कोई गुलाब फूल नहीं है"], 0]
],

current: [
    ["भारत का राष्ट्रीय पशु कौन-सा है?", ["बाघ", "सिंह", "हाथी", "मोर"], 0],
    ["भारत का राष्ट्रीय पक्षी कौन-सा है?", ["मोर", "तोता", "कबूतर", "हंस"], 0],
    ["भारत का राष्ट्रीय फूल कौन-सा है?", ["कमल", "गुलाब", "चमेली", "सूरजमुखी"], 0],
    ["भारत का राष्ट्रीय वृक्ष कौन-सा है?", ["बरगद", "नीम", "पीपल", "आम"], 0],
    ["भारत का राष्ट्रीय गीत कौन-सा है?", ["वंदे मातरम्", "जन गण मन", "सारे जहाँ से अच्छा", "ऐ मेरे वतन"], 0]
],

awareness: [
    ["भारत का राष्ट्रीय ध्वज किस नाम से जाना जाता है?", ["तिरंगा", "ध्वज भारत", "केसरिया", "विजय ध्वज"], 0],
    ["भारतीय राष्ट्रीय ध्वज के मध्य में क्या है?", ["अशोक चक्र", "कमल", "सिंह", "तारा"], 0],
    ["अशोक चक्र में कितनी तीलियाँ होती हैं?", ["24", "12", "18", "32"], 0],
    ["भारत का राष्ट्रीय प्रतीक किससे लिया गया है?", ["सारनाथ के सिंह स्तंभ", "लाल किला", "कुतुब मीनार", "इंडिया गेट"], 0]
],

passage: [
    ["गद्यांश: 'जल जीवन के लिए आवश्यक है। मनुष्य, पशु और पौधे सभी जल पर निर्भर हैं।' इस गद्यांश का मुख्य विषय क्या है?", ["जल का महत्व", "वनों का महत्व", "कृषि का इतिहास", "परिवहन"], 0],
    ["गद्यांश के अनुसार जल किसके लिए आवश्यक है?", ["जीवन के लिए", "केवल खेती के लिए", "केवल उद्योग के लिए", "केवल पशुओं के लिए"], 0],
    ["गद्यांश: 'पेड़ हमें ऑक्सीजन देते हैं और पर्यावरण को संतुलित रखते हैं।' इसका मुख्य विचार क्या है?", ["पेड़ों का महत्व", "नदियों का महत्व", "खनिजों का महत्व", "सड़कों का महत्व"], 0]
],

graph: [
    ["एक ग्राफ में सोमवार 20, मंगलवार 30 और बुधवार 40 इकाइयाँ दिखाई गई हैं। सबसे अधिक मान किस दिन है?", ["बुधवार", "सोमवार", "मंगलवार", "सभी समान"], 0],
    ["किसी ग्राफ में बिक्री 50 से बढ़कर 75 हो गई। वृद्धि कितनी हुई?", ["25", "20", "30", "15"], 0],
    ["यदि किसी ग्राफ में A = 10 और B = 20 है, तो B, A से कितना अधिक है?", ["10", "20", "5", "30"], 0]
],

table: [
    ["तालिका में राम = 20, श्याम = 30 और मोहन = 40 अंक हैं। सबसे अधिक अंक किसके हैं?", ["मोहन", "राम", "श्याम", "सभी"], 0],
    ["यदि A = 15 और B = 25 है, तो B - A कितना होगा?", ["10", "5", "15", "20"], 0],
    ["तालिका में कुल 100 वस्तुओं में 40 लाल और 60 नीली हैं। नीली वस्तुएँ कितनी हैं?", ["60", "40", "50", "20"], 0]
]
};

/* =========================
   UTILITY FUNCTIONS
========================= */

function $(id) {
    return document.getElementById(id);
}

function safeJSONParse(value, fallback) {
    try {
        return value ? JSON.parse(value) : fallback;
    } catch (e) {
        return fallback;
    }
}

function getStorage(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value === null ? fallback : safeJSONParse(value, fallback);
    } catch (e) {
        return fallback;
    }
}

function setStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        return false;
    }
}

function getProfile() {
    return getStorage(STORAGE.profile, {
        name: "",
        dob: "",
        qualification: "",
        city: "",
        state: "",
        familyName: "",
        relation: "",
        photo: ""
    });
}

function getResults() {
    return getStorage(STORAGE.results, []);
}

function getBookmarks() {
    return getStorage(STORAGE.bookmarks, []);
}

function getWrong() {
    return getStorage(STORAGE.wrong, []);
}

function getPermissions() {
    return getStorage(STORAGE.permissions, {
        screenshots: false,
        downloads: false
    });
}

function showToast(message) {
    let toast = $("aehToast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "aehToast";
        toast.style.cssText = `
            position:fixed;
            left:50%;
            bottom:25px;
            transform:translateX(-50%);
            background:#10152d;
            color:white;
            padding:12px 20px;
            border-radius:12px;
            z-index:99999;
            box-shadow:0 10px 30px rgba(0,0,0,.35);
            font-weight:700;
            border:1px solid rgba(255,255,255,.15);
        `;
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.display = "block";

    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
        toast.style.display = "none";
    }, 2200);
}

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function getSubjectName(id) {
    const subject = SUBJECTS.find(s => s.id === id);
    return subject ? subject.name : id;
}

function getLevelName(level) {
    return level || "Beginner";
}

/* =========================
   QUESTION BANK
========================= */

function createQuestion(subject, template, number, level) {
    const [question, options, answer] = template;

    let qText = question;

    if (number > 1) {
        qText += ` (प्रश्न ${number})`;
    }

    return {
        id: `${subject}-${number}`,
        subject,
        level,
        question: qText,
        options: [...options],
        answer
    };
}

function buildQuestionBank() {

    if (state.questionBank && state.questionBank.length === TOTAL_QUESTIONS) {
        return state.questionBank;
    }

    const bank = [];

    const subjectIds = SUBJECTS.map(s => s.id);

    let counter = 1;

    while (bank.length < TOTAL_QUESTIONS) {

        const subject = subjectIds[(bank.length) % subjectIds.length];

        const templates = QUESTION_TEMPLATES[subject];

        if (!templates || templates.length === 0) {
            continue;
        }

        const templateIndex = Math.floor(bank.length / subjectIds.length) % templates.length;
        const template = templates[templateIndex];

        let level;

        const cycle = bank.length % 100;

        if (cycle < 40) {
            level = "Beginner";
        } else if (cycle < 76) {
            level = "Medium";
        } else {
            level = "Advanced";
        }

        bank.push(
            createQuestion(
                subject,
                template,
                counter,
                level
            )
        );

        counter++;
    }

    state.questionBank = bank;

    return bank;
}

function ensureQuestionBank() {
    if (!state.questionBank) {
        buildQuestionBank();
    }

    return state.questionBank;
}

/* =========================
   NAVIGATION
========================= */

function showView(viewName) {

    const views = [
        "home",
        "practice",
        "revision",
        "syllabus",
        "results",
        "profile",
        "admin"
    ];

    views.forEach(view => {

        const element = $(`${view}View`);

        if (element) {
            element.classList.toggle(
                "hidden",
                view !== viewName
            );
        }
    });

    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.toggle(
            "active",
            item.dataset.nav === viewName
        );
    });

    state.currentView = viewName;

    if (viewName === "home") {
        renderHome();
    }

    if (viewName === "practice") {
        renderPractice();
    }

    if (viewName === "revision") {
        renderRevision();
    }

    if (viewName === "syllabus") {
        renderSyllabus();
    }

    if (viewName === "results") {
        renderResults();
    }

    if (viewName === "profile") {
        renderProfile();
    }

    if (viewName === "admin") {
        renderAdmin();
    }
}

/* =========================
   HOME
========================= */

function renderHome() {

    const bank = ensureQuestionBank();

    const results = getResults();
    const bookmarks = getBookmarks();
    const wrong = getWrong();

    if ($("totalQuestionCount")) {
        $("totalQuestionCount").textContent =
            bank.length.toLocaleString("en-IN");
    }

    if ($("bookmarkCount")) {
        $("bookmarkCount").textContent =
            bookmarks.length.toLocaleString("en-IN");
    }

    if ($("wrongCount")) {
        $("wrongCount").textContent =
            wrong.length.toLocaleString("en-IN");
    }

    let accuracy = 0;

    if (results.length) {
        const total = results.reduce((sum, r) => sum + Number(r.total || 0), 0);
        const correct = results.reduce((sum, r) => sum + Number(r.score || 0), 0);

        if (total > 0) {
            accuracy = Math.round((correct / total) * 100);
        }
    }

    if ($("accuracyCount")) {
        $("accuracyCount").textContent = `${accuracy}%`;
    }

    renderSubjects();
    renderRecentResults();
}

function renderSubjects() {

    const container = $("subjectGrid");

    if (!container) return;

    container.innerHTML = SUBJECTS.map(subject => {

        const count = ensureQuestionBank()
            .filter(q => q.subject === subject.id)
            .length;

        return `
            <button
                class="subject-card"
                type="button"
                onclick="startSubjectQuiz('${subject.id}')"
            >
                <div class="subject-icon">${subject.icon}</div>
                <div class="subject-name">
                    ${escapeHTML(subject.name)}
                </div>
                <div class="subject-count">
                    ${count.toLocaleString("en-IN")} Questions
                </div>
                <span class="subject-action">
                    शुरू करें →
                </span>
            </button>
        `;
    }).join("");
}

function renderRecentResults() {

    const container = $("recentResults");

    if (!container) return;

    const results = getResults();

    if (!results.length) {
        container.innerHTML = `
            <div class="empty-state">
                अभी कोई quiz result नहीं है।
            </div>
        `;
        return;
    }

    const recent = results.slice(-5).reverse();

    container.innerHTML = recent.map(result => `
        <div class="result-row">
            <div>
                <strong>${escapeHTML(result.subjectName || "PET Quiz")}</strong>
                <small>
                    ${escapeHTML(result.level || "Mixed")}
                </small>
            </div>

            <div>
                <strong>
                    ${result.score}/${result.total}
                </strong>

                <small>
                    ${result.percentage}%
                </small>
            </div>
        </div>
    `).join("");
}

/* =========================
   PRACTICE
========================= */

function populateFilters() {

    const subjectFilter = $("subjectFilter");

    if (subjectFilter && subjectFilter.options.length <= 1) {

        SUBJECTS.forEach(subject => {

            const option = document.createElement("option");

            option.value = subject.id;
            option.textContent = subject.name;

            subjectFilter.appendChild(option);
        });
    }
}

function getFilteredQuestions() {

    const bank = ensureQuestionBank();

    const search = String(state.filters.search || "")
        .trim()
        .toLowerCase();

    return bank.filter(q => {

        const subjectMatch =
            state.filters.subject === "all" ||
            q.subject === state.filters.subject;

        const levelMatch =
            state.filters.level === "all" ||
            q.level === state.filters.level;

        const searchMatch =
            !search ||
            q.question.toLowerCase().includes(search) ||
            q.options.some(o =>
                String(o).toLowerCase().includes(search)
            ) ||
            getSubjectName(q.subject).toLowerCase().includes(search);

        return subjectMatch && levelMatch && searchMatch;
    });
}

function renderPractice() {

    populateFilters();

    const questions = getFilteredQuestions();

    if ($("filteredQuestionCount")) {
        $("filteredQuestionCount").textContent =
            `${questions.length.toLocaleString("en-IN")} प्रश्न मिले`;
    }

    const container = $("practiceList");

    if (!container) return;

    if (!questions.length) {
        container.innerHTML = `
            <div class="empty-state">
                कोई प्रश्न नहीं मिला।
            </div>
        `;
        return;
    }

    const visible = questions.slice(0, 60);

    container.innerHTML = visible.map((q, index) => {

        const bookmarked = getBookmarks().some(
            item => item.id === q.id
        );

        return `
            <div class="question-card">

                <div class="question-top">
                    <span class="level-badge">
                        ${escapeHTML(q.level)}
                    </span>

                    <button
                        class="bookmark-btn"
                        type="button"
                        onclick="toggleBookmark('${q.id}')"
                    >
                        ${bookmarked ? "★" : "☆"}
                    </button>
                </div>

                <h3>
                    ${index + 1}. ${escapeHTML(q.question)}
                </h3>

                <div class="mini-options">
                    ${q.options.map((option, i) => `
                        <div>
                            ${String.fromCharCode(65 + i)}.
                            ${escapeHTML(option)}
                        </div>
                    `).join("")}
                </div>

                <button
                    class="small-primary-btn"
                    type="button"
                    onclick="startSingleQuestionQuiz('${q.id}')"
                >
                    Practice करें
                </button>

            </div>
        `;
    }).join("");
}

/* =========================
   QUIZ START
========================= */

function shuffle(array) {

    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
}

function startPracticeQuiz() {

    state.filters.search = "";

    const questions = getFilteredQuestions();

    if (!questions.length) {
        showToast("इस filter में कोई प्रश्न नहीं है।");
        return;
    }

    startQuizFromQuestions(
        shuffle(questions).slice(0, QUIZ_SIZE),
        "Mixed PET Practice"
    );
}

function startSubjectQuiz(subjectId) {

    const questions = ensureQuestionBank()
        .filter(q => q.subject === subjectId);

    if (!questions.length) {
        showToast("इस विषय के प्रश्न उपलब्ध नहीं हैं।");
        return;
    }

    startQuizFromQuestions(
        shuffle(questions).slice(0, QUIZ_SIZE),
        getSubjectName(subjectId)
    );
}

function startSingleQuestionQuiz(questionId) {

    const question = ensureQuestionBank()
        .find(q => q.id === questionId);

    if (!question) return;

    startQuizFromQuestions(
        [question],
        getSubjectName(question.subject)
    );
}

function startQuizFromQuestions(questions, title) {

    clearQuizTimer();

    state.quiz.questions = questions;
    state.quiz.index = 0;
    state.quiz.answers = {};
    state.quiz.score = 0;
    state.quiz.submitted = false;

    state.quiz.timeLeft =
        questions.length === 1
            ? 30
            : QUIZ_TIME_SECONDS;

    if ($("quizModal")) {
        $("quizModal").classList.remove("hidden");
    }

    if ($("quizSubject")) {
        $("quizSubject").textContent = title;
    }

    if ($("quizTitle")) {
        $("quizTitle").textContent = "PET Practice Quiz";
    }

    renderQuizQuestion();
    startQuizTimer();
}

/* =========================
   QUIZ RENDER
========================= */

function renderQuizQuestion() {

    const questions = state.quiz.questions;

    if (!questions.length) return;

    const q = questions[state.quiz.index];

    if ($("quizProgress")) {
        $("quizProgress").textContent =
            `${state.quiz.index + 1} / ${questions.length}`;
    }

    if ($("quizLevel")) {
        $("quizLevel").textContent = q.level;
    }

    if ($("quizQuestionNumber")) {
        $("quizQuestionNumber").textContent =
            `प्रश्न ${state.quiz.index + 1}`;
    }

    if ($("quizQuestion")) {
        $("quizQuestion").textContent = q.question;
    }

    const optionsContainer = $("quizOptions");

    if (optionsContainer) {

        const selected = state.quiz.answers[q.id];

        optionsContainer.innerHTML =
            q.options.map((option, index) => {

                const isSelected =
                    selected === index;

                return `
                    <button
                        type="button"
                        class="quiz-option ${isSelected ? "selected" : ""}"
                        onclick="selectQuizAnswer(${index})"
                    >
                        <span class="option-letter">
                            ${String.fromCharCode(65 + index)}
                        </span>

                        <span>
                            ${escapeHTML(option)}
                        </span>
                    </button>
                `;
            }).join("");
    }

    if ($("quizPrev")) {
        $("quizPrev").disabled =
            state.quiz.index === 0;
    }

    if ($("quizNext")) {
        $("quizNext").textContent =
            state.quiz.index === questions.length - 1
                ? "Submit करें"
                : "Next →";
    }
}

function selectQuizAnswer(index) {

    if (state.quiz.submitted) return;

    const q = state.quiz.questions[state.quiz.index];

    state.quiz.answers[q.id] = index;

    renderQuizQuestion();
}

/* =========================
   QUIZ NAVIGATION
========================= */

function quizNext() {

    if (state.quiz.submitted) return;

    const questions = state.quiz.questions;

    if (state.quiz.index < questions.length - 1) {

        state.quiz.index++;

        renderQuizQuestion();

    } else {

        submitQuiz();
    }
}

function quizPrev() {

    if (state.quiz.submitted) return;

    if (state.quiz.index > 0) {

        state.quiz.index--;

        renderQuizQuestion();
    }
}

/* =========================
   QUIZ TIMER
========================= */

function startQuizTimer() {

    clearQuizTimer();

    updateQuizTimer();

    state.quiz.timer = setInterval(() => {

        state.quiz.timeLeft--;

        updateQuizTimer();

        if (state.quiz.timeLeft <= 0) {

            clearQuizTimer();

            submitQuiz(true);
        }

    }, 1000);
}

function updateQuizTimer() {

    const seconds = Math.max(
        0,
        state.quiz.timeLeft
    );

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;

    const text =
        `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;

    if ($("quizTimer")) {
        $("quizTimer").textContent = text;
    }
}

function clearQuizTimer() {

    if (state.quiz.timer) {

        clearInterval(state.quiz.timer);

        state.quiz.timer = null;
    }
}

/* =========================
   SUBMIT QUIZ
========================= */

function submitQuiz(timeUp = false) {

    if (state.quiz.submitted) return;

    state.quiz.submitted = true;

    clearQuizTimer();

    let score = 0;

    const wrongItems = [];

    state.quiz.questions.forEach(q => {

        const selected = state.quiz.answers[q.id];

        if (selected === q.answer) {

            score++;

        } else {

            wrongItems.push({
                ...q,
                selected:
                    selected === undefined
                        ? null
                        : selected
            });
        }
    });

    state.quiz.score = score;

    const total = state.quiz.questions.length;

    const percentage =
        total > 0
            ? Math.round((score / total) * 100)
            : 0;

    const firstSubject =
        state.quiz.questions[0]
            ? state.quiz.questions[0].subject
            : "mixed";

    const result = {
        id: Date.now(),
        date: new Date().toLocaleString("en-IN"),
        subject: firstSubject,
        subjectName:
            state.quiz.questions.length === 1
                ? getSubjectName(firstSubject)
                : "PET Practice Quiz",
        level: state.quiz.questions
            .map(q => q.level)
            .filter(Boolean)
            .join(", "),
        score,
        total,
        percentage,
        timeUp
    };

    const results = getResults();

    results.push(result);

    setStorage(STORAGE.results, results);

    saveWrongQuestions(wrongItems);

    showQuizResult(
        score,
        total,
        percentage,
        timeUp
    );
}

function showQuizResult(score, total, percentage, timeUp) {

    if (!$("quizResult")) return;

    $("quizResult").classList.remove("hidden");

    $("quizResult").innerHTML = `
        <div class="quiz-result-box">

            <div class="result-big">
                ${score} / ${total}
            </div>

            <div class="result-percent">
                ${percentage}%
            </div>

            <div class="result-message">
                ${
                    timeUp
                        ? "⏰ समय समाप्त हो गया।"
                        : "🎉 Quiz पूरा हो गया!"
                }
            </div>

            <div class="result-actions">
                <button
                    type="button"
                    class="small-primary-btn"
                    onclick="closeQuizModal();showView('results')"
                >
                    Result देखें
                </button>
            </div>

        </div>
    `;

    if ($("quizOptions")) {
        $("quizOptions").querySelectorAll("button")
            .forEach(button => {
                button.disabled = true;
            });
    }

    if ($("quizNext")) {
        $("quizNext").disabled = true;
    }

    if ($("quizPrev")) {
        $("quizPrev").disabled = true;
    }
}

/* =========================
   QUIZ CLOSE
========================= */

function closeQuizModal() {

    clearQuizTimer();

    if ($("quizModal")) {
        $("quizModal").classList.add("hidden");
    }
}

/* =========================
   WRONG QUESTIONS
========================= */

function saveWrongQuestions(items) {

    if (!items.length) return;

    const wrong = getWrong();

    items.forEach(item => {

        const exists = wrong.some(
            q => q.id === item.id
        );

        if (!exists) {
            wrong.push(item);
        }
    });

    setStorage(STORAGE.wrong, wrong);
}

function removeWrong(questionId) {

    const wrong =
        getWrong().filter(q => q.id !== questionId);

    setStorage(STORAGE.wrong, wrong);

    renderRevision();

    renderHome();
}

/* =========================
   BOOKMARK
========================= */

function toggleBookmark(questionId) {

    const question = ensureQuestionBank()
        .find(q => q.id === questionId);

    if (!question) return;

    const bookmarks = getBookmarks();

    const index = bookmarks.findIndex(
        q => q.id === questionId
    );

    if (index >= 0) {

        bookmarks.splice(index, 1);

        showToast("Bookmark हटाया गया।");

    } else {

        bookmarks.push(question);

        showToast("Bookmark सेव हो गया।");
    }

    setStorage(STORAGE.bookmarks, bookmarks);

    renderPractice();
    renderRevision();
    renderHome();
}

/* =========================
   REVISION
========================= */

function renderRevision() {

    const wrong = getWrong();
    const bookmarks = getBookmarks();

    if ($("revisionList")) {

        if (!wrong.length) {

            $("revisionList").innerHTML = `
                <div class="empty-state">
                    अभी कोई गलत प्रश्न नहीं है।
                </div>
            `;

        } else {

            $("revisionList").innerHTML =
                wrong.slice().reverse().map((q, i) => `
                    <div class="question-card">

                        <div class="question-top">
                            <span class="level-badge">
                                ${escapeHTML(q.level)}
                            </span>

                            <button
                                class="bookmark-btn"
                                onclick="toggleBookmark('${q.id}')"
                            >
                                ${
                                    getBookmarks().some(
                                        b => b.id === q.id
                                    )
                                    ? "★"
                                    : "☆"
                                }
                            </button>
                        </div>

                        <h3>
                            ${i + 1}. ${escapeHTML(q.question)}
                        </h3>

                        <div class="answer-box">
                            सही उत्तर:
                            <strong>
                                ${escapeHTML(q.options[q.answer])}
                            </strong>
                        </div>

                        <div class="revision-actions">

                            <button
                                class="small-primary-btn"
                                onclick="startSingleQuestionQuiz('${q.id}')"
                            >
                                फिर से करें
                            </button>

                            <button
                                class="small-danger-btn"
                                onclick="removeWrong('${q.id}')"
                            >
                                हटाएँ
                            </button>

                        </div>

                    </div>
                `).join("");
        }
    }

    if ($("bookmarkList")) {

        if (!bookmarks.length) {

            $("bookmarkList").innerHTML = `
                <div class="empty-state">
                    अभी कोई bookmark नहीं है।
                </div>
            `;

        } else {

            $("bookmarkList").innerHTML =
                bookmarks.slice().reverse().map((q, i) => `
                    <div class="question-card">

                        <div class="question-top">
                            <span class="level-badge">
                                ${escapeHTML(q.level)}
                            </span>

                            <button
                                class="bookmark-btn"
                                onclick="toggleBookmark('${q.id}')"
                            >
                                ★
                            </button>
                        </div>

                        <h3>
                            ${i + 1}. ${escapeHTML(q.question)}
                        </h3>

                        <button
                            class="small-primary-btn"
                            onclick="startSingleQuestionQuiz('${q.id}')"
                        >
                            Practice करें
                        </button>

                    </div>
                `).join("");
        }
    }
}

/* =========================
   SYLLABUS
========================= */

function renderSyllabus() {

    const container = $("syllabusList");

    if (!container) return;

    container.innerHTML = SUBJECTS.map((subject, index) => `
        <div class="syllabus-row">

            <div class="syllabus-number">
                ${index + 1}
            </div>

            <div class="syllabus-icon">
                ${subject.icon}
            </div>

            <div class="syllabus-info">
                <strong>
                    ${escapeHTML(subject.name)}
                </strong>

                <span>
                    PET Practice Topic
                </span>
            </div>

            <button
                class="small-primary-btn"
                onclick="startSubjectQuiz('${subject.id}')"
            >
                Start करें
            </button>

        </div>
    `).join("");
}

/* =========================
   RESULTS
========================= */

function renderResults() {

    const container = $("resultsList");

    if (!container) return;

    const results = getResults();

    if (!results.length) {

        container.innerHTML = `
            <div class="empty-state">
                अभी कोई result नहीं है।
            </div>
        `;

        return;
    }

    container.innerHTML =
        results.slice().reverse().map((result, index) => `
            <div class="result-row">

                <div>
                    <strong>
                        ${escapeHTML(result.subjectName)}
                    </strong>

                    <small>
                        ${escapeHTML(result.date)}
                    </small>
                </div>

                <div>
                    <strong>
                        ${result.score}/${result.total}
                    </strong>

                    <small>
                        ${result.percentage}%
                    </small>
                </div>

            </div>
        `).join("");
}

function downloadResults() {

    const permissions = getPermissions();

    if (!permissions.downloads) {

        showToast(
            "Admin ने download permission बंद रखी है।"
        );

        return;
    }

    const results = getResults();

    if (!results.length) {

        showToast("Download करने के लिए कोई result नहीं है।");

        return;
    }

    const text = results.map((r, index) => {

        return [
            `Result ${index + 1}`,
            `Date: ${r.date}`,
            `Subject: ${r.subjectName}`,
            `Score: ${r.score}/${r.total}`,
            `Percentage: ${r.percentage}%`,
            `Time Up: ${r.timeUp ? "Yes" : "No"}`,
            "--------------------------"
        ].join("\n");

    }).join("\n\n");

    const blob =
        new Blob([text], {
            type: "text/plain;charset=utf-8"
        });

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;
    a.download = "Ankit-Exam-Hub-Results.txt";

    document.body.appendChild(a);

    a.click();

    a.remove();

    URL.revokeObjectURL(url);
}

/* =========================
   PROFILE
========================= */

function renderProfile() {

    const profile = getProfile();

    if ($("profileName")) {
        $("profileName").value = profile.name || "";
    }

    if ($("profileDob")) {
        $("profileDob").value = profile.dob || "";
    }

    if ($("profileQualification")) {
        $("profileQualification").value =
            profile.qualification || "";
    }

    if ($("profileCity")) {
        $("profileCity").value = profile.city || "";
    }

    if ($("profileState")) {
        $("profileState").value = profile.state || "";
    }

    if ($("profileFamilyName")) {
        $("profileFamilyName").value =
            profile.familyName || "";
    }

    if ($("profileRelation")) {
        $("profileRelation").value =
            profile.relation || "";
    }

    updateAllAvatars();
}

function getAvatarSource() {

    const profile = getProfile();

    return profile.photo || DEFAULT_AVATAR;
}

function updateAllAvatars() {

    const source = getAvatarSource();

    [
        $("sidebarAvatar"),
        $("headerAvatar"),
        $("profileAvatar")
    ].forEach(img => {

        if (img) {
            img.src = source;
        }
    });
}

function saveProfile() {

    const oldProfile = getProfile();

    const profile = {
        name: $("profileName")
            ? $("profileName").value.trim()
            : oldProfile.name,

        dob: $("profileDob")
            ? $("profileDob").value
            : oldProfile.dob,

        qualification: $("profileQualification")
            ? $("profileQualification").value.trim()
            : oldProfile.qualification,

        city: $("profileCity")
            ? $("profileCity").value.trim()
            : oldProfile.city,

        state: $("profileState")
            ? $("profileState").value.trim()
            : oldProfile.state,

        familyName: $("profileFamilyName")
            ? $("profileFamilyName").value.trim()
            : oldProfile.familyName,

        relation: $("profileRelation")
            ? $("profileRelation").value.trim()
            : oldProfile.relation,

        photo: oldProfile.photo || ""
    };

    setStorage(STORAGE.profile, profile);

    updateAllAvatars();

    showToast("Profile save हो गया।");
}

function handlePhotoUpload(event) {

    const file =
        event.target.files &&
        event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {

        showToast("कृपया image file चुनें।");

        return;
    }

    const reader = new FileReader();

    reader.onload = function () {

        const profile = getProfile();

        profile.photo = reader.result;

        setStorage(
            STORAGE.profile,
            profile
        );

        updateAllAvatars();

        showToast("नई photo save हो गई।");
    };

    reader.readAsDataURL(file);
}

function removeUserPhoto() {

    const profile = getProfile();

    profile.photo = "";

    setStorage(
        STORAGE.profile,
        profile
    );

    updateAllAvatars();

    showToast(
        "आपकी photo हट गई। Default Ankit.jpg वापस आ गया।"
    );
}

/* =========================
   PHOTO POPUP
========================= */

function openPhotoPopup() {

    const source = getAvatarSource();

    if ($("photoModalImage")) {
        $("photoModalImage").src = source;
    }

    if ($("photoModal")) {
        $("photoModal").classList.remove("hidden");
    }
}

function closePhotoPopup() {

    if ($("photoModal")) {
        $("photoModal").classList.add("hidden");
    }
}

/* =========================
   ADMIN
========================= */

function openAdminLogin() {

    if (state.adminLoggedIn) {

        showView("admin");

        return;
    }

    const pin =
        window.prompt(
            "Admin PIN डालें:"
        );

    if (pin === null) return;

    if (pin === ADMIN_PIN) {

        state.adminLoggedIn = true;

        setStorage(
            STORAGE.admin,
            { loggedIn: true }
        );

        showToast("Admin Panel unlock हो गया।");

        showView("admin");

    } else {

        showToast("गलत Admin PIN।");
    }
}

function adminLogout() {

    state.adminLoggedIn = false;

    setStorage(
        STORAGE.admin,
        { loggedIn: false }
    );

    showToast("Admin logout हो गया।");

    showView("home");
}

function renderAdmin() {

    const permissions = getPermissions();

    if ($("adminStatus")) {

        $("adminStatus").textContent =
            state.adminLoggedIn
                ? "Admin Unlocked"
                : "Admin Locked";
    }

    if ($("screenshotsPermission")) {

        $("screenshotsPermission").checked =
            !!permissions.screenshots;

        $("screenshotsPermission").disabled =
            !state.adminLoggedIn;
    }

    if ($("downloadsPermission")) {

        $("downloadsPermission").checked =
            !!permissions.downloads;

        $("downloadsPermission").disabled =
            !state.adminLoggedIn;
    }
}

function saveAdminPermissions() {

    if (!state.adminLoggedIn) {

        showToast("पहले Admin PIN से login करें।");

        return;
    }

    const permissions = {

        screenshots:
            $("screenshotsPermission")
                ? $("screenshotsPermission").checked
                : false,

        downloads:
            $("downloadsPermission")
                ? $("downloadsPermission").checked
                : false
    };

    setStorage(
        STORAGE.permissions,
        permissions
    );

    applySecurityRules();

    showToast("Admin permissions save हो गईं।");
}

/* =========================
   SEARCH
========================= */

function setupSearch() {

    const searchInput = $("searchInput");

    if (!searchInput) return;

    searchInput.addEventListener(
        "input",
        function () {

            state.filters.search =
                this.value || "";

            if (state.currentView !== "practice") {

                showView("practice");

            } else {

                renderPractice();
            }
        }
    );
}

/* =========================
   FILTERS
========================= */

function setupFilters() {

    populateFilters();

    if ($("subjectFilter")) {

        $("subjectFilter").addEventListener(
            "change",
            function () {

                state.filters.subject =
                    this.value;

                renderPractice();
            }
        );
    }

    if ($("levelFilter")) {

        $("levelFilter").addEventListener(
            "change",
            function () {

                state.filters.level =
                    this.value;

                renderPractice();
            }
        );
    }
}

/* =========================
   NAV EVENTS
========================= */

function setupNavigation() {

    document.querySelectorAll(".nav-item")
        .forEach(item => {

            item.addEventListener(
                "click",
                function () {

                    const nav =
                        this.dataset.nav;

                    if (nav === "admin") {

                        openAdminLogin();

                    } else {

                        showView(nav);
                    }
                }
            );
        });
}

/* =========================
   SECURITY / PERMISSIONS
========================= */

function applySecurityRules() {

    const permissions = getPermissions();

    if (permissions.screenshots) {

        document.body.classList.remove(
            "screenshot-disabled"
        );

    } else {

        document.body.classList.add(
            "screenshot-disabled"
        );
    }

    if (!permissions.screenshots) {

        document.oncontextmenu = function () {
            return false;
        };

        document.onkeydown = function (event) {

            const key =
                String(event.key || "").toLowerCase();

            if (key === "printscreen") {

                showToast(
                    "Screenshot permission बंद है।"
                );

                event.preventDefault();

                return false;
            }

            if (
                (event.ctrlKey || event.metaKey) &&
                key === "s"
            ) {

                showToast(
                    "Save permission बंद है।"
                );

                event.preventDefault();

                return false;
            }

            if (
                event.ctrlKey &&
                event.shiftKey &&
                ["i", "j", "c"].includes(key)
            ) {

                event.preventDefault();

                return false;
            }
        };

    } else {

        document.oncontextmenu = null;
        document.onkeydown = null;
    }
}

/* =========================
   ADMIN BUTTONS
========================= */

function setupAdminControls() {

    if ($("screenshotsPermission")) {

        $("screenshotsPermission")
            .addEventListener(
                "change",
                saveAdminPermissions
            );
    }

    if ($("downloadsPermission")) {

        $("downloadsPermission")
            .addEventListener(
                "change",
                saveAdminPermissions
            );
    }

    const downloadButton =
        document.querySelector(
            "[data-download-results]"
        );

    if (downloadButton) {

        downloadButton.addEventListener(
            "click",
            downloadResults
        );
    }
}

/* =========================
   MODAL EVENTS
========================= */

function setupModalEvents() {

    if ($("quizClose")) {

        $("quizClose").addEventListener(
            "click",
            closeQuizModal
        );
    }

    if ($("quizNext")) {

        $("quizNext").addEventListener(
            "click",
            quizNext
        );
    }

    if ($("quizPrev")) {

        $("quizPrev").addEventListener(
            "click",
            quizPrev
        );
    }

    if ($("photoModal")) {

        $("photoModal").addEventListener(
            "click",
            function (event) {

                if (event.target === this) {
                    closePhotoPopup();
                }
            }
        );
    }

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                closeQuizModal();
                closePhotoPopup();
            }
        }
    );
}

/* =========================
   PHOTO EVENTS
========================= */

function setupPhotoEvents() {

    const upload =
        $("photoUpload");

    if (upload) {

        upload.addEventListener(
            "change",
            handlePhotoUpload
        );
    }

    [
        $("sidebarAvatar"),
        $("headerAvatar"),
        $("profileAvatar")
    ].forEach(img => {

        if (img) {

            img.style.cursor = "pointer";

            img.addEventListener(
                "click",
                openPhotoPopup
            );
        }
    });
}

/* =========================
   PROFILE EVENTS
========================= */

function setupProfileEvents() {

    const saveButton =
        document.querySelector(
            "[data-save-profile]"
        );

    if (saveButton) {

        saveButton.addEventListener(
            "click",
            saveProfile
        );
    }
}

/* =========================
   GLOBAL ERROR PROTECTION
========================= */

window.addEventListener(
    "error",
    function (event) {

        console.error(
            "Ankit Exam Hub Error:",
            event.error || event.message
        );
    }
);

/* =========================
   INITIALIZATION
========================= */

function initApp() {

    try {

        const admin =
            getStorage(
                STORAGE.admin,
                { loggedIn: false }
            );

        state.adminLoggedIn =
            !!admin.loggedIn;

        setupNavigation();
        setupSearch();
        setupFilters();
        setupAdminControls();
        setupModalEvents();
        setupPhotoEvents();
        setupProfileEvents();

        updateAllAvatars();

        /*
         * Dashboard तुरंत खुलेगा।
         * Login / access gate नहीं है।
         */
        showView("home");

        /*
         * Question bank background में तैयार होगा,
         * जिससे blank screen जैसी समस्या कम हो।
         */
        setTimeout(() => {

            try {

                ensureQuestionBank();

                renderHome();

            } catch (error) {

                console.error(
                    "Question bank error:",
                    error
                );

                showToast(
                    "Question bank load करने में समस्या हुई।"
                );
            }

        }, 50);

        applySecurityRules();

    } catch (error) {

        console.error(
            "App initialization error:",
            error
        );

        showToast(
            "App load करने में समस्या हुई। F5 दबाकर फिर खोलें।"
        );
    }
}

/* =========================
   START
========================= */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initApp
    );

} else {

    initApp();
}

/* =========================
   GLOBAL FUNCTIONS
========================= */

window.showView = showView;
window.startPracticeQuiz = startPracticeQuiz;
window.startSubjectQuiz = startSubjectQuiz;
window.startSingleQuestionQuiz = startSingleQuestionQuiz;

window.selectQuizAnswer = selectQuizAnswer;
window.quizNext = quizNext;
window.quizPrev = quizPrev;
window.closeQuizModal = closeQuizModal;

window.toggleBookmark = toggleBookmark;
window.removeWrong = removeWrong;

window.openPhotoPopup = openPhotoPopup;
window.closePhotoPopup = closePhotoPopup;
window.removeUserPhoto = removeUserPhoto;
window.saveProfile = saveProfile;

window.openAdminLogin = openAdminLogin;
window.adminLogout = adminLogout;
window.saveAdminPermissions = saveAdminPermissions;

window.downloadResults = downloadResults;