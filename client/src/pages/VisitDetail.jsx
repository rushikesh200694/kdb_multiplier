import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowLeft, X } from 'lucide-react';
import { visitAPI } from '../api/index.js';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80';

export default function VisitDetail() {
  const { id } = useParams();
  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    visitAPI.getById(id)
      .then(res => setVisit(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-80 bg-gray-200 rounded-2xl mb-6"></div>
      <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
  );

  if (!visit) return (
    <div className="max-w-5xl mx-auto px-4 py-20 text-center">
      <p className="text-text-gray">Visit not found.</p>
      <Link to="/visits" className="btn-primary mt-4">Back to Visits</Link>
    </div>
  );

  const images = visit.gallery?.length > 0
    ? visit.gallery.map(img => img.startsWith('http') ? img : `http://localhost:5000${img}`)
    : [PLACEHOLDER];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <title>{visit.title} – KBD Multiplier Dhule</title>

      {/* Breadcrumb */}
      <Link to="/visits" className="flex items-center gap-2 text-text-gray text-sm hover:text-primary-green mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Visits
      </Link>

      {/* Hero Image */}
      <div className="rounded-2xl overflow-hidden mb-6" style={{ height: '360px' }}>
        <img
          src={images[0]}
          alt={visit.title}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = PLACEHOLDER; }}
        />
      </div>

      {/* Info */}
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-2">
          <h1 className="text-2xl md:text-3xl font-bold text-text-dark mb-3">{visit.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-text-gray mb-4">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-primary-green" /> {visit.location}</span>
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-primary-green" /> {visit.date}</span>
          </div>
          <p className="text-text-gray leading-relaxed">{visit.description}</p>
        </div>
        <div className="card p-5">
          <h3 className="font-semibold text-text-dark mb-3">Visit Information</h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-text-gray text-xs">Location</p>
              <p className="font-medium text-text-dark">{visit.location}</p>
            </div>
            <div>
              <p className="text-text-gray text-xs">Date</p>
              <p className="font-medium text-text-dark">{visit.date}</p>
            </div>
            <div>
              <p className="text-text-gray text-xs">Gallery Photos</p>
              <p className="font-medium text-text-dark">{images.length} photos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      {images.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-text-dark mb-4">Photo Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setLightbox(i)}
                className="rounded-xl overflow-hidden hover:opacity-90 transition-opacity group"
                style={{ height: '150px' }}
              >
                <img
                  src={img}
                  alt={`Gallery ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { e.target.src = PLACEHOLDER; }}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-white bg-white/20 p-2 rounded-full hover:bg-white/40"
          >
            <X className="w-6 h-6" />
          </button>
          <button
            onClick={() => setLightbox(l => (l - 1 + images.length) % images.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/20 p-2 rounded-full hover:bg-white/40"
          >
            ←
          </button>
          <img
            src={images[lightbox]}
            alt=""
            className="max-w-full max-h-[90vh] object-contain rounded-xl"
          />
          <button
            onClick={() => setLightbox(l => (l + 1) % images.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/20 p-2 rounded-full hover:bg-white/40"
          >
            →
          </button>
          <p className="absolute bottom-4 text-white/60 text-sm">{lightbox + 1} / {images.length}</p>
        </div>
      )}
    </div>
  );
}
