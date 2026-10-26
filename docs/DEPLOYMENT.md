# Deploy AI Mystery Room

This walkthrough deploys the React/Vite frontend to Vercel and the Express API to Render, with MongoDB Atlas for storage and Gemini for case generation. It assumes the repository is available on GitHub.

The repository also includes a root `vercel.json` for deploying both apps as Vercel Services under one domain. That feature is in Beta. Use the next section if your Vercel project has the **Services** framework option; otherwise use the separate Vercel + Render walkthrough below.

## Option A: Deploy both apps in one Vercel project

1. Create a MongoDB Atlas Free cluster and database user, then copy the driver connection URI. Create a Gemini API key in Google AI Studio.
2. In Vercel, import `Datta-Dopewad/AI_Mystery-Room`. Keep the project root at the repository root so Vercel can read `vercel.json` and both app folders.
3. In **Settings → Build and Deployment**, choose **Services** as the Framework Preset if it is available for your account. The Vercel Services feature is in Beta. The root config declares a Vite frontend and Express API; it routes `/api/...` to the API and all other paths to the frontend.
4. In Vercel **Settings → Environment Variables**, add `MONGODB_URI`, `GEMINI_API_KEY`, and `GEMINI_MODEL=gemini-3.8-flash` for Production (and Preview if desired). Do not set a `VITE_` prefix on secrets. The frontend uses same-origin `/api` calls on this deployment.
5. Configure Atlas **Network Access**. Vercel Hobby uses dynamic outbound IPs; Vercel Static IPs require a paid plan. For a personal demo, Atlas can be configured to accept connections from any IP (`0.0.0.0/0`) while using a strong, restricted database user and password. This broadens network access, so for a tighter IP allowlist use Option B (Render publishes its service outbound IP ranges) or a plan/provider that gives you static egress.
6. Deploy from Vercel and open `/api/health` on the resulting Vercel domain. It should return `status: "ok"`. Then test creating a case and completing an investigation.

The API function is configured for up to 60 seconds to allow case generation. Vercel Hobby supports up to 60 seconds without Fluid Compute; with Fluid Compute, Hobby may support longer durations. See [Vercel function duration limits](https://vercel.com/docs/functions/configuring-functions/duration). If the generation request times out or Services isn't available in the account, use Option B.

Vercel references: [Services](https://vercel.com/docs/services), [Express on Vercel](https://vercel.com/docs/frameworks/backend/express), [Vercel outbound IPs](https://vercel.com/kb/guide/how-to-allowlist-deployment-ip-address), and [Atlas IP access lists](https://www.mongodb.com/docs/atlas/security/ip-access-list/).

## Option B: Deploy the frontend and API separately

Follow this option if you want a separately hosted API or a narrower Atlas IP allowlist. The remaining steps below deploy Vite to Vercel and the API to Render.

## 1. Prepare the required accounts and values

You will need GitHub, Vercel, Render, MongoDB Atlas, and a Google Gemini API key. Keep the Gemini key and database URI private. They belong only in Render's server environment variables; never add them to the client, commit them, or prefix them with `VITE_`.

Before starting, check that the latest project changes are pushed to GitHub. The deployment files are `render.yaml` and `client/vercel.json`.

## 2. Create a MongoDB Atlas database

1. Create an Atlas project and cluster, choosing a tier and region that suit your needs.
2. Create a database user with a strong password. This is separate from your Atlas website login.
3. In the project's **Network Access** / **IP Access List**, add the outbound IP addresses listed for your Render service/region. Atlas will reject connections from addresses that are not on this list. Avoid `0.0.0.0/0` for a production database because it permits connection attempts from any IP.
4. In the cluster, choose **Connect → Drivers**, copy the connection string, replace its password placeholder, and set the database name to `ai-mystery-room` (or another name you choose). URL-encode special characters in the database password.
5. Keep the finished URI ready as the Render `MONGODB_URI` value.

Atlas references: [IP access lists](https://www.mongodb.com/docs/atlas/security/ip-access-list/) and [add an IP address](https://www.mongodb.com/docs/atlas/security/add-ip-address-to-list/). Render shows outbound IP ranges in the service's networking details; see [Render outbound IP addresses](https://render.com/docs/outbound-ip-addresses).

## 3. Deploy the frontend to Vercel

1. In Vercel, choose **Add New → Project**, connect GitHub, and import `Datta-Dopewad/AI_Mystery-Room`.
2. Set **Root Directory** to `client`. This is important because the frontend is in that subfolder.
3. Use the Vite framework preset. The project uses `npm run build` and writes the production site to `dist`; Vercel normally detects these automatically. If it asks, set Build Command to `npm run build` and Output Directory to `dist`.
4. Leave `VITE_API_BASE_URL` unset for this first deployment, then deploy. Vercel will give you a site URL such as `https://your-project.vercel.app`. Copy the origin only, without a trailing slash.

Vercel references: [Vite deployments](https://vercel.com/docs/frameworks/frontend/vite) and [configure a project root/build](https://vercel.com/docs/builds/configure-a-build). The included rewrite serves the SPA entry point on direct routes and refreshes.

## 4. Deploy the API to Render

1. In Render, choose **New → Blueprint** and connect the same GitHub repository. Select the repository's `render.yaml` if prompted.
2. Confirm the service is named `ai-mystery-room-api`, its root directory is `server`, its build command is `npm ci`, its start command is `npm start`, and its health check is `/api/health`. The Blueprint already sets these values.
3. When Render asks for values marked as secret/unset, provide:
   - `MONGODB_URI`: the Atlas connection URI from step 2.
   - `GEMINI_API_KEY`: your Gemini API key.
   - `CLIENT_ORIGIN`: your Vercel origin, e.g. `https://your-project.vercel.app` (no trailing slash).
   - `GEMINI_MODEL`: keep the Blueprint default `gemini-3.8-flash`, or use a model enabled for your Gemini account.
4. Create the service and wait for its first deploy to finish. Copy its assigned URL, e.g. `https://ai-mystery-room-api.onrender.com`.
5. Open `https://<your-render-service>.onrender.com/api/health`. A healthy service returns JSON with `"status":"ok"`.

If you also use Vercel preview deployment URLs, add those exact origins to Render's `CLIENT_ORIGIN` as a comma-separated list. Only add origins you intend to trust. Render references: [Blueprint specification](https://render.com/docs/blueprint-spec), [web services](https://render.com/docs/web-services), and [health checks](https://render.com/docs/health-checks).

## 5. Connect Vercel to the API

1. In Vercel, open the project's **Settings → Environment Variables**.
2. Add `VITE_API_BASE_URL` with the Render service origin, e.g. `https://ai-mystery-room-api.onrender.com`. Do not add a route path such as `/api/v1`.
3. Apply it to **Production** (and Preview too if desired), save, then redeploy the latest deployment so Vite builds the value into the client.

`VITE_` values are included in browser code and are public. Only the API's base URL is safe there; never put the Gemini key or MongoDB URI in Vercel. See [Vercel environment variables](https://vercel.com/docs/environment-variables).

## 6. Verify the live app

1. Open the Vercel production URL and refresh a nested route directly to confirm the SPA rewrite works.
2. Create a mystery and complete the full flow: inspect clues, request a hint, make an accusation, and view the result.
3. Check Render logs if the API is unavailable. Common setup issues are an incorrect Atlas URI, missing Render IP access, a typo in `CLIENT_ORIGIN`, or a missing Gemini key.
4. Gemini may return temporary upstream/quota errors. Check the Gemini account's model access and limits if generation fails repeatedly.

For a custom domain, add it in Vercel, then update Render's `CLIENT_ORIGIN` to the new site origin and redeploy the API. If keeping the `vercel.app` domain too, include both origins separated by a comma.
