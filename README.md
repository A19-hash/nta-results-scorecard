# NEET Result Portal

An Express and EJS result portal with:

- Student login using application number, password, and captcha
- Admin login
- Admin student record management
- Google Drive / hosted PDF or image result links
- Local `data/students.json` storage

## Local Setup

```bash
npm install
```

Create a `.env` file using `.env.example` as a guide.

Start the app:

```bash
npm start
```

For Windows development, this also works:

```bash
npm run dev
```

Student records are saved in `data/students.json`. That file is ignored by Git so private student data is not uploaded to GitHub.

## Add Students

1. Open `http://localhost:3000/admin/login`.
2. Login with the admin username and password from `.env`.
3. Open Student Records.
4. Enter the student's application number, name, password, and optional email.
5. Paste the Google Drive, PDF, or image URL in **Result PDF or Image Link**.
6. Save the student.

The student can then open `http://localhost:3000/login`, login with their application number and password, and open the result link.

## Default Admin Login

```text
Username: admin
Password: admin123
```

Change these with `ADMIN_USER` and `ADMIN_PASSWORD` in `.env` before deploying.

## Pages

- Student login: `http://localhost:3000/login`
- Admin login: `http://localhost:3000/admin/login`
- Admin records: `http://localhost:3000/admin/students`

If port `3000` is already in use and `PORT` is not set, the server tries `3001`.

## GitHub Notes

Do not upload `node_modules` or `.env`. They are ignored by `.gitignore`.

This is a Node/Express server app. GitHub Pages will not run it directly. Use GitHub for the repository, then deploy to a Node host such as Render, Railway, or a VPS.

Before pushing:

```bash
npm run check
```

## Deploy From GitHub

On Render or another Node host:

1. Create a new Web Service from your GitHub repository.
2. Set the build command to `npm install`.
3. Set the start command to `npm start`.
4. Add environment variables:

```env
SESSION_SECRET=use-a-long-random-secret
ADMIN_USER=your-admin-username
ADMIN_PASSWORD=your-strong-admin-password
SKIP_DB=true
```

After deploy, your live URLs will look like:

```text
https://your-app-name.onrender.com/admin/login
https://your-app-name.onrender.com/admin/students
https://your-app-name.onrender.com/login
```

Use `/admin/login` to add students. Use `/login` for student result login.

Important: local `data/students.json` storage is simple, but many free hosts can reset local files when the app restarts or redeploys. For permanent production records, use a persistent database or your host's persistent disk feature.
