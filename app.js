const SUPABASE_URL = "https://xxxqsrsjyhxqwzrimydn.supabase.co";
const SUPABASE_KEY = "sb_publishable_X5DDa_Sj5UWNVwS3jD77yg_4g2bX3Eb";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

document.addEventListener("DOMContentLoaded", async () => {

  const splash = document.getElementById("splash");
  const app = document.getElementById("app");
  const authSection = document.getElementById("authSection");
  const loginForm = document.getElementById("loginForm");
  const message = document.getElementById("message");
  const passwordInput = document.getElementById("password");
  const togglePassword = document.getElementById("togglePassword");
  const startBtn = document.getElementById("startBtn");
  const notificationBtn = document.getElementById("notificationBtn");
  const createBtn = document.getElementById("createBtn");

  /*
  ==========================================
  INITIAL STATE
  ==========================================
  */

  if (app) {
    app.classList.add("hidden");
  }

  /*
  ==========================================
  PASSWORD SHOW / HIDE
  ==========================================
  */

  if (togglePassword && passwordInput) {

    togglePassword.addEventListener("click", () => {

      const isHidden = passwordInput.type === "password";

      passwordInput.type = isHidden ? "text" : "password";

      togglePassword.textContent = isHidden ? "🙈" : "👁️";

      togglePassword.setAttribute(
        "aria-label",
        isHidden ? "Hide password" : "Show password"
      );

    });

  }

  /*
  ==========================================
  SHOW MESSAGE
  ==========================================
  */

  function showMessage(text) {

    if (!message) return;

    message.textContent = text;
    message.style.opacity = "1";

    clearTimeout(window.vibraMessageTimer);

    window.vibraMessageTimer = setTimeout(() => {
      message.style.opacity = "0";
    }, 5000);
  }

  /*
  ==========================================
  SHOW APP
  ==========================================
  */

  function showApp() {

    if (splash) {
      splash.classList.add("hide");

      setTimeout(() => {
        splash.style.display = "none";
      }, 500);
    }

    if (app) {
      app.classList.remove("hidden");
    }

  }

  /*
  ==========================================
  SHOW LOGIN
  ==========================================
  */

  function showLogin() {

    if (splash) {
      splash.classList.add("hide");

      setTimeout(() => {
        splash.style.display = "none";
      }, 500);
    }

    if (app) {
      app.classList.remove("hidden");
    }

    if (authSection) {
      setTimeout(() => {
        authSection.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }, 300);
    }

  }

  /*
  ==========================================
  CHECK CURRENT SESSION
  ==========================================
  */

  const {
    data: { session },
    error
  } = await supabaseClient.auth.getSession();

  if (error) {
    console.error("Session error:", error);
  }

  if (session) {
    showApp();
  } else {
    showLogin();
  }

  /*
  ==========================================
  AUTH STATE LISTENER
  ==========================================
  */

  supabaseClient.auth.onAuthStateChange((event, session) => {

    if (event === "SIGNED_IN" && session) {
      showApp();

      showMessage(
        "🎉 Login successful! Welcome to VIBRA."
      );
    }

    if (event === "SIGNED_OUT") {

      if (app) {
        app.classList.add("hidden");
      }

      showLogin();

      showMessage(
        "You have been logged out."
      );
    }

  });

  /*
  ==========================================
  ENTER VIBRA BUTTON
  ==========================================
  */

  if (startBtn) {

    startBtn.addEventListener("click", async () => {

      const {
        data: { session }
      } = await supabaseClient.auth.getSession();

      if (!session) {

        showMessage(
          "🔐 Please login or create an account first."
        );

        if (authSection) {
          authSection.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }

        return;
      }

      showApp();

    });

  }

  /*
  ==========================================
  LOGIN / CREATE ACCOUNT
  ==========================================
  */

  if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

      event.preventDefault();

      const emailInput =
        document.getElementById("email");

      const email =
        emailInput ? emailInput.value.trim() : "";

      const password =
        passwordInput ? passwordInput.value : "";

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

      const button =
        loginForm.querySelector(
          "button[type='submit']"
        );

      if (button) {
        button.disabled = true;
        button.textContent = "Connecting...";
      }

      try {

        /*
        ======================================
        TRY LOGIN
        ======================================
        */

        const {
          data,
          error: loginError
        } = await supabaseClient.auth.signInWithPassword({
          email,
          password
        });

        if (!loginError && data.session) {

          showMessage(
            "🎉 Login successful! Welcome to VIBRA."
          );

          showApp();

          return;
        }

        /*
        ======================================
        ACCOUNT NOT FOUND
        ======================================
        */

        if (loginError) {

          const errorText =
            loginError.message.toLowerCase();

          if (
            errorText.includes("invalid login") ||
            errorText.includes("invalid credentials")
          ) {

            const createAccount = confirm(
              "This account was not found or the password is incorrect.\n\nDo you want to create a new VIBRA account?"
            );

            if (!createAccount) {
              return;
            }

            /*
            ==================================
            CREATE ACCOUNT
            ==================================
            */

            const {
              data: signupData,
              error: signupError
            } = await supabaseClient.auth.signUp({
              email,
              password
            });

            if (signupError) {
              throw signupError;
            }

            if (signupData.session) {

              showMessage(
                "🎉 VIBRA account created successfully!"
              );

              showApp();

            } else {

              showMessage(
                "✅ Account created. Check your email to verify your account."
              );

            }

            return;
          }

          throw loginError;
        }

      } catch (error) {

        console.error(
          "VIBRA authentication error:",
          error
        );

        showMessage(
          getFriendlyError(error.message)
        );

      } finally {

        if (button) {
          button.disabled = false;
          button.textContent = "Continue";
        }

      }

    });

  }

  /*
  ==========================================
  NOTIFICATION
  ==========================================
  */

  if (notificationBtn) {

    notificationBtn.addEventListener("click", async () => {

      const {
        data: { session }
      } = await supabaseClient.auth.getSession();

      if (!session) {

        showMessage(
          "🔐 Please login first."
        );

        return;
      }

      showToast(
        "🔔 Notifications are coming next."
      );

    });

  }

  /*
  ==========================================
  CREATE POST
  ==========================================
  */

  if (createBtn) {

    createBtn.addEventListener("click", async () => {

      const {
        data: { session }
      } = await supabaseClient.auth.getSession();

      if (!session) {

        showMessage(
          "🔐 Please login first to create a post."
        );

        return;
      }

      showToast(
        "✨ Post creator is ready for the next phase."
      );

    });

  }

  /*
  ==========================================
  NAVIGATION
  ==========================================
  */

  const navItems =
    document.querySelectorAll(".nav-item");

  navItems.forEach((item) => {

    item.addEventListener("click", async () => {

      const {
        data: { session }
      } = await supabaseClient.auth.getSession();

      if (!session) {

        showMessage(
          "🔐 Please login first."
        );

        return;
      }

      navItems.forEach((nav) => {
        nav.classList.remove("active");
      });

      item.classList.add("active");

    });

  });

  /*
  ==========================================
  FRIENDLY ERRORS
  ==========================================
  */

  function getFriendlyError(error) {

    const text =
      String(error || "").toLowerCase();

    if (text.includes("email not confirmed")) {
      return "📧 Please verify your email before logging in.";
    }

    if (text.includes("already registered")) {
      return "This email is already registered. Please login.";
    }

    if (text.includes("password")) {
      return "Please check your password.";
    }

    if (text.includes("rate limit")) {
      return "Too many attempts. Please wait and try again.";
    }

    if (text.includes("network")) {
      return "Network error. Check your internet connection.";
    }

    return "Authentication failed. Please try again.";
  }

  /*
  ==========================================
  TOAST
  ==========================================
  */

  function showToast(text) {

    const toast =
      document.createElement("div");

    toast.textContent = text;

    Object.assign(toast.style, {
      position: "fixed",
      left: "50%",
      bottom: "95px",
      transform: "translateX(-50%)",
      zIndex: "99999",
      padding: "13px 20px",
      borderRadius: "15px",
      background: "rgba(12,15,25,0.96)",
      border: "1px solid rgba(0,240,255,0.3)",
      color: "#fff",
      fontSize: "13px",
      fontWeight: "600",
      backdropFilter: "blur(18px)",
      boxShadow: "0 0 30px rgba(0,240,255,0.15)",
      opacity: "0",
      transition: "all .3s ease"
    });

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

});
