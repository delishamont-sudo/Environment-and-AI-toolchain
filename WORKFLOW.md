# AI Coding Workflow Comparison

## Round 1: Vague Prompt

For Round 1, I used a deliberately vague prompt: “Create a settings form with name and email fields and a save button. Add basic validation and make it look good.” The AI created a working React + Vite settings form with name and email validation, blur/submit validation, styling, and some accessibility attributes. The implementation took about one minute to run and review.

However, the vague prompt left important behavior unspecified. For example, the name validation only required two characters and accepted numeric-only input such as `12345`. This was an AI mistake I caught during review. Round 1 also had no automated tests, so verification depended mainly on manually interacting with the form.

## Round 2: Precise Prompt

For Round 2, I used a fresh session and a detailed prompt containing file references, constraints, accessibility requirements, edge cases, expected behavior, and a verification process. The AI first produced an implementation plan, then built the form and added tests. The initial implementation and verification took a little over three minutes.

The code differences show the effect of the more precise workflow. `SettingsForm.jsx` changed by 69 lines, including a new exported `validateSettings()` function and stronger name validation that rejects numeric-only names and requires at least two alphabetic characters. Round 2 also added `SettingsForm.test.jsx` with 13 tests, `src/test/setup.js`, and Vitest configuration. The tests covered empty and valid fields, invalid email input, numeric-only names, and successful submission. The AI reported that all 13 tests passed and that the production build succeeded.

## What I Learned

Round 2 took longer initially, but it required less reliance on assumptions because the requirements and verification steps were explicit. The detailed prompt also made accessibility and edge cases part of the implementation rather than things discovered only during review. The main lesson is that effective AI-assisted development is not just generating code quickly; it is specifying expected behavior, identifying risks, and requiring verification.

Going forward, I will use explicit validation rules, accessibility requirements, edge cases, and automated tests when asking AI to implement project features.
