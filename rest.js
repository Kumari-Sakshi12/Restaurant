document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. LOADER ANIMATION
       ========================================== */
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    });

    /* ==========================================
       2. MOBILE MENU & SEARCH TOGGLE
       ========================================== */
    const menuBtn = document.getElementById('menu-btn');
    const navLinks = document.getElementById('navLinks');
    const searchBtn = document.getElementById('search-btn');
    const searchForm = document.querySelector('.search-form');

    // Toggle Mobile Navbar
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            if (searchForm) searchForm.classList.remove('active');
        });
    }

    // Toggle Search Bar
    if (searchBtn && searchForm) {
        searchBtn.addEventListener('click', () => {
            searchForm.classList.toggle('active');
            if (navLinks) navLinks.classList.remove('active');
        });
    }

    // Close menu/search on scroll
    window.addEventListener('scroll', () => {
        if (navLinks) navLinks.classList.remove('active');
        if (searchForm) searchForm.classList.remove('active');
    });

    /* ==========================================
       3. DARK MODE TOGGLE
       ========================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

    // Check saved theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeIcon) {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');

            if (isDarkMode) {
                themeIcon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('theme', 'dark');
            } else {
                themeIcon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    /* ==========================================
       4. SHOPPING CART FUNCTIONALITY
       ========================================== */
    const cartBtn = document.getElementById('cart-btn');
    const closeCart = document.getElementById('closeCart');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartCountBadge = document.getElementById('cart-count');
    const cartTotalPrice = document.getElementById('cart-total-price');

    let cart = [];

    // Open & Close Cart Sidebar
    if (cartBtn && cartSidebar) {
        cartBtn.addEventListener('click', () => cartSidebar.classList.add('active'));
    }
    if (closeCart && cartSidebar) {
        closeCart.addEventListener('click', () => cartSidebar.classList.remove('active'));
    }

    // Quantity Plus/Minus Button Event Listeners in Menu Cards
    const menuCards = document.querySelectorAll('.menu .card');
    menuCards.forEach(card => {
        const minusBtn = card.querySelector('.minus');
        const plusBtn = card.querySelector('.plus');
        const qtyInput = card.querySelector('.qty-input');
        const addToCartBtn = card.querySelector('.add-to-cart');

        if (minusBtn && plusBtn && qtyInput) {
            minusBtn.addEventListener('click', () => {
                let val = parseInt(qtyInput.value);
                if (val > 1) qtyInput.value = val - 1;
            });

            plusBtn.addEventListener('click', () => {
                let val = parseInt(qtyInput.value);
                qtyInput.value = val + 1;
            });
        }

        // Add to Cart Click Action
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                const title = card.querySelector('h3').innerText;
                const priceText = card.querySelector('.price').innerText;
                const price = parseFloat(priceText.replace('₹', ''));
                const imgSrc = card.querySelector('img').src;
                const quantity = parseInt(qtyInput.value);

                addToCart(title, price, imgSrc, quantity);
                qtyInput.value = 1; // reset quantity input back to 1
            });
        }
    });


    // Add Item to Cart Array
    function addToCart(title, price, imgSrc, quantity) {
        const existingItemIndex = cart.findIndex(item => item.title === title);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({ title, price, imgSrc, quantity });
        }

        updateCartUI();
        if (cartSidebar) cartSidebar.classList.add('active'); // auto open cart
    }

    // Update Cart UI, Badges, and Totals
    function updateCartUI() {
        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty!</p>';
            if (cartTotalPrice) cartTotalPrice.innerText = '₹0';
            if (cartCountBadge) cartCountBadge.innerText = '0';
            return;        }

        let total = 0;
        let totalItemsCount = 0;

        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            totalItemsCount += item.quantity;

            const cartItemDiv = document.createElement('div');
            cartItemDiv.style.display = 'flex';
            cartItemDiv.style.alignItems = 'center';
            cartItemDiv.style.justifySpaceBetween = 'space-between';
            cartItemDiv.style.marginBottom = '15px';
            cartItemDiv.style.borderBottom = '1px solid var(--border-color)';
            cartItemDiv.style.paddingBottom = '10px';

            cartItemDiv.innerHTML = `
                <img src="${item.imgSrc}" alt="${item.title}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;">
                <div style="flex: 1; margin-left: 10px;">
                    <h4 style="font-size: 0.9rem;">${item.title}</h4>
                    <span style="font-size: 0.85rem; color: var(--primary-color); font-weight: 600;">₹${item.price} x ${item.quantity}</span>
                </div>
                <i class="fas fa-trash remove-item" data-index="${index}" style="color: #ff4757; cursor: pointer;"></i>
            `;

            cartItemsContainer.appendChild(cartItemDiv);
        });

        // Update Total Badge and Price
        if (cartTotalPrice) cartTotalPrice.innerText = `₹${total}`;
        if (cartCountBadge) cartCountBadge.innerText = totalItemsCount;

        // Attach Remove Click Handler
        const removeBtns = cartItemsContainer.querySelectorAll('.remove-item');
        removeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemIndex = e.target.getAttribute('data-index');
                cart.splice(itemIndex, 1);
                updateCartUI();
            });
        });
    }

    /* ==========================================
       5. WISHLIST TOGGLE & BADGE COUNT
       ========================================== */
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    const wishlistCountBadge = document.getElementById('wishlist-count');
    let wishlistCount = 0;

    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const icon = btn.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.replace('far', 'fas');
                wishlistCount++;
            } else {
                icon.classList.replace('fas', 'far');
                wishlistCount--;
            }
            if (wishlistCountBadge) wishlistCountBadge.innerText = wishlistCount;
        });
    });

    /* ==========================================
       7. FORM SUBMISSIONS PREVENT DEFAULT
       ========================================== */
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Success! Your request has been submitted.');
            form.reset();
        });
    });

});
/* ==========================================
   SEARCH FILTER FUNCTIONALITY
   ========================================== */
const searchBox = document.getElementById('search-box');
const menuCards = document.querySelectorAll('.menu .card');

if (searchBox) {
    searchBox.addEventListener('input', () => {
        const searchValue = searchBox.value.toLowerCase().trim();

        menuCards.forEach(card => {
            const title = card.querySelector('h3').innerText.toLowerCase();

            if (title.includes(searchValue)) {
                card.style.display = " ";
            } else {
                card.style.display = 'none';
            }
        });
    });
}
document.addEventListener("DOMContentLoaded", function () {
    const buyNowButtons = document.querySelectorAll(".buy-now");
    const modal = document.getElementById("orderSuccessModal");
    const successMsg = document.getElementById("successMessage");
    const closeModalBtn = document.getElementById("closeModalBtn");

    buyNowButtons.forEach(button => {
        button.addEventListener("click", function (event) {
            const card = event.target.closest(".card");
            const foodName = card ? card.querySelector("h3").innerText : "Item";

            // Set message and show popup modal
            successMsg.innerText = `Your order for "${foodName}" has been successfully placed!`;
            modal.style.display = "flex";
        });
    });

    // Close Popup Modal
    closeModalBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const backToTopBtn = document.getElementById("backToTop");

    window.addEventListener("scroll", function () {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add("active");
        } else {
            backToTopBtn.classList.remove("active");
        }
    });

    backToTopBtn.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});