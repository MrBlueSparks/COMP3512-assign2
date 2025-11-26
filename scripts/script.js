document.addEventListener("DOMContentLoaded", function(){

const navLinksListner = document.querySelector("nav").addEventListener("click", focusOnView);

function focusOnView(e){
    if(e.target.tagName === "A"){
        const viewId = e.target.getAttribute("href").substring(1); //get the id without the #
        const views = document.querySelectorAll("main article");
        for (let view of views) {
             view.id == viewId ? view.classList.remove("invisible") : view.classList.add("invisible");
        }
    }
}
//card elements for home page

const card = document.querySelector(".product-card");
const productList = document.querySelector("#product-list");
const clone = card.content.cloneNode(true);
clone.querySelector("img").setAttribute("src", "images/image.png");
clone.querySelector("#product-name").textContent = "Sample Product";
clone.querySelector("#product-price").textContent = "$19.99";
productList.appendChild(clone);

const clone2 = card.content.cloneNode(true);
clone2.querySelector("img").setAttribute("src", "images/image.png");
clone2.querySelector("#product-name").textContent = "Sample product 2";
clone2.querySelector("#product-price").textContent = "$39.99";
productList.appendChild(clone2);

const clone3 = card.content.cloneNode(true);
clone3.querySelector("img").setAttribute("src", "images/image.png");
clone3.querySelector("#product-name").textContent = "Sample product 3";
clone3.querySelector("#product-price").textContent = "$39.99";
productList.appendChild(clone3);


});


