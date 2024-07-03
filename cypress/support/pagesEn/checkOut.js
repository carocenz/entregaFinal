export class CheckOut {
    constructor() {
        this.name = '[data-cy="firstName"]';
        this.lastName = '[data-cy="lastName"]';
        this.cardNumber = '[data-cy="cardNumber"]';
      }

      escribirName(name) {
        cy.get(this.name).type(name);
      }
      escribirLastName(lastName) {
        cy.get(this.lastName).type(lastName);
      }
      escribirCard(card) {
        cy.get(this.cardNumber).type(card);
      }
}
