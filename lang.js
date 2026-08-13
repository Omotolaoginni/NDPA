// ─────────────────────────────────────────────────
//  NDPA Self-Audit Tool — Language Configuration
//  All UI copy lives here. No hardcoded strings elsewhere.
// ─────────────────────────────────────────────────

const LANG = {
  en: {
    // ── App-wide ──
    appName: "NDPA Self-Check",
    privacyLink: "Your privacy",
    footerDisclaimer: "This self-check is for general guidance only. It is not legal advice and does not constitute a formal compliance audit.",

    // ── Landing ──
    landing: {
      eyebrow: "NDPA Compliance Self-Check",
      headline: "How well does your business protect customer information?",
      subtext: "Answer a few simple questions to see what your business is doing well and what you should improve.",
      trust1: "Takes less than 10 minutes",
      trust2: "No account required",
      trust3: "Your answers stay on your device",
      cta: "Check my business",
      langToggle: "English | Pidgin",
    },

    // ── Language Selection ──
    language: {
      heading: "Choose your language",
      option_en: "English",
      option_pidgin: "Pidgin",
      cta: "Continue",
    },

    // ── Sector Selection ──
    sector: {
      heading: "What type of business do you run?",
      subtext: "This helps us make your results more relevant.",
      option_retail: "Retail / Fashion",
      option_logistics: "Logistics",
      option_digital: "Digital Services",
      cta: "Continue",
    },

    // ── Business Data Volume ──
    size: {
      heading: "How many customer information does your business handle?",
      subtext: "Select the option that best describes your business.",
      option_lt200: "Less than 200 people",
      option_lt200_hint: "You handle personal information for fewer than 200 people in 6 months.",
      option_200to1000: "200–1,000 people",
      option_200to1000_hint: "You handle personal information for 200 to 1,000 people in 6 months.",
      option_gt1000: "More than 1,000 people",
      option_gt1000_hint: "You handle personal information for more than 1,000 people in 6 months.",
      option_notSure: "Not sure",
      option_notSure_hint: "I'm not sure how many people's information my business handles.",
      cta: "Start assessment",
    },

    // ── Assessment ──
    assessment: {
      label: "NDPA Self-Check",
      questionCounter: (current) => `Question ${current}`,
      progressLabel: (pct) => `${pct}% complete`,
      yes: "Yes",
      no: "No",
      notSure: "Not sure",
      previous: "← Previous question",
      next: "Next →",
      finish: "Finish assessment",
      restart: "Restart assessment",
    },

    // ── Category Transition ──
    transition: {
      heading: "Good progress!",
      completedLabel: "Completed",
      upNextLabel: "Up next",
      questionCount: (n) => `${n} question${n !== 1 ? "s" : ""}`,
      upNextAria: (cat) => `Continue to ${cat}`,
      cta: "Continue",
    },

    // ── Processing ──
    processing: {
      heading: "Checking your results…",
      subtext: "We're looking at your answers to identify your strengths and the areas that need attention.",
    },

    // ── Results ──
    results: {
      heading: "Your results",
      scoreLabel: "Self-check score",
      tierGreen: "Low Risk",
      tierAmber: "Action Needed",
      tierRed: "Urgent Action",
      tierGreenMsg: "Your business is doing many of the important things right.",
      tierAmberMsg: "Your business is meeting some requirements but has important gaps to address.",
      tierRedMsg: "Your business has important gaps that should be addressed as soon as possible.",
      strengthsHeading: "What you're doing well",
      strengthsSummary: (cats) => `Your business already has a good foundation in ${cats}.`,
      breakdownHeading: "Category breakdown",
      breakdownToggle: "Show details",
      breakdownToggleClose: "Hide details",
      actionsHeading: "Your top priority actions",
      actionsEmpty: "Great news, no urgent actions were identified based on your responses.",
      guideLink: (module) => `Read ${module} →`,
      whatsappCta: "Send to my WhatsApp",
      saveCta: "Save my results",
      restartCta: "Start over",
      disclaimer: "This self-check is for general guidance only. It is not legal advice and does not constitute a formal compliance audit.",
    },

    // ── WhatsApp ──
    whatsapp: {
      messageTemplate: (tier, score, actions) =>
        `Your results\n\nRisk level: ${tier}\nScore: ${score}%\n\nTop actions:\n${actions.map((a, i) => `${i + 1}. ${a}`).join("\n")}`,
      fallbackHeading: "WhatsApp not found",
      fallbackText: "It looks like WhatsApp isn't installed. You can copy your result below.",
      copyBtn: "Copy result text",
      copied: "Copied!",
      openingHeading: "Open WhatsApp",
      openingText: "Your results summary is ready to share.",
      openingSubtext: "WhatsApp will open with your results already prepared as a message.",
      previewLabel: "Your results",
      riskLevel: "Risk level",
      topActions: "Your top actions",
      openCta: "Open WhatsApp",
      back: "← Back to results",
    },

    // ── Save Flow ──
    save: {
      consentHeading: "Save your results",
      consentBody: "We'll use your email only to send your results. We won't keep it after delivery.",
      consentCheck: "I agree to receive my results by email",
      consentCta: "Continue",
      consentDecline: "No thanks, go back",
      emailHeading: "Enter your email",
      emailLabel: "Email address",
      emailPlaceholder: "your@email.com",
      emailCta: "Send my results",
      emailBack: "Back",
      emailNote: "Your email will only be used to send your results and will not be stored afterwards.",
      emailInvalid: "Please enter a valid email address.",
      successHeading: "Results sent!",
      successBody: "Check your inbox. We won't store your email after delivery.",
      successCta: "Back to results",
      errorHeading: "We couldn't send your results.",
      errorBody: "Something went wrong. Please try again.",
      errorRetry: "Try again",
      errorBack: "Back to results",
    },

    // ── Restart ──
    restart: {
      heading: "Start over?",
      body: "This will clear your answers and take you back to the beginning.",
      confirm: "Yes, start over",
      cancel: "Cancel",
    },

    // ── Privacy ──
    privacy: {
      heading: "Your privacy",
      body: `
        <h2>What we collect by default</h2>
        <p>Nothing. No personal data is collected when you use this tool.</p>

        <h2>What stays on your device</h2>
        <p>Your answers, language choice, and business profile are stored only in your browser's session memory and are cleared when you close the tab or restart the assessment.</p>

        <h2>If you save your results</h2>
        <p>You can optionally provide your email address to receive your results. Your email is used only for this delivery and is not retained afterwards.</p>

        <h2>If you share via WhatsApp</h2>
        <p>Your result summary is passed to WhatsApp's click-to-chat service on your device. No data is sent to our servers as part of this action.</p>

        <h2>Your rights</h2>
        <p>You have the right to access, correct, and erase any personal data we hold. Contact us if you have questions.</p>

        <h2>Optional usage data</h2>
        <p>[TBD, subject to product-owner confirmation and explicit user consent]</p>

        <p><em>Final legal copy TBD, pending legal review.</em></p>
      `,
      close: "Close",
    },

    // ── Offline ──
    offline: {
      heading: "You're offline",
      body: "No internet connection detected. You can still complete and review your assessment. All processing happens on your device.",
      cta: "Continue anyway",
    },

    // ── Error ──
    error: {
      heading: "Something went wrong",
      body: "An unexpected error occurred. Please refresh the page and try again.",
      cta: "Refresh",
    },

    // ── Category Names ──
    categories: {
      applicability: "Applicability & Awareness",
      baseline: "Baseline Compliance",
      lawful: "Lawful Basis & Marketing",
      dpo: "DPO & Governance",
      breach: "Breach Readiness",
    },
  },

  // ─────────────────────────────────────────────
  //  PIDGIN
  //  NOTE: Placeholder translations — requires native speaker review before launch.
  // ─────────────────────────────────────────────
  pidgin: {
    appName: "NDPA Self-Check",
    privacyLink: "Your privacy",
    footerDisclaimer: "Dis self-check na for general guide only. E no be legal advice and e no be official compliance audit.",

    landing: {
      eyebrow: "NDPA Compliance Self-Check",
      headline: "How well your business dey protect your customers' information?",
      subtext: "Answer some simple questions to see wetin your business dey do well and wetin you need improve.",
      trust1: "E no go take up to 10 minutes",
      trust2: "You no need account",
      trust3: "Your answers stay for your device",
      cta: "Check my business",
      langToggle: "English | Pidgin",
    },

    language: {
      heading: "Pick your language",
      option_en: "English",
      option_pidgin: "Pidgin",
      cta: "Continue",
    },

    sector: {
      heading: "Wetin kind business you dey run?",
      subtext: "This go help make your results more relevant for you.",
      option_retail: "Retail / Fashion",
      option_logistics: "Logistics",
      option_digital: "Digital Services",
      cta: "Continue",
    },

    size: {
      heading: "How many customer information your business dey handle?",
      subtext: "Choose the option wey best fit your business.",
      option_lt200: "Less than 200 people",
      option_lt200_hint: "You dey handle personal information for people wey no reach 200 during the last six months.",
      option_200to1000: "200–1,000 people",
      option_200to1000_hint: "You dey handle personal information for people wey reach 200 to 1,000 during the last six months.",
      option_gt1000: "More than 1,000 people",
      option_gt1000_hint: "You dey handle personal information for people wey pass 1,000 during the last six months.",
      option_notSure: "I no sure",
      option_notSure_hint: "I no sure how many people personal information your business dey handle during the last six months.",
      cta: "Start assessment",
    },

    assessment: {
      label: "NDPA Self-Check",
      questionCounter: (current) => `Question ${current}`,
      progressLabel: (pct) => `${pct}% don complete`,
      yes: "Yes",
      no: "No",
      notSure: "I no sure",
      previous: "← Previous question",
      next: "Next →",
      finish: "Finish assessment",
      restart: "Start again",
    },

    transition: {
      heading: "You dey do well!",
      completedLabel: "Done",
      upNextLabel: "Next up",
      questionCount: (n) => `${n} question${n !== 1 ? "s" : ""}`,
      upNextAria: (cat) => `Go to ${cat}`,
      cta: "Continue",
    },

    processing: {
      heading: "We dey check your results…",
      subtext: "We dey look your answers to find where you dey do well and where you need to improve.",
    },

    results: {
      heading: "Your results",
      scoreLabel: "Self-check score",
      tierGreen: "Dem good",
      tierAmber: "You need do something",
      tierRed: "You need act now",
      tierGreenMsg: "Dem good. Your business dey do many of the important things right.",
      tierAmberMsg: "Your business dey meet some requirements, but there are important areas wey you need work on.",
      tierRedMsg: "Your business get important gaps wey you need to fix sharp sharp.",
      strengthsHeading: "Wetin you dey do well",
      strengthsSummary: (cats) => `Your business don get good foundation for ${cats}.`,
      breakdownHeading: "Category breakdown",
      breakdownToggle: "Show details",
      breakdownToggleClose: "Hide details",
      actionsHeading: "Wetin you need do first",
      actionsEmpty: "Good news, we no see any urgent actions based on your answers.",
      guideLink: (module) => `Read ${module} →`,
      whatsappCta: "Send to my WhatsApp",
      saveCta: "Save my results",
      restartCta: "Start again",
      disclaimer: "Dis self-check na for general guide only. E no be legal advice and e no be official compliance audit.",
    },

    whatsapp: {
      messageTemplate: (tier, score, actions) =>
        `Your results\n\nRisk level: ${tier}\nScore: ${score}%\n\nTop actions:\n${actions.map((a, i) => `${i + 1}. ${a}`).join("\n")}`,
      fallbackHeading: "WhatsApp no dey",
      fallbackText: "E look like WhatsApp no install for your phone. You fit copy your result below.",
      copyBtn: "Copy result text",
      copied: "Copied!",
      openingHeading: "Open WhatsApp",
      openingText: "Your results summary don ready to share.",
      openingSubtext: "WhatsApp go open with your results wey don already prepare as message.",
      previewLabel: "Your results",
      riskLevel: "Risk level",
      topActions: "Your top actions",
      openCta: "Open WhatsApp",
      back: "← Back to results",
    },

    save: {
      consentHeading: "Save your results",
      consentBody: "We go use your email only to send your results. We no go keep am after delivery.",
      consentCheck: "I agree make dem send my results by email",
      consentCta: "Continue",
      consentDecline: "No thanks, go back",
      emailHeading: "Enter your email",
      emailLabel: "Email address",
      emailPlaceholder: "your@email.com",
      emailCta: "Send my results",
      emailBack: "Back",
      emailNote: "Dem go use your email only to send your results, and dem no go keep am after.",
      emailInvalid: "Abeg enter correct email address.",
      successHeading: "Results don send!",
      successBody: "Check your inbox. We no go store your email after delivery.",
      successCta: "Back to results",
      errorHeading: "We no fit send your results.",
      errorBody: "Something go wrong. Please try again.",
      errorRetry: "Try again",
      errorBack: "Back to results",
    },

    restart: {
      heading: "Start again?",
      body: "Dis go clear all your answers and take you back to the beginning.",
      confirm: "Yes, start again",
      cancel: "Cancel",
    },

    privacy: {
      heading: "Your privacy",
      body: `
        <h2>Wetin we collect by default</h2>
        <p>Nothing. We no dey collect any personal data when you use this tool.</p>

        <h2>Wetin go stay for your device</h2>
        <p>Your answers, language choice, and business profile dey stored only for your browser session memory and go clear when you close the tab or restart the assessment.</p>

        <h2>If you save your results</h2>
        <p>You fit give your email address make dem send your results. Your email go be used only for this delivery and e no go stay after.</p>

        <h2>If you share via WhatsApp</h2>
        <p>Your result summary go pass to WhatsApp click-to-chat for your device. No data go go our server.</p>

        <h2>Your rights</h2>
        <p>You get right to access, correct, and delete any personal data we hold. Contact us if you get question.</p>

        <h2>Optional usage data</h2>
        <p>[TBD, subject to product-owner confirmation and explicit user consent]</p>

        <p><em>Final legal copy TBD, pending legal review.</em></p>
      `,
      close: "Close",
    },

    offline: {
      heading: "You no dey online",
      body: "No internet connection. You fit still finish and see your results. Everything dey process for your device.",
      cta: "Continue anyway",
    },

    error: {
      heading: "Something go wrong",
      body: "Unexpected error happen. Please refresh the page and try again.",
      cta: "Refresh",
    },

    categories: {
      applicability: "Applicability & Awareness",
      baseline: "Baseline Compliance",
      lawful: "Lawful Basis & Marketing",
      dpo: "DPO & Governance",
      breach: "Breach Readiness",
    },
  },
};

// Export for use in app.js
// (No module system needed — loaded via <script> tag)
