import BasePage from './BasePage'

const selectors = {
  selectedDate: '[class="selected"]>p',
  showtimeListContainer: '[class="showtime-list"]>div',
  timeListItem: '[class="time-list"]>li',
}

class ShowtimePage extends BasePage {
  verifyTodayDate(dateString) {
    cy.get(selectors.selectedDate).contains(dateString)
    return this
  }

  verifyShowtimeListExists() {
    cy.get(selectors.showtimeListContainer)
      .children()
      .children()
      .children()
      .children()
      .should('exist')
    return this
  }

  selectShowtimeWithinHours(startTime, endTime) {
    cy.get(selectors.timeListItem).each($item => {
      const time = $item.get(0).innerText.trim()
      if (time >= startTime && time <= endTime) {
        cy.wrap($item.children()).click()
      }
    })
    return this
  }
}

export default ShowtimePage
