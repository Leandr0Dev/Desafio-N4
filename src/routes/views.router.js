import express from 'express'
const router =  express.Router()
import ProductManager from '../controllers/productManager.js'


const productManager = new ProductManager

// Router


router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts()
        res.render ('home', { products })
    } catch (error) {
        console.log('Error al obtener productos en getProducts', error)
    }
})

router.get('/realtimeproducts', (req,res) => {
try {
    res.render('realtimeproducts')
} catch (error) {
    console.log('Error al obtener productos en productos en tiempo real', error)
}
})

export default router