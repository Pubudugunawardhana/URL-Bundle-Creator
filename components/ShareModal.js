'use client';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Download, ExternalLink, ArrowLeft } from 'lucide-react';
import Papa from 'papaparse';

export default function ShareModal({ bundle, onClose }) {
  const [copied, setCopied] = useState(false);
  const [textCopied, setTextCopied] = useState(false);
  
  // Construct the absolute URL (e.g., https://urlbundle.app/b/AbX92)
  const bundleUrl = typeof window !== 'undefined' ? `${window.location.origin}/b/${bundle.shortId}` : `/b/${bundle.shortId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(bundleUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportCSV = () => {
    const csv = Papa.unparse(bundle.links.map(l => ({
      Title: l.title,
      URL: l.url,
      Note: l.note || '',
      Description: l.description || ''
    })));
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${bundle.name}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };



  const copyAsText = () => {
    let txt = `*${bundle.name}*\n\n`;
    if (bundle.description) txt += `${bundle.description}\n\n`;
    bundle.links.forEach((l, i) => {
      txt += `${i + 1}. *${l.title || l.url}*\n${l.url}\n`;
      if (l.note || l.description) txt += `_${l.note || l.description}_\n`;
      txt += '\n';
    });
    txt += `*View Full Bundle:* ${bundleUrl}`;
    
    navigator.clipboard.writeText(txt);
    setTextCopied(true);
    setTimeout(() => setTextCopied(false), 2000);
  };

  const exportTXT = () => {
    let txt = `${bundle.name}\n================\n`;
    if (bundle.description) txt += `${bundle.description}\n\n`;
    
    bundle.links.forEach((l, i) => {
      txt += `${i + 1}. ${l.title || l.url}\n${l.url}\n`;
      if (l.note || l.description) txt += `Note: ${l.note || l.description}\n`;
      txt += '\n';
    });
    txt += `\nView Full Bundle: ${bundleUrl}`;
    
    const blob = new Blob([txt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${bundle.name}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* ON-SCREEN UI */}
      <div className="glass animate-fade-in no-print" style={{ padding: '3rem 2rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <button className="btn btn-outline" style={{ position: 'absolute', top: '1rem', left: '1rem' }} onClick={onClose}>
          <ArrowLeft size={18} /> Back
        </button>

        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--success-color)' }}>Bundle Created! 🎉</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Your bundle &quot;{bundle.name}&quot; is ready to share.</p>

        {/* URL Copy Box */}
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--input-bg-dark)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '0.5rem', marginBottom: '2rem' }}>
          <input 
            type="text" 
            readOnly 
            value={bundleUrl} 
            style={{ border: 'none', background: 'transparent', flex: 1, color: 'var(--accent-color)', fontWeight: 600, fontSize: '1.1rem' }} 
          />
          <button className="btn btn-primary" onClick={handleCopy} style={{ padding: '0.5rem 1rem' }}>
            {copied ? <Check size={18} /> : <Copy size={18} />} {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
          {/* QR Code */}
          <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', display: 'inline-block' }}>
            <QRCodeSVG value={bundleUrl} size={150} level={"H"} />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '200px' }}>
            <a href={bundleUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ justifyContent: 'center' }}>
              <ExternalLink size={18} /> Open Bundle
            </a>
            <button className="btn btn-outline" onClick={copyAsText} style={{ justifyContent: 'center' }}>
              {textCopied ? <Check size={18} /> : <Copy size={18} />} {textCopied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
            <button className="btn btn-outline" onClick={() => window.print()}>
              <Download size={18} /> Export PDF
            </button>
            <button className="btn btn-outline" onClick={exportCSV}>
              <Download size={18} /> Export CSV
            </button>

            <button className="btn btn-outline" onClick={exportTXT}>
              <Download size={18} /> Export TXT
            </button>
          </div>
        </div>
      </div>

      {/* PRINT ONLY UI */}
      <div className="print-only" style={{ padding: '2rem', fontFamily: 'sans-serif', color: 'black' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', borderBottom: '2px solid #eee', paddingBottom: '0.5rem' }}>
          {bundle.name}
        </h1>
        {bundle.description && (
          <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '2rem' }}>{bundle.description}</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem' }}>
          {bundle.links.map((l, i) => (
            <div key={i} style={{ pageBreakInside: 'avoid' }}>
              <h3 style={{ fontSize: '1.4rem', margin: '0 0 0.5rem 0' }}>
                {i + 1}. {l.title || l.url}
              </h3>
              <a href={l.url} style={{ color: '#0066cc', textDecoration: 'none', fontSize: '1.1rem', wordBreak: 'break-all' }}>
                {l.url}
              </a>
              {(l.note || l.description) && (
                <p style={{ margin: '0.5rem 0 0 0', color: '#444', fontSize: '1rem', lineHeight: 1.5 }}>
                  {l.note || l.description}
                </p>
              )}
            </div>
          ))}
        </div>

        <div style={{ borderTop: '2px solid #eee', paddingTop: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', pageBreakInside: 'avoid' }}>
          <div style={{ background: 'white', padding: '10px', display: 'inline-block', border: '1px solid #ccc' }}>
            <QRCodeSVG value={bundleUrl} size={100} level={"L"} />
          </div>
          <div>
            <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>Scan to view all links online:</p>
            <a href={bundleUrl} style={{ color: '#0066cc', textDecoration: 'none' }}>{bundleUrl}</a>
          </div>
        </div>
      </div>
    </>
  );
}
