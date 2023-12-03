const cartCountBubbleElementCreator = function ({ items_count = 0 }) {
    return `
        <div class="cart-count-bubble">
            <span aria-hidden="true">${items_count}</span>
            <span class="visually-hidden">${items_count} item</span>
        </div>
    `
}
async function refreshCartIcon() {
    try {

        const cartIcon = document.getElementById('cart-icon-bubble')

        const cartCountBubble = document.querySelector('cart-count-bubble')

        const cart = await getCartStatus()

        const newCartCountBubble = cartCountBubbleElementCreator({ items_count: cart.item_count })

        if (cartCountBubble) {

            cartIcon.removeChild(cartCountBubble)

        }

        cartIcon.innerHTML += newCartCountBubble

    }
    catch (err) {

        console.log('Error refreshing cart icon', err)

        throw err

    }
}
async function getCartStatus() {
    try {

        const response = await fetch(window.Shopify.routes.root + 'cart.js')

        if (!response.ok) {

            throw new Error("Error getting the current status of the cart", response)

        }

        const cart = await response.json()

        return cart

    }
    catch (err) {

        throw new Error("Error getting the current status of the cart", err)

    }
}
async function addToCart(event) {
    try {
        event.stopPropagation()
        event.preventDefault()
        console.log({ event })

        const form = event.target.parentNode

        const quantitySelector = form.querySelector('select[name="quantity"]')

        const quantity = quantitySelector.value

        const response = await fetch(window.Shopify.routes.root + 'cart/add.js', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: [
                    {
                        id: event.target.dataset.variant_id,
                        quantity,
                    }
                ]
            })
        })

        if (!response.ok) {

            throw new Error(`Error adding item to cart`, response)

        }

        refreshCartIcon()

        const currentItemsInCart = await response.json()

        return currentItemsInCart

    }
    catch (err) {

        console.log('Error adding items to cart', err)

    }
}

console.log(`Hello world`)