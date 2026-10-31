// Drive Full Path, by Mantra Productions (Marko Bosko).
// Google Drive shortens a deep folder's breadcrumb to "Shared with me › … › FINAL › V3". This writes the whole path,
// in small letters, in a thin bar at the very top of the page: LongevityStore › 02 For review › HIR_95 › FINAL › V3.
// How: Drive's breadcrumb is a [role=list] of crumbs and the hidden middle sits behind its "Show path" button. Once per
// folder the button's menu is opened, read and closed again, and the crumbs are joined. A click on the bar copies the
// path. Nothing leaves the page: no network request, no storage, no permission beyond drive.google.com.
(function () {
  "use strict";
  const bar = document.createElement("div");
  bar.id = "mantra-drive-path";
  Object.assign(bar.style, {
    position: "fixed", top: "0", left: "0", right: "0", zIndex: "2147483647", height: "18px", lineHeight: "18px",
    padding: "0 10px", font: "11px -apple-system, Helvetica, sans-serif", color: "#e8eaed",
    background: "rgba(20, 20, 20, 0.88)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
    cursor: "copy", display: "none",
  });
  bar.title = "The full path of this folder; a click copies it";
  bar.addEventListener("click", () => navigator.clipboard && navigator.clipboard.writeText(bar.textContent));
  document.documentElement.appendChild(bar);

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let shownFor = "", busy = false;

  function crumbsList() {
    const b = [...document.querySelectorAll("[role=button]")].find((e) => e.getAttribute("aria-label") === "Show path");
    const anyCrumb = b || [...document.querySelectorAll("[role=list] [role=link]")].find((e) => e.offsetParent);
    return { list: anyCrumb && anyCrumb.closest("[role=list]"), more: b };
  }

  async function hidden(more) {
    // the menu that "Show path" opens: the one visible menu right after the click
    // Drive opens it on the mouse's down and up, not on a bare click()
    more.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    more.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
    more.click();
    let names = [];
    for (let i = 0; i < 10 && !names.length; i++) {
      await sleep(80);
      const m = [...document.querySelectorAll("[role=menu],[role=listbox],[role=dialog]")]
        .find((x) => x.getBoundingClientRect().height > 0 && !x.contains(more) && !/Help|Training|Send feedback/.test(x.innerText));
      if (m) names = m.innerText.split("\n").map((s) => s.trim()).filter(Boolean);
    }
    (document.activeElement || more).dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", code: "Escape", keyCode: 27, bubbles: true }));
    return names;
  }

  async function update() {
    if (busy) return;
    const here = location.href;
    if (!/\/folders\/|\/my-drive|\/shared-with-me|\/drive\/u\/\d+\/?$/.test(location.pathname)) { bar.style.display = "none"; shownFor = ""; return; }
    if (here === shownFor) return;
    const { list, more } = crumbsList();
    if (!list) return;                                  // not drawn yet: the next tick tries again
    busy = true;
    try {
      const parts = [];
      for (const c of list.querySelectorAll("[role=link],[role=button]")) {
        if (c === more) parts.push(...(await hidden(more)));
        else { const t = (c.innerText || c.getAttribute("aria-label") || "").trim(); if (t) parts.push(t); }
      }
      if (location.href !== here) return;               // moved on meanwhile
      // Marko, 31.10.2026: "Shared with me part I don't need": the path starts at the first real folder
      if (parts[0] === "Shared with me") parts.shift();
      bar.textContent = parts.join("  ›  ");
      bar.style.display = parts.length ? "block" : "none";
      shownFor = here;
    } finally { busy = false; }
  }

  setInterval(update, 700);
})();
