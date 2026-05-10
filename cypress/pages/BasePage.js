class BasePage {
  visit(path = '/') {
    cy.visit(path)
    return this
  }
}

export default BasePage
