import express from 'express'
const router = express.Router()
import ProductManager from '../controllers/productManager.js'

const productManager = new ProductManager


router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit)
        let products

        if (limit) {
            products = await productManager.getProducts()
            const slicedProducts = products.slice(0, limit)
            res.status(200).json(slicedProducts)
        } else {
            products = await productManager.getProducts()
            res.status(200).json(products)
        }
    } catch (error) {
        console.log('Error al obtener productos en getProducts', error)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const product = await productManager.getProductById(id)
        if (product) {
            res.status(200).send(product)
        } else {
            res.status(404).send(`ID de producto ${id} no encontrado`)
        }
    } catch (error) {
        res.status(500).send(`Error al obtener el producto por ID ${id}`, error)
    }
})

router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        let newProduct = req.body
        const updatedProduct = await productManager.updateProductById(id, newProduct)
        if (updatedProduct) {
            res.status(200).send(`ID de producto ${id} actualizado`)
        } else {
            res.status(404).send(`ID de producto ${id} no encontrado`)
        }
    } catch (error) {
        console.log(`Error al actualizar el producto por Id ${id}`, error)
    }
})

router.post(`/`, async (req, res) => {
    try {
        const newProduct = req.body
        const addedProduct = await productManager.addProduct(newProduct)

        if (addedProduct) {
            res.status(200).send(` Producto agregado exitosamente`)
        } else {
            res.status(400).send({ status: 400, message: `Error al agregar el código de producto: ${newProduct.code} ya existe.` })
        }
    } catch (error) {
        console.log(`Error al agregar producto`, error)
        res.status(500).send({ status: 500, message: `Error Interno del Servidor` })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const deletedProduct = await productManager.deleteProductById(id)
        if (deletedProduct) {
            res.status(200).send(`ID de producto ${id} eliminado`)
        } else {
            res.status(404).send(`ID de producto ${id} no encontrado`)
        }
    } catch (error) {
        res.status(500).send(`Error al eliminar el producto por ID${id}`, error)
    }
})

export default router

