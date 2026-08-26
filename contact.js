
// ==========================================

// BENNIEB ENTERPRISE - CONTACT PAGE JAVASCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // ------------------------------------------
    // 1. CONTACT FORM
    // ------------------------------------------

    const contactForm = document.querySelector(".contact-form form");

    if (contactForm) {

        contactForm.addEventListener("submit", function (event) {

            // Stop the form from refreshing the page
            event.preventDefault();

            // Get form values
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const subject = document.getElementById("subject").value;
            const message = document.getElementById("message").value.trim();

            // ------------------------------------------
            // 2. VALIDATION
            // ------------------------------------------

            if (name === "") {
                alert("Please enter your full name.");
                document.getElementById("name").focus();
                return;
            }

            if (email === "") {
                alert("Please enter your email address.");
                document.getElementById("email").focus();
                return;
            }

            // Check email format
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {
                alert("Please enter a valid email address.");
                document.getElementById("email").focus();
                return;
            }

            if (message === "") {
                alert("Please enter your message.");
                document.getElementById("message").focus();
                return;
            }

            // ------------------------------------------
            // 3. CREATE WHATSAPP MESSAGE
            // ------------------------------------------

            const whatsappMessage =
                "Hello Bennieb Enterprise,%0A%0A" +
                "I would like to make an inquiry.%0A%0A" +
                "Name: " + encodeURIComponent(name) + "%0A" +
                "Email: " + encodeURIComponent(email) + "%0A" +
                "Phone: " + encodeURIComponent(phone) + "%0A" +
                "Subject: " + encodeURIComponent(subject || "General Inquiry") + "%0A%0A" +
                "Message:%0A" +
                encodeURIComponent(message);

            // Bennieb Enterprise WhatsApp number
            const whatsappURL =
                "https://wa.me/233204410405?text=" + whatsappMessage;

            // ------------------------------------------
            // 4. SUCCESS MESSAGE
            // ------------------------------------------

            const successMessage = document.createElement("div");

            successMessage.className = "form-success";

            successMessage.innerHTML = `
                <strong>Thank you, ${escapeHTML(name)}!</strong>
                <p>Your message has been prepared successfully.</p>
                <p>Click below to send your inquiry through WhatsApp.</p>
                <a href="${whatsappURL}" target="_blank" rel="noopener noreferrer">
                    💬 Send via WhatsApp
                </a>
            `;

            // Remove previous success message
            const oldMessage =
                contactForm.querySelector(".form-success");

            if (oldMessage) {
                oldMessage.remove();
            }

            // Add success message
            contactForm.prepend(successMessage);

            // Reset form
            contactForm.reset();

            // Scroll to success message
            successMessage.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        });
    }


    // ------------------------------------------
    // 5. UPDATE COPYRIGHT YEAR
    // ------------------------------------------

    const yearElement = document.getElementById("year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    // ------------------------------------------
    // 6. PHONE NUMBER VALIDATION
    // ------------------------------------------

    const phoneInput = document.getElementById("phone");

    if (phoneInput) {

        phoneInput.addEventListener("input", function () {

            // Allow numbers, spaces, + and -
            this.value = this.value.replace(
                /[^0-9+\-\s]/g,
                ""
            );
        });
    }


    // ------------------------------------------
    // 7. CHARACTER COUNTER FOR MESSAGE
    // ------------------------------------------

    const messageInput = document.getElementById("message");

    if (messageInput) {

        const counter = document.createElement("small");

        counter.className = "message-counter";

        counter.textContent = "0 characters";

        messageInput.parentNode.appendChild(counter);

        messageInput.addEventListener("input", function () {

            const count = this.value.length;

            counter.textContent =
                count + (count === 1 ? " character" : " characters");
        });
    }

});


// ==========================================
// 8. MOBILE MENU
// ==========================================

function toggleMenu() {

    const nav = document.querySelector(".nav-main");

    if (nav) {
        nav.classList.toggle("active");
    }
}


// ==========================================
// 9. ESCAPE HTML
// ==========================================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}

