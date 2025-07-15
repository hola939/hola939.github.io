// Carrito de compras
class ShoppingCart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.init();
    }

    init() {
        this.loadCart();
        this.updateCartCount();
        this.bindEvents();
    }

    bindEvents() {
        // Botones de agregar al carrito
        document.querySelectorAll('.btn-add').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.dataset.id;
                this.addToCart(productId);
            });
        });

        // Botón de vaciar carrito
        const emptyCartBtn = document.getElementById('emptyCart');
        if (emptyCartBtn) {
            emptyCartBtn.addEventListener('click', () => {
                this.emptyCart();
            });
        }

        // Mostrar/ocultar carrito al hacer hover
        const cartButton = document.querySelector('.btn-cart');
        const cart = document.querySelector('.cart');
        let cartTimeout;
        
        if (cartButton && cart) {
            cartButton.addEventListener('mouseenter', () => {
                clearTimeout(cartTimeout);
                cart.style.display = 'block';
                setTimeout(() => {
                    cart.classList.add('show');
                }, 10);
            });
            
            cartButton.addEventListener('mouseleave', () => {
                cartTimeout = setTimeout(() => {
                    cart.classList.remove('show');
                    setTimeout(() => {
                        cart.style.display = 'none';
                    }, 200);
                }, 100);
            });
            
            // Mantener el carrito visible cuando el cursor esté sobre él
            cart.addEventListener('mouseenter', () => {
                clearTimeout(cartTimeout);
                cart.style.display = 'block';
                cart.classList.add('show');
            });
            
            cart.addEventListener('mouseleave', () => {
                cartTimeout = setTimeout(() => {
                    cart.classList.remove('show');
                    setTimeout(() => {
                        cart.style.display = 'none';
                    }, 200);
                }, 100);
            });
        }
    }

    addToCart(productId) {
        const product = this.getProductInfo(productId);
        
        if (product) {
            const existingItem = this.items.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.items.push({
                    id: productId,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
            }
            
            this.saveCart();
            this.updateCartDisplay();
            this.updateCartCount();
            this.showNotification('Producto agregado al carrito');
        }
    }

    getProductInfo(productId) {
        const productElement = document.querySelector(`[data-id="${productId}"]`).closest('.product');
        
        if (productElement) {
            const name = productElement.querySelector('h4').textContent;
            const price = productElement.querySelector('#currentPrice').textContent;
            const image = productElement.querySelector('img').src;
            
            return {
                name: name,
                price: parseFloat(price.replace('$', '')),
                image: image
            };
        }
        
        return null;
    }

    removeFromCart(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
        this.updateCartCount();
        this.showNotification('Producto removido del carrito');
    }

    updateQuantity(productId, newQuantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
                this.updateCartDisplay();
                this.updateCartCount();
            }
        }
    }

    emptyCart() {
        this.items = [];
        this.saveCart();
        this.updateCartDisplay();
        this.updateCartCount();
        this.showNotification('Carrito vaciado');
    }

    updateCartDisplay() {
        const tbody = document.getElementById('contentProducts');
        const totalElement = document.getElementById('total');
        
        if (tbody && totalElement) {
            tbody.innerHTML = '';
            this.total = 0;
            
            if (this.items.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">Carrito vacío</td></tr>';
                totalElement.textContent = '$0.00';
                return;
            }
            
            this.items.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><img src="${item.image}" alt="${item.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;"></td>
                    <td>${item.name}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>
                        <input type="number" min="1" value="${item.quantity}" 
                               onchange="cart.updateQuantity('${item.id}', parseInt(this.value))" 
                               style="width: 60px; padding: 4px; border: 1px solid #ddd; border-radius: 4px;">
                    </td>
                    <td>
                        <button type="button" onclick="cart.removeFromCart('${item.id}')" 
                                style="background: #ef4444; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer;">
                            X
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
                
                this.total += item.price * item.quantity;
            });
            
            totalElement.textContent = `$${this.total.toFixed(2)}`;
        }
    }

    updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            
            // Animación cuando se agrega un producto
            if (totalItems > 0) {
                cartCount.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    cartCount.style.transform = 'scale(1)';
                }, 200);
            }
        }
    }

    saveCart() {
        localStorage.setItem('shoppingCart', JSON.stringify(this.items));
    }

    loadCart() {
        const savedCart = localStorage.getItem('shoppingCart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
            this.updateCartDisplay();
        }
    }

    showNotification(message) {
        // Crear notificación
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2563eb;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            font-weight: 500;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Mostrar notificación
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Ocultar notificación
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    getCartTotal() {
        return this.total;
    }

    getCartItems() {
        return this.items;
    }
}

// Inicializar carrito cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    window.cart = new ShoppingCart();
    
    // Agregar estilos adicionales para el carrito
    const style = document.createElement('style');
    style.textContent = `
        .cart {
            max-height: 400px;
            overflow-y: auto;
        }
        
        .cart table {
            font-size: 0.9rem;
        }
        
        .cart th {
            font-weight: 600;
            color: #374151;
        }
        
        .cart td {
            vertical-align: middle;
        }
        
        .cart input[type="number"] {
            border: 1px solid #d1d5db;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 0.9rem;
        }
        
        .cart input[type="number"]:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
        }
        
        #cartCount {
            transition: transform 0.2s ease;
        }
        
        .btn-cart button {
            background: none;
            border: none;
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            transition: background-color 0.2s;
        }
        
        .btn-cart button:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }
    `;
    document.head.appendChild(style);
});

// Función global para acceder al carrito desde la consola
window.getCartInfo = function() {
    console.log('Carrito actual:', cart.getCartItems());
    console.log('Total:', cart.getCartTotal());
    return cart;
};
