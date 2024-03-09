import fs from 'fs/promises'

class CartManager {
    static cid = 1
    static path = './src/models/cart.json'
    constructor(pid, quantity){
        this.productId = pid,
        this.quantity = quantity
    }

    async getCarts() {
        try {
            await fs.access(CartManager.path)
            const carts = await fs.readFile(CartManager.path)
            return JSON.parse(carts)
        } catch (error) {
            await fs.writeFile(CartManager.path,'[]', 'utf-8')
            return []
        }
    }

    async getCartByCid(cid) {
        try {
            const data = await fs.readFile(CartManager.path)
            const carts = JSON.parse(data)
            const cart = carts.find(cart => cart.cid == cid)
            if (cart) {
                return cart
            } else {
                res.send(`ID del carrito ${cid} no encontrado`)
            }
        } catch (error) {
            res.send(`Error al obtener el carrito por ID ${cid}`, error)
        }
    }

    async addCart(cid, pid, quantity) {
        try {
            const data = await fs.readFile(CartManager.path)
            let carts = JSON.parse(data)

            const cartIndex = carts.findIndex(cart => cart.cid == cid)

            if (cartIndex !== -1) {
              
                const existingProductIndex = carts[cartIndex].products.findIndex(product => product.pid === pid)

                if (existingProductIndex !== -1) {
                   
                    carts[cartIndex].products[existingProductIndex].quantity += quantity
                } else {
                   
                    carts[cartIndex].products.push({ pid, quantity })
                }
            } else {
               
                const newCart = {
                    cid,
                    products: [{ pid, quantity }],
                }

                carts.push(newCart)
            }

            await fs.writeFile(CartManager.path, JSON.stringify(carts,null,2))
            return carts
        } catch (error) {
            res.status(500).send(`Error al agregar el carrito.`, error)
        }
    }

    async deleteCart(cid) {
        try {
            const data = await fs.readFile(CartManager.path)
            let carts = JSON.parse(data)
    
            const cartIndex = carts.findIndex(cart => cart.cid === cid)
            
           
            if (cartIndex !== -1) {
                const newCarts = carts.filter(cart => cart.cid !== cid)
                await fs.writeFile(CartManager.path, JSON.stringify(newCarts, null, 2))
                return newCarts
            } else {
                res.status(404).send(`Cart ID ${cid} not found`)
            }
        } catch (error) {
            res.status(500).send(`Error al eliminar el ID del carrito. ${cid}`, error)
        }
    }
    
}

export default CartManager
