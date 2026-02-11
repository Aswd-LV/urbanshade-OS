

## Add "Enhanced Experience" Tutorial Page to Browser

### Overview
Add a new internal page at `enhance.urbanshade.local` in the Browser app that guides users through installing UrbanShade OS as a Progressive Web App (PWA). This removes the browser search bar and improves performance -- a better experience overall.

### What the page will contain

**1. Hero section** explaining the benefits:
- No search bar / address bar clutter
- Better performance (improved FPS)
- Feels like a native app
- Quick access from desktop/taskbar

**2. Step-by-step instructions with recreated UI mockups (in English)**

Based on the reference screenshots, the tutorial will include CSS-recreated mockups of Chrome's menu:

- **Step 1**: Click the three-dot menu (top-right of Chrome)
- **Step 2**: A recreated Chrome menu showing items like "New tab", "New window", "New incognito window", then below a section with "Passwords and autofill", "History", "Downloads", "Bookmarks and lists", "Tab groups", "Extensions", "Clear browsing data...", then "Zoom", then "Print...", "Search with Google Lens", "Translate...", "Find and edit", **"Save, share, and copy"** (highlighted), then "More tools", "Help", "Settings", "Exit"
- **Step 3**: The "Save, share, and copy" submenu expanded showing **"Cast..."**, **"Save page as... (Ctrl+S)"**, **"Create shortcut..."** (highlighted as the key action), **"Copy link"**, and greyed out items
- **Step 4**: A note about checking "Open as window" in the shortcut dialog

**3. Additional tips** section for other browsers (Edge has "Install as app" directly in the menu).

### Technical changes

**`src/components/apps/Browser.tsx`**:
- Add a new page entry `"enhance.urbanshade.local"` in the `pages` record
- The page content will be a self-contained JSX guide with CSS-drawn mockups of the Chrome menu UI (dark theme, matching the screenshots but in English)
- Add a link to the new page from the intranet homepage (`urbanshade.local`) and optionally from `docs.urbanshade.local`

### No version bump needed
This is a minor content addition to the Browser app, not a feature update warranting a changelog entry.

