const SUPABASE_URL = "https://xxxqsrsjyhxqwzrimydn.supabase.co";
const SUPABASE_KEY = "sb_publishable_X5DDa_Sj5UWNVwS3jD77yg_4g2bX3Eb";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

document.addEventListener("DOMContentLoaded", async () => {

  const splash = document.getElementById("splash");
  const app = document.getElementById("app");
  const startBtn = document.getElementById("startBtn");
  const authSection = document.getElementById("authSection");
  const loginForm = document.getElementById("loginForm");
  const message = document.getElementById("message");
  const notificationBtn = document.getElementById("notificationBtn");
  const createBtn = document.getElementById("createBtn");

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const togglePassword = document.getElementById("togglePassword");

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

      if (passwordInput.type === "password") {

        passwordInput.type = "text";
        togglePassword.textContent = "🙈";
        togglePassword.setAttribute(
          "aria-label",
          "Hide password"
        );

      } else {

        passwordInput.type = "password";
        togglePassword.textContent = "👁️";
        togglePassword.setAttribute(
          "aria-label",
          "Show password"
        );

      }

    });

  }

  /*
  ==========================================
  CHECK EXISTING SUPABASE SESSION
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

    // Already logged in
    showApp();

  } else {

    // NOT logged in
    showLoginScreen();

  }

  /*
  ==========================================
  AUTH STATE LISTENER
  ==========================================
  */

  supabaseClient.auth.onAuthStateChange(
    (event, session) => {

      if (event === "SIGNED_IN" && session) {

        showApp();

        showMessage(
          "Login successful! Welcome to VIBRA ✨"
        );

      }

      if (event === "SIGNED_OUT") {

        hideApp();

        showLoginScreen();

        showMessage(
          "You have been logged out."
        );

      }

    }
  );

  /*
  ==========================================
  SHOW APP ONLY AFTER LOGIN
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
  SHOW LOGIN SCREEN
  ==========================================
  */

  function showLoginScreen() {

    if (splash) {

      splash.classList.add("hide");

      setTimeout(() => {
        splash.style.display = "none";
      }, 500);

    }

    /*
    IMPORTANT:
    App remains hidden until authentication.
    */

    if (app) {
      app.classList.add("hidden");
    }

    if (authSection) {

      authSection.style.display = "block";

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
  HIDE APP
  ==========================================
  */

  function hideApp() {

    if (app) {
      app.classList.add("hidden");
    }

  }

  /*
  ==========================================
  ENTER VIBRA
  ==========================================
  */

  if (startBtn) {

    startBtn.addEventListener("click", async () => {

      const {
        data: { session }
      } = await supabaseClient.auth.getSession();

      if (!session) {

        showLoginScreen();

        showMessage(
          "🔐 Please login or create an account first."
        );

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

    loginForm.addEventListener(
      "submit",
      async (event) => {

        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

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
          ==================================
          TRY LOGIN
          ==================================
          */

          const {
            data: loginData,
            error: loginError
          } =
            await supabaseClient.auth.signInWithPassword({
              email: email,
              password: password
            });

          /*
          ==================================
          LOGIN SUCCESS
          ==================================
          */

          if (!loginError && loginData.session) {

            showMessage(
              "✨ Login successful! Welcome to VIBRA."
            );

            return;

          }

          /*
          ==================================
          LOGIN FAILED
          ==================================
          */

          if (loginError) {

            const errorText =
              loginError.message.toLowerCase();

            /*
            Ask whether user wants to create
            account if credentials are invalid.
            */

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
              ==============================
              CREATE ACCOUNT
              ==============================
              */

              const {
                data: signupData,
                error: signupError
              } =
                await supabaseClient.auth.signUp({
                  email: email,
                  password: password
                });

              if (signupError) {
                throw signupError;
              }

              /*
              ==============================
              ACCOUNT CREATED
              ==============================
              */

              if (signupData.session) {

                showMessage(
                  "🎉 VIBRA account created successfully!"
                );

                showApp();

              } else {

                showMessage(
                  "✅ Account created! Check your email to verify your account."
                );

              }

              return;

            }

            throw loginError;

          }

        } catch (error) {

          console.error(
            "Authentication error:",
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

      }
    );

  }

  /*
  ==========================================
  NOTIFICATION
  ==========================================
  */

  if (notificationBtn) {

    notificationBtn.addEventListener(
      "click",
      async () => {

        const {
          data: { session }
        } =
          await supabaseClient.auth.getSession();

        if (!session) {

          showMessage(
            "🔐 Please login first."
          );

          return;

        }

        showToast(
          "🔔 Notifications will appear here."
        );

      }
    );

  }

  /*
  ==========================================
  CREATE POST
  ==========================================
  */

  if (createBtn) {

    createBtn.addEventListener(
      "click",
      async () => {

        const {
          data: { session }
        } =
          await supabaseClient.auth.getSession();

        if (!session) {

          showMessage(
            "🔐 Please login first to create a post."
          );

          return;

        }

        showToast(
          "✨ Post creator will be added next."
        );

      }
    );

  }

  /*
  ==========================================
  NAVIGATION
  ==========================================
  */

  const navItems =
    document.querySelectorAll(".nav-item");

  navItems.forEach((item) => {

    item.addEventListener(
      "click",
      async () => {

        const {
          data: { session }
        } =
          await supabaseClient.auth.getSession();

        if (!session) {

          showLoginScreen();

          showMessage(
            "🔐 Please login first."
          );

          return;

        }

        navItems.forEach((nav) => {
          nav.classList.remove("active");
        });

        item.classList.add("active");

      }
    );

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
  MESSAGE
  ==========================================
  */

  function showMessage(text) {

    if (!message) return;

    message.textContent = text;
    message.style.opacity = "1";

    setTimeout(() => {

      message.style.opacity = "0";

    }, 5000);

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

    toast.style.position = "fixed";
    toast.style.left = "50%";
    toast.style.bottom = "95px";
    toast.style.transform =
      "translateX(-50%)";

    toast.style.zIndex = "9999";

    toast.style.padding =
      "12px 18px";

    toast.style.borderRadius =
      "14px";

    toast.style.background =
      "rgba(15,17,25,0.95)";

    toast.style.border =
      "1px solid rgba(0,240,255,0.25)";

    toast.style.color =
      "#ffffff";

    toast.style.fontSize =
      "13px";

    toast.style.fontWeight =
      "600";

    toast.style.backdropFilter =
      "blur(15px)";

    toast.style.opacity = "0";

    toast.style.transition =
      "opacity 0.3s ease";

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
