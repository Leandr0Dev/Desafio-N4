import express from 'express'
import __dirname from './utils.js'
import exphbs from 'express-handlebars'
import viewsRouter from './routes/views.router.js'
import { Server } from 'socket.io'
import ProductManager from './controllers/productManager.js'
const productManager = new ProductManager

const PORT = 8080
const app = express()

const router = express.Router()

// Middlewares
app.use(express.static(`./src/public`))

// Configuracion de handlebars
app.engine(`handlebars`, exphbs.engine())
app.set(`view engine`, `handlebars`)
app.set(`views`, `./src/views`)

// Rutas
app.use(`/`, viewsRouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/cart.router.js'


const httpServer = app.listen(PORT, () => {
    console.log('Escuchando en el Puerto ' + PORT)
    console.log(`Lista de Productos: http://localhost:8080/`);
    console.log(`Productos RealTime: http://localhost:8080/realTimeProducts`);
  
})

const io = new Server(httpServer)


io.on("connection", async (socket) => {
    console.log("Se conecto un Cliente")
    socket.emit("products", await productManager.getProducts())

    
    socket.on("deleteProduct",  async (id) => {
        await productManager.deleteProductById(id)
        socket.emit("products", await productManager.getProducts())
    })
  
    socket.on("addProduct", async (product) => {
       console.log(product)
       await productManager.addProduct(product)
       io.sockets.emit("productos", await productManager.getProducts())
   })
})