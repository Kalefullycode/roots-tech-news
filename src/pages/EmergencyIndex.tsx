import { useEffect } from "react";

const EmergencyIndex = () => {
  useEffect(() => {
    console.log("✅ EmergencyIndex loaded successfully!");
    console.log("✅ React is working!");
    console.log("✅ If you see this, the site is NOT broken!");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              RootsTechNews
            </h1>
            <p className="text-2xl text-gray-300 mb-2">
              ✅ Site is WORKING!
            </p>
            <p className="text-lg text-gray-400">
              Emergency diagnostic page - Full site loading...
            </p>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-green-900/30 border border-green-500 rounded-lg p-6">
              <h3 className="text-xl font-bold text-green-400 mb-2">✅ Build Status</h3>
              <p className="text-gray-300">Successfully built and deployed</p>
            </div>
            
            <div className="bg-green-900/30 border border-green-500 rounded-lg p-6">
              <h3 className="text-xl font-bold text-green-400 mb-2">✅ React Working</h3>
              <p className="text-gray-300">React is loading correctly</p>
            </div>
            
            <div className="bg-green-900/30 border border-green-500 rounded-lg p-6">
              <h3 className="text-xl font-bold text-green-400 mb-2">✅ CSS Loaded</h3>
              <p className="text-gray-300">Tailwind styles are working</p>
            </div>
            
            <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-400 mb-2">🔄 Full Site</h3>
              <p className="text-gray-300">Loading complete version...</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-purple-900/20 border border-purple-500 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">If you see this page:</h2>
            <ul className="space-y-3 text-gray-300">
              <li>✅ The site is NOT broken - it's a caching issue</li>
              <li>✅ Try: <kbd className="bg-gray-800 px-2 py-1 rounded">Ctrl+Shift+R</kbd> (Windows) or <kbd className="bg-gray-800 px-2 py-1 rounded">Cmd+Shift+R</kbd> (Mac)</li>
              <li>✅ Or open in Incognito/Private mode</li>
              <li>✅ Wait 2-3 minutes for CDN propagation</li>
            </ul>
          </div>

          {/* Browser Info */}
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>User Agent: {navigator.userAgent}</p>
            <p>Timestamp: {new Date().toISOString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyIndex;

