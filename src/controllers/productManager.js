import fs from "fs/promises"

let products = []

class ProductManager {
    static id = 1
    static path = './src/models/products.json'
    static status = true

    constructor(title, description, price, thumbnails, code, stock, status) {
        this.title = title,
        this.description = description,
        this.price = price,
        this.thumbnails = thumbnails,
        this.code = code,
        this.stock = stock
    }

    async addProduct(newProduct) {
        try {
            const existingProducts = await this.getProducts()

            const lastProduct = existingProducts.reduce((prev, current) => (prev.id > current.id) ? prev : current, { id: 0 })
            const nextId = lastProduct.id + 1

            const existingProduct = existingProducts.find(product => product.code === newProduct.code)

            if (existingProduct) {
                console.log(`El producto con el mismo código ${newProduct.code} ya existe, inténtelo de nuevo`)
                return 
            }
            
            else {
                const productToAdd = {
                    id: nextId,
                    title: newProduct.title,
                    description: newProduct.description,
                    price: newProduct.price,
                    thumbnails: newProduct.thumbnails,
                    code: newProduct.code,
                    stock: newProduct.stock,
                    status: ProductManager.status
                }

                existingProducts.push(productToAdd)
                await fs.writeFile(ProductManager.path, JSON.stringify(existingProducts, null, 2))
                console.log(`Producto agregado exitosamente`)
                return productToAdd 
            }
        } catch (error) {
            console.error(`Error al agregar producto`, error)
        }
    }

    async writeFile() {
        try {
            await fs.writeFile(ProductManager.path, JSON.stringify(products, null, 2))
            res.send(`Archivo creado exitosamente`)
            console.log(`Archivo creado exitosamente`)
        } catch (error) {
            res.send({ status: 500, message: `Error al escribir el archivo` })
            console.log(`Archivo no escrito, por favor inténtalo de nuevo.`, error)
        }
    }

    async getProducts() {
        try {
            await fs.access(ProductManager.path)
            const data = await fs.readFile(ProductManager.path)
            const products = JSON.parse(data)
            return products
        } catch (error) {
            await fs.writeFile(ProductManager.path, '[]', 'utf-8')
            return []
        }
    }

    async getProductById(id) {
        try {
            const data = await fs.readFile(ProductManager.path)
            const products = JSON.parse(data)
            const product = products.find(product => product.id === id)
            if (product) {
                // Adding the return for app.js to work
                return product
            } else {
                console.log(`ID de producto ${id} no encontrado`)
            }
        } catch (error) {
            console.log(`Error al obtener el producto por ID ${id}`, error)
        }

    }

    async updateProductById(id, newProduct) {
        try {
            const data = await fs.readFile(ProductManager.path)
            let products = JSON.parse(data)

            const productIndex = products.findIndex(product => Number(product.id) === Number(id))

            if (productIndex != -1) {
                products[productIndex] = {
                    id,
                    title: newProduct.title,
                    description: newProduct.description,
                    price: newProduct.price,
                    thumbnails: newProduct.thumbnails,
                    code: newProduct.code,
                    stock: newProduct.stock,
                    status: true,
                }

                await fs.writeFile(ProductManager.path, JSON.stringify(products, null, 2))
                return true
            } else {
                return false
            }
        } catch (error) {
            console.log(`Error al actualizar el producto con ID ${id}`, error)
        }
    }

    async deleteProductById(id) {
        try {
            const data = await fs.readFile(ProductManager.path)
            const products = JSON.parse(data)
            const product = products.find(product => product.id === id)
            const index = products.indexOf(product)
            if (index != -1) {
                products.splice(index, 1)
                await fs.writeFile(ProductManager.path, JSON.stringify(products, null, 2))
                console.log(`La identificación del producto ${id} se borró correctamente`)
                return true
            } else {
                return false
            }
        } catch (error) {
            console.log(`ID de producto ${id} no encontrado`, error)
            return false
        }
    }
}



export default ProductManager

