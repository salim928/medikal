"use client";

export default function ThemeTestPage() {
  return (
    <div className="min-h-screen bg-canvas p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-brand-600 mb-4">🎨 Theme Test Page</h1>
        
        <div className="bg-white backdrop-blur border border-slate-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-ink mb-4">Theme Status Check</h2>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-brand-400 rounded-full"></div>
              <span className="text-slate-600">If you see this with a cyan dot, theme is working!</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-canvas rounded-full border border-brand-500"></div>
              <span className="text-slate-600">Dark gradient background: slate-900 → slate-800</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-white rounded-full"></div>
              <span className="text-slate-600">If background is WHITE, cache needs clearing</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-brand-500/10 to-brand-500/10 border border-slate-200 rounded-lg p-4">
            <h3 className="text-ink font-bold mb-2">Gradient Card</h3>
            <p className="text-slate-500 text-sm">This should have a subtle cyan-blue gradient</p>
          </div>
          
          <div className="bg-white backdrop-blur border border-slate-200 rounded-lg p-4">
            <h3 className="text-ink font-bold mb-2">Standard Card</h3>
            <p className="text-slate-500 text-sm">Dark background with cyan border</p>
          </div>
        </div>

        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
          <h3 className="text-red-600 font-bold mb-2">⚠️ Not Seeing Theme?</h3>
          <p className="text-slate-600 mb-3">Try these steps:</p>
          <ol className="text-slate-500 text-sm space-y-2 list-decimal list-inside">
            <li>Hard refresh: <code className="bg-mist px-2 py-1 rounded">Ctrl + Shift + R</code></li>
            <li>Clear browser cache</li>
            <li>Open in incognito window</li>
            <li>Restart dev server</li>
          </ol>
        </div>

        <div className="bg-brand-500/10 border border-green-500/30 rounded-lg p-6">
          <h3 className="text-green-400 font-bold mb-2">✅ Theme Working Correctly If You See:</h3>
          <ul className="text-slate-600 text-sm space-y-1 list-disc list-inside">
            <li>Dark gradient background (not white)</li>
            <li>Cyan colored text and borders</li>
            <li>Cards with dark transparent backgrounds</li>
            <li>White and light gray text (not dark gray on white)</li>
          </ul>
        </div>

        <div className="text-center">
          <p className="text-slate-500 text-sm">
            Visit <code className="bg-mist px-2 py-1 rounded text-brand-600">/dashboard</code> to see the full themed interface
          </p>
        </div>
      </div>
    </div>
  );
}
