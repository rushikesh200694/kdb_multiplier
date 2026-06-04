import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Upload } from 'lucide-react';
import { productAPI, visitAPI } from '../../api/index.js';
import AdminLayout from './AdminLayout';

const EMPTY_FORM = {
  name: '', category: '', shortDescription: '', longDescription: '',
  visitId: '', images: null
};
const CATEGORIES = ['Fertilizers', 'Multilayers', 'Ayurvedic Medicines', 'Soaps', 'Organic Products', 'Crop Nutrients', 'Pest Control', 'Soil Improvement'];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [prices, setPrices] = useState([{ quantity: '', unit: 'kg', price: '' }]);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, vRes] = await Promise.allSettled([productAPI.getAll(), visitAPI.getAll()]);
      if (pRes.status === 'fulfilled') setProducts(pRes.value.data);
      if (vRes.status === 'fulfilled') setVisits(vRes.value.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setForm(EMPTY_FORM); setPrices([{ quantity: '', unit: 'kg', price: '' }]); setEditId(null); setShowForm(true); };
  const openEdit = (p) => {
    setForm({ name: p.name, category: p.category, shortDescription: p.shortDescription, longDescription: p.longDescription, visitId: p.visitId || '', images: null });
    setPrices(p.prices?.length ? p.prices : [{ quantity: '', unit: 'kg', price: '' }]);
    setEditId(p._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('category', form.category);
      fd.append('shortDescription', form.shortDescription);
      fd.append('longDescription', form.longDescription);
      fd.append('prices', JSON.stringify(prices.filter(p => p.quantity && p.price)));
      if (form.visitId) fd.append('visitId', form.visitId);
      if (form.images) Array.from(form.images).forEach(f => fd.append('images', f));

      if (editId) {
        await productAPI.update(editId, fd);
      } else {
        await productAPI.create(fd);
      }
      setShowForm(false);
      await fetchData();
    } catch (err) {
      alert('Error saving product: ' + (err.response?.data?.message || err.message));
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await productAPI.delete(id);
      setDeleteConfirm(null);
      await fetchData();
    } catch (err) {
      alert('Error deleting product');
    }
  };

  const PLACEHOLDER = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&q=80';

  return (
    <AdminLayout>
      <title>Products – KBD Admin</title>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-text-dark">Products</h1>
          <p className="text-text-gray text-sm">{products.length} products total</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Product List */}
      <div className="bg-white rounded-2xl shadow-premium overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {Array(5).fill(0).map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse"></div>)}
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-text-gray">No products yet. Add your first product!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-text-gray font-medium">Product</th>
                  <th className="px-4 py-3 text-left text-xs text-text-gray font-medium hidden md:table-cell">Category</th>
                  <th className="px-4 py-3 text-left text-xs text-text-gray font-medium hidden lg:table-cell">Price (from)</th>
                  <th className="px-4 py-3 text-right text-xs text-text-gray font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0] ? (p.images[0].startsWith('http') ? p.images[0] : `http://localhost:5000${p.images[0]}`) : PLACEHOLDER}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover flex-shrink-0 bg-green-50"
                          onError={(e) => { e.target.src = PLACEHOLDER; }}
                        />
                        <div>
                          <p className="font-medium text-text-dark line-clamp-1">{p.name}</p>
                          <p className="text-text-gray text-xs line-clamp-1">{p.shortDescription}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="badge bg-primary-green/10 text-primary-green text-xs">{p.category}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-primary-green font-semibold">
                      {p.prices?.[0] ? `₹${p.prices[0].price}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openEdit(p)} 
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary-green/10 text-primary-green hover:bg-primary-green hover:text-white text-xs font-semibold transition-all duration-200"
                        >
                          <Pencil className="w-3 h-3" /> Edit
                        </button>
                        <button 
                          onClick={() => setDeleteConfirm(p._id)} 
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white text-xs font-semibold transition-all duration-200"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-bold text-text-dark">{editId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-dark mb-1 block">Product Name *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Product name" className="input-field" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-text-dark mb-1 block">Category *</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field" required>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-text-dark mb-1 block">Short Description *</label>
                <textarea value={form.shortDescription} onChange={e => setForm({ ...form, shortDescription: e.target.value })} placeholder="Brief description (50-100 words)" rows={2} className="input-field resize-none" required />
              </div>
              <div>
                <label className="text-sm font-medium text-text-dark mb-1 block">Long Description *</label>
                <textarea value={form.longDescription} onChange={e => setForm({ ...form, longDescription: e.target.value })} placeholder="Detailed description (100-500 words)" rows={4} className="input-field resize-none" required />
              </div>

              {/* Pricing */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-text-dark">Pricing Options *</label>
                  <button type="button" onClick={() => setPrices([...prices, { quantity: '', unit: 'kg', price: '' }])}
                    className="text-primary-green text-xs hover:underline flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add Price
                  </button>
                </div>
                <div className="space-y-2">
                  {prices.map((p, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input type="number" value={p.quantity} onChange={e => { const np = [...prices]; np[i].quantity = e.target.value; setPrices(np); }}
                        placeholder="Qty" className="input-field w-24" />
                      <select value={p.unit} onChange={e => { const np = [...prices]; np[i].unit = e.target.value; setPrices(np); }} className="input-field w-20">
                        {['kg', 'g', 'piece', 'litre', 'ml', 'packet'].map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                      <span className="text-text-gray text-sm">₹</span>
                      <input type="number" value={p.price} onChange={e => { const np = [...prices]; np[i].price = e.target.value; setPrices(np); }}
                        placeholder="Price" className="input-field w-32" />
                      {prices.length > 1 && (
                        <button type="button" onClick={() => setPrices(prices.filter((_, idx) => idx !== i))}
                          className="text-red-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-text-dark mb-1 block">Associated Visit (Optional)</label>
                  <select value={form.visitId} onChange={e => setForm({ ...form, visitId: e.target.value })} className="input-field">
                    <option value="">None</option>
                    {visits.map(v => <option key={v._id} value={v._id}>{v.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-dark mb-1 block">Product Images</label>
                  <label className="flex items-center gap-2 input-field cursor-pointer">
                    <Upload className="w-4 h-4 text-text-gray" />
                    <span className="text-text-gray text-sm">{form.images ? `${form.images.length} file(s)` : 'Upload images'}</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={e => setForm({ ...form, images: e.target.files })} />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary text-sm">
                  {saving ? 'Saving...' : (editId ? 'Update Product' : 'Add Product')}
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
            <h3 className="font-bold text-text-dark mb-2">Delete Product?</h3>
            <p className="text-text-gray text-sm mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 btn-outline text-sm">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
