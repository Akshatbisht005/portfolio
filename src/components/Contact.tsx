import { useState, FormEvent, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react'
import { LinkedinIcon } from './icons/LinkedinIcon'
import { ScrollReveal } from './ScrollReveal'
import { usePortfolioData } from '../context/PortfolioDataContext'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

type State = 'idle' | 'loading' | 'success' | 'error'

function FloatingInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  autoComplete,
}: {
  id: string
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  error?: string
  autoComplete?: string
}) {
  const hasVal = value.length > 0
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        required
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder=" "
        className={`peer w-full rounded-xl border ${
          error ? 'border-red-400 dark:border-red-500' : 'border-slate-200 dark:border-slate-700'
        } bg-white dark:bg-slate-900 px-4 pt-6 pb-2 text-slate-900 dark:text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all duration-200`}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={!!error}
      />
      <label
        htmlFor={id}
        className={`absolute left-4 text-slate-500 dark:text-slate-400 transition-all duration-200 pointer-events-none ${
          hasVal
            ? 'top-2 text-xs font-medium text-violet-600 dark:text-violet-400'
            : 'top-4 text-sm'
        } peer-focus:top-2 peer-focus:text-xs peer-focus:font-medium peer-focus:text-violet-600 dark:peer-focus:text-violet-400`}
      >
        {label} <span className="text-violet-600" aria-hidden="true">*</span>
      </label>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export function Contact() {
  const { settings } = usePortfolioData()
  const reduced = useReducedMotion()
  const [form, setForm] = useState({ name: '', email: '', message: '', honeypot: '' })
  const [state, setState] = useState<State>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [lastSubmitTime, setLastSubmitTime] = useState(0)
  const submitRef = useRef<HTMLButtonElement>(null)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Name is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.'
    if (form.message.trim().length < 10) e.message = 'Message must be at least 10 characters.'
    return e
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // 1. Honeypot spam check
    if (form.honeypot) return

    // 2. Client-side throttle (prevent submitting faster than every 10 seconds)
    const now = Date.now()
    if (now - lastSubmitTime < 10000) {
      setState('error')
      setErrorMessage('Please wait a moment before sending another message.')
      return
    }

    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setErrors({})
    setState('loading')
    setErrorMessage('')

    try {
      if (isSupabaseConfigured) {
        // Save to Supabase messages table
        const { error: insertError } = await supabase.from('messages').insert([
          {
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            message: form.message.trim(),
            is_read: false,
          },
        ])

        if (insertError) {
          throw new Error(insertError.message || 'Failed to send message.')
        }
      } else {
        // Fallback simulation if Supabase is unconfigured in development
        console.info('Supabase not configured: message logged locally', form)
        await new Promise(r => setTimeout(r, 600))
      }

      setLastSubmitTime(now)
      setState('success')
      setForm({ name: '', email: '', message: '', honeypot: '' })
    } catch (err: any) {
      console.error('Contact submit error:', err)
      setState('error')
      setErrorMessage(err.message || 'Failed to send message. Please try again or email directly.')
    }
  }

  const shakeVariants = {
    idle: { x: 0 },
    error: { x: reduced ? 0 : [-8, 8, -8, 8, 0], transition: { duration: 0.4 } },
  }

  return (
    <section id="contact" className="py-24 px-6 bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">
            Contact
          </p>
          <h2 className="font-display text-4xl font-bold text-slate-900 dark:text-white">
            Get in touch
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Open to APM and PM opportunities — let's talk.
          </p>
        </ScrollReveal>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Details */}
          <ScrollReveal direction="right">
            <div className="space-y-6">
              {[
                { icon: Mail, label: 'Email', value: settings.email, href: `mailto:${settings.email}` },
                { icon: Phone, label: 'Phone', value: settings.phone, href: `tel:${settings.phone}` },
                { icon: MapPin, label: 'Location', value: settings.location, href: undefined },
                {
                  icon: LinkedinIcon,
                  label: 'LinkedIn',
                  value: settings.linkedin_handle,
                  href: settings.linkedin_url,
                },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-4">
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400">
                    <Icon size={18} aria-hidden={true} />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        target={label === 'LinkedIn' ? '_blank' : undefined}
                        rel={label === 'LinkedIn' ? 'noopener noreferrer' : undefined}
                        className="font-medium text-slate-800 dark:text-slate-200 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="font-medium text-slate-800 dark:text-slate-200">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Form */}
          <ScrollReveal direction="left">
            {state === 'success' ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 py-16 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                >
                  <CheckCircle2 size={56} className="text-emerald-500" aria-hidden="true" />
                </motion.div>
                <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                  Message sent!
                </h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-sm">
                  Thanks for reaching out. Your message has been saved to my inbox and I will get back to you shortly.
                </p>
                <button
                  onClick={() => setState('idle')}
                  className="mt-2 text-sm text-violet-600 dark:text-violet-400 hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Honeypot field for bot protection */}
                <input
                  type="text"
                  name="user_nickname"
                  tabIndex={-1}
                  aria-hidden="true"
                  autoComplete="off"
                  className="sr-only"
                  value={form.honeypot}
                  onChange={e => setForm(f => ({ ...f, honeypot: e.target.value }))}
                />

                <FloatingInput
                  id="contact-name"
                  label="Name"
                  value={form.name}
                  onChange={v => setForm(f => ({ ...f, name: v }))}
                  error={errors.name}
                  autoComplete="name"
                />

                <FloatingInput
                  id="contact-email"
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={v => setForm(f => ({ ...f, email: v }))}
                  error={errors.email}
                  autoComplete="email"
                />

                <div className="relative">
                  <textarea
                    id="contact-message"
                    rows={5}
                    required
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder=" "
                    className={`peer w-full resize-none rounded-xl border ${
                      errors.message ? 'border-red-400 dark:border-red-500' : 'border-slate-200 dark:border-slate-700'
                    } bg-white dark:bg-slate-900 px-4 pt-6 pb-2 text-slate-900 dark:text-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all duration-200`}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    aria-invalid={!!errors.message}
                  />
                  <label
                    htmlFor="contact-message"
                    className={`absolute left-4 text-slate-500 dark:text-slate-400 transition-all duration-200 pointer-events-none ${
                      form.message.length > 0
                        ? 'top-2 text-xs font-medium text-violet-600 dark:text-violet-400'
                        : 'top-4 text-sm'
                    } peer-focus:top-2 peer-focus:text-xs peer-focus:font-medium peer-focus:text-violet-600 dark:peer-focus:text-violet-400`}
                  >
                    Message <span className="text-violet-600" aria-hidden="true">*</span>
                  </label>
                  {errors.message && (
                    <p id="message-error" className="mt-1.5 text-xs text-red-500" role="alert">
                      {errors.message}
                    </p>
                  )}
                </div>

                {state === 'error' && (
                  <div
                    className="flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400"
                    role="alert"
                  >
                    <AlertCircle size={16} aria-hidden="true" />
                    {errorMessage || 'Something went wrong. Please try again or email me directly.'}
                  </div>
                )}

                <motion.button
                  ref={submitRef}
                  type="submit"
                  disabled={state === 'loading'}
                  variants={shakeVariants}
                  animate={state === 'error' ? 'error' : 'idle'}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 py-3.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 active:translate-y-0"
                  aria-busy={state === 'loading'}
                >
                  {state === 'loading' ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden="true" />
                      Sending to database…
                    </>
                  ) : (
                    <>
                      <Send size={16} aria-hidden="true" />
                      Send message
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
