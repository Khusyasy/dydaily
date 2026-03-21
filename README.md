# Do your Daily (DyDaily)

DyDaily is a simple tracker web app for making any task possible to have a streak counter like in daily quest that is usually found in many Gacha / Online games (Genshin, ZZZ, Blue Archive, etc).

## Features

### Daily Tracker with Streak Counter

- Add tasks with name and refresh time, with optional url
- Checkin to your task to mark as done, task with url will both open the url and mark it
- Streak counter

![DyDaily Preview 1](/docs/dydaily-preview-1.jpg)

![DyDaily Preview 2](/docs/dydaily-preview-2.jpg)

### Calendar View

- Show all completion with a monthly calendar view
- Late checkins (you can use it whenever but be honest to yourself!)

![DyDaily Preview 3](/docs/dydaily-preview-3.jpg)

![DyDaily Preview 4](/docs/dydaily-preview-4.jpg)

![DyDaily Preview 5](/docs/dydaily-preview-5.jpg)

### Data Export / Import

- Data stored fully locally on your browser
- Export / Import your data as plain json file
- Version support, your data is safe even with major updates

### PWA and Full Offline Support

- PWA ready, can be installed as an app on supported browser / device
- DyDaily works fully offline after the first load

## Future Plans
1. Task Editing Improvement
2. Reminders / Notifications
3. Dark Mode
4. and more... suggestions are welcome!

## Tech Stack
- Language: TypeScript
- Frontend: Vue.js
- Backend: Nuxt.js
- Styling: CSS, Tailwind CSS
- Deployment: Github Pages

# Development

## Setup

### Install

```bash
pnpm install
```

### Development Server

```bash
pnpm dev
```

### Build

```bash
pnpm generate
```

or 

```bash
npx nuxt build --preset github_pages
```

## Deploy to Github Pages

This repo uses Github Action based on the official documentation [here](https://nuxt.com/deploy/github-pages)
