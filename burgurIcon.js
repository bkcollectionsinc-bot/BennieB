

function toggleMenu() {


    const navMain = document.querySelector(".nav-main");
    const burgerIcon = document.querySelector(".burger i");

    navMain.classList.toggle('active');

    if (burgerIcon.classList.contains("fa-bars")) {

        burgerIcon.classList.remove("fa-bars");
        burgerIcon.classList.add("fa-xmark");

    } else {

        burgerIcon.classList.remove("fa-xmark");
        burgerIcon.classList.add("fa-bars");

    }

}