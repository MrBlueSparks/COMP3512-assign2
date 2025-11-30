document.addEventListener("DOMContentLoaded", function(){


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

document.querySelector("#genderFilterButton").addEventListener("click", () => toggleFilter("genderFilter"));
document.querySelector("#categoryFilterButton").addEventListener("click", () => toggleFilter("categoryFilter"));
document.querySelector("#colorFilterButton").addEventListener("click", () => toggleFilter("colorFilter"));
document.querySelector("#sizeFilterButton").addEventListener("click", () => toggleFilter("sizeFilter"));

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
/*
const card = document.querySelector(".product-card");
const productList = document.querySelector("#product-list");
const clone = card.content.cloneNode(true);
//will replace with dynamic data later
clone.querySelector("img").setAttribute("src", "https://picsum.photos/seed/picsum/400/300");
clone.querySelector("#product-name").textContent = "Sample Product";
clone.querySelector("#product-price").textContent = "$19.99";
productList.appendChild(clone);

const clone2 = card.content.cloneNode(true);
//will replace with dynamic data later
clone2.querySelector("img").setAttribute("src", "https://picsum.photos/seed/picsum/400/300");
clone2.querySelector("#product-name").textContent = "Sample product 2";
clone2.querySelector("#product-price").textContent = "$39.99";
productList.appendChild(clone2);

const clone3 = card.content.cloneNode(true);
//will replace with dynamic data later
clone3.querySelector("img").setAttribute("src", "https://picsum.photos/seed/picsum/400/300");
clone3.querySelector("#product-name").textContent = "Sample product 3";
clone3.querySelector("#product-price").textContent = "$39.99";
productList.appendChild(clone3);
*/

fetchProducts().then(products => {
    populateHomePage(products);
});

});


