export class Recipt {

valueReciptPrice(data) {
    return `${data[0].totalPrice + data[1].totalPrice}`
    }
}