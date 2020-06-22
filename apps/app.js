//Variables decleration 

const cartBtn = document.querySelector('.cart-btn'); 
const closeCartBtn = document.querySelector('.close-cart'); 
const clearCartBtn = document.querySelector('.clear-cart'); 
const cartDOM = document.querySelector('.cart'); 
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');
 

// Cart 
let cart = [];
// buttons
let buttonsDOM = [];

//getting the products 
class Products{
    async getProducts(){
        try{
            let result = await fetch("http://localhost/E-Commerce-Project/products.json");
            let data = await result.json();
            let products = data.items;
            products = products.map(item => {
                const {title, price} = item.fields;
                const {id} = item.sys;
                const image = item.fields.image.fields.file.url;
                return {title, price, id, image};
            })
            return products;
        } catch(error) {
            console.log(error);
        }
    }
}

//display products
class UI {
    displayProducts(products){
        let results = '';
        products.forEach(product => {
            results += `
            <!-- single product-->
            <article class="product">
                <div class="img-container">
                    <a href="https://amzwatches.com/product/bos-mens-watch-aw748dqo/" target="_blank">
                        <img src=${product.image} alt ="" class="product-img">
                    </a>
                    <button class="bag-btn" data-id= ${product.id}>
                        <i class="fas fa-shopping-cart"></i>
                        add to the cart
                    </button>
                    <button class="bag-btn1" data-id= "1">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
                <h3>${product.title}</h3>
                <h4>${product.price}</h4>
            </article>
            <!-- end of single product-->
            `
        });
        productsDOM .innerHTML = results;
    }
    getBagButtons(){
        const btns = [...document.querySelectorAll('.bag-btn')];
        buttonsDOM = btns;
        btns.forEach(button =>{
            let id = button.dataset.id;
            let incart = cart.find(item => item.id === id);
            if(incart){
                button.innerText = "Already in your cart";
                button.disabled = true;
            } else {
                button.addEventListener('click', (e)=>{
                    e.target.innerText = "Already in your cart";
                    e.target.disabled = true;
                    // get product from products
                    let cartItem = {...Storage.getProduct(id),amount:1};
                    // add product to the cart 
                    cart = [...cart, cartItem];
                    // save the cart in the local storage
                    Storage.saveCart(cart);
                    // set cart values 
                    //display cart item
                    // show the cart 
                })
            }
        });
    }
}

//local storage
class Storage {
    static saveProduct(products){
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(id){
        let products  = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }
    static saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

document.addEventListener("DOMContentLoaded",()=>{
    const ui = new UI();
    const products = new Products();

    // get all products
    products.getProducts().then(products => {ui.displayProducts
        (products)
        Storage.saveProduct(products)
    }).then(() => {
        ui.getBagButtons();
    });
});


