'use client';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Download, ExternalLink, ArrowLeft } from 'lucide-react';
import Papa from 'papaparse';

export default function ShareModal({ bundle, onClose }) {
  const [copied, setCopied] = useState(false);
  
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
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportMarkdown = () => {
    let md = `# ${bundle.name}\n\n`;
    if (bundle.description) md += `${bundle.description}\n\n`;
    bundle.links.forEach(l => {
      md += `### [${l.title}](${l.url})\n`;
      if (l.note) md += `**Note:** ${l.note}\n`;
      if (l.description) md += `> ${l.description}\n`;
      md += '\n';
    });
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${bundle.name}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportTXT = () => {
    let txt = `${bundle.name}\n================\n${bundle.description || ''}\n\n`;
    bundle.links.forEach((l, i) => {
      txt += `${i + 1}. ${l.title}\n${l.url}\n`;
      if (l.note) txt += `Note: ${l.note}\n`;
      txt += '\n';
    });
    const blob = new Blob([txt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${bundle.name}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass animate-fade-in" style={{ padding: '3rem 2rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <button className="btn btn-outline" style={{ position: 'absolute', top: '1rem', left: '1rem' }} onClick={onClose}>
        <ArrowLeft size={18} /> Back
      </button>

      <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--success-color)' }}>Bundle Created! 🎉</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Your bundle "{bundle.name}" is ready to share.</p>

      {/* URL Copy Box */}
      <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '0.5rem', marginBottom: '2rem' }}>
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

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* QR Code */}
        <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', display: 'inline-block' }}>
          <QRCodeSVG value={bundleUrl} size={150} level={"H"} />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '200px' }}>
          <a href={bundleUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ justifyContent: 'center' }}>
            <ExternalLink size={18} /> Open Bundle
          </a>
          <button className="btn btn-outline" onClick={() => window.print()}>
            <Download size={18} /> Export PDF
          </button>
          <button className="btn btn-outline" onClick={exportCSV}>
            <Download size={18} /> Export CSV
          </button>
          <button className="btn btn-outline" onClick={exportMarkdown}>
            <Download size={18} /> Export Markdown
          </button>
          <button className="btn btn-outline" onClick={exportTXT}>
            <Download size={18} /> Export TXT
          </button>
        </div>
      </div>
    </div>
  );
}
