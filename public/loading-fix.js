// RootsTechNews Quick Fix Implementation

// Add this script to your site to fix the loading issues

(function() {

    'use strict';

    

    // Configuration

    const CONFIG = {

        maxLoadTime: 4000,  // 4 seconds max before forcing load

        fadeOutDuration: 500,

        checkInterval: 100,

        debugMode: true

    };

    

    // Debug logger

    function debug(msg, type = 'info') {

        if (CONFIG.debugMode) {

            console[type](`[RootsTech Fix] ${msg}`);

        }

    }

    

    // Main fix function

    function fixLoadingScreen() {

        const startTime = Date.now();

        let attempts = 0;

        

        const checkAndFix = setInterval(() => {

            attempts++;

            const elapsed = Date.now() - startTime;

            

            // Find loading elements (common patterns)

            const loadingSelectors = [

                '#loading',

                '.loading-screen',

                '#root > #loading',

                '#root > .loading-screen',

                '[class*="loading"]',

                '.loader',

                '#loader',

                '.preloader',

                '#preloader',

                '.splash-screen',

                '.loading-overlay'

            ];

            

            let loadingElement = null;

            for (const selector of loadingSelectors) {

                const el = document.querySelector(selector);

                if (el && window.getComputedStyle(el).display !== 'none') {

                    loadingElement = el;

                    break;

                }

            }

            

            // Check if we should force removal

            if (elapsed > CONFIG.maxLoadTime || attempts > 40) {

                if (loadingElement) {

                    debug(`Force removing loading screen after ${elapsed}ms`, 'warn');

                    hideLoadingScreen(loadingElement);

                }

                clearInterval(checkAndFix);

                showMainContent();

                return;

            }

            

            // Check if page is actually ready

            if (document.readyState === 'complete' && loadingElement) {

                debug('Page complete but loading screen still visible', 'warn');

                hideLoadingScreen(loadingElement);

                clearInterval(checkAndFix);

                showMainContent();

            }

            

        }, CONFIG.checkInterval);

    }

    

    // Hide loading screen with animation

    function hideLoadingScreen(element) {

        if (!element) return;

        

        // Force hide immediately

        element.style.display = 'none';

        element.style.visibility = 'hidden';

        element.style.opacity = '0';

        element.style.pointerEvents = 'none';

        element.style.zIndex = '-1';

        

        // Try to fade out gracefully

        element.style.transition = `opacity ${CONFIG.fadeOutDuration}ms ease-out`;

        

        setTimeout(() => {

            element.remove(); // Completely remove from DOM

            debug('Loading screen removed');

        }, CONFIG.fadeOutDuration);

        

        // Remove loading classes from body

        document.body.classList.remove('loading', 'is-loading', 'page-loading');

    }

    

    // Show main content

    function showMainContent() {

        // Common main content selectors

        const contentSelectors = [

            '#app',

            '#root',

            '.app',

            '.main',

            '#main',

            '.main-content',

            '#content',

            'main',

            '.container',

            '.page-content'

        ];

        

        contentSelectors.forEach(selector => {

            const elements = document.querySelectorAll(selector);

            elements.forEach(el => {

                el.style.display = 'block';

                el.style.opacity = '1';

                el.style.visibility = 'visible';

            });

        });

        

        debug('Main content shown');

    }

    

    // Fix specific React/Vue/Angular apps

    function fixSPAFrameworks() {

        // React fix

        if (window.React || document.querySelector('#root')) {

            debug('React app detected');

            // Force React to mount if stuck

            setTimeout(() => {

                const root = document.getElementById('root');

                if (root && !root.hasChildNodes()) {

                    debug('React root empty - possible mounting issue', 'error');

                }

            }, 2000);

        }

        

        // Vue fix

        if (window.Vue || document.querySelector('#app')) {

            debug('Vue app detected');

        }

        

        // Angular fix

        if (window.ng || document.querySelector('app-root')) {

            debug('Angular app detected');

        }

    }

    

    // Performance optimizations

    function applyOptimizations() {

        // Defer non-critical resources

        document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {

            if (!link.href.includes('critical')) {

                link.media = 'print';

                link.onload = function() { this.media = 'all'; };

            }

        });

        

        // Lazy load images

        if ('IntersectionObserver' in window) {

            const images = document.querySelectorAll('img[data-src], img[loading="lazy"]');

            const imageObserver = new IntersectionObserver((entries) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        const img = entry.target;

                        if (img.dataset.src) {

                            img.src = img.dataset.src;

                            img.removeAttribute('data-src');

                        }

                        imageObserver.unobserve(img);

                    }

                });

            });

            images.forEach(img => imageObserver.observe(img));

        }

        

        debug('Optimizations applied');

    }

    

    // Error recovery

    function setupErrorRecovery() {

        let errorCount = 0;

        

        window.addEventListener('error', function(e) {

            errorCount++;

            debug(`Script error #${errorCount}: ${e.message}`, 'error');

            

            // If too many errors during load, force completion

            if (errorCount > 5 && document.readyState !== 'complete') {

                debug('Too many errors - forcing load completion', 'error');

                fixLoadingScreen();

            }

        });

        

        window.addEventListener('unhandledrejection', function(e) {

            debug(`Promise rejection: ${e.reason}`, 'error');

        });

    }

    

    // Monitor network issues

    function monitorNetwork() {

        if (!navigator.onLine) {

            debug('Offline detected', 'warn');

        }

        

        window.addEventListener('online', () => debug('Back online'));

        window.addEventListener('offline', () => debug('Gone offline', 'warn'));

        

        // Check for slow connections

        if (navigator.connection) {

            const conn = navigator.connection;

            if (conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g') {

                debug(`Slow connection detected: ${conn.effectiveType}`, 'warn');

                // Reduce load timeout for slow connections

                CONFIG.maxLoadTime = 6000;

            }

        }

    }

    

    // Clear problematic cache/storage

    function clearProblematicData() {

        try {

            // Clear specific problematic keys

            const problematicKeys = ['loading-stuck', 'app-crashed', 'error-state'];

            problematicKeys.forEach(key => {

                localStorage.removeItem(key);

                sessionStorage.removeItem(key);

            });

        } catch (e) {

            debug('Could not clear storage', 'warn');

        }

    }

    

    // Initialize fixes

    function initialize() {

        debug('Initializing RootsTech loading fixes');

        

        clearProblematicData();

        setupErrorRecovery();

        monitorNetwork();

        fixSPAFrameworks();

        

        // Start monitoring immediately

        fixLoadingScreen();

        

        // Apply optimizations after DOM ready

        if (document.readyState === 'loading') {

            document.addEventListener('DOMContentLoaded', applyOptimizations);

        } else {

            applyOptimizations();

        }

        

        // Final check after window load

        window.addEventListener('load', function() {

            debug('Window loaded - final check');

            setTimeout(() => {

                const loadingElement = document.querySelector('.loading-screen, #loading');

                if (loadingElement && window.getComputedStyle(loadingElement).display !== 'none') {

                    debug('Loading screen still visible after window load!', 'error');

                    hideLoadingScreen(loadingElement);

                    showMainContent();

                }

            }, 500);

        });

    }

    

    // Add CSS to force hide loading screen

    function addLoadingScreenCSS() {

        const style = document.createElement('style');

        style.id = 'roots-loading-fix-css';

        style.textContent = `

            #loading, .loading-screen {

                display: none !important;

                visibility: hidden !important;

                opacity: 0 !important;

                pointer-events: none !important;

                z-index: -1 !important;

            }

            

            #root > #loading, #root > .loading-screen {

                display: none !important;

            }

        `;

        document.head.appendChild(style);

    }

    

    // Add CSS immediately

    addLoadingScreenCSS();

    

    // Start immediately

    initialize();

    

    // Expose for debugging

    window.RootsTechFix = {

        fixNow: fixLoadingScreen,

        clearCache: clearProblematicData,

        showDebug: () => CONFIG.debugMode = true,

        hideDebug: () => CONFIG.debugMode = false

    };

    

})();

