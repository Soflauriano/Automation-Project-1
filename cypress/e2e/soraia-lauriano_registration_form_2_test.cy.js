beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_2.html')
})

import { faker } from '@faker-js/faker';

//Variables
const username = faker.internet.userName()
const firstName = faker.person.firstName()
const lastName = faker.person.lastName()
const email = faker.internet.email()
const phoneNumber = '55566677798'
const password = 'testpassword123'

// Define the function to fill all mandatory fields
function fillMandatoryFields(username, email, firstName, lastName, phoneNumber){
    cy.get('#username').type(username);
    cy.get('#email').type(email);
    cy.get('input[name="name"]').type(firstName);
    cy.get('input[name="lastName"]').type(lastName);
    cy.get('[data-testid="phoneNumberTestId"]').type(phoneNumber);
}

    
/*
Assignment 4: add content to the following test
*/

describe('Section 1: Functional tests', () => {

    it('User can use only same both first and validation passwords', ()=>{
        //mismatch password
        fillMandatoryFields(username, email, firstName, lastName, phoneNumber)        
        cy.get('#password').type(password);
        cy.get('#confirm').type('differentpass123');
        cy.contains('Password section').click();
        cy.get('.submit_button').should('not.be.enabled')
        cy.get('#success_message').should('not.be.visible')
        cy.get('#password_error_message').should('be.visible').should('contain','Passwords do not match!')
       //correct password   
        cy.get('[name="confirm"]').clear('')   
        cy.get('[name="confirm"]').type(password);
        cy.contains('Password section').click();
        
        cy.get('.submit_button').should('be.enabled'); 
        cy.get('#password_error_message').should('not.be.visible')
    });

    
    it('User can submit form with all fields added', ()=>{
        // Add test steps for filling in ALL fields
        // Assert that submit button is enabled
        // Assert that after submitting the form system show successful message
        fillMandatoryFields(username, email, firstName, lastName, phoneNumber)
        cy.get('[type= "radio"]').check('HTML')
        cy.get('[type= "checkbox"]').check('Car');
        cy.get('#cars').select('audi');
        cy.get('#animal').select('dog');
        cy.get('#password').type(password);
        cy.get('#confirm').type(password)
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('be.enabled').click()
        cy.contains('#success_message', 'User successfully submitted registration').should('be.visible')
    

    });

    it('User can submit form with valid data and only mandatory fields added', ()=>{
        fillMandatoryFields(username, email, firstName, lastName, phoneNumber)
        cy.get('#password').type(password);
        cy.get('#confirm').type(password)
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('be.enabled').click()
        cy.contains('#success_message', 'User successfully submitted registration').should('be.visible')

       
    });

    // Add at least 1 test for checking some mandatory field's absence
    it('User can not submit form without mandatory field email filled', ()=>{
        fillMandatoryFields(username, email, firstName, lastName, phoneNumber)
        cy.get('#email').clear();
        cy.get('#password').type(password);
        cy.get('#confirm').type(password)
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('be.disabled')      
        cy.get('#success_message').should('not.be.visible')  
        cy.get('#input_error_message').should('be.visible').should('contain', 'Mandatory input field is not valid or empty!')
        
    })
})

/*
Assignement 5: create more visual tests
*/

describe('Section 2: Visual tests', () => {
    it('Check that logo is correct and has correct size', () => {
        cy.log('Will check logo source and size')
        cy.get('img').should('have.attr', 'src').should('include', 'cerebrum_hub_logo')
        // get element and check its parameter height
        // it should be less than 178 and greater than 100
        cy.get('img').invoke('height').should('be.lessThan', 178)
            .and('be.greaterThan', 100)   
    });

    it('My test for second picture', () => {
        // Create similar test for checking the second picture
        cy.log('Will check logo source and size')
        cy.get('[data-cy="cypress_logo"]').should('have.attr', 'src').should('include', 'cypress_logo.png')
        cy.get('[data-cy="cypress_logo"]').invoke('height').should('be.lessThan', 120)
        .and('be.greaterThan', 87)
        cy.get('[data-cy="cypress_logo"]').invoke('width').should('be.lessThan', 150)
        .and('be.greaterThan', 115)
           
    });

    it('Check navigation part', () => {
        cy.get('nav').children().should('have.length', 2)

        // Get navigation element, find siblings that contains h1 and check if it has Registration form in string
        cy.get('nav').siblings('h1').should('have.text', 'Registration form number 2')
        
        // Get navigation element, find its first child, check the link content and click it
        cy.get('nav').children().eq(0).should('be.visible')
            .and('have.attr', 'href', 'registration_form_1.html')
            .click()
        
        // Check that currently opened URL is correct
        cy.url().should('contain', '/registration_form_1.html')
        
        // Go back to previous page
        cy.go('back')
        cy.log('Back again in registration form 2')
    });

    // Create similar test for checking the second link 
    it('Check navigation part 2', () => {
        cy.get('nav').children().should('have.length', 2)

        cy.get('nav').siblings('h1').should('have.text', 'Registration form number 2')
        cy.get('nav').children().eq(1).should('be.visible')
            .and('have.attr', 'href', 'registration_form_3.html')
            .click()
        cy.url().should('contain', '/registration_form_3.html')      
        cy.go('back')
        cy.log('Back again in registration form 2')
    });

    it('Check that radio button list is correct', () => {
        // Array of found elements with given selector has 4 elements in total
        cy.get('input[type="radio"]').should('have.length', 4)

        // Verify labels of the radio buttons
        cy.get('input[type="radio"]').next().eq(0).should('have.text','HTML')
        cy.get('input[type="radio"]').next().eq(1).should('have.text','CSS')
        cy.get('input[type="radio"]').next().eq(2).should('have.text','JavaScript')
        cy.get('input[type="radio"]').next().eq(3).should('have.text','PHP')

        //Verify default state of radio buttons
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
        cy.get('input[type="radio"]').eq(1).should('not.be.checked')
        cy.get('input[type="radio"]').eq(2).should('not.be.checked')
        cy.get('input[type="radio"]').eq(3).should('not.be.checked')

        // Selecting one will remove selection from the other radio button
        cy.get('input[type="radio"]').eq(0).check().should('be.checked')
        cy.get('input[type="radio"]').eq(1).check().should('be.checked')
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
    });

    // Create test similar to previous one verifying check boxes
    it('Check that checkbox list is correct', ()=>{
    // Array of found elements with 3 elements in total  
        cy.get('[class="checkbox vehicles"]').should('have.length', 3)   
        cy.get('[class="checkbox vehicles"]').next().eq(0).should('have.text','I have a bike')
        cy.get('[class="checkbox vehicles"]').next().eq(1).should('have.text','I have a car')
        cy.get('[class="checkbox vehicles"]').next().eq(2).should('have.text','I have a boat')

        cy.get('[class="checkbox vehicles"]').eq(0).should('not.be.checked')
        cy.get('[class="checkbox vehicles"]').eq(1).should('not.be.checked')
        cy.get('[class="checkbox vehicles"]').eq(2).should('not.be.checked')

        cy.get('[class="checkbox vehicles"]').eq(1).check().should('be.checked')
        cy.get('[class="checkbox vehicles"]').eq(2).check().should('be.checked')
        cy.get('[class="checkbox vehicles"]').eq(0).should('not.be.checked')
        
});


    it('Car dropdown is correct', () => {
        // Here is just an example how to explicitely create screenshot from the code
        // Select second element and create screenshot for this area or full page
        cy.get('#cars').select(1).screenshot('Cars drop-down')
        cy.screenshot('Full page screenshot')

        // Here are given different solutions how to get the length of array of elements in Cars dropdown
        // Next 2 lines of code do exactly the same!
        cy.get('#cars').children().should('have.length', 4)
        cy.get('#cars').find('option').should('have.length', 4)
        
        // Check  that first element in the dropdown has text Volvo
        cy.get('#cars').find('option').eq(0).should('have.text', 'Volvo')
        
        // Advanced level how to check the content of the Cars dropdown
        cy.get('#cars').find('option').then(options => {
            const actual = [...options].map(option => option.value)
            expect(actual).to.deep.eq(['volvo', 'saab', 'opel', 'audi'])
        })
    });

    // Create test similar to previous one
    it('Animal is correct', () => {
        cy.get('#animal').children().should('have.length', 6)

        cy.get('#animal').children().eq(0).should('have.text', 'Dog')
        cy.get('#animal').children().eq(1).should('have.text', 'Cat')
        cy.get('#animal').children().eq(2).should('have.text', 'Snake')
        cy.get('#animal').children().eq(3).should('have.text', 'Hippo')
        cy.get('#animal').children().eq(4).should('have.text', 'Cow')
        cy.get('#animal').children().eq(5).should('have.text', 'Horse')

        cy.get('#animal').select(4).screenshot('animal drop-down')
        cy.screenshot('Full page screenshot')

    })    

})