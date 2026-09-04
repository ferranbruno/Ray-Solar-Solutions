import { useEffect, useState } from 'react';
import { apiRequest, getImageUrl } from '../../data/api';
import { fetchAdminProducts } from '../../data/products';
import { Search, Edit3, Trash2, ChevronLeft, ChevronRight, X, Upload } from 'lucide-react';

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 8;

  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editImage, setEditImage] = useState(null);
  const [editPreview, setEditPreview] = useState('');
  const [saving, setSaving] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchAdminProducts().then(setProducts).catch((requestError) => setError(requestError.message));
  }, []);

  const filtered = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase()) ||
      (product.status || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const openEdit = (product) => {
    setEditing(product);
    setEditForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category,
      description: product.description || '',
      wattage: product.wattage || '',
    });
    setEditImage(null);
    setEditPreview('');
  };

  const handleEditChange = (e) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImage(file);
      setEditPreview(URL.createObjectURL(file));
    }
  };

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', editForm.name);
      fd.append('price', editForm.price);
      fd.append('stock', editForm.stock);
      fd.append('category', editForm.category);
      fd.append('description', editForm.description);
      fd.append('wattage', editForm.wattage);
      if (editImage) fd.append('image', editImage);

      const data = await apiRequest(`/products/${editing.id}`, { method: 'PUT', body: fd });
      setProducts((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...data.product } : p)));
      setEditing(null);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await apiRequest(`/products/${id}`, { method: 'DELETE' });
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setConfirmDelete(null);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const nextStatus = currentStatus === 'Approved';
      await apiRequest(`/admin/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ is_active: nextStatus }),
      });
      setProducts((prev) =>
        prev.map((product) =>
          product.id === id
            ? { ...product, is_active: nextStatus, status: nextStatus ? 'Approved' : 'Flagged' }
            : product
        )
      );
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return '\u2014';
    return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="p-8">
      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center justify-between">
          {error}
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-600"><X size={16} /></button>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#10162b]">Manage Products</h1>
            <p className="text-sm text-[#4a5565] mt-1">{filtered.length} products total</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full sm:w-64 pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#10162b] outline-none focus:border-[#f5a623] focus:ring-2 focus:ring-[#f5a623]/15 transition"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-4 text-xs font-bold text-[#4a5565] uppercase tracking-wider">ID</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-[#4a5565] uppercase tracking-wider">Product</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-[#4a5565] uppercase tracking-wider">Category</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-[#4a5565] uppercase tracking-wider">Date</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-[#4a5565] uppercase tracking-wider">Price</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-[#4a5565] uppercase tracking-wider">Stock</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-[#4a5565] uppercase tracking-wider">Status</th>
              <th className="text-right px-6 py-4 text-xs font-bold text-[#4a5565] uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((product, idx) => (
              <tr
                key={product.id}
                className={`border-b border-gray-50 transition-colors hover:bg-[#f5a623]/[0.03] ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-[#f5a623]/[0.02]'
                }`}
              >
                <td className="px-6 py-4 text-sm font-medium text-[#4a5565]">
                  #{String(product.id).padStart(4, '0')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                      {product.image_path ? (
                        <img src={getImageUrl(product.image_path)} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#f5a623]/10 text-[#f5a623] text-xs font-bold">
                          {product.name?.charAt(0) || '?'}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-[#10162b]">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-[#4a5565]">{product.category}</td>
                <td className="px-6 py-4 text-sm text-[#4a5565]">{formatDate(product.created_at)}</td>
                <td className="px-6 py-4 text-sm font-semibold text-[#10162b]">
                  KSh {product.price.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-[#4a5565]">{product.stock}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                    product.status === 'Approved'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      product.status === 'Approved' ? 'bg-green-500' : 'bg-amber-500'
                    }`} />
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEdit(product)}
                      className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Edit product"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => toggleStatus(product.id, product.status)}
                      className={`p-2 rounded-lg transition-colors ${
                        product.status === 'Approved'
                          ? 'text-amber-600 hover:bg-amber-50'
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                      title={product.status === 'Approved' ? 'Flag' : 'Approve'}
                    >
                      <span className="text-xs font-bold">{product.status === 'Approved' ? 'Flag' : 'Approve'}</span>
                    </button>
                    <button
                      onClick={() => setConfirmDelete(product)}
                      className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete product"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center text-sm text-[#4a5565]">
                  No products found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-xs text-[#4a5565]">
              Showing {((page - 1) * perPage) + 1}\u2013{Math.min(page * perPage, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg text-[#4a5565] hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
                    p === page
                      ? 'bg-[#f5a623] text-white'
                      : 'text-[#4a5565] hover:bg-gray-100'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg text-[#4a5565] hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-[#10162b]">Edit Product</h2>
              <button onClick={() => setEditing(null)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4a5565] uppercase tracking-wider mb-1.5">Product Name</label>
                <input
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#10162b] outline-none focus:border-[#f5a623] focus:ring-2 focus:ring-[#f5a623]/15 transition"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4a5565] uppercase tracking-wider mb-1.5">Price (KSh)</label>
                  <input
                    name="price"
                    type="number"
                    value={editForm.price}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#10162b] outline-none focus:border-[#f5a623] focus:ring-2 focus:ring-[#f5a623]/15 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4a5565] uppercase tracking-wider mb-1.5">Stock</label>
                  <input
                    name="stock"
                    type="number"
                    value={editForm.stock}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#10162b] outline-none focus:border-[#f5a623] focus:ring-2 focus:ring-[#f5a623]/15 transition"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4a5565] uppercase tracking-wider mb-1.5">Category</label>
                  <input
                    name="category"
                    value={editForm.category}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#10162b] outline-none focus:border-[#f5a623] focus:ring-2 focus:ring-[#f5a623]/15 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4a5565] uppercase tracking-wider mb-1.5">Wattage</label>
                  <input
                    name="wattage"
                    value={editForm.wattage}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#10162b] outline-none focus:border-[#f5a623] focus:ring-2 focus:ring-[#f5a623]/15 transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#4a5565] uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#10162b] outline-none focus:border-[#f5a623] focus:ring-2 focus:ring-[#f5a623]/15 transition resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#4a5565] uppercase tracking-wider mb-1.5">Product Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                    {editPreview ? (
                      <img src={editPreview} alt="" className="w-full h-full object-cover" />
                    ) : editing.image_path ? (
                      <img src={getImageUrl(editing.image_path)} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#f5a623]/10 text-[#f5a623] text-lg font-bold">
                        {editing.name?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>
                  <label className="cursor-pointer px-4 py-2 rounded-xl border border-gray-200 text-sm text-[#4a5565] hover:bg-gray-50 transition flex items-center gap-2">
                    <Upload size={14} />
                    Change image
                    <input type="file" accept="image/*" onChange={handleEditImage} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
              <button
                onClick={() => setEditing(null)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-[#4a5565] hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#f5a623] hover:bg-[#d9820b] transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
            <h2 className="text-lg font-bold text-[#10162b] mb-2">Delete Product</h2>
            <p className="text-sm text-[#4a5565] mb-6">
              Are you sure you want to delete <strong>{confirmDelete.name}</strong>? This cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-[#4a5565] hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteProduct(confirmDelete.id)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageProducts;
