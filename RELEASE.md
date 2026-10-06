# Release review

No production deployment, merge, or DNS change is authorized until the user reviews the
mobile screenshots and explicitly approves release.

## Domain readiness checked on 2026-10-06

All three zones are active in the authenticated Cloudflare account. Zone ownership/access
was confirmed through the account's read-only API. This is not registrar ownership verification.

| Host | Public DNS / HTTPS | Current Worker route |
| --- | --- | --- |
| joseph-tech-solutions.dev | Resolves; valid HTTPS; redirects to /v4/ | portfolio |
| www.joseph-tech-solutions.dev | Resolves; valid HTTPS; redirects to /v4/ | portfolio |
| yosefhayimsabag.com | No A answer; local resolver fails | None |
| www.yosefhayimsabag.com | No A answer; local resolver fails | None |
| yosefhayimsabag.dev | No A answer; local resolver fails | None |
| www.yosefhayimsabag.dev | No A answer; local resolver fails | None |

JTS apex and www resolve to Cloudflare proxy addresses. The legacy domains were also checked
against 1.1.1.1 and returned no A answers. Their TLS readiness cannot be verified over HTTPS
until public DNS works. The current OAuth token can read zones and Worker routes, but DNS
record and certificate-pack reads returned HTTP 403. Certificate inventory remains unverified.

## Prepared behavior

`client/wrangler.jsonc` declares all six intended routes for the existing `portfolio` Worker.
This is configuration only; no routes were changed during implementation.
The Worker redirects all five noncanonical hosts to the HTTPS JTS apex using HTTP 308,
preserving path and query. Canonical HTTP also redirects to HTTPS.
All unknown and retired paths return HTTP 404 through the static asset binding.

## After explicit approval

1. Confirm legacy DNS records and certificate status with appropriate Cloudflare access.
   Restore the four missing proxied hostnames and verify TLS issuance. Do not change mail records.
2. Squash merge the reviewed PR and use the approved main commit for the release.
3. Run frozen install, checks, and `pnpm --dir client deploy`. This builds one client and updates
   the existing Worker and the declared routes. No backend, R2 binding, or secrets are needed.
4. Verify canonical HTTPS returns the new site. Verify every alternate hostname returns 308
   to the canonical apex with an encoded path and query intact. The destination of a retired
   path must return 404, not a home page or a loop.
5. Check images, scripts, styles, both languages, and localized WhatsApp destinations on the
   real domains. Save the approved commit and deployed version identifiers in the PR.

Before deploying, record the current Worker version for rollback. Roll back that version if
live verification fails, and restore only DNS/routes changed during this release if necessary.
