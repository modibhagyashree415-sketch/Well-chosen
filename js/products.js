let currentSlide = 0;
let slides = document.querySelectorAll(".slide");

function showSlide(n) {
  slides[0].classList.remove("active");
  slides[1].classList.remove("active");
  slides[2].classList.remove("active");
  slides[n].classList.add("active");
}

function nextSlide() {
  currentSlide = currentSlide + 1;
  if (currentSlide > 2) {
    currentSlide = 0;
  }
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = currentSlide - 1;
  if (currentSlide < 0) {
    currentSlide = 2;
  }
  showSlide(currentSlide);
}

const products = [
  {
    id: 1,
    name: "Scented Candle Set",
    price: 599,
    category: "home",
    occasion: "birthday",
    image: "https://via.placeholder.com/250",
    rating: 4.5
  },
  {
    id: 2,
    name: "Personalized Mug",
    price: 349,
    category: "personalized",
    occasion: "anniversary",
    image: "https://via.placeholder.com/250",
    rating: 4.2
  },
  {
    id: 3,
    name: "Gift Hamper",
    price: 1299,
    category: "hamper",
    occasion: "corporate",
    image: "https://via.placeholder.com/250",
    rating: 4.8
  },
  {
    id: 4,
    name: "Chocolate Box",
    price: 449,
    category: "food",
    occasion: "anniversary",
    image: "https://via.placeholder.com/250",
    rating: 4.6
  },
  {
    id: 5,
    name: "Rakhi Special Combo",
    price: 799,
    category: "personalized",
    occasion: "rakhi",
    image: "https://via.placeholder.com/250",
    rating: 4.3
  },
  {
    id: 6,
    name: "Photo Frame",
    price: 299,
    category: "home",
    occasion: "birthday",
    image: "https://via.placeholder.com/250",
    rating: 4.1
  }
];

  const searchIcon = document.querySelector(".fa-magnifying-glass");

searchIcon.addEventListener("click", function(e){
    e.preventDefault();

    document.getElementById("searchBox").style.display = "block";
});



