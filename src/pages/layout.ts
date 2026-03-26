export function layout(title: string, content: string, activePage: string = ''): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — GrievanceIQ</title>
  <meta name="description" content="File Smarter. Get Heard. Hold Them Accountable. India's citizen-facing grievance intelligence platform.">
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            saffron: { 50: '#fff8f0', 100: '#fff0db', 200: '#ffe0b5', 300: '#ffcb85', 400: '#ffad52', 500: '#ff9933', 600: '#f07800', 700: '#c25e00', 800: '#9a4a00', 900: '#7a3b00' },
            navy: { 50: '#f0f4ff', 100: '#dce4f5', 200: '#b8c9eb', 300: '#8da8db', 400: '#6384c4', 500: '#3f64a8', 600: '#1a365d', 700: '#152d4f', 800: '#102340', 900: '#0b1a33' },
            ashoka: { 50: '#f0f9f0', 100: '#d8f0d8', 200: '#b0e0b0', 300: '#80cc80', 400: '#4db84d', 500: '#138808', 600: '#0f6e06', 700: '#0b5605', 800: '#084004', 900: '#052c03' }
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
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  
  <!-- Font Awesome -->
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.0/css/all.min.css" rel="stylesheet">
  
  <!-- Leaflet CSS (for map pages) -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  
  <style>
    * { font-family: 'Inter', system-ui, sans-serif; }
    
    /* Smooth scrolling */
    html { scroll-behavior: smooth; }
    
    /* Custom scrollbar */
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #f1f5f9; }
    ::-webkit-scrollbar-thumb { background: #94a3b8; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #64748b; }
    
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
    
    /* Loading spinner */
    .spinner {
      border: 3px solid #e2e8f0;
      border-top: 3px solid #ff9933;
      border-radius: 50%;
      width: 24px; height: 24px;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    
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
<body class="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
  
  <!-- ============================================ -->
  <!-- NAVIGATION -->
  <!-- ============================================ -->
  <nav class="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <a href="/" class="flex items-center gap-2.5 group">
          <div class="w-9 h-9 bg-gradient-to-br from-saffron-500 to-navy-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
            <i class="fas fa-balance-scale text-white text-sm"></i>
          </div>
          <div>
            <span class="text-xl font-bold text-navy-700 tracking-tight">Grievance</span><span class="text-xl font-bold text-saffron-500">IQ</span>
            <p class="text-[10px] text-gray-400 -mt-1 hidden sm:block tracking-wide">FILE SMARTER. GET HEARD.</p>
          </div>
        </a>
        
        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-1">
          <a href="/" class="px-3 py-2 text-sm font-medium text-gray-600 hover:text-saffron-600 transition-colors rounded-lg hover:bg-saffron-50 ${activePage === 'home' ? 'nav-active' : ''}">
            <i class="fas fa-home mr-1.5"></i><span data-i18n="nav_home">Home</span>
          </a>
          <a href="/complaint" class="px-3 py-2 text-sm font-medium text-gray-600 hover:text-saffron-600 transition-colors rounded-lg hover:bg-saffron-50 ${activePage === 'complaint' ? 'nav-active' : ''}">
            <i class="fas fa-pen-to-square mr-1.5"></i><span data-i18n="nav_complaint">File Complaint</span>
          </a>
          <a href="/tracker" class="px-3 py-2 text-sm font-medium text-gray-600 hover:text-saffron-600 transition-colors rounded-lg hover:bg-saffron-50 ${activePage === 'tracker' ? 'nav-active' : ''}">
            <i class="fas fa-magnifying-glass mr-1.5"></i><span data-i18n="nav_track">Track</span>
          </a>
          <a href="/my-complaints" class="px-3 py-2 text-sm font-medium text-gray-600 hover:text-saffron-600 transition-colors rounded-lg hover:bg-saffron-50 ${activePage === 'my-complaints' ? 'nav-active' : ''}">
            <i class="fas fa-folder-open mr-1.5"></i><span data-i18n="nav_my_complaints">My Complaints</span>
          </a>
          <a href="/dashboard" class="px-3 py-2 text-sm font-medium text-gray-600 hover:text-saffron-600 transition-colors rounded-lg hover:bg-saffron-50 ${activePage === 'dashboard' ? 'nav-active' : ''}">
            <i class="fas fa-chart-line mr-1.5"></i><span data-i18n="nav_dashboard">Dashboard</span>
          </a>
          <a href="/how-it-works" class="px-3 py-2 text-sm font-medium text-gray-600 hover:text-saffron-600 transition-colors rounded-lg hover:bg-saffron-50 ${activePage === 'how-it-works' ? 'nav-active' : ''}">
            <i class="fas fa-circle-info mr-1.5"></i><span data-i18n="nav_how">How It Works</span>
          </a>
          <a href="/about" class="px-3 py-2 text-sm font-medium text-gray-600 hover:text-saffron-600 transition-colors rounded-lg hover:bg-saffron-50 ${activePage === 'about' ? 'nav-active' : ''}">
            <i class="fas fa-users mr-1.5"></i><span data-i18n="nav_about">About</span>
          </a>
        </div>
        
        <!-- CTA + Language Toggle + Auth -->
        <div class="hidden md:flex items-center gap-3">
          <button onclick="toggleLanguage()" id="langToggleBtn" class="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors" title="Switch language">
            <i class="fas fa-language mr-1"></i><span id="langToggleLabel">हिन्दी</span>
          </button>
          <!-- Auth state: Guest -->
          <div id="navGuest" class="flex items-center gap-2">
            <a href="/login" class="text-xs px-3 py-1.5 rounded-lg border border-navy-200 text-navy-600 hover:bg-navy-50 font-medium transition-colors">
              <i class="fas fa-sign-in-alt mr-1"></i>Sign In
            </a>
          </div>
          <!-- Auth state: Logged in -->
          <div id="navUser" class="hidden flex items-center gap-2">
            <a href="/profile" class="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors">
              <i class="fas fa-user-circle text-saffron-500"></i><span id="navUserName">Account</span>
            </a>
          </div>
          <a href="/complaint" class="bg-gradient-to-r from-saffron-500 to-saffron-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:from-saffron-600 hover:to-saffron-700 transition-all shadow-md hover:shadow-lg">
            <span data-i18n="nav_file_cta">File a Complaint</span> <i class="fas fa-arrow-right ml-1.5"></i>
          </a>
        </div>
        
        <!-- Mobile menu button -->
        <button onclick="toggleMobileMenu()" class="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100">
          <i class="fas fa-bars text-xl" id="menuIcon"></i>
        </button>
      </div>
    </div>
    
    <!-- Mobile Navigation -->
    <div id="mobileMenu" class="mobile-menu fixed inset-0 bg-white z-50 md:hidden">
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
          <a href="/" class="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-xl hover:bg-saffron-50 hover:text-saffron-600 transition-colors">
            <i class="fas fa-home w-5"></i> Home
          </a>
          <a href="/complaint" class="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-xl hover:bg-saffron-50 hover:text-saffron-600 transition-colors">
            <i class="fas fa-pen-to-square w-5"></i> File a Complaint
          </a>
          <a href="/tracker" class="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-xl hover:bg-saffron-50 hover:text-saffron-600 transition-colors">
            <i class="fas fa-magnifying-glass w-5"></i> Track Complaint
          </a>
          <a href="/dashboard" class="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-xl hover:bg-saffron-50 hover:text-saffron-600 transition-colors">
            <i class="fas fa-chart-line w-5"></i> Public Dashboard
          </a>
          <a href="/my-complaints" class="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-xl hover:bg-saffron-50 hover:text-saffron-600 transition-colors">
            <i class="fas fa-folder-open w-5"></i> <span data-i18n="nav_my_complaints">My Complaints</span>
          </a>
          <a href="/how-it-works" class="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-xl hover:bg-saffron-50 hover:text-saffron-600 transition-colors">
            <i class="fas fa-circle-info w-5"></i> <span data-i18n="nav_how">How It Works</span>
          </a>
          <a href="/about" class="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-xl hover:bg-saffron-50 hover:text-saffron-600 transition-colors">
            <i class="fas fa-users w-5"></i> <span data-i18n="nav_about">About Us</span>
          </a>
          <div class="pt-4 mt-4 border-t space-y-2">
            <div id="mobileGuest">
              <a href="/login" class="block text-center bg-navy-600 text-white px-6 py-3 rounded-xl font-semibold">
                <i class="fas fa-sign-in-alt mr-2"></i>Sign In
              </a>
            </div>
            <div id="mobileUser" class="hidden space-y-2">
              <a href="/profile" class="block text-center bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold">
                <i class="fas fa-user-circle mr-2"></i><span id="mobileUserName">My Profile</span>
              </a>
            </div>
            <a href="/complaint" class="block text-center bg-gradient-to-r from-saffron-500 to-saffron-600 text-white px-6 py-3 rounded-xl font-semibold">
              File a Complaint <i class="fas fa-arrow-right ml-2"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <!-- ============================================ -->
  <!-- MAIN CONTENT -->
  <!-- ============================================ -->
  <main class="flex-1">
    ${content}
  </main>

  <!-- ============================================ -->
  <!-- FOOTER -->
  <!-- ============================================ -->
  <footer class="bg-navy-800 text-white mt-auto">
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
    // HINDI UI TOGGLE (i18n Foundation)
    // ============================================
    const i18n = {
      en: {
        nav_home: 'Home', nav_complaint: 'File Complaint', nav_track: 'Track',
        nav_my_complaints: 'My Complaints', nav_dashboard: 'Dashboard', nav_how: 'How It Works',
        nav_about: 'About', nav_file_cta: 'File a Complaint',
        complaint_title: 'Smart Complaint Builder',
        complaint_subtitle: 'Type your problem in any language. Our AI identifies the right department, scores your complaint, and rewrites it for maximum impact.',
        step1_title: 'Step 1: Describe Your Problem',
        analyze_btn: 'Analyze My Complaint',
        tracker_title: 'Complaint Tracker',
        tracker_subtitle: 'Enter your CPGRAMS complaint ID to track progress, get Day 15/25 countdown reminders, and report outcomes.',
        my_complaints_title: 'My Complaints',
        my_complaints_subtitle: 'Track all your analyzed complaints, their status, and filing progress in one place.'
      },
      hi: {
        nav_home: 'होम', nav_complaint: 'शिकायत दर्ज करें', nav_track: 'ट्रैक करें',
        nav_my_complaints: 'मेरी शिकायतें', nav_dashboard: 'डैशबोर्ड', nav_how: 'कैसे काम करता है',
        nav_about: 'हमारे बारे में', nav_file_cta: 'शिकायत दर्ज करें',
        complaint_title: 'स्मार्ट शिकायत बिल्डर',
        complaint_subtitle: 'अपनी समस्या किसी भी भाषा में लिखें। हमारा AI सही विभाग पहचानता है, शिकायत को स्कोर करता है, और अधिकतम प्रभाव के लिए फिर से लिखता है।',
        step1_title: 'चरण 1: अपनी समस्या बताएं',
        analyze_btn: 'मेरी शिकायत का विश्लेषण करें',
        tracker_title: 'शिकायत ट्रैकर',
        tracker_subtitle: 'प्रगति ट्रैक करने, दिन 15/25 की काउंटडाउन रिमाइंडर प्राप्त करने और परिणाम रिपोर्ट करने के लिए अपना CPGRAMS शिकायत ID दर्ज करें।',
        my_complaints_title: 'मेरी शिकायतें',
        my_complaints_subtitle: 'अपनी सभी विश्लेषित शिकायतों, उनकी स्थिति और फाइलिंग प्रगति को एक ही स्थान पर ट्रैक करें।'
      }
    };

    let currentLang = localStorage.getItem('grievanceiq_lang') || 'en';

    function toggleLanguage() {
      currentLang = currentLang === 'en' ? 'hi' : 'en';
      localStorage.setItem('grievanceiq_lang', currentLang);
      applyLanguage(currentLang);
    }

    function applyLanguage(lang) {
      const strings = i18n[lang] || i18n.en;
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (strings[key]) el.textContent = strings[key];
      });
      // Update toggle button label
      const label = document.getElementById('langToggleLabel');
      if (label) label.textContent = lang === 'en' ? 'हिन्दी' : 'English';
      // Update html lang
      document.documentElement.lang = lang;
    }

    // Apply saved language on load
    if (currentLang !== 'en') applyLanguage(currentLang);

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
          if (navGuest) navGuest.classList.add('hidden');
          if (navUser) { navUser.classList.remove('hidden'); navUser.classList.add('flex'); }
          if (navUserName) navUserName.textContent = (user.name || 'Account').split(' ')[0];
          if (mobileGuest) mobileGuest.classList.add('hidden');
          if (mobileUser) mobileUser.classList.remove('hidden');
          if (mobileUserName) mobileUserName.textContent = user.name || 'My Profile';
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
        }
      });
    })();
  </script>
</body>
</html>`
}
