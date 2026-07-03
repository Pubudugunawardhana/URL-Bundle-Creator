'use client';
import { useState } from 'react';
import { GripVertical, Trash2, Link as LinkIcon, Plus, Loader2, ArrowLeft, Edit3 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function BundleEditor({ onSave, onCancel }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [expiresIn, setExpiresIn] = useState('none');
  const [links, setLinks] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddNewLink = () => {
    setLinks(prev => [...prev, {
      id: Date.now().toString(),
      url: '',
      title: '',
      description: '',
      favicon: '',
      note: '',
      isEditing: true
    }]);
  };

  const handleUrlBlur = async (id, url) => {
    if (!url.trim()) return;
    
    // Basic validation
    let validUrl = url;
    if (!/^https?:\/\//i.test(validUrl)) {
      validUrl = 'https://' + validUrl;
    }

    const link = links.find(l => l.id === id);
    // Only fetch if title is empty or if we want to overwrite
    if (link && link.title && link.url === validUrl) return;

    setIsFetching(true);
    try {
      const res = await fetch(`/api/metadata?url=${encodeURIComponent(validUrl)}`);
      const data = await res.json();
      
      if (res.ok) {
        setLinks(prev => prev.map(l => l.id === id ? {
          ...l,
          url: validUrl,
          title: l.title || data.title || validUrl,
          description: l.description || data.description || '',
          favicon: data.favicon || '',
          isEditing: false
        } : l));
      } else {
        updateLink(id, 'url', validUrl);
      }
    } catch (e) {
      console.error(e);
      updateLink(id, 'url', validUrl);
    } finally {
      setIsFetching(false);
    }
  };

  const removeLink = (id) => {
    setLinks(links.filter(l => l.id !== id));
  };

  const updateLink = (id, field, value) => {
    setLinks(links.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(links);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setLinks(items);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Please enter a Bundle Name.");
      return;
    }
    if (links.length === 0) {
      alert("Please add at least one link.");
      return;
    }
    const validLinks = links.filter(l => l.url && l.url.trim() !== '').map(({ isEditing, ...rest }) => rest);
    if (validLinks.length === 0) {
      alert("Please make sure your links have valid URLs.");
      return;
    }
    if (password && password !== confirmPassword) {
      alert("Passwords do not match. Please check your password and try again.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/bundles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, password, expiresIn, links: validLinks })
      });
      const data = await res.json();
      if (res.ok) {
        onSave(data);
      } else {
        alert(data.error || 'Failed to save bundle.');
      }
    } catch (e) {
      alert('Error saving bundle. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="glass animate-fade-in" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '700px', margin: '0 auto', textAlign: 'left' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1.5rem' }}>
        {onCancel && (
          <button 
            className="btn btn-icon" 
            onClick={onCancel}
            title="Go back"
            style={{ padding: '0.5rem', background: 'var(--hover-bg)' }}
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>URL Bundle Creator</h2>
      </div>

      {/* Bundle Meta info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Bundle Name <span style={{ color: 'var(--danger-color)' }}>*</span></label>
          <input 
            type="text" 
            placeholder="e.g. Frontend Resources" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ fontSize: '1.2rem', padding: '1rem', background: 'var(--input-bg-dark)', borderColor: name.trim() ? 'var(--card-border)' : 'rgba(239, 68, 68, 0.5)' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Description</label>
          <textarea 
            placeholder="What are these links for?" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ padding: '1rem', background: 'var(--input-bg-dark)', resize: 'vertical' }}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Password (Optional)</label>
            <input 
              type="password" 
              placeholder="Protect this bundle" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ fontSize: '1rem', padding: '1rem', background: 'var(--input-bg-dark)', borderColor: 'var(--card-border)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Self-Destruct (Optional)</label>
            <select
              value={expiresIn}
              onChange={(e) => setExpiresIn(e.target.value)}
              style={{ fontSize: '1rem', padding: '1rem', background: 'var(--input-bg-dark)', borderColor: 'var(--card-border)', color: 'var(--text-primary)', width: '100%', borderRadius: '8px', cursor: 'pointer' }}
            >
              <option value="none">Never</option>
              <option value="1h">1 Hour</option>
              <option value="24h">24 Hours</option>
              <option value="7d">7 Days</option>
            </select>
          </div>
        </div>
        
        {password && (
          <div className="animate-fade-in" style={{ marginTop: '-0.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Confirm Password <span style={{ color: 'var(--danger-color)' }}>*</span></label>
            <input 
              type="password" 
              placeholder="Type your password again" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ fontSize: '1rem', padding: '1rem', background: 'var(--input-bg-dark)', borderColor: confirmPassword === password ? 'var(--card-border)' : 'rgba(239, 68, 68, 0.5)' }}
            />
          </div>
        )}
      </div>

      <div style={{ marginTop: '1rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: 600 }}>Links</h3>
        <hr style={{ border: 'none', borderTop: '1px solid var(--card-border)', marginBottom: '1.5rem' }} />
        
        {/* Top Add Link Button */}
        <button 
          className="btn btn-outline" 
          onClick={handleAddNewLink}
          style={{ width: '100%', padding: '1rem', borderStyle: 'dashed', marginBottom: '1.5rem' }}
        >
          <Plus size={20}/> Add Link
        </button>

        {/* Draggable Link List */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="links">
            {(provided) => (
              <div 
                {...provided.droppableProps} 
                ref={provided.innerRef}
                style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
              >
                {links.map((link, index) => (
                  <Draggable key={link.id} draggableId={link.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="glass"
                        style={{ 
                          ...provided.draggableProps.style,
                          padding: '1.5rem',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '1.25rem',
                          background: 'var(--input-bg-dark)',
                          border: '1px solid var(--card-border)'
                        }}
                      >
                        <div {...provided.dragHandleProps} style={{ padding: '0.5rem', color: 'var(--text-secondary)', cursor: 'grab', marginTop: link.isEditing ? '0.5rem' : '0' }}>
                          <GripVertical size={20} />
                        </div>

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          
                          {link.isEditing ? (
                            // --- EDIT MODE ---
                            <>
                              {/* URL Input */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--hover-bg)', padding: '0.5rem 1rem', borderRadius: '8px', border: !link.url.trim() ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid transparent' }}>
                                {link.favicon ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={link.favicon} alt="" style={{ width: 20, height: 20, borderRadius: 4 }} onError={(e) => { e.target.style.display='none'; }} />
                                ) : (
                                  <LinkIcon size={20} color="var(--text-secondary)" />
                                )}
                                <input 
                                  type="text" 
                                  placeholder="URL (e.g. https://react.dev) *" 
                                  value={link.url}
                                  onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                                  onBlur={(e) => handleUrlBlur(link.id, e.target.value)}
                                  style={{ border: 'none', background: 'transparent', padding: 0, fontSize: '1rem' }}
                                />
                                {isFetching && <Loader2 size={16} className="loader" style={{ marginLeft: 'auto' }} />}
                              </div>

                              {/* Title Input */}
                              <div>
                                <input 
                                  type="text" 
                                  placeholder="Title (e.g. React Documentation)" 
                                  value={link.title}
                                  onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                                  style={{ background: 'transparent', border: '1px solid var(--card-border)' }}
                                />
                              </div>

                              {/* Description / Note Input */}
                              <div>
                                <input 
                                  type="text" 
                                  placeholder="Description (e.g. Official React docs)" 
                                  value={link.note || link.description}
                                  onChange={(e) => updateLink(link.id, 'note', e.target.value)}
                                  style={{ background: 'transparent', border: '1px solid var(--card-border)' }}
                                />
                              </div>

                              {/* Actions */}
                              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                <button 
                                  className="btn btn-primary" 
                                  onClick={() => updateLink(link.id, 'isEditing', false)}
                                  style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                                >
                                  Done
                                </button>
                                <button 
                                  type="button" 
                                  className="btn-icon btn-danger" 
                                  onClick={() => removeLink(link.id)} 
                                  title="Remove Link"
                                >
                                  <Trash2 size={20} />
                                </button>
                              </div>
                            </>
                          ) : (
                            // --- VIEW MODE ---
                            <>
                              {/* Title & Favicon */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                {link.favicon ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={link.favicon} alt="" style={{ width: 24, height: 24, borderRadius: 4 }} onError={(e) => { e.target.style.display='none'; }} />
                                ) : (
                                  <LinkIcon size={24} color="var(--text-secondary)" />
                                )}
                                <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                  {link.title || link.url}
                                </h4>
                              </div>

                              {/* URL */}
                              <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)', fontSize: '0.95rem', textDecoration: 'none', wordBreak: 'break-all' }}>
                                {link.url}
                              </a>

                              {/* Description */}
                              {(link.note || link.description) && (
                                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                                  {link.note || link.description}
                                </p>
                              )}

                              {/* Actions */}
                              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                <button 
                                  className="btn btn-outline" 
                                  onClick={() => updateLink(link.id, 'isEditing', true)}
                                  style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                                >
                                  Edit
                                </button>
                                <button 
                                  className="btn btn-outline" 
                                  onClick={() => removeLink(link.id)}
                                  style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', color: 'var(--danger-color)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                                >
                                  Delete
                                </button>
                              </div>
                            </>
                          )}

                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Bottom Add Link Button (only show if there are links) */}
        {links.length > 0 && (
          <button 
            className="btn btn-outline" 
            onClick={handleAddNewLink}
            style={{ width: '100%', padding: '1rem', borderStyle: 'dashed', marginTop: '1.5rem' }}
          >
            <Plus size={20}/> Add Link
          </button>
        )}
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--card-border)' }} />

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          className="btn btn-primary" 
          onClick={handleSave} 
          disabled={isSaving}
          style={{ fontSize: '1.2rem', padding: '1rem 2rem', width: '100%' }}
        >
          {isSaving ? <Loader2 className="loader" /> : 'Generate Bundle'}
        </button>
      </div>
    </div>
  );
}
