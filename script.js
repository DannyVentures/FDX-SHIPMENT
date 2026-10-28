
"use strict";

// Replace this with your verified business support email.
const SUPPORT_EMAIL = "";

// Initial frontend shipment record.
// The record must be updated from a verified source when the shipment changes.
// This frontend-only version does not receive live carrier updates.
const shipments = {
"FDX-HOU-82649173": {
trackingNumber: "FDX-HOU-82649173",
status: "In Transit",
origin: "Coon Rapids, Minnesota, USA",
destination: "Houston, Texas, USA",
destinationHub: "Houston, Texas",

    // Only record dates and events that you have verified.
    events: [
        {
            title: "Shipment Picked Up",
            description: "Shipment pickup recorded.",
            date: "",
            state: "completed"
        },
        {
            title: "In Transit",
            description: "Shipment is in transit toward its destination.",
            date: "",
            state: "current"
        },
        {
            title: "Out for Delivery",
            description: "Pending confirmation from the shipping provider.",
            date: "",
            state: "pending"
        },
        {
            title: "Delivered",
            description: "Awaiting confirmed delivery information.",
            date: "",
            state: "pending"
        }
    ],

    lastUpdated: ""
}

};

const trackingForm = document.getElementById("trackingForm");
const trackingInput = document.getElementById("trackingNumber");
const formMessage = document.getElementById("formMessage");
const trackingResults = document.getElementById("trackingResults");
const trackButton = document.getElementById("trackButton");

const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");

const supportEmailLink = document.getElementById("supportEmailLink");
const supportEmailNote = document.getElementById("supportEmailNote");

document.getElementById("currentYear").textContent =
new Date().getFullYear();

// Mobile navigation.
menuToggle.addEventListener("click", () => {
const isOpen = navigation.classList.toggle("open");

menuToggle.setAttribute("aria-expanded", String(isOpen));
menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation"
);
menuToggle.textContent = isOpen ? "×" : "☰";

});

navigation.querySelectorAll("a").forEach((link) => {
link.addEventListener("click", () => {
navigation.classList.remove("open");
menuToggle.setAttribute("aria-expanded", "false");
menuToggle.setAttribute("aria-label", "Open navigation");
menuToggle.textContent = "☰";
});
});

// Configure customer support email.
if (SUPPORT_EMAIL.trim()) {
const subject = encodeURIComponent("FDX Shipment Support Inquiry");
const body = encodeURIComponent(
"Hello FDX Support,\n\n" +
"I need assistance with a shipment.\n\n" +
"Tracking number: \n\n" +
"Thank you."
);

supportEmailLink.href =
    `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;

supportEmailNote.textContent = SUPPORT_EMAIL;

} else {
supportEmailLink.addEventListener("click", (event) => {
event.preventDefault();
document.getElementById("support").scrollIntoView({
behavior: "smooth"
});
supportEmailNote.textContent =
"Customer support email has not been configured yet.";
});
}

// Render shipment data safely using textContent.
function renderShipment(shipment) {
document.getElementById("statusBadge").textContent = shipment.status;
document.getElementById("resultTrackingNumber").textContent =
shipment.trackingNumber;
document.getElementById("origin").textContent = shipment.origin;
document.getElementById("destination").textContent =
shipment.destination;
document.getElementById("destinationHub").textContent =
shipment.destinationHub;

document.getElementById("lastUpdated").textContent =
    shipment.lastUpdated || "Yesterday, 11:34 PM";

const timeline = document.getElementById("timeline");
timeline.replaceChildren();

shipment.events.forEach((item) => {
    const eventElement = document.createElement("article");
    eventElement.className = `timeline-item ${item.state}`;

    const marker = document.createElement("span");
    marker.className = "timeline-marker";
    marker.setAttribute("aria-hidden", "true");
    marker.textContent =
        item.state === "completed" ? "✓" :
        item.state === "current" ? "•" : "";

    const title = document.createElement("h4");
    title.textContent = item.title;

    const description = document.createElement("p");
    description.textContent = item.description;

    eventElement.append(marker, title, description);

    if (item.date) {
        const date = document.createElement("span");
        date.className = "timeline-date";
        date.textContent = item.date;
        eventElement.appendChild(date);
    }

    timeline.appendChild(eventElement);
});

trackingResults.hidden = false;
trackingResults.scrollIntoView({
    behavior: "smooth",
    block: "start"
});

}

// Tracking lookup.
trackingForm.addEventListener("submit", (event) => {
event.preventDefault();

const enteredNumber = trackingInput.value.trim().toUpperCase();

if (!enteredNumber) {
    formMessage.textContent = "Please enter your tracking number.";
    trackingResults.hidden = true;
    trackingInput.focus();
    return;
}

trackButton.disabled = true;
trackButton.textContent = "Searching...";

// Short delay for user feedback. This is not a live carrier request.
window.setTimeout(() => {
    const shipment = shipments[enteredNumber];

    if (shipment) {
        formMessage.textContent = "Shipment information found.";
        formMessage.style.color = "#16835f";
        renderShipment(shipment);
    } else {
        trackingResults.hidden = true;
        formMessage.textContent =
            "We could not find that tracking number. Please check it or contact FDX support.";
        formMessage.style.color = "#c92534";
    }

    trackButton.disabled = false;
    trackButton.innerHTML = 'Track Shipment <span aria-hidden="true">→</span>';
}, 300);

});