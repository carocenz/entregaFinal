export class ShoppingCartPage {
  constructor() {
    this.messageButton = 'button#closeModal';
  }
    validarProducto(data) {
      cy.get(`p#productName[name="${data}"]`).should('exist');
    }
  
    checkProd(data) {
      cy.get(`p#productName[name="${data["productName"]}"]`)
      .siblings("#unitPrice")
      .should("have.text", `$${data["unitPrice"]}`);
    }

    valueTotalPrice(data) {
      cy.get('#price').should("have.text", `${data[0].totalPrice + data[1].totalPrice
      }`);
    }

    clickMessageButton() {
      cy.get(this.messageButton).click();
    }
  }