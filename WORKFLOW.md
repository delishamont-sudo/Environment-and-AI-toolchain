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

## Accessibility

Round 1's output was not accessibility-void: it already included `<label htmlFor>` associations, `aria-invalid`, `aria-describedby` pointing to error text, and `role="alert"` on error messages, so the base wasn't neglected. Round 2's precise prompt still improved on this in two concrete ways: it added the `required` attribute to both inputs, giving assistive technology and native browser validation an explicit signal that round 1 omitted; and it namespaced element IDs (`name` → `settings-name`, `email` → `settings-email`), reducing the risk of ID collisions breaking `aria-describedby`/`htmlFor` associations if the form is reused alongside other forms. Round 2 also fixed a subtle correctness issue affecting accessibility: round 1's `handleBlur` marked a field as touched without saving its latest value, meaning error state and ARIA attributes could update against stale data; round 2 captures the field's current value in the same update.

## Edge Cases

Beyond the numeric-only name issue, round 2's test suite formalized coverage for several edge cases that round 1 handled inconsistently or only informally: empty name and empty email on blur, invalid email format on both blur and submit, and numeric-only names on submit. It also tests the success path explicitly, confirming a success message appears after valid submission. Round 1 handled some of these cases at runtime (basic empty-field and format checks existed), but with no automated tests, correctness relied entirely on manual spot-checking rather than a repeatable, verifiable suite.