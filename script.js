document.write("<h1 class='text-3xl font-bold text-blue-600'>Hello Tailwind from JS 👋</h1>");

// Function to toggle the display of a view
function toggleViewDisplay(elementId) {
    const element = document.getElementById(elementId);
    element.setAttribute('style', element.style.display === 'none' ? 'display: block;' : 'display: none;');
}



