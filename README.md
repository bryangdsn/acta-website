# Acta public website

This directory is the static Acta marketing website and browser-only product
demonstration. It is intentionally independent from the production application
and does not call the Acta API.

The demonstration stores its fictional working data in the browser's
`sessionStorage`. Signing out or selecting **Reset demo** deletes that session.
No demonstration data is sent to a server.

## GitHub Pages

The production website is published from the public
[`bryangdsn/acta-website`](https://github.com/bryangdsn/acta-website)
repository. Keeping the website release separate lets the application
repository remain private while the static site uses free GitHub Pages hosting.

The live address is
[`https://bryangdsn.github.io/acta-website/`](https://bryangdsn.github.io/acta-website/).
It can later use a custom domain through the public repository's Pages settings.
