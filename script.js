document.write("<h1 class='text-3xl font-bold text-blue-600'>Hello Tailwind from JS 👋</h1>");

// Function to toggle the display of a view
function toggleViewDisplay(elementId) {
    const element = document.getElementById(elementId);
    element.setAttribute('style', element.style.display === 'none' ? 'display: block;' : 'display: none;');
}

document.addEventListener("click", function(event) {
    const target = event.target;
    if (target.matches("a[href^='#']")) {
        event.preventDefault();
        const targetId = target.getAttribute("href").substring(1);
        toggleViewDisplay(targetId);
    }
});

//set initial view with focus on home view


    



