import { useState } from 'react';
import './SettingsForm.css';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ name, email }) {
  const errors = {};

  const trimmedName = name.trim();
  if (!trimmedName) {
    errors.name = 'Name is required.';
  } else if (trimmedName.length < 2) {
    errors.name = 'Name must be at least 2 characters.';
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

  function handleChange(event) {
    const { name, value } = event.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setSaved(false);

    if (touched[name]) {
      setErrors((prev) => {
        const next = validate({ ...fields, [name]: value });
        return { ...prev, [name]: next[name] };
      });
    }
  }

  function handleBlur(event) {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate(fields));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setTouched({ name: true, email: true });

    const validationErrors = validate(fields);
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
        <div className={`field ${errors.name && touched.name ? 'field--error' : ''}`}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            value={fields.name}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.name && touched.name)}
            aria-describedby={errors.name && touched.name ? 'name-error' : undefined}
          />
          {errors.name && touched.name && (
            <p id="name-error" className="field__error" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        <div className={`field ${errors.email && touched.email ? 'field--error' : ''}`}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="jane@example.com"
            value={fields.email}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.email && touched.email)}
            aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
          />
          {errors.email && touched.email && (
            <p id="email-error" className="field__error" role="alert">
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
