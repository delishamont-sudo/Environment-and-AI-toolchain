import { useState } from 'react';
import './SettingsForm.css';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateSettings({ name, email }) {
  const errors = {};
  const trimmedName = name.trim();

  if (!trimmedName) {
    errors.name = 'Name is required.';
  } else if (/^\d+$/.test(trimmedName)) {
    errors.name = 'Name cannot contain numbers only.';
  } else {
    const alphabeticCount = (trimmedName.match(/[a-zA-Z]/g) || []).length;
    if (alphabeticCount < 2) {
      errors.name = 'Name must contain at least 2 alphabetic characters.';
    }
  }

  const trimmedEmail = email.trim();
  if (!trimmedEmail) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
    errors.email = 'Enter a valid email address.';
  }

  return errors;
}

export default function SettingsForm() {
  const [fields, setFields] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [touched, setTouched] = useState({ name: false, email: false });

  function showError(field) {
    return Boolean(touched[field] && errors[field]);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    const nextFields = { ...fields, [name]: value };

    setFields(nextFields);
    setSaved(false);

    if (touched[name]) {
      const nextErrors = validateSettings(nextFields);
      setErrors((prev) => ({ ...prev, [name]: nextErrors[name] }));
    }
  }

  function handleBlur(event) {
    const { name, value } = event.target;
    const nextFields = { ...fields, [name]: value };
    const nextTouched = { ...touched, [name]: true };

    setFields(nextFields);
    setTouched(nextTouched);
    setErrors(validateSettings(nextFields));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setTouched({ name: true, email: true });

    const validationErrors = validateSettings(fields);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setSaved(true);
    }
  }

  return (
    <section className="settings-card" aria-labelledby="settings-heading">
      <header className="settings-card__header">
        <h1 id="settings-heading">Settings</h1>
        <p>Update your profile information below.</p>
      </header>

      <form className="settings-form" onSubmit={handleSubmit} noValidate>
        <div className={`field ${showError('name') ? 'field--error' : ''}`}>
          <label htmlFor="settings-name">Name</label>
          <input
            id="settings-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            value={fields.name}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={showError('name')}
            aria-describedby={showError('name') ? 'settings-name-error' : undefined}
            required
          />
          {showError('name') && (
            <p id="settings-name-error" className="field__error" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        <div className={`field ${showError('email') ? 'field--error' : ''}`}>
          <label htmlFor="settings-email">Email</label>
          <input
            id="settings-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="jane@example.com"
            value={fields.email}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={showError('email')}
            aria-describedby={showError('email') ? 'settings-email-error' : undefined}
            required
          />
          {showError('email') && (
            <p id="settings-email-error" className="field__error" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        <div className="settings-form__actions">
          <button type="submit" className="btn btn--primary">
            Save
          </button>
          {saved && (
            <p className="settings-form__success" role="status">
              Settings saved successfully.
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
