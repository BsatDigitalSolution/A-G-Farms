// Global variables
let currentLanguage = "en";
let cart = [];
let cartTotal = 0;

// Language switching
function switchLanguage(lang) {
  currentLanguage = lang;

  // Update language buttons
  document.querySelectorAll(".language-btn").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.dataset.lang === lang) {
      btn.classList.add("active");
    }
  });

  // Update all text elements
  document.querySelectorAll("[data-" + lang + "]").forEach((element) => {
    element.textContent = element.dataset[lang];
  });

  // Update placeholders
  document
    .querySelectorAll("[data-" + lang + "-placeholder]")
    .forEach((element) => {
      element.placeholder = element.dataset[lang + "Placeholder"];
    });

  showNotification(
    lang === "en" ? "Language switched to English" : "Ede ti yipada si Yoruba",
    "success"
  );
}

// Mobile menu toggle
function toggleMobileMenu() {
  const mobileMenu = document.getElementById("mobileMenu");
  mobileMenu.classList.toggle("active");
}

// Product filtering
function filterProducts(category) {
  const products = document.querySelectorAll(".product-card");
  const filterBtns = document.querySelectorAll(".filter-btn");

  // Update active filter button
  filterBtns.forEach((btn) => btn.classList.remove("active"));
  document.querySelector(`[data-filter="${category}"]`).classList.add("active");

  // Show/hide products
  products.forEach((product) => {
    if (category === "all" || product.dataset.category === category) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });
}

// Gallery filtering
function filterGallery(category) {
  const items = document.querySelectorAll(".gallery-item");
  const tabs = document.querySelectorAll(".gallery-tab");

  // Update active tab
  tabs.forEach((tab) => tab.classList.remove("active"));
  document
    .querySelector(`[data-gallery="${category}"]`)
    .classList.add("active");

  // Show/hide gallery items
  items.forEach((item) => {
    if (category === "all" || item.dataset.galleryCategory === category) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

// FAQ toggle
function toggleFAQ(question) {
  const faqItem = question.parentElement;
  const answer = faqItem.querySelector(".faq-answer");

  faqItem.classList.toggle("active");
  answer.classList.toggle("active");
}

// Cart functionality
function addToCart(id, name, price) {
  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: id,
      name: name,
      price: price,
      quantity: 1,
    });
  }

  updateCart();
  showNotification(`${name} added to cart!`, "success");
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  updateCart();
  showNotification("Item removed from cart", "info");
}

function updateQuantity(id, change) {
  const item = cart.find((item) => item.id === id);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(id);
    } else {
      updateCart();
    }
  }
}

function updateCart() {
  const cartCount = document.getElementById("cartCount");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  // Update cart count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  // Update cart items
  if (cart.length === 0) {
    cartItems.innerHTML =
      '<p style="text-align: center; color: #999; padding: 2rem;">Your cart is empty</p>';
    cartTotal.style.display = "none";
  } else {
    cartItems.innerHTML = cart
      .map(
        (item) => `
            <div class="cart-item">
              <div class="cart-item-image">🛒</div>
              <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₦${item.price.toLocaleString()}</div>
                <div class="quantity-controls">
                  <button class="qty-btn" onclick="updateQuantity('${
                    item.id
                  }', -1)">-</button>
                  <span>${item.quantity}</span>
                  <button class="qty-btn" onclick="updateQuantity('${
                    item.id
                  }', 1)">+</button>
                  <button class="qty-btn" onclick="removeFromCart('${
                    item.id
                  }')" style="margin-left: 1rem; background: #ff6b35; color: white;">×</button>
                </div>
              </div>
            </div>
          `
      )
      .join("");

    // Update total
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    cartTotal.innerHTML = `
            <h4>Total: ₦${total.toLocaleString()}</h4>
            <button class="checkout-btn" onclick="checkout()">Proceed to Checkout</button>
          `;
    cartTotal.style.display = "block";
  }
}

function toggleCart() {
  const cartSidebar = document.getElementById("cartSidebar");
  cartSidebar.classList.toggle("open");
}

function checkout() {
  if (cart.length === 0) {
    showNotification("Your cart is empty!", "error");
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const message = `Hello! I'd like to order:\n\n${cart
    .map(
      (item) =>
        `${item.name} x${item.quantity} - ₦${(
          item.price * item.quantity
        ).toLocaleString()}`
    )
    .join("\n")}\n\nTotal: ₦${total.toLocaleString()}`;

  const whatsappUrl = `https://wa.me/2348031234567?text=${encodeURIComponent(
    message
  )}`;
  window.open(whatsappUrl, "_blank");
}

// Service booking
function bookService(service) {
  showModal(`
          <h3>Book ${
            service.charAt(0).toUpperCase() + service.slice(1)
          } Service</h3>
          <p>Please contact us to book this service or get a quote.</p>
          <div style="margin-top: 2rem;">
            <button class="btn btn-primary" onclick="openWhatsApp()">Contact via WhatsApp</button>
            <button class="btn btn-secondary" onclick="closeModal()" style="margin-left: 1rem;">Close</button>
          </div>
        `);
}

function bookConsultation() {
  showModal(`
          <h3>Free Farm Consultation</h3>
          <p>Get expert advice on your farming needs. Our consultation covers:</p>
          <ul style="margin: 1rem 0; text-align: left;">
            <li>Farm planning and setup</li>
            <li>Bird selection and management</li>
            <li>Disease prevention strategies</li>
            <li>Feed optimization</li>
            <li>Profit maximization techniques</li>
          </ul>
          <div style="margin-top: 2rem;">
            <button class="btn btn-primary" onclick="openWhatsApp()">Book Now</button>
            <button class="btn btn-secondary" onclick="closeModal()" style="margin-left: 1rem;">Close</button>
          </div>
        `);
}

function quickOrder(product) {
  const message = `Hello! I'd like to make a quick order for ${product}. Please provide more details about availability and pricing.`;
  const whatsappUrl = `https://wa.me/2348031234567?text=${encodeURIComponent(
    message
  )}`;
  window.open(whatsappUrl, "_blank");
}

function viewProduct(product) {
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
  filterProducts(
    product.includes("rice")
      ? "food"
      : product.includes("catfish")
      ? "food"
      : product.includes("chips")
      ? "food"
      : "all"
  );
}

// Modal functions
function showModal(content) {
  document.getElementById("modalBody").innerHTML = content;
  document.getElementById("modal").style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// Notification system
function showNotification(message, type = "info") {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.className = `notification show ${type}`;

  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

// Form submissions
function submitContactForm(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);

  const message = `New Contact Form Submission:\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nService Interest: ${data.service}\nMessage: ${data.message}`;

  showNotification(
    "Thank you for your message! We will contact you soon.",
    "success"
  );
  event.target.reset();

  // Optionally send to WhatsApp
  setTimeout(() => {
    if (confirm("Would you like to send this message via WhatsApp as well?")) {
      const whatsappUrl = `https://wa.me/2348031234567?text=${encodeURIComponent(
        message
      )}`;
      window.open(whatsappUrl, "_blank");
    }
  }, 1000);
}

function subscribeNewsletter(event) {
  event.preventDefault();
  const email = event.target.querySelector('input[type="email"]').value;

  showNotification("Thank you for subscribing to our newsletter!", "success");
  event.target.reset();

  // Here you would typically send the email to your backend
  console.log("Newsletter subscription:", email);
}

// WhatsApp integration
function openWhatsApp() {
  const message =
    "Hello! I'm interested in your agricultural services. Can you please provide more information?";
  const whatsappUrl = `https://wa.me/2348031234567?text=${encodeURIComponent(
    message
  )}`;
  window.open(whatsappUrl, "_blank");
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Close mobile menu when clicking outside
document.addEventListener("click", function (event) {
  const mobileMenu = document.getElementById("mobileMenu");
  const menuBtn = document.querySelector(".mobile-menu-btn");

  if (!mobileMenu.contains(event.target) && !menuBtn.contains(event.target)) {
    mobileMenu.classList.remove("active");
  }
});

// Close modal when clicking outside
document.getElementById("modal").addEventListener("click", function (event) {
  if (event.target === this) {
    closeModal();
  }
});

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
  // Add fade-in animation to elements as they come into view
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
      }
    });
  }, observerOptions);

  // Observe all service cards and product cards
  document
    .querySelectorAll(
      ".service-card, .product-card, .team-member, .testimonial-card"
    )
    .forEach((el) => {
      observer.observe(el);
    });

  // Initialize cart
  updateCart();

  // Welcome message
  setTimeout(() => {
    showNotification("Welcome to A & G Farms! 🌾", "success");
  }, 1000);
});

// Keyboard shortcuts
document.addEventListener("keydown", function (event) {
  // Press 'C' to open cart
  if (event.key === "c" || event.key === "C") {
    if (!event.target.matches("input, textarea")) {
      toggleCart();
    }
  }

  // Press 'Escape' to close modal or cart
  if (event.key === "Escape") {
    closeModal();
    document.getElementById("cartSidebar").classList.remove("open");
  }
});

// Add to cart with Enter key on product cards
document.querySelectorAll(".product-card").forEach((card) => {
  card.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      const addButton = this.querySelector(".btn-primary");
      if (addButton) {
        addButton.click();
      }
    }
  });

  // Make product cards focusable
  card.setAttribute("tabindex", "0");
});
