# Drive Full Path (Mantra Productions)

**A Firefox extension: the full path of the open Google Drive folder in a thin bar at the top of the window.** Drive
shortens a deep folder's breadcrumb to "Shared with me › … › FINAL › V3"; this writes the whole of it:
"LongevityStore › 02 For review › HIR_95 › FINAL › V3". A click on the bar copies it.

Marko, 31.10.2026, working in Drive for Elevate Media: *"I need at the top one overlay to see the full path to this
folder in G Drive ... the G Drive is giving me three dots and I don't see where I am"*, then *"Shared with me part I
don't need"*, then *"out of this we can make Firefox extension and publish it as my Mantra production extension. Please
let's build it and make a promo web page for it."*

- `extension/`: manifest.json (MV3, gecko id `drive-full-path@mantra-productions`, version = one whole number),
  content.js, icons. No permissions beyond the content script on drive.google.com; no network, no storage.
- `tools/build.sh`: `build/drive-full-path-<v>.zip`, the file addons.mozilla.org takes.
- `site/public/`: the promo page, https://mantradrivepath.pages.dev (Cloudflare Pages, deployed by
  `.github/workflows/deploy-pages.yml` on every push to main). Download counter `drivepath`, visits `drivepath`,
  Speechify keys.
- The same script as a userscript: ELEVATE_MEDIA_MONITOR `tools/drive-path.user.js`.

Documents: TAKEOVER.md (the state now), LESSONS.md (what was learned).
