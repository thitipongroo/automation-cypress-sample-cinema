# Cypress Cinema Automation

[![Cypress Tests](https://github.com/thitipongroo/automation-cypress-sample-cinema/actions/workflows/cypress.yml/badge.svg)](https://github.com/thitipongroo/automation-cypress-sample-cinema/actions/workflows/cypress.yml)

E2E automation test suite for the [SF Cinema City](https://www.sfcinemacity.com) booking platform, built with Cypress 13 using the Page Object Model architecture.

---

## Architecture

```text
┌─────────────────────────────────────────────────┐
│                  CI / GitHub Actions             │
│   push / PR → cypress-io/github-action@v6        │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│              Test Spec Layer                     │
│   cypress/e2e/cinema/check_showtime.cy.js        │
│   - loads fixture data (cinema.json)             │
│   - orchestrates page objects                    │
└──┬───────┬────────┬────────┬────────────────────┘
   │       │        │        │
   ▼       ▼        ▼        ▼
HomePage  Movie  Showtime  SeatSelection
  Page    List    Page       Page
  .js     Page   .js        .js
           .js
   └───────┴────────┴────────┘
              Page Object Layer
              (selectors + interactions)
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│           Cypress Browser Automation             │
│   Chromium (headless in CI, headed locally)      │
└────────────────────┬────────────────────────────┘
                     │  live HTTP
                     ▼
         https://www.sfcinemacity.com
```

---

## Tech Stack

| Tool | Version | Why |
| ---- | ------- | --- |
| [Cypress](https://www.cypress.io) | ^13.x | Modern E2E framework — built-in auto-waiting, time-travel debugger, screenshot/video on failure, no WebDriver overhead |
| [Mochawesome](https://github.com/adamgruber/mochawesome) | ^7.x | Stakeholder-friendly HTML reports; JSON shards allow parallel merge |
| [ESLint](https://eslint.org) + cypress plugin | ^8.x | Catches Cypress anti-patterns (e.g., `cy.wait` with hard-coded numbers) at lint time |
| GitHub Actions (`cypress-io/github-action`) | v6 | Official Cypress CI action handles caching, browser install, and retry logic out of the box |

---

## Project Structure

```text
automation-cypress-sample-cinema/
├── .github/
│   └── workflows/
│       └── cypress.yml             # CI: runs on every push and PR
├── cypress/
│   ├── e2e/
│   │   └── cinema/
│   │       └── check_showtime.cy.js   # Showtime booking test suite
│   ├── fixtures/
│   │   └── cinema.json             # Externalised test data (location, movie)
│   ├── pages/
│   │   ├── BasePage.js             # Shared visit() method
│   │   ├── HomePage.js             # Language switcher + cinema dropdown
│   │   ├── MovieListPage.js        # Movie picker + showtime nav
│   │   ├── ShowtimePage.js         # Date assertion + showtime picker
│   │   └── SeatSelectionPage.js    # Seat screen assertion
│   ├── screenshots/                # Auto-saved on test failure
│   └── support/
│       ├── e2e.js                  # Global setup (imported before every spec)
│       └── commands.js             # Custom cy.* commands
├── cypress.config.js
└── package.json
```

---

## System Flow

```text
1. CI checkout  →  npm ci  →  cypress run
2. Cypress loads check_showtime.cy.js
3. cy.fixture('cinema') loads { location, movie } from cinema.json
4. HomePage.visit()            → navigate to sfcinemacity.com
5. HomePage.switchToEnglish()  → click language toggle, assert EN header
6. HomePage.selectCinema()     → pick cinema from dropdown
7. MovieListPage.selectMovie() → find movie card, click Showtime
8. ShowtimePage.verifyTodayDate()          → assert today's date chip is active
9. ShowtimePage.verifyShowtimeListExists() → assert >0 showtime rows
10. ShowtimePage.selectShowtimeWithinHours(now, now+6h)
     → filter slots to next 6 h, click the first available
11. SeatSelectionPage.verifySeatSelectionVisible() → assert seat grid renders
12. Mochawesome writes JSON shard → merged into HTML report
```

---

## Test Scenarios

**`check_showtime.cy.js`** — full end-to-end cinema showtime booking flow:

| Step | Description | Assertion |
| ---- | ----------- | --------- |
| 1 | Visit SF Cinema City | Page title visible |
| 2 | Switch to English | EN language active |
| 3 | Select cinema location | Dropdown value matches fixture |
| 4 | Select movie → showtime nav | Showtime page loads |
| 5 | Verify today's date pre-selected | Date chip matches `new Date()` |
| 6 | Verify showtime list populated | `>0` showtime slots rendered |
| 7 | Select first slot within next 6 h | Slot clicked without error |
| 8 | Verify seat selection screen | Seat grid container is visible |

---

## Test Data

Cinema location and movie are decoupled from the spec. Edit `cypress/fixtures/cinema.json`:

```json
{
  "location": "SFX CINEMA Central Rama 9",
  "movie": "1917"
}
```

---

## Setup

```bash
npm install
```

## Running Tests

```bash
# Headless (CI mode)
npm test

# Headed browser
npm run test:headed

# Interactive Cypress UI
npm run test:open

# Run and generate Mochawesome HTML report
npm run test:report
```

Merge JSON shards into a single HTML report after a multi-spec run:

```bash
npx mochawesome-merge cypress/reports/*.json -o cypress/reports/merged.json
npx marge cypress/reports/merged.json --reportDir cypress/reports
```

Reports are written to `cypress/reports/`.

---

## Configuration

Key settings in `cypress.config.js`:

| Setting | Value | Note |
| ------- | ----- | ---- |
| `baseUrl` | `https://www.sfcinemacity.com` | Live production site |
| `viewportWidth` | 1280 | Desktop breakpoint |
| `viewportHeight` | 720 | HD baseline |
| `retries` (run mode) | 2 | Mitigates transient network flakiness |
| `defaultCommandTimeout` | 8 000 ms | Allows for slow API responses |
| `pageLoadTimeout` | 30 000 ms | Handles heavy SPA bootstrap |
| `video` | false | Disabled to reduce CI artifact size |
| `screenshotOnRunFailure` | true | Auto-captures on failure |
| `reporter` | mochawesome | JSON shards for parallel merge |

---

## CI/CD

GitHub Actions runs the full suite on every **push** and **pull request** to any branch.

```yaml
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: cypress-io/github-action@v6   # installs, caches, runs
```

The pipeline:

1. Checks out the repository
2. Installs Node.js + dependencies via the official Cypress action (with caching)
3. Runs Cypress headlessly against the live SF Cinema City site
4. Uploads screenshots and reports as artifacts on failure

---

## Screenshots

> Test failure screenshots are automatically saved to `cypress/screenshots/`.

![Cypress run screenshot](cypress/screenshots/All%20Specs/my-image.png)

---

## Tradeoffs

| Decision | Alternative | Reasoning |
| -------- | ----------- | --------- |
| Test against live site | Stub with `cy.intercept` | Validates real booking flow; downside is flakiness when the site changes |
| POM pattern | Flat spec files | Selectors live in one place — one change per page, not N test updates |
| Mochawesome JSON shards | Single HTML reporter | Shards survive parallel runs and can be merged after all workers finish |
| `retries: 2` in CI | `retries: 0` | Absorbs transient network timeouts against the live site without masking real failures |

---

## Scaling Considerations

| Concern | Approach |
| ------- | -------- |
| Slow suite as specs grow | Parallelise with [Cypress Cloud](https://cloud.cypress.io) — distribute specs across N CI workers |
| Selector drift when the site redesigns | Centralise all selectors in page objects; a UI change requires one file edit |
| Flaky third-party assets | Use `cy.intercept` to stub slow banner/ad calls while keeping the booking API live |
| Multiple cinemas / movies | Parameterise fixture with an array and use `Cypress.each` to generate test cases |
