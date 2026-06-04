import { Link } from 'react-router-dom';
import { Leaf, Phone, Mail, MapPin } from 'lucide-react';

// Using inline SVG for brand icons since lucide-react no longer exports Facebook/Instagram
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const Footer = () => (
  <footer className="bg-primary-green text-white" style={{ backgroundColor: '#1B5E20' }}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Company Info */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <Leaf className="w-5 h-5" style={{ color: '#4CAF50' }} />
            </div>
            <div>
              <p className="font-bold text-white">KBD Multiplier</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Dhule, Maharashtra</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Your trusted partner for quality agricultural products — fertilizers, Ayurvedic medicines, organic solutions, and more.
          </p>
          <div className="flex gap-3">
            <a href="https://www.facebook.com/share/1BKdfJ2RJP/" target="_blank" rel="noreferrer"
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1877F2'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            >
              <FacebookIcon />
            </a>
            <a href="https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=fbzl5t2" target="_blank" rel="noreferrer"
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#E1306C'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            >
              <InstagramIcon />
            </a>
            <a href="https://www.whatsapp.com/business/" target="_blank" rel="noreferrer"
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#25D366'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            >
              <WhatsAppIcon />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-white mb-4 text-base">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {[
              { to: '/', label: 'Home' },
              { to: '/products', label: 'Products' },
              { to: '/visits', label: 'Farm Visits' },
              { to: '/reviews', label: 'Reviews' },
              { to: '/contact', label: 'Contact Us' },
              { to: '/cart', label: 'My Cart' },
            ].map(link => (
              <li key={link.to}>
                <Link to={link.to} className="transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold text-white mb-4 text-base">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3" style={{ color: 'rgba(255,255,255,0.7)' }}>
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#4CAF50' }} />
              <span>KBD Multiplier Godur Road Dhule, Maharashtra 424001</span>
            </li>
            <li className="flex items-center gap-3" style={{ color: 'rgba(255,255,255,0.7)' }}>
              <Phone className="w-4 h-4 flex-shrink-0" style={{ color: '#4CAF50' }} />
              <a href="tel:+919561000151" className="hover:text-white transition-colors">+91 95610 00151</a>
            </li>
            <li className="flex items-center gap-3" style={{ color: 'rgba(255,255,255,0.7)' }}>
              <Mail className="w-4 h-4 flex-shrink-0" style={{ color: '#4CAF50' }} />
              <a href="mailto:Vkhandelwal71295@gmail.com" className="hover:text-white transition-colors break-all">
                Vkhandelwal71295@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs" style={{ borderTop: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.5)' }}>
        <p>© {new Date().getFullYear()} KBD Multiplier Dhule. All rights reserved.</p>
        <p>Built with ❤️ for Indian Farmers</p>
      </div>
    </div>
  </footer>
);

export default Footer;
