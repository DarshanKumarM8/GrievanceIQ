import { layout } from './layout'

export function profilePage(): string {
  const content = `
  <section class="py-8 sm:py-12 bg-gradient-to-b from-navy-800 to-navy-700">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">
        <i class="fas fa-user-circle text-saffron-400 mr-2"></i>My Profile
      </h1>
      <p class="text-gray-300 text-sm">Manage your account settings, security, and preferences</p>
    </div>
  </section>

  <!-- Profile Content -->
  <section class="py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Not logged in state -->
      <div id="profileGuest" class="hidden text-center py-16">
        <div class="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-user-lock text-gray-300 text-3xl"></i>
        </div>
        <h3 class="text-lg font-bold text-gray-700 mb-2">Please sign in to view your profile</h3>
        <p class="text-sm text-gray-500 mb-6">You need to be logged in to access account settings.</p>
        <a href="/login" class="inline-block bg-saffron-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-saffron-600 transition-colors">
          <i class="fas fa-sign-in-alt mr-2"></i>Sign In
        </a>
      </div>

      <!-- Logged in state -->
      <div id="profileContent" class="hidden space-y-6">
        
        <!-- Profile Card -->
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-100">
            <h2 class="text-lg font-bold text-gray-800"><i class="fas fa-user mr-2 text-navy-600"></i>Account Information</h2>
          </div>
          <div class="p-6 space-y-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label class="block text-xs font-semibold text-gray-500 mb-1.5">Full Name</label>
                <input type="text" id="profileName" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-saffron-200 focus:border-saffron-400 outline-none" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-500 mb-1.5">Email</label>
                <input type="email" id="profileEmail" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500" readonly />
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label class="block text-xs font-semibold text-gray-500 mb-1.5">Language Preference</label>
                <select id="profileLang" class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-saffron-200 focus:border-saffron-400 outline-none" aria-label="Language preference">
                  <option value="en">English</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                  <option value="bn">বাংলা (Bengali)</option>
                  <option value="mr">मराठी (Marathi)</option>
                  <option value="kn">ಕನ್ನಡ (Kannada)</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-500 mb-1.5">Complaints Filed</label>
                <div class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 font-medium" id="profileComplaintCount">0</div>
              </div>
            </div>
            <div class="flex gap-3 pt-2">
              <button onclick="saveProfile()" class="bg-saffron-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-saffron-600 transition-colors">
                <i class="fas fa-save mr-1.5"></i>Save Changes
              </button>
            </div>
          </div>
        </div>

        <!-- Security -->
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-100">
            <h2 class="text-lg font-bold text-gray-800"><i class="fas fa-shield-halved mr-2 text-ashoka-600"></i>Security</h2>
          </div>
          <div class="p-6 space-y-4">
            <div class="flex items-center justify-between p-4 bg-ashoka-50 rounded-xl border border-ashoka-100">
              <div>
                <div class="flex items-center gap-2">
                  <i class="fas fa-check-circle text-ashoka-500"></i>
                  <span class="text-sm font-semibold text-gray-800">Email Verified</span>
                </div>
                <p class="text-xs text-gray-500 mt-0.5 ml-6">Your email has been verified via OTP</p>
              </div>
              <span class="text-xs bg-ashoka-100 text-ashoka-700 px-2.5 py-1 rounded-full font-semibold">Active</span>
            </div>

            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <div class="flex items-center gap-2">
                  <i class="fas fa-key text-navy-500"></i>
                  <span class="text-sm font-semibold text-gray-800">Passwordless Login</span>
                </div>
                <p class="text-xs text-gray-500 mt-0.5 ml-6">You sign in using email OTP — no password to remember or steal</p>
              </div>
              <span class="text-xs bg-navy-100 text-navy-700 px-2.5 py-1 rounded-full font-semibold">Secure</span>
            </div>

            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <div class="flex items-center gap-2">
                  <i class="fas fa-clock-rotate-left text-saffron-500"></i>
                  <span class="text-sm font-semibold text-gray-800">Active Sessions</span>
                </div>
                <p class="text-xs text-gray-500 mt-0.5 ml-6">Sessions expire after 7 days of inactivity</p>
              </div>
              <button onclick="logoutAllSessions()" class="text-xs text-red-600 hover:text-red-700 font-medium border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                <i class="fas fa-sign-out-alt mr-1"></i>Logout All
              </button>
            </div>
          </div>
        </div>

        <!-- Account Actions -->
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-gray-100">
            <h2 class="text-lg font-bold text-gray-800"><i class="fas fa-cog mr-2 text-gray-500"></i>Account Actions</h2>
          </div>
          <div class="p-6 flex flex-wrap gap-3">
            <a href="/my-complaints" class="inline-flex items-center gap-2 px-4 py-2.5 bg-navy-50 border border-navy-200 text-navy-700 rounded-xl text-sm font-medium hover:bg-navy-100 transition-colors">
              <i class="fas fa-folder-open"></i>My Complaints
            </a>
            <a href="/complaint" class="inline-flex items-center gap-2 px-4 py-2.5 bg-saffron-50 border border-saffron-200 text-saffron-700 rounded-xl text-sm font-medium hover:bg-saffron-100 transition-colors">
              <i class="fas fa-pen-to-square"></i>New Complaint
            </a>
            <button onclick="logoutUser()" class="inline-flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors">
              <i class="fas fa-sign-out-alt"></i>Sign Out
            </button>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div id="profileLoading" class="text-center py-12">
        <div class="spinner mx-auto mb-3" style="width:32px;height:32px;border-width:3px;"></div>
        <p class="text-sm text-gray-500">Loading profile...</p>
      </div>
    </div>
  </section>

  <script>
    async function loadProfile() {
      const token = localStorage.getItem('giq_token');
      
      document.getElementById('profileLoading').classList.add('hidden');
      
      if (!token) {
        document.getElementById('profileGuest').classList.remove('hidden');
        return;
      }

      try {
        const res = await fetch('/api/auth/me', { headers: { 'Authorization': 'Bearer ' + token } });
        const data = await res.json();

        if (data.authenticated && data.data) {
          document.getElementById('profileContent').classList.remove('hidden');
          document.getElementById('profileName').value = data.data.name || '';
          document.getElementById('profileEmail').value = data.data.email || '';
          document.getElementById('profileLang').value = data.data.language_preference || 'en';
          document.getElementById('profileComplaintCount').textContent = data.data.complaints_filed_count || 0;
        } else {
          localStorage.removeItem('giq_token');
          localStorage.removeItem('giq_user');
          document.getElementById('profileGuest').classList.remove('hidden');
        }
      } catch (e) {
        document.getElementById('profileGuest').classList.remove('hidden');
      }
    }

    async function saveProfile() {
      const token = localStorage.getItem('giq_token');
      if (!token) return;

      const name = document.getElementById('profileName').value.trim();
      const lang = document.getElementById('profileLang').value;

      try {
        const res = await fetch('/api/auth/profile', {
          method: 'PUT',
          headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, language_preference: lang })
        });
        const data = await res.json();

        if (data.success) {
          showToast('Profile updated successfully!', 'success');
          // Update stored user
          const user = JSON.parse(localStorage.getItem('giq_user') || '{}');
          user.name = name;
          user.language_preference = lang;
          localStorage.setItem('giq_user', JSON.stringify(user));
          // Update UI language
          localStorage.setItem('grievanceiq_lang', lang);
          if (lang !== 'en') applyLanguage(lang);
        } else {
          showToast(data.message || 'Failed to update', 'error');
        }
      } catch (e) {
        showToast('Network error', 'error');
      }
    }

    async function logoutUser() {
      const token = localStorage.getItem('giq_token');
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + token }
        });
      } catch(e) {}
      localStorage.removeItem('giq_token');
      localStorage.removeItem('giq_user');
      window.location.href = '/login';
    }

    async function logoutAllSessions() {
      const token = localStorage.getItem('giq_token');
      try {
        await fetch('/api/auth/sessions', {
          method: 'DELETE',
          headers: { 'Authorization': 'Bearer ' + token }
        });
        showToast('All sessions terminated', 'info');
        localStorage.removeItem('giq_token');
        localStorage.removeItem('giq_user');
        setTimeout(() => window.location.href = '/login', 1500);
      } catch (e) {
        showToast('Error terminating sessions', 'error');
      }
    }

    loadProfile();
  </script>
  `
  return layout('My Profile', content, 'profile')
}
