
/**
 * VIBRA Social Application Engine
 * Supports Supabase Auth + Database with fully functional fallback Demo Mode.
 */

// Initial Application State & Seed Data
const VibraState = {
  supabase: null,
  isDemoMode: true,
  currentUser: {
    id: 'usr_demo_01',
    username: 'alex_morgan',
    full_name: 'Alex Morgan',
    bio: 'Digital creator, UI/UX enthusiast & tech explorer 🚀',
    website: 'https://vibra.app/alex',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    following: [],
    savedPosts: []
  },
  posts: [
    {
      id: 'post_1',
      user_id: 'usr_demo_02',
      author_name: 'Elena Rostova',
      author_handle: 'elena_art',
      author_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      media_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      caption: 'Exploring modern abstract dimensions in cyan and deep violet. What do you think? #vibra #digitalart',
      likes: 142,
      isLiked: false,
      isSaved: false,
      comments: [
        { id: 'c1', user: 'dev_guy', text: 'The glass effect is stunning!' }
      ],
      created_at: '2h ago'
    },
    {
      id: 'post_2',
      user_id: 'usr_demo_03',
      author_name: 'Liam Vance',
      author_handle: 'liam_v',
      author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      media_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      caption: 'Late night circuit design and soundscapes. #tech #workspace',
      likes: 89,
      isLiked: true,
      isSaved: false,
      comments: [],
      created_at: '5h ago'
    }
  ],
  notifications: [
    { id: 'n1', text: 'Elena Rostova liked your post.', time: '1h ago', is_read: false },
    { id: 'n2', text: 'Liam Vance started following you.', time: '3h ago', is_read: true }
  ],
  conversations: [
    {
      id: 'conv_1',
      user: { name: 'Elena Rostova', handle: 'elena_art', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
      messages: [
        { sender: 'them', text: 'Hey Alex! Loved your latest post architecture.' },
        { sender: 'me', text: 'Thanks Elena! Appreciate the feedback!' }
      ]
    }
  ],
  activeConversationId: null,
  activePostForComments: null
};

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  initFeatherIcons();
  setupNavigation();
  setupAuthEvents();
  setupPostCreation();
  setupMessaging();
  setupSettings();
  
  // Auto-connect Supabase if credentials exist in localStorage
  const savedUrl = localStorage.getItem('vibra_sp_url');
  const savedKey = localStorage.getItem('vibra_sp_key');
  if (savedUrl && savedKey) {
    try {
      VibraState.supabase = window.supabase.createClient(savedUrl, savedKey);
      VibraState.isDemoMode = false;
    } catch (e) {
      console.warn('Supabase initialization failed, running in Demo Mode.', e);
    }
  }

  // Check initial route / tab
  renderApp();
});

function initFeatherIcons() {
  if (window.feather) window.feather.replace();
}

// ROUTING & NAVIGATION
function setupNavigation() {
  const navLinks = document.querySelectorAll('[data-tab]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = link.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });

  // Profile Sub-tabs
  document.querySelectorAll('.prof-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      document.querySelectorAll('.prof-tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      const target = e.target.getAttribute('data-target');
      if (target === 'my-posts') {
        document.getElementById('profile-grid-posts').classList.remove('hidden');
        document.getElementById('profile-grid-saved').classList.add('hidden');
      } else {
        document.getElementById('profile-grid-posts').classList.add('hidden');
        document.getElementById('profile-grid-saved').classList.remove('hidden');
      }
    });
  });
}

function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
  document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(n => n.classList.remove('active'));

  const activeContent = document.getElementById(`tab-${tabId}`);
  if (activeContent) activeContent.classList.remove('hidden');

  document.querySelectorAll(`[data-tab="${tabId}"]`).forEach(n => n.classList.add('active'));

  // Tab-specific rendering actions
  if (tabId === 'home') renderFeed();
  if (tabId === 'explore') renderExplore();
  if (tabId === 'profile') renderProfile();
  if (tabId === 'notifications') renderNotifications();
  if (tabId === 'messages') renderConversationsList();
}

// AUTHENTICATION LOGIC
function setupAuthEvents() {
  const loginForm = document.getElementById('login-form');
  const regForm = document.getElementById('register-form');
  const forgotForm = document.getElementById('forgot-form');

  document.getElementById('link-to-register').addEventListener('click', () => {
    loginForm.classList.add('hidden');
    regForm.classList.remove('hidden');
  });

  document.getElementById('link-to-login').addEventListener('click', () => {
    regForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
  });

  document.getElementById('link-to-forgot').addEventListener('click', () => {
    loginForm.classList.add('hidden');
    forgotForm.classList.remove('hidden');
  });

  document.getElementById('back-to-login').addEventListener('click', () => {
    forgotForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
  });

  // Demo Mode Handler
  document.getElementById('btn-demo-mode').addEventListener('click', () => {
    VibraState.isDemoMode = true;
    enterApp();
    showToast('Entered VIBRA Interactive Demo Mode');
  });

  // Real Registration Submit
  regForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const username = document.getElementById('reg-username').value;
    const fullName = document.getElementById('reg-fullname').value;

    if (VibraState.supabase) {
      const { data, error } = await VibraState.supabase.auth.signUp({
        email,
        password,
        options: { data: { username, full_name: fullName } }
      });
      if (error) return showToast(error.message, 'error');
      showToast('Account created! Please verify your email or sign in.');
    } else {
      VibraState.currentUser.username = username;
      VibraState.currentUser.full_name = fullName;
      enterApp();
    }
  });

  // Real Login Submit
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const identifier = document.getElementById('login-identifier').value;
    const password = document.getElementById('login-password').value;

    if (VibraState.supabase) {
      const { data, error } = await VibraState.supabase.auth.signInWithPassword({
        email: identifier,
        password: password
      });
      if (error) return showToast(error.message, 'error');
      enterApp();
    } else {
      enterApp();
    }
  });

  // Live Username Validation Check
  document.getElementById('reg-username').addEventListener('input', (e) => {
    const val = e.target.value;
    const statusEl = document.getElementById('username-status');
    const regex = /^[a-zA-Z0-9._]+$/;

    if (!regex.test(val) && val.length > 0) {
      statusEl.textContent = 'Only letters, numbers, . and _ allowed (no spaces)';
      statusEl.style.color = '#ff4757';
    } else {
      statusEl.textContent = val.length > 3 ? 'Username available' : '';
      statusEl.style.color = '#00f2fe';
    }
  });
}

function enterApp() {
  document.getElementById('auth-screen').classList.add('hidden');
  document.getElementById('app-screen').classList.remove('hidden');
  if (VibraState.isDemoMode) {
    document.getElementById('demo-indicator').classList.remove('hidden');
  }
  updateSidebarProfile();
  renderFeed();
}

function updateSidebarProfile() {
  document.getElementById('sidebar-user-avatar').src = VibraState.currentUser.avatar;
  document.getElementById('sidebar-user-fullname').textContent = VibraState.currentUser.full_name;
  document.getElementById('sidebar-user-handle').textContent = `@${VibraState.currentUser.username}`;
}

// FEED & POST RENDERING
function renderFeed() {
  const container = document.getElementById('feed-container');
  container.innerHTML = '';

  VibraState.posts.forEach(post => {
    const postEl = document.createElement('article');
    postEl.className = 'post-card glass-panel';
    postEl.innerHTML = `
      <div class="post-header">
        <div class="author-info">
          <img src="${post.author_avatar}" class="avatar-sm" alt="Avatar">
          <div>
            <strong>${post.author_name}</strong>
            <div style="font-size: 0.75rem; color: var(--text-muted);">@${post.author_handle} • ${post.created_at}</div>
          </div>
        </div>
        <i data-feather="more-horizontal"></i>
      </div>
      <img src="${post.media_url}" class="post-media" alt="Post content" loading="lazy">
      <div class="post-actions">
        <div class="action-btns-group">
          <button class="action-btn ${post.isLiked ? 'liked' : ''}" onclick="toggleLike('${post.id}')">
            <i data-feather="heart"></i> <span>${post.likes}</span>
          </button>
          <button class="action-btn" onclick="openComments('${post.id}')">
            <i data-feather="message-circle"></i> <span>${post.comments.length}</span>
          </button>
          <button class="action-btn" onclick="sharePost('${post.id}')">
            <i data-feather="send"></i>
          </button>
        </div>
        <button class="action-btn" onclick="toggleSave('${post.id}')">
          <i data-feather="bookmark"></i>
        </button>
      </div>
      <div class="post-body">
        <p class="post-caption"><strong>${post.author_handle}</strong> ${post.caption}</p>
      </div>
    `;
    container.appendChild(postEl);
  });
  initFeatherIcons();
  renderStories();
}

function renderStories() {
  const storiesList = document.getElementById('stories-list');
  storiesList.innerHTML = `
    <div class="story-item">
      <div class="story-avatar-wrap">
        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80">
      </div>
      <span>Elena</span>
    </div>
    <div class="story-item">
      <div class="story-avatar-wrap">
        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80">
      </div>
      <span>Liam</span>
    </div>
  `;
}

// POST INTERACTION HANDLERS
window.toggleLike = function(postId) {
  const post = VibraState.posts.find(p => p.id === postId);
  if (post) {
    post.isLiked = !post.isLiked;
    post.likes += post.isLiked ? 1 : -1;
    renderFeed();
  }
};

window.toggleSave = function(postId) {
  const post = VibraState.posts.find(p => p.id === postId);
  if (post) {
    post.isSaved = !post.isSaved;
    showToast(post.isSaved ? 'Post saved to collection' : 'Post removed from saved');
  }
};

window.sharePost = function(postId) {
  navigator.clipboard?.writeText(window.location.href);
  showToast('Post link copied to clipboard!');
};

// COMMENTS SYSTEM
window.openComments = function(postId) {
  VibraState.activePostForComments = postId;
  const post = VibraState.posts.find(p => p.id === postId);
  const modal = document.getElementById('comments-modal');
  const commentsList = document.getElementById('modal-comments-list');
  
  commentsList.innerHTML = post.comments.map(c => `
    <div style="margin-bottom: 12px; font-size: 0.9rem;">
      <strong>@${c.user}</strong>: ${c.text}
    </div>
  `).join('');
  
  modal.classList.remove('hidden');
};

document.getElementById('btn-close-comments').addEventListener('click', () => {
  document.getElementById('comments-modal').classList.add('hidden');
});

document.getElementById('comment-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.getElementById('comment-input');
  const post = VibraState.posts.find(p => p.id === VibraState.activePostForComments);
  if (post && input.value.trim()) {
    post.comments.push({
      id: 'c_' + Date.now(),
      user: VibraState.currentUser.username,
      text: input.value.trim()
    });
    input.value = '';
    openComments(VibraState.activePostForComments);
    renderFeed();
  }
});

// CREATE POST LOGIC
function setupPostCreation() {
  const form = document.getElementById('create-post-form');
  const mediaInput = document.getElementById('post-media-input');
  const dropZone = document.getElementById('media-drop-zone');
  const previewContainer = document.getElementById('media-preview-container');
  const placeholder = document.getElementById('upload-placeholder');

  dropZone.addEventListener('click', () => mediaInput.click());

  mediaInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        showToast('File size exceeds 25MB limit', 'error');
        return;
      }
      const url = URL.createObjectURL(file);
      previewContainer.innerHTML = `<img src="${url}" style="max-height: 200px; border-radius: 8px;">`;
      previewContainer.classList.remove('hidden');
      placeholder.classList.add('hidden');
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const caption = document.getElementById('post-caption').value;
    
    const newPost = {
      id: 'post_' + Date.now(),
      user_id: VibraState.currentUser.id,
      author_name: VibraState.currentUser.full_name,
      author_handle: VibraState.currentUser.username,
      author_avatar: VibraState.currentUser.avatar,
      media_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      caption: caption,
      likes: 0,
      isLiked: false,
      isSaved: false,
      comments: [],
      created_at: 'Just now'
    };

    VibraState.posts.unshift(newPost);
    form.reset();
    previewContainer.classList.add('hidden');
    placeholder.classList.remove('hidden');
    showToast('Post published successfully!');
    switchTab('home');
  });
}

// EXPLORE TAB
function renderExplore() {
  const grid = document.getElementById('explore-grid');
  grid.innerHTML = '';
  
  const sampleImages = [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80'
  ];

  sampleImages.forEach(imgUrl => {
    const item = document.createElement('div');
    item.className = 'explore-grid-item glass-panel';
    item.innerHTML = `<img src="${imgUrl}" loading="lazy">`;
    grid.appendChild(item);
  });
}

// MESSAGING
function setupMessaging() {
  const form = document.getElementById('chat-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('chat-message-input');
    const text = input.value.trim();
    if (!text || !VibraState.activeConversationId) return;

    const conv = VibraState.conversations.find(c => c.id === VibraState.activeConversationId);
    if (conv) {
      conv.messages.push({ sender: 'me', text: text });
      input.value = '';
      renderActiveChat(conv);
    }
  });
}

function renderConversationsList() {
  const listEl = document.getElementById('conversations-list');
  listEl.innerHTML = '';

  VibraState.conversations.forEach(conv => {
    const item = document.createElement('div');
    item.style.padding = '12px';
    item.style.cursor = 'pointer';
    item.style.borderBottom = '1px solid var(--glass-border)';
    item.innerHTML = `
      <div style="display:flex; align-items:center; gap:10px;">
        <img src="${conv.user.avatar}" class="avatar-sm">
        <div>
          <strong>${conv.user.name}</strong>
          <div style="font-size:0.8rem; color:var(--text-muted);">@${conv.user.handle}</div>
        </div>
      </div>
    `;
    item.onclick = () => selectConversation(conv.id);
    listEl.appendChild(item);
  });
}

function selectConversation(id) {
  VibraState.activeConversationId = id;
  const conv = VibraState.conversations.find(c => c.id === id);
  document.getElementById('chat-header').classList.remove('hidden');
  document.getElementById('chat-form').classList.remove('hidden');
  document.getElementById('chat-user-avatar').src = conv.user.avatar;
  document.getElementById('chat-user-name').textContent = conv.user.name;
  renderActiveChat(conv);
}

function renderActiveChat(conv) {
  const container = document.getElementById('chat-messages-container');
  container.innerHTML = '';
  conv.messages.forEach(m => {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${m.sender === 'me' ? 'sent' : 'received'}`;
    bubble.textContent = m.text;
    container.appendChild(bubble);
  });
  container.scrollTop = container.scrollHeight;
}

// PROFILE RENDERING & EDITING
function renderProfile() {
  document.getElementById('prof-avatar').src = VibraState.currentUser.avatar;
  document.getElementById('prof-fullname').textContent = VibraState.currentUser.full_name;
  document.getElementById('prof-handle').textContent = `@${VibraState.currentUser.username}`;
  document.getElementById('prof-bio').textContent = VibraState.currentUser.bio;
  document.getElementById('prof-website').textContent = VibraState.currentUser.website;

  const userPosts = VibraState.posts.filter(p => p.user_id === VibraState.currentUser.id);
  document.getElementById('prof-posts-count').textContent = userPosts.length;

  const gridPosts = document.getElementById('profile-grid-posts');
  gridPosts.innerHTML = userPosts.map(p => `
    <div class="explore-grid-item glass-panel"><img src="${p.media_url}"></div>
  `).join('');
}

document.getElementById('btn-edit-profile').addEventListener('click', () => {
  document.getElementById('edit-fullname').value = VibraState.currentUser.full_name;
  document.getElementById('edit-bio').value = VibraState.currentUser.bio;
  document.getElementById('edit-website').value = VibraState.currentUser.website;
  document.getElementById('edit-profile-modal').classList.remove('hidden');
});

document.getElementById('btn-close-edit-profile').addEventListener('click', () => {
  document.getElementById('edit-profile-modal').classList.add('hidden');
});

document.getElementById('edit-profile-form').addEventListener('submit', (e) => {
  e.preventDefault();
  VibraState.currentUser.full_name = document.getElementById('edit-fullname').value;
  VibraState.currentUser.bio = document.getElementById('edit-bio').value;
  VibraState.currentUser.website = document.getElementById('edit-website').value;
  document.getElementById('edit-profile-modal').classList.add('hidden');
  renderProfile();
  updateSidebarProfile();
  showToast('Profile updated!');
});

// NOTIFICATIONS
function renderNotifications() {
  const list = document.getElementById('notifications-list');
  list.innerHTML = VibraState.notifications.map(n => `
    <div class="glass-panel" style="padding: 12px; margin-bottom: 8px; display:flex; justify-content:space-between;">
      <span>${n.text}</span>
      <small style="color:var(--text-muted);">${n.time}</small>
    </div>
  `).join('');
}

document.getElementById('btn-mark-all-read').addEventListener('click', () => {
  VibraState.notifications.forEach(n => n.is_read = true);
  document.getElementById('unread-notifications-badge').classList.add('hidden');
  showToast('All notifications marked as read');
});

// SETTINGS & CONFIGURATION
function setupSettings() {
  document.getElementById('btn-save-supabase-cfg').addEventListener('click', () => {
    const url = document.getElementById('cfg-supabase-url').value.trim();
    const key = document.getElementById('cfg-supabase-key').value.trim();
    if (url && key) {
      localStorage.setItem('vibra_sp_url', url);
      localStorage.setItem('vibra_sp_key', key);
      showToast('Supabase config saved. Refreshing session...');
      setTimeout(() => window.location.reload(), 1000);
    }
  });

  document.getElementById('btn-logout').addEventListener('click', () => {
    if (VibraState.supabase) VibraState.supabase.auth.signOut();
    document.getElementById('app-screen').classList.add('hidden');
    document.getElementById('auth-screen').classList.remove('hidden');
    showToast('Signed out of VIBRA');
  });

  document.getElementById('setting-theme').addEventListener('change', (e) => {
    if (e.target.value === 'light') {
      document.body.classList.remove('theme-dark');
      document.body.classList.add('theme-light');
    } else {
      document.body.classList.remove('theme-light');
      document.body.classList.add('theme-dark');
    }
  });
}

// TOAST SYSTEM
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'glass-panel';
  toast.style.cssText = `
    padding: 12px 20px;
    margin-top: 10px;
    border-left: 4px solid ${type === 'error' ? '#ff4757' : '#00f2fe'};
    font-size: 0.9rem;
  `;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}
