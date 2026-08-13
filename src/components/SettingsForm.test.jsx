import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import SettingsForm, { validateSettings } from './SettingsForm.jsx';

describe('validateSettings', () => {
  it('rejects an empty name', () => {
    expect(validateSettings({ name: '', email: 'a@b.co' }).name).toBe(
      'Name is required.',
    );
  });

  it('rejects a numeric-only name', () => {
    expect(validateSettings({ name: '12345', email: 'a@b.co' }).name).toBe(
      'Name cannot contain numbers only.',
    );
  });

  it('accepts a valid name', () => {
    expect(validateSettings({ name: 'Jane', email: 'a@b.co' }).name).toBeUndefined();
  });

  it('rejects an empty email', () => {
    expect(validateSettings({ name: 'Jane', email: '' }).email).toBe(
      'Email is required.',
    );
  });

  it('rejects an invalid email', () => {
    expect(validateSettings({ name: 'Jane', email: 'not-an-email' }).email).toBe(
      'Enter a valid email address.',
    );
  });

  it('accepts a valid email', () => {
    expect(
      validateSettings({ name: 'Jane', email: 'jane@example.com' }).email,
    ).toBeUndefined();
  });
});

describe('SettingsForm', () => {
  async function submitForm(user) {
    await user.click(screen.getByRole('button', { name: 'Save' }));
  }

  it('shows an error for an empty name on blur', async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    await user.click(screen.getByLabelText('Name'));
    await user.tab();

    expect(await screen.findByRole('alert')).toHaveTextContent('Name is required.');
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows an error for a numeric-only name on submit', async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    await user.type(screen.getByLabelText('Name'), '12345');
    await user.type(screen.getByLabelText('Email'), 'jane@example.com');
    await submitForm(user);

    expect(screen.getByText('Name cannot contain numbers only.')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveValue('12345');
  });

  it('accepts a valid name', async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    await user.type(screen.getByLabelText('Name'), 'Jane');
    await user.tab();

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'false');
  });

  it('shows an error for an empty email on blur', async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    await user.type(screen.getByLabelText('Name'), 'Jane');
    await user.click(screen.getByLabelText('Email'));
    await user.tab();

    expect(screen.getByText('Email is required.')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows an error for an invalid email on submit', async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    await user.type(screen.getByLabelText('Name'), 'Jane');
    await user.type(screen.getByLabelText('Email'), 'bad-email');
    await submitForm(user);

    expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toHaveValue('bad-email');
  });

  it('accepts a valid email', async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    await user.type(screen.getByLabelText('Name'), 'Jane');
    await user.type(screen.getByLabelText('Email'), 'jane@example.com');
    await user.tab();

    expect(screen.queryByText('Enter a valid email address.')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'false');
  });

  it('shows a success message on successful submission', async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    await user.type(screen.getByLabelText('Name'), 'Jane Doe');
    await user.type(screen.getByLabelText('Email'), 'jane@example.com');
    await submitForm(user);

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Settings saved successfully.',
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
