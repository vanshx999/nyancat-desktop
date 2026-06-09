🐱 NyanCat Desktop
A free, open-source pixel cat that lives on your desktop — follows your cursor, reacts to typing, and reminds you to stretch.

Inspired by Comnyang — but completely free and open source.

Show Image

Features

🐾 Cursor following — smooth easing, always near you
⌨️ Typing reactions — paws tap when you type, turns red when you type too fast (overheat mode)
🧘 Stretch reminders — every 30 min, cat reminds you to move
💤 Idle animations — tail wag when resting
😻 Hover to pet — purrs when you mouse over


Download
PlatformLinkmacOS (.dmg)Download →Windows (.exe)Download →

No Node.js required for the downloads above.


Run from source
Prerequisites: Node.js 18+
bashgit clone https://github.com/vanshx999/nyancat-desktop
cd nyancat-desktop
npm install
npm start
macOS: Grant Accessibility permission for typing reactions:
System Settings → Privacy & Security → Accessibility → Add Terminal

Customize
WhatWhereStretch intervalSTRETCH_INTERVAL_MS in main.jsCat colorsC color object in src/index.htmlCat sizeS (scale) in src/index.html

Project structure
nyancat-desktop/
├── main.js          # Electron main process
├── preload.js       # IPC bridge
├── src/
│   └── index.html   # Pixel cat + animation state machine
└── package.json

License
MIT — free forever.

Built with Electron. Pixel art hand-crafted with love 🖤