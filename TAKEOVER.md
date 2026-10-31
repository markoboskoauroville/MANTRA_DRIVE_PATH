# TAKEOVER: Drive Full Path

**31.10.2026: version 2, click a name to travel** (build/drive-full-path-2.zip; the userscript in ELEVATE_MEDIA_MONITOR is
the same script, @version 2). Every crumb of Drive's breadcrumb carries its folder id (`data-id`), the items of the "Show
path" menu too; the open folder's id is in the address. The bar draws each name as an `<a href="/drive/u/N/folders/<id>">`;
a plain click calls `travel()`: Drive's own visible crumb, else its item in the "Show path" menu, pressed the way Drive takes
it (mouseover/mousemove at the item's centre, then down, up, click; after the menu's 200 ms fade, opacity > 0.98), else the
address. Modifier or middle click is left to the browser (new tab). Copy moved to ⧉ at the right. Also fixed: only crumbs
on screen are read (Drive keeps earlier folders' breadcrumbs in the page, hidden, and v1 could read a stale one), and a
"Show path" menu that gives nothing is asked again, three times at most. **Proven** in his Firefox (tools/load_in_firefox.py,
his Drive, account u/1): FINAL → 01 Raw (hidden in the menu) → LongevityStore (hidden) → Back, and FINAL → HIR_98 (visible
crumb): each went there without a page reload and the bar followed every move; the tab was left on FINAL. **Published:** Marko
uploaded version 2 to addons.mozilla.org and tried it himself the same day: *"It works fantastic"* (31.10.2026). The public
AMO API still answered "Authentication credentials were not provided" for the slug at that moment: check the public page
and its "Add to Firefox" link at the next session. On Developer Hub (18:08–18:10) version 2 is Awaiting Review with its
Version Notes (pasted by Macro Recorder; AMO pages refuse WebDriver BiDi, "System access is required") and Notes for
Reviewers (why synthetic mouse events, no permissions or network, how to test); Marko pressed Save. The promo page says
"version 2" and has the "Click to travel" card.


State on 31.10.2026: **version 1 built** (`tools/build.sh` → build/drive-full-path-1.zip, 15 KB). The script was tested
in Marko's own Firefox on his Drive folder (injected through firefoxctl): the bar read "LongevityStore › 02 For rewiew ›
HIR_95_FiveSupplementsRanked_KitchenTableMum_UGC_EN › FINAL › V3" and Drive's "Show path" menu closed again.

Next:
- **Submitted 31.10.2026** on addons.mozilla.org, listed, by the Mozilla account marko.bosko@auroville.community
  (AMO profile "Mantra Productions", user 20291068; two-step sign-in, backup codes in ~/Downloads/API/mozilla-backup-codes.txt).
  Slug `drive-full-path`. Validation: no errors, 2 warnings. Category Appearance, All Rights Reserved, support
  marko.bosko@auroville.community / mantradrivepath.pages.dev, no privacy policy (collects nothing), source code: No.
  Mozilla publishes within ~24 h (longer on manual review) and emails him. Then check the page's "Add to Firefox" link.
- Next on AMO: the listing's screenshot (Manage Listing; site/public/shot-bar.png) and the profile photo (brand/mantra-productions-512.png; it did not take on the first try).
- The promo page's picture (site/public/shot-bar.png) uses neutral folder names; never a client's real names there.
