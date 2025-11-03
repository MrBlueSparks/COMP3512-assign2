document.write("<h1 class='text-3xl font-bold text-blue-600'>Hello Tailwind from JS 👋</h1>");

function hideElementById(id) {
    document.getElementById(id).style.visibility = 'hidden';
}

hideElementById('view1');
