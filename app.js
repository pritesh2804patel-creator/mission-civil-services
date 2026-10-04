let currentExam = null;
let currentData = null;
let lessonLibrary = {};
let currentPracticeState = null;
let lastPracticeResult = null;
let rerenderCurrentView = null;
let currentLanguage = localStorage.getItem("mission-language") === "hi" ? "hi" : "en";

const OFFICIAL_PORTALS = {
    UPSC: {
        label: {
            en: "Union Public Service Commission",
            hi: "संघ लोक सेवा आयोग"
        },
        url: "https://upsconline.gov.in/",
        notices: "https://upsconline.gov.in/"
    },
    CGPSC: {
        label: {
            en: "Chhattisgarh Public Service Commission",
            hi: "छत्तीसगढ़ लोक सेवा आयोग"
        },
        url: "https://psc.cg.gov.in/",
        notices: "https://psc.cg.gov.in/"
    }
};

const CURRICULUM_HI = {
    "General Studies Paper I": "सामान्य अध्ययन प्रश्नपत्र I",
    "General Studies Paper II — CSAT": "सामान्य अध्ययन प्रश्नपत्र II — CSAT",
    "General Studies Paper II — Aptitude": "सामान्य अध्ययन प्रश्नपत्र II — अभिक्षमता",
    "History": "इतिहास",
    "Indian Polity": "भारतीय राजव्यवस्था",
    "Geography": "भूगोल",
    "Indian Economy": "भारतीय अर्थव्यवस्था",
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
        phase1Text: "Concepts, amendments, budgets, PYQs, and official references for UPSC & CGPSC.",
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
        officialReference: "Official Reference",
        officialReferenceText: "Use the authorised commission portal for the latest notifications, amendments, syllabus, and exam updates.",
        noticesUpdates: "Notices & Updates",
        startPractice: "Start Practice",
        phaseStudyRoom: "PHASE 1 • STUDY ROOM",
        phasePractice: "PHASE 2 • PRACTICE",
        result: "RESULT",
        practiceResult: "Practice Result",
        officialSource: "Official source",
        backToStudy: "Back to Study",
        finishTest: "Finish Test",
        nextQuestion: "Next Question",
        retryTest: "Retry Test",
        reviseTopic: "Revise Topic",
        questionLabel: "Question",
        markingLabel: "Marking: +1 each",
        timeLabel: "Time: 10 min",
        correctAnswer: "Correct answer",
        incorrectAnswer: "Incorrect answer",
        yourAnswer: "Your answer",
        logicLabel: "Logic",
        notAttempted: "Not attempted",
        correctAnswers: "Correct Answers",
        score: "Score",
        timeLeft: "Time Left",
        officialPortal: "Official portal",
        live: "LIVE",
        examUpdateText: "Use the official UPSC and CGPSC portals to verify current notices, dates and syllabus changes. This page does not fetch live updates.",
        examUpdateStrong: "Official Notifications"
    },
    hi: {
        studentClassroom: "विद्यार्थी कक्षा",
        welcomeTitle: "आपका सिविल सर्विसेज क्लासरूम में स्वागत है",
        welcomeSubtitle: "अध्ययन करें। अभ्यास करें। परीक्षण करें। विश्लेषण करें। सुधार करें।",
        phase1Label: "चरण 1",
        phase1Text: "संकल्पना, संशोधन, बजट, PYQ और UPSC & CGPSC के लिए आधिकारिक संदर्भ।",
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
        officialReference: "आधिकारिक संदर्भ",
        officialReferenceText: "नवीनतम अधिसूचनाएं, संशोधन, पाठ्यक्रम और परीक्षा अपडेट के लिए अधिकृत आयोग पोर्टल का उपयोग करें।",
        noticesUpdates: "अधिसूचनाएँ और अपडेट",
        startPractice: "अभ्यास शुरू करें",
        phaseStudyRoom: "चरण 1 • अध्ययन कक्ष",
        phasePractice: "चरण 2 • अभ्यास",
        result: "परिणाम",
        practiceResult: "अभ्यास परिणाम",
        officialSource: "आधिकारिक स्रोत",
        backToStudy: "अध्ययन पर लौटें",
        finishTest: "परीक्षा समाप्त करें",
        nextQuestion: "अगला प्रश्न",
        retryTest: "पुनः प्रयास",
        reviseTopic: "विषय दोबारा सीखें",
        questionLabel: "प्रश्न",
        markingLabel: "अंक: +1 प्रति प्रश्न",
        timeLabel: "समय: 10 मिनट",
        correctAnswer: "सही उत्तर",
        incorrectAnswer: "गलत उत्तर",
        yourAnswer: "आपका उत्तर",
        logicLabel: "तर्क",
        notAttempted: "प्रयास नहीं किया गया",
        correctAnswers: "सही उत्तर",
        score: "अंक",
        timeLeft: "बाकी समय",
        officialPortal: "आधिकारिक पोर्टल",
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

function getExamPortal(examName) {
    const portal = OFFICIAL_PORTALS[examName] || OFFICIAL_PORTALS.UPSC;
    return {
        label: portal.label[currentLanguage],
        url: portal.url,
        notices: portal.notices
    };
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
                    currentPracticeState.questions = getPracticeQuestions(
                        currentPracticeState.topicId,
                        currentPracticeState.topicName,
                        currentExam
                    );
                    renderPracticeQuestion();
                } else if (lastPracticeResult) {
                    lastPracticeResult.questions = getPracticeQuestions(
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
    const sourceUrl = getExamPortal(examName).url;
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
                <span>${t("timeLabel")}</span>
            </div>

            <div class="question-card">
                <h3>${escapeHtml(question.question)}</h3>

                <div class="option-list">
                    ${question.options.map((option, optionIndex) => {
                        let classes = ["option-btn"];

                        if (selectedIndex !== undefined) {
                            if (optionIndex === question.correct) classes.push("correct");
                            if (optionIndex === selectedIndex && optionIndex !== question.correct) classes.push("wrong");
                            if (optionIndex === selectedIndex) classes.push("selected");
                        }

                        return `
                            <button
                                type="button"
                                class="${classes.join(" ")}"
                                data-index="${optionIndex}"
                                ${selectedIndex !== undefined ? "disabled" : ""}
                            >
                                <span>${String.fromCharCode(65 + optionIndex)}.</span>
                                ${escapeHtml(option)}
                            </button>
                        `;
                    }).join("")}
                </div>

                ${selectedIndex !== undefined ? `
                    <div class="answer-feedback ${selectedIndex === question.correct ? "success" : "error"}">
                        <strong>${selectedIndex === question.correct ? t("correctAnswer") : t("incorrectAnswer")}:</strong>
                        ${escapeHtml(question.options[question.correct])}. ${escapeHtml(question.explanation)}
                    </div>
                ` : ""}
            </div>

            <div class="practice-actions">
                <button class="secondary-btn" onclick="openStudy('${safeQuote(currentPracticeState.topicId)}', '${safeQuote(currentPracticeState.topicName)}', '${safeQuote(currentPracticeState.subjectName)}', '${safeQuote(currentPracticeState.chapterName)}')">
                    ← ${t("backToStudy")}
                </button>

                ${selectedIndex !== undefined ? `
                    <button onclick="movePracticeNext()">
                        ${currentPracticeState.index === total - 1 ? t("finishTest") : t("nextQuestion")} →
                    </button>
                ` : ""}
            </div>
        </div>
    `;

    document.querySelectorAll(".option-btn").forEach((button) => {
        button.addEventListener("click", () => {
            const selected = Number(button.dataset.index);
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
    const portal = getExamPortal(currentExam);

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
                            <a href="${question.sourceUrl || portal.url}" target="_blank" rel="noopener noreferrer">${t("officialSource")}</a>
                        </div>
                    `;
                }).join("")}
            </div>

            <div class="practice-actions">
                <button onclick="openPractice('${safeQuote(practiceResult.topicId)}', '${safeQuote(practiceResult.topicName)}', '${safeQuote(practiceResult.subjectName)}', '${safeQuote(practiceResult.chapterName)}')">
                    ${t("retryTest")}
                </button>
                <button class="secondary-btn" onclick="openStudy('${safeQuote(practiceResult.topicId)}', '${safeQuote(practiceResult.topicName)}', '${safeQuote(practiceResult.subjectName)}', '${safeQuote(practiceResult.chapterName)}')">
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

        const [response, lessonsResponse] = await Promise.all([
            fetch(file),
            fetch("data/lessons.json?v=20261004-2")
        ]);

        if (!response.ok || !lessonsResponse.ok) {
            throw new Error("Unable to load exam data.");
        }

        [currentData, lessonLibrary] = await Promise.all([
            response.json(),
            lessonsResponse.json()
        ]);

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

    currentData.papers.forEach((paper) => {
        const card = document.createElement("div");
        card.className = "classroom-card";
        const subjectCount = paper.subjects.length;
        card.innerHTML = `
            <div class="classroom-icon">📚</div>
            <h3>${escapeHtml(curriculumName(paper.name))}</h3>
            <p>${subjectCount} ${currentLanguage === "hi" ? "विषय" : "Subjects"}</p>
            <button>${t("enterPaper")}</button>
        `;
        card.onclick = function () {
            showSubjects(paper);
        };
        grid.appendChild(card);
    });

    container.appendChild(grid);
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
        card.innerHTML = `
            <div class="classroom-icon">📖</div>
            <h3>${escapeHtml(curriculumName(subject.name))}</h3>
            <p>${chapterCount} ${currentLanguage === "hi" ? "अध्याय" : "Chapters"}</p>
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
            <p>${topicCount} ${currentLanguage === "hi" ? "विषय" : "Topics"}</p>
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
        card.innerHTML = `
            <div class="topic-icon">🎯</div>
            <h3>${escapeHtml(curriculumName(topic.name))}</h3>
            <div class="topic-buttons">
                <button onclick="openStudy('${safeQuote(topic.id)}', '${safeQuote(topic.name)}', '${safeQuote(subject.name)}', '${safeQuote(chapter.name)}')">📖 ${t("study")}</button>
                <button class="practice-button" onclick="openPractice('${safeQuote(topic.id)}', '${safeQuote(topic.name)}', '${safeQuote(subject.name)}', '${safeQuote(chapter.name)}')">📝 ${t("practice")}</button>
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
    const examPortal = getExamPortal(currentExam);
    const lessonText = (section) => section && section[currentLanguage];

    updateBreadcrumb([currentExam, subjectName, chapterName, topicName]);

    container.innerHTML = `
        <div class="study-page">
            <div class="study-page-header">
                <div>
                    <div class="study-label">${t("phaseStudyRoom")}</div>
                    <h2>${escapeHtml(curriculumName(topicName))}</h2>
                </div>
                <a class="portal-link" href="${examPortal.url}" target="_blank" rel="noopener noreferrer">
                    ${escapeHtml(examPortal.label)}
                </a>
            </div>

            <p class="study-introduction">${escapeHtml(lessonText(summary.concept) || summary.intro)}</p>

            <div class="study-grid">
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
            </div>

            <div class="official-card">
                <h3>${t("officialReference")}</h3>
                <p>${t("officialReferenceText")}</p>
                <div class="official-links">
                    <a href="${examPortal.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(examPortal.label)}</a>
                    <a href="${examPortal.notices}" target="_blank" rel="noopener noreferrer">${t("noticesUpdates")}</a>
                </div>
            </div>

            <div class="study-actions">
                <button onclick="openPractice('${safeQuote(topicId)}', '${safeQuote(topicName)}', '${safeQuote(subjectName)}', '${safeQuote(chapterName)}')">📝 ${t("startPractice")}</button>
            </div>
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