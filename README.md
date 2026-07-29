# Acta public website

This directory is the static Acta marketing website and browser-only product
demonstration. It is intentionally independent from the production application
and does not call the Acta API.

The demonstration stores its fictional working data in the browser's
`sessionStorage`. Signing out or selecting **Reset demo** deletes that session.
No demonstration data is sent to a server.

## GitHub Pages

The `deploy-acta-website.yml` workflow publishes this directory whenever a
change under `website/` is pushed to `master`.

For the first deployment, select **GitHub Actions** as the source under:

`Repository settings → Pages → Build and deployment`

The generated `github.io` address can later be replaced with a custom domain by
adding the domain in the same settings page and creating a `CNAME` file here.
