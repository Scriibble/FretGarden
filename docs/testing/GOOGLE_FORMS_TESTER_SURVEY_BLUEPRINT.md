# Google Forms Tester Survey Blueprint

Date: July 15, 2026

Use this blueprint to create the FretGarden tester survey in Google Forms. The current Codex environment cannot create the live Google Form directly because no Google Forms connector is available.

Recommended form title: **FretGarden Early Access Tester Survey**

Recommended form description:

> Thank you for testing FretGarden. This survey helps evaluate usability, accessibility, lesson clarity, and release readiness. Please avoid sharing sensitive personal information. Practice progress is currently local to your browser, and accounts do not yet sync progress across devices.

## Form Settings

- Collect email addresses: optional for anonymous testing; required only if follow-up is needed.
- Limit to one response: off unless all testers use Google accounts.
- Allow response editing: on.
- Show progress bar: on.
- Confirmation message: "Thank you for helping shape FretGarden. Your feedback will be reviewed before broader release decisions."

## Section 1: Consent And Context

1. **I understand this is early-access software.**  
   Type: Required checkbox  
   Option: "I understand."

2. **I understand practice progress is currently stored in this browser and may not appear on other devices.**  
   Type: Required checkbox  
   Option: "I understand."

3. **May FretGarden use anonymized quotes or summarized feedback from this survey in release-readiness notes?**  
   Type: Required multiple choice  
   Options: "Yes, anonymized quotes are okay", "Summaries only; do not quote me", "No; use only for internal issue tracking"

4. **Tester profile**  
   Type: Required multiple choice  
   Options: "Early guitar learner", "Returning guitar learner", "Experienced guitarist", "Guitar educator or curriculum reviewer", "Accessibility reviewer", "Other"

5. **Device and browser used**  
   Type: Short answer  
   Help text: "Example: iPhone Safari, Windows Chrome, Mac VoiceOver Safari."

## Section 2: First Impression And Navigation

6. **What did you try first?**  
   Type: Multiple choice  
   Options: "Practice tools", "Lessons", "Progress page", "Account pages", "Explore page", "Other"

7. **How easy was it to understand what FretGarden is for?**  
   Type: Linear scale 1-5  
   Labels: 1 "Very unclear", 5 "Very clear"

8. **How easy was it to find a useful next action?**  
   Type: Linear scale 1-5  
   Labels: 1 "Very difficult", 5 "Very easy"

9. **What, if anything, felt confusing about navigation or page labels?**  
   Type: Paragraph

## Section 3: Lesson And Practice Quality

10. **Which lesson or practice task did you try?**  
    Type: Short answer

11. **The lesson helped me understand what to practice and why.**  
    Type: Linear scale 1-5  
    Labels: 1 "Strongly disagree", 5 "Strongly agree"

12. **The task felt appropriately sized for the time I had.**  
    Type: Linear scale 1-5

13. **The feedback or completion language felt honest and not exaggerated.**  
    Type: Linear scale 1-5

14. **What was the most useful part of the lesson or practice task?**  
    Type: Paragraph

15. **What should be changed before wider testing?**  
    Type: Paragraph

## Section 4: Progress, Evidence, And Local Storage

16. **Did you understand that older lesson/drill history is separate from current evidence?**  
    Type: Multiple choice  
    Options: "Yes", "Mostly", "No", "I did not look at progress"

17. **Did you understand that account creation does not yet sync practice progress?**  
    Type: Multiple choice  
    Options: "Yes", "Mostly", "No", "I did not use account pages"

18. **The progress labels were clear and not misleading.**  
    Type: Linear scale 1-5

19. **What progress or evidence wording should be clearer?**  
    Type: Paragraph

## Section 5: Accessibility

20. **Did you use any accessibility tools or settings while testing?**  
    Type: Checkboxes  
    Options: "Keyboard only", "Screen reader", "Screen magnification or browser zoom", "Reduced motion", "High contrast or custom colors", "Touch device", "None", "Other"

21. **Could you complete the tested task without using a mouse?**  
    Type: Multiple choice  
    Options: "Yes", "Partly", "No", "I did not test keyboard access"

22. **Were labels, instructions, and feedback understandable with your access method?**  
    Type: Linear scale 1-5

23. **Did any control, instruction, focus state, audio/visual cue, or layout block you?**  
    Type: Paragraph

24. **If you used a screen reader, what screen reader and browser did you use?**  
    Type: Short answer

## Section 6: Release Readiness

25. **Would you feel comfortable recommending this to someone as an early-access learning tool?**  
    Type: Multiple choice  
    Options: "Yes", "Yes, with caveats", "Not yet", "Unsure"

26. **What must be fixed before wider release?**  
    Type: Paragraph

27. **May the project owner contact you for follow-up?**  
    Type: Multiple choice  
    Options: "Yes", "No"

28. **Optional contact email for follow-up**  
    Type: Short answer

## Evidence Mapping

- Questions 1-5 support consent, participant profile, and test context.
- Questions 6-9 support usability navigation evidence.
- Questions 10-15 support lesson clarity and instructional-quality evidence.
- Questions 16-19 support progress/evidence comprehension.
- Questions 20-24 support accessibility protocol evidence.
- Questions 25-28 support release-readiness decision making.

## Post-Session Record

After each moderated session, add a row to the Gate 4 record with:

- participant profile;
- date;
- device/browser/accessibility tools;
- task attempted;
- blocker/major/minor findings;
- exact follow-up issue or accepted debt;
- whether the session supports Gate 4 closure.
