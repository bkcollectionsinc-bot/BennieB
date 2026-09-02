//  COOKIE & GA4 MANAGEMENT 

    // ------------------- COOKIE CONSENT LOGIC -------------------
    (function() {
        const COOKIE_CONSENT_KEY = 'Bennieb_consent';
        let consentGiven = false;
        let consentDeclined = false;
        
        // Check if consent already stored
        const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (stored === 'accepted') {
            consentGiven = true;
        } else if (stored === 'declined') {
            consentDeclined = true;
        }
        
        const banner = document.getElementById('cookieBanner');
        const acceptBtn = document.getElementById('acceptCookies');
        const declineBtn = document.getElementById('declineCookies');
        
        function setConsent(status) {
            localStorage.setItem(COOKIE_CONSENT_KEY, status);
            if (status === 'accepted') {
                consentGiven = true;
                consentDeclined = false;
                // Load GA4 and enable tracking
                loadGA4AndEnableTracking();
            } else {
                consentGiven = false;
                consentDeclined = true;
                // Disable tracking, remove any existing gtag? not needed.
                if (window.gtag) {
                    // we can still keep but not send? better to not load.
                }
            }
            banner.style.display = 'none';
        }
        
        // Function to load GA4 script dynamically
        function loadGA4AndEnableTracking() {
            // Only load once
            if (document.getElementById('ga4-script')) return;
            console.log('[Consent] Loading Google Analytics 4...');
            const script = document.createElement('script');
            script.id = 'ga4-script';
            script.async = true;
            script.src = 'https://www.googletagmanager.com/gtag/js?id=G-Y773JVC6RS'; // Replace with your ID
            document.head.appendChild(script);
            
            // Initialize gtag after script loads
            script.onload = function() {
                window.dataLayer = window.dataLayer || [];
                function gtag(){ dataLayer.push(arguments); }
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', 'G-Y773JVC6RS'); // Replace with your ID
                console.log('[GA4] Initialized with consent.');
                // Track a basic event to test
                gtag('event', 'page_view');
            };
            // Also define a fallback if script fails
            setTimeout(function() {
                if (!window.gtag) {
                    console.warn('[GA4] Could not load, retry later?');
                }
            }, 3000);
        }
        
        // If consent already accepted, load GA4 immediately
        if (consentGiven) {
            loadGA4AndEnableTracking();
            banner.style.display = 'none';
        } else if (consentDeclined) {
            banner.style.display = 'none';
        } else {
            // Show banner
            banner.style.display = 'flex';
        }
        
        // Accept
        acceptBtn.addEventListener('click', function() {
            setConsent('accepted');
        });
        declineBtn.addEventListener('click', function() {
            setConsent('declined');
        });
        
        // Expose a helper for later tracking (only if consent given)
        window.trackEcommerceEvent = function(eventName, ecommerceData) {
            if (window.gtag && consentGiven) {
                window.gtag('event', eventName, ecommerceData);
                console.log(`[GA4] ${eventName} tracked:`, ecommerceData);
            } else {
                console.log(`[GA4] Not tracked (consent: ${consentGiven ? 'yes' : 'no'}): ${eventName}`, ecommerceData);
            }
        };
        
        // Expose consent status for debugging
        window.isConsentGiven = function() { return consentGiven; };
    })();