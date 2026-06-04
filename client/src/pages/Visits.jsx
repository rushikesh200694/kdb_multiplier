import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, Image } from 'lucide-react';
import { visitAPI } from '../api/index.js';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80';

export default function Visits() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    visitAPI.getAll()
      .then(res => setVisits(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <title>Farm Visits – KBD Multiplier Dhule</title>
      <meta name="description" content="Explore our farm visits, manufacturing units, and agricultural demonstrations across Maharashtra." />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-1">Our Visits</h1>
        <p className="text-text-gray">Explore our farms, manufacturing units, and agricultural activities</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-2xl"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : visits.length === 0 ? (
        <div className="text-center py-20">
          <Image className="w-12 h-12 text-text-gray mx-auto mb-4" />
          <p className="text-text-gray">No visits available yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {visits.map(visit => (
            <Link key={visit._id} to={`/visits/${visit._id}`} className="card group overflow-hidden block">
              <div className="relative overflow-hidden" style={{ height: '190px' }}>
                <img
                  src={visit.gallery?.[0] ? (visit.gallery[0].startsWith('http') ? visit.gallery[0] : `http://localhost:5000${visit.gallery[0]}`) : PLACEHOLDER}
                  alt={visit.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => { e.target.src = PLACEHOLDER; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                {visit.gallery?.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-lg">
                    +{visit.gallery.length - 1} photos
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-text-dark text-sm line-clamp-1 group-hover:text-primary-green transition-colors">{visit.title}</h3>
                <div className="flex items-center gap-1 text-text-gray text-xs mt-1 mb-2">
                  <MapPin className="w-3 h-3 flex-shrink-0" /> {visit.location}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-text-gray text-xs">
                    <Calendar className="w-3 h-3" /> {visit.date}
                  </div>
                  <span className="text-primary-green text-xs font-medium flex items-center gap-0.5">
                    View <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
