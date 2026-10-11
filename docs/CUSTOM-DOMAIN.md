# Connect a custom domain

## Current deployment: Vercel's free address

For the current release, use the `.vercel.app` address assigned to your Vercel project. No purchased domain or DNS changes are needed. Import this repository, use build command `npm run build`, and set the output directory to `dist`. The repository already includes these settings in `vercel.json`.

The configuration is prepared locally. An actual public deployment URL is available after you deploy through your Vercel account.

The custom-domain instructions below are optional for a future release.

The application is a static website and can run on your own domain. There is no platform badge or generator attribution in the site. A real domain is not connected yet because no domain name, DNS account, or hosting account has been provided.

## Deploy the site

1. Import the repository into your hosting account, or deploy the generated `dist` directory.
2. Use build command `npm run build` and output directory `dist`. No framework preset or backend service is required.
3. Confirm the deployed site opens and that the command centre works at `/#dashboard`.

## Add your domain

In your host's project settings, add the domain you own, for example `traffic.yourdomain.com`. Copy the exact DNS records shown by that host into your domain registrar's DNS settings. Use those account-specific instructions instead of guessed IP addresses or generic DNS records.

Wait for the host to verify the records and issue HTTPS. Choose one primary hostname and configure the host's redirect from alternate hostnames. Then verify the landing page, direct dashboard link, static assets, and HTTPS on the actual domain.

No domain purchase, DNS change, or public deployment has been performed by this local build. Share the domain and hosting provider to finish the account-specific connection.
