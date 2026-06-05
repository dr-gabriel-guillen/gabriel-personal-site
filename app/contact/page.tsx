"use client";
import { useState } from "react";
import type { Metadata } from "next";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="pt-20">
      <section className="border-b border-border bg-navy-mid px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Get in Touch</p>
          <h1 className="mt-5 font-display text-6xl font-bold text-cream lg:text-7xl">Contact</h1>
          <p className="mt-5 max-w-2xl text-lg leading-9 text-cream-dim">
            Whether you are interested in collaboration, speaking engagements, consulting, legal inquiries,
            or the Guinness World Record initiative — reach out below.
          </p>
        </div>
      </section>

      <section className="px-5 py-14 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.2fr]">
          {/* Info */}
          <div className="space-y-6">
            {[
              { icon: "✉️", label: "Email", value: "gguillen@alumni.harvard.edu", href: "mailto:gguillen@alumni.harvard.edu" },
              { icon: "📞", label: "Phone", value: "+1 (470) 685-8701", href: "tel:+14706858701" },
              { icon: "💼", label: "LinkedIn", value: "linkedin.com/in/gabriel-guillen", href: "https://www.linkedin.com/in/gabriel-guillen/" },
              { icon: "⚖️", label: "California State Bar", value: "License #361094", href: "https://apps.calbar.ca.gov/attorney/Licensee/Detail/361094" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex items-start gap-4 rounded-lg border border-border bg-navy-card p-5 transition hover:border-gold/40"
              >
                <span className="mt-0.5 text-2xl">{item.icon}</span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">{item.label}</p>
                  <p className="mt-1 text-base text-cream">{item.value}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Form */}
          {sent ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-gold/30 bg-gold/5 p-12 text-center">
              <span className="text-5xl">✅</span>
              <h2 className="mt-6 font-display text-3xl font-bold text-cream">Message sent!</h2>
              <p className="mt-3 text-base text-cream-dim">Thank you for reaching out. I will be in touch soon.</p>
            </div>
          ) : (
            <form
              className="space-y-5 rounded-lg border border-border bg-navy-card p-8"
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="First name" name="first" required />
                <Field label="Last name" name="last" required />
              </div>
              <Field label="Email" name="email" type="email" required />
              <Field label="Organization / Institution" name="org" />
              <div className="grid gap-2">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-cream-dim">Subject</label>
                <select
                  name="subject"
                  className="rounded border border-border bg-navy px-4 py-3 text-sm text-cream focus:border-gold focus:outline-none"
                >
                  <option>Guinness World Record Inquiry</option>
                  <option>Legal Consultation</option>
                  <option>Speaking / Media</option>
                  <option>Academic Collaboration</option>
                  <option>Technology / Engineering</option>
                  <option>General Inquiry</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-xs font-bold uppercase tracking-[0.2em] text-cream-dim">Message</label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  className="resize-none rounded border border-border bg-navy px-4 py-3 text-sm text-cream placeholder-cream-dim/40 focus:border-gold focus:outline-none"
                  placeholder="Describe your inquiry..."
                />
              </div>
              <p className="text-xs leading-5 text-cream-dim">
                This form does not create an attorney-client relationship. Do not include confidential
                information until representation is confirmed.
              </p>
              <button
                type="submit"
                className="w-full bg-gold px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-navy transition hover:bg-gold-light"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <label className="text-xs font-bold uppercase tracking-[0.2em] text-cream-dim">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="rounded border border-border bg-navy px-4 py-3 text-sm text-cream placeholder-cream-dim/40 focus:border-gold focus:outline-none"
      />
    </div>
  );
}
