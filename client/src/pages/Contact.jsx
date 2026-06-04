import { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle } from 'lucide-react';

const WAIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Compose WhatsApp message
    const msg = `Hello KBD Multiplier Dhule!%0A%0AName: ${form.name}%0APhone: ${form.phone}%0AMessage: ${form.message}`;
    window.open(`https://wa.me/919561000151?text=${msg}`, '_blank');
    setSent(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <title>Contact Us – KBD Multiplier Dhule</title>
      <meta name="description" content="Get in touch with KBD Multiplier Dhule for agricultural product inquiries, bulk orders, and farm consultations." />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-1">Contact Us</h1>
        <p className="text-text-gray">We're here to help you with all your agricultural needs</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="space-y-5">
          <div className="card p-5">
            <h2 className="font-bold text-text-dark mb-4">Get In Touch</h2>
            <div className="space-y-4">
              {[
                { icon: Phone, label: 'Phone', value: '+91 95610 00151', href: 'tel:+919561000151' },
                { icon: Mail, label: 'Email', value: 'Vkhandelwal71295@gmail.com', href: 'mailto:Vkhandelwal71295@gmail.com' },
                { icon: MapPin, label: 'Address', value: 'KBD Multiplier Godur Road Dhule, Maharashtra 424001', href: null },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-green/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary-green" />
                  </div>
                  <div>
                    <p className="text-text-gray text-xs">{label}</p>
                    {href ? (
                      <a href={href} className="font-medium text-text-dark hover:text-primary-green transition-colors text-sm">{value}</a>
                    ) : (
                      <p className="font-medium text-text-dark text-sm">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <a
            href="https://wa.me/919561000151"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 card p-4 hover:bg-green-50 transition-colors group"
          >
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <WAIcon />
            </div>
            <div>
              <p className="font-semibold text-text-dark group-hover:text-primary-green">Chat on WhatsApp</p>
              <p className="text-text-gray text-sm">Quick responses for all queries</p>
            </div>
          </a>

          <div className="card p-4">
            <h3 className="font-semibold text-text-dark mb-2 text-sm">Business Hours</h3>
            <div className="space-y-1 text-sm text-text-gray">
              <div className="flex justify-between">
                <span>Monday – Saturday</span>
                <span className="text-text-dark font-medium">9 AM – 7 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span className="text-text-dark font-medium">10 AM – 4 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="card p-6">
          {sent ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-primary-green mx-auto mb-3" />
              <h3 className="font-bold text-text-dark mb-1">Message Sent!</h3>
              <p className="text-text-gray text-sm mb-4">We've opened WhatsApp with your message. We'll respond soon!</p>
              <button onClick={() => setSent(false)} className="btn-outline text-sm">Send Another Message</button>
            </div>
          ) : (
            <>
              <h2 className="font-bold text-text-dark mb-4">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-text-dark mb-1 block">Your Name *</label>
                  <input
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Full name"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-dark mb-1 block">Phone Number *</label>
                  <input
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                    type="tel"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-dark mb-1 block">Message *</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your agricultural needs..."
                    rows={5}
                    className="input-field resize-none"
                    required
                  />
                </div>
                <button type="submit" className="w-full btn-primary justify-center">
                  <Send className="w-4 h-4" /> Send via WhatsApp
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
