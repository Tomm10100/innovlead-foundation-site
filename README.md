# Innovalead Foundation Website

**Federal Not-for-profit Corporation #1725908-5** | innovlead.org

Static website for the Innovalead Foundation, built for CRA T2050 charity registration compliance. Deployed via GitHub → Hostinger auto-deploy.

## Pages

| Page | File | CRA Requirement |
|---|---|---|
| Homepage | `index.html` | Mission alignment, team, donate CTA |
| Programs | `programs.html` | Charitable activities evidence |
| Learn | `learn/index.html` | Tangible educational programs |
| Transparency | `transparency.html` | Financial disclosures |
| Governance | `governance.html` | Board & accountability |
| Privacy Policy | `privacy.html` | PIPEDA compliance |

## Deployment

This repo auto-deploys to **innovlead.org** via Hostinger Git integration:

1. Push changes to `main` branch
2. Hostinger webhook triggers auto-deploy
3. Files go to `public_html/` on the server

## Setup (One-Time)

1. In Hostinger hPanel → innovlead.org → Advanced → Git
2. Enter this repo's URL and set branch to `main`
3. Enable auto-deploy → copy webhook URL
4. Add webhook in GitHub → Settings → Webhooks

## Tech Stack

- HTML5 + CSS3 + Vanilla JS
- Google Fonts (Inter, Outfit)
- Lucide Icons (CDN)
- No build step required
