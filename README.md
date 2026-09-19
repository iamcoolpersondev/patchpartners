# Patch Partners

Modern software fixing + making website with a private owner CRM.

## Features

- Friendly responsive marketing website
- Customer work request form
- Private `/crm` dashboard
- Requests stored as private GitHub Issues
- CRM status workflow: New → In progress → Done
- Gmail SMTP-ready owner notifications and customer confirmation emails
- Signed HTTP-only CRM sessions
- Vercel-ready Next.js app

## Required Vercel environment variables

Copy the variables from `.env.example`.

### CRM
- `CRM_PASSWORD` — shared password for the business owners
- `CRM_SESSION_SECRET` — long random secret used to sign sessions

### Request storage
- `GITHUB_PAT` — fine-grained GitHub token with **Issues read/write** access to this private repo
- `PATCH_PARTNERS_REPO` — `iamcoolpersondev/patchpartners`

### Gmail SMTP
- `SMTP_HOST` — `smtp.gmail.com`
- `SMTP_PORT` — `465`
- `SMTP_SECURE` — `true`
- `SMTP_USER` — Gmail address
- `SMTP_PASS` — Gmail App Password (never your normal Gmail password)
- `SMTP_FROM` — for example `Patch Partners <hello@example.com>`
- `REQUEST_NOTIFICATION_EMAIL` — inbox that receives new customer request alerts

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000 and http://localhost:3000/crm.
