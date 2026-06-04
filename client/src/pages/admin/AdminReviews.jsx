import { useState, useEffect } from 'react';
import { Check, Trash2, Star, Clock, CheckCircle } from 'lucide-react';
import { reviewAPI } from '../../api/index.js';
import AdminLayout from './AdminLayout';
import Stars from '../../components/Stars';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await reviewAPI.getAll(true);
      setReviews(res.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (id) => {
    try {
      await reviewAPI.approve(id);
      setReviews(prev => prev.map(r => r._id === id ? { ...r, isApproved: true } : r));
    } catch { alert('Error approving review'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await reviewAPI.delete(id);
      setReviews(prev => prev.filter(r => r._id !== id));
    } catch { alert('Error deleting review'); }
  };

  const filtered = filter === 'all' ? reviews
    : filter === 'pending' ? reviews.filter(r => !r.isApproved)
    : reviews.filter(r => r.isApproved);

  return (
    <AdminLayout>
      <title>Reviews – KBD Admin</title>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-text-dark">Reviews</h1>
          <p className="text-text-gray text-sm">{reviews.length} total, {reviews.filter(r => !r.isApproved).length} pending</p>
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'approved'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${
                filter === f ? 'bg-primary-green text-white' : 'bg-white border border-border text-text-gray hover:border-primary-green'
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 animate-pulse shadow-premium flex gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-premium">
          <Star className="w-10 h-10 text-text-gray mx-auto mb-3" />
          <p className="text-text-gray">No {filter === 'all' ? '' : filter} reviews.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(review => (
            <div key={review._id} className="bg-white rounded-2xl p-4 shadow-premium flex gap-4">
              <img
                src={review.visitorPhoto ? (review.visitorPhoto.startsWith('http') ? review.visitorPhoto : `http://localhost:5000${review.visitorPhoto}`) : PLACEHOLDER}
                alt={review.visitorName}
                className="w-11 h-11 rounded-full object-cover flex-shrink-0 bg-gray-100"
                onError={(e) => { e.target.src = PLACEHOLDER; }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-text-dark text-sm">{review.visitorName}</p>
                    <Stars rating={review.rating} size={3} />
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {review.isApproved ? (
                      <span className="badge bg-green-100 text-green-700 text-xs flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Approved
                      </span>
                    ) : (
                      <span className="badge bg-amber-100 text-amber-700 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Pending
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-text-gray text-sm mt-1 line-clamp-2">{review.reviewText}</p>
                {review.photos?.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {review.photos.slice(0, 4).map((photo, i) => (
                      <img key={i} src={photo.startsWith('http') ? photo : `http://localhost:5000${photo}`} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    ))}
                  </div>
                )}
                <div className="flex gap-2 mt-3">
                  {!review.isApproved && (
                    <button onClick={() => handleApprove(review._id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-primary-green/10 text-primary-green hover:bg-primary-green hover:text-white rounded-lg text-xs font-medium transition-all">
                      <Check className="w-3 h-3" /> Approve
                    </button>
                  )}
                  <button onClick={() => handleDelete(review._id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg text-xs font-medium transition-all">
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
