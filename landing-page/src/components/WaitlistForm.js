'use client'

import { useId, useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const roleOptions = [
  { value: '', label: 'Your role (optional)' },
  { value: 'homeowner', label: 'Homeowner / Renter' },
  { value: 'organizer', label: 'Professional organizer' },
  { value: 'relocation', label: 'Relocation consultant' },
  { value: 'property-manager', label: 'Property manager' },
  { value: 'other', label: 'Something else' },
];

const messageByStatus = {
  success: {
    Icon: CheckCircle2,
    text: 'Thanks! Check your inbox for the Moving Day Command Center preview.',
    className: 'text-emerald-600 dark:text-emerald-400',
  },
  error: {
    Icon: AlertCircle,
    text: 'We could not add that email. Double-check and try again.',
    className: 'text-rose-600 dark:text-rose-400',
  },
};

function WaitlistForm({ orientation = 'horizontal' }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('idle');
  const formId = useId();
  const emailId = `${formId}-email`;
  const roleId = `${formId}-role`;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (formData.get('company')) {
      return;
    }

    if (!email.trim()) {
      setStatus('error');
      return;
    }

    try {
      setStatus('loading');
      await new Promise((resolve) => setTimeout(resolve, 850));
      setStatus('success');
      setEmail('');
      setRole('');
    } catch (_error) {
      setStatus('error');
    }
  };

  const FormStatus = messageByStatus[status];
  const messageLayoutClasses =
    orientation === 'horizontal' ? 'sm:pt-0 sm:pl-4' : '';

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'flex w-full flex-col items-stretch gap-3',
        orientation === 'horizontal'
          ? 'sm:flex-row sm:items-stretch sm:justify-start sm:gap-3'
          : ''
      )}
      aria-live='polite'
    >
      <input type='text' name='company' className='hidden' tabIndex={-1} autoComplete='off' />
      <div className='flex-1'>
        <label htmlFor={emailId} className='sr-only'>
          Email address
        </label>
        <input
          id={emailId}
          type='email'
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder='you@example.com'
          className='w-full rounded-full border border-slate-300 bg-white px-5 py-3 text-base shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-200 dark:focus:ring-slate-100/10'
        />
      </div>

      <div
        className={cn(
          'w-full sm:w-52',
          orientation === 'horizontal' ? 'sm:mt-0' : ''
        )}
      >
        <label htmlFor={roleId} className='sr-only'>
          Role
        </label>
        <select
          id={roleId}
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className='w-full rounded-full border border-slate-300 bg-white px-5 py-3 text-base text-slate-700 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-200 dark:focus:ring-slate-100/10'
        >
          {roleOptions.map((option) => (
            <option key={option.value || 'empty'} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type='submit'
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-full bg-slate-900 px-6 py-3 text-base font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white dark:focus:ring-slate-100/20',
          orientation === 'horizontal' ? 'sm:mt-0' : 'mt-1',
          status === 'loading' ? 'cursor-wait opacity-80' : ''
        )}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? (
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
        ) : null}
        {status === 'success' ? 'Waitlist joined' : 'Join the waitlist'}
      </button>

      {FormStatus ? (
        <p className={cn('flex items-center gap-2 text-sm font-medium pt-3', messageLayoutClasses, FormStatus.className)}>
          <FormStatus.Icon className='h-4 w-4' />
          <span>{FormStatus.text}</span>
        </p>
      ) : null}
    </form>
  );
}

export default WaitlistForm;

