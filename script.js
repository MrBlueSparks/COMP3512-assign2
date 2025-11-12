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




    



