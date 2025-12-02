document.addEventListener("DOMContentLoaded", function(){
let allProducts = [];

// Track selected filters
const selectedFilters = {
    genders: [],
    categories: [],
    colors: [],
    sizes: []
};

let filters = false;

// Fetch products immediately on page load
fetchProducts()
    .then(products => {
        allProducts = products;
        populateHomePage(products);
        
    });

document.querySelectorAll("header a").forEach(nav => nav.addEventListener("click", focusOnView));


function focusOnView(e){
    e.preventDefault();
    const link = e.currentTarget; // Use currentTarget to get the <a> element, not the clicked child
    const viewId = link.getAttribute("href").substring(1); //get the id without the #
    const views = document.querySelectorAll("main article");
    for (let view of views) {
         if (viewId != "home"){
            document.querySelector("main").classList.remove("bg-[url(images/tamara-bellis-IwVRO3TLjLc-unsplash.jpg)]","bg-cover","bg-center");
         }
         else if (viewId == "home"){
            document.querySelector("main").classList.add("bg-[url(images/tamara-bellis-IwVRO3TLjLc-unsplash.jpg)]","bg-cover","bg-center");
        }

        if (viewId == "browse"){
            displayProducts(allProducts);
        }
         view.id == viewId ? view.classList.remove("hidden") : 
         view.classList.add("hidden");
    }
}

async function fetchProducts(){
    try{
        const response = await fetch("data/data-minifed.json");
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        return products;
    } catch(error){
        console.error("Error fetching products:", error);
        return [];
    }
}

//card elements for home page
function populateHomePage(products){
    const card = document.querySelector(".product-card");
    const productList = document.querySelector("#product-list");
    productList.replaceChildren(); // Clear existing products
    //add first 3 products to home page
    for (let i = 0; i < 3; i++){
        const product = products[i];
        const clone = card.content.cloneNode(true);
        clone.querySelector("img").setAttribute("src", `https://picsum.photos/seed/${product.id}/300/300`);
        clone.querySelector("#product-name").textContent = product.name;
        clone.querySelector("#product-price").textContent = `$${product.price.toFixed(2)}`;
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

// Filter button click handlers
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
    });
});

//Category checkbox handlers
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

        applyFilters();
    });
});

// Color swatch click handlers
document.querySelectorAll('#colorFilter button[data-color]').forEach(swatch => {
    swatch.addEventListener('click', function() {
        // Toggle active state
        this.classList.toggle('ring-4');
        this.classList.toggle('ring-white');
        this.classList.toggle('scale-110');
        
        // Get selected color
        const color = this.dataset.color;
        console.log('Color selected:', color);
        
        // TODO: Apply filter logic here
    });
});

// Size pill click handlers
document.querySelectorAll('#sizeFilter button[data-size]').forEach(pill => {
    pill.addEventListener('click', function() {
        // Toggle active state
        this.classList.toggle('bg-white');
        this.classList.toggle('text-gray-900');
        
        // Get selected size
        const size = this.dataset.size;
        console.log('Size selected:', size);
        
        // TODO: Apply filter logic here
    });
});


async function displayProducts(products){
        const card = document.querySelector(".productCardTemplate");
        const productList = document.querySelector("#product-list-browse");
        //const products = await fetchProducts();
        productList.replaceChildren(); // Clear existing products

        products.forEach(product => {
            const clone = card.content.cloneNode(true);
            clone.querySelector("img").setAttribute("src", `https://picsum.photos/seed/${product.id}/300/300`);
            clone.querySelector(".product-name").textContent = product.name;
            clone.querySelector(".product-price").textContent = `$${product.price.toFixed(2)}`;
            productList.appendChild(clone);
        });
        console.log("Products populated");
        console.log(allProducts[0]);
        
}


//this is where we filter our products

function applyFilters(){
    // Start with all products, don't mutate the original array
    let filtered = allProducts;
    
    // Filter by gender (only if genders are selected)
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
    /*
    // Filter by color (add when ready)
    if (selectedFilters.colors.length > 0) {
        filtered = filtered.filter(product => 
            product.color.some(colorObj => 
                selectedFilters.colors.includes(colorObj.name)
            )
        );
    }
    
    // Filter by size (add when ready)
    if (selectedFilters.sizes.length > 0) {
        filtered = filtered.filter(product => 
            product.sizes.some(size => selectedFilters.sizes.includes(size))
        );
    }
    
    console.log(`Filtered: ${filtered.length} of ${allProducts.length} products`);
    */
    // Display the filtered products
    displayFilteredProducts(filtered);
}

function displayFilteredProducts(filteredProducts) {
    displayProducts(filteredProducts);
}

function converthexToRGB(hex) {
    //remove the # and convert to integer with base 16
    const bigint = parseInt(hex.replace('#', ''), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}
//calculate euclidean distance between two colors, used for color similarity
function colorDistance(hex1, hex2) {
    const rgb1 = converthexToRGB(hex1);
    const rgb2 = converthexToRGB(hex2);

    return Math.sqrt(
        Math.pow(rgb1.r - rgb2.r, 2) +
        Math.pow(rgb1.g - rgb2.g, 2) +
        Math.pow(rgb1.b - rgb2.b, 2)
    );
}



});