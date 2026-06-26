'use client';
import { useState } from 'react';
import { GripVertical, Trash2, Link as LinkIcon, Image as ImageIcon, MessageSquare, Plus, Loader2, Edit3, Check } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function BundleEditor({ onSave }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [links, setLinks] = useState([]);
  const [newUrl, setNewUrl] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchMetadata = async (url) => {
    setIsFetching(true);
    try {
      // Basic URL validation
      let validUrl = url;
      if (!/^https?:\/\//i.test(validUrl)) {
        validUrl = 'https://' + validUrl;
      }
      
      const res = await fetch(`/api/metadata?url=${encodeURIComponent(validUrl)}`);
      const data = await res.json();
      
      if (res.ok) {
        setLinks(prev => [...prev, {
          id: Date.now().toString(),
          url: validUrl,
          title: data.title || validUrl,
          description: data.description || '',
          favicon: data.favicon || '',
          note: ''
        }]);
      } else {
        // Fallback if fetch fails
        setLinks(prev => [...prev, {
          id: Date.now().toString(),
          url: validUrl,
          title: validUrl,
          description: '',
          favicon: '',
          note: ''
        }]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsFetching(false);
      setNewUrl('');
    }
  };

  const handleAddLink = (e) => {
    e.preventDefault();
    if (!newUrl.trim()) return;
    fetchMetadata(newUrl);
  };

  const removeLink = (id) => {
    setLinks(links.filter(l => l.id !== id));
  };

  const updateLinkNote = (id, note) => {
    setLinks(links.map(l => l.id === id ? { ...l, note } : l));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(links);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setLinks(items);
  };

  const handleSave = async () => {
    if (!name || links.length === 0) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/bundles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, links })
      });
      const data = await res.json();
      if (res.ok) {
        onSave(data);
      } else {
        alert(data.error || 'Failed to save');
      }
    } catch (e) {
      alert('Error saving bundle');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="glass animate-fade-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Bundle Header info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Bundle Name</label>
          <input 
            type="text" 
            placeholder="e.g. Frontend Resources" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ fontSize: '1.5rem', fontWeight: 700, padding: '1rem' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Description (Optional)</label>
          <textarea 
            placeholder="What are these links for?" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--card-border)' }} />

      {/* Add Link Input */}
      <form onSubmit={handleAddLink} style={{ display: 'flex', gap: '0.5rem' }}>
        <input 
          type="text" 
          placeholder="Paste URL here (e.g. https://react.dev)" 
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          disabled={isFetching}
        />
        <button type="submit" className="btn btn-primary" disabled={isFetching || !newUrl.trim()}>
          {isFetching ? <Loader2 className="loader" /> : <><Plus size={20}/> Add Link</>}
        </button>
      </form>

      {/* Draggable Link List */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="links">
          {(provided) => (
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: '100px' }}
            >
              {links.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', border: '1px dashed var(--card-border)', borderRadius: '8px' }}>
                  No links added yet. Paste a URL above to start!
                </div>
              ) : null}

              {links.map((link, index) => (
                <Draggable key={link.id} draggableId={link.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="glass"
                      style={{ 
                        ...provided.draggableProps.style,
                        padding: '1rem',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '1rem',
                        background: 'rgba(0,0,0,0.3)'
                      }}
                    >
                      <div {...provided.dragHandleProps} style={{ padding: '0.5rem', color: 'var(--text-secondary)', cursor: 'grab' }}>
                        <GripVertical size={20} />
                      </div>
                      
                      {link.favicon ? (
                        <img src={link.favicon} alt="" style={{ width: 24, height: 24, borderRadius: 4, marginTop: 4 }} onError={(e) => { e.target.style.display='none'; }} />
                      ) : (
                        <LinkIcon size={24} color="var(--text-secondary)" style={{ marginTop: 4 }} />
                      )}

                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontWeight: 600, fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{link.title}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{link.url}</div>
                        
                        {/* Note Editor */}
                        <div style={{ marginTop: '0.5rem' }}>
                          <input 
                            type="text" 
                            placeholder="Add a note... (e.g. Official Docs)" 
                            value={link.note}
                            onChange={(e) => updateLinkNote(link.id, e.target.value)}
                            style={{ padding: '0.5rem', fontSize: '0.9rem', background: 'transparent', borderBottom: '1px solid var(--card-border)', borderRadius: 0 }}
                          />
                        </div>
                      </div>

                      <button type="button" className="btn-icon btn-danger" onClick={() => removeLink(link.id)} title="Remove Link">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <button 
          className="btn btn-primary" 
          onClick={handleSave} 
          disabled={isSaving || !name || links.length === 0}
          style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
        >
          {isSaving ? <Loader2 className="loader" /> : 'Create Bundle'}
        </button>
      </div>
    </div>
  );
}
