# Publish for Free

Mission Civil Services is a static site: no server, database, build step, custom domain or paid hosting plan is required. GitHub Pages can serve it at a free `github.io` HTTPS address from a public repository. The source files and study content will therefore be public.

## One-time Setup

1. Create a free GitHub account if needed, then create a **public** repository named `mission-civil-services`. Leave it empty when creating it.
2. In the new repository, open **Settings → Pages**. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Open PowerShell in this project folder and run the following commands, replacing `YOUR-USERNAME` with your GitHub username:

	```powershell
	git init
	git add .
	git commit -m "Publish Mission Civil Services"
	git branch -M main
	git remote add origin https://github.com/YOUR-USERNAME/mission-civil-services.git
	git push -u origin main
	```

4. Open the **Actions** tab and wait for **Deploy Mission Civil Services to GitHub Pages** to finish successfully.
5. Open `https://YOUR-USERNAME.github.io/mission-civil-services/` on any device. On a phone, use the browser's **Add to Home Screen** or **Install** option.

The workflow in `.github/workflows/deploy.yml` deploys on each push to `main`. To publish an update, run `git add .`, `git commit -m "Update study content"` and `git push` from this folder. GitHub Actions republishes the site automatically.

The app does not require payment information for this public-repository Pages setup. Avoid adding private data to the repository. Time-sensitive policy, budget and examination details are not synchronized automatically; verify them against official commission and government publications.
