// Registan Travel - booking page logic (live price + validation)
const form = document.getElementById("booking-form");

if (form) {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const tourSelect = document.getElementById("tour");
  const travellersInput = document.getElementById("travellers");
  const dateInput = document.getElementById("date");
  const totalBox = document.getElementById("total");
  const messageBox = document.getElementById("form-message");

  // no past dates
  dateInput.min = new Date().toISOString().split("T")[0];

  // Returns the price details, or null if the number of travellers is not valid
  function calculate() {
    const price = Number(tourSelect.selectedOptions[0].dataset.price);
    const people = parseInt(travellersInput.value, 10);

    if (Number.isNaN(people) || people < 1 || people > 12) {
      return null;
    }

    const subtotal = price * people;
    const discount = people >= 5 ? 0.1 : 0; // 10% off for groups of 5+
    const total = subtotal * (1 - discount);
    return { price, people, subtotal, discount, total };
  }

  function totalText() {
    const r = calculate();
    if (!r) {
      return "Please enter 1 to 12 travellers.";
    }
    let text = "Total: " + r.people + " × " + r.price + " USD = " + r.subtotal + " USD";
    if (r.discount > 0) {
      text += " − 10% group discount = " + r.total + " USD";
    }
    return text;
  }

  function updateTotal() {
    totalBox.textContent = totalText();
  }

  function showMessage(type, text) {
    messageBox.className = "message " + type;
    messageBox.textContent = text;
  }

  tourSelect.addEventListener("change", updateTotal);
  travellersInput.addEventListener("input", updateTotal);
  updateTotal();

  // remove the red highlight as soon as the user edits the field
  [nameInput, emailInput, dateInput].forEach(function (field) {
    field.addEventListener("input", function () {
      field.classList.remove("invalid");
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // no page reload

    const errors = [];
    [nameInput, emailInput, dateInput].forEach(function (f) {
      f.classList.remove("invalid");
    });

    if (nameInput.value.trim() === "") {
      errors.push("Please enter your name.");
      nameInput.classList.add("invalid");
    }
    if (!emailInput.value.includes("@")) {
      errors.push("Please enter a valid email (it must contain @).");
      emailInput.classList.add("invalid");
    }
    if (dateInput.value === "") {
      errors.push("Please choose a date.");
      dateInput.classList.add("invalid");
    }
    if (!calculate()) {
      errors.push("Number of travellers must be between 1 and 12.");
    }

    if (errors.length > 0) {
      showMessage("error", errors.join(" "));
      return;
    }

    showMessage(
      "success",
      "Thank you, " + nameInput.value.trim() + "! Your request for " +
        tourSelect.selectedOptions[0].textContent.replace(/ \(.*\)$/, "") +
        " on " + dateInput.value + " is confirmed. " + totalText()
    );
  });
}
