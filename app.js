function navSlide() {
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav-links');
  document.getElementById("demo").innerHTML = "Hello World";
  
  burger.addEventListener('click', function() {
    nav.classList.toggle('nav-active');

  });
}
navSlide();
