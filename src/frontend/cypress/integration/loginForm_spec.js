describe("LoginForm Component", () => {
  beforeEach(() => {
    cy.visit("/auth/login");
  });

  it("TC3-3", () => {
    cy.get('input[id="email"]').type("admin@gmail.com");
    cy.get('input[id="password"]').type(" ");
    cy.get('button[type="submit"]').click();
    cy.get(".text-red-500").should("contain", "Incorrect username or password");
  });

  it("TC3-4", () => {
    cy.get('input[id="email"]').type(" ");
    cy.get('input[id="password"]').type("password");
    cy.get('button[type="submit"]').click();
    cy.get(".text-red-500").should("contain", "Incorrect username or password");
  });

  it("TC3-5", () => {
    cy.get('input[id="email"]').type("admin@gmail.com");
    cy.get('input[id="password"]').type("password");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/"); 
  });
});
