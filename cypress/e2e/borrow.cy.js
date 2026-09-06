describe('Borrow App Case Study', () => {
  beforeEach(() => {
    cy.visit('/#borrow');
  });

  it('loads the Borrow case study view and displays hero details', () => {
    cy.get('#borrow-view').should('be.visible');
    cy.get('.bw-hero-title').should('contain.text', 'Borrow');
    cy.get('.bw-hero-tagline').should('contain.text', 'neighborhood item-lending mobile app');
  });

  it('displays research section with survey stats and finding cards', () => {
    cy.get('#bw-research').scrollIntoView().should('be.visible');
    cy.get('.bw-stat-num').should('have.length.at.least', 3);
    cy.get('.bw-finding-row').should('have.length', 3);
  });

  it('renders interactive design decisions accordion and toggles open state', () => {
    cy.get('#bw-decisions').scrollIntoView();
    cy.get('.bw-decision-card').first().as('firstCard');
    cy.get('@firstCard').should('have.class', 'open');

    // Click second card to open it
    cy.get('.bw-decision-card').eq(1).as('secondCard');
    cy.get('@secondCard').find('.bw-decision-btn').click();
    cy.get('@secondCard').should('have.class', 'open');
    cy.get('@firstCard').should('not.have.class', 'open');
  });

  it('shows all high-fidelity interface screens and design tokens', () => {
    cy.get('#bw-design').scrollIntoView();
    cy.get('.bw-screen-card').should('have.length.at.least', 5);
    cy.get('.bw-swatch').should('have.length.at.least', 4);
    cy.get('.bw-wireframe-banner').scrollIntoView().should('be.visible');
    cy.get('.bw-wireframe-banner img').should('be.visible');
  });

  it('renders sticky chapter rail and allows chapter navigation', () => {
    cy.get('.bw-chapter-rail-container').should('exist');
    cy.get('.bw-chapter-item').should('have.length.at.least', 6);
  });

  it('interacts with live embedded working prototypes', () => {
    cy.get('#bw-prototypes').scrollIntoView().should('be.visible');
    cy.get('.proto-choice-chip').contains('Today (4 hrs)').click().should('have.class', 'active');
    cy.get('.proto-send-btn').click().should('contain.text', 'Request Sent');
    cy.get('#proto-trust-range').should('exist');
  });

  it('verifies back to work navigation link', () => {
    cy.get('.bw-backlink').scrollIntoView().should('be.visible').and('contain.text', 'Back to All Projects');
  });
});
