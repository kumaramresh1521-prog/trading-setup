/**
 * auth_sync.js
 * User Authentication & Multi-Device Workspace State Synchronization Engine
 * Supports:
 *  1. Dual Buttons: Separate "Sign In" and "Sign Up" actions.
 *  2. Supabase Cloud Integration (Email/Password + Google OAuth).
 *  3. Instant Local / Guest Mode (Zero-friction local persistence).
 *  4. Step-by-Step Supabase Connection Guide inside the modal.
 */

(function (window) {
  'use strict';

  const STORAGE_KEY_USER = 'bl_user_profile';
  const STORAGE_KEY_WORKSPACE = 'bl_workspace_state';
  const STORAGE_KEY_SUPABASE_CFG = 'bl_supabase_config';

  let supabaseClient = null;

  const AuthSync = {
    user: null,
    currentTab: 'signin', // 'signin' or 'signup'
    workspace: {
      activeTab: 'breadth',
      theme: 'dark',
      watchlist: ['NIFTY', 'BANKNIFTY', 'RELIANCE', 'HDFCBANK'],
      optionsRange: 10,
      lastUpdated: Date.now()
    },

    init() {
      this.loadLocalUser();
      this.loadLocalWorkspace();
      this.initSupabaseIfConfigured();
      this.renderTopbarAuth();
      this.bindGlobalEvents();
      this.restoreWorkspaceState();
    },

    loadLocalUser() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_USER);
        this.user = saved ? JSON.parse(saved) : null;
      } catch (e) {
        this.user = null;
      }
    },

    loadLocalWorkspace() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_WORKSPACE);
        if (saved) {
          this.workspace = Object.assign(this.workspace, JSON.parse(saved));
        }
      } catch (e) {}
    },

    saveWorkspace(updates = {}) {
      this.workspace = Object.assign(this.workspace, updates, { lastUpdated: Date.now() });
      try {
        localStorage.setItem(STORAGE_KEY_WORKSPACE, JSON.stringify(this.workspace));
      } catch (e) {}
      this.pushToCloud();
    },

    initSupabaseIfConfigured() {
      const initClient = (url, anonKey) => {
        if (!window.supabase || !url || !anonKey) return;
        try {
          supabaseClient = window.supabase.createClient(url, anonKey);
          localStorage.setItem(STORAGE_KEY_SUPABASE_CFG, JSON.stringify({ url, anonKey }));
          // Populate settings UI if present
          const sUrl = document.getElementById('settingsSupabaseUrl');
          const sKey = document.getElementById('settingsSupabaseKey');
          const sStatus = document.getElementById('settingsSupabaseStatus');
          if (sUrl && !sUrl.value) sUrl.value = url;
          if (sKey && !sKey.value) sKey.value = anonKey;
          if (sStatus) sStatus.textContent = '✓ Supabase Connected & Ready';

          supabaseClient.auth.getSession().then(({ data: { session } }) => {
            if (session && session.user) {
              this.setCloudUser(session.user);
              this.pullFromCloud();
            }
          }).catch(err => {
            console.warn('[AuthSync] Session check error:', err);
          });
        } catch (e) {
          console.warn('[AuthSync] createClient error:', e);
        }
      };

      try {
        const cfgRaw = localStorage.getItem(STORAGE_KEY_SUPABASE_CFG);
        if (cfgRaw) {
          const cfg = JSON.parse(cfgRaw);
          if (cfg.url && cfg.anonKey) {
            initClient(cfg.url, cfg.anonKey);
            return;
          }
        }
      } catch (err) {}

      // Fallback: Auto-fetch from Python Backend
      fetch('/api/supabase/config')
        .then(res => res.json())
        .then(data => {
          if (data.ok && data.url && data.anonKey) {
            initClient(data.url, data.anonKey);
          }
        })
        .catch(() => {});
    },

    setCloudUser(sbUser, customName = null) {
      this.user = {
        id: sbUser.id,
        email: sbUser.email,
        name: customName || sbUser.user_metadata?.full_name || sbUser.email.split('@')[0],
        avatar: sbUser.user_metadata?.avatar_url || null,
        isCloudSynced: true
      };
      try {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(this.user));
      } catch (e) {}
      this.renderTopbarAuth();
      if (typeof window.loadBrokerSettings === "function") {
        window.loadBrokerSettings();
      }
    },

    async signUpWithEmail(name, email, password) {
      if (!name || !email || !password) {
        alert('Please fill in Name, Email and Password.');
        return;
      }

      if (supabaseClient) {
        try {
          const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
              data: { full_name: name }
            }
          });
          if (error) throw error;

          if (data.user) {
            this.setCloudUser(data.user, name);
            this.closeAuthModal();
          } else {
            alert('Confirmation link sent to your email. Please check your inbox.');
          }
        } catch (err) {
          alert(err.message || 'Error creating account');
        }
      } else {
        // Local account fallback
        this.user = {
          id: 'local_' + Date.now(),
          name: name,
          email: email,
          avatar: null,
          isCloudSynced: false
        };
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(this.user));
        this.renderTopbarAuth();
        this.closeAuthModal();
      }
    },

    async signInWithEmail(email, password) {
      if (!email || !password) {
        alert('Please enter your Email and Password.');
        return;
      }

      if (supabaseClient) {
        try {
          const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
          });
          if (error) throw error;

          if (data.user) {
            this.setCloudUser(data.user);
            this.pullFromCloud();
            this.closeAuthModal();
          }
        } catch (err) {
          alert(err.message || 'Invalid email or password');
        }
      } else {
        // Fallback local sign in
        this.user = {
          id: 'local_' + Date.now(),
          name: email.split('@')[0],
          email: email,
          avatar: null,
          isCloudSynced: false
        };
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(this.user));
        this.renderTopbarAuth();
        this.closeAuthModal();
      }
    },

    async signInWithGoogle() {
      if (supabaseClient) {
        try {
          const { error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: window.location.origin
            }
          });
          if (error) throw error;
        } catch (err) {
          alert('Google OAuth Error: ' + (err.message || err) + '\n\nMake sure Google Provider is enabled in Supabase -> Authentication -> Providers -> Google.');
        }
      } else {
        alert('Supabase project URL & Anon Key not connected yet!\n\nPlease open "⚙️ How to Connect Supabase" in the modal below and paste your project credentials first.');
        const guide = document.getElementById('supabaseSetupSection');
        if (guide) guide.style.display = 'block';
      }
    },

    signOut() {
      if (supabaseClient) {
        supabaseClient.auth.signOut().catch(() => {});
      }
      this.user = null;
      localStorage.removeItem(STORAGE_KEY_USER);
      this.renderTopbarAuth();
      this.closeAuthModal();
      if (typeof window.loadBrokerSettings === "function") {
        window.loadBrokerSettings();
      }
    },

    async pushToCloud() {
      if (!supabaseClient || !this.user || !this.user.isCloudSynced) return;
      try {
        await supabaseClient.from('user_workspaces').upsert({
          user_id: this.user.id,
          workspace_data: this.workspace,
          updated_at: new Date().toISOString()
        });
      } catch (err) {
        console.warn('[AuthSync] Cloud push error:', err);
      }
    },

    async pullFromCloud() {
      if (!supabaseClient || !this.user || !this.user.isCloudSynced) return;
      try {
        const { data, error } = await supabaseClient
          .from('user_workspaces')
          .select('workspace_data')
          .eq('user_id', this.user.id)
          .single();

        if (!error && data && data.workspace_data) {
          this.workspace = Object.assign(this.workspace, data.workspace_data);
          localStorage.setItem(STORAGE_KEY_WORKSPACE, JSON.stringify(this.workspace));
          this.restoreWorkspaceState();
        }
      } catch (err) {
        console.warn('[AuthSync] Cloud pull error:', err);
      }
    },

    restoreWorkspaceState() {
      if (this.workspace.activeTab && typeof window.switchTab === 'function') {
        const validTabs = ['breadth', 'options', 'smartMoney', 'delivery', 'mtf', 'tools', 'news'];
        if (validTabs.includes(this.workspace.activeTab) && this.workspace.activeTab !== 'breadth') {
          setTimeout(() => {
            try {
              window.switchTab(this.workspace.activeTab);
            } catch (e) {}
          }, 350);
        }
      }
    },

    renderTopbarAuth() {
      const container = document.getElementById('topbarAuthArea');
      if (!container) return;

      if (this.user) {
        const initials = this.user.name ? this.user.name.charAt(0).toUpperCase() : 'U';
        const avatarHtml = this.user.avatar 
          ? `<img src="${this.user.avatar}" alt="Avatar" class="auth-user-avatar" />`
          : `<div class="auth-user-initials">${initials}</div>`;

        container.innerHTML = `
          <button type="button" class="auth-user-btn" id="btnOpenUserProfile" title="Logged in as ${this.user.name}">
            ${avatarHtml}
            <span class="auth-user-name">${this.user.name}</span>
            <span class="auth-sync-dot" title="${this.user.isCloudSynced ? 'Supabase Cloud Synced' : 'Local Workspace Active'}"></span>
          </button>
        `;
        document.getElementById('btnOpenUserProfile')?.addEventListener('click', () => this.openAuthModal());
      } else {
        // TWO DISTINCT BUTTONS: Sign In and Sign Up
        container.innerHTML = `
          <div class="auth-btn-group">
            <button type="button" class="auth-signin-btn" id="btnOpenSignInModal">
              🔑 Sign In
            </button>
            <button type="button" class="auth-signup-btn" id="btnOpenSignUpModal">
              ✨ Sign Up
            </button>
          </div>
        `;
        document.getElementById('btnOpenSignInModal')?.addEventListener('click', () => {
          this.currentTab = 'signin';
          this.openAuthModal();
        });
        document.getElementById('btnOpenSignUpModal')?.addEventListener('click', () => {
          this.currentTab = 'signup';
          this.openAuthModal();
        });
      }
    },

    openAuthModal() {
      let modal = document.getElementById('authModal');
      if (!modal) {
        modal = this.createAuthModal();
        document.body.appendChild(modal);
      }
      this.updateModalContent();
      modal.style.display = 'flex';
    },

    closeAuthModal() {
      const modal = document.getElementById('authModal');
      if (modal) modal.style.display = 'none';
    },

    createAuthModal() {
      const modal = document.createElement('div');
      modal.id = 'authModal';
      modal.className = 'auth-modal-overlay';
      modal.innerHTML = `
        <div class="auth-modal-dialog">
          <div class="auth-modal-header">
            <div class="auth-modal-title">
              <span>Account Access</span>
            </div>
            <button type="button" class="auth-modal-close" id="btnCloseAuthModal">&times;</button>
          </div>
          <div class="auth-modal-body" id="authModalBody">
            <!-- Injected dynamically -->
          </div>
        </div>
      `;
      return modal;
    },

    updateModalContent() {
      const body = document.getElementById('authModalBody');
      if (!body) return;

      if (this.user) {
        // CLEAN USER PROFILE VIEW
        body.innerHTML = `
          <div class="auth-profile-view">
            <div class="auth-profile-avatar-large">
              ${this.user.avatar ? `<img src="${this.user.avatar}" />` : `<span>${this.user.name.charAt(0)}</span>`}
            </div>
            <h3 class="auth-profile-title">${this.user.name}</h3>
            <p class="auth-profile-email">${this.user.email || ''}</p>

            <div class="auth-action-row" style="margin-top:24px; display:flex; gap:10px; justify-content:center;">
              <button type="button" class="btn-danger-ghost" id="btnAuthSignOut">Sign Out</button>
            </div>
          </div>
        `;

        document.getElementById('btnAuthSignOut')?.addEventListener('click', () => this.signOut());
      } else {
        // CLEAN SIGN IN / SIGN UP VIEW
        const isSignIn = this.currentTab === 'signin';

        body.innerHTML = `
          <div class="auth-tabs-header">
            <button type="button" class="auth-tab-btn ${isSignIn ? 'active' : ''}" id="tabBtnSignIn">
              🔑 Sign In
            </button>
            <button type="button" class="auth-tab-btn ${!isSignIn ? 'active' : ''}" id="tabBtnSignUp">
              ✨ Sign Up
            </button>
          </div>

          <!-- TAB 1: SIGN IN -->
          <div id="authViewSignIn" style="display:${isSignIn ? 'block' : 'none'};">
            <div class="auth-form-group">
              <label>Email</label>
              <input type="email" id="signInEmail" placeholder="your@email.com" class="auth-input" />
            </div>
            <div class="auth-form-group">
              <label>Password</label>
              <input type="password" id="signInPassword" placeholder="••••••••" class="auth-input" />
            </div>
            <button type="button" class="btn-primary-block" id="btnExecuteSignIn">
              Sign In
            </button>
          </div>

          <!-- TAB 2: SIGN UP -->
          <div id="authViewSignUp" style="display:${!isSignIn ? 'block' : 'none'};">
            <div class="auth-form-group">
              <label>Full Name</label>
              <input type="text" id="signUpName" placeholder="Your Name" class="auth-input" />
            </div>
            <div class="auth-form-group">
              <label>Email</label>
              <input type="email" id="signUpEmail" placeholder="your@email.com" class="auth-input" />
            </div>
            <div class="auth-form-group">
              <label>Password</label>
              <input type="password" id="signUpPassword" placeholder="••••••••" class="auth-input" />
            </div>
            <button type="button" class="btn-primary-block" id="btnExecuteSignUp">
              Create Account
            </button>
          </div>
        `;

        // Bind tab switching
        document.getElementById('tabBtnSignIn')?.addEventListener('click', () => {
          this.currentTab = 'signin';
          this.updateModalContent();
        });
        document.getElementById('tabBtnSignUp')?.addEventListener('click', () => {
          this.currentTab = 'signup';
          this.updateModalContent();
        });

        // Sign in execution
        document.getElementById('btnExecuteSignIn')?.addEventListener('click', () => {
          const email = document.getElementById('signInEmail')?.value?.trim();
          const pass = document.getElementById('signInPassword')?.value?.trim();
          this.signInWithEmail(email, pass);
        });

        // Sign up execution
        document.getElementById('btnExecuteSignUp')?.addEventListener('click', () => {
          const name = document.getElementById('signUpName')?.value?.trim();
          const email = document.getElementById('signUpEmail')?.value?.trim();
          const pass = document.getElementById('signUpPassword')?.value?.trim();
          this.signUpWithEmail(name, email, pass);
        });
      }
    },

    bindGlobalEvents() {
      // Close modal on click outside or close button
      document.addEventListener('click', (e) => {
        const modal = document.getElementById('authModal');
        if (modal && modal.style.display === 'flex') {
          if (e.target === modal || e.target.id === 'btnCloseAuthModal') {
            this.closeAuthModal();
          }
        }
      });

      // Synchronize tab switching
      const origSwitchTab = window.switchTab;
      if (typeof origSwitchTab === 'function') {
        window.switchTab = (tab) => {
          origSwitchTab(tab);
          AuthSync.saveWorkspace({ activeTab: tab });
        };
      }

      // Sync settings panel Supabase controls
      const sUrl = document.getElementById('settingsSupabaseUrl');
      const sKey = document.getElementById('settingsSupabaseKey');
      const sBtn = document.getElementById('btnSaveSettingsSupabase');
      const sStatus = document.getElementById('settingsSupabaseStatus');

      try {
        const currentCfg = JSON.parse(localStorage.getItem(STORAGE_KEY_SUPABASE_CFG) || '{}');
        if (sUrl && currentCfg.url) sUrl.value = currentCfg.url;
        if (sKey && currentCfg.anonKey) sKey.value = currentCfg.anonKey;
        if (sStatus && currentCfg.url && currentCfg.anonKey) {
          sStatus.textContent = '✓ Supabase Connected';
        }
      } catch (e) {}

      if (sBtn) {
        sBtn.addEventListener('click', () => {
          const url = sUrl?.value?.trim();
          const key = sKey?.value?.trim();
          if (url && key) {
            localStorage.setItem(STORAGE_KEY_SUPABASE_CFG, JSON.stringify({ url, anonKey: key }));
            AuthSync.initSupabaseIfConfigured();
            // Sync to Python backend
            fetch('/api/supabase/config', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url, anonKey: key })
            }).catch(() => {});

            if (sStatus) sStatus.textContent = '✓ Supabase Connected & Ready';
            alert('✓ Supabase credentials saved to Frontend & Backend! Cloud authentication is now active.');
          } else {
            alert('Please provide both Supabase Project URL and Anon Public Key.');
          }
        });
      }
    }
  };

  window.AuthSync = AuthSync;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AuthSync.init());
  } else {
    AuthSync.init();
  }
})(window);
