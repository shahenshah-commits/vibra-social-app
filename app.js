/* =========================================================
   VIBRA — AUTHENTICATION SYSTEM
   Login + Create Account + Logout + Password Show/Hide
   Supabase
   ========================================================= */


/* =========================================================
   SUPABASE CONFIG
   ========================================================= */

const SUPABASE_URL =
  "https://xxxqsrsjyhxqwzrimydn.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_X5DDa_Sj5UWNVwS3jD77yg_4g2bX3Eb";


/* =========================================================
   CREATE SUPABASE CLIENT
   ========================================================= */

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


/* =========================================================
   MAIN
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

  /* =======================================================
     GET ELEMENTS
     ======================================================= */

  const splash =
    document.getElementById("splash");

  const app =
    document.getElementById("app");

  const authSection =
    document.getElementById("authSection");

  const homeSection =
    document.getElementById("homeSection");

  const loginForm =
    document.getElementById("loginForm");

  const emailInput =
    document.getElementById("email");

  const passwordInput =
    document.getElementById("password");

  const togglePassword =
    document.getElementById("togglePassword");

  const message =
    document.getElementById("message");

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


  /* =======================================================
     CREATE ACCOUNT BUTTON
     If it doesn't exist in HTML, JavaScript creates it.
     ======================================================= */

  let createAccountBtn =
    document.getElementById("createAccountBtn");

  if (!createAccountBtn && loginForm) {

    createAccountBtn =
      document.createElement("button");

    createAccountBtn.id =
      "createAccountBtn";

    createAccountBtn.type =
      "button";

    createAccountBtn.textContent =
      "Create New Account";

    createAccountBtn.className =
      "secondary-btn";

    loginForm.insertAdjacentElement(
      "afterend",
      createAccountBtn
    );
  }


  /* =======================================================
     LOGOUT BUTTON
     If it doesn't exist, create one.
     ======================================================= */

  let logoutBtn =
    document.getElementById("logoutBtn");

  if (!logoutBtn) {

    logoutBtn =
      document.createElement("button");

    logoutBtn.id =
      "logoutBtn";

    logoutBtn.type =
      "button";

    logoutBtn.textContent =
      "Logout";

    logoutBtn.className =
      "secondary-btn";

    logoutBtn.style.display =
      "none";

    const topbar =
      document.querySelector(".topbar");

    if (topbar) {
      topbar.appendChild(logoutBtn);
    } else if (app) {
      app.prepend(logoutBtn);
    }
  }


  /* =======================================================
     AUTH MODE
     ======================================================= */

  let authMode = "login";


  /* =======================================================
     INITIAL STATE
     ======================================================= */

  if (app) {
    app.classList.remove("hidden");
  }


  /* =======================================================
     SHOW MESSAGE
     ======================================================= */

  function showMessage(text, type = "normal") {

    if (!message) return;

    message.textContent = text;

    message.style.opacity = "1";

    if (type === "error") {
      message.style.color = "#ff6b81";
    } else if (type === "success") {
      message.style.color = "#00e5ff";
    } else {
      message.style.color = "#ffffff";
    }

    clearTimeout(
      window.vibraMessageTimer
    );

    window.vibraMessageTimer =
      setTimeout(() => {

        if (message) {
          message.style.opacity = "0";
        }

      }, 5000);
  }


  /* =======================================================
     TOAST
     ======================================================= */

  function showToast(text) {

    const toast =
      document.createElement("div");

    toast.textContent =
      text;

    Object.assign(
      toast.style,
      {
        position: "fixed",
        left: "50%",
        bottom: "95px",
        transform: "translateX(-50%)",
        zIndex: "99999",
        padding: "13px 20px",
        borderRadius: "15px",
        background: "rgba(10,13,24,.96)",
        border: "1px solid rgba(0,229,255,.35)",
        color: "#ffffff",
        fontSize: "13px",
        fontWeight: "700",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        opacity: "0",
        transition: "opacity .3s ease"
      }
    );

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = "1";
    });

    setTimeout(() => {

      toast.style.opacity = "0";

      setTimeout(() => {
        toast.remove();
      }, 350);

    }, 2500);
  }


  /* =======================================================
     HIDE SPLASH
     ======================================================= */

  function hideSplash() {

    if (!splash) return;

    splash.classList.add("hide");

    setTimeout(() => {

      splash.style.display =
        "none";

    }, 650);
  }


  /* =======================================================
     PASSWORD SHOW / HIDE
     ======================================================= */

  if (
    togglePassword &&
    passwordInput
  ) {

    togglePassword.addEventListener(
      "click",
      () => {

        const isHidden =
          passwordInput.type === "password";

        passwordInput.type =
          isHidden
            ? "text"
            : "password";

        togglePassword.textContent =
          isHidden
            ? "🙈"
            : "👁️";

        togglePassword.setAttribute(
          "aria-label",
          isHidden
            ? "Hide password"
            : "Show password"
        );

      }
    );
  }


  /* =======================================================
     SHOW LOGIN SCREEN
     ======================================================= */

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
      logoutBtn.style.display =
        "none";
    }
  }


  /* =======================================================
     SHOW AUTHENTICATED APP
     ======================================================= */

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
      logoutBtn.style.display =
        "block";
    }

    await loadUserProfile(
      session.user
    );
  }


  /* =======================================================
     LOAD USER PROFILE
     ======================================================= */

  async function loadUserProfile(user) {

    if (!user) return;

    const metadata =
      user.user_metadata || {};

    let profile = null;


    /* =====================================================
       TRY USERS TABLE
       ===================================================== */

    try {

      const {
        data,
        error
      } = await supabaseClient
        .from("users")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (!error) {
        profile = data;
      }

    } catch (error) {

      console.warn(
        "Profile table could not be loaded:",
        error
      );
    }


    /* =====================================================
       USER INFORMATION
       ===================================================== */

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


    /* =====================================================
       UPDATE UI
       ===================================================== */

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


  /* =======================================================
     AUTH FORM MODE
     ======================================================= */

  function updateAuthMode() {

    if (!createAccountBtn) return;

    if (authMode === "login") {

      createAccountBtn.textContent =
        "Create New Account";

    } else {

      createAccountBtn.textContent =
        "← Back to Login";
    }
  }


  /* =======================================================
     CREATE ACCOUNT BUTTON
     ======================================================= */

  if (createAccountBtn) {

    createAccountBtn.addEventListener(
      "click",
      () => {

        if (authMode === "login") {

          authMode = "signup";

          showMessage(
            "Create your new VIBRA account.",
            "normal"
          );

        } else {

          authMode = "login";

          showMessage(
            "Welcome back to VIBRA.",
            "normal"
          );
        }

        updateAuthMode();
      }
    );
  }


  /* =======================================================
     LOGIN / SIGNUP FORM
     ======================================================= */

  if (loginForm) {

    loginForm.addEventListener(
      "submit",
      async (event) => {

        event.preventDefault();


        /* ================================================
           GET VALUES
           ================================================ */

        const email =
          emailInput?.value
            .trim()
            .toLowerCase() || "";


        const password =
          passwordInput?.value || "";


        /* ================================================
           VALIDATION
           ================================================ */

        if (!email) {

          showMessage(
            "Please enter your email.",
            "error"
          );

          return;
        }


        if (!password) {

          showMessage(
            "Please enter your password.",
            "error"
          );

          return;
        }


        if (password.length < 6) {

          showMessage(
            "Password must contain at least 6 characters.",
            "error"
          );

          return;
        }


        /* ================================================
           BUTTON
           ================================================ */

        const submitButton =
          loginForm.querySelector(
            "button[type='submit']"
          );


        if (submitButton) {

          submitButton.disabled =
            true;

          submitButton.dataset.oldText =
            submitButton.textContent;

          submitButton.textContent =
            authMode === "login"
              ? "Logging in..."
              : "Creating account...";
        }


        try {


          /* ==============================================
             LOGIN
             ============================================== */

          if (authMode === "login") {

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


            if (data?.session) {

              await showAuthenticatedApp(
                data.session
              );

              showToast(
                "🎉 Welcome back to VIBRA!"
              );

              showMessage(
                "Login successful!",
                "success"
              );
            }

          }


          /* ==============================================
             SIGN UP
             ============================================== */

          else {

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


            /* ==========================================
               EMAIL CONFIRMATION ON
               ========================================== */

            if (!data.session) {

              showMessage(
                "📧 Account created! Check your email and verify your account before logging in.",
                "success"
              );

              authMode =
                "login";

              updateAuthMode();

            }


            /* ==========================================
               EMAIL CONFIRMATION OFF
               ========================================== */

            else {

              await showAuthenticatedApp(
                data.session
              );

              showToast(
                "🎉 VIBRA account created!"
              );

              showMessage(
                "Account created successfully!",
                "success"
              );
            }
          }


        } catch (error) {

          console.error(
            "VIBRA Auth Error:",
            error
          );


          showMessage(
            friendlyError(
              error?.message
            ),
            "error"
          );


        } finally {

          if (submitButton) {

            submitButton.disabled =
              false;

            submitButton.textContent =
              submitButton.dataset.oldText ||
              "Continue";
          }
        }
      }
    );
  }


  /* =======================================================
     LOGOUT
     ======================================================= */

  if (logoutBtn) {

    logoutBtn.addEventListener(
      "click",
      async () => {

        logoutBtn.disabled =
          true;

        logoutBtn.textContent =
          "Logging out...";


        try {

          const {
            error
          } =
            await supabaseClient.auth
              .signOut();


          if (error) {
            throw error;
          }


          showLogin();

          showMessage(
            "You have been logged out.",
            "success"
          );

          showToast(
            "👋 Logged out successfully."
          );


        } catch (error) {

          console.error(
            "Logout Error:",
            error
          );

          showMessage(
            "Could not logout. Please try again.",
            "error"
          );

        } finally {

          logoutBtn.disabled =
            false;

          logoutBtn.textContent =
            "Logout";
        }
      }
    );
  }


  /* =======================================================
     CHECK EXISTING SESSION
     ======================================================= */

  try {

    const {
      data,
      error
    } =
      await supabaseClient.auth
        .getSession();


    if (error) {
      throw error;
    }


    if (data?.session) {

      await showAuthenticatedApp(
        data.session
      );

    } else {

      showLogin();
    }


  } catch (error) {

    console.error(
      "Session Error:",
      error
    );

    showLogin();

    showMessage(
      "Could not check your login session.",
      "error"
    );
  }


  /* =======================================================
     AUTH STATE CHANGE
     ======================================================= */

  supabaseClient.auth.onAuthStateChange(
    async (event, session) => {

      console.log(
        "VIBRA Auth Event:",
        event
      );


      if (
        event === "SIGNED_IN" &&
        session
      ) {

        await showAuthenticatedApp(
          session
        );
      }


      if (
        event === "SIGNED_OUT"
      ) {

        showLogin();
      }
    }
  );


  /* =======================================================
     REQUIRE LOGIN
     ======================================================= */

  async function requireLogin() {

    const {
      data
    } =
      await supabaseClient.auth
        .getSession();


    if (!data?.session) {

      showLogin();

      showMessage(
        "🔐 Please login first.",
        "error"
      );

      return false;
    }


    return true;
  }


  /* =======================================================
     CREATE POST
     ======================================================= */

  if (createBtn) {

    createBtn.addEventListener(
      "click",
      async () => {

        if (
          !(await requireLogin())
        ) {
          return;
        }

        showToast(
          "✨ Post creator is coming next."
        );
      }
    );
  }


  if (createPostBtn) {

    createPostBtn.addEventListener(
      "click",
      async () => {

        if (
          !(await requireLogin())
        ) {
          return;
        }

        showToast(
          "✨ Post creator is coming next."
        );
      }
    );
  }


  /* =======================================================
     NOTIFICATIONS
     ======================================================= */

  if (notificationBtn) {

    notificationBtn.addEventListener(
      "click",
      async () => {

        if (
          !(await requireLogin())
        ) {
          return;
        }

        showToast(
          "🔔 Notifications are coming next."
        );
      }
    );
  }


  /* =======================================================
     NAVIGATION
     ======================================================= */

  const navItems =
    document.querySelectorAll(
      ".nav-item"
    );


  navItems.forEach(
    (item) => {

      item.addEventListener(
        "click",
        async () => {

          if (
            !(await requireLogin())
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
    }
  );


  /* =======================================================
     FRIENDLY ERROR
     ======================================================= */

  function friendlyError(error) {

    const text =
      String(error || "")
        .toLowerCase();


    if (
      text.includes(
        "invalid login credentials"
      ) ||
      text.includes(
        "invalid credentials"
      )
    ) {

      return (
        "❌ Email or password is incorrect."
      );
    }


    if (
      text.includes(
        "email not confirmed"
      )
    ) {

      return (
        "📧 Please verify your email first."
      );
    }


    if (
      text.includes(
        "user already registered"
      ) ||
      text.includes(
        "already registered"
      )
    ) {

      return (
        "⚠️ This email is already registered. Please login."
      );
    }


    if (
      text.includes(
        "password should be at least"
      )
    ) {

      return (
        "🔐 Password must contain at least 6 characters."
      );
    }


    if (
      text.includes(
        "rate limit"
      )
    ) {

      return (
        "⏳ Too many attempts. Please wait a little and try again."
      );
    }


    if (
      text.includes(
        "network"
      ) ||
      text.includes(
        "fetch"
      )
    ) {

      return (
        "🌐 Network error. Check your internet connection."
      );
    }


    if (
      text.includes(
        "failed to fetch"
      )
    ) {

      return (
        "🌐 Could not connect to Supabase. Check the Supabase URL and internet connection."
      );
    }


    return (
      "❌ Something went wrong. Please try again."
    );
  }


  /* =======================================================
     FINAL
     ======================================================= */

  updateAuthMode();

});
