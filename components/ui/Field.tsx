'use client';

import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';

const control =
  'min-h-[52px] w-full rounded-sm border bg-surface px-3.5 py-3 text-ink transition-colors placeholder:text-faint focus:border-brand-500';

function shell(error?: string) {
  return `${control} ${error ? 'border-seat-sold' : 'border-line'}`;
}

interface Common {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

function Wrapper({
  id,
  label,
  error,
  hint,
  required,
  children,
}: Common & { id: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-muted">
        {label}
        {required && (
          <span className="ml-0.5 text-seat-sold" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {children}

      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-faint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs font-medium text-seat-sold">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextField({
  label,
  error,
  hint,
  required,
  ...props
}: Common & InputHTMLAttributes<HTMLInputElement>) {
  const generated = useId();
  const id = props.id ?? generated;

  return (
    <Wrapper id={id} label={label} error={error} hint={hint} required={required}>
      <input
        {...props}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={shell(error)}
      />
    </Wrapper>
  );
}

export function SelectField({
  label,
  error,
  hint,
  required,
  children,
  ...props
}: Common & SelectHTMLAttributes<HTMLSelectElement>) {
  const generated = useId();
  const id = props.id ?? generated;

  return (
    <Wrapper id={id} label={label} error={error} hint={hint} required={required}>
      <select
        {...props}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={shell(error)}
      >
        {children}
      </select>
    </Wrapper>
  );
}

export function TextareaField({
  label,
  error,
  hint,
  required,
  ...props
}: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const generated = useId();
  const id = props.id ?? generated;

  return (
    <Wrapper id={id} label={label} error={error} hint={hint} required={required}>
      <textarea
        {...props}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`${shell(error)} min-h-32 resize-y`}
      />
    </Wrapper>
  );
}

/**
 * Focusable summary shown after a failed submit. Screen reader users land here
 * and can jump straight to whichever field needs fixing.
 */
export function ErrorSummary({ errors }: { errors: Record<string, string> }) {
  const entries = Object.entries(errors);
  if (entries.length === 0) return null;

  return (
    <div
      role="alert"
      tabIndex={-1}
      id="error-summary"
      className="rounded-md border border-seat-sold/30 bg-seat-sold/5 p-4"
    >
      <h2 className="font-display text-sm font-semibold text-seat-sold">
        {entries.length === 1
          ? 'One detail needs fixing'
          : `${entries.length} details need fixing`}
      </h2>
      <ul className="mt-2 space-y-1 text-sm text-seat-sold">
        {entries.map(([field, message]) => (
          <li key={field}>{message}</li>
        ))}
      </ul>
    </div>
  );
}
