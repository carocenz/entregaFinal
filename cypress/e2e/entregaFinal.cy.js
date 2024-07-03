
import { ProductsPage } from "../support/pagesEn/productsPage";
import { ShoppingCartPage } from "../support/pagesEn/shoppingCartPage";
import { CheckOut } from "../support/pagesEn/checkOut";
import { Recipt } from "../support/pagesEn/recipt";

describe("Entrega", () => {
  let data;
  let dataOut;
  const baseUrl = 'https://pushing-it.onrender.com';

  const productsPage = new ProductsPage();
  const shoppingCartPage = new ShoppingCartPage();
  const checkOut = new CheckOut();
  const recipt = new Recipt();


  before(() => {
    cy.fixture("datosEn").then((datosEn) => {
      data = datosEn;
    }),
    cy.fixture("datosCheckOut").then((datosCheckOut) => {
      dataOut = datosCheckOut;
    });

    cy.request({
      method: 'POST',
      url: `${baseUrl}/api/register`,
      body:{
          "username": Cypress.env().usuario,
          "password": Cypress.env().password,
          "gender": "female",
          "day": "20",
          "month": "April",
          "year": "1992",
      },
  }).then(response => {
      cy.log(response)
      expect(response.status).to.be.equal(201);
          //Ingreso de Usuario
          cy.request({
              method: 'POST',
              url: `${baseUrl}/api/login`,
              body:{
                  "username": response.body.newUser.username,
                  "password": Cypress.env().password,
              },
          }).then((res) => {
            cy.log(res)
                    expect(res.status).to.be.equal(201);
                    window.localStorage.setItem("token", res.body.token)
                    window.localStorage.setItem("user", response.body.newUser.username)
          })
  })
  });

  it("Test", () => {
    //Visitar la pagina de pushing IT.
    cy.visit("");
    
    //HOME
    //Dirigirse al modulo "Online Shop".
    cy.contains('a', 'Online Shop').should('exist').click();

    //PRODUCTS
    //Elegir 2 productos a elección y añadirlos al carrito.
    //#1
    productsPage.clickAddToCart('Buzo Negro');
    shoppingCartPage.clickMessageButton();

    //#2
    productsPage.clickAddToCart('Zapatillas Azules');
    shoppingCartPage.clickMessageButton();
    cy.get('h2#title').contains('Products', { timeout: 5000 }).should('exist');
    cy.contains('button', 'Go to shopping cart').click();

    //SHOPPINGCART
    //Verificar el nombre y precio de los dos productos.
    cy.get('h2#title').contains('Shopping Cart').should('exist');
    shoppingCartPage.validarProducto(data.shoppingCart[0].productName);
    shoppingCartPage.checkProd(data.shoppingCart[0]);
    shoppingCartPage.validarProducto(data.shoppingCart[1].productName);
    shoppingCartPage.checkProd(data.shoppingCart[1]);

    //Hacer click en "Show total price" y verificar el precio acumulado de los 2 productos.
    cy.contains('button', 'Show total price').click();
    cy.contains('b', 'Total $').should('exist');
    shoppingCartPage.valueTotalPrice(data.shoppingCart);

    //Completar el checkout con sus nombres apellido y una tarjeta de credito de 16 digitos.
    cy.get('[data-cy="goBillingSummary"]').click();
    cy.get('h2#title').contains('Billing Summary', { timeout: 5000 }).should('exist');
    cy.get('[data-cy="goCheckout"]').click();
    cy.get('h2#title').contains('Checkout', { timeout: 5000 }).should('exist');
    checkOut.escribirName(dataOut.checkOut.name);
    checkOut.escribirLastName(dataOut.checkOut.lastName);
    checkOut.escribirCard(dataOut.checkOut.card);
    cy.get('[data-cy="purchase"]').click();

    //Verificar los siguientes datos en el ticket de compra (Nombre y apellido, productos, tarjeta de crédito, costo total).
    cy.get('header').contains('Purchase has been completed successfully', { timeout: 5000 }).should('exist');
    cy.get('p[data-cy="name"]').contains(dataOut.checkOut.name + ' ' + dataOut.checkOut.lastName + ' has succesfully purchased the following items:').should('exist');
    cy.get(`p[id="${data.shoppingCart[0].productName}"`).contains("1" + " x" + " " + `${data.shoppingCart[0].productName}`);
    cy.get(`p[id="${data.shoppingCart[1].productName}"`).contains("1" + " x" + " " + `${data.shoppingCart[1].productName}`);
    cy.get('[data-cy="creditCard"]').contains(dataOut.checkOut.card);
    console.log(data.shoppingCart)
    cy.get('p[data-cy="totalPrice"]').contains("Monney spent $" + recipt.valueReciptPrice(data.shoppingCart));
    cy.get('[data-cy="thankYou"]').click();

  });
  //Eliminar el usuario creado una vez finalizado el test.
  after(() => {
    const token = window.localStorage.getItem("token")
    const user = window.localStorage.getItem("user")

    console.log({token, user})
    cy.request({
      method: 'DELETE',
      url: `${baseUrl}/api/deleteuser/${user}`,
      headers: {
          "authorization": `Bearer ${token}`
      },
    }).then(res => {
        cy.log(res)
        expect(res.status).to.be.equal(202);
    })
  })
});

