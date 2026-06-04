import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Upload, Image, Images } from 'lucide-react';
import { visitAPI } from '../../api/index.js';
import AdminLayout from './AdminLayout';

const EMPTY_FORM = { title: '', description: '', location: '', date: '', gallery: null };
const PLACEHOLDER = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=200&q=80';

export default function AdminVisits() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [manageGalleryVisit, setManageGalleryVisit] = useState(null);
  const [galleryUploading, setGalleryUploading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await visitAPI.getAll();
      setVisits(res.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true); };
  const openEdit = (v) => {
    setForm({ title: v.title, description: v.description, location: v.location, date: v.date, gallery: null });
    setEditId(v._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('location', form.location);
      fd.append('date', form.date);
      if (form.gallery) Array.from(form.gallery).forEach(f => fd.append('gallery', f));

      if (editId) {
        await visitAPI.update(editId, fd);
      } else {
        await visitAPI.create(fd);
      }
      setShowForm(false);
      await fetchData();
    } catch (err) {
      alert('Error saving visit: ' + (err.response?.data?.message || err.message));
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await visitAPI.delete(id);
      setDeleteConfirm(null);
      await fetchData();
    } catch { alert('Error deleting visit'); }
  };

  const handleAddGallery = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    setGalleryUploading(true);
    try {
      const fd = new FormData();
      Array.from(files).forEach(f => fd.append('gallery', f));
      const res = await visitAPI.addGallery(manageGalleryVisit._id, fd);
      setManageGalleryVisit(res.data);
      await fetchData();
    } catch (err) {
      alert('Error adding images: ' + (err.response?.data?.message || err.message));
    } finally { setGalleryUploading(false); }
  };

  const handleRemoveGalleryImage = async (imgId, index) => {
    if (!confirm('Remove this image?')) return;
    try {
      const res = await visitAPI.removeGallery(manageGalleryVisit._id, index);
      setManageGalleryVisit(res.data);
      await fetchData();
    } catch (err) {
      alert('Error removing image');
    }
  };

  return (
    <AdminLayout>
      <title>Visits – KBD Admin</title>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-text-dark">Farm Visits</h1>
          <p className="text-text-gray text-sm">{visits.length} visits total</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> Add Visit
        </button>
      </div>

      {/* Visits Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse shadow-premium">
              <div className="h-40 bg-gray-200"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : visits.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-premium">
          <Image className="w-10 h-10 text-text-gray mx-auto mb-3" />
          <p className="text-text-gray">No visits yet. Add your first visit!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visits.map(v => (
            <div key={v._id} className="bg-white rounded-2xl overflow-hidden shadow-premium">
              <div className="relative" style={{ height: '160px' }}>
                <img
                  src={v.gallery?.[0] ? (v.gallery[0].startsWith('http') ? v.gallery[0] : `http://localhost:5000${v.gallery[0]}`) : PLACEHOLDER}
                  alt={v.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = PLACEHOLDER; }}
                />
                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-lg">
                  {v.gallery?.length || 0} photos
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-text-dark text-sm mb-1 line-clamp-1">{v.title}</h3>
                <p className="text-text-gray text-xs mb-1">{v.location}</p>
                <p className="text-text-gray text-xs mb-3">{v.date}</p>
                <div className="flex gap-2">
                  <button onClick={() => setManageGalleryVisit(v)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-border text-xs text-text-gray hover:border-blue-300 hover:text-blue-500 transition-colors" title="Manage Gallery">
                    <Images className="w-3 h-3" /> Gallery
                  </button>
                  <button onClick={() => openEdit(v)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-border text-xs text-text-gray hover:border-primary-green hover:text-primary-green transition-colors" title="Edit">
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => setDeleteConfirm(v._id)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-border text-xs text-text-gray hover:border-red-300 hover:text-red-500 transition-colors" title="Delete">
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Visit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-bold text-text-dark">{editId ? 'Edit Visit' : 'Add New Visit'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-text-dark mb-1 block">Visit Title *</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Organic Farm Visit - Nasik" className="input-field" required />
              </div>
              <div>
                <label className="text-sm font-medium text-text-dark mb-1 block">Location *</label>
                <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Nasik, Maharashtra" className="input-field" required />
              </div>
              <div>
                <label className="text-sm font-medium text-text-dark mb-1 block">Date *</label>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="text-sm font-medium text-text-dark mb-1 block">Description *</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the visit..." rows={4} className="input-field resize-none" required />
              </div>
              <div>
                <label className="text-sm font-medium text-text-dark mb-1 block">Gallery Images</label>
                <label className="flex items-center gap-2 input-field cursor-pointer">
                  <Upload className="w-4 h-4 text-text-gray" />
                  <span className="text-text-gray text-sm">{form.gallery ? `${form.gallery.length} file(s) selected` : 'Upload gallery images'}</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={e => setForm({ ...form, gallery: e.target.files })} />
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary text-sm">
                  {saving ? 'Saving...' : (editId ? 'Update Visit' : 'Add Visit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-bold text-text-dark mb-2">Delete Visit?</h3>
            <p className="text-text-gray text-sm mb-5">This will permanently delete this visit and its gallery.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 btn-outline text-sm">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Gallery Modal */}
      {manageGalleryVisit && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h2 className="font-bold text-text-dark">Manage Gallery</h2>
                <p className="text-text-gray text-sm">{manageGalleryVisit.title}</p>
              </div>
              <button onClick={() => setManageGalleryVisit(null)} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6">
              {manageGalleryVisit.gallery?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {manageGalleryVisit.gallery.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden group shadow-premium">
                      <img
                        src={img.startsWith('http') ? img : `http://localhost:5000${img}`}
                        alt={`Gallery ${index}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          onClick={() => handleRemoveGalleryImage(img, index)}
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                          title="Remove Image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-text-gray text-sm text-center mb-6">No images in gallery yet.</p>
              )}
              
              <div className="border-t border-border pt-6">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary-green hover:bg-green-50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-6 h-6 text-text-gray mb-2" />
                    <p className="text-sm text-text-gray">
                      {galleryUploading ? 'Uploading...' : 'Click to upload more images'}
                    </p>
                  </div>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleAddGallery} disabled={galleryUploading} />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
