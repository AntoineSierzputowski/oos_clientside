// Configuration Client
const config = {
    website: 'underarmour.fr',
    brand: 'Under Armour',
    out_of_stock_indicator: {
        type: 'class',
        value: 'disabled',
    },
    size_selector: 'HTML attribut: data-size-attr="string"',
    conditions: [
        {
            type: 'pathname',
            value: '/p/',
        },
    ],
    image_selector: 'img.b-product_carousel-image.js-product_carousel-image',
    price_selector: 'span.b-price-value',
    product_name_selector: 'h1',
};

// Script 1: Product Page Detection
(function () {
    // Check if current page is a product page based on conditions
    function isProductPage() {
        // Check all conditions from config
        return config.conditions.some((condition) => {
            if (condition.type === 'pathname') {
                return window.location.pathname.includes(condition.value);
            } else if (condition.type === 'dataLayer') {
                try {
                    // Handle dataLayer conditions with eval for complex expressions
                    return eval(condition.value);
                } catch (e) {
                    console.error('Error evaluating dataLayer condition:', e);
                    return false;
                }
            } else if (condition.type === 'element') {
                !!document.querySelector(condition.value);
                // need to wait the element
            }
            return false;
        });
    }

    // If we're on a product page, load Script 2
    if (isProductPage()) {
        // Call the stock checker function directly instead of loading another script
        checkStockStatus();
    }
})();

// Script 2: Stock Status Detection
function checkStockStatus() {
    // Check if the product is out of stock
    function isProductOutOfStock() {
        // Use out_of_stock_indicator from config
        if (config.out_of_stock_indicator) {
            const indicator = config.out_of_stock_indicator;

            if (indicator.type === 'class') {
                // Check for elements with the specified class
                const elements = document.querySelectorAll('.' + indicator.value);
                if (elements.length > 0) {
                    return true;
                }
            } else if (indicator.type === 'text') {
                // Check for text-based indicators
                const pageText = document.body.innerText;
                if (pageText.includes(indicator.value)) {
                    return true;
                }
            } else if (indicator.type === 'attribute') {
                // Check for elements with the specified attribute
                const elements = document.querySelectorAll(`[${indicator.attribute}="${indicator.value}"]`);
                if (elements.length > 0) {
                    return true;
                }
            }
        }

        // Fallback methods
        // Check for disabled "add to cart" button
        const addToCartBtn = document.querySelector('button[name="add"], .add-to-cart, #add-to-cart');
        if (addToCartBtn && (addToCartBtn.disabled || addToCartBtn.classList.contains('disabled'))) {
            return true;
        }

        return false;
    }

    // Get product details for notification
    function getProductDetails() {
        return {
            name: document.querySelector(config.product_name_selector)?.textContent?.trim() || 'Product',
            url: window.location.href,
            // You might want to get more details like image, price, etc.
            image: document.querySelector(config.image_selector)?.src || '', // need to add in the config object
            price: document.querySelector(config.price_selector)?.textContent?.trim() || '', // need to add in the config object
        };
    }

    // Check stock status and load popup if needed
    if (isProductOutOfStock()) {
        // load the popup
        loadPopup(getProductDetails());
    }
}
// Script 3: Load Popup
function loadPopup(productDetails) {
    const HTML_POPUP = `
    <div class="popup">
        <h2>${productDetails.name}</h2>
        <img src="${productDetails.image}" alt="${productDetails.name}">
        <p>${productDetails.price}</p>
    </div>
`;
    const CSS_POPUP = `
    .popup {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }
`;
    console.log('productDetails: ', productDetails);
    // load the popup
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.innerHTML = HTML_POPUP;
    document.body.appendChild(popup);
    const style = document.createElement('style');
    style.textContent = CSS_POPUP;
    document.head.appendChild(style);
    // Need to add input text for email
    const input = document.createElement('input');
    input.type = 'email';
    input.placeholder = 'Enter your email';
    popup.appendChild(input);
    // Need to add button to submit the form
    const button = document.createElement('button');
    button.textContent = 'Submit';
    popup.appendChild(button);
}
// Need function to POST the data to the server
function postData(data) {
    fetch('https://example.com/api/stock', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}
