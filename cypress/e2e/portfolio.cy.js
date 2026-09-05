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

  it('renders and interacts with the Design vs Code playground in the hero', () => {
    cy.get('#hero-sandbox').should('be.visible');
    cy.get('#panel-design').should('be.visible');
    cy.get('#hsb-demo-btn').click();
    cy.get('#hsb-demo-btn').should('contain.text', 'Request Sent');

    // Switch to Code tab
    cy.get('#tab-code').click();
    cy.get('#panel-code').should('be.visible');
    cy.get('#panel-design').should('not.be.visible');
    cy.get('#hsb-copy-btn').click();
    cy.get('#hsb-copy-btn').should('contain.text', 'Copied');

    // Switch back to Design tab
    cy.get('#tab-design').click();
    cy.get('#panel-design').should('be.visible');
  });

  it('navigates to Borrow case study via project tile click', () => {
    cy.get('.project-tile').first().click();
    cy.url().should('include', 'borrow');
    cy.get('#borrow-view').should('be.visible');
    cy.get('.bw-hero-title').should('contain.text', 'Borrow');
  });
});
