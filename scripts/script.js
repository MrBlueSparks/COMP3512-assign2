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
         view.id == viewId ? view.classList.remove("invisible") : 
         view.classList.add("invisible");
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


