export class ProductsPage {
    clickAddToCart(product) {
      cy.get(`[name="${product}"]`).click();

    }
  }
