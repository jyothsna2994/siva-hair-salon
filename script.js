// ========================================
// SIVA HAIR SALON - JAVASCRIPT
// ========================================


// 1. MOBILE MENU
// ========================================

const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
}


// 2. CLOSE MOBILE MENU AFTER CLICKING A LINK
// ========================================

const navItems = document.querySelectorAll(".nav-links a");

navItems.forEach((item) => {
    item.addEventListener("click", () => {
        navLinks.classList.remove("active");
    });
});


// 3. SMOOTH SCROLLING
// ========================================

document.querySelectorAll('a[href^="#"]').forEach((link) => {

    link.addEventListener("click", function (event) {

        const targetId = this.getAttribute("href");

        if (targetId === "#") return;

        const target = document.querySelector(targetId);

        if (target) {
            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth"
            });
        }
    });

});


// 4. APPOINTMENT FORM
// ========================================

const bookingForm = document.querySelector("#bookingForm");
const bookingMessage = document.querySelector("#bookingMessage");

if (bookingForm) {

   bookingForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const name = document.querySelector("#name").value.trim();
    const phone = document.querySelector("#phone").value.trim();
    const service = document.querySelector("#service").value;
    const date = document.querySelector("#date").value;
    const time = document.querySelector("#time").value;


    // Check required fields
    if (
        name === "" ||
        phone === "" ||
        service === "" ||
        date === "" ||
        time === ""
    ) {

        bookingMessage.textContent =
            "Please fill in all required fields.";

        bookingMessage.className = "booking-error";

        return;
    }


    // Phone number validation
    const phonePattern = /^[6-9]\d{9}$/;

    if (!phonePattern.test(phone)) {

        bookingMessage.textContent =
            "Please enter a valid 10-digit Indian mobile number.";

        bookingMessage.className = "booking-error";

        return;
    }


    // Show booking status
    bookingMessage.textContent =
        "Booking your appointment...";

    bookingMessage.className = "booking-success";


    try {

        // Send appointment to backend
        const response = await fetch("https://siva-hair-style.onrender.com/api/appointments", 
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    phone: phone,
                    service: service,
                    date: date,
                    time: time
                })
            }
        );


        const data = await response.json();


        // Backend success
        if (response.ok) {

            bookingMessage.textContent =
                `Thank you ${name}! Your appointment request for ${service} on ${date} at ${time} has been received.`;

            bookingMessage.className = "booking-success";

            bookingForm.reset();

        } else {

            bookingMessage.textContent =
                data.message || "Something went wrong.";

            bookingMessage.className = "booking-error";
        }


    } catch (error) {

        console.error("Booking error:", error);

        bookingMessage.textContent =
            "Unable to connect to the salon server.";

        bookingMessage.className = "booking-error";
    }

});

}


// 5. SET MINIMUM DATE FOR BOOKING
// ========================================

const dateInput = document.querySelector("#date");

if (dateInput) {

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const todayDate = `${year}-${month}-${day}`;

    dateInput.min = todayDate;
}


// 6. CURRENT YEAR IN FOOTER
// ========================================

const yearElement = document.querySelector("#year");

if (yearElement) {

    yearElement.textContent = new Date().getFullYear();

}


// 7. SCROLL REVEAL ANIMATION
// ========================================

const revealElements = document.querySelectorAll(
    ".service-card, .about-content, .gallery-item, .contact-box"
);

const observer = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

                observer.unobserve(entry.target);
            }

        });

    },
    {
        threshold: 0.15
    }
);


revealElements.forEach((element) => {

    element.classList.add("reveal");

    observer.observe(element);

});