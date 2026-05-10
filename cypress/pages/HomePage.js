import BasePage from './BasePage'

const selectors = {
  langSwitcher: '[class="lang-switcher"]>li',
  topNavigation: '[class="top-navigation"]',
  cinemaDropdownButton: '[class="button dropdown-button"]',
}

class HomePage extends BasePage {
  switchToEnglish() {
    cy.get(selectors.langSwitcher).each($el => {
      if ($el.get(0).innerText.trim() === 'ENG') {
        cy.wrap($el).click()
      }
    })
    return this
  }

  verifyEnglishLanguage() {
    cy.get(selectors.topNavigation).contains('Login/Sign up')
    return this
  }

  selectCinema(cinemaName) {
    cy.get(selectors.cinemaDropdownButton).contains('Select Cinema').click()
    cy.contains(cinemaName).click()
    return this
  }
}

export default HomePage
