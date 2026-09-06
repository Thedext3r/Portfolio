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

  it('renders asymmetric bento grid with interactive sandbox tiles', () => {
    cy.get('.bento-grid').scrollIntoView().should('be.visible');
    cy.get('.bento-card').should('have.length.at.least', 4);
    cy.get('#bento-mini-toggle').should('exist');
  });

  it('renders interactive draggable process timeline with 5 steps', () => {
    cy.get('.process-timeline-section').scrollIntoView().should('be.visible');
    cy.get('.process-card').should('have.length', 5);
  });

  it('toggles sound feedback on and off', () => {
    cy.get('.sound-toggle-btn').first().as('soundBtn');
    cy.get('@soundBtn').click();
    cy.get('@soundBtn').should('have.class', 'is-active');
    cy.get('@soundBtn').click();
    cy.get('@soundBtn').should('not.have.class', 'is-active');
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
