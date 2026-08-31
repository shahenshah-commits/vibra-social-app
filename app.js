const SUPABASE_URL = "https://xxxqsrsjyhxqwzrimydn.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_X5DDa_Sj5UWNVwS3jD77yg_4g2bX3Eb";

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

  const notificationBtn =
    document.getElementById("notificationBtn");

  const createBtn =
    document.getElementById("createBtn");

  const passwordInput =
    document.getElementById("password");

  const togglePassword =
    document.getElementById("togglePassword");


  // PASSWORD SHOW / HIDE
  if (togglePassword && passwordInput) {

    togglePassword.addEventListener("click", () => {

      if (passwordInput.type === "password") {

        passwordInput.type = "text";
        togglePassword.textContent = "🙈";

      } else {

        passwordInput.type = "password";
        togglePassword.textContent = "👁️";

      }

    });

  }


  // CHECK LOGIN
  try {

    const {
      data: { session },
      error
    } = await supabaseClient.auth.getSession();

    if (error) {
      console.error("Session error:", error);
    }

    // Logged in
    if (session) {

      showApp();

    } else {

      showLogin();

    }

  } catch (error) {

    console.error("Supabase error:", error);

    // Supabase error होने पर भी login screen दिखे
    showLogin();

  }


  // LOGIN
  if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

      event.preventDefault();

      const email =
        document.getElementById("email").value.trim();

      const password =
        document.getElementById("password").value;

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

        const {
          data,
          error
        } = await supabaseClient.auth.signInWithPassword({

          email: email,
          password: password

        });


        if (error) {

          showMessage(
            "Login failed: " + error.message
          );

          return;

        }


        if (data.session) {

          showMessage(
            "Login successful! Welcome to VIBRA ✨"
          );

          showApp();

        }

      } catch (error) {

        console.error(error);

        showMessage(
          "Something went wrong. Please try again."
        );

      } finally {

        if (button) {

          button.disabled = false;
          button.textContent = "Continue";

        }

      }

    });

  }


  // AUTH STATE
  supabaseClient.auth.onAuthStateChange(
    (event, session) => {

      if (event === "SIGNED_IN" && session) {

        showApp();

      }

      if (event === "SIGNED_OUT") {

        showLogin();

      }

    }
  );


  // ENTER BUTTON
  if (startBtn) {

    startBtn.addEventListener("click", () => {

      authSection?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

    });

  }


  // NOTIFICATION
  if (notificationBtn) {

    notificationBtn.addEventListener("click", () => {

      showToast("Notifications coming soon 🔔");

    });

  }


  // CREATE
  if (createBtn) {

    createBtn.addEventListener("click", () => {

      showToast("Login required to create a post.");

    });

  }


  // SHOW LOGIN
  function showLogin() {

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


  // SHOW APP
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


  // MESSAGE
  function showMessage(text) {

    if (!message) return;

    message.textContent = text;
    message.style.opacity = "1";

    setTimeout(() => {

      message.style.opacity = "0";

    }, 5000);

  }


  // TOAST
  function showToast(text) {

    const toast =
      document.createElement("div");

    toast.textContent = text;

    toast.style.position = "fixed";
    toast.style.left = "50%";
    toast.style.bottom = "100px";
    toast.style.transform = "translateX(-50%)";
    toast.style.zIndex = "9999";

    toast.style.padding = "12px 18px";
    toast.style.borderRadius = "14px";

    toast.style.background =
      "rgba(15,17,25,0.95)";

    toast.style.color = "#fff";

    toast.style.border =
      "1px solid rgba(0,240,255,0.3)";

    document.body.appendChild(toast);

    setTimeout(() => {

      toast.remove();

    }, 2500);

  }

});
