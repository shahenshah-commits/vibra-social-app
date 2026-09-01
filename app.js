const SUPABASE_URL =
  "https://xxxqsrsjyhxqwzrimydn.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_X5DDa_Sj5UWNVwS3jD77yg_4g2bX3Eb";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


document.addEventListener("DOMContentLoaded", async () => {

  // ==========================================
  // ELEMENTS
  // ==========================================

  const splash = document.getElementById("splash");
  const app = document.getElementById("app");

  const authSection =
    document.getElementById("authSection");

  const homeSection =
    document.getElementById("homeSection");

  const loginForm =
    document.getElementById("loginForm");

  const createAccountBtn =
    document.getElementById("createAccountBtn");

  const message =
    document.getElementById("message");

  const emailInput =
    document.getElementById("email");

  const passwordInput =
    document.getElementById("password");

  const togglePassword =
    document.getElementById("togglePassword");

  const logoutBtn =
    document.getElementById("logoutBtn");

  const notificationBtn =
    document.getElementById("notificationBtn");

  const createBtn =
    document.getElementById("createBtn");

  const createPostBtn =
    document.getElementById("createPostBtn");

  const welcomeName =
    document.getElementById("welcomeName");

  const profileName =
    document.getElementById("profileName");

  const profileUsername =
    document.getElementById("profileUsername");

  const profileBio =
    document.getElementById("profileBio");

  const profileInitial =
    document.getElementById("profileInitial");

  const postCount =
    document.getElementById("postCount");

  const followersCount =
    document.getElementById("followersCount");

  const followingCount =
    document.getElementById("followingCount");


  // ==========================================
  // INITIAL SECURITY STATE
  // ==========================================

  if (app) {
    app.classList.add("hidden");
  }

  if (homeSection) {
    homeSection.classList.add("hidden");
  }

  if (authSection) {
    authSection.classList.add("hidden");
  }


  // ==========================================
  // PASSWORD SHOW / HIDE
  // ==========================================

  if (togglePassword && passwordInput) {

    togglePassword.addEventListener("click", () => {

      const isHidden =
        passwordInput.type === "password";

      passwordInput.type =
        isHidden ? "text" : "password";

      togglePassword.textContent =
        isHidden ? "🙈" : "👁️";

      togglePassword.setAttribute(
        "aria-label",
        isHidden
          ? "Hide password"
          : "Show password"
      );

      togglePassword.setAttribute(
        "title",
        isHidden
          ? "Hide password"
          : "Show password"
      );

    });

  }


  // ==========================================
  // MESSAGE
  // ==========================================

  function showMessage(text) {

    if (!message) return;

    message.textContent = text;
    message.style.opacity = "1";

    clearTimeout(
      window.vibraMessageTimer
    );

    window.vibraMessageTimer =
      setTimeout(() => {

        message.style.opacity = "0";

      }, 5000);

  }


  // ==========================================
  // SPLASH
  // ==========================================

  function hideSplash() {

    if (!splash) return;

    splash.classList.add("hide");

    setTimeout(() => {

      splash.style.display = "none";

    }, 600);

  }


  // ==========================================
  // SHOW LOGIN
  // ==========================================

  function showLogin() {

    hideSplash();

    if (app) {
      app.classList.remove("hidden");
    }

    if (authSection) {
      authSection.classList.remove("hidden");
    }

    if (homeSection) {
      homeSection.classList.add("hidden");
    }

    if (logoutBtn) {
      logoutBtn.style.display = "none";
    }

  }


  // ==========================================
  // SHOW AUTHENTICATED APP
  // ==========================================

  async function showAuthenticatedApp(session) {

    if (!session) {

      showLogin();

      return;

    }

    hideSplash();

    if (app) {
      app.classList.remove("hidden");
    }

    if (authSection) {
      authSection.classList.add("hidden");
    }

    if (homeSection) {
      homeSection.classList.remove("hidden");
    }

    if (logoutBtn) {
      logoutBtn.style.display = "block";
    }

    await loadUserProfile(session.user);

  }


  // ==========================================
  // LOAD USER PROFILE
  // ==========================================

  async function loadUserProfile(user) {

    if (!user) return;

    const userId = user.id;

    let profile = null;

    try {

      const result =
        await supabaseClient
          .from("users")
          .select("*")
          .eq("id", userId)
          .maybeSingle();

      if (result.error) {

        console.error(
          "Profile error:",
          result.error
        );

      }

      profile = result.data;

    } catch (error) {

      console.error(
        "Could not load profile:",
        error
      );

    }


    // ========================================
    // AUTH USER METADATA
    // ========================================

    const metadata =
      user.user_metadata || {};


    const name =
      profile?.full_name ||
      profile?.name ||
      metadata.full_name ||
      metadata.name ||
      user.email?.split("@")[0] ||
      "VIBRA User";


    const username =
      profile?.username ||
      metadata.username ||
      "";


    const bio =
      profile?.bio ||
      metadata.bio ||
      "Welcome to VIBRA.";


    const posts =
      Number(
        profile?.post_count ||
        profile?.posts_count ||
        0
      );


    const followers =
      Number(
        profile?.followers_count ||
        0
      );


    const following =
      Number(
        profile?.following_count ||
        0
      );


    // ========================================
    // UPDATE UI
    // ========================================

    if (welcomeName) {

      welcomeName.textContent =
        name;

    }

    if (profileName) {

      profileName.textContent =
        name;

    }

    if (profileUsername) {

      profileUsername.textContent =
        username
          ? `@${username}`
          : "@vibra_user";

    }

    if (profileBio) {

      profileBio.textContent =
        bio;

    }

    if (profileInitial) {

      profileInitial.textContent =
        name
          .charAt(0)
          .toUpperCase();

    }

    if (postCount) {

      postCount.textContent =
        posts;

    }

    if (followersCount) {

      followersCount.textContent =
        followers;

    }

    if (followingCount) {

      followingCount.textContent =
        following;

    }

  }


  // ==========================================
  // CHECK CURRENT SESSION
  // ==========================================

  const {
    data: {
      session
    },
    error: sessionError
  } =
    await supabaseClient.auth.getSession();


  if (sessionError) {

    console.error(
      "Session error:",
      sessionError
    );

  }


  if (session) {

    await showAuthenticatedApp(
      session
    );

  } else {

    showLogin();

  }


  // ==========================================
  // AUTH STATE CHANGE
  // ==========================================

  supabaseClient.auth.onAuthStateChange(
    async (event, session) => {

      if (
        event === "SIGNED_IN" &&
        session
      ) {

        await showAuthenticatedApp(
          session
        );

        showMessage(
          "🎉 Welcome to VIBRA!"
        );

      }


      if (
        event === "SIGNED_OUT"
      ) {

        if (app) {
          app.classList.add("hidden");
        }

        showLogin();

        showMessage(
          "You have been logged out."
        );

      }

    }
  );


  // ==========================================
  // LOGIN
  // ==========================================

  if (loginForm) {

    loginForm.addEventListener(
      "submit",
      async (event) => {

        event.preventDefault();


        const email =
          emailInput?.value.trim() || "";


        const password =
          passwordInput?.value || "";


        if (!email || !password) {

          showMessage(
            "Please enter your email and password."
          );

          return;

        }


        if (password.length < 6) {

          showMessage(
            "Password must contain at least 6 characters."
          );

          return;

        }


        const loginButton =
          loginForm.querySelector(
            "button[type='submit']"
          );


        if (loginButton) {

          loginButton.disabled = true;

          loginButton.textContent =
            "Logging in...";

        }


        try {

          const {
            data,
            error
          } =
            await supabaseClient.auth
              .signInWithPassword({
                email,
                password
              });


          if (error) {

            throw error;

          }


          if (data.session) {

            await showAuthenticatedApp(
              data.session
            );

            showMessage(
              "🎉 Login successful!"
            );

          }

        } catch (error) {

          console.error(
            "Login error:",
            error
          );

          showMessage(
            friendlyError(
              error?.message
            )
          );

        } finally {

          if (loginButton) {

            loginButton.disabled =
              false;

            loginButton.textContent =
              "Login";

          }

        }

      }
    );

  }


  // ==========================================
  // CREATE NEW ACCOUNT
  // ==========================================

  if (createAccountBtn) {

    createAccountBtn.addEventListener(
      "click",
      async () => {

        const email =
          emailInput?.value.trim() || "";


        const password =
          passwordInput?.value || "";


        if (!email) {

          showMessage(
            "Please enter your email first."
          );

          emailInput?.focus();

          return;

        }


        if (!password) {

          showMessage(
            "Please enter a password."
          );

          passwordInput?.focus();

          return;

        }


        if (password.length < 6) {

          showMessage(
            "Password must contain at least 6 characters."
          );

          return;

        }


        createAccountBtn.disabled =
          true;

        createAccountBtn.textContent =
          "Creating account...";


        try {

          const {
            data,
            error
          } =
            await supabaseClient.auth
              .signUp({
                email,
                password
              });


          if (error) {

            throw error;

          }


          // ==================================
          // EMAIL CONFIRMATION OFF
          // ==================================

          if (data.session) {

            await showAuthenticatedApp(
              data.session
            );

            showMessage(
              "🎉 Your VIBRA account has been created!"
            );

          }

          // ==================================
          // EMAIL CONFIRMATION ON
          // ==================================

          else {

            showMessage(
              "📧 Account created! Please check your email and verify your account."
            );

          }

        } catch (error) {

          console.error(
            "Signup error:",
            error
          );

          showMessage(
            friendlyError(
              error?.message
            )
          );

        } finally {

          createAccountBtn.disabled =
            false;

          createAccountBtn.textContent =
            "Create New Account";

        }

      }
    );

  }


  // ==========================================
  // LOGOUT
  // ==========================================

  if (logoutBtn) {

    logoutBtn.addEventListener(
      "click",
      async () => {

        logoutBtn.disabled =
          true;

        logoutBtn.textContent =
          "Logging out...";


        const {
          error
        } =
          await supabaseClient.auth
            .signOut();


        if (error) {

          console.error(
            "Logout error:",
            error
          );

          showMessage(
            "Could not logout. Please try again."
          );

          logoutBtn.disabled =
            false;

          logoutBtn.textContent =
            "Logout";

          return;

        }


        logoutBtn.disabled =
          false;

        logoutBtn.textContent =
          "Logout";

      }
    );

  }


  // ==========================================
  // REQUIRE LOGIN
  // ==========================================

  async function requireLogin() {

    const {
      data: {
        session
      }
    } =
      await supabaseClient.auth
        .getSession();


    if (!session) {

      showLogin();

      showMessage(
        "🔐 Please login first."
      );

      return false;

    }

    return true;

  }


  // ==========================================
  // CREATE BUTTON
  // ==========================================

  if (createBtn) {

    createBtn.addEventListener(
      "click",
      async () => {

        if (
          !await requireLogin()
        ) {
          return;
        }

        showToast(
          "✨ Post creator is coming next."
        );

      }
    );

  }


  // ==========================================
  // CREATE POST BUTTON
  // ==========================================

  if (createPostBtn) {

    createPostBtn.addEventListener(
      "click",
      async () => {

        if (
          !await requireLogin()
        ) {
          return;
        }

        showToast(
          "✨ Post creator is coming next."
        );

      }
    );

  }


  // ==========================================
  // NOTIFICATIONS
  // ==========================================

  if (notificationBtn) {

    notificationBtn.addEventListener(
      "click",
      async () => {

        if (
          !await requireLogin()
        ) {
          return;
        }

        showToast(
          "🔔 Notifications will appear here."
        );

      }
    );

  }


  // ==========================================
  // NAVIGATION
  // ==========================================

  const navItems =
    document.querySelectorAll(
      ".nav-item"
    );


  navItems.forEach((item) => {

    item.addEventListener(
      "click",
      async () => {

        if (
          !await requireLogin()
        ) {
          return;
        }


        navItems.forEach(
          (nav) => {

            nav.classList.remove(
              "active"
            );

          }
        );


        item.classList.add(
          "active"
        );


        const page =
          item.dataset.page;


        if (page === "explore") {

          showToast(
            "🔎 Explore is coming next."
          );

        }


        if (page === "reels") {

          showToast(
            "▶ Reels is coming next."
          );

        }


        if (page === "profile") {

          showToast(
            "◯ Profile is coming next."
          );

        }

      }
    );

  });


  // ==========================================
  // FRIENDLY ERRORS
  // ==========================================

  function friendlyError(error) {

    const text =
      String(
        error || ""
      ).toLowerCase();


    if (
      text.includes(
        "email not confirmed"
      )
    ) {

      return "📧 Please verify your email first.";

    }


    if (
      text.includes(
        "already registered"
      )
    ) {

      return "This email is already registered. Please login.";

    }


    if (
      text.includes(
        "invalid login"
      ) ||
      text.includes(
        "invalid credentials"
      )
    ) {

      return "❌ Email or password is incorrect.";

    }


    if (
      text.includes(
        "password"
      )
    ) {

      return "Please check your password.";

    }


    if (
      text.includes(
        "rate limit"
      )
    ) {

      return "Too many attempts. Please wait and try again.";

    }


    if (
      text.includes(
        "network"
      )
    )
    {

      return "🌐 Network error. Check your internet connection.";

    }


    return "Something went wrong. Please try again.";

  }


  // ==========================================
  // TOAST
  // ==========================================

  function showToast(text) {

    const toast =
      document.createElement(
        "div"
      );


    toast.textContent =
      text;


    Object.assign(
      toast.style,
      {

        position: "fixed",

        left: "50%",

        bottom: "95px",

        transform:
          "translateX(-50%)",

        zIndex: "99999",

        padding:
          "13px 20px",

        borderRadius:
          "15px",

        background:
          "rgba(12,15,25,0.96)",

        border:
          "1px solid rgba(0,240,255,0.3)",

        color:
          "#ffffff",

        fontSize:
          "13px",

        fontWeight:
          "600",

        backdropFilter:
          "blur(18px)",

        opacity: "0",

        transition:
          "all .3s ease"

      }
    );


    document.body.appendChild(
      toast
    );


    requestAnimationFrame(
      () => {

        toast.style.opacity =
          "1";

      }
    );


    setTimeout(
      () => {

        toast.style.opacity =
          "0";


        setTimeout(
          () => {

            toast.remove();

          },
          350
        );

      },
      2500
    );

  }

});
