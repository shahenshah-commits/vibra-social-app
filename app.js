/* =========================================
   VIBRA — FINAL APP.JS
   Login
   Create Account
   Logout
   Password Show/Hide
   Session Handling
========================================= */


/* =========================================
   SUPABASE CONFIG
========================================= */

const SUPABASE_URL =
  "https://xxxqsrsjyhxqwzrimydn.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_X5DDa_Sj5UWNVwS3jD77yg_4g2bX3Eb";


/* =========================================
   CREATE SUPABASE CLIENT
========================================= */

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


/* =========================================
   DOM READY
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    /* -------------------------------------
       ELEMENTS
    ------------------------------------- */

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

    const loginBtn =
      document.getElementById("loginBtn");

    const createAccountBtn =
      document.getElementById("createAccountBtn");

    const logoutBtn =
      document.getElementById("logoutBtn");

    const togglePassword =
      document.getElementById("togglePassword");

    const emailInput =
      document.getElementById("email");

    const passwordInput =
      document.getElementById("password");

    const message =
      document.getElementById("message");

    const notificationBtn =
      document.getElementById("notificationBtn");

    const createBtn =
      document.getElementById("createBtn");

    const createPostBtn =
      document.getElementById("createPostBtn");


    /* PROFILE */

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


    /* =====================================
       INITIAL STATE
    ===================================== */

    if (app) {
      app.classList.remove("hidden");
    }

    if (authSection) {
      authSection.classList.remove("hidden");
    }

    if (homeSection) {
      homeSection.classList.add("hidden");
    }


    /* =====================================
       MESSAGE
    ===================================== */

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


    /* =====================================
       TOAST
    ===================================== */

    function showToast(text) {

      const toast =
        document.createElement("div");

      toast.textContent = text;

      Object.assign(
        toast.style,
        {
          position: "fixed",
          left: "50%",
          bottom: "100px",
          transform: "translateX(-50%)",
          zIndex: "999999",

          padding: "14px 20px",

          borderRadius: "15px",

          background:
            "rgba(10,14,25,0.96)",

          border:
            "1px solid rgba(0,230,255,0.25)",

          color: "#ffffff",

          fontSize: "13px",
          fontWeight: "700",

          boxShadow:
            "0 15px 40px rgba(0,0,0,.4)",

          opacity: "0",

          transition:
            "opacity .25s ease"
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
        }, 300);

      }, 2500);
    }


    /* =====================================
       SPLASH
    ===================================== */

    function hideSplash() {

      if (!splash) return;

      splash.classList.add("hide");

      setTimeout(() => {

        splash.style.display = "none";

      }, 650);
    }


    /* =====================================
       PASSWORD SHOW / HIDE
    ===================================== */

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


    /* =====================================
       GET USER NAME
    ===================================== */

    function getUserName(user) {

      if (!user) {
        return "VIBRA User";
      }

      const metadata =
        user.user_metadata || {};

      return (
        metadata.full_name ||
        metadata.name ||
        metadata.username ||
        user.email?.split("@")[0] ||
        "VIBRA User"
      );
    }


    /* =====================================
       SHOW LOGIN
    ===================================== */

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


    /* =====================================
       SHOW HOME
    ===================================== */

    async function showAuthenticatedApp(
      session
    ) {

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

      await loadUserProfile(
        session.user
      );
    }


    /* =====================================
       LOAD USER PROFILE
    ===================================== */

    async function loadUserProfile(user) {

      if (!user) return;

      const name =
        getUserName(user);

      const metadata =
        user.user_metadata || {};

      const username =
        metadata.username ||
        user.email?.split("@")[0] ||
        "vibra_user";

      const bio =
        metadata.bio ||
        "Welcome to VIBRA.";


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
          "@" + username;
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
        postCount.textContent = "0";
      }

      if (followersCount) {
        followersCount.textContent = "0";
      }

      if (followingCount) {
        followingCount.textContent = "0";
      }
    }


    /* =====================================
       LOGIN
    ===================================== */

    if (loginForm) {

      loginForm.addEventListener(
        "submit",
        async (event) => {

          event.preventDefault();

          const email =
            emailInput?.value
              .trim()
              .toLowerCase() || "";

          const password =
            passwordInput?.value || "";


          /* VALIDATION */

          if (!email) {

            showMessage(
              "Please enter your email."
            );

            emailInput?.focus();

            return;
          }


          if (!password) {

            showMessage(
              "Please enter your password."
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


          /* BUTTON */

          if (loginBtn) {

            loginBtn.disabled = true;

            loginBtn.textContent =
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


            if (!data.session) {

              showMessage(
                "Login completed. Please check your session."
              );

              return;
            }


            await showAuthenticatedApp(
              data.session
            );

            showToast(
              "🎉 Welcome to VIBRA!"
            );


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

            if (loginBtn) {

              loginBtn.disabled = false;

              loginBtn.textContent =
                "Login";
            }

          }

        }
      );

    }


    /* =====================================
       CREATE NEW ACCOUNT
    ===================================== */

    if (createAccountBtn) {

      createAccountBtn.addEventListener(
        "click",
        async () => {

          const email =
            emailInput?.value
              .trim()
              .toLowerCase() || "";

          const password =
            passwordInput?.value || "";


          if (!email) {

            showMessage(
              "Enter your email first."
            );

            emailInput?.focus();

            return;
          }


          if (!password) {

            showMessage(
              "Enter a password first."
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
            "Creating Account...";


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


            /*
              Supabase may require email
              confirmation depending on
              your project settings.
            */

            if (data.session) {

              await showAuthenticatedApp(
                data.session
              );

              showToast(
                "🎉 VIBRA account created!"
              );

            } else {

              showMessage(
                "📧 Account created! Check your email and verify your account before logging in."
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


    /* =====================================
       LOGOUT
    ===================================== */

    if (logoutBtn) {

      logoutBtn.addEventListener(
        "click",
        async () => {

          logoutBtn.disabled = true;

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

            showToast(
              "You have been logged out."
            );


          } catch (error) {

            console.error(
              "Logout error:",
              error
            );

            showMessage(
              "Could not logout. Please try again."
            );

          } finally {

            logoutBtn.disabled = false;

            logoutBtn.textContent =
              "Logout";
          }

        }
      );

    }


    /* =====================================
       SESSION CHECK
    ===================================== */

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


      if (data.session) {

        await showAuthenticatedApp(
          data.session
        );

      } else {

        showLogin();

      }

    } catch (error) {

      console.error(
        "Session error:",
        error
      );

      showLogin();

    }


    /* =====================================
       AUTH STATE CHANGE
    ===================================== */

    supabaseClient.auth
      .onAuthStateChange(
        async (event, session) => {

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


    /* =====================================
       NOTIFICATIONS
    ===================================== */

    if (notificationBtn) {

      notificationBtn.addEventListener(
        "click",
        () => {

          showToast(
            "🔔 No new notifications."
          );

        }
      );

    }


    /* =====================================
       CREATE POST
    ===================================== */

    function createPost() {

      showToast(
        "✨ Post creator is coming next."
      );

    }


    if (createBtn) {

      createBtn.addEventListener(
        "click",
        createPost
      );

    }


    if (createPostBtn) {

      createPostBtn.addEventListener(
        "click",
        createPost
      );

    }


    /* =====================================
       NAVIGATION
    ===================================== */

    const navItems =
      document.querySelectorAll(
        ".nav-item"
      );


    navItems.forEach(
      (item) => {

        item.addEventListener(
          "click",
          () => {

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


            if (page === "home") {

              window.scrollTo({
                top: 0,
                behavior: "smooth"
              });

            }


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
                "◯ Your profile is shown above."
              );

            }

          }
        );

      }
    );


    /* =====================================
       FRIENDLY ERRORS
    ===================================== */

    function friendlyError(error) {

      const text =
        String(error || "")
          .toLowerCase();


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
          "⏳ Too many attempts. Please wait and try again."
        );

      }


      if (
        text.includes(
          "network"
        )
      ) {

        return (
          "🌐 Network error. Check your internet connection."
        );

      }


      return (
        "Something went wrong. Please try again."
      );

    }

  }
);
