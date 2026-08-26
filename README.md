# vibra-social-app
VIBRA — Connect • Create • Discover. A modern social media web app with posts, profiles, messaging and more.
# VIBRA — Connect • Create • Discover

VIBRA is a dark glassmorphic social platform engineered using modern web standards and Powered by Supabase.

---

## 🚀 GitHub Pages Deployment Steps

1. Create a public repository named `vibra-app` on GitHub.
2. Commit and push the project files:
   - `index.html`
   - `style.css`
   - `app.js`
   - `README.md`
   - `schema.sql`
3. In your repository on GitHub:
   - Navigate to **Settings** -> **Pages**.
   - Under **Build and deployment** -> **Source**, select **Deploy from a branch**.
   - Select the `main` branch and `/ (root)` folder.
   - Click **Save**.
4. Your site will be live at `https://<your-username>.github.io/vibra-app/`.

---

## ⚙️ How to Configure Supabase Credentials

1. Go to [Supabase](https://supabase.com/) and create a project.
2. In your Supabase Dashboard, go to **Project Settings** -> **API**.
3. Copy your **Project URL** and **`anon` Public Key**.
4. Open your live VIBRA application, click the **Settings** tab, paste the URL and Anon Key under **Supabase Configuration**, and click **Save Connection Config**.
5. Alternatively, edit `app.js` directly to instantiate the client globally:
   ```js
   VibraState.supabase = window.supabase.createClient('YOUR_URL', 'YOUR_ANON_KEY');
