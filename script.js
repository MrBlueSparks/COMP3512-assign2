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

const card = document.querySelector(".product-card");
const clone = card.content.cloneNode(true);
clone.querySelector("img").setAttribute("src", "images/image.png");
clone.querySelector("#product-name").textContent = "Sample Product";
clone.querySelector("#product-price").textContent = "$19.99";
document.querySelector("#product-list").appendChild(clone);

});

z
