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

  it('verifies that legacy template illustrative elements are removed', () => {
    cy.get('.hero-shader').should('not.exist');
    cy.get('.hero-sky').should('not.exist');
    cy.get('.hero-stars').should('not.exist');
    cy.get('.hero-meteor').should('not.exist');
    cy.get('.sun-group').should('not.exist');
    cy.get('.moon-group').should('not.exist');
    cy.get('.plane-fly').should('not.exist');
    cy.get('.t-willow').should('not.exist');
    cy.get('.t-scrub').should('not.exist');
    cy.get('.hero-clean').should('be.visible');
  });

  it('renders interactive creative canvas hero with mind-cloud cards and macOS dock', () => {
    cy.get('#canvas-board').should('be.visible');
    cy.get('.canvas-silhouette-img').should('be.visible');
    cy.get('.canvas-item').should('have.length.at.least', 20);
    cy.get('#macos-dock').should('be.visible');
    cy.get('.dock-item').should('have.length', 9);
  });

  it('allows dragging canvas items and interacting with macOS dock', () => {
    // Click notes dock button to open notes window
    cy.get('.dock-item[data-app="notes"]').click();
    cy.get('#canvas-notes-window').should('be.visible');
    cy.get('#notes-close-btn').click();
    cy.get('#canvas-notes-window').should('not.be.visible');

    // Click a canvas item to open project preview modal
    cy.get('.canvas-item').first().click();
    cy.get('#canvas-item-modal').should('be.visible');
    cy.get('#item-modal-close').click();
    cy.get('#canvas-item-modal').should('not.be.visible');
  });

  it('renders modern clean testimonials grid', () => {
    cy.get('.testimonials-clean').scrollIntoView().should('be.visible');
    cy.get('.t-card-clean').should('have.length', 3);
    cy.get('.t-heading-clean').should('contain.text', 'What Mentors & Collaborators Say');
  });

  it('captures screenshots of clean homepage in light and dark modes', () => {
    cy.viewport(1280, 800);
    cy.get('#page-loader').should('not.be.visible', { timeout: 10000 });
    cy.get('.hero-canvas-stage').should('be.visible');
    cy.wait(500);
    cy.screenshot('clean-homepage-light', { capture: 'viewport' });
    cy.get('.bento-grid').scrollIntoView();
    cy.wait(400);
    cy.screenshot('clean-bento-light', { capture: 'viewport' });
    cy.get('.testimonials-clean').scrollIntoView();
    cy.wait(400);
    cy.screenshot('clean-testimonials-light', { capture: 'viewport' });

    // Toggle dark theme
    cy.get('#theme-toggle').click();
    cy.get('body').should('have.class', 'night');
    cy.scrollTo('top');
    cy.get('.hero-canvas-stage').should('be.visible');
    cy.wait(500);
    cy.screenshot('clean-homepage-dark', { capture: 'viewport' });
    cy.get('.testimonials-clean').scrollIntoView();
    cy.wait(400);
    cy.screenshot('clean-testimonials-dark', { capture: 'viewport' });
  });

  it('navigates to Borrow case study via project tile click', () => {
    cy.get('.project-tile').first().click();
    cy.url().should('include', 'borrow');
    cy.get('#borrow-view').should('be.visible');
    cy.get('.bw-hero-title').should('contain.text', 'Borrow');
  });
});
