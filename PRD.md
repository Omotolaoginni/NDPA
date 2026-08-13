NDPA Compliance Self-Audit Tool
Technical Product Requirements & Wireframe Specification
Version: v1.0
 Product: NDPA Compliance Self-Audit Tool
 Primary Users: Nigerian MSME owners/operators
 Primary Device: Android smartphone
 Secondary Devices: iOS, tablet, desktop
 Design Stage: UX flow + low-fidelity wireframe
 Primary Goal: Enable an MSME operator to complete a self-assessment in under 10 minutes and understand exactly what to do next.

1. PRODUCT DEFINITION
The NDPA Compliance Self-Audit Tool is a lightweight, browser-based self-assessment tool for Nigerian MSMEs.
It helps an MSME operator assess their current data-protection practices without:
Creating an account
Hiring a consultant
Installing an application
Submitting assessment answers to a server
The user answers 28 questions about how their business handles personal data.
The tool then calculates a compliance score and returns:
Overall score
Risk tier
Plain-language interpretation
Category-level performance
Top two strengths
Maximum five priority actions
Links to relevant MSME Compliance Starter Guide modules
WhatsApp sharing
Optional email/save flow
The product is not a legal advice tool and must not present itself as a formal regulatory audit.

2. CORE PRODUCT PRINCIPLE
The product should behave like a:
Business data-protection health check
and not like:
A legal examination or regulatory filing form.
The user should finish the experience knowing:
“This is how my business is doing, and these are the things I should do next.”

3. PRIMARY UX SUCCESS CRITERIA
The wireframe must demonstrate that a user can:
Understand the purpose immediately
Start without registration
Choose a language
Select their business profile
Answer 28 questions
Understand progress
Complete the assessment in under 10 minutes
Receive a score in under 2 seconds after completion
Understand what their score means
Identify their strengths
Identify their top priorities
Access the relevant guide modules
Share their results through WhatsApp
Optionally save results
Restart the assessment

4. TARGET USER PROFILES
A. Social Commerce Operator
Typical behaviour:
Android smartphone
WhatsApp/Instagram-based business
Low browser usage
May prefer Nigerian Pidgin
Low compliance knowledge
Design requirements:
WhatsApp must be prominent
No email dependency
Simple language
Large touch targets
Minimal typing

B. Traditional Trader Going Digital
Typical behaviour:
Physical shop
Beginning to collect digital customer information
Lower technology confidence
Design requirements:
Extremely plain language
Strong progress indicator
No unnecessary technical terminology
Large selectable controls

C. Logistics / Delivery Operator
Typical behaviour:
Handles customer addresses
Handles driver/employee information
Shares information with third parties such as delivery partners
Design requirements:
Clearly distinguish customer data and employee data
Clearly explain third-party sharing examples

D. Digital-Native Startup
Typical behaviour:
Web-first
Moderate compliance awareness
Wants specific actions rather than generic advice
Design requirements:
Can support slightly more nuanced explanations
Results should be specific and actionable

5. COMPLETE USER FLOW
ENTRY
  ↓
LANDING
  ↓
LANGUAGE
  ↓
BUSINESS SECTOR
  ↓
BUSINESS SIZE
  ↓
ASSESSMENT
  ↓
CATEGORY TRANSITIONS
  ↓
FINAL QUESTION
  ↓
PROCESSING
  ↓
RESULTS
  ├── CATEGORY DETAILS
  ├── WHATSAPP SHARE
  ├── SAVE RESULTS
  └── START OVER
Every step must be optional to abandon.
Do not create a forced registration or lead-capture flow.

6. SCREEN / FRAME INVENTORY
Antigravity should generate the following primary wireframe frames:
Entry
Landing
Onboarding
Language Selection
Sector Selection
Business Size Selection
Assessment
Assessment — Default
Assessment — Answer Selected
Assessment — Category Transition
Assessment — Final Question
Results
Processing
Results — Green
Results — Amber
Results — Red
Results — Category Breakdown Expanded
Sharing / Saving
WhatsApp Share
Save Results — Consent
Save Results — Email Entry
Save Results — Success
Save Results — Email Error
Other
Restart Confirmation
Privacy Notice
Offline / Connection State
Generic Error State
Do not create 28 individual question screens.
The assessment must be represented by a reusable question component.

7. LANDING SCREEN
Purpose
Communicate value immediately.
Required content
Eyebrow:
NDPA Compliance Self-Check
Headline:
How well does your business protect customer information?
Supporting text:
Answer a few simple questions to see what your business is doing well and what you should improve.
Trust/value indicators:
Takes less than 10 minutes
No account required
Your answers stay on your device
Primary CTA:
Check my business
Language control:
English | Pidgin
Privacy link:
Your privacy
Do NOT include
Login
Sign up
Password
Phone number
Email field
Long legal disclaimer
Heavy animation

8. LANGUAGE SELECTION
Heading
Choose your language
Options:
English
Pidgin
CTA:
Continue
The selected language persists throughout the session.
All UI copy must come from a language configuration rather than being hardcoded individually.

9. BUSINESS PROFILE
Sector
Question:
What type of business do you run?
Options:
Retail / Fashion
Logistics
Digital Services
Sector affects question framing and result copy.
Sector does not change the underlying scoring weights.

Business Size
Question:
How big is your business?
Three options are required by the original PRD, but exact labels/criteria have not been confirmed.
Use:
Small — TBD
Growing — TBD
Larger — TBD
Do not invent official thresholds.
Business size should be treated as a profile variable until the product owner confirms whether/how it affects the assessment.

10. ASSESSMENT ENGINE
The assessment contains exactly:
28 questions
across five categories.
Category
Questions
Weight
Applicability & Awareness
5
15%
Baseline Compliance
7
30%
Lawful Basis & Marketing
5
20%
DPO & Governance
4
10%
Breach Readiness
7
25%

Total:
28 questions / 100% weight

11. QUESTION TYPES
Every question has exactly three answer options:
Yes
No
Not Sure
Scoring:
Yes       = 1
Not Sure  = 0.5
No        = 0
The wireframe must visually communicate that only one answer can be selected.

12. MOBILE QUESTION LAYOUT
For mobile:
NDPA SELF-CHECK

[Progress bar]

Question 7 of 28

Baseline Compliance

Do you have a written privacy
notice that tells customers
what information you collect
and why?

[ YES ]

[ NO ]

[ NOT SURE ]

[ NEXT → ]

Restart assessment
Requirements:
One question per screen
Minimum 44×44px interactive targets
Clear selected state
Next disabled until answer is selected
Persistent progress
Category name visible
Current question number visible
Restart accessible but visually secondary

13. PROGRESS INDICATOR
Show both:
Question 7 of 28
and a visual progress bar.
Example:
25% complete
Progress should update after each answered question.
Do not make users guess how long the assessment will take.

14. CATEGORY TRANSITION
Optional lightweight transition between categories.
Example:
One section complete
✓ Applicability & Awareness
✓ Baseline Compliance
Up next
Lawful Basis & Marketing
5 questions
CTA:
Continue
This should be brief and skippable if user-flow testing shows it adds unnecessary friction.

15. ASSESSMENT DATA STORAGE
Assessment answers must be processed client-side.
Use:
browser sessionStorage
for the active assessment session.
Store:
Assessment answers
Selected language
Sector
Business size
Current progress
Do NOT send individual assessment answers to a server.
Session data should be cleared when the session ends and when the user explicitly chooses Start Over.

16. OFFLINE BEHAVIOUR
After the initial application page has loaded, the assessment should remain usable without continuous internet access.
The following must work without additional network calls:
Answering questions
Navigating questions
Scoring
Generating results
Viewing results
The wireframe should include an annotation showing this requirement.

17. SCORING MODEL
The product must calculate a weighted composite score.
Each category first produces a category score based on:
earned points / maximum possible points
The category score is then multiplied by its assigned weight.
Conceptually:
Overall Score =
(Applicability Score × 15%)
+
(Baseline Score × 30%)
+
(Lawful Basis Score × 20%)
+
(DPO Score × 10%)
+
(Breach Score × 25%)
The result is normalised to a percentage from 0–100.
IMPORTANT:
The exact implementation formula must be confirmed by the product/engineering team before production.

18. RISK TIERS
70–100
GREEN
Low Risk
Plain-language message:
Your business is doing many of the important things right.
Pidgin direction:
Dem good.

40–69
AMBER
Action Needed
Plain-language message:
Your business is meeting some requirements but has important gaps to address.
Pidgin direction:
You need do something.

0–39
RED
Urgent Action
Plain-language message:
Your business has important gaps that should be addressed as soon as possible.
Pidgin direction:
You need act now.
Do not rely on colour alone to communicate risk.
Always display the text label.

19. PROCESSING
After question 28:
Display a very short processing state.
Heading:
Checking your results…
Supporting text:
We’re looking at your answers to identify your strengths and the areas that need attention.
Results should render in under:
2 seconds
Do not create a long loading experience.

20. RESULTS SCREEN — PRIMARY VALUE DELIVERY
This is the most important screen.
The user must immediately understand:
Risk level
Score
Meaning of score
Strengths
Priority actions

21. RESULTS INFORMATION HIERARCHY
Use this order:
Risk Tier
↓
Score
↓
Plain-language interpretation
↓
Strength Summary
↓
Category Breakdown
↓
Priority Actions
↓
WhatsApp
↓
Save
↓
Restart

22. RESULTS TOP SECTION
Example:
Your results
AMBER
ACTION NEEDED
64%
Your business is meeting some requirements but has important gaps to address.
The score and risk tier should be visible above the fold on mobile.

23. STRENGTH SUMMARY
Heading:
What you’re doing well
Display the top two categories.
Example:
Your business already has a good foundation in Breach Readiness and DPO & Governance.
Do not use generic praise.
The strength summary must be generated from the user’s category scores.

24. CATEGORY BREAKDOWN
Display all five category scores.
Example:
Baseline Compliance
55%    ███████████░░░

Breach Readiness
72%    ██████████████░

Lawful Basis & Marketing
40%    ████████░░░░░░

Applicability & Awareness
60%    ████████████░░

DPO & Governance
65%    █████████████░
On mobile:
Collapsed by default
User can expand the section.

25. PRIORITY ACTION ENGINE
Maximum:
5 actions
Each action must contain:
Action title
Example:
Create a privacy notice for your customers
Why it matters
Customers should know what information you collect and why you use it.
Guide destination
Read Module 2 →
The action engine must be deterministic and based on assessment responses.
Do not generate random recommendations.

26. ACTION PRIORITISATION
Priority actions should be ordered based on:
Regulatory risk
Category weighting
User’s failed/uncertain responses
Relevant guide module
The system should prioritise gaps rather than simply showing the five lowest category scores.
Example:
If the user answers:
No to privacy notice
that should generate the corresponding privacy-notice action.
If the user answers:
Not Sure to breach readiness
that may generate a breach-response action.
The final mapping between every question and recommended action is TBD and must be provided/approved by the product owner.

27. GUIDE INTEGRATION
Every priority action should link to the relevant MSME Compliance Starter Guide module.
Example:
Create a privacy notice
→ Read Module 2
The wireframe should show these links as actionable elements.
The final URLs/modules are TBD.

28. WHATSAPP DELIVERY
Primary results CTA:
Send to my WhatsApp
The system should generate a plain-text message.
Maximum message length:
Under 1,000 characters
Message should contain:
Tool name
Risk tier
Overall score
Top 3 priority actions
Tool URL
The message is passed through a wa.me click-to-chat URL.
No WhatsApp Business API is required for v1.0.
No assessment data is sent to the Mustarred/NDPC server through this flow.
The wireframe should show:
Results
   ↓
Send to my WhatsApp
   ↓
WhatsApp opens
   ↓
Pre-filled message
Do not design an in-app WhatsApp interface.

29. SAVE RESULTS FLOW
Primary secondary CTA:
Save my results
Before collecting email, show consent.
Consent screen
Save your results
We’ll use your email only to send your results. We won’t keep it after delivery.
Then:
I agree to receive my results by email
Email input appears only after the appropriate consent step.
Then:
Send my results

30. EMAIL DATA PROCESSING
Email is:
Optional
Collected only after consent
Used only for result delivery
Not retained after delivery
The wireframe should not imply that the email is being used for marketing.
The exact email delivery provider/technical implementation is TBD.

31. PDF / RESULTS FORMAT
The product requirement allows:
Plain-text email
Downloadable PDF
The final implementation choice is TBD.
For wireframing, show:
Save my results
rather than committing to a specific backend implementation.

32. PRIVACY ARCHITECTURE
Default data collection:
None
Assessment answers:
Browser sessionStorage
Sector/size:
Browser sessionStorage
Email:
Only if user opts into Save Results
WhatsApp result text:
Processed on user’s device
Aggregate usage:
Optional, consent-based, anonymised
Do not introduce:
Account database
User profiles
Authentication
Cookies for tracking
Google Analytics
Facebook Pixel
Unapproved third-party analytics

33. PRIVACY NOTICE
Persistent footer link:
Privacy
Available from every screen.
The privacy notice should explain:
What is collected by default
What stays on the device
What happens if the user saves results
What happens when they use WhatsApp
User rights
How optional aggregate data works, if enabled
Final legal copy is TBD.

34. SECURITY REQUIREMENTS
Production implementation must include:
HTTPS
Content Security Policy (CSP)
No unnecessary third-party scripts
No tracking scripts without explicit consent
No unnecessary cookies
No server-side assessment data processing
These requirements do not need to become visual UI elements, but Antigravity should annotate them as implementation requirements rather than ignoring them.

35. PERFORMANCE REQUIREMENTS
The application must:
Load initial page in under 3 seconds on a 3G connection
Render results in under 2 seconds
Keep total HTML + CSS + JS payload under 500KB
Design implications:
No large background images
No video
No heavy animation
No unnecessary external libraries
No oversized assets

36. DEVICE REQUIREMENTS
Primary:
Android smartphones
Supported:
Chrome 90+
Samsung Internet 14+
Secondary:
iOS Safari
Firefox
Minimum viewport:
360px
No native app installation.

37. RESPONSIVE BEHAVIOUR
Mobile
One question per screen.
Tablet/Desktop
Questions may be grouped.
Results can use a wider layout.
However:
Mobile is the primary design reference.
Do not design desktop first and then shrink it.

38. EMBEDDING
The tool must be embeddable in the NDPC National Open-Access Knowledge Portal using an iframe.
Minimum supported embedded width:
320px
The UI must not depend on:
Fixed viewport assumptions
Full-screen browser width
Horizontal scrolling
Antigravity should annotate the wireframe:
Responsive iframe container — minimum width 320px

39. QR ENTRY
The tool URL will be distributed through QR codes.
Therefore:
Landing must load immediately
No splash screen
No loading animation before content
Primary CTA must be visible immediately
QR destination must be a stable URL

40. ACCESSIBILITY
Target:
WCAG 2.1 AA
Requirements:
4.5:1 minimum text contrast
44×44px minimum touch targets
Keyboard-accessible controls
Screen-reader-compatible controls
ARIA labels where appropriate
Do not use colour as the only status indicator
Visible focus states
Clear error messages

41. INTERNATIONALISATION
All UI text should be stored in a language configuration structure.
Conceptually:
English
Pidgin
Future languages
Do not hardcode text throughout the interface.
Pidgin copy should be reviewed by a native speaker before launch.

42. EDGE CASES
The wireframe must account for:
User leaves midway
No blocking warning.
Progress may be lost when the session ends.
User restarts
Clear all session assessment data.
User loses internet
Assessment remains functional after initial load.
WhatsApp not installed
Provide an appropriate fallback.
Email fails
Show:
We couldn’t send your results.
Allow:
Try again
User declines email consent
Return them to results without collecting email.
User submits incomplete assessment
Do not calculate a final result.
Return them to the unanswered question.
Browser/session closes
Session data is cleared.

43. LEGAL / COMPLIANCE POSITIONING
The tool must clearly communicate:
This self-check is for general guidance only. It is not legal advice and does not constitute a formal compliance audit.
Do not claim:
“You are legally compliant.”
“You are fully compliant.”
“NDPC has approved your business.”
“You have passed the NDPA.”
“You are certified.”
Instead use:
“Your self-check score”
“Areas to improve”
“Action needed”
“Low/medium/urgent risk indication”
The product must not trigger any regulatory process or submit information to NDPC.

44. NON-GOALS
Do not design:
User accounts
Login
Registration
Regulatory filing
NDPC submission
Formal audit report
Third-party regulatory database integration
Government API integration
Large-enterprise compliance workflows
Compliance-professional dashboard
WhatsApp Business API integration in v1.0

45. WIREFRAME VISUAL LANGUAGE
Use:
Low fidelity
Grayscale
Simple typography
Basic cards
Basic buttons
Basic progress bars
Minimal icons
Clear annotations
Do not focus on:
Brand colour
Decorative illustrations
Gradients
Complex shadows
Motion design
Final visual identity
The wireframe should communicate structure and interaction, not final aesthetics.

46. REQUIRED COMPONENTS
Create reusable components for:
Buttons
Primary
Secondary
Tertiary
Disabled
Loading
Answer controls
Default
Hover/focus
Selected
Disabled
Progress
Progress bar
Question counter
Category label
Risk badge
Green
Amber
Red
Category score
Default
Expanded
Priority action card
Default
Guide link
Modal
Privacy
Restart confirmation
Consent

47. WIREFRAME FRAME ORDER
Antigravity should create:
01  Landing
02  Language
03  Sector
04  Business Size

05  Assessment / Default
06  Assessment / Selected
07  Category Transition
08  Final Question

09  Processing

10  Results / Green
11  Results / Amber
12  Results / Red
13  Results / Category Expanded

14  WhatsApp
15  Save / Consent
16  Save / Email
17  Save / Success
18  Save / Error

19  Restart Confirmation
20  Privacy Notice
21  Offline State
22  Error State

48. INTERACTION PROTOTYPE REQUIREMENTS
The clickable prototype should demonstrate:
Landing
→ Language
→ Sector
→ Business Size
→ Question
→ Answer
→ Next
→ Category transition
→ Final question
→ Processing
→ Results
From Results demonstrate:
Results
→ Category expansion

Results
→ WhatsApp

Results
→ Save
→ Consent
→ Email
→ Success

Results
→ Restart
→ Confirmation
At least one Green, Amber and Red result state must be represented.

49. DESIGN CONTENT PRIORITY
If there is a conflict between visual decoration and information clarity, prioritise:
1. User comprehension
2. Assessment completion
3. Result comprehension
4. Actionability
5. Performance
6. Accessibility
7. Visual polish

50. UNRESOLVED ITEMS — DO NOT INVENT
The following require product-owner confirmation:
Content
Final 28 questions
Final English copy
Final Pidgin copy
Business profiling
Exact business-size options
Business-size criteria
Exact impact of business size on question/result framing
Scoring
Final weighted-score implementation
Handling of edge cases around category scores
Recommendations
Question → action mapping
Priority-action ranking logic
Final guide-module mapping
Save Results
Email delivery provider
PDF generation method
Exact delivery format
Analytics
Whether optional aggregate usage tracking is included in v1.0
Exact consent UX
Exact anonymised metrics
Legal
Final privacy notice
Final disclaimer
Final Pidgin legal/compliance wording

51. FINAL ANTIGRAVITY INSTRUCTION
Create a complete low-fidelity, mobile-first wireframe and clickable UX flow based strictly on this PRD.
The output should demonstrate a coherent end-to-end product rather than isolated screens.
The most important flow is:
Discover → Understand → Answer → Score → Understand → Act
The most important screen is the Results screen.
Do not turn this into a generic compliance dashboard.
Do not add login.
Do not add unnecessary data collection.
Do not invent unresolved regulatory requirements.
Do not invent missing business-size definitions.
Do not invent the final 28 questions.
Use clearly labelled TBD placeholders where required.
Design the experience for a Nigerian MSME owner using an Android smartphone on a potentially slow 3G connection.
The final wireframe should make the product understandable to a first-time user with no legal or compliance background.
The core product promise is:
“In less than 10 minutes, understand how your business is handling customer information, see where the gaps are, and know what to do next.”

