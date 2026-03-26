import { layout } from './layout'

export function loginPage(): string {
  const content = `
  <section class="min-h-[80vh] flex items-center justify-center py-12 px-4">
    <div class="w-full max-w-md">
      
      <!-- Auth Card -->
      <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        
        <!-- Header -->
        <div class="bg-gradient-to-br from-navy-800 to-navy-700 p-8 text-center">
          <div class="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur">
            <i class="fas fa-shield-halved text-saffron-400 text-2xl"></i>
          </div>
          <h1 class="text-2xl font-bold text-white mb-1" id="authTitle">Sign In to GrievanceIQ</h1>
          <p class="text-gray-300 text-sm" id="authSubtitle">Enter your email to receive a one-time password</p>
        </div>

        <!-- Step 1: Email Input -->
        <div id="step-email" class="p-8">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div class="relative">
                <i class="fas fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input type="email" id="emailInput" placeholder="your@email.com" autocomplete="email"
                  class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-saffron-300 focus:border-saffron-400 outline-none transition-all" />
              </div>
            </div>
            
            <div id="nameField" class="hidden">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
              <div class="relative">
                <i class="fas fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input type="text" id="nameInput" placeholder="Full name" autocomplete="name"
                  class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-saffron-300 focus:border-saffron-400 outline-none transition-all" />
              </div>
            </div>

            <button onclick="requestOTP()" id="sendOtpBtn"
              class="w-full bg-gradient-to-r from-saffron-500 to-saffron-600 text-white py-3 rounded-xl font-semibold text-sm hover:from-saffron-600 hover:to-saffron-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
              <span id="sendOtpText"><i class="fas fa-paper-plane mr-2"></i>Send OTP</span>
              <span id="sendOtpLoading" class="hidden"><div class="spinner inline-block mr-2" style="width:16px;height:16px;border-width:2px;vertical-align:middle;"></div>Sending...</span>
            </button>
          </div>

          <div class="mt-6 text-center">
            <p class="text-xs text-gray-400">
              <i class="fas fa-lock mr-1"></i>
              We'll send a 6-digit OTP to your email. No password needed.
            </p>
          </div>
        </div>

        <!-- Step 2: OTP Verification -->
        <div id="step-otp" class="p-8 hidden">
          <div class="text-center mb-6">
            <div class="w-12 h-12 bg-saffron-50 rounded-xl flex items-center justify-center mx-auto mb-3">
              <i class="fas fa-envelope-open text-saffron-500 text-xl"></i>
            </div>
            <p class="text-sm text-gray-600">OTP sent to <strong id="displayEmail"></strong></p>
            <p class="text-xs text-gray-400 mt-1">Expires in <span id="otpTimer">10:00</span></p>
          </div>

          <!-- Demo OTP Display -->
          <div id="demoOtpBox" class="hidden bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-center">
            <p class="text-xs text-amber-700 font-medium"><i class="fas fa-flask mr-1"></i> Demo Mode — Your OTP:</p>
            <p class="text-2xl font-black text-amber-800 tracking-[8px] mt-1" id="demoOtpCode"></p>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2 text-center">Enter 6-digit OTP</label>
              <div class="flex justify-center gap-2" id="otpInputs">
                <input type="text" maxlength="1" class="otp-digit w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-saffron-400 focus:ring-2 focus:ring-saffron-200 outline-none transition-all" data-index="0" inputmode="numeric" />
                <input type="text" maxlength="1" class="otp-digit w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-saffron-400 focus:ring-2 focus:ring-saffron-200 outline-none transition-all" data-index="1" inputmode="numeric" />
                <input type="text" maxlength="1" class="otp-digit w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-saffron-400 focus:ring-2 focus:ring-saffron-200 outline-none transition-all" data-index="2" inputmode="numeric" />
                <span class="flex items-center text-gray-300 text-xl">-</span>
                <input type="text" maxlength="1" class="otp-digit w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-saffron-400 focus:ring-2 focus:ring-saffron-200 outline-none transition-all" data-index="3" inputmode="numeric" />
                <input type="text" maxlength="1" class="otp-digit w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-saffron-400 focus:ring-2 focus:ring-saffron-200 outline-none transition-all" data-index="4" inputmode="numeric" />
                <input type="text" maxlength="1" class="otp-digit w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-saffron-400 focus:ring-2 focus:ring-saffron-200 outline-none transition-all" data-index="5" inputmode="numeric" />
              </div>
            </div>

            <div id="otpError" class="hidden text-center">
              <p class="text-sm text-red-600 font-medium"><i class="fas fa-exclamation-circle mr-1"></i><span id="otpErrorMsg"></span></p>
            </div>

            <button onclick="verifyOTP()" id="verifyBtn"
              class="w-full bg-gradient-to-r from-ashoka-500 to-ashoka-600 text-white py-3 rounded-xl font-semibold text-sm hover:from-ashoka-600 hover:to-ashoka-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed" disabled>
              <span id="verifyText"><i class="fas fa-check-circle mr-2"></i>Verify & Sign In</span>
              <span id="verifyLoading" class="hidden"><div class="spinner inline-block mr-2" style="width:16px;height:16px;border-width:2px;vertical-align:middle;"></div>Verifying...</span>
            </button>

            <div class="flex justify-between items-center">
              <button onclick="resendOTP()" id="resendBtn" class="text-xs text-saffron-600 hover:text-saffron-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed" disabled>
                <i class="fas fa-redo mr-1"></i>Resend OTP <span id="resendTimer"></span>
              </button>
              <button onclick="goBackToEmail()" class="text-xs text-gray-400 hover:text-gray-600">
                <i class="fas fa-arrow-left mr-1"></i>Change email
              </button>
            </div>
          </div>
        </div>

        <!-- Step 3: Success -->
        <div id="step-success" class="p-8 hidden text-center">
          <div class="w-20 h-20 bg-ashoka-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-check-circle text-ashoka-500 text-4xl"></i>
          </div>
          <h2 class="text-xl font-bold text-gray-800 mb-2">Welcome to GrievanceIQ!</h2>
          <p class="text-sm text-gray-500 mb-1" id="welcomeName"></p>
          <p class="text-xs text-gray-400 mb-6">Your session is active for 7 days</p>
          
          <div class="space-y-3">
            <a href="/complaint" class="block bg-gradient-to-r from-saffron-500 to-saffron-600 text-white py-3 rounded-xl font-semibold text-sm text-center hover:from-saffron-600 hover:to-saffron-700 transition-all shadow-md">
              <i class="fas fa-pen-to-square mr-2"></i>File a Complaint
            </a>
            <a href="/my-complaints" class="block bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm text-center hover:bg-gray-50 transition-all">
              <i class="fas fa-folder-open mr-2"></i>My Complaints
            </a>
            <a href="/dashboard" class="block text-navy-600 hover:text-navy-800 text-sm font-medium transition-colors">
              <i class="fas fa-chart-line mr-1"></i>View Dashboard →
            </a>
          </div>
        </div>
      </div>

      <!-- Security Notice -->
      <div class="mt-6 text-center">
        <div class="inline-flex items-center gap-4 text-xs text-gray-400">
          <span><i class="fas fa-lock mr-1"></i>256-bit encrypted</span>
          <span><i class="fas fa-shield-halved mr-1"></i>No passwords stored</span>
          <span><i class="fas fa-user-shield mr-1"></i>GDPR compliant</span>
        </div>
      </div>
    </div>
  </section>

  <script>
    let currentEmail = '';
    let currentOTP = '';
    let otpTimerInterval = null;
    let resendTimerInterval = null;

    // ---- OTP digit input navigation ----
    document.querySelectorAll('.otp-digit').forEach((input, i) => {
      input.addEventListener('input', (e) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        e.target.value = val;
        if (val && i < 5) {
          document.querySelectorAll('.otp-digit')[i + 1].focus();
        }
        checkOtpComplete();
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && i > 0) {
          document.querySelectorAll('.otp-digit')[i - 1].focus();
        }
        if (e.key === 'Enter') verifyOTP();
      });
      // Handle paste
      input.addEventListener('paste', (e) => {
        e.preventDefault();
        const paste = (e.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '').slice(0, 6);
        document.querySelectorAll('.otp-digit').forEach((d, idx) => {
          d.value = paste[idx] || '';
        });
        if (paste.length === 6) document.querySelectorAll('.otp-digit')[5].focus();
        checkOtpComplete();
      });
    });

    function checkOtpComplete() {
      const digits = Array.from(document.querySelectorAll('.otp-digit')).map(d => d.value).join('');
      document.getElementById('verifyBtn').disabled = digits.length !== 6;
    }

    function getOTPValue() {
      return Array.from(document.querySelectorAll('.otp-digit')).map(d => d.value).join('');
    }

    // ---- Email enter to submit ----
    document.getElementById('emailInput').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') requestOTP();
    });

    // ---- Request OTP ----
    async function requestOTP() {
      const email = document.getElementById('emailInput').value.trim();
      const name = document.getElementById('nameInput').value.trim();
      
      if (!email || !email.includes('@') || !email.includes('.')) {
        showToast('Please enter a valid email address', 'error');
        return;
      }

      const btn = document.getElementById('sendOtpBtn');
      btn.disabled = true;
      document.getElementById('sendOtpText').classList.add('hidden');
      document.getElementById('sendOtpLoading').classList.remove('hidden');

      try {
        const res = await fetch('/api/auth/request-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name: name || undefined })
        });
        const data = await res.json();

        if (data.success) {
          currentEmail = email;
          currentOTP = data.otp || '';
          
          // Show OTP step
          document.getElementById('step-email').classList.add('hidden');
          document.getElementById('step-otp').classList.remove('hidden');
          document.getElementById('displayEmail').textContent = email;
          document.getElementById('authTitle').textContent = 'Verify Your Email';
          document.getElementById('authSubtitle').textContent = 'Enter the 6-digit code we sent you';

          // Show demo OTP (since no email provider)
          if (currentOTP) {
            document.getElementById('demoOtpBox').classList.remove('hidden');
            document.getElementById('demoOtpCode').textContent = currentOTP;
          }

          // If new user, show welcome message
          if (data.is_new_user) {
            document.getElementById('nameField').classList.remove('hidden');
          }

          // Start timers
          startOtpTimer(600); // 10 minutes
          startResendTimer(30); // 30 seconds
          
          // Focus first OTP input
          document.querySelectorAll('.otp-digit')[0].focus();
        } else {
          showToast(data.error || data.message || 'Failed to send OTP', 'error');
        }
      } catch (e) {
        showToast('Network error. Please try again.', 'error');
      }

      btn.disabled = false;
      document.getElementById('sendOtpText').classList.remove('hidden');
      document.getElementById('sendOtpLoading').classList.add('hidden');
    }

    // ---- Verify OTP ----
    async function verifyOTP() {
      const otp = getOTPValue();
      if (otp.length !== 6) return;

      const btn = document.getElementById('verifyBtn');
      btn.disabled = true;
      document.getElementById('verifyText').classList.add('hidden');
      document.getElementById('verifyLoading').classList.remove('hidden');
      document.getElementById('otpError').classList.add('hidden');

      try {
        const res = await fetch('/api/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: currentEmail, otp })
        });
        const data = await res.json();

        if (data.success) {
          // Store token
          if (data.token) {
            localStorage.setItem('giq_token', data.token);
            localStorage.setItem('giq_user', JSON.stringify(data.user));
          }

          // Show success
          document.getElementById('step-otp').classList.add('hidden');
          document.getElementById('step-success').classList.remove('hidden');
          document.getElementById('authTitle').textContent = 'You\\'re In!';
          document.getElementById('authSubtitle').textContent = 'Your account is ready';
          document.getElementById('welcomeName').textContent = 'Welcome, ' + (data.user?.name || currentEmail);

          // Update nav
          updateNavAuth(data.user);

          showToast('Login successful!', 'success');
        } else {
          document.getElementById('otpError').classList.remove('hidden');
          document.getElementById('otpErrorMsg').textContent = data.error || data.message || 'Invalid OTP';
          // Clear OTP inputs
          document.querySelectorAll('.otp-digit').forEach(d => d.value = '');
          document.querySelectorAll('.otp-digit')[0].focus();
        }
      } catch (e) {
        showToast('Network error. Please try again.', 'error');
      }

      btn.disabled = false;
      document.getElementById('verifyText').classList.remove('hidden');
      document.getElementById('verifyLoading').classList.add('hidden');
    }

    // ---- Resend OTP ----
    async function resendOTP() {
      const btn = document.getElementById('resendBtn');
      btn.disabled = true;
      
      try {
        const res = await fetch('/api/auth/request-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: currentEmail })
        });
        const data = await res.json();
        
        if (data.success) {
          if (data.otp) {
            currentOTP = data.otp;
            document.getElementById('demoOtpBox').classList.remove('hidden');
            document.getElementById('demoOtpCode').textContent = data.otp;
          }
          showToast('New OTP sent!', 'success');
          startOtpTimer(600);
          startResendTimer(30);
        } else {
          showToast(data.error || 'Failed to resend', 'error');
        }
      } catch (e) {
        showToast('Network error', 'error');
      }
    }

    function goBackToEmail() {
      document.getElementById('step-otp').classList.add('hidden');
      document.getElementById('step-email').classList.remove('hidden');
      document.getElementById('authTitle').textContent = 'Sign In to GrievanceIQ';
      document.getElementById('authSubtitle').textContent = 'Enter your email to receive a one-time password';
      clearInterval(otpTimerInterval);
      clearInterval(resendTimerInterval);
    }

    // ---- Timers ----
    function startOtpTimer(seconds) {
      clearInterval(otpTimerInterval);
      let remaining = seconds;
      document.getElementById('otpTimer').textContent = formatTime(remaining);
      otpTimerInterval = setInterval(() => {
        remaining--;
        document.getElementById('otpTimer').textContent = formatTime(remaining);
        if (remaining <= 0) {
          clearInterval(otpTimerInterval);
          document.getElementById('otpTimer').textContent = 'Expired';
        }
      }, 1000);
    }

    function startResendTimer(seconds) {
      clearInterval(resendTimerInterval);
      const btn = document.getElementById('resendBtn');
      btn.disabled = true;
      let remaining = seconds;
      document.getElementById('resendTimer').textContent = '(' + remaining + 's)';
      resendTimerInterval = setInterval(() => {
        remaining--;
        document.getElementById('resendTimer').textContent = remaining > 0 ? '(' + remaining + 's)' : '';
        if (remaining <= 0) {
          clearInterval(resendTimerInterval);
          btn.disabled = false;
        }
      }, 1000);
    }

    function formatTime(s) {
      return Math.floor(s/60).toString().padStart(2,'0') + ':' + (s%60).toString().padStart(2,'0');
    }

    // ---- Nav auth state ----
    function updateNavAuth(user) {
      // This will be picked up by the layout script
      window.dispatchEvent(new CustomEvent('auth-state-changed', { detail: { user } }));
    }

    // ---- Check if already logged in ----
    (function checkAuth() {
      const token = localStorage.getItem('giq_token');
      const user = localStorage.getItem('giq_user');
      if (token && user) {
        try {
          const u = JSON.parse(user);
          // Verify token is still valid
          fetch('/api/auth/me', { headers: { 'Authorization': 'Bearer ' + token } })
            .then(r => r.json())
            .then(data => {
              if (data.authenticated) {
                // Already logged in — show success
                document.getElementById('step-email').classList.add('hidden');
                document.getElementById('step-success').classList.remove('hidden');
                document.getElementById('authTitle').textContent = 'Already Signed In';
                document.getElementById('authSubtitle').textContent = 'You are already logged in';
                document.getElementById('welcomeName').textContent = 'Welcome back, ' + (u.name || u.email);
              }
            });
        } catch(e) {}
      }
    })();
  </script>

  <style>
    .otp-digit:focus { border-color: #ff9933; box-shadow: 0 0 0 3px rgba(255,153,51,0.15); }
  </style>
  `
  return layout('Sign In', content, 'login')
}
