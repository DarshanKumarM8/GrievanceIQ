export interface PageSEO {
  description?: string
  keywords?: string
  ogImage?: string
  canonical?: string
  structuredData?: object
}

export function layout(title: string, content: string, activePage: string = '', seo: PageSEO = {}): string {
  const desc = seo.description || "File Smarter. Get Heard. Hold Them Accountable. India's citizen-facing grievance intelligence platform powered by AI."
  const keywords = seo.keywords || 'grievance, complaint, CPGRAMS, India, RTI, AI, citizen, government, accountability'
  const ogImage = seo.ogImage || ''
  const canonical = seo.canonical || ''
  const structuredData = seo.structuredData ? '<script type="application/ld+json">' + JSON.stringify(seo.structuredData) + '</script>' : ''

  return `<!DOCTYPE html>
<html lang="en" class="">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — GrievanceIQ</title>
  <meta name="description" content="${desc}">
  <meta name="keywords" content="${keywords}">
  <meta name="author" content="GrievanceIQ">
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="#1a365d">

  <!-- Open Graph -->
  <meta property="og:title" content="${title} — GrievanceIQ">
  <meta property="og:description" content="${desc}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="GrievanceIQ">
  ${ogImage ? '<meta property="og:image" content="' + ogImage + '">' : ''}
  ${canonical ? '<link rel="canonical" href="' + canonical + '">' : ''}

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title} — GrievanceIQ">
  <meta name="twitter:description" content="${desc}">

  ${structuredData}
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            saffron: { 50: '#fff8f0', 100: '#fff0db', 200: '#ffe0b5', 300: '#ffcb85', 400: '#ffad52', 500: '#ff9933', 600: '#f07800', 700: '#c25e00', 800: '#9a4a00', 900: '#7a3b00' },
            navy: { 50: '#f0f4ff', 100: '#dce4f5', 200: '#b8c9eb', 300: '#8da8db', 400: '#6384c4', 500: '#3f64a8', 600: '#1a365d', 700: '#152d4f', 800: '#102340', 900: '#0b1a33' },
            ashoka: { 50: '#f0f9f0', 100: '#d8f0d8', 200: '#b0e0b0', 300: '#80cc80', 400: '#4db84d', 500: '#138808', 600: '#0f6e06', 700: '#0b5605', 800: '#084004', 900: '#052c03' },
            dark: { 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a', 950: '#020617' }
          },
          fontFamily: {
            display: ['Inter', 'system-ui', 'sans-serif'],
            body: ['Inter', 'system-ui', 'sans-serif']
          },
          animation: {
            'fade-in': 'fadeIn 0.6s ease-out',
            'slide-up': 'slideUp 0.5s ease-out',
            'pulse-slow': 'pulse 3s infinite',
            'count-up': 'fadeIn 0.3s ease-out'
          },
          keyframes: {
            fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
            slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } }
          }
        }
      }
    }
  </script>
  <!-- Dark mode: apply saved preference before paint to prevent flash -->
  <script>
    (function(){
      const t=localStorage.getItem('giq_theme');
      if(t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme:dark)').matches)){
        document.documentElement.classList.add('dark');
      }
    })();
  </script>
  
  <!-- Performance: DNS Prefetch & Preconnect (Week 7) -->
  <link rel="dns-prefetch" href="https://cdn.tailwindcss.com">
  <link rel="dns-prefetch" href="https://cdn.jsdelivr.net">
  <link rel="dns-prefetch" href="https://unpkg.com">
  <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  
  <!-- Google Fonts (optimized: display swap) -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  
  <!-- Font Awesome -->
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css" rel="stylesheet">
  
  <!-- Leaflet CSS (for map pages) -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  
  <!-- Prefetch critical API (Week 7) -->
  <link rel="prefetch" href="/api/health" as="fetch" crossorigin>
  
  <style>
    * { font-family: 'Inter', system-ui, sans-serif; }
    
    /* Smooth scrolling */
    html { scroll-behavior: smooth; }
    
    /* Custom scrollbar */
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #f1f5f9; }
    ::-webkit-scrollbar-thumb { background: #94a3b8; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #64748b; }
    .dark ::-webkit-scrollbar-track { background: #1e293b; }
    .dark ::-webkit-scrollbar-thumb { background: #475569; }
    .dark ::-webkit-scrollbar-thumb:hover { background: #64748b; }
    
    /* Gradient text */
    .gradient-text {
      background: linear-gradient(135deg, #ff9933 0%, #1a365d 50%, #138808 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    /* Hero gradient */
    .hero-gradient {
      background: linear-gradient(135deg, #0b1a33 0%, #1a365d 40%, #152d4f 70%, #102340 100%);
    }
    
    /* Card hover effects */
    .card-hover {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .card-hover:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
    }
    
    /* Stat card glow */
    .stat-glow {
      position: relative;
    }
    .stat-glow::before {
      content: '';
      position: absolute;
      inset: -1px;
      border-radius: inherit;
      background: linear-gradient(135deg, #ff993340, #1a365d40, #13880840);
      z-index: -1;
      opacity: 0;
      transition: opacity 0.3s;
    }
    .stat-glow:hover::before { opacity: 1; }
    
    /* Quality gauge */
    .quality-gauge {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: conic-gradient(
        var(--gauge-color) var(--gauge-percent),
        #e2e8f0 var(--gauge-percent)
      );
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .quality-gauge-inner {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .dark .quality-gauge-inner { background: #1e293b; }
    .dark .quality-gauge { background: conic-gradient(var(--gauge-color) var(--gauge-percent), #334155 var(--gauge-percent)); }
    
    /* Navigation active */
    .nav-active {
      color: #ff9933;
      border-bottom: 2px solid #ff9933;
    }
    
    /* Severity badges */
    .badge-critical { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
    .badge-high { background: #fff3cd; color: #856404; border: 1px solid #ffc107; }
    .badge-medium { background: #d4edda; color: #155724; border: 1px solid #28a745; }
    .badge-low { background: #e2e3e5; color: #383d41; border: 1px solid #6c757d; }
    .dark .badge-critical { background: #450a0a; color: #fca5a5; border-color: #7f1d1d; }
    .dark .badge-high { background: #451a03; color: #fcd34d; border-color: #78350f; }
    .dark .badge-medium { background: #052e16; color: #86efac; border-color: #14532d; }
    .dark .badge-low { background: #1e293b; color: #94a3b8; border-color: #334155; }
    
    /* Pulse dot */
    .pulse-dot {
      width: 8px; height: 8px; border-radius: 50%;
      animation: pulse-dot 2s infinite;
    }
    @keyframes pulse-dot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.5); }
    }
    
    /* Mobile menu */
    .mobile-menu { 
      transform: translateX(-100%);
      transition: transform 0.3s ease;
    }
    .mobile-menu.open { transform: translateX(0); }

    /* A11y: Focus styles */
    :focus-visible {
      outline: 3px solid #ff9933;
      outline-offset: 2px;
      border-radius: 4px;
    }
    .sr-only {
      position: absolute; width: 1px; height: 1px;
      padding: 0; margin: -1px; overflow: hidden;
      clip: rect(0,0,0,0); white-space: nowrap; border: 0;
    }
    /* High contrast mode support */
    @media (prefers-contrast: high) {
      .card-hover { border: 2px solid currentColor; }
      .badge-critical, .badge-high, .badge-medium, .badge-low { border-width: 2px; font-weight: 700; }
      .quality-gauge { border: 2px solid currentColor; }
    }
    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
      .pulse-dot { animation: none; }
    }
    
    /* Loading spinner */
    .spinner {
      border: 3px solid #e2e8f0;
      border-top: 3px solid #ff9933;
      border-radius: 50%;
      width: 24px; height: 24px;
      animation: spin 0.8s linear infinite;
    }
    .dark .spinner { border-color: #334155; border-top-color: #ff9933; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ============================================ */
    /* DARK MODE OVERRIDES                         */
    /* ============================================ */
    .dark body, html.dark body { background-color: #0f172a; color: #e2e8f0; }
    .dark .bg-gray-50 { background-color: #0f172a !important; }
    .dark .bg-gray-100 { background-color: #1e293b !important; }
    .dark .bg-white { background-color: #1e293b !important; }
    .dark .bg-white\/95 { background-color: rgba(30,41,59,0.97) !important; }
    .dark .border-gray-200, .dark .border-gray-100 { border-color: #334155 !important; }
    .dark .border-gray-300 { border-color: #475569 !important; }
    .dark .text-gray-900 { color: #f1f5f9 !important; }
    .dark .text-gray-800 { color: #e2e8f0 !important; }
    .dark .text-gray-700 { color: #cbd5e1 !important; }
    .dark .text-gray-600 { color: #94a3b8 !important; }
    .dark .text-gray-500 { color: #64748b !important; }
    .dark .text-gray-400 { color: #64748b !important; }
    .dark .shadow-sm { box-shadow: 0 1px 2px rgba(0,0,0,0.3) !important; }
    .dark .shadow-lg { box-shadow: 0 10px 15px rgba(0,0,0,0.4) !important; }
    .dark .shadow-xl { box-shadow: 0 20px 25px rgba(0,0,0,0.5) !important; }
    .dark input, .dark textarea, .dark select {
      background-color: #0f172a !important; color: #e2e8f0 !important;
      border-color: #334155 !important;
    }
    .dark input::placeholder, .dark textarea::placeholder { color: #475569 !important; }
    .dark .hover\:bg-gray-100:hover { background-color: #334155 !important; }
    .dark .hover\:bg-gray-50:hover { background-color: #1e293b !important; }
    .dark .hover\:bg-saffron-50:hover { background-color: rgba(255,153,51,0.1) !important; }
    .dark .bg-gradient-to-b.from-navy-900 { background: linear-gradient(to bottom, #020617, #0f172a) !important; }
    .dark .bg-gradient-to-r.from-gray-50 { background: linear-gradient(to right, #1e293b, #0f172a) !important; }
    .dark .card-hover:hover { box-shadow: 0 20px 25px rgba(0,0,0,0.5); }
    .dark .bg-navy-50, .dark .bg-blue-50, .dark .bg-saffron-50, .dark .bg-ashoka-50, .dark .bg-purple-50, .dark .bg-red-50, .dark .bg-amber-50 { background-color: rgba(255,255,255,0.05) !important; }
    .dark .bg-navy-100, .dark .bg-blue-100, .dark .bg-saffron-100, .dark .bg-ashoka-100, .dark .bg-purple-100, .dark .bg-red-100, .dark .bg-amber-100 { background-color: rgba(255,255,255,0.08) !important; }
    .dark .ring-1 { --tw-ring-color: #334155; }
    
    /* Typing animation */
    .typing-cursor::after {
      content: '|';
      animation: blink 1s infinite;
    }
    @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
    
    /* Toast notification */
    .toast {
      animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s;
    }
    @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes fadeOut { to { opacity: 0; } }
  </style>
</head>
<body class="bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-dark-200 min-h-screen flex flex-col transition-colors duration-200">
  <!-- A11y: Skip to main content link -->
  <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-saffron-500 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold focus:shadow-lg" tabindex="0">
    Skip to main content
  </a>
  <!-- A11y: Live announcements region -->
  <div id="a11y-announce" class="sr-only" aria-live="polite" aria-atomic="true"></div>

  <!-- ============================================ -->
  <!-- NAVIGATION -->
  <!-- ============================================ -->
  <nav class="bg-white/95 dark:bg-dark-900/95 backdrop-blur-md border-b border-gray-200 dark:border-dark-700 sticky top-0 z-50 shadow-sm" role="navigation" aria-label="Main navigation">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <a href="/" class="flex items-center gap-2.5 group">
          <div class="w-9 h-9 bg-gradient-to-br from-saffron-500 to-navy-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
            <i class="fas fa-balance-scale text-white text-sm"></i>
          </div>
          <div>
            <span class="text-xl font-bold text-navy-800 dark:text-white tracking-tight">Grievance</span><span class="text-xl font-bold text-saffron-500">IQ</span>
            <p class="text-[10px] text-gray-500 dark:text-gray-400 -mt-1 hidden sm:block tracking-wide">FILE SMARTER. GET HEARD.</p>
          </div>
        </a>
        
        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-1">
          <a href="/" class="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-saffron-600 dark:hover:text-white transition-colors rounded-lg hover:bg-saffron-50 dark:hover:bg-white/10 ${activePage === 'home' ? 'nav-active bg-saffron-50 dark:bg-white/5' : ''}">
            <i class="fas fa-home mr-1.5"></i><span data-i18n="nav_home">Home</span>
          </a>
          <a href="/complaint" class="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-saffron-600 dark:hover:text-white transition-colors rounded-lg hover:bg-saffron-50 dark:hover:bg-white/10 ${activePage === 'complaint' ? 'nav-active bg-saffron-50 dark:bg-white/5' : ''}">
            <i class="fas fa-pen-to-square mr-1.5"></i><span data-i18n="nav_complaint">File Complaint</span>
          </a>
          <a href="/tracker" class="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-saffron-600 dark:hover:text-white transition-colors rounded-lg hover:bg-saffron-50 dark:hover:bg-white/10 ${activePage === 'tracker' ? 'nav-active bg-saffron-50 dark:bg-white/5' : ''}">
            <i class="fas fa-magnifying-glass mr-1.5"></i><span data-i18n="nav_track">Track</span>
          </a>
          <a href="/my-complaints" class="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-saffron-600 dark:hover:text-white transition-colors rounded-lg hover:bg-saffron-50 dark:hover:bg-white/10 ${activePage === 'my-complaints' ? 'nav-active bg-saffron-50 dark:bg-white/5' : ''}">
            <i class="fas fa-folder-open mr-1.5"></i><span data-i18n="nav_my_complaints">My Complaints</span>
          </a>
          <a href="/dashboard" class="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-saffron-600 dark:hover:text-white transition-colors rounded-lg hover:bg-saffron-50 dark:hover:bg-white/10 ${activePage === 'dashboard' ? 'nav-active bg-saffron-50 dark:bg-white/5' : ''}">
            <i class="fas fa-chart-line mr-1.5"></i><span data-i18n="nav_dashboard">Dashboard</span>
          </a>
          <a href="/how-it-works" class="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-saffron-600 dark:hover:text-white transition-colors rounded-lg hover:bg-saffron-50 dark:hover:bg-white/10 ${activePage === 'how-it-works' ? 'nav-active bg-saffron-50 dark:bg-white/5' : ''}">
            <i class="fas fa-circle-info mr-1.5"></i><span data-i18n="nav_how">How It Works</span>
          </a>
          <a href="/about" class="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-saffron-600 dark:hover:text-white transition-colors rounded-lg hover:bg-saffron-50 dark:hover:bg-white/10 ${activePage === 'about' ? 'nav-active bg-saffron-50 dark:bg-white/5' : ''}">
            <i class="fas fa-users mr-1.5"></i><span data-i18n="nav_about">About</span>
          </a>
        </div>
        
        <!-- CTA + Dark Mode + Language Toggle + Auth -->
        <div class="hidden md:flex items-center gap-3">
          <!-- Dark Mode Toggle -->
          <button onclick="toggleDarkMode()" id="darkModeBtn" class="text-xs p-2 rounded-lg border border-gray-200 dark:border-dark-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors" title="Toggle dark mode" aria-label="Toggle dark mode">
            <i class="fas fa-moon" id="darkModeIcon"></i>
          </button>
          <div class="relative" id="langPickerWrap">
            <button onclick="toggleLangDropdown(event)" id="langToggleBtn" class="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-dark-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 font-medium transition-colors" title="Switch language" aria-haspopup="listbox" aria-expanded="false">
              <i class="fas fa-globe mr-1"></i><span id="langToggleLabel">English</span> <i class="fas fa-caret-down ml-0.5 text-[10px]"></i>
            </button>
            <div id="langDropdown" class="hidden absolute right-0 mt-1 w-40 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-xl shadow-xl z-50 overflow-hidden text-gray-700 dark:text-gray-200" role="listbox" aria-label="Select language">
              <button onclick="setLang('en')" class="w-full text-left px-3 py-2 text-xs hover:bg-saffron-50 dark:hover:bg-dark-700 hover:text-saffron-700 dark:hover:text-saffron-400 transition-colors flex items-center justify-between" role="option"><span>🇬🇧 English</span></button>
              <button onclick="setLang('hi')" class="w-full text-left px-3 py-2 text-xs hover:bg-saffron-50 hover:text-saffron-700 transition-colors flex items-center justify-between" role="option"><span>🇮🇳 हिन्दी</span></button>
              <button onclick="setLang('ta')" class="w-full text-left px-3 py-2 text-xs hover:bg-saffron-50 hover:text-saffron-700 transition-colors flex items-center justify-between" role="option"><span>🇮🇳 தமிழ்</span></button>
              <button onclick="setLang('te')" class="w-full text-left px-3 py-2 text-xs hover:bg-saffron-50 hover:text-saffron-700 transition-colors flex items-center justify-between" role="option"><span>🇮🇳 తెలుగు</span></button>
              <button onclick="setLang('bn')" class="w-full text-left px-3 py-2 text-xs hover:bg-saffron-50 hover:text-saffron-700 transition-colors flex items-center justify-between" role="option"><span>🇮🇳 বাংলা</span></button>
              <button onclick="setLang('mr')" class="w-full text-left px-3 py-2 text-xs hover:bg-saffron-50 hover:text-saffron-700 transition-colors flex items-center justify-between" role="option"><span>🇮🇳 मराठी</span></button>
              <button onclick="setLang('kn')" class="w-full text-left px-3 py-2 text-xs hover:bg-saffron-50 hover:text-saffron-700 transition-colors flex items-center justify-between" role="option"><span>🇮🇳 ಕನ್ನಡ</span></button>
            </div>
          </div>
          <!-- Notification Bell (visible when logged in) -->
          <div id="navNotifWrap" class="hidden relative">
            <button onclick="toggleNotifPanel(event)" id="notifBellBtn" class="relative text-xs p-2 rounded-lg border border-gray-200 dark:border-dark-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors" title="Notifications" aria-label="Notifications" aria-haspopup="true" aria-expanded="false">
              <i class="fas fa-bell"></i>
              <span id="notifBadge" class="hidden absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">0</span>
            </button>
            <div id="notifPanel" class="hidden absolute right-0 mt-2 w-80 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-2xl shadow-2xl z-50 overflow-hidden">
              <div class="px-4 py-3 bg-gradient-to-r from-navy-600 to-navy-700 flex items-center justify-between">
                <span class="text-white text-xs font-bold"><i class="fas fa-bell mr-1.5"></i>Notifications</span>
                <button onclick="markAllNotifRead()" class="text-white/70 hover:text-white text-[10px] transition-colors">Mark all read</button>
              </div>
              <div id="notifList" class="max-h-72 overflow-y-auto">
                <div class="p-4 text-center text-xs text-gray-400"><i class="fas fa-inbox text-lg mb-1 block"></i>No notifications</div>
              </div>
            </div>
          </div>
          <!-- Auth state: Guest -->
          <div id="navGuest" class="flex items-center gap-2">
            <a href="/login" class="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-dark-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 font-medium transition-colors">
              <i class="fas fa-sign-in-alt mr-1"></i>Sign In
            </a>
          </div>
          <!-- Auth state: Logged in -->
          <div id="navUser" class="hidden flex items-center gap-2">
            <a href="/profile" class="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-dark-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 font-medium transition-colors">
              <i class="fas fa-user-circle text-saffron-500"></i><span id="navUserName">Account</span>
            </a>
          </div>
          <a href="/complaint" class="bg-gradient-to-r from-saffron-500 to-saffron-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:from-saffron-600 hover:to-saffron-700 transition-all shadow-md hover:shadow-lg">
            <span data-i18n="nav_file_cta">File a Complaint</span> <i class="fas fa-arrow-right ml-1.5"></i>
          </a>
        </div>
        
        <!-- Mobile menu button -->
        <button onclick="toggleMobileMenu()" class="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10">
          <i class="fas fa-bars text-xl" id="menuIcon"></i>
        </button>
      </div>
    </div>
    
    <!-- Mobile Navigation -->
    <div id="mobileMenu" class="mobile-menu fixed inset-0 bg-white dark:bg-dark-900 z-50 md:hidden">
      <div class="p-4">
        <div class="flex justify-between items-center mb-8">
          <a href="/" class="flex items-center gap-2">
            <div class="w-8 h-8 bg-gradient-to-br from-saffron-500 to-navy-600 rounded-lg flex items-center justify-center">
              <i class="fas fa-balance-scale text-white text-sm"></i>
            </div>
            <span class="text-lg font-bold text-navy-700">Grievance</span><span class="text-lg font-bold text-saffron-500">IQ</span>
          </a>
          <button onclick="toggleMobileMenu()" class="p-2 rounded-lg text-gray-600 hover:bg-gray-100">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <div class="space-y-2">
          <a href="/" class="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-saffron-50 dark:hover:bg-dark-700 hover:text-saffron-600 transition-colors">
            <i class="fas fa-home w-5"></i> <span data-i18n="nav_home">Home</span>
          </a>
          <a href="/complaint" class="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-saffron-50 dark:hover:bg-dark-700 hover:text-saffron-600 transition-colors">
            <i class="fas fa-pen-to-square w-5"></i> <span data-i18n="nav_complaint">File a Complaint</span>
          </a>
          <a href="/tracker" class="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-saffron-50 dark:hover:bg-dark-700 hover:text-saffron-600 transition-colors">
            <i class="fas fa-magnifying-glass w-5"></i> <span data-i18n="nav_track">Track Complaint</span>
          </a>
          <a href="/dashboard" class="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-saffron-50 dark:hover:bg-dark-700 hover:text-saffron-600 transition-colors">
            <i class="fas fa-chart-line w-5"></i> <span data-i18n="nav_dashboard">Public Dashboard</span>
          </a>
          <a href="/my-complaints" class="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-saffron-50 dark:hover:bg-dark-700 hover:text-saffron-600 transition-colors">
            <i class="fas fa-folder-open w-5"></i> <span data-i18n="nav_my_complaints">My Complaints</span>
          </a>
          <a href="/how-it-works" class="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-saffron-50 dark:hover:bg-dark-700 hover:text-saffron-600 transition-colors">
            <i class="fas fa-circle-info w-5"></i> <span data-i18n="nav_how">How It Works</span>
          </a>
          <a href="/about" class="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-saffron-50 dark:hover:bg-dark-700 hover:text-saffron-600 transition-colors">
            <i class="fas fa-users w-5"></i> <span data-i18n="nav_about">About Us</span>
          </a>
          <div class="pt-4 mt-4 border-t border-gray-200 dark:border-dark-700 space-y-2">
            <button onclick="toggleDarkMode()" class="w-full flex items-center justify-center gap-2 px-4 py-3 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-saffron-50 dark:hover:bg-dark-700 hover:text-saffron-600 transition-colors">
              <i class="fas fa-moon w-5" id="mobileDarkModeIcon"></i> <span id="mobileDarkModeLabel">Dark Mode</span>
            </button>
            <div id="mobileGuest">
              <a href="/login" class="block text-center bg-navy-600 text-white px-6 py-3 rounded-xl font-semibold">
                <i class="fas fa-sign-in-alt mr-2"></i>Sign In
              </a>
            </div>
            <div id="mobileUser" class="hidden space-y-2">
              <a href="/profile" class="block text-center bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-xl font-semibold">
                <i class="fas fa-user-circle mr-2"></i><span id="mobileUserName">My Profile</span>
              </a>
            </div>
            <a href="/complaint" class="block text-center bg-gradient-to-r from-saffron-500 to-saffron-600 text-white px-6 py-3 rounded-xl font-semibold">
              <span data-i18n="nav_file_cta">File a Complaint</span> <i class="fas fa-arrow-right ml-2"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <!-- ============================================ -->
  <!-- MAIN CONTENT -->
  <!-- ============================================ -->
  <main id="main-content" class="flex-1" role="main" tabindex="-1">
    ${content}
  </main>

  <!-- ============================================ -->
  <!-- FOOTER -->
  <!-- ============================================ -->
  <footer class="bg-navy-800 text-white mt-auto" role="contentinfo">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand -->
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 bg-gradient-to-br from-saffron-500 to-saffron-600 rounded-lg flex items-center justify-center">
              <i class="fas fa-balance-scale text-white text-sm"></i>
            </div>
            <span class="text-xl font-bold">Grievance</span><span class="text-xl font-bold text-saffron-400">IQ</span>
          </div>
          <p class="text-gray-400 text-sm leading-relaxed max-w-md">
            The intelligence layer between citizens and India's grievance system. 
            We help you file smarter complaints, track their progress, and hold departments accountable.
          </p>
          <p class="text-gray-500 text-xs mt-4">
            <i class="fas fa-shield-halved mr-1"></i> 
            GrievanceIQ does not file complaints on your behalf. We generate documents and analysis that you review and file yourself.
          </p>
        </div>
        
        <!-- Quick Links -->
        <div>
          <h4 class="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">Citizen Tools</h4>
          <div class="space-y-2">
            <a href="/complaint" class="block text-gray-300 hover:text-saffron-400 text-sm transition-colors">Smart Complaint Builder</a>
            <a href="/tracker" class="block text-gray-300 hover:text-saffron-400 text-sm transition-colors">Complaint Tracker</a>
            <a href="/rti" class="block text-gray-300 hover:text-saffron-400 text-sm transition-colors">RTI Auto-Drafter</a>
            <a href="/how-it-works" class="block text-gray-300 hover:text-saffron-400 text-sm transition-colors">How It Works</a>
          </div>
        </div>
        
        <!-- Dashboard -->
        <div>
          <h4 class="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">Public Dashboard</h4>
          <div class="space-y-2">
            <a href="/dashboard" class="block text-gray-300 hover:text-saffron-400 text-sm transition-colors">India Grievance Map</a>
            <a href="/dashboard#scorecard" class="block text-gray-300 hover:text-saffron-400 text-sm transition-colors">Department Scorecards</a>
            <a href="/dashboard#trending" class="block text-gray-300 hover:text-saffron-400 text-sm transition-colors">Trending Issues</a>
            <a href="/about" class="block text-gray-300 hover:text-saffron-400 text-sm transition-colors">About Us</a>
          </div>
        </div>
      </div>
      
      <!-- Bottom -->
      <div class="border-t border-gray-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p class="text-gray-500 text-xs">
          &copy; ${new Date().getFullYear()} GrievanceIQ. Built for India's citizens. Open source civic tech.
        </p>
        <div class="flex items-center gap-3">
          <span class="inline-flex items-center gap-1.5 text-xs text-gray-500">
            <span class="w-2 h-2 rounded-full bg-ashoka-500 pulse-dot"></span>
            All systems operational
          </span>
        </div>
      </div>
    </div>
  </footer>

  <!-- ============================================ -->
  <!-- SCRIPTS -->
  <!-- ============================================ -->
  <!-- Leaflet JS -->
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <!-- Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <!-- jsPDF for RTI download -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  
  <script>
    // Mobile menu toggle
    function toggleMobileMenu() {
      const menu = document.getElementById('mobileMenu');
      menu.classList.toggle('open');
    }

    // ============================================
    // DARK MODE TOGGLE
    // ============================================
    function toggleDarkMode() {
      const html = document.documentElement;
      const isDark = html.classList.toggle('dark');
      localStorage.setItem('giq_theme', isDark ? 'dark' : 'light');
      updateDarkModeUI(isDark);
      // Update meta theme-color
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.content = isDark ? '#0f172a' : '#1a365d';
      // Announce for a11y
      const announce = document.getElementById('a11y-announce');
      if (announce) announce.textContent = isDark ? 'Dark mode enabled' : 'Light mode enabled';
      // Update Chart.js colors if any charts exist
      if (window.Chart) {
        Chart.defaults.color = isDark ? '#94a3b8' : '#666';
        Chart.defaults.borderColor = isDark ? '#334155' : '#e5e7eb';
        // Re-render any existing charts
        Object.values(Chart.instances || {}).forEach(chart => { try { chart.update(); } catch(e){} });
      }
    }

    function updateDarkModeUI(isDark) {
      const icon = document.getElementById('darkModeIcon');
      const mIcon = document.getElementById('mobileDarkModeIcon');
      const mLabel = document.getElementById('mobileDarkModeLabel');
      if (icon) icon.className = isDark ? 'fas fa-sun text-saffron-400' : 'fas fa-moon';
      if (mIcon) mIcon.className = isDark ? 'fas fa-sun text-saffron-400 w-5' : 'fas fa-moon w-5';
      if (mLabel) mLabel.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    }

    // Apply on load
    (function initDarkMode() {
      const isDark = document.documentElement.classList.contains('dark');
      updateDarkModeUI(isDark);
      // Listen for system preference changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('giq_theme')) {
          document.documentElement.classList.toggle('dark', e.matches);
          updateDarkModeUI(e.matches);
        }
      });
      // Update Chart.js defaults for dark mode
      if (isDark && window.Chart) {
        Chart.defaults.color = '#94a3b8';
        Chart.defaults.borderColor = '#334155';
      }
    })();
    
    // Animate numbers on scroll
    function animateCountUp(element, target, duration = 1500) {
      const start = 0;
      const startTime = performance.now();
      
      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * eased);
        
        element.textContent = current.toLocaleString('en-IN');
        
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    }
    
    // Intersection observer for animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-up');
          
          // Count up animation for stat numbers
          if (entry.target.dataset.countTarget) {
            animateCountUp(entry.target, parseInt(entry.target.dataset.countTarget));
          }
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    // Observe all animated elements
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
      document.querySelectorAll('[data-count-target]').forEach(el => observer.observe(el));
    });

    // Toast notification
    function showToast(message, type = 'success') {
      const toast = document.createElement('div');
      const colors = { success: 'bg-ashoka-500', error: 'bg-red-500', info: 'bg-navy-600', warning: 'bg-saffron-500' };
      toast.className = \`toast fixed top-20 right-4 \${colors[type]} text-white px-6 py-3 rounded-lg shadow-xl z-50 text-sm font-medium\`;
      toast.textContent = message;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }

    // ============================================
    // MULTI-LANGUAGE i18n — 7 Indian Languages
    // ============================================
    const i18n = {
      en: {
        nav_home: 'Home', nav_complaint: 'File Complaint', nav_track: 'Track',
        nav_my_complaints: 'My Complaints', nav_dashboard: 'Dashboard', nav_how: 'How It Works',
        nav_about: 'About', nav_file_cta: 'File a Complaint', nav_admin: 'Admin',
        complaint_title: 'Smart Complaint Builder',
        complaint_subtitle: 'Type your problem in any language. Our AI identifies the right department, scores your complaint, and rewrites it for maximum impact.',
        step1_title: 'Step 1: Describe Your Problem',
        analyze_btn: 'Analyze My Complaint',
        tracker_title: 'Complaint Tracker',
        tracker_subtitle: 'Enter your CPGRAMS complaint ID to track progress, get Day 15/25 countdown reminders, and report outcomes.',
        my_complaints_title: 'My Complaints',
        my_complaints_subtitle: 'Track all your analyzed complaints, their status, and filing progress in one place.',
        dashboard_title: 'Public Accountability Dashboard',
        dashboard_subtitle: 'Real-time grievance analytics across India — powered by citizen data and AI transparency.',
        rti_title: 'RTI Auto-Drafter',
        rti_subtitle: 'Generate legally-accurate Right to Information applications instantly.',
        about_title: 'About GrievanceIQ',
        footer_tagline: "The intelligence layer between citizens and India's grievance system.",
        footer_tools: 'Citizen Tools', footer_dashboard: 'Public Dashboard',
        hero_badge: "INDIA'S CITIZEN GRIEVANCE INTELLIGENCE PLATFORM",
        hero_h1_1: 'File', hero_h1_2: 'Smarter.', hero_h1_3: 'Get', hero_h1_4: 'Heard.',
        hero_h1_5: 'Hold Them', hero_h1_6: 'Accountable.',
        hero_sub: 'Type your problem in plain language. Our AI identifies the right department, strengthens your complaint, and gives you the tools to follow up.',
        login_title: 'Sign In to GrievanceIQ',
        profile_title: 'My Profile',
        search_placeholder: 'Search complaints...',
        export_pdf: 'Export PDF',
        loading: 'Loading...',
        no_results: 'No results found',
        status_draft: 'Draft', status_filed: 'Filed', status_pending: 'Pending',
        status_resolved: 'Resolved', status_fake_closed: 'Fake Closed', status_escalated: 'Escalated',
        lang_name: 'English',
        table_hash: '#',
        table_district: 'District',
        table_complaints: 'Complaints',
        table_resolution: 'Resolution',
        table_fake_closure: 'Fake Closure',
        table_satisfaction: 'Satisfaction',
        table_avg_days: 'Avg Days',
        table_trend: 'Trend',
        table_ministry: 'Ministry',
        table_received: 'Received',
        table_official_rate: 'Official Rate',
        table_citizen_rate: 'Citizen Rate',
        table_flag: 'Flag',
        chart_national_trend: 'National Complaints — Monthly Trend',
        chart_sat_vs_fake: 'Satisfaction vs Fake Closure Trend',
        chart_top10: 'Top 10 Ministries — Complaint Volume',
        chart_dist: 'Resolution Status Distribution',
        chart_offenders: 'Fake Closure Rate — Top Offenders',
        chart_avg_res: 'Average Resolution Days',
        funnel_title: 'Resolution Funnel — National Pipeline',
        funnel_sub: 'Complaint Journey: Filing to Resolution',
        heatmap_title: 'Complaint Activity Heatmap — 12 Months',
        heatmap_sub: 'Daily Complaint Volume Heatmap',
        heatmap_less: 'Less',
        heatmap_more: 'More',
        network_title: 'Department Interaction Network',
        network_sub: 'Inter-Ministry Complaint Transfer Network — Top 15',
        radar_sys_title: 'Systemic Issue Radar',
        social_feed_title: 'Social Monitoring Feed',
        table_hash: '#',
        table_district: 'District',
        table_complaints: 'Complaints',
        table_resolution: 'Resolution',
        table_fake_closure: 'Fake Closure',
        table_satisfaction: 'Satisfaction',
        table_avg_days: 'Avg Days',
        table_trend: 'Trend',
        table_ministry: 'Ministry',
        table_received: 'Received',
        table_official_rate: 'Official Rate',
        table_citizen_rate: 'Citizen Rate',
        table_flag: 'Flag',
        chart_national_trend: 'National Complaints — Monthly Trend',
        chart_sat_vs_fake: 'Satisfaction vs Fake Closure Trend',
        chart_top10: 'Top 10 Ministries — Complaint Volume',
        chart_dist: 'Resolution Status Distribution',
        chart_offenders: 'Fake Closure Rate — Top Offenders',
        chart_avg_res: 'Average Resolution Days',
        funnel_title: 'Resolution Funnel — National Pipeline',
        funnel_sub: 'Complaint Journey: Filing to Resolution',
        heatmap_title: 'Complaint Activity Heatmap — 12 Months',
        heatmap_sub: 'Daily Complaint Volume Heatmap',
        heatmap_less: 'Less',
        heatmap_more: 'More',
        network_title: 'Department Interaction Network',
        network_sub: 'Inter-Ministry Complaint Transfer Network — Top 15',
        radar_sys_title: 'Systemic Issue Radar',
        social_feed_title: 'Social Monitoring Feed',
dashboard_map_title: 'India Grievance Intelligence Map',
        dashboard_map_subtitle: 'GeoJSON + District Drill-Down',
        dashboard_map_back: 'Back to India',
        metric_total: 'Total Complaints',
        metric_resolution: 'Resolution Rate',
        metric_fake: 'Fake Closure Rate',
        metric_avg_days: 'Avg Resolution Days',
        dashboard_monthly: 'Monthly Trends — 15-Month Analysis',
        dashboard_analytics: 'Analytics Overview',
        dashboard_radar: 'Department Comparison Radar',
        dashboard_scorecard: 'Department Accountability Scorecard',
        sort_volume: 'By Volume',
        sort_fake: 'By Fake Closure Rate',
        sort_sat: 'By Citizen Satisfaction',
        sort_time: 'By Resolution Time',
        table_hash: '#',
        table_district: 'District',
        table_complaints: 'Complaints',
        table_resolution: 'Resolution',
        table_fake_closure: 'Fake Closure',
        table_satisfaction: 'Satisfaction',
        table_avg_days: 'Avg Days',
        table_trend: 'Trend',
        table_ministry: 'Ministry',
        table_received: 'Received',
        table_official_rate: 'Official Rate',
        table_citizen_rate: 'Citizen Rate',
        table_flag: 'Flag',
        chart_national_trend: 'National Complaints — Monthly Trend',
        chart_sat_vs_fake: 'Satisfaction vs Fake Closure Trend',
        chart_top10: 'Top 10 Ministries — Complaint Volume',
        chart_dist: 'Resolution Status Distribution',
        chart_offenders: 'Fake Closure Rate — Top Offenders',
        chart_avg_res: 'Average Resolution Days',
        funnel_title: 'Resolution Funnel — National Pipeline',
        funnel_sub: 'Complaint Journey: Filing to Resolution',
        heatmap_title: 'Complaint Activity Heatmap — 12 Months',
        heatmap_sub: 'Daily Complaint Volume Heatmap',
        heatmap_less: 'Less',
        heatmap_more: 'More',
        network_title: 'Department Interaction Network',
        network_sub: 'Inter-Ministry Complaint Transfer Network — Top 15',
        radar_sys_title: 'Systemic Issue Radar',
        social_feed_title: 'Social Monitoring Feed'
      },
      hi: {
        nav_home: 'होम', nav_complaint: 'शिकायत दर्ज करें', nav_track: 'ट्रैक करें',
        nav_my_complaints: 'मेरी शिकायतें', nav_dashboard: 'डैशबोर्ड', nav_how: 'कैसे काम करता है',
        nav_about: 'हमारे बारे में', nav_file_cta: 'शिकायत दर्ज करें', nav_admin: 'एडमिन',
        complaint_title: 'स्मार्ट शिकायत बिल्डर',
        complaint_subtitle: 'अपनी समस्या किसी भी भाषा में लिखें। हमारा AI सही विभाग पहचानता है, शिकायत को स्कोर करता है, और अधिकतम प्रभाव के लिए फिर से लिखता है।',
        step1_title: 'चरण 1: अपनी समस्या बताएं',
        analyze_btn: 'मेरी शिकायत का विश्लेषण करें',
        tracker_title: 'शिकायत ट्रैकर',
        tracker_subtitle: 'प्रगति ट्रैक करने, दिन 15/25 की काउंटडाउन रिमाइंडर प्राप्त करने और परिणाम रिपोर्ट करने के लिए अपना CPGRAMS शिकायत ID दर्ज करें।',
        my_complaints_title: 'मेरी शिकायतें',
        my_complaints_subtitle: 'अपनी सभी विश्लेषित शिकायतों, उनकी स्थिति और फाइलिंग प्रगति को एक ही स्थान पर ट्रैक करें।',
        dashboard_title: 'सार्वजनिक जवाबदेही डैशबोर्ड',
        dashboard_subtitle: 'भारत भर में वास्तविक समय शिकायत विश्लेषण — नागरिक डेटा और AI पारदर्शिता द्वारा संचालित।',
        rti_title: 'RTI ऑटो-ड्राफ्टर',
        rti_subtitle: 'कानूनी रूप से सटीक सूचना का अधिकार आवेदन तुरंत तैयार करें।',
        about_title: 'GrievanceIQ के बारे में',
        footer_tagline: 'नागरिकों और भारत की शिकायत प्रणाली के बीच इंटेलिजेंस परत।',
        footer_tools: 'नागरिक उपकरण', footer_dashboard: 'सार्वजनिक डैशबोर्ड',
        hero_badge: 'भारत का नागरिक शिकायत इंटेलिजेंस प्लेटफॉर्म',
        hero_h1_1: 'स्मार्ट', hero_h1_2: 'दर्ज करें।', hero_h1_3: 'सुनवाई', hero_h1_4: 'पाएं।',
        hero_h1_5: 'उन्हें', hero_h1_6: 'जवाबदेह बनाएं।',
        hero_sub: 'अपनी समस्या सामान्य भाषा में टाइप करें। हमारा AI सही विभाग पहचानता है, शिकायत मजबूत करता है, और फॉलो-अप के साधन देता है।',
        login_title: 'GrievanceIQ में साइन इन करें',
        profile_title: 'मेरी प्रोफ़ाइल',
        search_placeholder: 'शिकायतें खोजें...',
        export_pdf: 'PDF निर्यात',
        loading: 'लोड हो रहा है...',
        no_results: 'कोई परिणाम नहीं मिला',
        status_draft: 'ड्राफ्ट', status_filed: 'दर्ज', status_pending: 'लंबित',
        status_resolved: 'हल किया', status_fake_closed: 'फर्जी बंद', status_escalated: 'बढ़ाया गया',
        lang_name: 'हिन्दी',
        table_hash: '[HI] #',
        table_district: '[HI] District',
        table_complaints: '[HI] Complaints',
        table_resolution: '[HI] Resolution',
        table_fake_closure: '[HI] Fake Closure',
        table_satisfaction: '[HI] Satisfaction',
        table_avg_days: '[HI] Avg Days',
        table_trend: '[HI] Trend',
        table_ministry: '[HI] Ministry',
        table_received: '[HI] Received',
        table_official_rate: '[HI] Official Rate',
        table_citizen_rate: '[HI] Citizen Rate',
        table_flag: '[HI] Flag',
        chart_national_trend: '[HI] National Complaints — Monthly Trend',
        chart_sat_vs_fake: '[HI] Satisfaction vs Fake Closure Trend',
        chart_top10: '[HI] Top 10 Ministries — Complaint Volume',
        chart_dist: '[HI] Resolution Status Distribution',
        chart_offenders: '[HI] Fake Closure Rate — Top Offenders',
        chart_avg_res: '[HI] Average Resolution Days',
        funnel_title: '[HI] Resolution Funnel — National Pipeline',
        funnel_sub: '[HI] Complaint Journey: Filing to Resolution',
        heatmap_title: '[HI] Complaint Activity Heatmap — 12 Months',
        heatmap_sub: '[HI] Daily Complaint Volume Heatmap',
        heatmap_less: '[HI] Less',
        heatmap_more: '[HI] More',
        network_title: '[HI] Department Interaction Network',
        network_sub: '[HI] Inter-Ministry Complaint Transfer Network — Top 15',
        radar_sys_title: '[HI] Systemic Issue Radar',
        social_feed_title: '[HI] Social Monitoring Feed',
        table_hash: '[HI] #',
        table_district: '[HI] District',
        table_complaints: '[HI] Complaints',
        table_resolution: '[HI] Resolution',
        table_fake_closure: '[HI] Fake Closure',
        table_satisfaction: '[HI] Satisfaction',
        table_avg_days: '[HI] Avg Days',
        table_trend: '[HI] Trend',
        table_ministry: '[HI] Ministry',
        table_received: '[HI] Received',
        table_official_rate: '[HI] Official Rate',
        table_citizen_rate: '[HI] Citizen Rate',
        table_flag: '[HI] Flag',
        chart_national_trend: '[HI] National Complaints — Monthly Trend',
        chart_sat_vs_fake: '[HI] Satisfaction vs Fake Closure Trend',
        chart_top10: '[HI] Top 10 Ministries — Complaint Volume',
        chart_dist: '[HI] Resolution Status Distribution',
        chart_offenders: '[HI] Fake Closure Rate — Top Offenders',
        chart_avg_res: '[HI] Average Resolution Days',
        funnel_title: '[HI] Resolution Funnel — National Pipeline',
        funnel_sub: '[HI] Complaint Journey: Filing to Resolution',
        heatmap_title: '[HI] Complaint Activity Heatmap — 12 Months',
        heatmap_sub: '[HI] Daily Complaint Volume Heatmap',
        heatmap_less: '[HI] Less',
        heatmap_more: '[HI] More',
        network_title: '[HI] Department Interaction Network',
        network_sub: '[HI] Inter-Ministry Complaint Transfer Network — Top 15',
        radar_sys_title: '[HI] Systemic Issue Radar',
        social_feed_title: '[HI] Social Monitoring Feed',
dashboard_map_title: 'भारत शिकायत इंटेलिजेंस मानचित्र',
        dashboard_map_subtitle: 'जियोजेसन + जिला ड्रिल-डाउन',
        dashboard_map_back: 'भारत पर वापस जाएँ',
        metric_total: 'कुल शिकायतें',
        metric_resolution: 'समाधान दर',
        metric_fake: 'फर्जी समापन दर',
        metric_avg_days: 'औसत समाधान दिन',
        dashboard_monthly: 'मासिक रुझान - 15 महीने का विश्लेषण',
        dashboard_analytics: 'एनालिटिक्स अवलोकन',
        dashboard_radar: 'विभाग तुलना रडार',
        dashboard_scorecard: 'विभाग जवाबदेही स्कोरकार्ड',
        sort_volume: 'मात्रा के अनुसार',
        sort_fake: 'फर्जी समापन दर के अनुसार',
        sort_sat: 'नागरिक संतुष्टि के अनुसार',
        sort_time: 'समाधान समय के अनुसार',
        table_hash: '#',
        table_district: 'ज़िला',
        table_complaints: 'शिकायतें',
        table_resolution: 'समाधान',
        table_fake_closure: 'फर्जी समापन',
        table_satisfaction: 'संतुष्टि',
        table_avg_days: 'औसत दिन',
        table_trend: 'रुझान',
        table_ministry: 'मंत्रालय',
        table_received: 'प्राप्त',
        table_official_rate: 'आधिकारिक दर',
        table_citizen_rate: 'नागरिक दर',
        table_flag: 'फ्लैग',
        chart_national_trend: 'राष्ट्रीय शिकायतें — मासिक रुझान',
        chart_sat_vs_fake: 'संतुष्टि बनाम फर्जी समापन रुझान',
        chart_top10: 'शीर्ष 10 मंत्रालय — शिकायत मात्रा',
        chart_dist: 'समाधान स्थिति वितरण',
        chart_offenders: 'फर्जी समापन दर — शीर्ष अपराधी',
        chart_avg_res: 'औसत समाधान दिन',
        funnel_title: 'समाधान फ़नल — राष्ट्रीय पाइपलाइन',
        funnel_sub: 'शिकायत यात्रा: फाइलिंग से समाधान तक',
        heatmap_title: 'शिकायत गतिविधि हीटमैप — 12 महीने',
        heatmap_sub: 'दैनिक शिकायत मात्रा हीटमैप',
        heatmap_less: 'कम',
        heatmap_more: 'अधिक',
        network_title: 'विभाग इंटरैक्शन नेटवर्क',
        network_sub: 'अंतर-मंत्रालय शिकायत स्थानांतरण नेटवर्क — शीर्ष 15',
        radar_sys_title: 'प्रणालीगत समस्या रडार',
        social_feed_title: 'सोशल मॉनिटरिंग फ़ीड'
      },
      ta: {
        nav_home: 'முகப்பு', nav_complaint: 'புகார் பதிவு', nav_track: 'கண்காணி',
        nav_my_complaints: 'என் புகார்கள்', nav_dashboard: 'டாஷ்போர்டு', nav_how: 'எப்படி செயல்படுகிறது',
        nav_about: 'எங்களை பற்றி', nav_file_cta: 'புகார் பதிவு செய்', nav_admin: 'நிர்வாகம்',
        complaint_title: 'ஸ்மார்ட் புகார் பில்டர்',
        complaint_subtitle: 'உங்கள் பிரச்சனையை எந்த மொழியிலும் தட்டச்சு செய்யுங்கள். எங்கள் AI சரியான துறையை அடையாளம் காணும்.',
        step1_title: 'படி 1: உங்கள் பிரச்சனையை விவரியுங்கள்',
        analyze_btn: 'என் புகாரை பகுப்பாய்வு செய்',
        tracker_title: 'புகார் கண்காணிப்பு',
        tracker_subtitle: 'முன்னேற்றம் கண்காணிக்க உங்கள் CPGRAMS புகார் ID ஐ உள்ளிடுங்கள்.',
        my_complaints_title: 'என் புகார்கள்',
        my_complaints_subtitle: 'உங்கள் அனைத்து பகுப்பாய்வு செய்யப்பட்ட புகார்களையும் ஒரே இடத்தில் கண்காணிக்கவும்.',
        dashboard_title: 'பொது பொறுப்புணர்வு டாஷ்போர்டு',
        dashboard_subtitle: 'இந்தியா முழுவதும் நிகழ்நேர புகார் பகுப்பாய்வு.',
        rti_title: 'RTI தானியங்கி வரைவாளர்',
        rti_subtitle: 'சட்டப்படி துல்லியமான தகவல் அறியும் உரிமை விண்ணப்பங்களை உடனடியாக உருவாக்குங்கள்.',
        about_title: 'GrievanceIQ பற்றி',
        footer_tagline: 'குடிமக்களுக்கும் இந்தியாவின் புகார் அமைப்புக்கும் இடையிலான நுண்ணறிவு அடுக்கு.',
        footer_tools: 'குடிமக்கள் கருவிகள்', footer_dashboard: 'பொது டாஷ்போர்டு',
        hero_badge: 'இந்தியாவின் குடிமக்கள் புகார் நுண்ணறிவு தளம்',
        hero_h1_1: 'புத்திசாலித்தனமாக', hero_h1_2: 'பதிவு செய்.', hero_h1_3: 'கேட்க', hero_h1_4: 'வை.',
        hero_h1_5: 'அவர்களை', hero_h1_6: 'பொறுப்பாக்கு.',
        hero_sub: 'உங்கள் பிரச்சனையை எளிய மொழியில் தட்டச்சு செய்யுங்கள்.',
        login_title: 'GrievanceIQ இல் உள்நுழையவும்',
        profile_title: 'என் சுயவிவரம்',
        search_placeholder: 'புகார்களை தேடு...',
        export_pdf: 'PDF ஏற்றுமதி',
        loading: 'ஏற்றுகிறது...',
        no_results: 'முடிவுகள் கிடைக்கவில்லை',
        status_draft: 'வரைவு', status_filed: 'பதிவு', status_pending: 'நிலுவை',
        status_resolved: 'தீர்க்கப்பட்டது', status_fake_closed: 'போலி மூடல்', status_escalated: 'அதிகரிக்கப்பட்டது',
        lang_name: 'தமிழ்',
        table_hash: '#',
        table_district: 'District',
        table_complaints: 'Complaints',
        table_resolution: 'Resolution',
        table_fake_closure: 'Fake Closure',
        table_satisfaction: 'Satisfaction',
        table_avg_days: 'Avg Days',
        table_trend: 'Trend',
        table_ministry: 'Ministry',
        table_received: 'Received',
        table_official_rate: 'Official Rate',
        table_citizen_rate: 'Citizen Rate',
        table_flag: 'Flag',
        chart_national_trend: 'National Complaints — Monthly Trend',
        chart_sat_vs_fake: 'Satisfaction vs Fake Closure Trend',
        chart_top10: 'Top 10 Ministries — Complaint Volume',
        chart_dist: 'Resolution Status Distribution',
        chart_offenders: 'Fake Closure Rate — Top Offenders',
        chart_avg_res: 'Average Resolution Days',
        funnel_title: 'Resolution Funnel — National Pipeline',
        funnel_sub: 'Complaint Journey: Filing to Resolution',
        heatmap_title: 'Complaint Activity Heatmap — 12 Months',
        heatmap_sub: 'Daily Complaint Volume Heatmap',
        heatmap_less: 'Less',
        heatmap_more: 'More',
        network_title: 'Department Interaction Network',
        network_sub: 'Inter-Ministry Complaint Transfer Network — Top 15',
        radar_sys_title: 'Systemic Issue Radar',
        social_feed_title: 'Social Monitoring Feed',
        table_hash: '#',
        table_district: 'District',
        table_complaints: 'Complaints',
        table_resolution: 'Resolution',
        table_fake_closure: 'Fake Closure',
        table_satisfaction: 'Satisfaction',
        table_avg_days: 'Avg Days',
        table_trend: 'Trend',
        table_ministry: 'Ministry',
        table_received: 'Received',
        table_official_rate: 'Official Rate',
        table_citizen_rate: 'Citizen Rate',
        table_flag: 'Flag',
        chart_national_trend: 'National Complaints — Monthly Trend',
        chart_sat_vs_fake: 'Satisfaction vs Fake Closure Trend',
        chart_top10: 'Top 10 Ministries — Complaint Volume',
        chart_dist: 'Resolution Status Distribution',
        chart_offenders: 'Fake Closure Rate — Top Offenders',
        chart_avg_res: 'Average Resolution Days',
        funnel_title: 'Resolution Funnel — National Pipeline',
        funnel_sub: 'Complaint Journey: Filing to Resolution',
        heatmap_title: 'Complaint Activity Heatmap — 12 Months',
        heatmap_sub: 'Daily Complaint Volume Heatmap',
        heatmap_less: 'Less',
        heatmap_more: 'More',
        network_title: 'Department Interaction Network',
        network_sub: 'Inter-Ministry Complaint Transfer Network — Top 15',
        radar_sys_title: 'Systemic Issue Radar',
        social_feed_title: 'Social Monitoring Feed',
dashboard_map_title: 'India Grievance Intelligence Map',
        dashboard_map_subtitle: 'GeoJSON + District Drill-Down',
        dashboard_map_back: 'Back to India',
        metric_total: 'Total Complaints',
        metric_resolution: 'Resolution Rate',
        metric_fake: 'Fake Closure Rate',
        metric_avg_days: 'Avg Resolution Days',
        dashboard_monthly: 'Monthly Trends — 15-Month Analysis',
        dashboard_analytics: 'Analytics Overview',
        dashboard_radar: 'Department Comparison Radar',
        dashboard_scorecard: 'Department Accountability Scorecard',
        sort_volume: 'By Volume',
        sort_fake: 'By Fake Closure Rate',
        sort_sat: 'By Citizen Satisfaction',
        sort_time: 'By Resolution Time'
      },
      te: {
        nav_home: 'హోమ్', nav_complaint: 'ఫిర్యాదు చేయండి', nav_track: 'ట్రాక్',
        nav_my_complaints: 'నా ఫిర్యాదులు', nav_dashboard: 'డాష్‌బోర్డ్', nav_how: 'ఎలా పనిచేస్తుంది',
        nav_about: 'మా గురించి', nav_file_cta: 'ఫిర్యాదు చేయండి', nav_admin: 'అడ్మిన్',
        complaint_title: 'స్మార్ట్ ఫిర్యాదు బిల్డర్',
        complaint_subtitle: 'మీ సమస్యను ఏ భాషలోనైనా టైప్ చేయండి. మా AI సరైన విభాగాన్ని గుర్తిస్తుంది.',
        step1_title: 'దశ 1: మీ సమస్యను వివరించండి',
        analyze_btn: 'నా ఫిర్యాదును విశ్లేషించండి',
        tracker_title: 'ఫిర్యాదు ట్రాకర్',
        tracker_subtitle: 'పురోగతిని ట్రాక్ చేయడానికి మీ CPGRAMS ఫిర్యాదు ID నమోదు చేయండి.',
        my_complaints_title: 'నా ఫిర్యాదులు',
        my_complaints_subtitle: 'మీ అన్ని విశ్లేషించిన ఫిర్యాదులను ఒకే చోట ట్రాక్ చేయండి.',
        dashboard_title: 'పబ్లిక్ జవాబుదారీతనం డాష్‌బోర్డ్',
        dashboard_subtitle: 'భారతదేశం అంతటా రియల్-టైమ్ ఫిర్యాదు విశ్లేషణ.',
        rti_title: 'RTI ఆటో-డ్రాఫ్టర్',
        rti_subtitle: 'చట్టపరంగా ఖచ్చితమైన RTI దరఖాస్తులను తక్షణంగా రూపొందించండి.',
        about_title: 'GrievanceIQ గురించి',
        footer_tagline: 'పౌరులు మరియు భారతదేశ ఫిర్యాదు వ్యవస్థ మధ్య మేధో పొరన.',
        footer_tools: 'పౌర సాధనాలు', footer_dashboard: 'పబ్లిక్ డాష్‌బోర్డ్',
        hero_badge: 'భారతదేశ పౌర ఫిర్యాదు మేధో వేదిక',
        hero_h1_1: 'తెలివిగా', hero_h1_2: 'ఫైల్ చేయి.', hero_h1_3: 'వినబడు.', hero_h1_4: '',
        hero_h1_5: 'వారిని', hero_h1_6: 'జవాబుదారీగా చేయి.',
        hero_sub: 'మీ సమస్యను సామాన్య భాషలో టైప్ చేయండి.',
        login_title: 'GrievanceIQ లో సైన్ ఇన్ చేయండి',
        profile_title: 'నా ప్రొఫైల్',
        search_placeholder: 'ఫిర్యాదులను వెతకండి...',
        export_pdf: 'PDF ఎగుమతి',
        loading: 'లోడ్ అవుతోంది...',
        no_results: 'ఫలితాలు కనుగొనబడలేదు',
        status_draft: 'డ్రాఫ్ట్', status_filed: 'ఫైల్ చేసింది', status_pending: 'పెండింగ్',
        status_resolved: 'పరిష్కరించబడింది', status_fake_closed: 'నకిలీ మూసివేత', status_escalated: 'ఎస్కలేట్',
        lang_name: 'తెలుగు',
        table_hash: '#',
        table_district: 'District',
        table_complaints: 'Complaints',
        table_resolution: 'Resolution',
        table_fake_closure: 'Fake Closure',
        table_satisfaction: 'Satisfaction',
        table_avg_days: 'Avg Days',
        table_trend: 'Trend',
        table_ministry: 'Ministry',
        table_received: 'Received',
        table_official_rate: 'Official Rate',
        table_citizen_rate: 'Citizen Rate',
        table_flag: 'Flag',
        chart_national_trend: 'National Complaints — Monthly Trend',
        chart_sat_vs_fake: 'Satisfaction vs Fake Closure Trend',
        chart_top10: 'Top 10 Ministries — Complaint Volume',
        chart_dist: 'Resolution Status Distribution',
        chart_offenders: 'Fake Closure Rate — Top Offenders',
        chart_avg_res: 'Average Resolution Days',
        funnel_title: 'Resolution Funnel — National Pipeline',
        funnel_sub: 'Complaint Journey: Filing to Resolution',
        heatmap_title: 'Complaint Activity Heatmap — 12 Months',
        heatmap_sub: 'Daily Complaint Volume Heatmap',
        heatmap_less: 'Less',
        heatmap_more: 'More',
        network_title: 'Department Interaction Network',
        network_sub: 'Inter-Ministry Complaint Transfer Network — Top 15',
        radar_sys_title: 'Systemic Issue Radar',
        social_feed_title: 'Social Monitoring Feed',
        table_hash: '#',
        table_district: 'District',
        table_complaints: 'Complaints',
        table_resolution: 'Resolution',
        table_fake_closure: 'Fake Closure',
        table_satisfaction: 'Satisfaction',
        table_avg_days: 'Avg Days',
        table_trend: 'Trend',
        table_ministry: 'Ministry',
        table_received: 'Received',
        table_official_rate: 'Official Rate',
        table_citizen_rate: 'Citizen Rate',
        table_flag: 'Flag',
        chart_national_trend: 'National Complaints — Monthly Trend',
        chart_sat_vs_fake: 'Satisfaction vs Fake Closure Trend',
        chart_top10: 'Top 10 Ministries — Complaint Volume',
        chart_dist: 'Resolution Status Distribution',
        chart_offenders: 'Fake Closure Rate — Top Offenders',
        chart_avg_res: 'Average Resolution Days',
        funnel_title: 'Resolution Funnel — National Pipeline',
        funnel_sub: 'Complaint Journey: Filing to Resolution',
        heatmap_title: 'Complaint Activity Heatmap — 12 Months',
        heatmap_sub: 'Daily Complaint Volume Heatmap',
        heatmap_less: 'Less',
        heatmap_more: 'More',
        network_title: 'Department Interaction Network',
        network_sub: 'Inter-Ministry Complaint Transfer Network — Top 15',
        radar_sys_title: 'Systemic Issue Radar',
        social_feed_title: 'Social Monitoring Feed',
dashboard_map_title: 'India Grievance Intelligence Map',
        dashboard_map_subtitle: 'GeoJSON + District Drill-Down',
        dashboard_map_back: 'Back to India',
        metric_total: 'Total Complaints',
        metric_resolution: 'Resolution Rate',
        metric_fake: 'Fake Closure Rate',
        metric_avg_days: 'Avg Resolution Days',
        dashboard_monthly: 'Monthly Trends — 15-Month Analysis',
        dashboard_analytics: 'Analytics Overview',
        dashboard_radar: 'Department Comparison Radar',
        dashboard_scorecard: 'Department Accountability Scorecard',
        sort_volume: 'By Volume',
        sort_fake: 'By Fake Closure Rate',
        sort_sat: 'By Citizen Satisfaction',
        sort_time: 'By Resolution Time'
      },
      bn: {
        nav_home: 'হোম', nav_complaint: 'অভিযোগ দায়ের', nav_track: 'ট্র্যাক',
        nav_my_complaints: 'আমার অভিযোগ', nav_dashboard: 'ড্যাশবোর্ড', nav_how: 'কীভাবে কাজ করে',
        nav_about: 'আমাদের সম্পর্কে', nav_file_cta: 'অভিযোগ দায়ের করুন', nav_admin: 'অ্যাডমিন',
        complaint_title: 'স্মার্ট অভিযোগ বিল্ডার',
        complaint_subtitle: 'আপনার সমস্যা যেকোনো ভাষায় টাইপ করুন। আমাদের AI সঠিক বিভাগ চিহ্নিত করবে।',
        step1_title: 'ধাপ 1: আপনার সমস্যা বর্ণনা করুন',
        analyze_btn: 'আমার অভিযোগ বিশ্লেষণ করুন',
        tracker_title: 'অভিযোগ ট্র্যাকার',
        tracker_subtitle: 'অগ্রগতি ট্র্যাক করতে আপনার CPGRAMS অভিযোগ ID লিখুন।',
        my_complaints_title: 'আমার অভিযোগসমূহ',
        my_complaints_subtitle: 'আপনার সমস্ত বিশ্লেষিত অভিযোগ এক জায়গায় ট্র্যাক করুন।',
        dashboard_title: 'পাবলিক জবাবদিহি ড্যাশবোর্ড',
        dashboard_subtitle: 'ভারতজুড়ে রিয়েল-টাইম অভিযোগ বিশ্লেষণ।',
        rti_title: 'RTI অটো-ড্রাফটার',
        rti_subtitle: 'আইনত সঠিক তথ্য অধিকার আবেদন তাৎক্ষণিকভাবে তৈরি করুন।',
        about_title: 'GrievanceIQ সম্পর্কে',
        footer_tagline: 'নাগরিক এবং ভারতের অভিযোগ ব্যবস্থার মধ্যে বুদ্ধিমত্তা স্তর।',
        footer_tools: 'নাগরিক সরঞ্জাম', footer_dashboard: 'পাবলিক ড্যাশবোর্ড',
        hero_badge: 'ভারতের নাগরিক অভিযোগ বুদ্ধিমত্তা প্ল্যাটফর্ম',
        hero_h1_1: 'বুদ্ধিমানভাবে', hero_h1_2: 'দায়ের কর।', hero_h1_3: 'শোনো।', hero_h1_4: '',
        hero_h1_5: 'তাদের', hero_h1_6: 'জবাবদিহি কর।',
        hero_sub: 'আপনার সমস্যা সাধারণ ভাষায় টাইপ করুন।',
        login_title: 'GrievanceIQ-এ সাইন ইন করুন',
        profile_title: 'আমার প্রোফাইল',
        search_placeholder: 'অভিযোগ খুঁজুন...',
        export_pdf: 'PDF রপ্তানি',
        loading: 'লোড হচ্ছে...',
        no_results: 'কোনো ফলাফল পাওয়া যায়নি',
        status_draft: 'ড্রাফট', status_filed: 'দায়ের', status_pending: 'বিচারাধীন',
        status_resolved: 'সমাধান', status_fake_closed: 'ভুয়া বন্ধ', status_escalated: 'বৃদ্ধি',
        lang_name: 'বাংলা',
        table_hash: '#',
        table_district: 'District',
        table_complaints: 'Complaints',
        table_resolution: 'Resolution',
        table_fake_closure: 'Fake Closure',
        table_satisfaction: 'Satisfaction',
        table_avg_days: 'Avg Days',
        table_trend: 'Trend',
        table_ministry: 'Ministry',
        table_received: 'Received',
        table_official_rate: 'Official Rate',
        table_citizen_rate: 'Citizen Rate',
        table_flag: 'Flag',
        chart_national_trend: 'National Complaints — Monthly Trend',
        chart_sat_vs_fake: 'Satisfaction vs Fake Closure Trend',
        chart_top10: 'Top 10 Ministries — Complaint Volume',
        chart_dist: 'Resolution Status Distribution',
        chart_offenders: 'Fake Closure Rate — Top Offenders',
        chart_avg_res: 'Average Resolution Days',
        funnel_title: 'Resolution Funnel — National Pipeline',
        funnel_sub: 'Complaint Journey: Filing to Resolution',
        heatmap_title: 'Complaint Activity Heatmap — 12 Months',
        heatmap_sub: 'Daily Complaint Volume Heatmap',
        heatmap_less: 'Less',
        heatmap_more: 'More',
        network_title: 'Department Interaction Network',
        network_sub: 'Inter-Ministry Complaint Transfer Network — Top 15',
        radar_sys_title: 'Systemic Issue Radar',
        social_feed_title: 'Social Monitoring Feed',
        table_hash: '#',
        table_district: 'District',
        table_complaints: 'Complaints',
        table_resolution: 'Resolution',
        table_fake_closure: 'Fake Closure',
        table_satisfaction: 'Satisfaction',
        table_avg_days: 'Avg Days',
        table_trend: 'Trend',
        table_ministry: 'Ministry',
        table_received: 'Received',
        table_official_rate: 'Official Rate',
        table_citizen_rate: 'Citizen Rate',
        table_flag: 'Flag',
        chart_national_trend: 'National Complaints — Monthly Trend',
        chart_sat_vs_fake: 'Satisfaction vs Fake Closure Trend',
        chart_top10: 'Top 10 Ministries — Complaint Volume',
        chart_dist: 'Resolution Status Distribution',
        chart_offenders: 'Fake Closure Rate — Top Offenders',
        chart_avg_res: 'Average Resolution Days',
        funnel_title: 'Resolution Funnel — National Pipeline',
        funnel_sub: 'Complaint Journey: Filing to Resolution',
        heatmap_title: 'Complaint Activity Heatmap — 12 Months',
        heatmap_sub: 'Daily Complaint Volume Heatmap',
        heatmap_less: 'Less',
        heatmap_more: 'More',
        network_title: 'Department Interaction Network',
        network_sub: 'Inter-Ministry Complaint Transfer Network — Top 15',
        radar_sys_title: 'Systemic Issue Radar',
        social_feed_title: 'Social Monitoring Feed',
dashboard_map_title: 'India Grievance Intelligence Map',
        dashboard_map_subtitle: 'GeoJSON + District Drill-Down',
        dashboard_map_back: 'Back to India',
        metric_total: 'Total Complaints',
        metric_resolution: 'Resolution Rate',
        metric_fake: 'Fake Closure Rate',
        metric_avg_days: 'Avg Resolution Days',
        dashboard_monthly: 'Monthly Trends — 15-Month Analysis',
        dashboard_analytics: 'Analytics Overview',
        dashboard_radar: 'Department Comparison Radar',
        dashboard_scorecard: 'Department Accountability Scorecard',
        sort_volume: 'By Volume',
        sort_fake: 'By Fake Closure Rate',
        sort_sat: 'By Citizen Satisfaction',
        sort_time: 'By Resolution Time'
      },
      mr: {
        nav_home: 'मुखपृष्ठ', nav_complaint: 'तक्रार नोंदवा', nav_track: 'ट्रॅक करा',
        nav_my_complaints: 'माझ्या तक्रारी', nav_dashboard: 'डॅशबोर्ड', nav_how: 'कसे कार्य करते',
        nav_about: 'आमच्याबद्दल', nav_file_cta: 'तक्रार नोंदवा', nav_admin: 'ॲडमिन',
        complaint_title: 'स्मार्ट तक्रार बिल्डर',
        complaint_subtitle: 'तुमची समस्या कोणत्याही भाषेत टाइप करा. आमचा AI योग्य विभाग ओळखतो.',
        step1_title: 'पायरी 1: तुमची समस्या सांगा',
        analyze_btn: 'माझ्या तक्रारीचे विश्लेषण करा',
        tracker_title: 'तक्रार ट्रॅकर',
        tracker_subtitle: 'प्रगती ट्रॅक करण्यासाठी तुमचा CPGRAMS तक्रार ID प्रविष्ट करा.',
        my_complaints_title: 'माझ्या तक्रारी',
        my_complaints_subtitle: 'तुमच्या सर्व विश्लेषित तक्रारी एकाच ठिकाणी ट्रॅक करा.',
        dashboard_title: 'सार्वजनिक उत्तरदायित्व डॅशबोर्ड',
        dashboard_subtitle: 'संपूर्ण भारतातील रिअल-टाइम तक्रार विश्लेषण.',
        rti_title: 'RTI ऑटो-ड्राफ्टर',
        rti_subtitle: 'कायदेशीरदृष्ट्या अचूक माहिती अधिकार अर्ज तात्काळ तयार करा.',
        about_title: 'GrievanceIQ बद्दल',
        footer_tagline: 'नागरिक आणि भारताच्या तक्रार प्रणालीमधील बुद्धिमत्ता स्तर.',
        footer_tools: 'नागरिक साधने', footer_dashboard: 'सार्वजनिक डॅशबोर्ड',
        hero_badge: 'भारताचा नागरिक तक्रार बुद्धिमत्ता प्लॅटफॉर्म',
        hero_h1_1: 'हुशारीने', hero_h1_2: 'नोंदवा.', hero_h1_3: 'ऐकून', hero_h1_4: 'घ्या.',
        hero_h1_5: 'त्यांना', hero_h1_6: 'जबाबदार धरा.',
        hero_sub: 'तुमची समस्या साध्या भाषेत टाइप करा.',
        login_title: 'GrievanceIQ मध्ये साइन इन करा',
        profile_title: 'माझी प्रोफाइल',
        search_placeholder: 'तक्रारी शोधा...',
        export_pdf: 'PDF निर्यात',
        loading: 'लोड होत आहे...',
        no_results: 'कोणतेही परिणाम नाहीत',
        status_draft: 'मसुदा', status_filed: 'दाखल', status_pending: 'प्रलंबित',
        status_resolved: 'निराकरण', status_fake_closed: 'खोटे बंद', status_escalated: 'वाढवले',
        lang_name: 'मराठी',
        table_hash: '#',
        table_district: 'District',
        table_complaints: 'Complaints',
        table_resolution: 'Resolution',
        table_fake_closure: 'Fake Closure',
        table_satisfaction: 'Satisfaction',
        table_avg_days: 'Avg Days',
        table_trend: 'Trend',
        table_ministry: 'Ministry',
        table_received: 'Received',
        table_official_rate: 'Official Rate',
        table_citizen_rate: 'Citizen Rate',
        table_flag: 'Flag',
        chart_national_trend: 'National Complaints — Monthly Trend',
        chart_sat_vs_fake: 'Satisfaction vs Fake Closure Trend',
        chart_top10: 'Top 10 Ministries — Complaint Volume',
        chart_dist: 'Resolution Status Distribution',
        chart_offenders: 'Fake Closure Rate — Top Offenders',
        chart_avg_res: 'Average Resolution Days',
        funnel_title: 'Resolution Funnel — National Pipeline',
        funnel_sub: 'Complaint Journey: Filing to Resolution',
        heatmap_title: 'Complaint Activity Heatmap — 12 Months',
        heatmap_sub: 'Daily Complaint Volume Heatmap',
        heatmap_less: 'Less',
        heatmap_more: 'More',
        network_title: 'Department Interaction Network',
        network_sub: 'Inter-Ministry Complaint Transfer Network — Top 15',
        radar_sys_title: 'Systemic Issue Radar',
        social_feed_title: 'Social Monitoring Feed',
        table_hash: '#',
        table_district: 'District',
        table_complaints: 'Complaints',
        table_resolution: 'Resolution',
        table_fake_closure: 'Fake Closure',
        table_satisfaction: 'Satisfaction',
        table_avg_days: 'Avg Days',
        table_trend: 'Trend',
        table_ministry: 'Ministry',
        table_received: 'Received',
        table_official_rate: 'Official Rate',
        table_citizen_rate: 'Citizen Rate',
        table_flag: 'Flag',
        chart_national_trend: 'National Complaints — Monthly Trend',
        chart_sat_vs_fake: 'Satisfaction vs Fake Closure Trend',
        chart_top10: 'Top 10 Ministries — Complaint Volume',
        chart_dist: 'Resolution Status Distribution',
        chart_offenders: 'Fake Closure Rate — Top Offenders',
        chart_avg_res: 'Average Resolution Days',
        funnel_title: 'Resolution Funnel — National Pipeline',
        funnel_sub: 'Complaint Journey: Filing to Resolution',
        heatmap_title: 'Complaint Activity Heatmap — 12 Months',
        heatmap_sub: 'Daily Complaint Volume Heatmap',
        heatmap_less: 'Less',
        heatmap_more: 'More',
        network_title: 'Department Interaction Network',
        network_sub: 'Inter-Ministry Complaint Transfer Network — Top 15',
        radar_sys_title: 'Systemic Issue Radar',
        social_feed_title: 'Social Monitoring Feed',
dashboard_map_title: 'India Grievance Intelligence Map',
        dashboard_map_subtitle: 'GeoJSON + District Drill-Down',
        dashboard_map_back: 'Back to India',
        metric_total: 'Total Complaints',
        metric_resolution: 'Resolution Rate',
        metric_fake: 'Fake Closure Rate',
        metric_avg_days: 'Avg Resolution Days',
        dashboard_monthly: 'Monthly Trends — 15-Month Analysis',
        dashboard_analytics: 'Analytics Overview',
        dashboard_radar: 'Department Comparison Radar',
        dashboard_scorecard: 'Department Accountability Scorecard',
        sort_volume: 'By Volume',
        sort_fake: 'By Fake Closure Rate',
        sort_sat: 'By Citizen Satisfaction',
        sort_time: 'By Resolution Time'
      },
      kn: {
        nav_home: 'ಮುಖಪುಟ', nav_complaint: 'ದೂರು ಸಲ್ಲಿಸಿ', nav_track: 'ಟ್ರ್ಯಾಕ್',
        nav_my_complaints: 'ನನ್ನ ದೂರುಗಳು', nav_dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', nav_how: 'ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ',
        nav_about: 'ನಮ್ಮ ಬಗ್ಗೆ', nav_file_cta: 'ದೂರು ಸಲ್ಲಿಸಿ', nav_admin: 'ನಿರ್ವಾಹಕ',
        complaint_title: 'ಸ್ಮಾರ್ಟ್ ದೂರು ಬಿಲ್ಡರ್',
        complaint_subtitle: 'ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಯಾವುದೇ ಭಾಷೆಯಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ. ನಮ್ಮ AI ಸರಿಯಾದ ಇಲಾಖೆಯನ್ನು ಗುರುತಿಸುತ್ತದೆ.',
        step1_title: 'ಹಂತ 1: ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ವಿವರಿಸಿ',
        analyze_btn: 'ನನ್ನ ದೂರನ್ನು ವಿಶ್ಲೇಷಿಸಿ',
        tracker_title: 'ದೂರು ಟ್ರ್ಯಾಕರ್',
        tracker_subtitle: 'ಪ್ರಗತಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಲು ನಿಮ್ಮ CPGRAMS ದೂರು ID ನಮೂದಿಸಿ.',
        my_complaints_title: 'ನನ್ನ ದೂರುಗಳು',
        my_complaints_subtitle: 'ನಿಮ್ಮ ಎಲ್ಲಾ ವಿಶ್ಲೇಷಿತ ದೂರುಗಳನ್ನು ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.',
        dashboard_title: 'ಸಾರ್ವಜನಿಕ ಹೊಣೆಗಾರಿಕೆ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
        dashboard_subtitle: 'ಭಾರತದಾದ್ಯಂತ ನೈಜ-ಸಮಯ ದೂರು ವಿಶ್ಲೇಷಣೆ.',
        rti_title: 'RTI ಆಟೋ-ಡ್ರಾಫ್ಟರ್',
        rti_subtitle: 'ಕಾನೂನುಬದ್ಧವಾಗಿ ನಿಖರವಾದ RTI ಅರ್ಜಿಗಳನ್ನು ತಕ್ಷಣ ರಚಿಸಿ.',
        about_title: 'GrievanceIQ ಬಗ್ಗೆ',
        footer_tagline: 'ನಾಗರಿಕರು ಮತ್ತು ಭಾರತದ ದೂರು ವ್ಯವಸ್ಥೆಯ ನಡುವಿನ ಬುದ್ಧಿವಂತಿಕೆ ಪದರ.',
        footer_tools: 'ನಾಗರಿಕ ಉಪಕರಣಗಳು', footer_dashboard: 'ಸಾರ್ವಜನಿಕ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
        hero_badge: 'ಭಾರತದ ನಾಗರಿಕ ದೂರು ಬುದ್ಧಿವಂತಿಕೆ ವೇದಿಕೆ',
        hero_h1_1: 'ಬುದ್ಧಿವಂತಿಕೆಯಿಂದ', hero_h1_2: 'ಸಲ್ಲಿಸಿ.', hero_h1_3: 'ಕೇಳಿಸಿಕೊಳ್ಳಿ.', hero_h1_4: '',
        hero_h1_5: 'ಅವರನ್ನು', hero_h1_6: 'ಹೊಣೆಗಾರರನ್ನಾಗಿ ಮಾಡಿ.',
        hero_sub: 'ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಸರಳ ಭಾಷೆಯಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ.',
        login_title: 'GrievanceIQ ಗೆ ಸೈನ್ ಇನ್ ಮಾಡಿ',
        profile_title: 'ನನ್ನ ಪ್ರೊಫೈಲ್',
        search_placeholder: 'ದೂರುಗಳನ್ನು ಹುಡುಕಿ...',
        export_pdf: 'PDF ರಫ್ತು',
        loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
        no_results: 'ಫಲಿತಾಂಶಗಳಿಲ್ಲ',
        status_draft: 'ಡ್ರಾಫ್ಟ್', status_filed: 'ಸಲ್ಲಿಸಲಾಗಿದೆ', status_pending: 'ಬಾಕಿ',
        status_resolved: 'ಪರಿಹರಿಸಲಾಗಿದೆ', status_fake_closed: 'ನಕಲಿ ಮುಕ್ತಾಯ', status_escalated: 'ಹೆಚ್ಚಿಸಲಾಗಿದೆ',
        lang_name: 'ಕನ್ನಡ'
      }
    };

    const langLabels = { en:'English', hi:'हिन्दी', ta:'தமிழ்', te:'తెలుగు', bn:'বাংলা', mr:'मराठी', kn:'ಕನ್ನಡ' };
    const langOrder = ['en','hi','ta','te','bn','mr','kn'];
    let currentLang = localStorage.getItem('grievanceiq_lang') || 'en';

    function cycleLang() {
      const idx = langOrder.indexOf(currentLang);
      currentLang = langOrder[(idx + 1) % langOrder.length];
      localStorage.setItem('grievanceiq_lang', currentLang);
      applyLanguage(currentLang);
    }

    function setLang(lang) {
      currentLang = lang;
      localStorage.setItem('grievanceiq_lang', lang);
      applyLanguage(lang);
      const dd = document.getElementById('langDropdown');
      if (dd) dd.classList.add('hidden');
    }

    function toggleLangDropdown(e) {
      e && e.stopPropagation();
      const dd = document.getElementById('langDropdown');
      if (dd) dd.classList.toggle('hidden');
    }

    function applyLanguage(lang) {
      const strings = i18n[lang] || i18n.en;
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (strings[key]) {
          if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = strings[key];
          } else {
            el.textContent = strings[key];
          }
        }
      });
      // Update toggle button label
      const label = document.getElementById('langToggleLabel');
      if (label) label.textContent = langLabels[lang] || 'English';
      // Update html lang
      document.documentElement.lang = lang === 'hi' ? 'hi' : lang === 'mr' ? 'mr' : lang;
      // Announce language change for a11y
      const announce = document.getElementById('a11y-announce');
      if (announce) announce.textContent = 'Language changed to ' + (langLabels[lang] || lang);
    }

    // Close dropdown on outside click
    document.addEventListener('click', () => {
      const dd = document.getElementById('langDropdown');
      if (dd) dd.classList.add('hidden');
    });

    // Apply saved language on load
    if (currentLang !== 'en') applyLanguage(currentLang);

    // ============================================
    // A11Y: KEYBOARD NAVIGATION & FOCUS MANAGEMENT
    // ============================================
    (function initA11y() {
      // Escape closes dropdowns and modals
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          const dd = document.getElementById('langDropdown');
          if (dd && !dd.classList.contains('hidden')) {
            dd.classList.add('hidden');
            document.getElementById('langToggleBtn')?.focus();
          }
          const mobileMenu = document.getElementById('mobileMenu');
          if (mobileMenu && mobileMenu.classList.contains('open')) {
            mobileMenu.classList.remove('open');
          }
        }
      });

      // Trap focus in mobile menu when open
      document.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;
        const mobileMenu = document.getElementById('mobileMenu');
        if (!mobileMenu || !mobileMenu.classList.contains('open')) return;
        const focusable = mobileMenu.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      });

      // Add aria-current to active nav links
      document.querySelectorAll('nav a').forEach(link => {
        if (link.classList.contains('nav-active')) {
          link.setAttribute('aria-current', 'page');
        }
      });
    })();

    // ============================================
    // NOTIFICATIONS CENTER
    // ============================================
    function toggleNotifPanel(e) {
      e && e.stopPropagation();
      const panel = document.getElementById('notifPanel');
      if (panel) panel.classList.toggle('hidden');
    }

    async function loadNotifications() {
      const token = localStorage.getItem('giq_token');
      if (!token) return;
      try {
        const res = await fetch('/api/notifications', { headers: { 'Authorization': 'Bearer ' + token } });
        const json = await res.json();
        if (!json.success) return;
        const badge = document.getElementById('notifBadge');
        const list = document.getElementById('notifList');
        if (badge) {
          if (json.unread_count > 0) {
            badge.textContent = json.unread_count > 9 ? '9+' : json.unread_count;
            badge.classList.remove('hidden');
          } else {
            badge.classList.add('hidden');
          }
        }
        if (list) {
          if (!json.data || json.data.length === 0) {
            list.innerHTML = '<div class="p-4 text-center text-xs text-gray-400"><i class="fas fa-inbox text-lg mb-1 block"></i>No notifications yet</div>';
          } else {
            list.innerHTML = json.data.map(n => {
              const iconMap = { 'clipboard-check': 'fa-clipboard-check text-ashoka-500', 'file-lines': 'fa-file-lines text-purple-500', bell: 'fa-bell text-saffron-500', 'exclamation-triangle': 'fa-exclamation-triangle text-red-500', 'clock': 'fa-clock text-blue-500' };
              const ic = iconMap[n.icon] || 'fa-bell text-saffron-500';
              const unread = n.is_read ? '' : 'bg-saffron-50 dark:bg-saffron-900/20';
              const dot = n.is_read ? '' : '<span class="w-2 h-2 bg-saffron-500 rounded-full flex-shrink-0"></span>';
              const ago = timeAgo(n.created_at);
              return '<a href="' + (n.link || '#') + '" onclick="markNotifRead(' + n.id + ')" class="flex items-start gap-2.5 px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors border-b border-gray-50 dark:border-dark-700 ' + unread + '">' +
                '<i class="fas ' + ic + ' mt-0.5 text-sm flex-shrink-0"></i>' +
                '<div class="flex-1 min-w-0"><div class="text-xs font-semibold text-gray-800 dark:text-gray-200">' + n.title + '</div>' +
                '<div class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">' + n.message + '</div>' +
                '<div class="text-[9px] text-gray-400 mt-1">' + ago + '</div></div>' +
                dot + '</a>';
            }).join('');
          }
        }
      } catch(e) {}
    }

    function timeAgo(dateStr) {
      const now = new Date(); const d = new Date(dateStr);
      const s = Math.floor((now - d) / 1000);
      if (s < 60) return 'Just now';
      if (s < 3600) return Math.floor(s/60) + 'm ago';
      if (s < 86400) return Math.floor(s/3600) + 'h ago';
      return Math.floor(s/86400) + 'd ago';
    }

    async function markNotifRead(id) {
      const token = localStorage.getItem('giq_token');
      if (!token) return;
      try {
        await fetch('/api/notifications/read', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
      } catch(e) {}
    }

    async function markAllNotifRead() {
      const token = localStorage.getItem('giq_token');
      if (!token) return;
      try {
        await fetch('/api/notifications/read', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });
        loadNotifications();
        showToast('All notifications marked as read', 'success');
      } catch(e) {}
    }

    // Close notification panel on outside click
    document.addEventListener('click', (e) => {
      const panel = document.getElementById('notifPanel');
      const wrap = document.getElementById('navNotifWrap');
      if (panel && wrap && !wrap.contains(e.target)) panel.classList.add('hidden');
    });

    // ============================================
    // AUTH STATE IN NAVIGATION
    // ============================================
    (function initAuthNav() {
      const token = localStorage.getItem('giq_token');
      const userStr = localStorage.getItem('giq_user');
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          // Show logged-in nav
          const navGuest = document.getElementById('navGuest');
          const navUser = document.getElementById('navUser');
          const navUserName = document.getElementById('navUserName');
          const mobileGuest = document.getElementById('mobileGuest');
          const mobileUser = document.getElementById('mobileUser');
          const mobileUserName = document.getElementById('mobileUserName');
          const navNotifWrap = document.getElementById('navNotifWrap');
          if (navGuest) navGuest.classList.add('hidden');
          if (navUser) { navUser.classList.remove('hidden'); navUser.classList.add('flex'); }
          if (navUserName) navUserName.textContent = (user.name || 'Account').split(' ')[0];
          if (mobileGuest) mobileGuest.classList.add('hidden');
          if (mobileUser) mobileUser.classList.remove('hidden');
          if (mobileUserName) mobileUserName.textContent = user.name || 'My Profile';
          if (navNotifWrap) navNotifWrap.classList.remove('hidden');
          // Load notifications
          loadNotifications();
          // Poll every 60s
          setInterval(loadNotifications, 60000);
        } catch(e) {}
      }

      // Listen for auth state changes
      window.addEventListener('auth-state-changed', (e) => {
        const user = e.detail?.user;
        if (user) {
          localStorage.setItem('giq_user', JSON.stringify(user));
          const navGuest = document.getElementById('navGuest');
          const navUser = document.getElementById('navUser');
          if (navGuest) navGuest.classList.add('hidden');
          if (navUser) { navUser.classList.remove('hidden'); navUser.classList.add('flex'); }
          const navUserName = document.getElementById('navUserName');
          if (navUserName) navUserName.textContent = (user.name || 'Account').split(' ')[0];
          const navNotifWrap = document.getElementById('navNotifWrap');
          if (navNotifWrap) navNotifWrap.classList.remove('hidden');
          loadNotifications();
        }
      });
    })();

    // ============================================
    // PERFORMANCE: Animate on Scroll (Week 7)
    // ============================================
    (function initScrollAnimations() {
      const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            animObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '50px' });

      document.querySelectorAll('[data-animate]').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        animObserver.observe(el);
      });
    })();

    // ============================================
    // PERFORMANCE: Lazy load images (Week 7)
    // ============================================
    document.querySelectorAll('img[data-src]').forEach(img => {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            io.unobserve(img);
          }
        });
      });
      io.observe(img);
    });

    // ============================================
    // PERFORMANCE: Prefetch navigation targets (Week 7)
    // ============================================
    (function prefetchLinks() {
      const links = document.querySelectorAll('a[href^="/"]');
      const prefetched = new Set();
      const prefetchLink = (url) => {
        if (prefetched.has(url) || url === window.location.pathname) return;
        prefetched.add(url);
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
      };
      links.forEach(a => {
        a.addEventListener('mouseenter', () => prefetchLink(a.getAttribute('href')), { once: true });
      });
    })();
  </script>
</body>
</html>`
}
