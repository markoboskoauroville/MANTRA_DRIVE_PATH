# LESSONS: Drive Full Path

1. **Drive opens "Show path" on mouse down and up, not on a bare `click()`** (31.10.2026). The first version called
   `more.click()` and read nothing; with `mousedown`, `mouseup`, then `click`, the menu opens and lists the hidden
   folders. Close it with an Escape keydown on the focused element.
2. **The visible menu is not the only `[role=menu]`** in Drive's page: the Help menu (Help, Training, Terms, Send
   feedback) is in the DOM too. The script takes the visible menu, listbox or dialog that is not the Help menu.
3. **The path has to come from Drive's page**: the collapsed folders are not in the DOM until "Show path" is opened.
