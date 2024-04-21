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
        cy.url( { timeout: 10000 }).should('eq', Cypress.config().baseUrl + '/');
        cy.visit("/galleries/create-gallery");
        cy.get('input[id="gallery"]').type("Gallery01");
        cy.get('textarea[id="description"]').type("Description of my gallery.");
        cy.get('input[id="hours"]').type("5");
        cy.get('input[id="location"]').type("Bangkok");
        cy.get('input[id="deliveryTime"]').type("5");
        cy.get('input[id="price"]').type("1000");
        cy.get('button[type="submit"]').click(); 
        cy.url({ timeout: 10000 }).should('eq', Cypress.config().baseUrl + '/settings/my-galleries');
    });

    it('TC4-2', () => {
        cy.url({ timeout: 10000 }).should('eq', Cypress.config().baseUrl + '/');
        cy.visit("/galleries/create-gallery");
        cy.get('input[id="gallery"]').type("Gallery01");
        cy.get('textarea[id="description"]').type("Description of my gallery.");
        cy.get('input[id="hours"]').type("5");
        cy.get('input[id="location"]').type("Bangkok");
        cy.get('input[id="deliveryTime"]').type("5");
        cy.get('input[id="price"]').type("1000");
        const fileName = '6MB.jpg';
        cy.fixture(fileName).then(fileContent => {
                cy.get('input[type="file"]').selectFile('cypress/fixtures/6MB.jpg',{ force: true });
            }
        );
        cy.get('button[type="submit"]').click();
        cy.url({ timeout: 10000 }).should('eq', Cypress.config().baseUrl + '/settings/my-galleries');


    });

    it('TC4-3', () => {
        cy.url({ timeout: 10000 }).should('eq', Cypress.config().baseUrl + '/');
        cy.visit("/galleries/create-gallery");
        cy.get('input[id="gallery"]').type('{backspace}');
        cy.get('textarea[id="description"]').type("Description of my gallery.");
        cy.get('input[id="hours"]').type("2");
        cy.get('input[id="location"]').type("Chulalongkorn");
        cy.get('input[id="deliveryTime"]').type("2");
        cy.get('input[id="price"]').type("2558");
        const fileName = '6MB.jpg';
        cy.fixture(fileName).then(fileContent => {
                cy.get('input[type="file"]').selectFile('cypress/fixtures/6MB.jpg',{ force: true });
            }
        );
        cy.get('button[type="submit"]').click();
        cy.contains('Close', { timeout: 10000 }).should('exist'); 

    });


    it('TC4-4', () => {
        cy.url({ timeout: 10000 }).should('eq', Cypress.config().baseUrl + '/');
        cy.visit("/galleries/create-gallery");
        cy.get('input[id="gallery"]').type("Congrats RoseCP48");
        cy.get('textarea[id="description"]').type("Description of my gallery.");
        cy.get('input[id="hours"]').type('{backspace}');
        cy.get('input[id="location"]').type("Satit Chula” ");
        cy.get('input[id="deliveryTime"]').type("5");
        cy.get('input[id="price"]').type("1412");
        const fileName = '6MB.jpg';
        cy.fixture(fileName).then(fileContent => {
                cy.get('input[type="file"]').selectFile('cypress/fixtures/6MB.jpg',{ force: true });
            }
        );
        cy.get('button[type="submit"]').click();
        cy.contains('Close', { timeout: 10000 }).should('exist'); 


    });


    it('TC4-5', () => {
        cy.url({ timeout: 10000 }).should('eq', Cypress.config().baseUrl + '/');
        cy.visit("/galleries/create-gallery");
        cy.get('input[id="gallery"]').type("Gallery 789");
        cy.get('textarea[id="description"]').type("Description of my gallery.");
        cy.get('input[id="hours"]').type("5");
        cy.get('input[id="location"]').type('{backspace}');
        cy.get('input[id="deliveryTime"]').type("5");
        cy.get('input[id="price"]').type("2000");
        const fileName = '6MB.jpg';
        cy.fixture(fileName).then(fileContent => {
                cy.get('input[type="file"]').selectFile('cypress/fixtures/6MB.jpg',{ force: true });
            }
        );
        cy.get('button[type="submit"]').click();
        cy.contains('Close', { timeout: 10000 }).should('exist'); 


    });


    it('TC4-6', () => {
        cy.url({ timeout: 10000 }).should('eq', Cypress.config().baseUrl + '/');
        cy.visit("/galleries/create-gallery");
        cy.get('input[id="gallery"]').type("Gallery 789");
        cy.get('textarea[id="description"]').type("Description of my gallery.");
        cy.get('input[id="hours"]').type("5");
        cy.get('input[id="location"]').type("Bangkok");
        cy.get('input[id="deliveryTime"]').type('{backspace}');
        cy.get('input[id="price"]').type("2000");
        const fileName = '6MB.jpg';
        cy.fixture(fileName).then(fileContent => {
                cy.get('input[type="file"]').selectFile('cypress/fixtures/6MB.jpg',{ force: true });
            }
        );
        cy.get('button[type="submit"]').click();
        cy.contains('Close', { timeout: 10000 }).should('exist'); 

    });


    it('TC4-7', () => {
        cy.url({ timeout: 10000 }).should('eq', Cypress.config().baseUrl + '/');
        cy.visit("/galleries/create-gallery");
        cy.get('input[id="gallery"]').type("Gallery01");
        cy.get('textarea[id="description"]').type("Description of my gallery.");
        cy.get('input[id="hours"]').type("5");
        cy.get('input[id="location"]').type("Bangkok");
        cy.get('input[id="deliveryTime"]').type('5');
        cy.get('input[id="price"]').type('{backspace}');
        const fileName = '6MB.jpg';
        cy.fixture(fileName).then(fileContent => {
                cy.get('input[type="file"]').selectFile('cypress/fixtures/6MB.jpg',{ force: true });
            }
        );
        cy.get('button[type="submit"]').click();
        cy.contains('Close', { timeout: 10000 }).should('exist'); 


    });



    it('TC4-8', () => {
        cy.url({ timeout: 10000 }).should('eq', Cypress.config().baseUrl + '/');
        cy.visit("/galleries/create-gallery");
        cy.get('input[id="gallery"]').type("Gallery01");
        cy.get('textarea[id="description"]').type("Description of my gallery.");
        cy.get('input[id="hours"]').type("5");
        cy.get('input[id="location"]').type("Bangkok");
        cy.get('input[id="deliveryTime"]').type("5");
        cy.get('input[id="price"]').type("1000");
        const fileName = '50MB.jpg';
        cy.fixture(fileName).then(fileContent => {
                cy.get('input[type="file"]').selectFile('cypress/fixtures/50MB.jpg',{ force: true });
            }
        );
        cy.get('button[type="submit"]').click();
        cy.contains('Close', { timeout: 10000 }).should('exist'); 

    });



    it('TC4-9', () => {
        cy.url({ timeout: 10000 }).should('eq', Cypress.config().baseUrl + '/');
        cy.visit("/galleries/create-gallery");
        cy.get('input[id="gallery"]').type("Gallery01");
        cy.get('textarea[id="description"]').type("Description of my gallery.");
        cy.get('input[id="hours"]').type("5");
        cy.get('input[id="location"]').type("Bangkok");
        cy.get('input[id="deliveryTime"]').type("5");
        cy.get('input[id="price"]').type("1000");
        const fileName = 'file.pdf';
        cy.fixture(fileName).then(fileContent => {
                cy.get('input[type="file"]').selectFile('cypress/fixtures/file.pdf',{ force: true });
            }
        );
        cy.get('button[type="submit"]').click();
        cy.contains('Close', { timeout: 10000 }).should('exist'); 


    });
});
