"use client";

import React, { useState } from "react";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { ProduceSvgDefs } from "@/components/icons/ProduceIcons";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Produce Inquiry",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <ProduceSvgDefs />
      <Header />
      <main className="w py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight mb-3">
              Contact FreshRoute
            </h1>
            <p className="lead mx-auto text-base">
              Have questions about listing produce, procurement partnerships, or logistics? Reach out to our operations team.
            </p>
          </div>

          <div className="bg-[var(--sf)] border border-[var(--line)] rounded-2xl p-8">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-[var(--tint)] text-[var(--acc)] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-xl font-bold mb-2">Message Received</h3>
                <p className="text-[var(--mute)] max-w-sm mx-auto text-sm mb-6">
                  Thank you for contacting FreshRoute. Our regional coordinator will respond to your email shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="btn g"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <label>
                  Your Name
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. Ramesh Patil"
                  />
                </label>

                <label>
                  Email Address
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="ramesh@example.com"
                  />
                </label>

                <label>
                  Subject
                  <select
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                  >
                    <option>Produce Listing Assistance</option>
                    <option>Bulk Buyer Onboarding</option>
                    <option>Logistics & Transport Partner</option>
                    <option>General Support & Inquiries</option>
                  </select>
                </label>

                <label>
                  Message
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Describe your inquiry, crop details, or partnership opportunity..."
                  />
                </label>

                <button type="submit" className="btn w-full mt-4">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

