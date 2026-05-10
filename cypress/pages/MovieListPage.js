import BasePage from './BasePage'

const selectors = {
  movieDropdownButton: '[class="button dropdown-button"]',
  movieName: 'h3[class="name"]',
  showtimeButton: '[class="button showtime-button"]',
}

class MovieListPage extends BasePage {
  selectMovie(movieName) {
    cy.get(selectors.movieDropdownButton).contains('All Movie').click()
    cy.get(selectors.movieName).contains(movieName).click()
    return this
  }

  clickShowtime() {
    cy.get(selectors.showtimeButton).contains('Showtime').click()
    return this
  }
}

export default MovieListPage
