const SUPABASE_URL =
  "https://xxxqsrsjyhxqwzrimydn.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_X5DDa_Sj5UWNVwS3jD77yg_4g2bX3Eb";

const supabaseClient =
  supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     ELEMENTS
  =============================== */

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

  const emailAuth =
    document.getElementById("emailAuth");

  const phoneAuth =
    document.getElementById("phoneAuth");

  const emailModeBtn =
    document.getElementById("emailModeBtn");

  const phoneModeBtn =
    document.getElementById("phoneModeBtn");

  const emailInput =
    document.getElementById("email");

  const passwordInput =
    document.getElementById("password");

  const togglePassword =
    document.getElementById("togglePassword");

  const createAccountBtn =
    document.getElementById("createAccountBtn");

  const forgotPasswordBtn =
    document.getElementById("forgotPasswordBtn");

  const forgotPasswordBox =
    document.getElementById("forgotPasswordBox");

  const resetEmail =
    document.getElementById("resetEmail");

  const sendResetBtn =
    document.getElementById("sendResetBtn");

  const backToLoginBtn =
    document.getElementById("backToLoginBtn");

  const phoneInput =
    document.getElementById("phone");

  const sendOtpBtn =
    document.getElementById("sendOtpBtn");

  const otpArea =
    document.getElementById("otpArea");

  const otpInput =
    document.getElementById("otp");

  const verifyOtpBtn =
    document.getElementById("verifyOtpBtn");

  const resendOtpBtn =
    document.getElementById("resendOtpBtn");

  const updatePasswordBox =
    document.getElementById("updatePasswordBox");

  const newPassword =
    document.getElementById("newPassword");

  const toggleNewPassword =
    document.getElementById("toggleNewPassword");

  const updatePasswordBtn =
    document.getElementById("updatePasswordBtn");

  const message =
    document.getElementById("message");

  const logoutBtn =
    document.getElementById("logoutBtn");

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

  const createBtn =
    document.getElementById("createBtn");

  const createPostBtn =
    document.getElementById("createPostBtn");

  const notificationBtn =
    document.getElementById("notificationBtn");


  /* ===============================
     STATE
  =============================== */

  let currentPhone = "";


  /* ===============================
     SPLASH
  =============================== */

  function hideSplash() {

    if (!splash) return;

    splash.classList.add("hide");

    setTimeout(() => {
      splash.style.display = "none";
    }, 600);

  }


  /* ===============================
     MESSAGE
  =============================== */

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


  /* ===============================
     INITIAL UI
  =============================== */

  function showLogin() {

    hideSplash();

    app?.classList.remove("hidden");

    authSection?.classList.remove("hidden");

    homeSection?.classList.add("hidden");

    logoutBtn?.classList.add("hidden");

  }


  function showHome(session) {

    if (!session) {
      showLogin();
      return;
    }

    hideSplash();

    app?.classList.remove("hidden");

    authSection?.classList.add("hidden");

    homeSection?.classList.remove("hidden");

    logoutBtn?.classList.remove("hidden");

    loadUserProfile(session.user);

  }


  /* ===============================
     PASSWORD SHOW / HIDE
  =============================== */

  togglePassword?.addEventListener(
    "click",
    () => {

      const hidden =
        passwordInput.type === "password";

      passwordInput.type =
        hidden ? "text" : "password";

      togglePassword.textContent =
        hidden ? "🙈" : "👁️";

      togglePassword.setAttribute(
        "aria-label",
        hidden
          ? "Hide password"
          : "Show password"
      );

    }
  );


  toggleNewPassword?.addEventListener(
    "click",
    () => {

      const hidden =
        newPassword.type === "password";

      newPassword.type =
        hidden ? "text" : "password";

      toggleNewPassword.textContent =
        hidden ? "🙈" : "👁️";

    }
  );


  /* ===============================
     EMAIL / PHONE SWITCH
  =============================== */

  emailModeBtn?.addEventListener(
    "click",
    () => {

      emailModeBtn.classList.add("active");
      phoneModeBtn.classList.remove("active");

      emailAuth.classList.remove("hidden");
      phoneAuth.classList.add("hidden");

      forgotPasswordBox.classList.add("hidden");

    }
  );


  phoneModeBtn?.addEventListener(
    "click",
    () => {

      phoneModeBtn.classList.add("active");
      emailModeBtn.classList.remove("active");

      phoneAuth.classList.remove("hidden");
      emailAuth.classList.add("hidden");

      forgotPasswordBox.classList.add("hidden");

    }
  );


  /* ===============================
     EMAIL LOGIN
  =============================== */

  loginForm?.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();

      const email =
        emailInput.value.trim();

      const password =
        passwordInput.value;

      if (!email || !password) {
        showMessage(
          "Please enter email and password."
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
        button.textContent = "Logging in...";
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

          showMessage(
            "🎉 Login successful!"
          );

          showHome(data.session);

        }

      } catch (error) {

        console.error(error);

        showMessage(
          friendlyError(error.message)
        );

      } finally {

        if (button) {
          button.disabled = false;
          button.textContent = "Login";
        }

      }

    }
  );


  /* ===============================
     CREATE ACCOUNT
  =============================== */

  createAccountBtn?.addEventListener(
    "click",
    async () => {

      const email =
        emailInput.value.trim();

      const password =
        passwordInput.value;

      if (!email) {
        showMessage(
          "Enter your email first."
        );
        emailInput.focus();
        return;
      }

      if (!password || password.length < 6) {
        showMessage(
          "Create a password with at least 6 characters."
        );
        passwordInput.focus();
        return;
      }

      createAccountBtn.disabled = true;
      createAccountBtn.textContent =
        "Creating account...";

      try {

        const {
          data,
          error
        } =
          await supabaseClient.auth.signUp({
            email,
            password
          });

        if (error) {
          throw error;
        }

        if (data.session) {

          showMessage(
            "🎉 VIBRA account created!"
          );

          showHome(data.session);

        } else {

          showMessage(
            "📧 Account created. Check your email to verify your account."
          );

        }

      } catch (error) {

        console.error(error);

        showMessage(
          friendlyError(error.message)
        );

      } finally {

        createAccountBtn.disabled = false;
        createAccountBtn.textContent =
          "Create New Account";

      }

    }
  );


  /* ===============================
     FORGOT PASSWORD
  =============================== */

  forgotPasswordBtn?.addEventListener(
    "click",
    () => {

      emailAuth.classList.add("hidden");

      forgotPasswordBox.classList.remove(
        "hidden"
      );

      if (emailInput.value) {
        resetEmail.value =
          emailInput.value;
      }

    }
  );


  backToLoginBtn?.addEventListener(
    "click",
    () => {

      forgotPasswordBox.classList.add(
        "hidden"
      );

      emailAuth.classList.remove(
        "hidden"
      );

    }
  );


  sendResetBtn?.addEventListener(
    "click",
    async () => {

      const email =
        resetEmail.value.trim();

      if (!email) {

        showMessage(
          "Enter your email address."
        );

        return;
      }

      sendResetBtn.disabled = true;
      sendResetBtn.textContent =
        "Sending...";

      try {

        const redirectUrl =
          window.location.origin +
          window.location.pathname;

        const {
          error
        } =
          await supabaseClient.auth
            .resetPasswordForEmail(
              email,
              {
                redirectTo:
                  redirectUrl
              }
            );

        if (error) {
          throw error;
        }

        showMessage(
          "📧 Password reset link sent. Check your email."
        );

      } catch (error) {

        console.error(error);

        showMessage(
          friendlyError(error.message)
        );

      } finally {

        sendResetBtn.disabled = false;

        sendResetBtn.textContent =
          "Send Reset Link";

      }

    }
  );


  /* ===============================
     PHONE OTP
  =============================== */

  sendOtpBtn?.addEventListener(
    "click",
    async () => {

      const phone =
        phoneInput.value.trim();

      if (!phone) {

        showMessage(
          "Enter your phone number."
        );

        phoneInput.focus();

        return;
      }

      if (!phone.startsWith("+")) {

        showMessage(
          "Use international format, e.g. +91XXXXXXXXXX"
        );

        return;
      }

      currentPhone = phone;

      sendOtpBtn.disabled = true;

      sendOtpBtn.textContent =
        "Sending OTP...";

      try {

        const {
          error
        } =
          await supabaseClient.auth
            .signInWithOtp({
              phone: currentPhone,
              options: {
                shouldCreateUser: true
              }
            });

        if (error) {
          throw error;
        }

        otpArea.classList.remove(
          "hidden"
        );

        showMessage(
          "📱 OTP sent to your phone."
        );

        otpInput.focus();

      } catch (error) {

        console.error(error);

        showMessage(
          friendlyError(error.message)
        );

      } finally {

        sendOtpBtn.disabled = false;

        sendOtpBtn.textContent =
          "Send OTP";

      }

    }
  );


  /* ===============================
     VERIFY OTP
  =============================== */

  verifyOtpBtn?.addEventListener(
    "click",
    async () => {

      const token =
        otpInput.value.trim();

      if (!currentPhone) {

        showMessage(
          "Please request an OTP first."
        );

        return;
      }

      if (!/^\d{6}$/.test(token)) {

        showMessage(
          "Enter the 6-digit OTP."
        );

        return;
      }

      verifyOtpBtn.disabled = true;

      verifyOtpBtn.textContent =
        "Verifying...";

      try {

        const {
          data,
          error
        } =
          await supabaseClient.auth
            .verifyOtp({
              phone: currentPhone,
              token,
              type: "sms"
            });

        if (error) {
          throw error;
        }

        if (data.session) {

          showMessage(
            "🎉 Phone verification successful!"
          );

          showHome(data.session);

        }

      } catch (error) {

        console.error(error);

        showMessage(
          "❌ Invalid or expired OTP."
        );

      } finally {

        verifyOtpBtn.disabled = false;

        verifyOtpBtn.textContent =
          "Verify OTP";

      }

    }
  );


  /* ===============================
     RESEND OTP
  =============================== */

  resendOtpBtn?.addEventListener(
    "click",
    async () => {

      if (!currentPhone) {
        showMessage(
          "Enter your phone number first."
        );
        return;
      }

      resendOtpBtn.disabled = true;

      try {

        const {
          error
        } =
          await supabaseClient.auth
            .signInWithOtp({
              phone: currentPhone,
              options: {
                shouldCreateUser: true
              }
            });

        if (error) {
          throw error;
        }

        showMessage(
          "📱 New OTP sent."
        );

      } catch (error) {

        showMessage(
          friendlyError(error.message)
        );

      } finally {

        setTimeout(() => {
          resendOtpBtn.disabled = false;
        }, 30000);

      }

    }
  );


  /* ===============================
     PASSWORD RECOVERY
  =============================== */

  supabaseClient.auth.onAuthStateChange(
    async (event, session) => {

      if (event === "SIGNED_IN" && session) {
        showHome(session);
      }

      if (event === "SIGNED_OUT") {
        showLogin();
        showMessage(
          "You have been logged out."
        );
      }

      if (event === "PASSWORD_RECOVERY") {

        authSection.classList.remove(
          "hidden"
        );

        homeSection.classList.add(
          "hidden"
        );

        emailAuth.classList.add(
          "hidden"
        );

        forgotPasswordBox.classList.add(
          "hidden"
        );

        updatePasswordBox.classList.remove(
          "hidden"
        );

        showMessage(
          "🔐 Create your new password."
        );

      }

    }
  );


  /* ===============================
     UPDATE PASSWORD
  =============================== */

  updatePasswordBtn?.addEventListener(
    "click",
    async () => {

      const password =
        newPassword.value;

      if (!password || password.length < 6) {

        showMessage(
          "Password must contain at least 6 characters."
        );

        return;
      }

      updatePasswordBtn.disabled = true;

      updatePasswordBtn.textContent =
        "Updating...";

      try {

        const {
          error
        } =
          await supabaseClient.auth
            .updateUser({
              password
            });

        if (error) {
          throw error;
        }

        showMessage(
          "✅ Password updated successfully!"
        );

        newPassword.value = "";

        updatePasswordBox.classList.add(
          "hidden"
        );

        emailAuth.classList.remove(
          "hidden"
        );

      } catch (error) {

        console.error(error);

        showMessage(
          friendlyError(error.message)
        );

      } finally {

        updatePasswordBtn.disabled = false;

        updatePasswordBtn.textContent =
          "Update Password";

      }

    }
  );


  /* ===============================
     LOGOUT
  =============================== */

  logoutBtn?.addEventListener(
    "click",
    async () => {

      logoutBtn.disabled = true;

      logoutBtn.textContent =
        "Logging out...";

      const {
        error
      } =
        await supabaseClient.auth.signOut();

      if (error) {

        console.error(error);

        showMessage(
          "Could not logout. Try again."
        );

        logoutBtn.disabled = false;

        logoutBtn.textContent =
          "Logout";

        return;
      }

      showLogin();

      logoutBtn.disabled = false;

      logoutBtn.textContent =
        "Logout";

    }
  );


  /* ===============================
     SESSION CHECK
  =============================== */

  async function checkSession() {

    const {
      data,
      error
    } =
      await supabaseClient.auth.getSession();

    if (error) {
      console.error(error);
    }

    if (data.session) {
      showHome(data.session);
    } else {
      showLogin();
    }

  }

  checkSession();


  /* ===============================
     USER PROFILE
  =============================== */

  async function loadUserProfile(user) {

    if (!user) return;

    const metadata =
      user.user_metadata || {};

    let profile = null;

    try {

      const {
        data,
        error
      } =
        await supabaseClient
          .from("users")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

      if (!error) {
        profile = data;
      }

    } catch (error) {

      console.log(
        "Profile table not available yet."
      );

    }


    const name =
      profile?.full_name ||
      profile?.name ||
      metadata.full_name ||
      metadata.name ||
      user.email?.split("@")[0] ||
      user.phone ||
      "VIBRA User";


    const username =
      profile?.username ||
      metadata.username ||
      "vibra_user";


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


    if (welcomeName) {
      welcomeName.textContent = name;
    }

    if (profileName) {
      profileName.textContent = name;
    }

    if (profileUsername) {
      profileUsername.textContent =
        "@" + username;
    }

    if (profileBio) {
      profileBio.textContent = bio;
    }

    if (profileInitial) {
      profileInitial.textContent =
        name.charAt(0).toUpperCase();
    }

    if (postCount) {
      postCount.textContent = posts;
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


  /* ===============================
     NAVIGATION
  =============================== */

  document
    .querySelectorAll(".nav-item")
    .forEach(item => {

      item.addEventListener(
        "click",
        () => {

          const page =
            item.dataset.page;

          if (
            page === "explore" ||
            page === "reels" ||
            page === "profile"
          ) {

            showToast(
              page.charAt(0).toUpperCase() +
              page.slice(1) +
              " will be added next."
            );

          }

        }
      );

    });


  /* ===============================
     CREATE BUTTONS
  =============================== */

  createBtn?.addEventListener(
    "click",
    () => {

      showToast(
        "✨ Create Post will be added next."
      );

    }
  );


  createPostBtn?.addEventListener(
    "click",
    () => {

      showToast(
        "✨ Create Post will be added next."
      );

    }
  );


  notificationBtn?.addEventListener(
    "click",
    () => {

      showToast(
        "🔔 Notifications will be added next."
      );

    }
  );


  /* ===============================
     TOAST
  =============================== */

  function showToast(text) {

    const toast =
      document.createElement("div");

    toast.className = "toast";

    toast.textContent = text;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    setTimeout(() => {

      toast.classList.remove("show");

      setTimeout(() => {
        toast.remove();
      }, 300);

    }, 2500);

  }


  /* ===============================
     FRIENDLY ERROR
  =============================== */

  function friendlyError(error) {

    const text =
      String(error || "").toLowerCase();

    if (
      text.includes("email not confirmed")
    ) {
      return "📧 Please verify your email first.";
    }

    if (
      text.includes("invalid login") ||
      text.includes("invalid credentials")
    ) {
      return "❌ Email or password is incorrect.";
    }

    if (
      text.includes("phone provider")
    ) {
      return "📱 Phone authentication is not enabled in Supabase yet.";
    }

    if (
      text.includes("sms")
    ) {
      return "📱 SMS OTP could not be sent. Check your Supabase phone provider settings.";
    }

    if (
      text.includes("rate limit")
    ) {
      return "⏳ Too many attempts. Please wait and try again.";
    }

    if (
      text.includes("network")
    ) {
      return "🌐 Network error. Check your internet connection.";
    }

    return (
      "Something went wrong. Please try again."
    );

  }

});
