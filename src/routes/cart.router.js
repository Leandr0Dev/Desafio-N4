import express from 'express'
const router = express.Router()
import CartManager from '../controllers/cartManager.js'

const cartManager = new CartManager()

router.get(`/`, async (req,res) => {
    try {
        const limit = parseInt(req.query.limit)
        let carts
        if (limit) {
            carts = await cartManager.getCarts()
            const slicedCarts = carts.slice(0, limit)
            res.json(slicedCarts)            
        } else {
            carts = await cartManager.getCarts()
            res.json(carts)            
        }
    } catch (error) {
        console.log(`Error al obtener carritos en getCarts`, error)
    }
})

// Route to get a specific cart by its ID (cid)
router.get(`/:cid`, async (req,res) => {
    const cid = parseInt(req.params.cid)
    try {
        const cart = await cartManager.getCartByCid(cid)
        if (cart) {
            res.send(cart)           
        } else {
            res.status(404).send(`ID del carrito ${cid} no encontrada`)
        }
    } catch (error) {
        res.status(500).send(`Error al obtener el carrito por ID ${cid}`)
        console.log(error)
    }
})


// Route to add a product to a specific cart
router.post(`/:cid/product/:pid`, async (req, res) => {
    const cid = parseInt(req.params.cid)
    const pid = parseInt(req.params.pid)
    const quantity = parseInt(req.body.quantity)
    try {
        const updatedCart = await cartManager.addCart(cid, pid, quantity)
        const specificCart = updatedCart.find(cart => cart.cid === cid)
        res.status(201).send(specificCart)
    } catch (error) {
        res.status(500).send(`Error al agregar el carrito`)
        console.log(error)
    }
})

router.delete(`/:cid`, async (req, res) => {
    const cid = parseInt(req.params.cid)
    try {
        const updatedCarts = await cartManager.deleteCart(cid)
        res.send(`ID del carrito ${cid} borrado`)
    } catch (error) {
        res.status(500).send(`Error al eliminar el ID del carrito ${cid}`)
        console.log(error)
    }
})


export default router
