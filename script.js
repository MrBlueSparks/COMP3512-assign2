

//const navLink = document.querySelectorAll('p a');

//using event delegation for each nav element
const navLinksListner = document.querySelector("nav").addEventListener("click", focusOnView);


function focusOnView(e){
    if(e.target.tagName === "A"){
        const viewId = e.target.getAttribute("href").substring(1); //get the id without the #
        const views = document.querySelectorAll("main article");
        
        views.forEach((view) => {
            if(view.id === viewId){
                view.classList.remove("invisible");
            } else {
                view.classList.add("invisible");
            }
        });
    }
}




    



