# Eagra Labs public website

This directory is the static Eagra Labs marketing website and browser-only
demonstration of Bygo. It is intentionally independent from the production
application and does not call the Bygo API.

The demonstration stores its fictional working data in the browser's
`sessionStorage`. Signing out or selecting **Reset demo** deletes that session.
No demonstration data is sent to a server.

## GitHub Pages

The production website is published from a separate public GitHub repository.
Keeping the website release separate lets the application repository remain
private while the static site uses free GitHub Pages hosting.

The intended public address is [`https://eagralabs.com`](https://eagralabs.com).
The custom domain is configured through the public repository's Pages settings
after this directory has been published.

## Brand structure

- Eagra Labs is the company and portfolio brand.
- Bygo is the connected execution product.
- The interactive demonstration uses only fictional browser-session data.
