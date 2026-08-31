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

  // ==========================================
  // IMPORTANT:
  // Hide the application until authentication
  // has been checked.
  // ==========================================

  if (app) {
    app.classList.add("hidden");
  }

  // ==========================================
  // PASSWORD SHOW / HIDE
  // ==========================================

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

  // ==========================================
  // CHECK AUTHENTICATION
  // ==========================================

  const {
    data: { session },
    error: sessionError
  } = await supabaseClient.auth.getSession();

  if (sessionError) {
    console.error(sessionError);
  }

  // ==========================================
  // USER IS LOGGED IN
  // ==========================================

  if (session) {

    showApp();

  } else {

    // User is NOT logged in.
    // Keep the app hidden and show login area.
    showLoginOnly();

  }

  // ==========================================
  // AUTH STATE CHANGES
  // ==========================================

  supabaseClient.auth.onAuthStateChange(
    async (event, session) => {

      if (
        event === "SIGNED_IN" &&
        session
      ) {

        showApp();

        showMessage(
          "Login successful! Welcome to VIBRA ✨"
        );

      }

      if (event === "SIGNED_OUT") {

        hideApp();

        showMessage(
          "You have been logged out."
        );

      }

    }
  );

  // ==========================================
  // SPLASH
  // ==========================================

  function showApp() {

    if (splash) {
      splash.classList.add("hide");

      setTimeout(() => {
        splash.style.display = "none";
      }, 650);
    }

    if (app) {
      app.classList.remove("hidden");
    }

  }

  // ==========================================
  // SHOW LOGIN ONLY
  // ==========================================

  function showLoginOnly() {

    if (splash) {
      splash.classList.add("hide");

      setTimeout(() => {
        splash.style.display = "none";
      }, 650);
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

      }, 250);

    }

  }

  // ==========================================
  // HIDE APP AFTER LOGOUT
  // ==========================================

  function hideApp() {

    if (app) {
      app.classList.add("hidden");
    }

    if (splash) {
      splash.style.display = "none";
    }

  }

  // ==========================================
  // ENTER VIBRA BUTTON
  // ==========================================

  if (startBtn) {

    startBtn.addEventListener("click", async () => {

      const {
        data: { session }
      } = await supabaseClient.auth.getSession();

      if (!session) {

        if (authSection) {

          authSection.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });

        }

        showMessage(
          "Please login or create an account first."
        );

        return;
      }

      showApp();

    });

  }

  // ==========================================
  // LOGIN / SIGNUP
  // ==========================================

  if (loginForm) {

    loginForm.addEventListener(
      "submit",
      async (event) => {

        event.preventDefault();

        const email =
          emailInput.value.trim();

        const password =
          passwordInput.value;

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

          // ==================================
          // TRY LOGIN
          // ==================================

          const {
            data: loginData,
            error: loginError
          } =
            await supabaseClient.auth
              .signInWithPassword({
                email,
                password
              });

          if (!loginError && loginData.session) {

            showMessage(
              "Login successful! Welcome to VIBRA ✨"
            );

            return;

          }

          // ==================================
          // ACCOUNT NOT FOUND
          // ==================================

          if (
            loginError &&
            (
              loginError.message
                .toLowerCase()
                .includes("invalid login") ||
              loginError.message
                .toLowerCase()
                .includes("invalid credentials")
            )
          ) {

            const createAccount =
              confirm(
                "This account was not found or the password is incorrect.\n\nDo you want to create a new VIBRA account?"
              );

            if (!createAccount) {
              return;
            }

            // ==================================
            // CREATE ACCOUNT
            // ==================================

            const {
              data: signupData,
              error: signupError
            } =
              await supabaseClient.auth.signUp({
                email,
                password
              });

            if (signupError) {
              throw signupError;
            }

            // ==================================
            // SIGNUP SUCCESS
            // ==================================

            if (signupData.session) {

              showMessage(
                "🎉 VIBRA account created successfully!"
              );

              showApp();

            } else {

              showMessage(
                "✅ Account created! Please check your email and verify your account."
              );

            }

            return;
          }

          // Other login errors
          if (loginError) {
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

  // ==========================================
  // NOTIFICATIONS
  // ==========================================

  if (notificationBtn) {

    notificationBtn.addEventListener(
      "click",
      async () => {

        const {
          data: { session }
        } =
          await supabaseClient.auth
            .getSession();

        if (!session) {

          showMessage(
            "Please login first."
          );

          return;

        }

        showToast(
          "Notifications will appear here 🔔"
        );

      }
    );

  }

  // ==========================================
  // CREATE BUTTON
  // ==========================================

  if (createBtn) {

    createBtn.addEventListener(
      "click",
      async () => {

        const {
          data: { session }
        } =
          await supabaseClient.auth
            .getSession();

        if (!session) {

          showMessage(
            "Please login first to create a post."
          );

          return;

        }

        showToast(
          "Post creator will be added next."
        );

      }
    );

  }

  // ==========================================
  // NAVIGATION
  // ==========================================

  const navItems =
    document.querySelectorAll(".nav-item");

  navItems.forEach((item) => {

    item.addEventListener(
      "click",
      async () => {

        const {
          data: { session }
        } =
          await supabaseClient.auth
            .getSession();

        if (!session) {

          showMessage(
            "Please login first."
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

  // ==========================================
  // FRIENDLY ERROR
  // ==========================================

  function getFriendlyError(error) {

    const text =
      String(error || "").toLowerCase();

    if (
      text.includes("email not confirmed")
    ) {

      return "Please verify your email before logging in.";

    }

    if (
      text.includes("already registered")
    ) {

      return "This email is already registered. Try logging in.";

    }

    if (
      text.includes("password")
    ) {

      return "Please check your password.";

    }

    if (
      text.includes("rate limit")
    ) {

      return "Too many attempts. Please wait and try again.";

    }

    if (
      text.includes("network")
    ) {

      return "Network error. Please check your internet connection.";

    }

    return "Authentication failed. Please try again.";

  }

  // ==========================================
  // MESSAGE
  // ==========================================

  function showMessage(text) {

    if (!message) return;

    message.textContent = text;
    message.style.opacity = "1";

    setTimeout(() => {

      message.style.opacity = "0";

    }, 5000);

  }

  // ==========================================
  // TOAST
  // ==========================================

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
