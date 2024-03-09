console.log("Conectado")
const socket = io()
let products =[]

socket.on("products", (data) => {
    products = data
    renderProducts(data)
})


const renderProducts = (products) => {
    const productsContainer = document.getElementById('products-container')
    productsContainer.innerHTML = ''

    products.forEach(product => {
        const productDiv = document.createElement('div')
        productDiv.className = 'col'
        productDiv.innerHTML = `
            <div class="card text-center">
            <div class=card-body>
                <h5 id="card-title" class=card-title>${product.title}</h5>
                <p id="card-descrption"class=card-text">${product.description}</p>
                <p id="card-price">$${product.price}</p>
                <button type="button" class="btn btn-danger">Borrar Producto 🗑️</button>
            </div>
            </div>
            `
        productsContainer.appendChild(productDiv)

       
        productDiv.querySelector('button').addEventListener('click', () => {
            deleteProduct(product.id)
        })
    })
}

const deleteProduct = (id) => {
    socket.emit("deleteProduct", id)
}

document.getElementById('addProduct').addEventListener('click', () => {
    addProduct()
})

const addProduct = () => {
    const product = {
        title: document.getElementById('productTitle').value,
        description: document.getElementById('productDescription').value,
        price: document.getElementById('productPrice').value,
        thumbnail: document.getElementById('productThumbnails').value,
        code: document.getElementById('productCode').value,
        stock: document.getElementById('productStock').value,
        status: document.getElementById('productStatus').value === 'true',
    }

    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
        console.log(`Por favor llene todos los campos`)
        return
    }
    if (isNaN(product.price) || isNaN(product.stock)) {
        console.log(`El precio y el stock deben ser números.`)
       
        return
    }
    if (product.price <= 0 || product.stock <= 0) {
        console.log(`El precio y el stock deben ser mayores que 0.`)
        return
    }
    if (product.status !== true && product.status !== false) {
        console.log(`El estado debe ser verdadero o falso.`)
        return
    }

    if (products.some(existingProduct => existingProduct.code === product.code)) {
        console.log(`El código ${product.code} de producto ya existe `)
        return
    }
    socket.emit('addProduct', product)
  
   
    console.log(product)


    document.getElementById('productTitle').value = ''
    document.getElementById('productDescription').value = ''
    document.getElementById('productPrice').value = ''
    document.getElementById('productThumbnails').value = ''
    document.getElementById('productCode').value = ''
    document.getElementById('productStock').value = ''
    document.getElementById('productStatus').value = ''
}