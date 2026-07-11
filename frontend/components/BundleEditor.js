'use client';
import { useState } from 'react';
import { GripVertical, Trash2, Link as LinkIcon, Plus, Loader2, ArrowLeft, Edit3 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Toast from './Toast';

export default function BundleEditor({ mode = 'create', initialBundle = null, onSave, onCancel }) {
  const [name, setName] = useState(initialBundle?.name || '');
  const [description, setDescription] = useState(initialBundle?.description || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [expiresIn, setExpiresIn] = useState('none');
  const [links, setLinks] = useState(initialBundle?.links || []);
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

  const showToast = (message, type = 'error') => {
    setToast({ show: true, message, type });
  };

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
    if (mode === 'create') {
      if (!name.trim()) {
        showToast("Please enter a Bundle Name.");
        return;
      }
      if (password && password !== confirmPassword) {
        showToast("Passwords do not match. Please check your password and try again.");
        return;
      }

      setIsSaving(true);
      try {
        const res = await fetch('/api/bundles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, description, password, expiresIn, links: [] })
        });
        const data = await res.json();
        if (res.ok) {
          onSave(data);
        } else {
          showToast(data.error || 'Failed to save bundle.');
        }
      } catch (e) {
        showToast('Error saving bundle. Please try again.');
      } finally {
        setIsSaving(false);
      }
    } else if (mode === 'edit') {
      const validLinks = links.filter(l => l.url && l.url.trim() !== '').map(({ isEditing, ...rest }) => rest);
      if (validLinks.length === 0) {
        showToast("Please add at least one valid link.");
        return;
      }

      setIsSaving(true);
      try {
        const res = await fetch(`/api/bundles/${initialBundle.shortId}/links`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ links: validLinks })
        });
        const data = await res.json();
        if (res.ok) {
          onSave(data);
        } else {
          showToast(data.error || 'Failed to update links.');
        }
      } catch (e) {
        showToast('Error updating links. Please try again.');
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <>
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ ...toast, show: false })} 
        />
      )}
      <div className="bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl animate-fade-in flex flex-col gap-8 w-full max-w-3xl mx-auto text-left">
      
      {/* Header */}
      <div className="flex items-center gap-4 pb-6 border-b border-black/10 dark:border-white/10">
        <button 
          className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-600 dark:text-zinc-400" 
          onClick={() => {
            if (onCancel) onCancel();
          }}
          title="Go back"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white m-0">
          {mode === 'create' ? 'Create Bundle' : 'Add Links'}
        </h2>
      </div>

      {/* Bundle Meta info (Create Mode) */}
      {mode === 'create' && (
        <>
          <div className="flex flex-col gap-6">
            <div>
              <label className="block mb-2 font-medium text-zinc-700 dark:text-zinc-300">Bundle Name <span className="text-rose-500">*</span></label>
              <input 
                type="text" 
                placeholder="e.g. Frontend Resources" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full bg-zinc-50 dark:bg-black border ${name.trim() ? 'border-black/10 dark:border-white/10' : 'border-rose-500/50'} text-zinc-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-lg`}
              />
            </div>
            <div>
              <label className="block mb-2 font-medium text-zinc-700 dark:text-zinc-300">Description</label>
              <textarea 
                placeholder="What are these links for?" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-zinc-50 dark:bg-black border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-y"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium text-zinc-700 dark:text-zinc-300">Password (Optional)</label>
                <input 
                  type="password" 
                  placeholder="Protect this bundle" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-black border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium text-zinc-700 dark:text-zinc-300">Self-Destruct (Optional)</label>
                <select
                  value={expiresIn}
                  onChange={(e) => setExpiresIn(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-black border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer"
                >
                  <option value="none">Never</option>
                  <option value="1h">1 Hour</option>
                  <option value="24h">24 Hours</option>
                  <option value="7d">7 Days</option>
                </select>
              </div>
            </div>
            
            {password && (
              <div className="animate-fade-in -mt-2">
                <label className="block mb-2 font-medium text-zinc-700 dark:text-zinc-300">Confirm Password <span className="text-rose-500">*</span></label>
                <input 
                  type="password" 
                  placeholder="Type your password again" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full bg-zinc-50 dark:bg-black border ${confirmPassword === password ? 'border-black/10 dark:border-white/10' : 'border-rose-500/50'} text-zinc-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all`}
                />
              </div>
            )}
          </div>
          
          <hr className="border-t border-black/10 dark:border-white/10 my-4" />
          
          <div className="flex justify-end gap-4">
            {onCancel && (
              <button className="bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold rounded-xl px-6 py-3 shadow-sm transition-all" onClick={onCancel}>
                Cancel
              </button>
            )}
            <button 
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl px-8 py-3 shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-70" 
              onClick={handleSave} 
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="animate-spin" size={20} /> : 'Create Bundle \u2192'}
            </button>
          </div>
        </>
      )}

      {/* Links Section (Edit Mode) */}
      {mode === 'edit' && (
        <>
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">Add Links</h3>
            <hr className="border-t border-black/10 dark:border-white/10 mb-6" />
        
        {/* Top Add Link Button */}
        <button 
          className="w-full bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-2 border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 font-medium rounded-xl p-4 flex items-center justify-center gap-2 transition-colors mb-6" 
          onClick={handleAddNewLink}
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
                className="flex flex-col gap-6"
              >
                {links.map((link, index) => (
                  <Draggable key={link.id} draggableId={link.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="bg-white dark:bg-zinc-950 border border-black/10 dark:border-white/10 rounded-2xl p-6 shadow-md flex items-start gap-4 transition-all"
                        style={{ ...provided.draggableProps.style }}
                      >
                        <div {...provided.dragHandleProps} className={`p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 cursor-grab ${link.isEditing ? 'mt-2' : 'mt-0'}`}>
                          <GripVertical size={20} />
                        </div>

                        <div className="flex-1 flex flex-col gap-4">
                          
                          {link.isEditing ? (
                            // --- EDIT MODE ---
                            <>
                              {/* URL Input */}
                              <div className={`flex items-center gap-3 bg-zinc-50 dark:bg-black border ${!link.url.trim() ? 'border-rose-500/50' : 'border-black/5 dark:border-white/5'} rounded-xl p-3 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all`}>
                                {link.favicon ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={link.favicon} alt="" className="w-5 h-5 rounded" onError={(e) => { e.target.style.display='none'; }} />
                                ) : (
                                  <LinkIcon size={20} className="text-zinc-400" />
                                )}
                                <input 
                                  type="text" 
                                  placeholder="URL (e.g. https://react.dev) *" 
                                  value={link.url}
                                  onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                                  onBlur={(e) => handleUrlBlur(link.id, e.target.value)}
                                  className="w-full bg-transparent border-none outline-none text-zinc-900 dark:text-white"
                                />
                                {isFetching && <Loader2 size={16} className="animate-spin text-emerald-500 ml-auto" />}
                              </div>

                              {/* Title Input */}
                              <div>
                                <input 
                                  type="text" 
                                  placeholder="Title (e.g. React Documentation)" 
                                  value={link.title}
                                  onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                                  className="w-full bg-zinc-50 dark:bg-black border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                />
                              </div>

                              {/* Description / Note Input */}
                              <div>
                                <input 
                                  type="text" 
                                  placeholder="Description (e.g. Official React docs)" 
                                  value={link.note || link.description}
                                  onChange={(e) => updateLink(link.id, 'note', e.target.value)}
                                  className="w-full bg-zinc-50 dark:bg-black border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                />
                              </div>

                              {/* Actions */}
                              <div className="flex gap-3 mt-2">
                                <button 
                                  className="bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black font-semibold rounded-lg px-6 py-2 transition-colors" 
                                  onClick={() => updateLink(link.id, 'isEditing', false)}
                                >
                                  Done
                                </button>
                                <button 
                                  type="button" 
                                  className="text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 p-2 rounded-lg transition-colors flex items-center justify-center" 
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
                              <div className="flex items-center gap-3">
                                {link.favicon ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={link.favicon} alt="" className="w-6 h-6 rounded" onError={(e) => { e.target.style.display='none'; }} />
                                ) : (
                                  <LinkIcon size={24} className="text-zinc-400" />
                                )}
                                <h4 className="m-0 text-xl font-bold text-zinc-900 dark:text-white truncate">
                                  {link.title || link.url}
                                </h4>
                              </div>

                              {/* URL */}
                              <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 text-sm no-underline break-all hover:underline">
                                {link.url}
                              </a>

                              {/* Description */}
                              {(link.note || link.description) && (
                                <p className="m-0 text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                                  {link.note || link.description}
                                </p>
                              )}

                              {/* Actions */}
                              <div className="flex gap-3 mt-2">
                                <button 
                                  className="bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium rounded-lg px-4 py-1.5 text-sm transition-all" 
                                  onClick={() => updateLink(link.id, 'isEditing', true)}
                                >
                                  Edit
                                </button>
                                <button 
                                  className="bg-white dark:bg-black/50 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-medium rounded-lg px-4 py-1.5 text-sm transition-all" 
                                  onClick={() => removeLink(link.id)}
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

        {/* Bottom Add Link Button */}
        {links.length > 0 && (
          <button 
            className="w-full bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-2 border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 font-medium rounded-xl p-4 flex items-center justify-center gap-2 transition-colors mt-6" 
            onClick={handleAddNewLink}
          >
            <Plus size={20}/> Add Link
          </button>
        )}
          </div>
          <hr className="border-t border-black/10 dark:border-white/10 my-6" />

          <div className="flex justify-end gap-4">
            {onCancel && (
              <button className="bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold rounded-xl px-6 py-3 shadow-sm transition-all" onClick={onCancel}>
                &larr; Back
              </button>
            )}
            <button 
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl px-8 py-3 shadow-md flex items-center justify-center gap-2 transition-all flex-1 md:flex-none disabled:opacity-70" 
              onClick={handleSave} 
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="animate-spin" size={20} /> : 'Finish & Generate Bundle'}
            </button>
          </div>
        </>
      )}
    </div>
    </>
  );
}
