describe('SPA Router Integration', () => {
  it('should render Home for /', () => {
    cy.visit('http://localhost:5174/');
    cy.contains('h2', /Router Features/i);
  });

  it('should render About for /about', () => {
    cy.visit('http://localhost:5174/about');
    cy.contains('h2', /Why This Router|How It Works/i);
  });

  it('should render Blog for /blog', () => {
    cy.visit('http://localhost:5174/blog');
    cy.get('h2').should('exist'); // Blog uses dynamic headings
  });

  it('should render BlogPost for /blog/123', () => {
    cy.visit('http://localhost:5174/blog/123');
    cy.get('h2').should('exist'); // BlogPost may use dynamic headings
  });

  it('should render Search for /search?query=router', () => {
    cy.visit('http://localhost:5174/search?query=router');
    cy.contains('h2', /Search/i);
    cy.contains('p', /router/i);
  });

  it('should render UserProfile for /user/tanto', () => {
    cy.visit('http://localhost:5174/user/tanto');
    cy.contains('h2', /About|Details|Actions|Debug Information/i);
    cy.contains('p', /tanto/i).should('exist');
  });

  it('should render Admin Panel for /admin-panel', () => {
    cy.visit('http://localhost:5174/admin-panel', {
      onBeforeLoad(win) {
        win.localStorage.setItem('user', JSON.stringify({ role: 'admin', name: 'cypress' }));
      }
    });
    cy.contains('h2', /Admin Panel/i);
  });

  it('should render MultiParent for /multi/123', () => {
    cy.visit('http://localhost:5174/multi/123');
    cy.contains('h2', /Multi Parent/i);
  });

  it('should render MultiChild for /multi/123/child/abc', () => {
    cy.visit('http://localhost:5174/multi/123/child/abc');
    cy.contains('h3', /Multi Child/i);
  });

  it('should render MultiGrandchild for /multi/123/child/abc/grandchild/foo', () => {
    cy.visit('http://localhost:5174/multi/123/child/abc/grandchild/foo');
    cy.contains('h4', /Multi Grandchild/i);
  });

  it('should render NestedParent for /nested', () => {
    cy.visit('http://localhost:5174/nested');
    cy.contains('h2', /Nested Parent/i);
  });

  it('should render NestedChild for /nested/child', () => {
    cy.visit('http://localhost:5174/nested/child');
    cy.contains('h3', /Nested Child/i);
  });

  it('should render NotFound for unknown route', () => {
    cy.visit('http://localhost:5174/unknown/path');
    cy.contains('h1', /404|Not Found/i);
  });
});
