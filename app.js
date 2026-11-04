let currentExam = null;
let currentData = null;
let lessonLibrary = {};
let currentPracticeState = null;
let lastPracticeResult = null;
let rerenderCurrentView = null;
let currentLanguage = localStorage.getItem("mission-language") === "hi" ? "hi" : "en";

const ANSWER_PROMPTS = [
    {
        id: "federalism",
        exams: ["UPSC", "CGPSC"],
        words: 250,
        en: "Cooperative federalism depends not only on constitutional design but also on institutions, fiscal relations and political practice. Discuss with suitable examples.",
        hi: "सहकारी संघवाद केवल संवैधानिक व्यवस्था पर नहीं, बल्कि संस्थाओं, वित्तीय संबंधों और राजनीतिक व्यवहार पर भी निर्भर करता है। उपयुक्त उदाहरणों सहित चर्चा कीजिए।"
    },
    {
        id: "cg-local-governance",
        exams: ["CGPSC"],
        words: 200,
        en: "How can local self-government improve the delivery of public services in Chhattisgarh? Discuss the roles of devolution, local capacity and social accountability.",
        hi: "छत्तीसगढ़ में स्थानीय स्वशासन सार्वजनिक सेवाओं की आपूर्ति को कैसे बेहतर बना सकता है? विकेंद्रीकरण, स्थानीय क्षमता और सामाजिक जवाबदेही की भूमिका पर चर्चा कीजिए।"
    },
    {
        id: "climate-agriculture",
        exams: ["UPSC", "CGPSC"],
        words: 250,
        en: "Climate risks affect agriculture through water availability, heat stress and changing crop conditions. Examine a layered response involving farmers, state institutions and the Union government.",
        hi: "जलवायु जोखिम जल उपलब्धता, गर्मी के तनाव और फसल परिस्थितियों में बदलाव के माध्यम से कृषि को प्रभावित करते हैं। किसान, राज्य संस्थाओं और केंद्र सरकार की संयुक्त भूमिका से समाधान की समीक्षा कीजिए।"
    },
    {
        id: "tribal-development",
        exams: ["CGPSC"],
        words: 200,
        en: "Discuss how public policy can combine access to basic services with respect for the rights, knowledge and participation of Adivasi communities.",
        hi: "सार्वजनिक नीति आदिवासी समुदायों के अधिकारों, ज्ञान और भागीदारी का सम्मान करते हुए बुनियादी सेवाओं तक पहुँच कैसे सुनिश्चित कर सकती है? चर्चा कीजिए।"
    }
];

const STUDY_SOURCES = [
    {
        exams: ["UPSC"],
        label: { en: "UPSC examination and syllabus notices", hi: "UPSC परीक्षा एवं पाठ्यक्रम अधिसूचनाएँ" },
        detail: { en: "Use the latest examination notice as the controlling source for the official syllabus and scheme.", hi: "आधिकारिक पाठ्यक्रम और परीक्षा योजना के लिए नवीनतम परीक्षा अधिसूचना को मान्य स्रोत मानें।" },
        url: "https://upsc.gov.in/examinations/active-examinations"
    },
    {
        exams: ["UPSC"],
        label: { en: "UPSC previous question papers", hi: "UPSC के पिछले प्रश्नपत्र" },
        detail: { en: "Authentic past papers for timed practice; these are not reproduced in this platform unless explicitly labelled.", hi: "समयबद्ध अभ्यास के लिए वास्तविक पुराने प्रश्नपत्र; इन्हें मंच पर स्पष्ट उल्लेख के बिना PYQ नहीं कहा गया है।" },
        url: "https://upsc.gov.in/examinations/previous-question-papers"
    },
    {
        exams: ["CGPSC"],
        label: { en: "CGPSC State Service Examination 2025 advertisement", hi: "CGPSC राज्य सेवा परीक्षा 2025 विज्ञापन" },
        detail: { en: "Official advertisement and syllabus reference. Check subsequent corrigenda before relying on any detail.", hi: "आधिकारिक विज्ञापन और पाठ्यक्रम संदर्भ। किसी विवरण पर भरोसा करने से पहले बाद के शुद्धिपत्र भी देखें।" },
        url: "https://psc.cg.gov.in/PDFs/advertisement/STATE_SERVICE_EXAMINATION-2025_ADVERTISEMENT%20(26-11-2025).pdf"
    },
    {
        exams: ["CGPSC"],
        label: { en: "CGPSC notifications and corrigenda", hi: "CGPSC अधिसूचनाएँ और शुद्धिपत्र" },
        detail: { en: "Check for syllabus changes, exam notices and later corrections. A 2026 syllabus-feedback notice is a consultation, not a replacement syllabus.", hi: "पाठ्यक्रम बदलाव, परीक्षा सूचनाएँ और बाद के सुधार देखें। 2026 का पाठ्यक्रम-प्रतिक्रिया नोटिस परामर्श है, नया लागू पाठ्यक्रम नहीं।" },
        url: "https://psc.cg.gov.in/Notifications.php"
    },
    {
        exams: ["CGPSC"],
        label: { en: "CGPSC 2026 syllabus-revision feedback notice", hi: "CGPSC 2026 पाठ्यक्रम-संशोधन प्रतिक्रिया सूचना" },
        detail: { en: "Official consultation notice only; do not treat it as an adopted syllabus unless CGPSC issues a final notification.", hi: "यह केवल आधिकारिक परामर्श सूचना है; CGPSC की अंतिम अधिसूचना के बिना इसे लागू पाठ्यक्रम न मानें।" },
        url: "https://psc.cg.gov.in/PDFs/Notifications/SYLLABUS_REVISION_FEEDBACK_STATE_SERVICE_EXAMINATION%20(07-07-2026).pdf"
    },
    {
        exams: ["CGPSC"],
        label: { en: "CGPSC official model answers", hi: "CGPSC के आधिकारिक मॉडल उत्तर" },
        detail: { en: "Use official answer keys/model answers to check question interpretation and factual accuracy.", hi: "प्रश्न की व्याख्या और तथ्यात्मक शुद्धता जाँचने के लिए आधिकारिक उत्तर-कुंजी/मॉडल उत्तर देखें।" },
        url: "https://psc.cg.gov.in/Modelanswer.php"
    },
    {
        exams: ["CGPSC"],
        label: { en: "CGPSC Previous Year Papers — Prepp archive", hi: "CGPSC पिछले प्रश्नपत्र — Prepp संग्रह" },
        detail: { en: "Third-party archive listing prelims papers by year and separating GS Paper I from CSAT Paper II. Check each cycle/date against CGPSC notices and official model answers.", hi: "वर्षवार प्रारंभिक परीक्षा प्रश्नपत्रों का तृतीय-पक्ष संग्रह; GS Paper I और CSAT Paper II अलग हैं। हर परीक्षा-वर्ष/तिथि को CGPSC सूचना और आधिकारिक मॉडल उत्तरों से जाँचें।" },
        url: "https://prepp.in/cgpsc-exam/practice-papers"
    },
    {
        exams: ["CGPSC"],
        label: { en: "CGPSC 2025-cycle GS Paper I — Prepp attempt", hi: "CGPSC 2025 चक्र GS प्रश्नपत्र I — Prepp अभ्यास" },
        detail: { en: "Prepp labels this paper 22 February 2026 and lists 100 questions, 200 marks and 120 minutes. Third-party paper; verify the cycle and key with CGPSC.", hi: "Prepp इसे 22 फरवरी 2026 का प्रश्नपत्र बताता है और 100 प्रश्न, 200 अंक, 120 मिनट सूचीबद्ध करता है। तृतीय-पक्ष पेपर; परीक्षा-वर्ष और उत्तर CGPSC से सत्यापित करें।" },
        url: "https://prepp.in/paper/cgpsc-prelims-gs-question-paper-22-feb-2026-699bfa1a65daf4bd76abeffd"
    },
    {
        exams: ["CGPSC"],
        label: { en: "CGPSC 2025-cycle CSAT Paper II — Prepp attempt", hi: "CGPSC 2025 चक्र CSAT प्रश्नपत्र II — Prepp अभ्यास" },
        detail: { en: "Prepp labels this paper 22 February 2026 and lists 100 questions, 200 marks and 120 minutes. Third-party paper; verify the cycle and key with CGPSC.", hi: "Prepp इसे 22 फरवरी 2026 का प्रश्नपत्र बताता है और 100 प्रश्न, 200 अंक, 120 मिनट सूचीबद्ध करता है। तृतीय-पक्ष पेपर; परीक्षा-वर्ष और उत्तर CGPSC से सत्यापित करें।" },
        url: "https://prepp.in/paper/cgpsc-prelims-csat-question-paper-22-feb-2026-699c31dc90ffc2cc412c6551"
    },
    {
        exams: ["CGPSC"],
        label: { en: "CGPSC 2025 revised official prelims model answers", hi: "CGPSC 2025 संशोधित आधिकारिक प्रारंभिक परीक्षा मॉडल उत्तर" },
        detail: { en: "Commission-published amended model answer. Match the paper/year carefully; an answer key is not a substitute for the question paper.", hi: "आयोग द्वारा प्रकाशित संशोधित मॉडल उत्तर। प्रश्नपत्र/वर्ष का मिलान करें; उत्तर-कुंजी प्रश्नपत्र का विकल्प नहीं है।" },
        url: "https://psc.cg.gov.in/PDFs/MODEL_ANSWER/STATE_SERVICE_EXAMINATION-2025_PRELIMS_AMENDED_MODEL_ANSWER%20(25-03-2026).pdf"
    },
    {
        exams: ["UPSC", "CGPSC"],
        label: { en: "NCERT official textbooks", hi: "NCERT की आधिकारिक पाठ्यपुस्तकें" },
        detail: { en: "Use the relevant school-level textbooks for foundational history, geography, polity, economy and science.", hi: "इतिहास, भूगोल, राजव्यवस्था, अर्थव्यवस्था और विज्ञान की बुनियाद के लिए संबंधित स्कूली पाठ्यपुस्तकें पढ़ें।" },
        url: "https://ncert.nic.in/textbook.php"
    },
    {
        exams: ["UPSC", "CGPSC"],
        label: { en: "ePathshala digital textbooks", hi: "ई-पाठशाला डिजिटल पुस्तकें" },
        detail: { en: "Official digital access to NCERT learning material.", hi: "NCERT की अध्ययन सामग्री तक आधिकारिक डिजिटल पहुँच।" },
        url: "https://epathshala.nic.in/"
    },
    {
        exams: ["UPSC", "CGPSC"],
        label: { en: "Press Information Bureau", hi: "प्रेस सूचना ब्यूरो" },
        detail: { en: "Primary-source Union Government releases for schemes, policy and current affairs; verify claims against the issuing ministry.", hi: "योजनाओं, नीति और समसामयिकी के लिए केंद्र सरकार की मूल विज्ञप्तियाँ; तथ्यों को संबंधित मंत्रालय से मिलाएँ।" },
        url: "https://pib.gov.in/"
    },
    {
        exams: ["UPSC", "CGPSC"],
        label: { en: "Daily Current Affairs — Prepp notes, videos and quizzes", hi: "दैनिक समसामयिकी — Prepp नोट्स, वीडियो और क्विज़" },
        detail: { en: "Useful third-party daily reading and practice supplement. Check the publication date and verify important facts, schemes and data against the cited ministry or official report.", hi: "दैनिक अध्ययन और अभ्यास के लिए उपयोगी तृतीय-पक्ष स्रोत। प्रकाशन तिथि देखें और महत्त्वपूर्ण तथ्य, योजनाएँ व आँकड़े संबंधित मंत्रालय या आधिकारिक रिपोर्ट से सत्यापित करें।" },
        url: "https://prepp.in/current-affairs"
    },
    {
        exams: ["UPSC", "CGPSC"],
        label: { en: "Union Budget and Economic Survey", hi: "केंद्रीय बजट और आर्थिक सर्वेक्षण" },
        detail: { en: "Ministry of Finance source for the annual Budget, Economic Survey, receipts and expenditure documents.", hi: "वार्षिक बजट, आर्थिक सर्वेक्षण, प्राप्तियों और व्यय दस्तावेजों के लिए वित्त मंत्रालय का स्रोत।" },
        url: "https://www.indiabudget.gov.in/"
    },
    {
        exams: ["UPSC", "CGPSC"],
        label: { en: "Reserve Bank of India", hi: "भारतीय रिज़र्व बैंक" },
        detail: { en: "Official material on monetary policy, banking, inflation, payments and financial stability.", hi: "मौद्रिक नीति, बैंकिंग, मुद्रास्फीति, भुगतान और वित्तीय स्थिरता की आधिकारिक सामग्री।" },
        url: "https://www.rbi.org.in/"
    },
    {
        exams: ["UPSC", "CGPSC"],
        label: { en: "Ministry of Environment, Forest and Climate Change", hi: "पर्यावरण, वन और जलवायु परिवर्तन मंत्रालय" },
        detail: { en: "Primary government material on environmental law, conservation, protected areas and climate policy.", hi: "पर्यावरण कानून, संरक्षण, संरक्षित क्षेत्रों और जलवायु नीति की सरकारी मूल सामग्री।" },
        url: "https://moef.gov.in/"
    },
    {
        exams: ["CGPSC"],
        label: { en: "Government of Chhattisgarh", hi: "छत्तीसगढ़ शासन" },
        detail: { en: "State government departments, policies and service information; use the relevant department as the primary source.", hi: "राज्य शासन के विभाग, नीतियाँ और सेवाएँ; मूल जानकारी के लिए संबंधित विभाग देखें।" },
        url: "https://cgstate.gov.in/"
    }
];

const ANSWER_RUBRIC = [
    { id: "focus", en: "Directly answers the directive", hi: "प्रश्न के निर्देश का सीधा उत्तर" },
    { id: "structure", en: "Clear introduction, analysis and conclusion", hi: "स्पष्ट भूमिका, विश्लेषण और निष्कर्ष" },
    { id: "evidence", en: "Relevant facts, examples or constitutional links", hi: "उपयुक्त तथ्य, उदाहरण या संवैधानिक संदर्भ" },
    { id: "balance", en: "Balanced reasoning and feasible way forward", hi: "संतुलित तर्क और व्यावहारिक समाधान" }
];

const CURRICULUM_HI = {
    "General Studies Paper I": "सामान्य अध्ययन प्रश्नपत्र I",
    "General Studies Paper II — CSAT": "सामान्य अध्ययन प्रश्नपत्र II — CSAT",
    "General Studies Paper II — Aptitude": "सामान्य अध्ययन प्रश्नपत्र II — अभिक्षमता",
    "History": "इतिहास",
    "Indian Polity": "भारतीय राजव्यवस्था",
    "Geography": "भूगोल",
    "Indian Economy": "भारतीय अर्थव्यवस्था",
    "Environment and Ecology": "पर्यावरण एवं पारिस्थितिकी",
    "General Science and Technology": "सामान्य विज्ञान एवं प्रौद्योगिकी",
    "Current Affairs": "समसामयिकी",
    "Comprehension": "गद्यांश",
    "Basic Numeracy": "बुनियादी गणित",
    "History and Culture": "इतिहास एवं संस्कृति",
    "Indian Polity and Governance": "भारतीय राजव्यवस्था एवं शासन",
    "Economy": "अर्थव्यवस्था",
    "Mathematics": "गणित",
    "Reasoning": "तर्कशक्ति",
    "Ancient India": "प्राचीन भारत",
    "Modern India": "आधुनिक भारत",
    "Constitution of India": "भारत का संविधान",
    "Fundamental Rights": "मौलिक अधिकार",
    "Physical Geography": "भौतिक भूगोल",
    "Basic Economic Concepts": "अर्थशास्त्र की मूल अवधारणाएँ",
    "Fiscal Policy": "राजकोषीय नीति",
    "Reading Comprehension": "अपठित गद्यांश",
    "Percentage": "प्रतिशत",
    "Ratio and Proportion": "अनुपात और समानुपात",
    "Indian History": "भारतीय इतिहास",
    "History of Chhattisgarh": "छत्तीसगढ़ का इतिहास",
    "Chhattisgarh Culture": "छत्तीसगढ़ की संस्कृति",
    "Chhattisgarh Administration": "छत्तीसगढ़ प्रशासन",
    "Indian Geography": "भारत का भूगोल",
    "Geography of Chhattisgarh": "छत्तीसगढ़ का भूगोल",
    "Chhattisgarh Economy": "छत्तीसगढ़ की अर्थव्यवस्था",
    "Logical Reasoning": "तार्किक क्षमता",
    "Indus Valley Civilization": "सिंधु घाटी सभ्यता",
    "Vedic Age": "वैदिक काल",
    "Revolt of 1857": "1857 का विद्रोह",
    "Indian National Movement": "भारतीय राष्ट्रीय आंदोलन",
    "Making of the Constitution": "संविधान का निर्माण",
    "Preamble": "प्रस्तावना",
    "Salient Features of the Constitution": "संविधान की प्रमुख विशेषताएँ",
    "Article 12": "अनुच्छेद 12",
    "Article 14": "अनुच्छेद 14",
    "Article 19": "अनुच्छेद 19",
    "Article 21": "अनुच्छेद 21",
    "Article 32": "अनुच्छेद 32",
    "Structure of the Earth": "पृथ्वी की संरचना",
    "Rocks": "शैल",
    "Plate Tectonics": "प्लेट विवर्तनिकी",
    "GDP and National Income": "GDP और राष्ट्रीय आय",
    "Inflation": "मुद्रास्फीति",
    "Unemployment": "बेरोजगारी",
    "Government Budget": "सरकारी बजट",
    "Fiscal Deficit": "राजकोषीय घाटा",
    "Identifying the Main Idea": "मुख्य विचार की पहचान",
    "Inference": "अनुमान",
    "Basic Percentage": "मूल प्रतिशत",
    "Percentage Change": "प्रतिशत परिवर्तन",
    "Basic Ratio": "मूल अनुपात",
    "Ancient History of Chhattisgarh": "छत्तीसगढ़ का प्राचीन इतिहास",
    "Modern History of Chhattisgarh": "छत्तीसगढ़ का आधुनिक इतिहास",
    "Tribal Culture": "जनजातीय संस्कृति",
    "Folk Dance and Music": "लोक नृत्य और संगीत",
    "Directive Principles of State Policy": "राज्य के नीति निदेशक तत्त्व",
    "State Administration": "राज्य प्रशासन",
    "Local Government in Chhattisgarh": "छत्तीसगढ़ में स्थानीय शासन",
    "Indian Rivers": "भारत की नदियाँ",
    "Rivers of Chhattisgarh": "छत्तीसगढ़ की नदियाँ",
    "Soils of Chhattisgarh": "छत्तीसगढ़ की मिट्टियाँ",
    "Mineral Resources of Chhattisgarh": "छत्तीसगढ़ के खनिज संसाधन",
    "Agriculture in Chhattisgarh": "छत्तीसगढ़ में कृषि",
    "Industries of Chhattisgarh": "छत्तीसगढ़ के उद्योग",
    "Chhattisgarh Budget": "छत्तीसगढ़ का बजट",
    "Statement and Conclusion": "कथन और निष्कर्ष",
    "Syllogism": "न्यायवाक्य"
};

function curriculumName(name) {
    return currentLanguage === "hi" ? CURRICULUM_HI[name] || name : name;
}

const TRANSLATIONS = {
    en: {
        studentClassroom: "Student Classroom",
        welcomeTitle: "Welcome to Your Civil Services Classroom",
        welcomeSubtitle: "Study. Practice. Test. Analyse. Improve.",
        phase1Label: "Phase 1",
        phase1Text: "Bilingual subject notes, concept checks and exam-pattern practice for UPSC & CGPSC.",
        phase2Label: "Phase 2",
        phase2Text: "MCQ practice with exam timing, marking pattern, and answer explanations.",
        studyRoom: "Study Room",
        practiceLab: "Practice Lab",
        selectExam: "Select Examination",
        upscExamDescription: "Civil Services Preliminary Examination",
        cgpscExamDescription: "Chhattisgarh State Service Preliminary Examination",
        enterUpsc: "Enter UPSC Classroom",
        enterCgpsc: "Enter CGPSC Classroom",
        todaysPreparation: "Today's Preparation",
        homeStudy: "Study",
        continueTopic: "Continue your current topic",
        homePractice: "Practice",
        solveMcqs: "Solve today's MCQs",
        currentAffairs: "Current Affairs",
        readUpdates: "Read important updates",
        revision: "Revision",
        reviseWeakAreas: "Revise your weak areas",
        latestUpdates: "Latest Exam Updates",
        footerPlatform: "Personal Learning Platform",
        footerPurpose: "Built for learning and preparation.",
        choosePaper: "Choose Your Paper",
        chooseSubject: "Choose Subject",
        chooseChapter: "Choose Chapter",
        chooseTopic: "Choose Topic",
        enterPaper: "Enter Paper",
        studySubject: "Study Subject",
        openChapter: "Open Chapter",
        study: "Study",
        practice: "Practice",
        back: "Back",
        prelimsPrep: "Prelims Preparation",
        startPractice: "Start Practice",
        phaseStudyRoom: "PHASE 1 • STUDY ROOM",
        phasePractice: "PHASE 2 • PRACTICE",
        result: "RESULT",
        practiceResult: "Practice Result",
        backToStudy: "Back to Study",
        finishTest: "Finish Test",
        nextQuestion: "Next Question",
        retryTest: "Retry Test",
        reviseTopic: "Revise Topic",
        questionLabel: "Question",
        markingLabel: "Practice score: +1 per correct answer; no penalty simulation",
        timeLabel: "Time: 10 min",
        correctAnswer: "Correct answer",
        incorrectAnswer: "Incorrect answer",
        yourAnswer: "Your answer",
        logicLabel: "Logic",
        notAttempted: "Not attempted",
        correctAnswers: "Correct Answers",
        score: "Score",
        timeLeft: "Time Left",
        live: "LIVE",
        examUpdateText: "Use the official UPSC and CGPSC portals to verify current notices, dates and syllabus changes. This page does not fetch live updates.",
        examUpdateStrong: "Official Notifications"
    },
    hi: {
        studentClassroom: "विद्यार्थी कक्षा",
        welcomeTitle: "आपका सिविल सर्विसेज क्लासरूम में स्वागत है",
        welcomeSubtitle: "अध्ययन करें। अभ्यास करें। परीक्षण करें। विश्लेषण करें। सुधार करें।",
        phase1Label: "चरण 1",
        phase1Text: "UPSC और CGPSC के लिए विषयवार द्विभाषी नोट्स, अवधारणा अभ्यास और परीक्षा-शैली प्रश्न।",
        phase2Label: "चरण 2",
        phase2Text: "MCQ अभ्यास, परीक्षा समय, अंकन प्रणाली और उत्तर की व्याख्या।",
        studyRoom: "अध्ययन कक्ष",
        practiceLab: "अभ्यास प्रयोगशाला",
        selectExam: "परीक्षा चुनें",
        upscExamDescription: "सिविल सेवा प्रारंभिक परीक्षा",
        cgpscExamDescription: "छत्तीसगढ़ राज्य सेवा प्रारंभिक परीक्षा",
        enterUpsc: "UPSC कक्षा खोलें",
        enterCgpsc: "CGPSC कक्षा खोलें",
        todaysPreparation: "आज की तैयारी",
        homeStudy: "अध्ययन",
        continueTopic: "अपना वर्तमान विषय जारी रखें",
        homePractice: "अभ्यास",
        solveMcqs: "आज के MCQ हल करें",
        currentAffairs: "समसामयिकी",
        readUpdates: "महत्त्वपूर्ण अपडेट पढ़ें",
        revision: "पुनरावृत्ति",
        reviseWeakAreas: "कमज़ोर विषयों को दोहराएँ",
        latestUpdates: "नवीनतम परीक्षा अपडेट",
        footerPlatform: "व्यक्तिगत अध्ययन मंच",
        footerPurpose: "अध्ययन और परीक्षा तैयारी के लिए।",
        choosePaper: "अपना पेपर चुनें",
        chooseSubject: "विषय चुनें",
        chooseChapter: "अध्याय चुनें",
        chooseTopic: "विषय चुनें",
        enterPaper: "पेपर में प्रवेश",
        studySubject: "विषय पढ़ें",
        openChapter: "अध्याय खोलें",
        study: "पढ़ें",
        practice: "अभ्यास",
        back: "पीछे",
        prelimsPrep: "प्रिलिम्स तैयारी",
        startPractice: "अभ्यास शुरू करें",
        phaseStudyRoom: "चरण 1 • अध्ययन कक्ष",
        phasePractice: "चरण 2 • अभ्यास",
        result: "परिणाम",
        practiceResult: "अभ्यास परिणाम",
        backToStudy: "अध्ययन पर लौटें",
        finishTest: "परीक्षा समाप्त करें",
        nextQuestion: "अगला प्रश्न",
        retryTest: "पुनः प्रयास",
        reviseTopic: "विषय दोबारा सीखें",
        questionLabel: "प्रश्न",
        markingLabel: "अभ्यास अंक: सही उत्तर पर +1; नकारात्मक अंकन लागू नहीं",
        timeLabel: "समय: 10 मिनट",
        correctAnswer: "सही उत्तर",
        incorrectAnswer: "गलत उत्तर",
        yourAnswer: "आपका उत्तर",
        logicLabel: "तर्क",
        notAttempted: "प्रयास नहीं किया गया",
        correctAnswers: "सही उत्तर",
        score: "अंक",
        timeLeft: "बाकी समय",
        live: "लाइव",
        examUpdateText: "वर्तमान अधिसूचनाओं, तिथियों और पाठ्यक्रम बदलावों की पुष्टि UPSC तथा CGPSC के आधिकारिक पोर्टल से करें। यह पृष्ठ लाइव अपडेट स्वतः नहीं लाता।",
        examUpdateStrong: "आधिकारिक अधिसूचनाएँ"
    }
};

function t(key) {
    return (TRANSLATIONS[currentLanguage] && TRANSLATIONS[currentLanguage][key]) || TRANSLATIONS.en[key] || key;
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function safeQuote(value) {
    return String(value)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, "&quot;");
}

function setupLanguageToggle() {
    document.querySelectorAll(".lang-btn").forEach((button) => {
        button.addEventListener("click", () => {
            currentLanguage = button.dataset.lang;
            localStorage.setItem("mission-language", currentLanguage);
            document.querySelectorAll(".lang-btn").forEach((btn) => {
                btn.classList.toggle("active", btn.dataset.lang === currentLanguage);
            });
            applyTranslations();
            if (currentExam) {
                if (currentPracticeState) {
                    currentPracticeState.questions = currentPracticeState.isMixedMock
                        ? buildMixedMockQuestions(currentPracticeState.mockQuestionIds)
                        : getPracticeQuestions(
                            currentPracticeState.topicId,
                            currentPracticeState.topicName,
                            currentExam
                        );
                    renderPracticeQuestion();
                } else if (lastPracticeResult) {
                    lastPracticeResult.questions = lastPracticeResult.isMixedMock
                        ? buildMixedMockQuestions(lastPracticeResult.mockQuestionIds)
                        : getPracticeQuestions(
                            lastPracticeResult.topicId,
                            lastPracticeResult.topicName,
                            currentExam
                        );
                    renderPracticeResult(lastPracticeResult);
                } else if (document.querySelector("#classroom").style.display === "block" && rerenderCurrentView) {
                    rerenderCurrentView();
                }
            }
        });
    });
}

function applyTranslations() {
    document.documentElement.lang = currentLanguage;
    document.querySelectorAll(".lang-btn").forEach((button) => {
        button.classList.toggle("active", button.dataset.lang === currentLanguage);
    });

    document.querySelectorAll("[data-i18n]").forEach((element) => {
        const key = element.dataset.i18n;
        if (TRANSLATIONS[currentLanguage][key]) {
            element.textContent = t(key);
        }
    });

    const studentArea = document.getElementById("student-area-label");
    if (studentArea) studentArea.textContent = t("studentClassroom");

    const updateSystem = document.querySelector(".update-box strong");
    if (updateSystem) updateSystem.textContent = t("examUpdateStrong");

    const updateText = document.querySelector(".update-box p");
    if (updateText) updateText.textContent = t("examUpdateText");

    const classroomTitle = document.getElementById("classroom-title");
    if (classroomTitle && currentExam) {
        const roomName = currentLanguage === "hi" ? "क्लासरूम" : "Classroom";
        classroomTitle.textContent = currentExam + " " + roomName;
    }

    const classroomSubtitle = document.getElementById("classroom-subtitle");
    if (classroomSubtitle) classroomSubtitle.textContent = t("prelimsPrep");

    const backButton = document.getElementById("back-button");
    if (backButton) {
        backButton.textContent = currentLanguage === "hi" ? "← पीछे" : "← Back";
    }
}

function updateBreadcrumb(parts) {
    const breadcrumb = document.getElementById("breadcrumb");
    const cleaned = parts.filter(Boolean);

    breadcrumb.innerHTML = cleaned.map((part, index) => {
        const prefix = index > 0 ? "<span>›</span>" : "";
        return `${prefix}<span>${escapeHtml(curriculumName(part))}</span>`;
    }).join("");
}

function mergeCurriculumExpansion(examData, expansionData) {
    const examExpansion = expansionData[examData.exam];
    if (!examExpansion || !Array.isArray(examExpansion.papers)) {
        throw new Error(`No expanded curriculum is available for ${examData.exam}.`);
    }

    examExpansion.papers.forEach((paperExpansion) => {
        const paper = examData.papers.find((item) => item.id === paperExpansion.id);
        if (!paper) {
            throw new Error(`Expanded curriculum references unknown paper ${paperExpansion.id}.`);
        }

        paperExpansion.subjects.forEach((subjectExpansion) => {
            let subject = paper.subjects.find((item) => item.id === subjectExpansion.id);
            if (!subject) {
                subject = {
                    id: subjectExpansion.id,
                    name: subjectExpansion.name,
                    chapters: []
                };
                paper.subjects.push(subject);
            }

            const existingChapterIds = new Set(subject.chapters.map((chapter) => chapter.id));
            subjectExpansion.chapters.forEach((chapter) => {
                if (!existingChapterIds.has(chapter.id)) {
                    subject.chapters.push(chapter);
                }
            });
        });
    });

    return examData;
}

function buildStudySummary(topicId, topicName, subjectName, chapterName) {
    const lesson = lessonLibrary[topicId];
    if (lesson) return lesson;

    const examLabel = currentExam === "UPSC"
        ? (currentLanguage === "hi" ? "सिविल सेवा प्रारंभिक परीक्षा" : "Civil Services Preliminary Examination")
        : (currentLanguage === "hi" ? "राज्य सेवा प्रारंभिक परीक्षा" : "State Services Preliminary Examination");

    const intro = currentLanguage === "hi"
        ? `${topicName} ${examLabel} का एक प्रधान क्षेत्र है। प्रभावी तैयारी के लिए संकल्पना, ताज़ा घटनाक्रम, आधिकारिक नोटिफिकेशन और प्रश्न-तर्क दोनों को समझना जरूरी है। MCQ हल करने से पहले विषय की आधारभूत संरचना, इतिहास, अर्थशास्त्र, संवैधानिक प्रावधान या प्रशासनिक संदर्भ को अच्छी तरह समझें।`
        : `${topicName} is a core area for ${examLabel}. A strong answer should combine conceptual clarity, current developments, official notifications, and question-approach strategy. Always revise the constitutional, historical, economic, or administrative framework behind the topic before attempting MCQs.`;

    const concept = currentLanguage === "hi"
        ? `${topicName} की तैयारी में परिभाषा, आधार, समय-क्रम, मुख्य तथ्य और विषय से जुड़े महत्त्वपूर्ण बिंदु समझें। एक साफ ढांचा बनाइए: यह क्या है, यह क्यों महत्वपूर्ण है, यह पाठ्यक्रम से कैसे जुड़ता है, और प्रश्नों में यह किस रूप में पूछा जाता है।`
        : `Study ${topicName} from the basic principle, definitions, chronology, and core themes. Build a clean structure: what it is, why it matters, where it connects to the syllabus, and how it appears in questions.`;

    const perspective = currentLanguage === "hi"
        ? `${currentExam} प्रश्न स्मरण से अधिक आवेदन पर आधारित होते हैं। मुख्य शब्द, संविधान के अनुच्छेद, नवीन संशोधन, सरकारी योजनाएँ, आर्थिक आंकड़े और राज्य-विशेष संदर्भ पर ध्यान दें। इस विषय को करेंट अफेयर्स और आधिकारिक रिपोर्ट्स से जोड़ें।`
        : `${currentExam} questions usually test application over memory. Focus on keywords, constitutional articles, recent amendments, government schemes, economic data, and state-specific context. This topic should be linked with current affairs and official reports.`;

    const amendments = currentLanguage === "hi"
        ? `${currentExam} के लिए ${topicName} से जुड़े ताज़ा संशोधन, आधिकारिक अधिसूचनाएँ, नीतिगत परिवर्तन और नवीन आँकड़े पढ़ें। अद्यतन समझ के लिए अधिकृत आयोग पोर्टल, सरकारी नोटिफिकेशन और वार्षिक रिपोर्ट का उपयोग करें।`
        : `For ${currentExam}, revise the latest amendments, official notifications, policy changes, and recent data points linked to ${topicName}. Use the authorised commission portal, government notifications, and annual reports for updated understanding.`;

    const pyqs = currentLanguage === "hi"
        ? `पिछले वर्षों के प्रश्नों को ‘कौन-सा’, ‘क्यों’, ‘सबसे उचित’, ‘अपवाद’ जैसे शब्दों के आधार पर समझें। सही तैयारी का तरीका है- अवधारणा, तथ्य, उदाहरण और आधिकारिक अपडेट को मिलाकर अभ्यास करना।`
        : `Practice previous-year questions by identifying command words like 'Which', 'Why', 'Most appropriate', and 'Exception'. The best way to learn is to match the concept with facts, examples, and the current official updates.`;

    return { intro, concept, perspective, amendments, pyqs };
}

function getPracticeQuestions(topicId, topicName, examName) {
    const sourceUrl = "";
    const authoredLesson = lessonLibrary[topicId];
    if (authoredLesson && authoredLesson.questions) {
        return authoredLesson.questions.map((question) => ({
            question: question.question[currentLanguage],
            options: question.options[currentLanguage],
            correct: question.correct,
            explanation: question.explanation[currentLanguage],
            sourceUrl
        }));
    }

    const examContext = examName === "UPSC"
        ? (currentLanguage === "hi" ? "सिविल सेवा प्रीलिम्स" : "Civil Services prelims")
        : (currentLanguage === "hi" ? "CGPSC प्रीलिम्स" : "CGPSC prelims");

    const questions = [
        {
            question: currentLanguage === "hi"
                ? `${topicName} का ${examContext} में परीक्षा महत्व किस कथन से सबसे सही रूप में व्यक्त होता है?`
                : `Which statement best captures the exam relevance of ${topicName} in ${examContext}?`,
            options: currentLanguage === "hi"
                ? [
                    "यह केवल सैद्धांतिक तथ्य है और परीक्षा में उसका सीधा महत्व नहीं है।",
                    "यह मुख्य पाठ्यक्रम, नीति व्याख्या और प्रीलिम्स में वस्तुनिष्ठ उपयोग से जुड़ा हुआ है।",
                    "यह केवल निबंध लेखन के लिए उपयोगी है, MCQ अभ्यास के लिए नहीं।",
                    "यह केवल समाचार सारांश में पूछे जाने पर ही प्रासंगिक है।"
                ]
                : [
                    "It is only a theoretical fact and has no direct exam value.",
                    "It connects with core syllabus themes, policy interpretation, and objective applications in prelims.",
                    "It is useful only for essay writing, not for MCQ practice.",
                    "It is only relevant if asked directly in the news summary."
                ],
            correct: 1,
            explanation: currentLanguage === "hi"
                ? `${topicName} महत्वपूर्ण है क्योंकि प्रीलिम्स में अवधारणात्मक स्पष्टता, तथ्यात्मक सटीकता और विषय को नीति, प्रशासन, इतिहास, अर्थव्यवस्था या शासन से जोड़ने की क्षमता पर प्रश्न पूछे जाते हैं।`
                : `${topicName} is relevant because prelims tests conceptual clarity, factual accuracy, and the ability to connect a concept with policy, administration, history, economy, or governance.`,
            sourceUrl
        },
        {
            question: currentLanguage === "hi"
                ? `${topicName} की तैयारी के लिए MCQ से पहले सबसे प्रभावी तरीका क्या है?`
                : `What is the most effective way to prepare for ${topicName} before attempting MCQs?`,
            options: currentLanguage === "hi"
                ? [
                    "केवल एक लाइन याद करें बिना किसी संदर्भ के।",
                    "परिभाषा, उदाहरण, योजना या अनुच्छेद संबंध, और नवीन अपडेट को पढ़ें।",
                    "सभी करेंट अफेयर्स छोड़ दें और केवल तिथियाँ याद करें।",
                    "केवल अध्याय सारांश का पुनरावलोकन करें।"
                ]
                : [
                    "Memorise only one line without any context.",
                    "Read definitions, key examples, scheme or article linkages, and recent updates.",
                    "Skip all current affairs and focus only on dates.",
                    "Only revise the chapter summary at the end."
                ],
            correct: 1,
            explanation: currentLanguage === "hi"
                ? "सबसे मजबूत तैयारी का तरीका आधारभूत समझ, उदाहरण, नवीन विकास और आधिकारिक स्रोतों का संतुलित मेल है, क्योंकि प्रीलिम्स में समझ और सही प्रयोग दोनों को महत्व मिलता है।"
                : "The strongest preparation approach combines fundamentals, examples, recent developments, and official sources, because prelims reward understanding plus quick application.",
            sourceUrl
        },
        {
            question: currentLanguage === "hi"
                ? `${topicName} का अध्ययन करते समय सबसे सही परीक्षा रणनीति क्या है?`
                : `Which of the following is the best exam strategy while studying ${topicName}?`,
            options: currentLanguage === "hi"
                ? [
                    "आधिकारिक सरकारी स्रोतों को छोड़कर केवल सोशल मीडिया सारांश पर भरोसा करें।",
                    "विषय को संविधान के प्रावधान, विधि, सरकारी योजनाओं और वर्तमान घटनाक्रम से जोड़ें।",
                    "एक बार पढ़ने के बाद पुनरावृत्ति छोड़ दें।",
                    "केवल तथ्यात्मक स्मरण पूछे जाने वाले प्रश्नों की तैयारी करें।"
                ]
                : [
                    "Ignore official government sources and rely only on social media summaries.",
                    "Link the topic with constitutional provisions, statutes, government schemes, and current developments.",
                    "Skip revision after one reading.",
                    "Only prepare for direct factual memory questions."
                ],
            correct: 1,
            explanation: currentLanguage === "hi"
                ? "सिद्धांत को आधिकारिक स्रोत, कानूनी प्रावधान, नीतिगत विकास और उदाहरणों से जोड़ने से प्रीलिम्स प्रश्नों में सटीकता और स्मरण क्षमता दोनों बढ़ती है।"
                : "Linking theory to official sources, legal provisions, policy developments, and examples improves both accuracy and retention for prelims questions.",
            sourceUrl
        },
        {
            question: currentLanguage === "hi"
                ? `समयबद्ध प्रीलिम्स मॉक टेस्ट में ${topicName} के लिए सबसे उपयोगी पुनरावृत्ति विधि कौन-सी है?`
                : `Which revision method is most useful for ${topicName} in a timed prelims mock?`,
            options: currentLanguage === "hi"
                ? [
                    "स्रोत की जाँच किए बिना पहले विचार पर भरोसा करें।",
                    "मुख्य तथ्य, सही सिद्धांत और विकल्पों में फँसाने वाला ट्रैप समझें।",
                    "केवल प्रश्न के Beginning पर ध्यान दें और व्याख्या को अनदेखा करें।",
                    "समय सीमा तय किए बिना परीक्षा दें।"
                ]
                : [
                    "Use first impression logic without checking the source.",
                    "Revisit the key fact, the correct principle, and the likely trap in the option set.",
                    "Focus only on the question stem and ignore the explanation.",
                    "Attempt the paper without setting a time limit."
                ],
            correct: 1,
            explanation: currentLanguage === "hi"
                ? "समयबद्ध अभ्यास में सबसे अच्छी विधि है- मुख्य तथ्य को फिर से समझना, ट्रैप पहचानना और सही उत्तर के तर्क को समझना। इससे सटीकता बढ़ती है और अनुमान कम होता है।"
                : "In timed practice, the best method is to revisit the central fact, identify the trap, and understand the logic behind the correct answer. This improves accuracy and reduces guesswork.",
            sourceUrl
        },
        {
            question: currentLanguage === "hi"
                ? `${topicName} पर अभ्यास परीक्षण के बाद सबसे सही निष्कर्ष क्या है?`
                : `What is the most correct conclusion after a practice test on ${topicName}?`,
            options: currentLanguage === "hi"
                ? [
                    "यदि उत्तर सही भी है तो समीक्षा बिना ही छोड़ दें।",
                    "सही उत्तर, तर्क और आधिकारिक स्रोत की समीक्षा करके समझ की कमी दूर करें।",
                    "परीक्षा खत्म होने के बाद गलतियाँ दोबारा पढ़ने की जरूरत नहीं है।",
                    "अंकन प्रणाली आपकी समझ से अलग है।"
                ]
                : [
                    "Any answer guessed correctly is enough without review.",
                    "Review the correct answer, logic, and official source to correct conceptual gaps.",
                    "No need to revisit mistakes after the test ends.",
                    "The mark pattern is irrelevant to your understanding."
                ],
            correct: 1,
            explanation: currentLanguage === "hi"
                ? "सही सीखने की श्रृंखला है- प्रयास करें, समीक्षा करें, तर्क पहचानें, और विश्वसनीय स्रोतों से विषय को फिर से पढ़ें। यही तरीका सहीता और गति को बढ़ाता है।"
                : "The learning loop is: attempt, review, identify the logic, and revise the concept from trusted sources. This is how a student improves accuracy and speed over time.",
            sourceUrl
        }
    ];

    return questions;
}

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function startPracticeTimer() {
    if (!currentPracticeState) return;

    currentPracticeState.timerId = setInterval(() => {
        if (!currentPracticeState) return;

        currentPracticeState.timeLeft -= 1;

        const timer = document.getElementById("practice-timer");
        if (timer) {
            timer.textContent = formatTime(currentPracticeState.timeLeft);
        }

        if (currentPracticeState.timeLeft <= 0) {
            clearInterval(currentPracticeState.timerId);
            finishPractice();
        }
    }, 1000);
}

function renderPracticeQuestion() {
    if (!currentPracticeState) return;

    const container = document.getElementById("classroom-content");
    const question = currentPracticeState.questions[currentPracticeState.index];
    const selectedIndex = currentPracticeState.selected[currentPracticeState.index];
    const total = currentPracticeState.questions.length;

    updateBreadcrumb([
        currentExam,
        currentPracticeState.subjectName,
        currentPracticeState.chapterName,
        currentPracticeState.topicName,
        t("practice")
    ]);

    container.innerHTML = `
        <div class="practice-page">
            <div class="study-page-header">
                <div>
                    <div class="study-label">${t("phasePractice")}</div>
                    <h2>${escapeHtml(curriculumName(currentPracticeState.topicName))}</h2>
                </div>
                <div class="timer-pill" id="practice-timer">${formatTime(currentPracticeState.timeLeft)}</div>
            </div>

            <div class="practice-meta">
                <span>${t("questionLabel")} ${currentPracticeState.index + 1} / ${total}</span>
                <span>${t("markingLabel")}</span>
                <span>${currentLanguage === "hi" ? "समय" : "Time"}: ${Math.ceil((currentPracticeState.timeLimit || 600) / 60)} ${currentLanguage === "hi" ? "मिनट" : "min"}</span>
            </div>

            ${currentPracticeState.isMixedMock ? `<p class="mock-disclaimer">${currentLanguage === "hi" ? "यह उपलब्ध पाठ्यक्रम प्रश्नों से बना अनुशंसित अभ्यास-पत्र है; यह पूर्ण आधिकारिक पेपर या PYQ नहीं है। वास्तविक पिछले प्रश्नपत्र के लिए आधिकारिक आयोग स्रोत देखें।" : "This recommended practice paper uses all currently available syllabus questions; it is not a full official paper or a PYQ. Use the official commission source for authentic past papers."}</p>` : ""}

            <div class="question-card">
                ${question.topicName ? `<div class="question-topic">${escapeHtml(curriculumName(question.topicName))}</div>` : ""}
                <h3>${escapeHtml(question.question)}</h3>

                <div class="option-list">
                    ${question.options.map((option, optionIndex) => {
                        let classes = ["option-btn"];

                        if (selectedIndex !== undefined) {
                            if (currentPracticeState.isMixedMock) {
                                if (optionIndex === selectedIndex) classes.push("selected");
                            } else {
                                if (optionIndex === question.correct) classes.push("correct");
                                if (optionIndex === selectedIndex && optionIndex !== question.correct) classes.push("wrong");
                                if (optionIndex === selectedIndex) classes.push("selected");
                            }
                        }

                        return `
                            <button
                                type="button"
                                class="${classes.join(" ")}"
                                data-index="${optionIndex}"
                                ${selectedIndex !== undefined && !currentPracticeState.isMixedMock ? "disabled" : ""}
                            >
                                <span>${String.fromCharCode(65 + optionIndex)}.</span>
                                ${escapeHtml(option)}
                            </button>
                        `;
                    }).join("")}
                </div>

                ${selectedIndex !== undefined && !currentPracticeState.isMixedMock ? `
                    <div class="answer-feedback ${selectedIndex === question.correct ? "success" : "error"}">
                        <strong>${selectedIndex === question.correct ? t("correctAnswer") : t("incorrectAnswer")}:</strong>
                        ${escapeHtml(question.options[question.correct])}. ${escapeHtml(question.explanation)}
                    </div>
                ` : ""}
            </div>

            <div class="practice-actions">
                ${currentPracticeState.isMixedMock
                    ? `<button class="secondary-btn" onclick="movePracticePrevious()" ${currentPracticeState.index === 0 ? "disabled" : ""}>← ${currentLanguage === "hi" ? "पिछला" : "Previous"}</button>`
                    : `<button class="secondary-btn" onclick="openStudy('${safeQuote(currentPracticeState.topicId)}', '${safeQuote(currentPracticeState.topicName)}', '${safeQuote(currentPracticeState.subjectName)}', '${safeQuote(currentPracticeState.chapterName)}')">← ${t("backToStudy")}</button>`}

                ${currentPracticeState.isMixedMock || selectedIndex !== undefined ? `
                    <button onclick="movePracticeNext()">
                        ${currentPracticeState.index === total - 1
                            ? (currentPracticeState.isMixedMock ? (currentLanguage === "hi" ? "मॉक जमा करें" : "Submit mock") : t("finishTest"))
                            : t("nextQuestion")} →
                    </button>
                ` : ""}
            </div>
        </div>
    `;

    document.querySelectorAll(".option-btn").forEach((button) => {
        button.addEventListener("click", () => {
            const selected = Number(button.dataset.index);
            if (currentPracticeState.isMixedMock) {
                currentPracticeState.selected[currentPracticeState.index] = selected;
                renderPracticeQuestion();
                return;
            }
            if (currentPracticeState.selected[currentPracticeState.index] !== undefined) return;

            currentPracticeState.selected[currentPracticeState.index] = selected;

            if (selected === currentPracticeState.questions[currentPracticeState.index].correct) {
                currentPracticeState.score = (currentPracticeState.score || 0) + 1;
            }

            renderPracticeQuestion();
        });
    });
}

function movePracticeNext() {
    if (!currentPracticeState) return;

    if (currentPracticeState.index < currentPracticeState.questions.length - 1) {
        currentPracticeState.index += 1;
        renderPracticeQuestion();
        return;
    }

    finishPractice();
}

function movePracticePrevious() {
    if (!currentPracticeState || currentPracticeState.index === 0) return;
    currentPracticeState.index -= 1;
    renderPracticeQuestion();
}

function finishPractice() {
    if (!currentPracticeState) return;

    clearInterval(currentPracticeState.timerId);
    lastPracticeResult = { ...currentPracticeState };
    currentPracticeState = null;
    renderPracticeResult(lastPracticeResult);
}

function renderPracticeResult(practiceResult) {
    rerenderCurrentView = () => renderPracticeResult(practiceResult);

    const totalQuestions = practiceResult.questions.length;
    const correctAnswers = practiceResult.questions.reduce((count, question, index) => {
        return count + (practiceResult.selected[index] === question.correct ? 1 : 0);
    }, 0);
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    const container = document.getElementById("classroom-content");
    container.innerHTML = `
        <div class="result-page">
            <div class="study-label">${t("result")}</div>
            <h2>${t("practiceResult")}</h2>

            <div class="score-grid">
                <div class="score-card">
                    <strong>${correctAnswers}/${totalQuestions}</strong>
                    <span>${t("correctAnswers")}</span>
                </div>
                <div class="score-card">
                    <strong>${percentage}%</strong>
                    <span>${t("score")}</span>
                </div>
                <div class="score-card">
                    <strong>${formatTime(practiceResult.timeLeft)}</strong>
                    <span>${t("timeLeft")}</span>
                </div>
            </div>

            <div class="result-list">
                ${practiceResult.questions.map((question, index) => {
                    const picked = practiceResult.selected[index];
                    const isCorrect = picked === question.correct;

                    return `
                        <div class="result-card ${isCorrect ? "success" : "error"}">
                            <h3>Q${index + 1}. ${escapeHtml(question.question)}</h3>
                            <p><strong>${t("yourAnswer")}:</strong> ${picked === undefined ? t("notAttempted") : escapeHtml(question.options[picked])}</p>
                            <p><strong>${t("correctAnswer")}:</strong> ${escapeHtml(question.options[question.correct])}</p>
                            <p><strong>${t("logicLabel")}:</strong> ${escapeHtml(question.explanation)}</p>
                            <p class="lesson-origin">${currentLanguage === "hi" ? "यह प्रश्न पाठ्यक्रम अभ्यास के लिए तैयार किए गए हैं; आधिकारिक PYQ नहीं हैं।" : "Original syllabus practice question; not an official PYQ."}</p>
                        </div>
                    `;
                }).join("")}
            </div>

            <div class="practice-actions">
                <button onclick="${practiceResult.isMixedMock ? "startMixedMock()" : `openPractice('${safeQuote(practiceResult.topicId)}', '${safeQuote(practiceResult.topicName)}', '${safeQuote(practiceResult.subjectName)}', '${safeQuote(practiceResult.chapterName)}')`}">
                    ${t("retryTest")}
                </button>
                <button class="secondary-btn" onclick="${practiceResult.isMixedMock ? "showPapers()" : `openStudy('${safeQuote(practiceResult.topicId)}', '${safeQuote(practiceResult.topicName)}', '${safeQuote(practiceResult.subjectName)}', '${safeQuote(practiceResult.chapterName)}')`}">
                    ${t("reviseTopic")}
                </button>
            </div>
        </div>
    `;
}

async function openExam(examName) {
    currentExam = examName;

    try {
        let file;

        if (examName === "UPSC") {
            file = "data/upsc.json";
        } else if (examName === "CGPSC") {
            file = "data/cgpsc.json";
        } else {
            return;
        }

        const [response, lessonsResponse, expansionResponse, curriculumResponse] = await Promise.all([
            fetch(file),
            fetch("data/lessons.json?v=20261004-2"),
            fetch("data/lesson-expansion.json?v=20261008-2"),
            fetch("data/curriculum-expansion.json?v=20261104-3")
        ]);

        if (!response.ok || !lessonsResponse.ok || !expansionResponse.ok || !curriculumResponse.ok) {
            throw new Error("Unable to load exam data.");
        }

        const [examData, authoredLessons, expandedLessons, curriculumExpansion] = await Promise.all([
            response.json(),
            lessonsResponse.json(),
            expansionResponse.json(),
            curriculumResponse.json()
        ]);
        currentData = mergeCurriculumExpansion(examData, curriculumExpansion);
        lessonLibrary = { ...authoredLessons, ...expandedLessons };

        document.querySelector(".welcome-section").style.display = "none";
        document.querySelector(".exam-section").style.display = "none";
        document.querySelector(".today-section").style.display = "none";
        document.querySelector(".update-section").style.display = "none";

        document.querySelector("#classroom").style.display = "block";
        document.querySelector("#classroom-title").textContent = currentExam + " Classroom";
        document.querySelector("#classroom-subtitle").textContent = t("prelimsPrep");

        showPapers();
    } catch (error) {
        console.error(error);
        alert(currentLanguage === "hi"
            ? "क्लासरूम लोड नहीं हो सका। कृपया फाइलें जाँचें।"
            : "Unable to load the classroom. Please check your files.");
    }
}

function showPapers() {
    rerenderCurrentView = showPapers;
    const container = document.getElementById("classroom-content");
    updateBreadcrumb([currentExam]);
    container.innerHTML = "";

    const heading = document.createElement("h3");
    heading.textContent = t("choosePaper");
    container.appendChild(heading);

    const grid = document.createElement("div");
    grid.className = "classroom-grid";
    const examQuestions = collectExamQuestions();

    currentData.papers.forEach((paper) => {
        const card = document.createElement("div");
        card.className = "classroom-card";
        const subjectCount = paper.subjects.length;
        const chapters = paper.subjects.reduce((count, subject) => count + subject.chapters.length, 0);
        const topics = paper.subjects.reduce((count, subject) => (
            count + subject.chapters.reduce((chapterCount, chapter) => chapterCount + chapter.topics.length, 0)
        ), 0);
        const paperQuestionCount = examQuestions.filter((record) => record.paperId === paper.id).length;
        card.innerHTML = `
            <div class="classroom-icon">📚</div>
            <h3>${escapeHtml(curriculumName(paper.name))}</h3>
            <p>${subjectCount} ${currentLanguage === "hi" ? "विषय" : subjectCount === 1 ? "subject" : "subjects"} · ${chapters} ${currentLanguage === "hi" ? "अध्याय" : chapters === 1 ? "chapter" : "chapters"} · ${topics} ${currentLanguage === "hi" ? "उपविषय" : topics === 1 ? "topic" : "topics"}</p>
            <button type="button">${t("enterPaper")}</button>
            <button type="button" class="secondary-btn paper-practice-button" data-paper-id="${escapeHtml(paper.id)}" ${paperQuestionCount ? "" : "disabled"}>
                ${currentLanguage === "hi" ? `अनुशंसित अभ्यास (${paperQuestionCount} प्रश्न)` : `Recommended practice (${paperQuestionCount} questions)`}
            </button>
        `;
        card.onclick = function () {
            showSubjects(paper);
        };
        grid.appendChild(card);
    });

    grid.querySelectorAll(".paper-practice-button").forEach((button) => {
        button.addEventListener("click", (event) => {
            event.stopPropagation();
            startPaperPractice(button.dataset.paperId);
        });
    });

    container.appendChild(grid);
    const questionCount = examQuestions.length;
    container.insertAdjacentHTML("beforeend", `
        <p class="mock-disclaimer">${currentLanguage === "hi"
            ? "नीचे का पाठ्यक्रम आधिकारिक परीक्षा अधिसूचनाओं के आधार पर व्यवस्थित अध्ययन-मानचित्र है। अधिसूचना/शुद्धिपत्र अंतिम मानें। अभ्यास प्रश्न मौलिक हैं, आधिकारिक PYQ नहीं।"
            : "This is a structured study map based on official examination notices. The latest notice and corrigenda take precedence. In-platform practice questions are original, not official PYQs."}</p>
        <div class="prep-actions classroom-quick-actions">
            <button type="button" ${questionCount ? "" : "disabled"} onclick="startMixedMock()">${currentLanguage === "hi" ? `सभी पेपर का अनुशंसित अभ्यास (${questionCount} प्रश्न)` : `Recommended all-paper practice (${questionCount} questions)`}</button>
            <button type="button" class="secondary-btn" onclick="openAnswerPractice()">${currentLanguage === "hi" ? "उत्तर लेखन" : "Answer writing"}</button>
        </div>
        <section class="source-library" aria-labelledby="source-library-heading">
            <h3 id="source-library-heading">${currentLanguage === "hi" ? "आधिकारिक पाठ्यक्रम और अनुशंसित अध्ययन स्रोत" : "Official syllabus and recommended study sources"}</h3>
            <p>${currentLanguage === "hi"
                ? "पहले पाठ्यक्रम और पुराने प्रश्नपत्र देखें; फिर NCERT से आधार बनाएं और संबंधित मंत्रालय/संस्था के मूल स्रोतों से अद्यतन करें।"
                : "Start with the official syllabus and past papers, build foundations from NCERT, then update from the relevant ministry or institution's primary sources."}</p>
            <div class="source-grid">
                ${STUDY_SOURCES.filter((sourceItem) => sourceItem.exams.includes(currentExam)).map((sourceItem) => `
                    <a class="source-card" href="${sourceItem.url}" target="_blank" rel="noopener noreferrer">
                        <strong>${escapeHtml(sourceItem.label[currentLanguage])}</strong>
                        <span>${escapeHtml(sourceItem.detail[currentLanguage])}</span>
                    </a>
                `).join("")}
            </div>
        </section>
    `);
}

function collectExamQuestions() {
    if (!currentData || !Array.isArray(currentData.papers)) return [];

    const records = [];
    const seen = new Set();
    currentData.papers.forEach((paper) => {
        paper.subjects.forEach((subject) => {
            subject.chapters.forEach((chapter) => {
                chapter.topics.forEach((topic) => {
                    const lesson = lessonLibrary[topic.id];
                    if (!lesson || !Array.isArray(lesson.questions)) return;
                    lesson.questions.forEach((question, index) => {
                        const id = `${paper.id}-${topic.id}-${index}`;
                        if (seen.has(id)) return;
                        seen.add(id);
                        records.push({
                            id,
                            paperId: paper.id,
                            topicId: topic.id,
                            topicName: topic.name,
                            subjectName: subject.name,
                            chapterName: chapter.name,
                            question
                        });
                    });
                });
            });
        });
    });
    return records;
}

function buildMixedMockQuestions(questionIds) {
    const records = new Map(collectExamQuestions().map((record) => [record.id, record]));
    return (questionIds || []).map((id) => records.get(id)).filter(Boolean).map((record) => ({
        question: record.question.question[currentLanguage],
        options: record.question.options[currentLanguage],
        correct: record.question.correct,
        explanation: record.question.explanation[currentLanguage],
        topicName: record.topicName
    }));
}

function startPaperPractice(paperId) {
    const paper = currentData.papers.find((item) => item.id === paperId);
    if (!paper) return;
    const pool = collectExamQuestions().filter((record) => record.paperId === paperId);
    startRecommendedPractice(pool, paper.name);
}

function startMixedMock() {
    startRecommendedPractice(
        collectExamQuestions(),
        currentLanguage === "hi" ? "सभी पेपर" : "All papers"
    );
}

function startRecommendedPractice(pool, paperName) {
    if (!pool.length) return;
    for (let index = pool.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
    }
    const mockQuestionIds = pool.map((record) => record.id);
    const topicName = currentLanguage === "hi"
        ? `${paperName} — अनुशंसित अभ्यास-पत्र`
        : `${paperName} — recommended practice paper`;
    currentPracticeState = {
        topicId: "mixed-mock",
        topicName,
        subjectName: currentLanguage === "hi" ? "सभी विषय" : "All subjects",
        chapterName: currentLanguage === "hi" ? "अनुशंसित अभ्यास" : "Recommended practice",
        questions: buildMixedMockQuestions(mockQuestionIds),
        mockQuestionIds,
        isMixedMock: true,
        index: 0,
        selected: [],
        score: 0,
        timeLeft: Math.max(600, mockQuestionIds.length * 60),
        timeLimit: Math.max(600, mockQuestionIds.length * 60),
        timerId: null
    };
    lastPracticeResult = null;
    renderPracticeQuestion();
    startPracticeTimer();
}

function openAnswerPractice(promptId) {
    const prompts = ANSWER_PROMPTS.filter((prompt) => prompt.exams.includes(currentExam));
    renderAnswerPractice(promptId || prompts[0].id);
}

function getAnswerDraftKey(promptId) {
    return `mission-answer-${currentExam}-${promptId}`;
}

function readAnswerDraft(promptId) {
    try {
        return JSON.parse(localStorage.getItem(getAnswerDraftKey(promptId)) || "null") || {};
    } catch (error) {
        return {};
    }
}

function saveAnswerDraft(promptId, answer, ratings) {
    localStorage.setItem(getAnswerDraftKey(promptId), JSON.stringify({ answer, ratings }));
}

function renderAnswerPractice(promptId) {
    const prompts = ANSWER_PROMPTS.filter((prompt) => prompt.exams.includes(currentExam));
    const prompt = prompts.find((item) => item.id === promptId) || prompts[0];
    const draft = readAnswerDraft(prompt.id);
    const answer = draft.answer || "";
    const ratings = draft.ratings || {};
    rerenderCurrentView = () => renderAnswerPractice(prompt.id);
    updateBreadcrumb([currentExam, currentLanguage === "hi" ? "उत्तर लेखन" : "Answer writing"]);

    const container = document.getElementById("classroom-content");
    container.innerHTML = `
        <section class="answer-room">
            <div class="study-page-header">
                <div>
                    <div class="study-label">${currentLanguage === "hi" ? "मुख्य परीक्षा लेखन प्रयोगशाला" : "MAINS ANSWER PRACTICE"}</div>
                    <h2>${currentLanguage === "hi" ? "उत्तर लेखन अभ्यास" : "Answer writing room"}</h2>
                </div>
                <span class="draft-status">${currentLanguage === "hi" ? "इस ब्राउज़र में स्थानीय रूप से सहेजा गया" : "Saved locally in this browser"}</span>
            </div>
            <label class="prompt-select-label" for="answer-prompt">${currentLanguage === "hi" ? "प्रश्न चुनें" : "Choose a prompt"}</label>
            <select id="answer-prompt">
                ${prompts.map((item) => `<option value="${item.id}" ${item.id === prompt.id ? "selected" : ""}>${escapeHtml(item[currentLanguage])}</option>`).join("")}
            </select>
            <div class="answer-prompt">
                <span>${currentLanguage === "hi" ? `लक्ष्य: ${prompt.words} शब्द` : `Target: ${prompt.words} words`}</span>
                <p>${escapeHtml(prompt[currentLanguage])}</p>
            </div>
            <label class="answer-label" for="answer-draft">${currentLanguage === "hi" ? "अपना उत्तर लिखें" : "Write your answer"}</label>
            <textarea id="answer-draft" rows="14" placeholder="${currentLanguage === "hi" ? "भूमिका से शुरू करें, तर्क और उदाहरण जोड़ें, फिर निष्कर्ष दें…" : "Set up the issue, build your argument with examples, and close with a reasoned conclusion…"}">${escapeHtml(answer)}</textarea>
            <div class="answer-editor-meta">
                <span id="answer-word-count"></span>
                <span>${currentLanguage === "hi" ? "कोई स्वचालित मूल्यांकन नहीं; उत्तर केवल आपके डिवाइस पर रहता है।" : "No automated grading. Your draft stays on this device."}</span>
            </div>
            <div class="rubric-panel">
                <div class="rubric-heading">
                    <div><h3>${currentLanguage === "hi" ? "स्व-मूल्यांकन" : "Self-review rubric"}</h3><p>${currentLanguage === "hi" ? "हर आयाम को 0–5 अंक दें; 0 = अनुपस्थित, 5 = बहुत मजबूत।" : "Rate each dimension from 0 to 5; 0 = missing, 5 = strong."}</p></div>
                    <strong id="rubric-total">0 / 20</strong>
                </div>
                ${ANSWER_RUBRIC.map((criterion) => `
                    <label class="rubric-row" for="answer-score-${criterion.id}">
                        <span>${criterion[currentLanguage]}</span>
                        <input id="answer-score-${criterion.id}" type="range" min="0" max="5" step="1" value="${Number(ratings[criterion.id]) || 0}" data-rubric="${criterion.id}">
                        <output id="answer-score-value-${criterion.id}">${Number(ratings[criterion.id]) || 0}</output>
                    </label>
                `).join("")}
            </div>
            <div class="answer-actions">
                <button type="button" class="secondary-btn" onclick="showPapers()">${currentLanguage === "hi" ? "← तैयारी डेस्क" : "← Preparation desk"}</button>
                <button type="button" class="secondary-btn" onclick="clearAnswerDraft('${prompt.id}')">${currentLanguage === "hi" ? "मसौदा मिटाएँ" : "Clear draft"}</button>
            </div>
        </section>
    `;

    const textarea = document.getElementById("answer-draft");
    const updateWordCount = () => {
        const words = textarea.value.trim() ? textarea.value.trim().split(/\s+/).length : 0;
        document.getElementById("answer-word-count").textContent = currentLanguage === "hi"
            ? `${words} शब्द / लक्ष्य ${prompt.words}`
            : `${words} words / ${prompt.words} target`;
        const currentDraft = readAnswerDraft(prompt.id);
        saveAnswerDraft(prompt.id, textarea.value, currentDraft.ratings || ratings);
    };
    const updateRubric = () => {
        const updatedRatings = {};
        let total = 0;
        ANSWER_RUBRIC.forEach((criterion) => {
            const value = Number(document.getElementById(`answer-score-${criterion.id}`).value);
            updatedRatings[criterion.id] = value;
            total += value;
            document.getElementById(`answer-score-value-${criterion.id}`).textContent = value;
        });
        document.getElementById("rubric-total").textContent = `${total} / 20`;
        saveAnswerDraft(prompt.id, textarea.value, updatedRatings);
    };
    textarea.addEventListener("input", updateWordCount);
    document.getElementById("answer-prompt").addEventListener("change", (event) => renderAnswerPractice(event.target.value));
    document.querySelectorAll("[data-rubric]").forEach((input) => input.addEventListener("input", updateRubric));
    updateWordCount();
    updateRubric();
}

function clearAnswerDraft(promptId) {
    localStorage.removeItem(getAnswerDraftKey(promptId));
    renderAnswerPractice(promptId);
}

function showSubjects(paper) {
    rerenderCurrentView = () => showSubjects(paper);
    const container = document.getElementById("classroom-content");
    updateBreadcrumb([currentExam, paper.name]);
    container.innerHTML = "";

    const heading = document.createElement("h3");
    heading.textContent = t("chooseSubject");
    container.appendChild(heading);

    const grid = document.createElement("div");
    grid.className = "classroom-grid";

    paper.subjects.forEach((subject) => {
        const card = document.createElement("div");
        card.className = "classroom-card";
        const chapterCount = subject.chapters.length;
        const topicCount = subject.chapters.reduce((count, chapter) => count + chapter.topics.length, 0);
        card.innerHTML = `
            <div class="classroom-icon">📖</div>
            <h3>${escapeHtml(curriculumName(subject.name))}</h3>
            <p>${chapterCount} ${currentLanguage === "hi" ? "अध्याय" : chapterCount === 1 ? "chapter" : "chapters"} · ${topicCount} ${currentLanguage === "hi" ? "उपविषय" : topicCount === 1 ? "topic" : "topics"}</p>
            <button>${t("studySubject")}</button>
        `;
        card.onclick = function () {
            showChapters(paper, subject);
        };
        grid.appendChild(card);
    });

    container.appendChild(grid);
}

function showChapters(paper, subject) {
    rerenderCurrentView = () => showChapters(paper, subject);
    const container = document.getElementById("classroom-content");
    updateBreadcrumb([currentExam, paper.name, subject.name]);
    container.innerHTML = "";

    const heading = document.createElement("h3");
    heading.textContent = t("chooseChapter");
    container.appendChild(heading);

    const grid = document.createElement("div");
    grid.className = "classroom-grid";

    subject.chapters.forEach((chapter) => {
        const card = document.createElement("div");
        card.className = "classroom-card";
        const topicCount = chapter.topics.length;
        card.innerHTML = `
            <div class="classroom-icon">📘</div>
            <h3>${escapeHtml(curriculumName(chapter.name))}</h3>
            <p>${topicCount} ${currentLanguage === "hi" ? "विषय" : topicCount === 1 ? "topic" : "topics"}</p>
            <button>${t("openChapter")}</button>
        `;
        card.onclick = function () {
            showTopics(paper, subject, chapter);
        };
        grid.appendChild(card);
    });

    container.appendChild(grid);
}

function showTopics(paper, subject, chapter) {
    rerenderCurrentView = () => showTopics(paper, subject, chapter);
    const container = document.getElementById("classroom-content");
    updateBreadcrumb([currentExam, paper.name, subject.name, chapter.name]);
    container.innerHTML = "";

    const heading = document.createElement("h3");
    heading.textContent = t("chooseTopic");
    container.appendChild(heading);

    const grid = document.createElement("div");
    grid.className = "classroom-grid";

    chapter.topics.forEach((topic) => {
        const card = document.createElement("div");
        card.className = "topic-card";
        const lesson = lessonLibrary[topic.id];
        const hasQuestions = lesson && Array.isArray(lesson.questions) && lesson.questions.length > 0;
        card.innerHTML = `
            <div class="topic-icon">🎯</div>
            <h3>${escapeHtml(curriculumName(topic.name))}</h3>
            <div class="topic-buttons">
                <button onclick="openStudy('${safeQuote(topic.id)}', '${safeQuote(topic.name)}', '${safeQuote(subject.name)}', '${safeQuote(chapter.name)}')">📖 ${t("study")}</button>
                ${hasQuestions
                    ? `<button class="practice-button" onclick="openPractice('${safeQuote(topic.id)}', '${safeQuote(topic.name)}', '${safeQuote(subject.name)}', '${safeQuote(chapter.name)}')">📝 ${t("practice")}</button>`
                    : `<span class="topic-coverage-label">${currentLanguage === "hi" ? "पाठ्यक्रम सूची · विस्तृत पाठ और विषय-विशिष्ट प्रश्न जोड़े जा रहे हैं" : "Syllabus outline · detailed lesson and topic questions not added yet"}</span>`}
            </div>
        `;
        grid.appendChild(card);
    });

    container.appendChild(grid);
}

function openStudy(topicId, topicName, subjectName, chapterName) {
    rerenderCurrentView = () => openStudy(topicId, topicName, subjectName, chapterName);
    const container = document.getElementById("classroom-content");
    const summary = buildStudySummary(topicId, topicName, subjectName, chapterName);
    const authoredLesson = lessonLibrary[topicId];
    const lessonText = (section) => section && section[currentLanguage];

    updateBreadcrumb([currentExam, subjectName, chapterName, topicName]);

    container.innerHTML = `
        <div class="study-page">
            <div class="study-page-header">
                <div>
                    <div class="study-label">${t("phaseStudyRoom")}</div>
                    <h2>${escapeHtml(curriculumName(topicName))}</h2>
                </div>
            </div>

            <p class="study-introduction">${escapeHtml(lessonText(summary.concept) || summary.intro)}</p>

            ${authoredLesson ? `<div class="study-grid">
                <article class="lesson-section">
                    <h3>🧠 1. ${currentLanguage === "hi" ? "मुख्य तथ्य" : "Key Points"}</h3>
                    ${summary.keyPoints
                        ? `<ul>${summary.keyPoints[currentLanguage].map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul>`
                        : `<p>${escapeHtml(summary.concept)}</p>`}
                </article>

                <article class="lesson-section">
                    <h3>🎯 2. ${currentLanguage === "hi" ? "परीक्षा दृष्टिकोण" : "Exam Perspective"}</h3>
                    <p>${escapeHtml(lessonText(summary.examAngle) || summary.perspective)}</p>
                </article>

                <article class="lesson-section">
                    <h3>📘 3. ${currentLanguage === "hi" ? "स्मरण और पुनरावृत्ति" : "Revision Method"}</h3>
                    <p>${escapeHtml(lessonText(summary.revision) || summary.amendments)}</p>
                </article>

                <article class="lesson-section">
                    <h3>📜 4. ${currentLanguage === "hi" ? "PYQ अभ्यास रणनीति" : "PYQ Practice Strategy"}</h3>
                    <p>${escapeHtml(summary.pyqs || (currentLanguage === "hi"
                        ? "प्रश्न के प्रत्येक कथन को अलग-अलग जाँचें। गलत विकल्प को हटाने का कारण भी नोट करें और संदेह वाले तथ्य को आधिकारिक स्रोत से सत्यापित करें।"
                        : "Check each statement in a question independently. Note why a distractor is wrong, and verify uncertain facts from an official source."))}</p>
                </article>
            </div>` : `
                <article class="lesson-section syllabus-outline-panel">
                    <h3>${currentLanguage === "hi" ? "पाठ्यक्रम कवरेज मानचित्र" : "Syllabus coverage map"}</h3>
                    <p>${currentLanguage === "hi"
                        ? "यह विस्तारित पाठ्यक्रम में शामिल एक विषय-बिंदु है। इस बिंदु के विस्तृत तथ्यात्मक नोट्स और प्रश्न अभी इस मंच पर उपलब्ध नहीं हैं। परीक्षा से पहले नवीनतम आधिकारिक पाठ्यक्रम अधिसूचना जाँचें।"
                        : "This is a topic in the expanded syllabus map. Detailed factual notes and topic-specific questions for this item are not yet available in the platform. Check the latest official syllabus notice before the exam."}</p>
                    <p>${currentLanguage === "hi"
                        ? "आधिकारिक पाठ्यक्रम, NCERT और संबंधित सरकारी संस्थाओं के प्राथमिक स्रोत इस परीक्षा के मुख्य पृष्ठ पर दिए गए हैं।"
                        : "Official syllabus notices, NCERT and relevant government primary sources are listed on this exam's paper-selection page."}</p>
                </article>
            `}

            ${authoredLesson && authoredLesson.questions && authoredLesson.questions.length
                ? `<div class="study-actions">
                    <button onclick="openPractice('${safeQuote(topicId)}', '${safeQuote(topicName)}', '${safeQuote(subjectName)}', '${safeQuote(chapterName)}')">📝 ${t("startPractice")}</button>
                </div>`
                : ""}
        </div>
    `;
}

function openPractice(topicId, topicName, subjectName, chapterName) {
    const questions = getPracticeQuestions(topicId, topicName, currentExam);
    lastPracticeResult = null;

    currentPracticeState = {
        topicId,
        topicName,
        subjectName,
        chapterName,
        questions,
        index: 0,
        selected: [],
        score: 0,
        timeLeft: 600,
        timeLimit: 600,
        timerId: null
    };

    renderPracticeQuestion();
    startPracticeTimer();
}

function goHome() {
    if (currentPracticeState && currentPracticeState.timerId) {
        clearInterval(currentPracticeState.timerId);
    }

    currentPracticeState = null;
    rerenderCurrentView = null;

    document.querySelector(".welcome-section").style.display = "block";
    document.querySelector(".exam-section").style.display = "block";
    document.querySelector(".today-section").style.display = "block";
    document.querySelector(".update-section").style.display = "block";
    document.querySelector("#classroom").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    setupLanguageToggle();
    applyTranslations();
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./sw.js").catch((error) => {
            console.error("Offline support could not be enabled.", error);
        });
    }
});