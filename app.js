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

  // ==========================
  // SPLASH SCREEN
  // ==========================

  setTimeout(() => {
    if (splash) splash.classList.add("hide");

    setTimeout(() => {
      if (splash) splash.style.display = "none";
      if (app) app.classList.remove("hidden");
    }, 650);

  }, 1800);


  // ==========================
  // ENTER VIBRA
  // ==========================

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      if (authSection) {
        authSection.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }
    });
  }


  // ==========================
  // CHECK CURRENT SESSION
  // ==========================

  const {
    data: { session }
  } = await supabaseClient.auth.getSession();

  if (session) {
    showMessage(
      `Welcome back, ${session.user.email}!`
    );
  }


  // ==========================
  // AUTH STATE LISTENER
  // ==========================

  supabaseClient.auth.onAuthStateChange((event, session) => {

    if (event === "SIGNED_IN" && session) {
      showMessage(
        `Successfully signed in as ${session.user.email}`
      );
    }

    if (event === "SIGNED_OUT") {
      showMessage("You have been logged out.");
    }

  });


  // ==========================
  // LOGIN / SIGNUP
  // ==========================

  if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

      event.preventDefault();

      const email =
        document.getElementById("email").value.trim();

      const password =
        document.getElementById("password").value;

      message.textContent = "";

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

      const submitButton =
        loginForm.querySelector("button[type='submit']");

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Connecting...";
      }

      try {

        // First try LOGIN
        const { data, error } =
          await supabaseClient.auth.signInWithPassword({
            email,
            password
          });

        if (error) {

          // If account doesn't exist, offer signup
          if (
            error.message.toLowerCase().includes("invalid login")
          ) {

            const createAccount =
              confirm(
                "This account was not found.\n\nDo you want to create a new VIBRA account?"
              );

            if (createAccount) {

              const { data: signupData, error: signupError } =
                await supabaseClient.auth.signUp({
                  email,
                  password
                });

              if (signupError) {
                throw signupError;
              }

              if (signupData.session) {

                showMessage(
                  "VIBRA account created successfully! 🎉"
                );

              } else {

                showMessage(
                  "Account created! Please check your email to verify your account."
                );

              }

            }

          } else {
            throw error;
          }

        } else {

          if (data.session) {

            showMessage(
              "Login successful! Welcome to VIBRA ✨"
            );

          }

        }

      } catch (error) {

        console.error("Authentication error:", error);

        showMessage(
          getFriendlyAuthError(error.message)
        );

      } finally {

        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = "Continue";
        }

      }

    });

  }


  // ==========================
  // NOTIFICATION
  // ==========================

  if (notificationBtn) {

    notificationBtn.addEventListener("click", () => {

      showToast("Notifications will appear here 🔔");

    });

  }


  // ==========================
  // CREATE POST
  // ==========================

  if (createBtn) {

    createBtn.addEventListener("click", async () => {

      const {
        data: { session }
      } = await supabaseClient.auth.getSession();

      if (!session) {

        showToast(
          "Please login first to create a post."
        );

        if (authSection) {
          authSection.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }

        return;
      }

      showToast(
        "Post creator will be added next."
      );

    });

  }


  // ==========================
  // NAVIGATION
  // ==========================

  const navItems =
    document.querySelectorAll(".nav-item");

  navItems.forEach((item) => {

    item.addEventListener("click", () => {

      navItems.forEach((nav) => {
        nav.classList.remove("active");
      });

      item.classList.add("active");

    });

  });


  // ==========================
  // FRIENDLY AUTH ERRORS
  // ==========================

  function getFriendlyAuthError(error) {

    const text = String(error || "").toLowerCase();

    if (text.includes("invalid login")) {
      return "Email or password is incorrect.";
    }

    if (text.includes("email not confirmed")) {
      return "Please verify your email before logging in.";
    }

    if (text.includes("already registered")) {
      return "This email is already registered.";
    }

    if (text.includes("password")) {
      return "Please check your password.";
    }

    if (text.includes("rate limit")) {
      return "Too many attempts. Please try again later.";
    }

    if (text.includes("network")) {
      return "Network error. Please check your internet connection.";
    }

    return "Authentication failed. Please try again.";

  }


  // ==========================
  // MESSAGE
  // ==========================

  function showMessage(text) {

    if (!message) return;

    message.textContent = text;
    message.style.opacity = "1";

    setTimeout(() => {

      message.style.opacity = "0";

    }, 5000);

  }


  // ==========================
  // TOAST
  // ==========================

  function showToast(text) {

    const toast =
      document.createElement("div");

    toast.textContent = text;

    toast.style.position = "fixed";
    toast.style.left = "50%";
    toast.style.bottom = "95px";
    toast.style.transform = "translateX(-50%)";
    toast.style.zIndex = "9999";

    toast.style.padding = "12px 18px";
    toast.style.borderRadius = "14px";

    toast.style.background =
      "rgba(15,17,25,0.95)";

    toast.style.border =
      "1px solid rgba(0,240,255,0.25)";

    toast.style.color = "#ffffff";

    toast.style.fontSize = "13px";
    toast.style.fontWeight = "600";

    toast.style.backdropFilter =
      "blur(15px)";

    toast.style.boxShadow =
      "0 0 25px rgba(0,240,255,0.15)";

    toast.style.opacity = "0";

    toast.style.transition =
      "opacity 0.3s ease, transform 0.3s ease";

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = "1";
    });

    setTimeout(() => {

      toast.style.opacity = "0";

      toast.style.transform =
        "translateX(-50%) translateY(10px)";

      setTimeout(() => {
        toast.remove();
      }, 350);

    }, 2500);

  }

});
