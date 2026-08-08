'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';

export default function ExpoPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', interest: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.submitExpoLead(form);
      setSubmitted(true);
    } catch (err) {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-600 mb-2">Thank you!</h1>
          <p className="text-muted-foreground">We’ll be in touch soon.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Join Our Waitlist</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name *"
            required
            className="w-full px-4 py-2 border rounded-md"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email *"
            required
            className="w-full px-4 py-2 border rounded-md"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="tel"
            placeholder="Phone (optional)"
            className="w-full px-4 py-2 border rounded-md"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <select
            required
            className="w-full px-4 py-2 border rounded-md"
            value={form.interest}
            onChange={(e) => setForm({ ...form, interest: e.target.value })}
          >
            <option value="">I’m interested in…</option>
            <option value="Products">Products</option>
            <option value="Bulk Order">Bulk Order</option>
            <option value="Partnership">Partnership</option>
            <option value="Other">Other</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-2 rounded-md font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Submitting…' : 'Submit'}
          </button>
        </form>
      </div>
    </main>
  );
}
