'use client';
import { useState, useEffect } from 'react';
import { Rocket, Trash2, Link as LinkIcon, Plus, Loader2, Edit3, Heart, LayoutList, LayoutGrid, CheckCircle2, PlayCircle, Folder, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Toast from './Toast';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function BundleManager({ initialBundle }) {
  const [links, setLinks] = useState(initialBundle?.links || []);
  const [isFavorite, setIsFavorite] = useState(initialBundle?.isFavorite || false);
  const [isFetching, setIsFetching] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });
  const [viewMode, setViewMode] = useState('list');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = (message, type = 'error') => {
    setToast({ show: true, message, type });
  };

  const handleToggleFavorite = async () => {
    try {
      const res = await api.put(`/bundles/${initialBundle.shortId}`, {
        isFavorite: !isFavorite
      });
      setIsFavorite(!isFavorite);
    } catch (error) {
      showToast('Failed to update favorite status.');
    }
  };

  const handleDeleteBundle = async () => {
    if (!confirm('Are you sure you want to delete this bundle? This action cannot be undone.')) return;
    try {
      await api.delete(`/bundles/${initialBundle.shortId}`);
      router.push('/dashboard');
    } catch (error) {
      showToast('Failed to delete bundle.');
    }
  };

  const saveLinks = async (newLinks) => {
    try {
      const validLinks = newLinks.filter(l => l.url && l.url.trim() !== '').map(({ isEditing, ...rest }) => rest);
      await api.put(`/bundles/${initialBundle.shortId}/links`, { links: validLinks });
      router.refresh();
    } catch (error) {
      showToast('Failed to save links.');
    }
  };

  const handleAddNewLink = () => {
    const newId = Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);
    setLinks(prev => [{
      id: newId,
      url: '',
      title: '',
      description: '',
      favicon: '',
      note: '',
      isEditing: true
    }, ...prev]);
  };

  const handleUrlBlur = async (id, url) => {
    if (!url.trim()) return;
    
    let validUrl = url;
    if (!/^https?:\/\//i.test(validUrl)) validUrl = 'https://' + validUrl;

    const link = links.find(l => l.id === id);
    if (link && link.title && link.url === validUrl) return;

    setIsFetching(true);
    try {
      const res = await fetch(`/api/metadata?url=${encodeURIComponent(validUrl)}`);
      const data = await res.json();
      
      if (res.ok) {
        setLinks(prev => {
          const newLinks = prev.map(l => l.id === id ? {
            ...l,
            url: validUrl,
            title: l.title || data.title || validUrl,
            description: l.description || data.description || '',
            favicon: data.favicon || '',
          } : l);
          return newLinks;
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsFetching(false);
    }
  };

  const finishEditingLink = (id) => {
    setLinks(prev => {
      const newLinks = prev.map(l => l.id === id ? { ...l, isEditing: false } : l);
      saveLinks(newLinks);
      return newLinks;
    });
  };

  const removeLink = (id) => {
    setLinks(prev => {
      const newLinks = prev.filter(l => l.id !== id);
      saveLinks(newLinks);
      return newLinks;
    });
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
    saveLinks(items);
  };

  // UI Components mapping
  const IconComponent = initialBundle?.icon === 'Rocket' ? Rocket : Folder;

  return (
    <>
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ ...toast, show: false })} 
        />
      )}
      
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 text-left pb-16 animate-fade-in">
        
        {/* TOP BANNER CARD */}
        <div className="bg-white dark:bg-zinc-950 border border-black/10 dark:border-white/10 rounded-[32px] p-8 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Left Side: Icon, Title, Tags, Stats */}
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
                <IconComponent size={32} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white m-0 tracking-tight">
                    {initialBundle.name}
                  </h1>
                  {initialBundle.category && (
                    <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm font-semibold rounded-lg">
                      {initialBundle.category}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-zinc-500 dark:text-zinc-400 font-medium text-sm">
                  <div className="flex items-center gap-1.5">
                    <PlayCircle size={16} />
                    <span>{links.length} Links</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 size={16} />
                    <span>0 Completed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Action Buttons */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-semibold transition-colors w-[130px] justify-center"
              >
                {viewMode === 'list' ? (
                  <>
                    <LayoutGrid size={18} />
                    <span>Grid View</span>
                  </>
                ) : (
                  <>
                    <LayoutList size={18} />
                    <span>List View</span>
                  </>
                )}
              </button>
              <button 
                onClick={handleToggleFavorite}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-semibold transition-colors"
              >
                <Heart size={18} fill={isFavorite ? "currentColor" : "none"} className={isFavorite ? "text-rose-500" : ""} />
                <span>Favorite</span>
              </button>
              <button 
                onClick={handleAddNewLink}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors shadow-sm"
              >
                <Plus size={18} />
                <span>Add Link</span>
              </button>
              <button 
                onClick={handleDeleteBundle}
                className="flex items-center justify-center p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-500 transition-colors"
                title="Delete Bundle"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          <hr className="border-zinc-100 dark:border-zinc-800 my-2" />

          {/* Progress Bar */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-zinc-500 dark:text-zinc-400">Collection Progress</span>
              <span className="text-zinc-900 dark:text-white">0%</span>
            </div>
            <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '0%' }}></div>
            </div>
          </div>
        </div>

        {/* LINKS LIST */}
        <div className="w-full mt-2">
          {links.length === 0 && (
            <div className="text-center py-12 text-zinc-500 dark:text-zinc-400 bg-white/50 dark:bg-zinc-950/50 rounded-[32px] border border-dashed border-zinc-300 dark:border-zinc-700">
              No links added yet. Click "Add Link" to get started.
            </div>
          )}

          {mounted && (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="links">
                {(provided) => (
                  <div 
                    {...provided.droppableProps} 
                    ref={provided.innerRef}
                    className={viewMode === 'list' ? "flex flex-col gap-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}
                  >
                  {links.map((link, index) => (
                    <Draggable key={link.id} draggableId={link.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="bg-white dark:bg-zinc-950 border border-black/10 dark:border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm flex items-start gap-3 transition-all"
                          style={{ ...provided.draggableProps.style }}
                        >
                          <div {...provided.dragHandleProps} className={`p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 cursor-grab ${link.isEditing ? 'mt-2' : 'mt-0'}`}>
                            <GripVertical size={20} />
                          </div>

                          <div className={`flex-1 flex flex-col gap-2.5 overflow-hidden`}>
                            
                            {link.isEditing ? (
                              // --- EDIT MODE ---
                              <>
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

                                <div>
                                  <input 
                                    type="text" 
                                    placeholder="Title (e.g. React Documentation)" 
                                    value={link.title}
                                    onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                                    className="w-full bg-zinc-50 dark:bg-black border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                  />
                                </div>

                                <div>
                                  <input 
                                    type="text" 
                                    placeholder="Description (e.g. Official React docs)" 
                                    value={link.note || link.description}
                                    onChange={(e) => updateLink(link.id, 'note', e.target.value)}
                                    className="w-full bg-zinc-50 dark:bg-black border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                  />
                                </div>

                                <div className="flex gap-3 mt-2">
                                  <button 
                                    className="bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black font-semibold rounded-lg px-6 py-2 transition-colors" 
                                    onClick={() => finishEditingLink(link.id)}
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
                                <div className="flex items-center gap-2.5">
                                  {link.favicon ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={link.favicon} alt="" className="w-6 h-6 rounded-md shadow-sm" onError={(e) => { e.target.style.display='none'; }} />
                                  ) : (
                                    <div className="w-6 h-6 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                      <LinkIcon size={14} className="text-zinc-500" />
                                    </div>
                                  )}
                                  <h4 className="m-0 text-base font-bold text-zinc-900 dark:text-white truncate">
                                    {link.title || link.url}
                                  </h4>
                                </div>

                                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 text-sm no-underline break-all hover:underline">
                                  {link.url}
                                </a>

                                {(link.note || link.description) && (
                                  <p className="m-0 text-zinc-600 dark:text-zinc-400 text-[13px] leading-relaxed">
                                    {link.note || link.description}
                                  </p>
                                )}

                                <div className="flex gap-2 mt-1">
                                  <button 
                                    className="bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium rounded-lg px-3 py-1 text-xs transition-all" 
                                    onClick={() => updateLink(link.id, 'isEditing', true)}
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    className="bg-white dark:bg-black/50 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-medium rounded-lg px-3 py-1 text-xs transition-all" 
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
          )}
        </div>
      </div>
    </>
  );
}
