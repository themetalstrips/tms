import React, { useState, useEffect } from 'react';
import { DownloadCloud, Package, Settings as SettingsIcon, Layout, FileText, Link as LinkIcon, Edit, Trash2, CheckCircle, XCircle, Loader2, LogOut, MessageSquare, Palette, Globe } from 'lucide-react';
import './Admin.css';

const API = 'http://localhost:4000';

function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('admin_token');
  const headers = { ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  return fetch(url, { ...options, headers });
}

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [authChecking, setAuthChecking] = useState(true);
  const [activeTab, setActiveTab] = useState('import');

  useEffect(() => {
    if (!token) {
      setAuthChecking(false);
      return;
    }
    
    fetchWithAuth(`${API}/api/auth/verify`)
      .then(res => res.json())
      .then(data => {
        if (!data.success) {
          localStorage.removeItem('admin_token');
          setToken(null);
        }
        setAuthChecking(false);
      })
      .catch(() => {
        localStorage.removeItem('admin_token');
        setToken(null);
        setAuthChecking(false);
      });
  }, [token]);

  if (authChecking) {
    return <div className="admin-login-wrapper"><Loader2 className="spin" size={32} color="#c9a227" /></div>;
  }

  if (!token) {
    return <LoginScreen setToken={setToken} />;
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Admin Panel</h2>
          <button onClick={handleLogout} className="admin-icon-btn" title="Logout"><LogOut size={18} /></button>
        </div>
        <nav className="admin-nav">
          <button className={`admin-nav-item ${activeTab === 'import' ? 'active' : ''}`} onClick={() => setActiveTab('import')}>
            <DownloadCloud size={18} /> Kickstarter Import
          </button>
          <button className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
            <Package size={18} /> All Products
          </button>
          <hr style={{ borderColor: '#333', margin: '12px 24px' }} />
          <button className={`admin-nav-item ${activeTab === 'site_settings' ? 'active' : ''}`} onClick={() => setActiveTab('site_settings')}>
            <Palette size={18} /> Site Settings
          </button>
          <button className={`admin-nav-item ${activeTab === 'nav' ? 'active' : ''}`} onClick={() => setActiveTab('nav')}>
            <Globe size={18} /> Navigation
          </button>
          <button className={`admin-nav-item ${activeTab === 'homepage' ? 'active' : ''}`} onClick={() => setActiveTab('homepage')}>
            <Layout size={18} /> Homepage
          </button>
          <button className={`admin-nav-item ${activeTab === 'kintsugi' ? 'active' : ''}`} onClick={() => setActiveTab('kintsugi')}>
            <FileText size={18} /> Kintsugi Knife Page
          </button>
          <button className={`admin-nav-item ${activeTab === 'footer' ? 'active' : ''}`} onClick={() => setActiveTab('footer')}>
            <LinkIcon size={18} /> Footer
          </button>
          <button className={`admin-nav-item ${activeTab === 'announcement' ? 'active' : ''}`} onClick={() => setActiveTab('announcement')}>
            <MessageSquare size={18} /> Announcement Bar
          </button>
          <hr style={{ borderColor: '#333', margin: '12px 24px' }} />
          <button className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <SettingsIcon size={18} /> Settings / DB Status
          </button>
        </nav>
      </aside>

      <main className="admin-main">
        {activeTab === 'import' && <ImportView setActiveTab={setActiveTab} />}
        {activeTab === 'products' && <ProductsView />}
        {activeTab === 'settings' && <SettingsView />}
        {activeTab === 'site_settings' && <SiteSettingsView />}
        {activeTab === 'nav' && <NavView />}
        {activeTab === 'homepage' && <HomepageView />}
        {activeTab === 'footer' && <FooterView />}
        {activeTab === 'announcement' && <AnnouncementView />}
        {activeTab === 'kintsugi' && <KintsugiView />}
      </main>
    </div>
  );
}

function LoginScreen({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('admin_token', data.token);
        setToken(data.token);
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login">
        <h1>Admin Login</h1>
        <form onSubmit={handleLogin}>
          <div className="admin-form-group">
            <label>Username</label>
            <input type="text" className="admin-input" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div className="admin-form-group">
            <label>Password</label>
            <input type="password" className="admin-input" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <div style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</div>}
          <button type="submit" className="admin-btn admin-btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// EXISTING VIEWS (Import, Products, Server Settings)
// ---------------------------------------------------------

function ImportView({ setActiveTab }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleImport = async () => {
    if (!url) return;
    setLoading(true); setError(null); setSuccess(null);
    try {
      const response = await fetch(`${API}/api/scrape`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url })
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error || 'Failed to import');
      setSuccess({ title: data.data.title, imageUrl: data.data.imageUrl, rewardCount: data.data.rewards?.length || 0 });
      setUrl('');
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="admin-view">
      <h1 className="admin-view-title">Import Kickstarter Project</h1>
      <div className="admin-card">
        <p className="admin-card-desc">Enter the full URL of a Kickstarter project to extract its details and reward tiers.</p>
        <div className="admin-input-group">
          <input type="text" className="admin-input" placeholder="https://www.kickstarter.com/projects/..." value={url} onChange={(e) => setUrl(e.target.value)} disabled={loading} />
          <button className="admin-btn admin-btn-primary" onClick={handleImport} disabled={loading || !url}>
            {loading ? <Loader2 className="spin" size={18} /> : <DownloadCloud size={18} />} Scrape & Import
          </button>
        </div>
        {loading && <div className="admin-loading-state"><Loader2 className="spin large" size={32} /><p>Scraping Kickstarter... this may take 15–30 seconds</p></div>}
        {error && <div className="admin-alert admin-alert-error"><XCircle size={20} /><div><strong>Import Failed</strong><p>{error}</p></div></div>}
        {success && (
          <div className="admin-alert admin-alert-success"><CheckCircle size={20} />
            <div className="admin-success-content">
              <strong>Import Successful!</strong>
              <div className="admin-success-details">
                {success.imageUrl && <img src={success.imageUrl} alt="Thumbnail" className="admin-thumbnail-small" />}
                <div><p>{success.title}</p><span className="admin-badge admin-badge-gold">{success.rewardCount} Reward Tiers found</span></div>
              </div>
              <button className="admin-btn admin-btn-outline mt-3" onClick={() => setActiveTab('products')}>View Product &rarr;</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductsView() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/products`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      const res = await fetch(`${API}/api/products/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }) });
      if (!res.ok) throw new Error('Failed to update status');
      fetchProducts();
    } catch (err) { alert(err.message); }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product and all its reward tiers?')) return;
    try {
      const res = await fetch(`${API}/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete product');
      fetchProducts();
    } catch (err) { alert(err.message); }
  };

  if (loading && products.length === 0) return <div className="admin-view"><Loader2 className="spin" size={32} /></div>;
  if (error) return <div className="admin-view"><div className="admin-alert admin-alert-error">{error}</div></div>;

  return (
    <div className="admin-view">
      <h1 className="admin-view-title">All Products</h1>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead><tr><th>Thumbnail</th><th>Title</th><th>Creator</th><th>Reward Tiers</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {products.length === 0 ? <tr><td colSpan="6" className="text-center">No products found. Import one!</td></tr> : (
              products.map(p => (
                <tr key={p.id}>
                  <td>{p.image_url ? <img src={p.image_url} alt={p.title} className="admin-thumbnail" /> : <div className="admin-thumbnail-placeholder">No Image</div>}</td>
                  <td className="admin-td-title">{p.title}</td><td>{p.creator}</td><td>{p.reward_tiers?.length || 0}</td>
                  <td><span className={`admin-status-badge status-${p.status}`}>{p.status}</span></td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-icon-btn" onClick={() => setEditingProduct(p)} title="Edit"><Edit size={16} /></button>
                      <button className="admin-icon-btn" onClick={() => toggleStatus(p.id, p.status)} title={p.status === 'published' ? 'Unpublish' : 'Publish'}>
                        {p.status === 'published' ? <XCircle size={16} /> : <CheckCircle size={16} />}
                      </button>
                      <button className="admin-icon-btn delete-btn" onClick={() => deleteProduct(p.id)} title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {editingProduct && <EditModal product={editingProduct} onClose={() => setEditingProduct(null)} onSave={fetchProducts} />}
    </div>
  );
}

export function EditModal({ product, onClose, onSave }) {
  const [formData, setFormData] = useState({ title: product.title || '', description: product.description || '', image_url: product.image_url || '', status: product.status || 'draft' });
  const [rewards, setRewards] = useState((product.reward_tiers || []).map(r => ({ ...r })));
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/products/${product.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      if (!res.ok) throw new Error('Failed to update product');
      for (const r of rewards) {
        await fetch(`${API}/api/products/${product.id}/rewards/${r.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: r.title, price: r.price, is_active: r.is_active }) });
      }
      if (onSave) onSave();
      onClose();
    } catch (err) { alert(err.message); } finally { setSaving(false); }
  };

  const updateReward = (id, field, value) => { setRewards(rewards.map(r => r.id === id ? { ...r, [field]: value } : r)); };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal">
        <div className="admin-modal-header"><h2>Edit Product</h2><button className="admin-modal-close" onClick={onClose}><XCircle size={24} /></button></div>
        <div className="admin-modal-body">
          <div className="admin-form-group"><label>Title</label><input type="text" className="admin-input" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} /></div>
          <div className="admin-form-group"><label>Description</label><textarea className="admin-input" rows="4" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} /></div>
          <div className="admin-form-group"><label>Image URL</label><input type="text" className="admin-input" value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} />{formData.image_url && <img src={formData.image_url} alt="Preview" className="admin-img-preview" />}</div>
          <div className="admin-form-group">
            <label>Status</label>
            <select className="admin-input" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
              <option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option>
            </select>
          </div>
          <h3 className="admin-rewards-heading">Reward Tiers</h3>
          <div className="admin-rewards-list">
            {rewards.map((r) => (
              <div key={r.id} className="admin-reward-edit-card">
                <div className="admin-reward-edit-row">
                  <div className="admin-form-group flex-1"><label>Tier Title</label><input type="text" className="admin-input" value={r.title} onChange={e => updateReward(r.id, 'title', e.target.value)} /></div>
                  <div className="admin-form-group w-32"><label>Price</label><input type="number" className="admin-input" value={r.price} onChange={e => updateReward(r.id, 'price', e.target.value)} /></div>
                  <div className="admin-form-group w-auto"><label>Active</label><input type="checkbox" className="admin-checkbox" checked={r.is_active} onChange={e => updateReward(r.id, 'is_active', e.target.checked ? 1 : 0)} /></div>
                </div>
              </div>
            ))}
            {rewards.length === 0 && <p>No reward tiers found.</p>}
          </div>
        </div>
        <div className="admin-modal-footer">
          <button className="admin-btn admin-btn-outline" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </div>
    </div>
  );
}

function SettingsView() {
  const [dbStatus, setDbStatus] = useState('checking');
  useEffect(() => {
    fetch(`${API}/api/products`).then(res => setDbStatus(res.ok ? 'connected' : 'error')).catch(() => setDbStatus('error'));
  }, []);
  return (
    <div className="admin-view">
      <h1 className="admin-view-title">Settings</h1>
      <div className="admin-card mb-4">
        <h2 className="admin-card-title">Backend Server</h2>
        <div className="admin-setting-row"><span className="admin-setting-label">API URL:</span><span className="admin-setting-value">{API}</span></div>
        <div className="admin-setting-row"><span className="admin-setting-label">Status:</span><div className="admin-status-indicator"><span className={`admin-dot dot-${dbStatus}`}></span>{dbStatus === 'connected' ? 'Online' : dbStatus === 'error' ? 'Unreachable' : 'Checking...'}</div></div>
      </div>
      <div className="admin-card">
        <h2 className="admin-card-title">Database Connection</h2>
        <div className="admin-setting-row"><span className="admin-setting-label">Host:</span><span className="admin-setting-value">localhost</span></div>
        <div className="admin-setting-row mt-3"><span className="admin-setting-label">Connection Status:</span><div className="admin-status-indicator"><span className={`admin-dot dot-${dbStatus}`}></span>{dbStatus === 'connected' ? 'Connected' : dbStatus === 'error' ? 'Unreachable' : 'Checking...'}</div></div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// NEW CMS VIEWS
// ---------------------------------------------------------

function SaveFlash({ show }) {
  if (!show) return null;
  return <div className="admin-save-flash"><CheckCircle size={16} /> Saved!</div>;
}

function SiteSettingsView() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [savedKey, setSavedKey] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/content/settings`).then(r => r.json()).then(d => { setSettings(d); setLoading(false); });
  }, []);

  const handleSave = async (key) => {
    try {
      await fetchWithAuth(`${API}/api/content/settings`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: settings[key] }) });
      setSavedKey(key); setTimeout(() => setSavedKey(null), 2000);
    } catch (err) { alert(err.message); }
  };

  const handleChange = (key, val) => setSettings(s => ({ ...s, [key]: val }));

  if (loading) return <div className="admin-view"><Loader2 className="spin" size={32} /></div>;

  return (
    <div className="admin-view">
      <h1 className="admin-view-title">Site Settings</h1>
      <div className="admin-card">
        <div className="admin-field-row"><label>Site Name</label><input type="text" className="admin-input" value={settings.site_name || ''} onChange={e => handleChange('site_name', e.target.value)} /><button className="admin-btn admin-btn-primary" onClick={() => handleSave('site_name')}>Save</button><SaveFlash show={savedKey === 'site_name'} /></div>
        <div className="admin-field-row"><label>Logo URL</label><input type="text" className="admin-input" value={settings.logo_url || ''} onChange={e => handleChange('logo_url', e.target.value)} /><button className="admin-btn admin-btn-primary" onClick={() => handleSave('logo_url')}>Save</button><SaveFlash show={savedKey === 'logo_url'} /></div>
        {settings.logo_url && <div style={{ marginLeft: '166px', marginBottom: '16px' }}><img src={settings.logo_url} alt="Logo Preview" style={{ maxHeight: '120px' }} /></div>}
        <div className="admin-field-row"><label>Favicon URL</label><input type="text" className="admin-input" value={settings.favicon_url || ''} onChange={e => handleChange('favicon_url', e.target.value)} /><button className="admin-btn admin-btn-primary" onClick={() => handleSave('favicon_url')}>Save</button><SaveFlash show={savedKey === 'favicon_url'} /></div>
        
        <div className="admin-field-row"><label>Primary Color</label><div className="admin-color-row"><input type="color" value={settings.primary_color || '#000000'} onChange={e => handleChange('primary_color', e.target.value)} /><input type="text" className="admin-input" value={settings.primary_color || ''} onChange={e => handleChange('primary_color', e.target.value)} style={{ width: '100px' }} /></div><button className="admin-btn admin-btn-primary" onClick={() => handleSave('primary_color')}>Save</button><SaveFlash show={savedKey === 'primary_color'} /></div>
        <div className="admin-field-row"><label>Secondary Color</label><div className="admin-color-row"><input type="color" value={settings.secondary_color || '#000000'} onChange={e => handleChange('secondary_color', e.target.value)} /><input type="text" className="admin-input" value={settings.secondary_color || ''} onChange={e => handleChange('secondary_color', e.target.value)} style={{ width: '100px' }} /></div><button className="admin-btn admin-btn-primary" onClick={() => handleSave('secondary_color')}>Save</button><SaveFlash show={savedKey === 'secondary_color'} /></div>
        
        <div className="admin-field-row"><label>Body Font</label><input type="text" className="admin-input" value={settings.body_font || ''} onChange={e => handleChange('body_font', e.target.value)} /><button className="admin-btn admin-btn-primary" onClick={() => handleSave('body_font')}>Save</button><SaveFlash show={savedKey === 'body_font'} /></div>
        <div className="admin-field-row"><label>Heading Font</label><input type="text" className="admin-input" value={settings.heading_font || ''} onChange={e => handleChange('heading_font', e.target.value)} /><button className="admin-btn admin-btn-primary" onClick={() => handleSave('heading_font')}>Save</button><SaveFlash show={savedKey === 'heading_font'} /></div>
      </div>
    </div>
  );
}

function NavView() {
  const [navItems, setNavItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNav = () => fetch(`${API}/api/content/nav`).then(r => r.json()).then(d => { setNavItems(d); setLoading(false); });
  useEffect(() => { fetchNav(); }, []);

  const handleUpdate = async (id, field, value) => {
    const item = navItems.find(n => n.id === id);
    const updated = { ...item, [field]: value };
    setNavItems(navItems.map(n => n.id === id ? updated : n));
    try { await fetchWithAuth(`${API}/api/content/nav/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) }); } catch (err) { alert(err.message); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newItem = { label: fd.get('label'), url: fd.get('url'), display_order: navItems.length + 1 };
    try {
      await fetchWithAuth(`${API}/api/content/nav`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newItem) });
      fetchNav(); e.target.reset();
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete nav item?")) return;
    try { await fetchWithAuth(`${API}/api/content/nav/${id}`, { method: 'DELETE' }); fetchNav(); } catch (err) { alert(err.message); }
  };

  // Drag logic
  let dragItem = React.useRef(null);
  let dragOverItem = React.useRef(null);
  
  const handleSort = async () => {
    let _navItems = [...navItems];
    const draggedItemContent = _navItems.splice(dragItem.current, 1)[0];
    _navItems.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null; dragOverItem.current = null;
    const reordered = _navItems.map((n, i) => ({ ...n, display_order: i + 1 }));
    setNavItems(reordered);
    try { await fetchWithAuth(`${API}/api/content/nav/reorder`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order: reordered }) }); } catch (err) { alert(err.message); }
  };

  if (loading) return <div className="admin-view"><Loader2 className="spin" size={32} /></div>;

  return (
    <div className="admin-view">
      <h1 className="admin-view-title">Navigation</h1>
      <div className="admin-card">
        <div className="admin-dynamic-list">
          {navItems.map((item, index) => (
            <div key={item.id} className="admin-list-item" draggable onDragStart={(e) => (dragItem.current = index)} onDragEnter={(e) => (dragOverItem.current = index)} onDragEnd={handleSort} onDragOver={(e) => e.preventDefault()}>
              <div className="admin-drag-handle">☰</div>
              <div style={{ flexGrow: 1, display: 'flex', gap: '8px' }}>
                <input type="text" className="admin-input" value={item.label} onChange={e => handleUpdate(item.id, 'label', e.target.value)} placeholder="Label" />
                <input type="text" className="admin-input" value={item.url} onChange={e => handleUpdate(item.id, 'url', e.target.value)} placeholder="URL" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                <label style={{ fontSize: '0.8rem', color: '#888' }}>Active: <input type="checkbox" checked={item.is_active} onChange={e => handleUpdate(item.id, 'is_active', e.target.checked)} /></label>
                <label style={{ fontSize: '0.8rem', color: '#888' }}>New Tab: <input type="checkbox" checked={item.opens_new_tab} onChange={e => handleUpdate(item.id, 'opens_new_tab', e.target.checked)} /></label>
              </div>
              <button className="admin-icon-btn delete-btn" onClick={() => handleDelete(item.id)}><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
        <form onSubmit={handleAdd} className="admin-field-row" style={{ marginTop: '24px' }}>
          <input type="text" name="label" className="admin-input" placeholder="New Item Label" required />
          <input type="text" name="url" className="admin-input" placeholder="URL" required />
          <button type="submit" className="admin-btn admin-btn-primary">Add Nav Item</button>
        </form>
      </div>
    </div>
  );
}

function HomepageView() {
  const [data, setData] = useState(null);
  const [saved, setSaved] = useState(null);

  useEffect(() => { fetch(`${API}/api/content/homepage`).then(r => r.json()).then(d => setData(d)); }, []);

  const handleSave = async (sectionKey) => {
    try {
      await fetchWithAuth(`${API}/api/content/homepage/${sectionKey}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data[sectionKey]) });
      setSaved(sectionKey); setTimeout(() => setSaved(null), 2000);
    } catch (err) { alert(err.message); }
  };

  const updateSection = (section, key, val) => setData(d => ({ ...d, [section]: { ...d[section], [key]: val } }));

  if (!data) return <div className="admin-view"><Loader2 className="spin" size={32} /></div>;

  return (
    <div className="admin-view">
      <h1 className="admin-view-title">Homepage Content</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        <div className="admin-card">
          <h2 className="admin-card-title">Hero Section</h2>
          <div className="admin-form-group"><label>Headline</label><input type="text" className="admin-input" value={data.hero?.headline || ''} onChange={e => updateSection('hero', 'headline', e.target.value)} /></div>
          <div className="admin-form-group"><label>Subheadline</label><textarea className="admin-input" value={data.hero?.subheadline || ''} onChange={e => updateSection('hero', 'subheadline', e.target.value)} /></div>
          <div className="admin-form-group"><label>CTA Text</label><input type="text" className="admin-input" value={data.hero?.cta_text || ''} onChange={e => updateSection('hero', 'cta_text', e.target.value)} /></div>
          <div className="admin-form-group"><label>CTA URL</label><input type="text" className="admin-input" value={data.hero?.cta_url || ''} onChange={e => updateSection('hero', 'cta_url', e.target.value)} /></div>
          <div className="admin-form-group"><label>Background Image URL</label><input type="text" className="admin-input" value={data.hero?.bg_image_url || ''} onChange={e => updateSection('hero', 'bg_image_url', e.target.value)} />{data.hero?.bg_image_url && <img src={data.hero?.bg_image_url} alt="Preview" className="admin-img-preview" />}</div>
          <div style={{ display: 'flex', alignItems: 'center' }}><button className="admin-btn admin-btn-primary" onClick={() => handleSave('hero')}>Save Hero</button><SaveFlash show={saved === 'hero'} /></div>
        </div>
        <div className="admin-card">
          <h2 className="admin-card-title">Featured Banner</h2>
          <div className="admin-form-group"><label>Title</label><input type="text" className="admin-input" value={data.featured_banner?.title || ''} onChange={e => updateSection('featured_banner', 'title', e.target.value)} /></div>
          <div className="admin-form-group"><label>Body</label><textarea className="admin-input" rows="5" value={data.featured_banner?.body || ''} onChange={e => updateSection('featured_banner', 'body', e.target.value)} /></div>
          <div className="admin-form-group"><label>CTA Text</label><input type="text" className="admin-input" value={data.featured_banner?.cta_text || ''} onChange={e => updateSection('featured_banner', 'cta_text', e.target.value)} /></div>
          <div className="admin-form-group"><label>CTA URL</label><input type="text" className="admin-input" value={data.featured_banner?.cta_url || ''} onChange={e => updateSection('featured_banner', 'cta_url', e.target.value)} /></div>
          <div className="admin-form-group"><label>Image URL</label><input type="text" className="admin-input" value={data.featured_banner?.image_url || ''} onChange={e => updateSection('featured_banner', 'image_url', e.target.value)} />{data.featured_banner?.image_url && <img src={data.featured_banner?.image_url} alt="Preview" className="admin-img-preview" />}</div>
          <div style={{ display: 'flex', alignItems: 'center' }}><button className="admin-btn admin-btn-primary" onClick={() => handleSave('featured_banner')}>Save Banner</button><SaveFlash show={saved === 'featured_banner'} /></div>
        </div>
      </div>
    </div>
  );
}

function KintsugiView() {
  const [data, setData] = useState(null);
  const [saved, setSaved] = useState(null);
  const [tab, setTab] = useState('hero');

  useEffect(() => { fetch(`${API}/api/content/kintsugi`).then(r => r.json()).then(d => setData(d)); }, []);

  const handleSave = async (sectionKey) => {
    try {
      await fetchWithAuth(`${API}/api/content/kintsugi/${sectionKey}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data[sectionKey]) });
      setSaved(sectionKey); setTimeout(() => setSaved(null), 2000);
    } catch (err) { alert(err.message); }
  };

  const updateSection = (section, key, val) => setData(d => ({ ...d, [section]: { ...d[section], [key]: val } }));

  if (!data) return <div className="admin-view"><Loader2 className="spin" size={32} /></div>;

  return (
    <div className="admin-view">
      <h1 className="admin-view-title">Kintsugi Knife Page</h1>
      <div className="admin-section-tabs">
        <button className={tab === 'hero' ? 'active' : ''} onClick={() => setTab('hero')}>Hero</button>
        <button className={tab === 'story' ? 'active' : ''} onClick={() => setTab('story')}>Story</button>
        <button className={tab === 'specs' ? 'active' : ''} onClick={() => setTab('specs')}>Specs</button>
        <button className={tab === 'faqs' ? 'active' : ''} onClick={() => setTab('faqs')}>FAQs</button>
        <button className={tab === 'rewards' ? 'active' : ''} onClick={() => setTab('rewards')}>Rewards</button>
      </div>

      <div className="admin-card">
        {tab === 'hero' && (
          <div>
            <div className="admin-form-group"><label>Headline</label><input type="text" className="admin-input" value={data.hero?.headline || ''} onChange={e => updateSection('hero', 'headline', e.target.value)} /></div>
            <div className="admin-form-group"><label>Subheadline</label><textarea className="admin-input" value={data.hero?.subheadline || ''} onChange={e => updateSection('hero', 'subheadline', e.target.value)} /></div>
            <div className="admin-form-group"><label>Badge 1</label><input type="text" className="admin-input" value={data.hero?.badge1 || ''} onChange={e => updateSection('hero', 'badge1', e.target.value)} /></div>
            <div className="admin-form-group"><label>Badge 2</label><input type="text" className="admin-input" value={data.hero?.badge2 || ''} onChange={e => updateSection('hero', 'badge2', e.target.value)} /></div>
            <div className="admin-form-group"><label>Badge 3</label><input type="text" className="admin-input" value={data.hero?.badge3 || ''} onChange={e => updateSection('hero', 'badge3', e.target.value)} /></div>
            <div style={{ display: 'flex', alignItems: 'center' }}><button className="admin-btn admin-btn-primary" onClick={() => handleSave('hero')}>Save Hero</button><SaveFlash show={saved === 'hero'} /></div>
          </div>
        )}
        {tab === 'story' && (
          <div>
            <div className="admin-form-group"><label>Heading</label><input type="text" className="admin-input" value={data.story?.heading || ''} onChange={e => updateSection('story', 'heading', e.target.value)} /></div>
            <div className="admin-form-group"><label>Body</label><textarea className="admin-input" rows="8" value={data.story?.body || ''} onChange={e => updateSection('story', 'body', e.target.value)} /></div>
            <div style={{ display: 'flex', alignItems: 'center' }}><button className="admin-btn admin-btn-primary" onClick={() => handleSave('story')}>Save Story</button><SaveFlash show={saved === 'story'} /></div>
          </div>
        )}
        {tab === 'specs' && (
          <div>
            <div className="admin-dynamic-list">
              {(data.specs?.rows || []).map((row, idx) => (
                <div key={idx} className="admin-list-item" style={{ alignItems: 'center' }}>
                  <input type="text" className="admin-input" value={row.label} onChange={e => { const newRows = [...data.specs.rows]; newRows[idx].label = e.target.value; updateSection('specs', 'rows', newRows); }} placeholder="Label" style={{ width: '30%' }} />
                  <input type="text" className="admin-input" value={row.value} onChange={e => { const newRows = [...data.specs.rows]; newRows[idx].value = e.target.value; updateSection('specs', 'rows', newRows); }} placeholder="Value" />
                  <button className="admin-icon-btn delete-btn" onClick={() => { const newRows = data.specs.rows.filter((_, i) => i !== idx); updateSection('specs', 'rows', newRows); }}><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button className="admin-btn admin-btn-outline" onClick={() => updateSection('specs', 'rows', [...(data.specs?.rows || []), { label: '', value: '' }])}>Add Spec Row</button>
              <button className="admin-btn admin-btn-primary" onClick={() => handleSave('specs')}>Save Specs</button><SaveFlash show={saved === 'specs'} />
            </div>
          </div>
        )}
        {tab === 'faqs' && (
          <div>
            <div className="admin-dynamic-list">
              {(data.faqs?.items || []).map((faq, idx) => (
                <div key={idx} className="admin-list-item" style={{ flexDirection: 'column' }}>
                  <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                    <div className="admin-drag-handle">☰</div>
                    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <input type="text" className="admin-input" value={faq.q} onChange={e => { const newItems = [...data.faqs.items]; newItems[idx].q = e.target.value; updateSection('faqs', 'items', newItems); }} placeholder="Question" />
                      <textarea className="admin-input" value={faq.a} onChange={e => { const newItems = [...data.faqs.items]; newItems[idx].a = e.target.value; updateSection('faqs', 'items', newItems); }} placeholder="Answer" rows="2" />
                    </div>
                    <button className="admin-icon-btn delete-btn" onClick={() => { const newItems = data.faqs.items.filter((_, i) => i !== idx); updateSection('faqs', 'items', newItems); }}><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button className="admin-btn admin-btn-outline" onClick={() => updateSection('faqs', 'items', [...(data.faqs?.items || []), { q: '', a: '' }])}>Add FAQ</button>
              <button className="admin-btn admin-btn-primary" onClick={() => handleSave('faqs')}>Save FAQs</button><SaveFlash show={saved === 'faqs'} />
            </div>
          </div>
        )}
        {tab === 'rewards' && (
          <div>
            <p className="admin-card-desc">Rewards are managed from the main Products tab. Changes made there will reflect directly on the Kintsugi page.</p>
            <ProductsView />
          </div>
        )}
      </div>
    </div>
  );
}

function FooterView() {
  const [data, setData] = useState(null);
  const [saved, setSaved] = useState(null);

  useEffect(() => { fetch(`${API}/api/content/footer`).then(r => r.json()).then(d => setData(d)); }, []);

  const handleSave = async (sectionKey) => {
    try {
      await fetchWithAuth(`${API}/api/content/footer/${sectionKey}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data[sectionKey]) });
      setSaved(sectionKey); setTimeout(() => setSaved(null), 2000);
    } catch (err) { alert(err.message); }
  };

  const updateSection = (section, key, val) => setData(d => ({ ...d, [section]: { ...d[section], [key]: val } }));

  if (!data) return <div className="admin-view"><Loader2 className="spin" size={32} /></div>;

  return (
    <div className="admin-view">
      <h1 className="admin-view-title">Footer Content</h1>
      
      <div className="admin-card mb-4">
        <h2 className="admin-card-title">Brand Info</h2>
        <div className="admin-form-group"><label>Tagline</label><input type="text" className="admin-input" value={data.brand?.tagline || ''} onChange={e => updateSection('brand', 'tagline', e.target.value)} /></div>
        <div className="admin-form-group"><label>Copyright</label><input type="text" className="admin-input" value={data.brand?.copyright || ''} onChange={e => updateSection('brand', 'copyright', e.target.value)} /></div>
        <div style={{ display: 'flex', alignItems: 'center' }}><button className="admin-btn admin-btn-primary" onClick={() => handleSave('brand')}>Save Brand</button><SaveFlash show={saved === 'brand'} /></div>
      </div>

      <div className="admin-card mb-4">
        <h2 className="admin-card-title">Social Links</h2>
        <div className="admin-form-group"><label>Instagram URL</label><input type="text" className="admin-input" value={data.social?.instagram || ''} onChange={e => updateSection('social', 'instagram', e.target.value)} /></div>
        <div className="admin-form-group"><label>Twitter URL</label><input type="text" className="admin-input" value={data.social?.twitter || ''} onChange={e => updateSection('social', 'twitter', e.target.value)} /></div>
        <div className="admin-form-group"><label>Facebook URL</label><input type="text" className="admin-input" value={data.social?.facebook || ''} onChange={e => updateSection('social', 'facebook', e.target.value)} /></div>
        <div className="admin-form-group"><label>YouTube URL</label><input type="text" className="admin-input" value={data.social?.youtube || ''} onChange={e => updateSection('social', 'youtube', e.target.value)} /></div>
        <div style={{ display: 'flex', alignItems: 'center' }}><button className="admin-btn admin-btn-primary" onClick={() => handleSave('social')}>Save Social Links</button><SaveFlash show={saved === 'social'} /></div>
      </div>

      <div className="admin-card">
        <h2 className="admin-card-title">Link Columns</h2>
        {(data.links?.columns || []).map((col, colIdx) => (
          <div key={colIdx} style={{ border: '1px dashed #333', padding: '16px', marginBottom: '16px', borderRadius: '6px' }}>
            <div className="admin-form-group" style={{ flexDirection: 'row', alignItems: 'center' }}>
              <label>Column Heading:</label>
              <input type="text" className="admin-input" value={col.heading} onChange={e => { const cols = [...data.links.columns]; cols[colIdx].heading = e.target.value; updateSection('links', 'columns', cols); }} />
              <button className="admin-btn admin-btn-outline" onClick={() => { const cols = data.links.columns.filter((_, i) => i !== colIdx); updateSection('links', 'columns', cols); }}>Remove Column</button>
            </div>
            <div className="admin-dynamic-list">
              {col.links.map((link, linkIdx) => (
                <div key={linkIdx} className="admin-list-item">
                  <input type="text" className="admin-input" value={link.label} onChange={e => { const cols = [...data.links.columns]; cols[colIdx].links[linkIdx].label = e.target.value; updateSection('links', 'columns', cols); }} placeholder="Label" />
                  <input type="text" className="admin-input" value={link.url} onChange={e => { const cols = [...data.links.columns]; cols[colIdx].links[linkIdx].url = e.target.value; updateSection('links', 'columns', cols); }} placeholder="URL" />
                  <button className="admin-icon-btn delete-btn" onClick={() => { const cols = [...data.links.columns]; cols[colIdx].links.splice(linkIdx, 1); updateSection('links', 'columns', cols); }}><Trash2 size={16} /></button>
                </div>
              ))}
              <button className="admin-btn admin-btn-outline" onClick={() => { const cols = [...data.links.columns]; cols[colIdx].links.push({ label: '', url: '' }); updateSection('links', 'columns', cols); }} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>+ Add Link</button>
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button className="admin-btn admin-btn-outline" onClick={() => updateSection('links', 'columns', [...(data.links?.columns || []), { heading: 'New Column', links: [] }])}>Add Column</button>
          <button className="admin-btn admin-btn-primary" onClick={() => handleSave('links')}>Save Columns</button><SaveFlash show={saved === 'links'} />
        </div>
      </div>
    </div>
  );
}

function AnnouncementView() {
  const [data, setData] = useState({ is_active: false, message: '', bg_color: '#c9a227', text_color: '#000000' });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/content/announcement`).then(r => r.json()).then(d => { if (d) setData(d); setLoading(false); });
  }, []);

  const handleSave = async () => {
    try {
      await fetchWithAuth(`${API}/api/content/announcement`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      setSaved(true); setTimeout(() => setSaved(false), 2000);
    } catch (err) { alert(err.message); }
  };

  const handleChange = (field, value) => setData(d => ({ ...d, [field]: value }));

  if (loading) return <div className="admin-view"><Loader2 className="spin" size={32} /></div>;

  return (
    <div className="admin-view">
      <h1 className="admin-view-title">Announcement Bar</h1>
      <div className="admin-card">
        <div className="admin-form-group" style={{ flexDirection: 'row', alignItems: 'center' }}>
          <label style={{ marginRight: '16px' }}>Status</label>
          <label className="admin-toggle">
            <input type="checkbox" checked={data.is_active} onChange={e => handleChange('is_active', e.target.checked)} />
            <span className="admin-toggle-slider"></span>
          </label>
          <span style={{ marginLeft: '12px', color: data.is_active ? '#22c55e' : '#888' }}>{data.is_active ? 'Active' : 'Inactive'}</span>
        </div>

        <div className="admin-form-group">
          <label>Message</label>
          <textarea className="admin-input" rows="2" value={data.message} onChange={e => handleChange('message', e.target.value)} />
        </div>

        <div className="admin-field-row">
          <label>Background Color</label>
          <div className="admin-color-row">
            <input type="color" value={data.bg_color} onChange={e => handleChange('bg_color', e.target.value)} />
            <input type="text" className="admin-input" style={{ width: '100px' }} value={data.bg_color} onChange={e => handleChange('bg_color', e.target.value)} />
          </div>
        </div>

        <div className="admin-field-row">
          <label>Text Color</label>
          <div className="admin-color-row">
            <input type="color" value={data.text_color} onChange={e => handleChange('text_color', e.target.value)} />
            <input type="text" className="admin-input" style={{ width: '100px' }} value={data.text_color} onChange={e => handleChange('text_color', e.target.value)} />
          </div>
        </div>

        <div className="admin-preview-bar" style={{ backgroundColor: data.bg_color, color: data.text_color, textAlign: 'center', fontWeight: '500' }}>
          <p style={{ color: 'inherit', margin: 0 }}>Preview</p>
          {data.message || 'Your message here'}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginTop: '24px' }}>
          <button className="admin-btn admin-btn-primary" onClick={handleSave}>Save Changes</button>
          <SaveFlash show={saved} />
        </div>
      </div>
    </div>
  );
}
