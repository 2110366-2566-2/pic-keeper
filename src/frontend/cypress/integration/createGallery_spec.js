describe('Create Gallery Spec', () => {
    beforeEach(() => {
        // Visit the login page before each test
        cy.visit("/auth/login");
        cy.get('input[id="email"]').type("photographer@gmail.com");
        cy.get('input[id="password"]').type("123456");
        cy.get('button[type="submit"]').click();

        // Wait for the login to complete before proceeding
    });

    it('TC4-1', () => {
        // Visit the create gallery page
        cy.url().should('eq', Cypress.config().baseUrl + '/');
        cy.visit("/galleries/create-gallery");

        // Fill in the form fields
        cy.get('input[id="gallery"]').type("My Gallery Name");
        cy.get('textarea[id="description"]').type("Description of my gallery.");
        cy.get('input[id="hours"]').type("24");
        cy.get('input[id="location"]').type("Gallery Location");
        cy.get('input[id="deliveryTime"]').type("5");
        cy.get('input[id="price"]').type("1000");

        // Upload the same image 10 times
        const fileName = '50MB.jpg'; // Adjust the file name as needed
        cy.fixture(fileName).then(fileContent => {
                cy.get('input[type="file"]').selectFile('cypress/fixtures/50MB.jpg',{ force: true });
            }
        );

        // Click the submit button to save the gallery
        cy.get('button[type="submit"]').click();

        // Add further assertions as needed to verify the behavior after submitting the form
    });
});
