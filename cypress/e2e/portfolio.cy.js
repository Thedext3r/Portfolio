describe('Portfolio Site & Navigation', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('loads home page and checks title & designer identity', () => {
    cy.title().should('contain', 'Sunil Ohdar');
    cy.get('nav#nav').should('be.visible');
  });

  it('renders the featured Borrow project tile on the landing page', () => {
    cy.get('.project-tile').scrollIntoView().should('be.visible');
    cy.get('.project-tile').should('contain.text', 'Borrow');
  });

  it('toggles dark and light mode without breaking styles', () => {
    cy.get('#theme-toggle').click();
    cy.get('body').should('have.class', 'night');
    cy.get('#theme-toggle').click();
    cy.get('body').should('not.have.class', 'night');
  });

  it('navigates to Borrow case study via project tile click', () => {
    cy.get('.project-tile').first().click();
    cy.url().should('include', 'borrow');
    cy.get('#borrow-view').should('be.visible');
    cy.get('.bw-hero-title').should('contain.text', 'Borrow');
  });
});
