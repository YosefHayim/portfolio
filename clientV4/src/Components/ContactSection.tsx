import { motion } from 'framer-motion';
import { useState, type FormEvent } from 'react';
import { fadeUp } from '@/animations/variants';
import { brand } from '@/data/content';

export const ContactSection = () => {
  const [status, setStatus] = useState<'idle' | 'ready'>('idle');

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();

    const subject = encodeURIComponent(`JTS project — ${name || 'New inquiry'}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`,
    );

    window.location.href = `mailto:${brand.email}?subject=${subject}&body=${body}`;
    setStatus('ready');
  };

  return (
    <section className="relative px-5 py-24 sm:px-8 sm:py-32" id="contact">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] px-6 py-12 sm:px-12 sm:py-16">
        {/* film crop marks */}
        <span className="absolute top-4 left-4 size-2 border border-white/40" />
        <span className="absolute top-4 right-4 size-2 border border-white/40" />
        <span className="absolute bottom-4 left-4 size-2 border border-white/40" />
        <span className="absolute right-4 bottom-4 size-2 border border-white/40" />

        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial="hidden"
            variants={fadeUp}
            viewport={{ once: true }}
            whileInView="visible"
          >
            <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-zinc-500 uppercase">
              Contact
            </p>
            <h2 className="text-3xl font-medium tracking-tight text-white sm:text-4xl">
              Have a problem to solve?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-500">
              Tell me what is stuck — product, AI flow, payments, internal tool. I will reply
              with a clear next step.
            </p>
            <div className="mt-8 space-y-2 text-sm text-zinc-400">
              <p>
                <a className="transition hover:text-white" href={`mailto:${brand.email}`}>
                  {brand.email}
                </a>
              </p>
              <p className="text-zinc-600">Usually Mon–Fri · async first</p>
            </div>
          </motion.div>

          <motion.form
            className="space-y-8"
            initial="hidden"
            onSubmit={onSubmit}
            variants={fadeUp}
            viewport={{ once: true }}
            whileInView="visible"
          >
            <label className="block">
              <span className="text-[11px] tracking-[0.16em] text-zinc-500 uppercase">Name</span>
              <input
                autoComplete="name"
                className="mt-2 w-full border-0 border-b border-white/20 bg-transparent py-2 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-mint"
                name="name"
                placeholder="Your name"
                type="text"
              />
            </label>
            <label className="block">
              <span className="text-[11px] tracking-[0.16em] text-zinc-500 uppercase">Email</span>
              <input
                autoComplete="email"
                className="mt-2 w-full border-0 border-b border-white/20 bg-transparent py-2 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-mint"
                name="email"
                placeholder="you@company.com"
                required={true}
                type="email"
              />
            </label>
            <label className="block">
              <span className="text-[11px] tracking-[0.16em] text-zinc-500 uppercase">
                Message
              </span>
              <textarea
                className="mt-2 min-h-24 w-full resize-y border-0 border-b border-white/20 bg-transparent py-2 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-mint"
                name="message"
                placeholder="What are you trying to ship?"
                required={true}
              />
            </label>
            <div className="flex items-center gap-4">
              <button
                className="btn-solid px-6 py-2.5 text-sm"
                type="submit"
              >
                Submit
              </button>
              {status === 'ready' ? (
                <p className="text-xs text-zinc-500">Opening your mail client…</p>
              ) : null}
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
};
