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

  it('should login using Google', () => {
    const socialLoginOptions = {
      username: Cypress.env('GOOGLE_USERNAME'),
      password: Cypress.env('GOOGLE_PASSWORD'),
      loginUrl: 'YOUR_LOGIN_PAGE_URL',
      loginSelector: 'BUTTON_OR_LINK_SELECTOR_FOR_GOOGLE_LOGIN',
      postLoginSelector: 'SELECTOR_ON_PAGE_AFTER_LOGIN'
    };
    
    return cy.task('GoogleSocialLogin', socialLoginOptions).then(({ cookies }) => {
      cy.clearCookies();
      cookies.forEach(cookie => {
        cy.setCookie(cookie.name, cookie.value, {
          domain: cookie.domain,
          expiry: cookie.expires,
          httpOnly: cookie.httpOnly,
          path: cookie.path,
          secure: cookie.secure
        });
      });
      Cypress.Cookies.defaults({
        preserve: 'SESSION_COOKIE_NAME'
      });
    });
  });
});
