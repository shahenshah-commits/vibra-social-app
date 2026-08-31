const SUPABASE_URL = "https://xxxqsrsjyhxqwzrimydn.supabase.co";
const SUPABASE_KEY = "sb_publishable_X5DDa_Sj5UWNVwS3jD77yg_4g2bX3Eb";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

document.addEventListener("DOMContentLoaded", () => {

  const splash = document.getElementById("splash");
  const app = document.getElementById("app");
  const startBtn = document.getElementById("startBtn");
  const authSection = document.getElementById("authSection");
  const loginForm = document.getElementById("loginForm");
  const message = document.getElementById("message");
  const notificationBtn = document.getElementById("notificationBtn");
  const createBtn = document.getElementById("createBtn");

  /*
   * ==========================
   * SPLASH SCREEN
   * ==========================
   */

  setTimeout(() => {
    splash.classList.add("hide");

    setTimeout(() => {
      splash.style.display = "none";
      app.classList.remove("hidden");
    }, 650);

  }, 1800);


  /*
   * ==========================
   * ENTER VIBRA
   * ==========================
   */

  startBtn.addEventListener("click", () => {

    authSection.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

  });


  /*
   * ==========================
   * LOGIN DEMO INTERACTION
   * ==========================
   *
   * IMPORTANT:
   * This is only temporary UI behaviour.
   * Real authentication will be connected
   * with Supabase in the next phase.
   */

  loginForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

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

    showMessage(
      "VIBRA authentication will be connected with Supabase soon."
    );

  });


  /*
   * ==========================
   * NOTIFICATION BUTTON
   * ==========================
   */

  notificationBtn.addEventListener("click", () => {

    showToast(
      "No new notifications"
    );

  });


  /*
   * ==========================
   * CREATE BUTTON
   * ==========================
   */

  createBtn.addEventListener("click", () => {

    showToast(
      "Post creator will be available after authentication."
    );

  });


  /*
   * ==========================
   * NAVIGATION BUTTONS
   * ==========================
   */

  const navItems = document.querySelectorAll(".nav-item");

  navItems.forEach((item) => {

    item.addEventListener("click", () => {

      navItems.forEach((nav) => {
        nav.classList.remove("active");
      });

      item.classList.add("active");

    });

  });


  /*
   * ==========================
   * MESSAGE FUNCTION
   * ==========================
   */

  function showMessage(text) {

    message.textContent = text;

    message.style.opacity = "1";

    setTimeout(() => {

      message.style.opacity = "0";

    }, 5000);

  }


  /*
   * ==========================
   * TOAST SYSTEM
   * ==========================
   */

  function showToast(text) {

    const toast = document.createElement("div");

    toast.textContent = text;

    toast.style.position = "fixed";
    toast.style.left = "50%";
    toast.style.bottom = "95px";
    toast.style.transform = "translateX(-50%)";
    toast.style.zIndex = "9999";

    toast.style.padding = "12px 18px";
    toast.style.borderRadius = "14px";

    toast.style.background =
      "rgba(15,17,25,0.92)";

    toast.style.border =
      "1px solid rgba(0,240,255,0.25)";

    toast.style.color = "#ffffff";

    toast.style.fontSize = "13px";
    toast.style.fontWeight = "600";

    toast.style.backdropFilter = "blur(15px)";

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
