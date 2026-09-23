import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Share, PlusSquare, Smartphone, X, Monitor, Globe } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const [activeTab, setActiveTab] = useState<'iphone' | 'edge-pc' | 'edge-iphone'>('edge-iphone');

  // If already running as an installed standalone app, hide button
  if (isInstalled) {
    return null;
  }

  return (
    <>
      {/* Install Button in Header */}
      <button
        onClick={() => {
          if (isInstallable) {
            install();
          } else {
            setShowGuide(true);
          }
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-800 bg-amber-50 border border-amber-200 hover:bg-amber-100 rounded-xl transition-colors shadow-2xs"
        title="Install as App (Edge, iPhone, Chrome)"
      >
        <Smartphone className="w-3.5 h-3.5 text-amber-700" />
        <span className="hidden sm:inline">Install as App</span>
        <span className="sm:hidden">Install App</span>
      </button>

      {/* Guided Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-neutral-200 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-neutral-900 text-white flex items-center justify-center text-xs font-bold">
                  ☀️
                </div>
                <h3 className="text-base font-bold text-neutral-900">Install MyDay App</h3>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Platform Selector Tabs */}
            <div className="flex bg-neutral-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab('edge-iphone')}
                className={`flex-1 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'edge-iphone' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Edge (iPhone)
              </button>
              <button
                onClick={() => setActiveTab('iphone')}
                className={`flex-1 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'iphone' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Safari (iPhone)
              </button>
              <button
                onClick={() => setActiveTab('edge-pc')}
                className={`flex-1 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'edge-pc' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Edge (PC / Mac)
              </button>
            </div>

            {/* Instructions: Edge on iPhone */}
            {activeTab === 'edge-iphone' && (
              <div className="space-y-3 pt-1 text-xs">
                <p className="text-neutral-600">
                  Yes, you can install directly from <strong>Microsoft Edge on your iPhone</strong>:
                </p>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200/80">
                    <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold shrink-0 text-xs">
                      1
                    </span>
                    <div>
                      <p className="font-semibold text-neutral-900">Tap the "..." or Share menu</p>
                      <p className="text-neutral-500 mt-0.5">
                        At the bottom center of the Edge browser, tap the menu (three dots <strong>⋯</strong> or the <strong>Share</strong> icon).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200/80">
                    <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold shrink-0 text-xs">
                      2
                    </span>
                    <div>
                      <p className="font-semibold text-neutral-900 flex items-center gap-1.5">
                        <span>Tap "Add to Home Screen"</span>
                        <PlusSquare className="w-3.5 h-3.5 text-neutral-700 inline" />
                      </p>
                      <p className="text-neutral-500 mt-0.5">
                        In the options list, scroll down and select <strong>"Add to Home screen"</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200/80">
                    <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold shrink-0 text-xs">
                      3
                    </span>
                    <div>
                      <p className="font-semibold text-neutral-900">Confirm & Tap Add</p>
                      <p className="text-neutral-500 mt-0.5">
                        Tap <strong>Add</strong> in the top-right corner. The app will appear on your phone screen!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions: Safari on iPhone */}
            {activeTab === 'iphone' && (
              <div className="space-y-3 pt-1 text-xs">
                <p className="text-neutral-600">
                  Using <strong>Safari on iPhone</strong>:
                </p>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200/80">
                    <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold shrink-0 text-xs">
                      1
                    </span>
                    <div>
                      <p className="font-semibold text-neutral-900 flex items-center gap-1.5">
                        <span>Tap the Share Button</span>
                        <Share className="w-3.5 h-3.5 text-blue-600 inline" />
                      </p>
                      <p className="text-neutral-500 mt-0.5">
                        Tap the square with the arrow pointing up at the bottom of Safari.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200/80">
                    <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold shrink-0 text-xs">
                      2
                    </span>
                    <div>
                      <p className="font-semibold text-neutral-900">Select "Add to Home Screen"</p>
                      <p className="text-neutral-500 mt-0.5">
                        Scroll down the share sheet and tap <strong>Add to Home Screen</strong>, then tap <strong>Add</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions: Edge on PC / Mac */}
            {activeTab === 'edge-pc' && (
              <div className="space-y-3 pt-1 text-xs">
                <p className="text-neutral-600">
                  Using <strong>Microsoft Edge on PC or Mac</strong>:
                </p>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200/80">
                    <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold shrink-0 text-xs">
                      1
                    </span>
                    <div>
                      <p className="font-semibold text-neutral-900">Look in the Address Bar</p>
                      <p className="text-neutral-500 mt-0.5">
                        Click the small <strong>"App available. Install MyDay"</strong> icon at the right edge of the address bar.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200/80">
                    <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold shrink-0 text-xs">
                      2
                    </span>
                    <div>
                      <p className="font-semibold text-neutral-900">Or via Edge Menu</p>
                      <p className="text-neutral-500 mt-0.5">
                        Click the <strong>⋯</strong> menu $\rightarrow$ <strong>Apps</strong> $\rightarrow$ <strong>"Install MyDay"</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={() => setShowGuide(false)}
                className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
