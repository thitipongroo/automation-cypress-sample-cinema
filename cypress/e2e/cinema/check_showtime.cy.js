import HomePage from '../../pages/HomePage'
import MovieListPage from '../../pages/MovieListPage'
import ShowtimePage from '../../pages/ShowtimePage'
import SeatSelectionPage from '../../pages/SeatSelectionPage'

const homePage = new HomePage()
const movieListPage = new MovieListPage()
const showtimePage = new ShowtimePage()
const seatSelectionPage = new SeatSelectionPage()

function getTodayDate() {
  return new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function getTimeRange(hoursAhead) {
  const now = new Date()
  const later = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000)
  return {
    nowTime: now.toTimeString().substring(0, 5),
    maxTime: later.toTimeString().substring(0, 5),
  }
}

describe('Cinema Showtime Booking', () => {
  let cinemaData

  before(() => {
    cy.fixture('cinema').then(data => {
      cinemaData = data
    })
  })

  it('visits the SF Cinema City website', () => {
    homePage.visit()
  })

  it('switches to English language', () => {
    homePage.switchToEnglish().verifyEnglishLanguage()
  })

  it('selects the cinema location', () => {
    homePage.selectCinema(cinemaData.location)
  })

  it('selects a movie and navigates to showtimes', () => {
    movieListPage.selectMovie(cinemaData.movie).clickShowtime()
  })

  it('verifies the current date is pre-selected', () => {
    showtimePage.verifyTodayDate(getTodayDate())
  })

  it('verifies the showtime list is populated', () => {
    showtimePage.verifyShowtimeListExists()
  })

  it('selects the first available showtime within the next 6 hours', () => {
    const { nowTime, maxTime } = getTimeRange(6)
    showtimePage.selectShowtimeWithinHours(nowTime, maxTime)
  })

  it('verifies the seat selection screen appears', () => {
    seatSelectionPage.verifySeatSelectionVisible()
  })
})
