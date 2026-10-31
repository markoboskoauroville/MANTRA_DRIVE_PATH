// Drive Full Path, by Mantra Productions (Marko Bosko).
// Google Drive shortens a deep folder's breadcrumb to "Shared with me › … › FINAL › V3". This writes the whole path,
// in small letters, in a thin bar at the very top of the page: LongevityStore › 02 For review › HIR_95 › FINAL › V3.
// How: Drive's breadcrumb is a [role=list] of crumbs and the hidden middle sits behind its "Show path" button. Once per
// folder the button's menu is opened, read and closed again, and the crumbs are joined. Every crumb carries its folder's
// id (data-id), so (version 2, Marko 31.10.2026: "I can click on the path names and travel through my tree") every name
// in the bar is a link to its folder: a click goes there inside Drive, a middle or ⌘ click opens it in a new tab. ⧉ at the
// right copies the path. Nothing leaves the page: no network request, no storage, no permission beyond drive.google.com.
(function () {
  "use strict";
  const INK = "#e8eaed", HOVER = "#8ab4f8";
  const bar = document.createElement("div");
  bar.id = "mantra-drive-path";
  Object.assign(bar.style, {
    position: "fixed", top: "0", left: "0", right: "0", zIndex: "2147483647", height: "18px", lineHeight: "18px",
    padding: "0 28px 0 10px", font: "11px -apple-system, Helvetica, sans-serif", color: INK,
    background: "rgba(20, 20, 20, 0.88)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
    display: "none", boxSizing: "border-box",
  });
  const path = document.createElement("span");
  const copy = document.createElement("span");
  copy.textContent = "⧉";
  copy.title = "Copy the path";
  Object.assign(copy.style, { position: "absolute", right: "8px", top: "0", cursor: "copy", color: INK });
  copy.addEventListener("click", () => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(path.textContent);
    copy.textContent = "✓"; setTimeout(() => { copy.textContent = "⧉"; }, 900);
  });
  bar.append(path, copy);
  document.documentElement.appendChild(bar);

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let shownFor = "", busy = false, tries = 0, triedFor = "";

  // the account part of the address (/drive/u/1/), so a link stays in the same Google account
  function base() { const m = location.pathname.match(/^\/drive\/u\/\d+\//); return m ? m[0] : "/drive/"; }
  function folderOf(href) { const m = href.match(/\/folders\/([^/?#]+)/); return m && m[1]; }

  // Drive keeps the breadcrumbs of the folders seen before in the page, hidden: only what is on screen counts
  const seen = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  function crumbsList() {
    const b = [...document.querySelectorAll("[role=button]")].find((e) => e.getAttribute("aria-label") === "Show path" && seen(e));
    const anyCrumb = b || [...document.querySelectorAll("[role=list] [role=link]")].find(seen);
    return { list: anyCrumb && anyCrumb.closest("[role=list]"), more: b };
  }

  function press(el) {
    // Drive acts on the mouse's down and up, not on a bare click(); its menus take only the item under the pointer,
    // so the pointer comes over it first, at its centre
    const r = el.getBoundingClientRect();
    const o = { bubbles: true, cancelable: true, view: window, clientX: r.x + r.width / 2, clientY: r.y + r.height / 2 };
    for (const t of ["mouseover", "mouseenter", "mousemove", "mousedown", "mouseup", "click"]) el.dispatchEvent(new MouseEvent(t, o));
  }
  function escape(more) {
    (document.activeElement || more).dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", code: "Escape", keyCode: 27, bubbles: true }));
  }
  async function openMenu(more) {
    more.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    more.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
    more.click();
    for (let i = 0; i < 20; i++) {
      await sleep(50);
      const m = [...document.querySelectorAll("[role=menu],[role=listbox],[role=dialog]")]
        .find((x) => x.getBoundingClientRect().height > 0 && !x.contains(more) && !/Help|Training|Send feedback/.test(x.innerText));
      // the menu fades in for about 200 ms; a press during the fade is ignored
      if (m && m.innerText.trim() && parseFloat(getComputedStyle(m).opacity) > 0.98) return m;
    }
    return null;
  }

  // the hidden middle: each folder of the "Show path" menu with its id
  async function hidden(more) {
    const m = await openMenu(more);
    let parts = [];
    if (m) {
      const items = [...m.querySelectorAll("[role=menuitem]")];
      parts = items.length
        ? items.map((i) => ({ name: i.innerText.trim(), id: i.getAttribute("data-id") })).filter((p) => p.name)
        : m.innerText.split("\n").map((s) => s.trim()).filter(Boolean).map((name) => ({ name, id: null }));
    }
    escape(more);
    return parts;
  }

  // a click on a name: the way Drive itself goes there (its own crumb, or its item in the "Show path" menu), so the
  // page is not loaded again; when neither is found, the folder's address
  async function travel(p) {
    if (p.id) {
      const crumb = [...document.querySelectorAll("[role=list] [data-id]")].find((e) => e.getAttribute("data-id") === p.id && seen(e));
      if (crumb) { press(crumb); return; }
      const { more } = crumbsList();
      if (more) {
        const m = await openMenu(more);
        const item = m && [...m.querySelectorAll("[role=menuitem]")].find((e) => e.getAttribute("data-id") === p.id);
        if (item) { press(item); return; }
        escape(more);
      }
    }
    location.assign(p.href);
  }

  function draw(parts) {
    path.replaceChildren();
    parts.forEach((p, k) => {
      if (k) { const sep = document.createElement("span"); sep.textContent = "  ›  "; sep.style.opacity = "0.6"; path.append(sep); }
      const last = k === parts.length - 1;
      if (!p.href || last) {                                 // where we are: plain, a little brighter
        const t = document.createElement("span"); t.textContent = p.name; if (last) t.style.fontWeight = "600"; path.append(t);
        return;
      }
      const a = document.createElement("a");
      a.textContent = p.name;
      a.href = p.href;
      a.title = "Open " + p.name;
      Object.assign(a.style, { color: INK, textDecoration: "none", cursor: "pointer" });
      a.addEventListener("mouseenter", () => { a.style.color = HOVER; a.style.textDecoration = "underline"; });
      a.addEventListener("mouseleave", () => { a.style.color = INK; a.style.textDecoration = "none"; });
      a.addEventListener("click", (ev) => {
        if (ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;   // a new tab: the browser's
        ev.preventDefault();
        travel(p);
      });
      path.append(a);
    });
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
      let missed = false;
      const crumbs = [...list.querySelectorAll("[role=link],[role=button]")];
      for (const c of crumbs) {
        if (c === more) {
          const h = await hidden(more);
          if (!h.length) missed = true;
          parts.push(...h);
        } else {
          const name = (c.innerText || c.getAttribute("aria-label") || "").trim();
          if (!name) continue;
          const id = c.getAttribute("data-id") || (c.closest("[data-id]") && c.closest("[data-id]").getAttribute("data-id"));
          const view = c.getAttribute("data-view") || "";
          parts.push({ name, id, view });
        }
      }
      if (location.href !== here) return;               // moved on meanwhile
      // the open folder is the last crumb; its id is in the address
      if (parts.length && !parts[parts.length - 1].id) parts[parts.length - 1].id = folderOf(location.pathname);
      for (const p of parts) {
        p.href = p.id ? base() + "folders/" + p.id
          : /shared-with-me/i.test(p.view) || p.name === "Shared with me" ? base() + "shared-with-me"
          : p.name === "My Drive" ? base() + "my-drive" : null;
      }
      // Marko, 31.10.2026: "Shared with me part I don't need": the path starts at the first real folder
      if (parts.length && parts[0].name === "Shared with me") parts.shift();
      draw(parts);
      bar.style.display = parts.length ? "block" : "none";
      if (triedFor !== here) { triedFor = here; tries = 0; }
      if (!missed || ++tries >= 3) shownFor = here;     // the hidden part not read: asked again, three times at most
    } finally { busy = false; }
  }

  setInterval(update, 700);
})();
