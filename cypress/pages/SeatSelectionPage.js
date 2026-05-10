import BasePage from './BasePage'

class SeatSelectionPage extends BasePage {
  verifySeatSelectionVisible() {
    cy.contains('Selected Seat').should('be.visible')
    return this
  }
}

export default SeatSelectionPage
