# Cypress Cinema Automation

E2E automation test suite for the [SF Cinema City](https://www.sfcinemacity.com) booking platform, built with Cypress using the Page Object Model architecture.

## Tech Stack

| Tool | Version | Purpose |
| ---- | ------- | ------- |
| [Cypress](https://www.cypress.io) | ^13.x | E2E testing framework |
| [Mochawesome](https://github.com/adamgruber/mochawesome) | ^7.x | HTML test reports |
| [ESLint](https://eslint.org) + cypress plugin | ^8.x | Code linting |
| GitHub Actions | — | CI/CD pipeline |

## Project Structure

```text
automation-cypress-sample-cinema/
├── .github/
│   └── workflows/
│       └── cypress.yml          # CI pipeline
├── cypress/
│   ├── e2e/
│   │   └── cinema/
│   │       └── check_showtime.cy.js   # Showtime booking test
│   ├── fixtures/
│   │   └── cinema.json          # Test data (location, movie)
│   ├── pages/
│   │   ├── BasePage.js          # Shared base class
│   │   ├── HomePage.js          # Language & cinema selection
│   │   ├── MovieListPage.js     # Movie selection & showtime nav
│   │   ├── ShowtimePage.js      # Date & showtime verification
│   │   └── SeatSelectionPage.js # Seat selection assertions
│   └── support/
│       ├── e2e.js               # Global setup entry point
│       └── commands.js          # Custom Cypress commands
├── cypress.config.js
└── package.json
```

## Page Object Model

Each page is encapsulated in its own class under `cypress/pages/`. Selectors and interactions live in the page class, keeping test specs clean and readable.

| Page Class | Responsibility |
| ---------- | -------------- |
| `BasePage` | `visit()` shared across all pages |
| `HomePage` | Language switching, cinema dropdown selection |
| `MovieListPage` | Movie picker, Showtime button |
| `ShowtimePage` | Date assertion, showtime list, showtime picker |
| `SeatSelectionPage` | Seat selection screen assertion |

## Test Scenarios

**`check_showtime.cy.js`** — end-to-end cinema showtime booking flow:

1. Visit SF Cinema City website
2. Switch UI language to English
3. Select cinema location (driven by `cinema.json`)
4. Select a movie and navigate to the showtime screen
5. Assert today's date is pre-selected
6. Assert the showtime list is populated
7. Select the first available showtime within the next 6 hours
8. Assert the seat selection screen appears

## Test Data

Cinema location and movie are decoupled from the test spec. Edit `cypress/fixtures/cinema.json` to target a different cinema or movie:

```json
{
  "location": "SFX CINEMA Central Rama 9",
  "movie": "1917"
}
```

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

# Run & generate Mochawesome HTML report
npm run test:report
```

Reports are written to `cypress/reports/`. To merge JSON shards into a single HTML report after a run:

```bash
npx mochawesome-merge cypress/reports/*.json -o cypress/reports/merged.json
npx marge cypress/reports/merged.json --reportDir cypress/reports
```

## CI/CD

GitHub Actions runs the full suite on every **push** and **pull request**. See [.github/workflows/cypress.yml](.github/workflows/cypress.yml).

The pipeline:

- Checks out the repository
- Installs dependencies via `npm ci`
- Runs Cypress against the live SF Cinema City site

## Configuration

Key settings in `cypress.config.js`:

| Setting | Value |
| ------- | ----- |
| `baseUrl` | `https://www.sfcinemacity.com` |
| `viewportWidth` | 1280 |
| `viewportHeight` | 720 |
| `retries` (run mode) | 2 |
| `defaultCommandTimeout` | 8 000 ms |
| `pageLoadTimeout` | 30 000 ms |
| `reporter` | mochawesome |
