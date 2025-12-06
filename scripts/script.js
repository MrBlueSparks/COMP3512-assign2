document.addEventListener("DOMContentLoaded", function(){
let allProducts = [];
const cartItems = {};

const selectedFilters = {
    genders: [],
    categories: [],
    colors: [],
    sizes: []
};

let filters = false;

fetchProducts()
    .then(products => {
        allProducts = products;
        populateHomePage(products);
    });

document.querySelectorAll("header a").forEach(nav => nav.addEventListener("click", focusOnView));

function focusOnView(e, programmaticViewId = null){
    if (e && e.preventDefault) {
        e.preventDefault();
    }
    
    let viewId;
    if (programmaticViewId) {
        viewId = programmaticViewId;
    } else {
        const link = e.currentTarget;
        viewId = link.getAttribute("href").substring(1);
    }
    
    const views = document.querySelectorAll("main article");
    const header = document.querySelector("header");
    const main = document.querySelector("main");
    
    if (viewId != "home"){
        main.classList.remove("bg-[url(images/tamara-bellis-IwVRO3TLjLc-unsplash.jpg)]","bg-cover","bg-center");
    } else {
        main.classList.add("bg-[url(images/tamara-bellis-IwVRO3TLjLc-unsplash.jpg)]","bg-cover","bg-center");
    }
    
    if (viewId === "singleProduct" || viewId === "cart") {
        header.classList.add("bg-black");
    } else {
        header.classList.remove("bg-black");
    }

    if (viewId === "cart") {
        displayShoppingCart();
    }

    if (viewId == "browse"){
        displayProducts(allProducts);
    }
    
    for (let view of views) {
        view.id == viewId ? view.classList.remove("hidden") : view.classList.add("hidden");
    }
}

const aboutDialog = document.querySelector("#aboutDialog");
const openAboutBtn = document.querySelector("#openAboutDialog");
const closeDialogX = document.querySelector("#closeDialog");
const closeDialogBtn = document.querySelector("#closeDialogBtn");

openAboutBtn.addEventListener("click", () => {
    aboutDialog.showModal();
});

closeDialogX.addEventListener("click", () => {
    aboutDialog.close();
});

closeDialogBtn.addEventListener("click", () => {
    aboutDialog.close();
});

aboutDialog.addEventListener("click", (e) => {
    if (e.target === aboutDialog) {
        aboutDialog.close();
    }
});

async function fetchProducts(){
    try{
        const cachedData = localStorage.getItem('productsData');
        if (cachedData) {
            console.log('Loading products from localStorage');
            return JSON.parse(cachedData);
        }
        
        console.log('Fetching products from server');
        const response = await fetch("data/data-minifed.json");
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        
        localStorage.setItem('productsData', JSON.stringify(products));
        
        return products;
    } catch(error){
        console.error("Error fetching products:", error);
        return [];
    }
}

function populateHomePage(products){
    const card = document.querySelector(".productCardTemplate");
    const productList = document.querySelector("#product-list");
    productList.replaceChildren();
    for (let i = 0; i < 3; i++){
        const product = products[i];
        const clone = card.content.cloneNode(true);
        setupProductCard(clone, product);
        productList.appendChild(clone);
    }
}

function toggleFilter(id) {
  const el = document.getElementById(id);
  const icon = document.getElementById(id + "Icon");

  if (el.style.maxHeight && el.style.maxHeight !== "0px") {
    el.style.maxHeight = "0px";
    icon.textContent = "+";
  } else {
    el.style.maxHeight = el.scrollHeight + "px";
    icon.textContent = "–";
  }
}

document.querySelector("#genderFilterButton").addEventListener("click", () => toggleFilter("genderFilter"));
document.querySelector("#categoryFilterButton").addEventListener("click", () => toggleFilter("categoryFilter"));
document.querySelector("#colorFilterButton").addEventListener("click", () => toggleFilter("colorFilter"));
document.querySelector("#sizeFilterButton").addEventListener("click", () => toggleFilter("sizeFilter"));


document.querySelectorAll('#genderFilter input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        if (checkbox.checked){
            const gender = checkbox.name;
            console.log("Gender filter applied:", gender);
            selectedFilters.genders.push(gender);
            filters = true;
             
        }
        else {
            const gender = checkbox.name;
            console.log("Gender filter removed:", gender);
            const index = selectedFilters.genders.indexOf(gender);
            if (index > -1) {
                selectedFilters.genders.splice(index, 1);
            }
            filters = false;
        }

        applyFilters();
        updateActiveFilters(); 
    });
});

document.querySelectorAll('#categoryFilter input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        if (checkbox.checked){
            const category = checkbox.name;
            console.log("Category filter applied:", category);
            selectedFilters.categories.push(category);
            filters = true;
        }
        else {
            const category = checkbox.name;
            console.log("Category filter removed:", category);
            const index = selectedFilters.categories.indexOf(category);
            if (index > -1) {
                selectedFilters.categories.splice(index, 1);
            }
            filters = false;
        }
        updateActiveFilters();
        applyFilters();
    });
});

document.querySelectorAll('#colorFilter button[data-color]').forEach(swatch => {
    swatch.addEventListener('click', function() {
        this.classList.toggle('ring-4');
        this.classList.toggle('ring-white');
        this.classList.toggle('scale-110');
        
        const color = this.dataset.color;
        
        const index = selectedFilters.colors.indexOf(color);
        if (index > -1) {
            selectedFilters.colors.splice(index, 1);
            console.log('Color filter removed:', color);
        } else {
            selectedFilters.colors.push(color);
            console.log('Color filter applied:', color);

        }
        updateActiveFilters();
        applyFilters();

    });
});

document.querySelectorAll('#sizeFilter button[data-size]').forEach(pill => {
    pill.addEventListener('click', function() {
        this.classList.toggle('bg-white');
        this.classList.toggle('text-gray-900');
        
        const size = this.dataset.size;
        console.log('Size selected:', size);
        
        const index = selectedFilters.sizes.indexOf(size);
        if (index > -1) {
            selectedFilters.sizes.splice(index, 1);
            console.log('Size filter removed:', size);
        } else {
            selectedFilters.sizes.push(size);
            console.log('Size filter applied:', size);
        }
        updateActiveFilters();
        applyFilters();
    });
});


async function displayProducts(products){
        const productList = document.querySelector("#product-list-browse");
        productList.replaceChildren();

        if (!products || products.length === 0){
            const noProductsMsg = document.createElement("p");
            noProductsMsg.textContent = "No products match the selected filters. Please try again.";
            noProductsMsg.className = "text-white text-xl mt-6 col-span-3 text-center";
            productList.appendChild(noProductsMsg);
            return;
        }


        const card = document.querySelector(".productCardTemplate");
        //const products = await fetchProducts();

        products.forEach(product => {
            const clone = card.content.cloneNode(true);
            setupProductCard(clone, product);
            productList.appendChild(clone);
        });
        console.log("Products populated");
        console.log(allProducts[0]);
        
}

function setupProductCard(clone, product) {
    clone.querySelector("img").setAttribute("src", `https://picsum.photos/seed/${product.id}/300/300`);
    clone.querySelector(".product-name").textContent = product.name;
    clone.querySelector(".product-price").textContent = `$${product.price.toFixed(2)}`;

    const addtoCartBtn = clone.querySelector("#addToCartBtn");
    addtoCartBtn.addEventListener("click", function(e) {
        addToCart(e, product);
        e.stopPropagation();
    });
    
    const productCard = clone.querySelector("#productCardBrowse");
    productCard.id = product.id;
    productCard.dataset.productName = product.name;
    productCard.dataset.productPrice = product.price;
    productCard.dataset.productDescription = product.description;
    productCard.dataset.productMaterial = product.material;
    productCard.dataset.sizes = product.sizes;
    productCard.dataset.productCategory = product.category;
    productCard.dataset.productGender = product.gender;
    productCard.dataset.colorName = product.color[0].name;
    productCard.dataset.colorHex = product.color[0].hex;
    productCard.addEventListener("click", function(productEvent) {
        displaySingleProduct(productEvent);
    });
}

function applyFilters(){
    let filtered = allProducts;
    
    if (selectedFilters.genders.length > 0) {
        filtered = filtered.filter(product => 
            selectedFilters.genders.includes(product.gender)
        );
    }
    
    if (selectedFilters.categories.length > 0) {
        filtered = filtered.filter(product => 
            selectedFilters.categories.includes(product.category)
        );
    }
    
    if (selectedFilters.colors.length > 0) {
        filtered = filtered.filter(product => 
            selectedFilters.colors.some(filterColor => 
               colorMatchesWithDistance(product.color, filterColor) 
            )
        )
    }
    
    if (selectedFilters.sizes.length > 0) {
        filtered = filtered.filter(product => 
            product.sizes.some(size => selectedFilters.sizes.includes(size))
        );
    }
    
    console.log(`Filtered: ${filtered.length} of ${allProducts.length} products`);
    
    displayProducts(filtered);
}
        

function converthexToRGB(hex) {
    const bigint = parseInt(hex.replace('#', ''), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}

function colorDistance(hex1, hex2) {
    const rgb1 = converthexToRGB(hex1);
    const rgb2 = converthexToRGB(hex2);

    return Math.sqrt(
        Math.pow(rgb1.r - rgb2.r, 2) +
        Math.pow(rgb1.g - rgb2.g, 2) +
        Math.pow(rgb1.b - rgb2.b, 2)
    );
}

const referenceColors = {
    'Black': '#000000',
    'White': '#FFFFFF',
    'Gray': '#808080',
    'Navy': '#000080',
    'Beige': '#F5F5DC',
    'Red': '#FF0000',
    'Blue': '#0000FF',
    'Green': '#008000',
    'Yellow': '#FFFF00',
    'Pink': '#FFC0CB',
    'Brown': '#8B4513',
    'Multicolor': null // Special case - handle separately
};

const colorThresholds = {
    'Black': 80,      // Strict - blacks should be very dark
    'White': 80,      // Strict - whites should be very light
    'Gray': 100,      // Medium - various shades
    'Navy': 90,       // Strict - specific blue
    'Beige': 120,     // Loose - tan/sand variations
    'Red': 100,       // Medium-strict - avoid browns
    'Blue': 180,      // Medium - various blues
    'Green': 120,     // Medium - various greens
    'Yellow': 100,    // Medium - avoid beige
    'Pink': 110,      // Medium - blush variations
    'Brown': 130,     // Loose - leather/tan/cognac
    'Multicolor': 0   // Not used
};


function colorMatchesWithDistance(productColors, filterColor) {
    if (filterColor === 'Multicolor') {
        return productColors.some(colorObj => 
            colorObj.name.toLowerCase().includes('multi')
        );
    }
    
    const referenceHex = referenceColors[filterColor];
    const threshold = colorThresholds[filterColor]; 
    if (!referenceHex) return false;
    
    return productColors.some(colorObj => {
        const distance = colorDistance(colorObj.hex, referenceHex);
        console.log(`Distance between ${colorObj.name} (${colorObj.hex}) and ${filterColor} (${referenceHex}): ${distance} (threshold: ${threshold})`);
        return distance <= threshold;
    });
}

function updateActiveFilters() {
    const activeFiltersContainer = document.querySelector('#filterList');
    const template = document.querySelector('.activeFiltersTemplate');
    activeFiltersContainer.replaceChildren();
    
    const clearAllButton = document.querySelector('#clearAllFiltersBtn');
    let isEmpty = Object.values(selectedFilters).every(arr => arr.length === 0);
    if (isEmpty) {
        clearAllButton.classList.add("invisible");
    } else {
        clearAllButton.classList.remove("invisible");
    }
    for (const filterGroup in selectedFilters) {
        selectedFilters[filterGroup].forEach(filterValue => {
            if (!filterValue) return;
            const clone = template.content.cloneNode(true);
            clone.querySelector("#deleteBtnText").textContent = filterValue;
            activeFiltersContainer.appendChild(clone);
        });
    }
}

document.querySelector('#filterList').addEventListener('click', function(e) {
    if (e.target.classList.contains('deleteFilterBtn') || e.target.closest('.deleteFilterBtn')) {
        const filterValue = e.target.closest('.deleteFilterBtn').querySelector('#deleteBtnText').textContent;
        for (const filterGroup in selectedFilters) {
            const index = selectedFilters[filterGroup].indexOf(filterValue);
            if (index > -1) {
                selectedFilters[filterGroup].splice(index, 1);
                if (filterGroup === 'genders') {
                    const checkbox = document.querySelector(`#genderFilter input[name="${filterValue}"]`);
                    if (checkbox) checkbox.checked = false;
                } else if (filterGroup === 'categories') {
                    const checkbox = document.querySelector(`#categoryFilter input[name="${filterValue}"]`);
                    if (checkbox) checkbox.checked = false;
                } else if (filterGroup === 'colors') {
                    const swatch = document.querySelector(`#colorFilter button[data-color="${filterValue}"]`);
                    if (swatch) {
                        swatch.classList.remove('ring-4', 'ring-white', 'scale-110');
                    }
                } else if (filterGroup === 'sizes') {
                    const pill = document.querySelector(`#sizeFilter button[data-size="${filterValue}"]`);
                    if (pill) {
                        pill.classList.remove('bg-white', 'text-gray-900');
                    }
                }
            }
        }
    }
    updateActiveFilters();
    applyFilters();
    
    });

document.querySelector('#clearAllFiltersBtn').addEventListener('click', function() {
    for (const filterGroup in selectedFilters) {
        selectedFilters[filterGroup] = [];
    }
    document.querySelectorAll('#genderFilter input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    document.querySelectorAll('#categoryFilter input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    document.querySelectorAll('#colorFilter button[data-color]').forEach(swatch => {
        swatch.classList.remove('ring-4', 'ring-white', 'scale-110');
    });
    document.querySelectorAll('#sizeFilter button[data-size]').forEach(pill => {
        pill.classList.remove('bg-white', 'text-gray-900');
    });
    updateActiveFilters();
    applyFilters();
});

document.querySelector('#sortSelect').addEventListener('change', function() {
    const sortBy = this.value;
    let productsToSort = allProducts;

    if (sortBy == "price-asc"){
        productsToSort.sort(
            (a, b) => a.price - b.price
        )
    }
    else if (sortBy == "price-desc"){
        productsToSort.sort(
            (a, b) => b.price - a.price
        )
    } 
    else if (sortBy == "az"){
        productsToSort.sort(
            (a, b) => a.name.localeCompare(b.name)
        )
    }
    else if (sortBy == "za"){
        productsToSort.sort(
            (a, b) => b.name.localeCompare(a.name)
        )
    }
    displayProducts(productsToSort);
});




function displaySingleProduct(event){
    const productCard = event.currentTarget;
    const mainProductTemp = document.querySelector(".mainProductTemplate");
    const mainProduct = document.querySelector("#mainProduct");
    
    // Use focusOnView for consistent navigation
    focusOnView(null, "singleProduct");
    
    // Update breadcrumb navigation
    document.querySelector("#breadcrumbCategory").textContent = productCard.dataset.productCategory;
    document.querySelector("#breadcrumbProduct").textContent = productCard.dataset.productName;

    const clone = mainProductTemp.content.cloneNode(true);
     
    mainProduct.replaceChildren(); // Clear existing content
    //setting images
    const productId = productCard.id;
    clone.querySelector("#mainProductImage").setAttribute("src", productCard.querySelector("img").getAttribute("src").replace("300/300","800/600"));
    clone.querySelector("#mainProductImage2").setAttribute("src", productCard.querySelector("img").getAttribute("src").replace("300/300","400/400").replace(productId, productId + "2"));
    clone.querySelector("#mainProductImage3").setAttribute("src", productCard.querySelector("img").getAttribute("src").replace("300/300","400/400").replace(productId, productId + "3"));
    
    //setting details
    clone.querySelector("#mainProductDetails #mainProductName").textContent = productCard.dataset.productName;
    clone.querySelector("#mainProductDetails #mainProductPrice").textContent = `$${parseFloat(productCard.dataset.productPrice).toFixed(2)}`;
    clone.querySelector("#mainProductDetails #mainProductDescription").textContent = productCard.dataset.productDescription;
    clone.querySelector("#mainProductDetails #mainProductMaterial").textContent = productCard.dataset.productMaterial;
    
    //setting color
    clone.querySelector("#colorSwatch").style.backgroundColor = productCard.dataset.colorHex;
    clone.querySelector("#colorName").textContent = productCard.dataset.colorName;

    //adding sizes dynamically
    const sizes = productCard.dataset.sizes.split(",");
    const sizeContainer = clone.querySelector("#mainProductDetails #mainProductSizes");
    let selectedSize = null; // Track selected size
    
    sizes.forEach(size => {
        const sizeOption = document.createElement("button");
        sizeOption.type = "button";
        sizeOption.textContent = size.trim();
        sizeOption.className = "border border-gray-400 rounded px-3 py-1 mr-2 mb-2 hover:bg-gray-200";
        
        // Add click handler for size selection
        sizeOption.addEventListener("click", function() {
            // Remove selected state from all size buttons
            sizeContainer.querySelectorAll("button").forEach(btn => {
                btn.classList.remove("bg-gray-900", "text-white");
                btn.classList.add("hover:bg-gray-200");
            });
            
            // Add selected state to clicked button
            this.classList.add("bg-gray-900", "text-white");
            this.classList.remove("hover:bg-gray-200");
            selectedSize = size.trim();
        });
        
        sizeContainer.appendChild(sizeOption);
    });

    mainProduct.appendChild(clone);
    
    // Add quantity button functionality
    const quantityInput = document.querySelector("#quantityInput");
    const decreaseBtn = document.querySelector("#decreaseQty");
    const increaseBtn = document.querySelector("#increaseQty");
    
    decreaseBtn.addEventListener("click", () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });
    
    increaseBtn.addEventListener("click", () => {
        const currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
    });
    
    // Add to cart form submission
    const addToCartForm = document.querySelector("#mainProductDetails form");
    addToCartForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        // Check if size is selected
        if (!selectedSize) {
            alert("Please select a size");
            return;
        }
        
        // Get quantity
        const quantity = parseInt(quantityInput.value);
        
        // Create product object with selected options
        const productToAdd = {
            id: productCard.id,
            name: productCard.dataset.productName,
            price: parseFloat(productCard.dataset.productPrice),
            color: [{
                name: productCard.dataset.colorName,
                hex: productCard.dataset.colorHex
            }],
            sizes: [selectedSize] // Use selected size instead of all sizes
        };
        
        // Add to cart with the selected quantity
        for (let i = 0; i < quantity; i++) {
            addToCart(e, productToAdd);
        }
        
        // Show confirmation
        alert(`Added ${quantity} × ${productToAdd.name} (Size: ${selectedSize}) to cart!`);
        
        // Reset quantity to 1
        quantityInput.value = 1;
    });
    
    displayRelatedProducts(productCard);
    
}

function getRelatedProducts(currentProduct, allProducts, limit = 3) {
    const currentPrice = parseFloat(currentProduct.dataset.productPrice);
    const currentMaterial = currentProduct.dataset.productMaterial;
    const currentCategory = currentProduct.dataset.productCategory;
    const currentGender = currentProduct.dataset.productGender;
    
    // Score each product by relevance
    const scoredProducts = allProducts
        .filter(p => p.id != currentProduct.id) // Don't show the current product
        .map(p => {
            //uses a scoring system to rank related products
            let score = 0;
            
            // Same category and gender (highest priority)
            if (p.category === currentCategory && p.gender === currentGender) {
                score += 100;
            }
            // Same category, different gender (lower priority)
            else if (p.category === currentCategory) {
                score += 50;
            }
            // Same gender, different category
            else if (p.gender === currentGender) {
                score += 20;
            }
            
            // Similar material (e.g., silk products go with other silk)
            if (p.material.toLowerCase().includes(currentMaterial.toLowerCase().split(/[,\s]/)[0]) ||
                currentMaterial.toLowerCase().includes(p.material.toLowerCase().split(/[,\s]/)[0])) {
                score += 30;
            }
            
            // Similar price range (luxury paired with luxury, budget with budget)
            const priceDifference = Math.abs(p.price - currentPrice) / currentPrice;
            if (priceDifference < 0.3) {
                score += 40;
            } else if (priceDifference < 0.5) {
                score += 20;
            }
            
            return { product: p, score: score };
        })
        .filter(item => item.score > 0) // Only show products with some relevance
        .sort((a, b) => b.score - a.score) // Sort by score descending
        .slice(0, limit)
        .map(item => item.product);
    
    return scoredProducts;
}

function displayRelatedProducts(currentProduct){
    const relatedProductsList = document.querySelector("#relatedProductList");
    const relatedProducts = getRelatedProducts(currentProduct, allProducts);
    
    relatedProductsList.replaceChildren(); // Clear existing related products

    relatedProducts.forEach(product => {
        const clone = document.querySelector(".productCardTemplate").content.cloneNode(true);
        setupProductCard(clone, product);
        relatedProductsList.appendChild(clone);    
    });
}

function addToCart(event, currentProduct){
    // Get default size (first available size)
    const defaultSize = currentProduct.sizes[0];
    const colorName = currentProduct.color[0].name;
    const colorHex = currentProduct.color[0].hex;
    
    // Create unique key: productId-size-color
    const cartKey = `${currentProduct.id}-${defaultSize}-${colorName}`;
    
    // Check if item already exists in cart
    if (cartItems[cartKey]) {
        // Item exists, just increment quantity
        cartItems[cartKey].quantity += 1;
    } else {
        // New item, add to cart
        cartItems[cartKey] = {
            id: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.price,
            size: defaultSize,
            colorName: colorName,
            colorHex: colorHex,
            quantity: 1,
            image: `https://picsum.photos/seed/${currentProduct.id}/80/80`
        };
    }
    
    // Update cart count (total number of items)
    const totalItems = Object.values(cartItems).reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.querySelector('#cartItemCount');
    cartCount.classList.remove('hidden');
    cartCount.textContent = totalItems;

    // Save to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}



function displayShoppingCart(){
    const storedCart = JSON.parse(localStorage.getItem('cartItems')) || {};
    const cartItemsList = document.querySelector("#cartItemsList");
    const emptyMessage = document.querySelector("#emptyCartMessage");
    const cartItemTemplate = document.querySelector(".cartItemTemplate");
    
    cartItemsList.replaceChildren();
    
    const cartKeys = Object.keys(storedCart);
    
    if (cartKeys.length === 0) {
        emptyMessage.classList.remove('hidden');
        const cartLeftSection = document.querySelector("#cart .lg\\:col-span-2");
        const summarySection = document.querySelector("#cart aside");
        
        if (cartLeftSection) {
            const shippingSection = cartLeftSection.querySelector("section:last-child");
            if (shippingSection) shippingSection.classList.add('hidden');
        }
        if (summarySection) summarySection.classList.add('hidden');
        return;
    } else {
        emptyMessage.classList.add('hidden');
        // Show shipping and summary sections
        const cartLeftSection = document.querySelector("#cart .lg\\:col-span-2");
        const summarySection = document.querySelector("#cart aside");
        
        if (cartLeftSection) {
            const shippingSection = cartLeftSection.querySelector("section:last-child");
            if (shippingSection) shippingSection.classList.remove('hidden');
        }
        if (summarySection) summarySection.classList.remove('hidden');
    }
    
    cartKeys.forEach(cartKey => {
        const item = storedCart[cartKey];
        const clone = cartItemTemplate.content.cloneNode(true);
        
        clone.querySelector("img").setAttribute("src", item.image);
        clone.querySelector("#cart-item-name").textContent = item.name;
        clone.querySelector("#cart-item-color-swatch").style.backgroundColor = item.colorHex;
        clone.querySelector("#cart-item-color-name").textContent = item.colorName;
        clone.querySelector("#cart-item-size").textContent = item.size;
        clone.querySelector("#cart-item-price").textContent = `$${item.price.toFixed(2)}`;
        clone.querySelector("#cart-item-quantity").textContent = item.quantity;
        
        const subtotal = item.price * item.quantity;
        clone.querySelector("#cart-item-subtotal").textContent = `$${subtotal.toFixed(2)}`;
        
        const addBtn = clone.querySelector("#cart-item-add");
        const subtractBtn = clone.querySelector("#cart-item-subtract");
        const removeBtn = clone.querySelector("#cart-item-remove");
        
        addBtn.addEventListener("click", () => {
            storedCart[cartKey].quantity += 1;
            localStorage.setItem('cartItems', JSON.stringify(storedCart));
            Object.assign(cartItems, storedCart);
            displayShoppingCart();
        });
        
        subtractBtn.addEventListener("click", () => {
            if (storedCart[cartKey].quantity > 1) {
                storedCart[cartKey].quantity -= 1;
                localStorage.setItem('cartItems', JSON.stringify(storedCart));
                Object.assign(cartItems, storedCart);
                displayShoppingCart();
                //update cart count
                const totalItems = Object.values(storedCart).reduce((sum, item) => sum + item.quantity, 0);
                const cartCount = document.querySelector('#cartItemCount');
                if (totalItems === 0) {
                    cartCount.classList.add('hidden');
                } else {
                    cartCount.textContent = totalItems;
                }
            }
        });
        
        removeBtn.addEventListener("click", () => {
            delete storedCart[cartKey];
            // Update both localStorage and in-memory cartItems
            localStorage.setItem('cartItems', JSON.stringify(storedCart));
            delete cartItems[cartKey];
            displayShoppingCart(); // Refresh display
            //update cart count
            const totalItems = Object.values(storedCart).reduce((sum, item) => sum + item.quantity, 0);
            const cartCount = document.querySelector('#cartItemCount');
            if (totalItems === 0) {
                cartCount.classList.add('hidden');
            } else {
                cartCount.textContent = totalItems;
            }
        });
        
    cartItemsList.appendChild(clone);
    });
    
    updateCartSummary();
}

function updateCartSummary() {
    const storedCart = JSON.parse(localStorage.getItem('cartItems')) || {};
    const cartKeys = Object.keys(storedCart);
    
    let merchandiseTotal = 0;
    cartKeys.forEach(cartKey => {
        const item = storedCart[cartKey];
        merchandiseTotal += item.price * item.quantity;
    });
    
    const shippingMethod = document.querySelector("#shippingMethod").value;
    const destination = document.querySelector("#destination").value;
    
    let shippingCost = 0;
    
    if (merchandiseTotal > 500) {
        shippingCost = 0;
    } else {
        if (destination === "canada") {
            if (shippingMethod === "standard") shippingCost = 10;
            else if (shippingMethod === "express") shippingCost = 25;
            else if (shippingMethod === "priority") shippingCost = 35;
        } else if (destination === "us") {
            if (shippingMethod === "standard") shippingCost = 15;
            else if (shippingMethod === "express") shippingCost = 25;
            else if (shippingMethod === "priority") shippingCost = 50;
        } else if (destination === "international") {
            if (shippingMethod === "standard") shippingCost = 20;
            else if (shippingMethod === "express") shippingCost = 30;
            else if (shippingMethod === "priority") shippingCost = 50;
        }
    }
    
    let tax = 0;
    if (destination === "canada") {
        tax = merchandiseTotal * 0.05;
    }
    
    const total = merchandiseTotal + shippingCost + tax;
    
    document.querySelector("#merchandiseTotal").textContent = `$${merchandiseTotal.toFixed(2)}`;
    document.querySelector("#shippingCost").textContent = `$${shippingCost.toFixed(2)}`;
    document.querySelector("#taxAmount").textContent = `$${tax.toFixed(2)}`;
    document.querySelector("#orderTotal").textContent = `$${total.toFixed(2)}`;
    
    // Disable checkout if cart is empty
    const checkoutBtn = document.querySelector("#checkoutBtn");
    if (cartKeys.length === 0) {
        checkoutBtn.disabled = true;
    } else {
        checkoutBtn.disabled = false;
    }
}

document.querySelector("#shippingMethod").addEventListener("change", updateCartSummary);
document.querySelector("#destination").addEventListener("change", updateCartSummary);

document.querySelector("#checkoutBtn").addEventListener("click", function() {
    localStorage.removeItem('cartItems');
    
    for (let key in cartItems) {
        delete cartItems[key];
    }
    
    const cartCount = document.querySelector('#cartItemCount');
    cartCount.classList.add('hidden');
    cartCount.textContent = '0';
    
    alert('Order placed successfully! Thank you for your purchase.');
    
    focusOnView(null, "home");
});

});