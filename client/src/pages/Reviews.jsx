import { useState, useEffect } from 'react';
import { Star, Upload, CheckCircle } from 'lucide-react';
import { reviewAPI } from '../api/index.js';
import Stars from '../components/Stars';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ visitorName: '', rating: 5, reviewText: '' });
  const [photos, setPhotos] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    reviewAPI.getAll()
      .then(res => setReviews(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.visitorName || !form.reviewText || !form.rating) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('visitorName', form.visitorName);
      fd.append('rating', form.rating);
      fd.append('reviewText', form.reviewText);
      photos.forEach(p => fd.append('photos', p));
      await reviewAPI.create(fd);
      setSubmitted(true);
      setForm({ visitorName: '', rating: 5, reviewText: '' });
      setPhotos([]);
    } catch (err) {
      alert('Error submitting review. Please try again.');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <title>Customer Reviews – KBD Multiplier Dhule</title>
      <meta name="description" content="Read what farmers say about KBD Multiplier Dhule products and share your experience." />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-1">Customer Reviews</h1>
        <p className="text-text-gray">Honest feedback from real farmers across Maharashtra</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Reviews Grid */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="grid md:grid-cols-2 gap-4">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="card p-4 animate-pulse">
                  <div className="flex gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="space-y-1 flex-1">
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="card p-10 text-center">
              <Star className="w-10 h-10 text-text-gray mx-auto mb-3" />
              <p className="text-text-gray">No reviews yet. Submit yours below!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {reviews.map(review => (
                <div key={review._id} className="card p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={review.visitorPhoto ? (review.visitorPhoto.startsWith('http') ? review.visitorPhoto : `http://localhost:5000${review.visitorPhoto}`) : PLACEHOLDER}
                      alt={review.visitorName}
                      className="w-11 h-11 rounded-full object-cover bg-gray-100"
                      onError={(e) => { e.target.src = PLACEHOLDER; }}
                    />
                    <div>
                      <p className="font-semibold text-text-dark text-sm">{review.visitorName}</p>
                      <Stars rating={review.rating} size={3} />
                    </div>
                  </div>
                  <p className="text-text-gray text-sm leading-relaxed line-clamp-4">{review.reviewText}</p>
                  {review.photos?.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {review.photos.slice(0, 4).map((photo, i) => (
                        <img key={i}
                          src={photo.startsWith('http') ? photo : `http://localhost:5000${photo}`}
                          alt=""
                          className="w-14 h-14 rounded-lg object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Review Form */}
        <div>
          <div className="card p-5 sticky top-20">
            {submitted ? (
              <div className="text-center py-6">
                <CheckCircle className="w-12 h-12 text-primary-green mx-auto mb-3" />
                <h3 className="font-bold text-text-dark mb-1">Review Submitted!</h3>
                <p className="text-text-gray text-sm">Your review is pending admin approval.</p>
                <button onClick={() => setSubmitted(false)} className="mt-4 text-primary-green text-sm underline">
                  Submit Another
                </button>
              </div>
            ) : (
              <>
                <h2 className="font-bold text-text-dark mb-4">Write a Review</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-text-dark mb-1 block">Your Name *</label>
                    <input
                      value={form.visitorName}
                      onChange={e => setForm({ ...form, visitorName: e.target.value })}
                      placeholder="Your full name"
                      className="input-field"
                      required
                    />
                  </div>

                  {/* Star Rating Selector */}
                  <div>
                    <label className="text-sm font-medium text-text-dark mb-1 block">Rating *</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          key={n}
                          type="button"
                          onMouseEnter={() => setHoverRating(n)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setForm({ ...form, rating: n })}
                          className="transition-transform hover:scale-110"
                        >
                          <Star className={`w-7 h-7 ${
                            n <= (hoverRating || form.rating)
                              ? 'fill-accent-yellow text-accent-yellow'
                              : 'fill-gray-200 text-gray-200'
                          }`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-text-dark mb-1 block">Review *</label>
                    <textarea
                      value={form.reviewText}
                      onChange={e => setForm({ ...form, reviewText: e.target.value })}
                      placeholder="Share your experience with this product..."
                      rows={4}
                      className="input-field resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-text-dark mb-1 block">Upload Photos</label>
                    <label className="flex items-center gap-2 border-2 border-dashed border-border rounded-xl p-3 cursor-pointer hover:border-primary-green transition-colors text-sm text-text-gray">
                      <Upload className="w-4 h-4" />
                      {photos.length > 0 ? `${photos.length} photo(s) selected` : 'Click to upload photos'}
                      <input type="file" multiple accept="image/*" className="hidden" onChange={e => setPhotos(Array.from(e.target.files))} />
                    </label>
                  </div>

                  <button type="submit" disabled={submitting} className="w-full btn-primary justify-center">
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                  <p className="text-xs text-text-gray text-center">Reviews are published after admin approval.</p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
