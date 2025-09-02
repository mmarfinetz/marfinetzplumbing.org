# Cleanup Report

This repo had several safe-to-remove or ignore items. I grouped them below by action.

## Safe deletions applied now
- .DS_Store: Removed all macOS metadata files across the repo.
- yarn.lock: Removed to avoid lockfile conflict (npm is used via package-lock.json).
- Empty dirs: Removed empty `assets/`, `scripts/`, `tmp/` if empty.

## Ignored going forward (updated .gitignore)
- .dev-temp/: Temporary build/output folder.
- tmp/: Local temp folder.
- .cursor/, .claude/: Local AI/editor config directories.

## Already ignored and untracked (leave as-is)
- node_modules/, .next/, out/: Build artifacts.
- venv/: Python virtual environment.
- api/lead-tracking/node_modules: Local deps for API subproject.

## Candidates to remove (manual review)
- win95-winxp_icons/: No references found in code; docs marked it likely unused.
- .cursor/ tracked files: 7 files are currently tracked; can remove from repo (then git will ignore).
- originalindex.html: No inbound references found; appears to be a backup copy.
- test-suite.* and various local shell scripts: Already listed in .gitignore but still tracked; consider removing from repo.
- img/Spongebob - Where's The Leak Ma'am.mp4: No references found; currently already deleted in working tree.
- .dev-temp/: All files already deleted in working tree; commit the deletions and add to .gitignore (done).

## Notes
- api/lead-tracking: Most size comes from local node_modules and logs; they are already untracked. Keep unless you want to prune local installs.
- Lockfile choice: package-lock.json is tracked; yarn.lock was ignored. Stick with npm to avoid conflicts.

## Suggested commit message
Cleanup: remove .DS_Store/yarn.lock, ignore dev temp and tool dirs

- Remove .DS_Store files and yarn.lock
- Add .dev-temp/, tmp/, .cursor/, .claude/ to .gitignore
- (Optional) Remove win95-winxp_icons, originalindex.html, tracked .cursor files, local test scripts

