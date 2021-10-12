const navSlide = () => {
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav-links');
  const navLinks = document.querySelectorAll('.nav-links li');

//Toggle Nav
  burger.addEventListener('click', () => {
    nav.classList.toggle('nav-active');
    console.log("test");

//Animate links
  navlinks.forEach((link, index) => {
    console.log(index / 5);
    if (link.style.animation) {
      link.style.animation = '';
    }
    else {
      link.style.animation = `navLinkFade 0.5s ease forward ${index / 5 + 1.5}s`;
    }
  });
});

}

navSlide();
