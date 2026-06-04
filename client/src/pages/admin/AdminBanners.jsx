import { useState, useEffect } from 'react';
import { Plus, Trash2, Image, ArrowUp, ArrowDown } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { bannerAPI } from '../../api/index.js';

const EMPTY_FORM = {
  title: '',
  description: '',
  imageFile: null,
};

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const loadBanners = async () => {
    try {
      setLoading(true);
      const res = await bannerAPI.getAll();
      const data = res.data.map(b => ({ ...b, id: b._id }));
      setBanners(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load banners', err);
      setError('Unable to fetch banners. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description || '');
      if (form.imageFile) {
        formData.append('image', form.imageFile);
      }

      if (editId) {
        await bannerAPI.update(editId, formData);
      } else {
        formData.append('order', banners.length);
        await bannerAPI.create(formData);
      }
      await loadBanners();
      setError(null);
      setShowForm(false);
      setForm(EMPTY_FORM);
      setEditId(null);
      setImagePreview(null);
    } catch (err) {
      console.error('Banner save error', err);
      setError('Failed to save banner. Check the image and try again.');
    }
  };

  const openEdit = (b) => {
    setForm({
      title: b.title,
      description: b.description || '',
      imageFile: null,
    });
    setImagePreview(b.image || null);
    setEditId(b.id);
    setShowForm(true);
  };

  const toggleActive = async (id) => {
    try {
      const banner = banners.find(b => b.id === id);
      if (!banner) return;
      await bannerAPI.update(id, { isActive: !banner.isActive });
      await loadBanners();
      setError(null);
    } catch (err) {
      console.error('Toggle active error', err);
      setError('Failed to toggle active banner.');
    }
  };

  const deleteBanner = async (id) => {
    try {
      await bannerAPI.delete(id);
      await loadBanners();
      setError(null);
    } catch (err) {
      console.error('Delete banner error', err);
      setError('Failed to delete banner.');
    }
  };

  const moveUp = async (index) => {
    if (index === 0) return;
    const arr = [...banners];
    [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
    try {
      await Promise.all([
        bannerAPI.update(arr[index].id, { order: index }),
        bannerAPI.update(arr[index - 1].id, { order: index - 1 })
      ]);
      await loadBanners();
      setError(null);
    } catch (err) {
      console.error('Reorder error', err);
      setError('Failed to reorder banners.');
    }
  };

  const moveDown = async (index) => {
    if (index === banners.length - 1) return;
    const arr = [...banners];
    [arr[index + 1], arr[index]] = [arr[index], arr[index + 1]];
    try {
      await Promise.all([
        bannerAPI.update(arr[index].id, { order: index }),
        bannerAPI.update(arr[index + 1].id, { order: index + 1 })
      ]);
      await loadBanners();
      setError(null);
    } catch (err) {
      console.error('Reorder error', err);
      setError('Failed to reorder banners.');
    }
  };

  return (
    <AdminLayout>
      <title>Banners – KBD Admin</title>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-text-dark">Hero Banners</h1>
          <p className="text-text-gray text-sm">{banners.filter(b => b.isActive).length} active banners</p>
        </div>
        <button onClick={() => { setForm(EMPTY_FORM); setImagePreview(null); setEditId(null); setShowForm(true); }} className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> Add Banner
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-5 text-sm text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-5 text-sm text-blue-700">
        <strong>📢 Note:</strong> Banner changes here update the homepage hero slider. Use the arrow buttons to reorder. Inactive banners are hidden from customers.
      </div>

      {/* Banners List */}
      <div className="space-y-3">
        {banners.map((banner, index) => (
          <div key={banner.id} className={`bg-white rounded-2xl shadow-premium overflow-hidden transition-opacity ${!banner.isActive ? 'opacity-60' : ''}`}>
            <div className="flex items-center gap-4 p-4">
              {/* Preview */}
              <div className="w-16 h-12 rounded-xl bg-gradient-to-r from-green-800 to-emerald-700 flex items-center justify-center text-lg font-semibold text-white flex-shrink-0">
                Banner
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-text-dark text-sm line-clamp-1">{banner.title}</p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Order arrows */}
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => moveUp(index)} disabled={index === 0}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors"
                  >
                    <ArrowUp className="w-3.5 h-3.5 text-text-gray" />
                  </button>
                  <button onClick={() => moveDown(index)} disabled={index === banners.length - 1}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors"
                  >
                    <ArrowDown className="w-3.5 h-3.5 text-text-gray" />
                  </button>
                </div>

                {/* Order badge */}
                <span className="text-xs text-text-gray bg-gray-100 px-2 py-1 rounded-lg font-mono">#{index + 1}</span>

                {/* Active toggle */}
                <button
                  onClick={() => toggleActive(banner.id)}
                  className={`text-xs px-3 py-1 rounded-xl font-medium transition-all ${
                    banner.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-text-gray'
                  }`}
                >
                  {banner.isActive ? 'Active' : 'Hidden'}
                </button>

                {/* Edit */}
                <button onClick={() => openEdit(banner)}
                  className="p-1.5 rounded-lg hover:bg-primary-green/10 text-text-gray hover:text-primary-green transition-colors"
                >
                  <Image className="w-3.5 h-3.5" />
                </button>

                {/* Delete */}
                <button onClick={() => deleteBanner(banner.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-text-gray hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-premium">
          <p className="text-text-gray">Loading banners...</p>
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-premium">
          <Image className="w-10 h-10 text-text-gray mx-auto mb-3" />
          <p className="text-text-gray">No banners yet. Add your first banner!</p>
        </div>
      ) : null}

      {/* Banner Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-bold text-text-dark">{editId ? 'Edit Banner' : 'Add New Banner'}</h2>
              <button onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setEditId(null); setImagePreview(null); }} className="p-1.5 rounded-lg hover:bg-gray-100 text-text-gray">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Preview */}
              <div className="w-full h-24 rounded-xl bg-gradient-to-r from-green-800 to-emerald-700 flex items-center justify-center gap-3">
                <div className="text-white">
                  <p className="font-bold text-lg leading-tight">{form.title || 'Banner Title'}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-text-dark mb-1 block">Title *</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Banner title" className="input-field" required />
              </div>

              <div>
                <label className="text-sm font-medium text-text-dark mb-1 block">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Detailed banner description" rows={3} className="input-field resize-none" />
              </div>

              <div>
                <label className="text-sm font-medium text-text-dark mb-1 block">Banner Image</label>
                <label className="flex items-center gap-3 input-field cursor-pointer">
                  <Image className="w-4 h-4 text-text-gray" />
                  <span className="text-text-gray text-sm">{form.imageFile ? `${form.imageFile.name}` : 'Choose an image file'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={e => {
                    const file = e.target.files?.[0] || null;
                    setForm({ ...form, imageFile: file });
                    setImagePreview(file ? URL.createObjectURL(file) : imagePreview);
                  }} />
                </label>
                {imagePreview && (
                  <img src={imagePreview} alt={form.title || 'Banner preview'} className="mt-3 w-full h-40 object-cover rounded-2xl" />
                )}
              </div>


              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setEditId(null); setImagePreview(null); }} className="btn-outline text-sm">Cancel</button>
                <button type="submit" className="btn-primary text-sm">
                  {editId ? 'Update Banner' : 'Add Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
