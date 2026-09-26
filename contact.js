const form = document.querySelector(".form");

const errors = new Map();

function createError(elem, message) {
    const error = document.createElement("div");
    error.classList.add("error-message");
    error.textContent = message;
    error.id = `${elem.id}-error`;
    elem.after(error);

    elem.setAttribute("aria-describedby", error.id);
    elem.setAttribute("aria-invalid", "true");
    elem.classList.add("invalid");
    errors.set(elem, error);
}

function validate(ids) {
    for (const id of ids) {
        const elem = document.getElementById(id);
        if (errors.get(elem)) continue;

        if (elem.type === "date") {
            if (elem.value) continue;
            createError(elem, "Please select a date.");
            continue;
        }

        if (elem.type === "email") {
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (regex.test(elem.value)) continue;

            createError(elem, "Use an email format (someone@something.com).");

            continue;
        }

        if (
            id === "name" &&
            (elem.value.trim().length > 20 || elem.value.trim().length < 3)
        ) {
            createError(elem, "Enter a name between 3 and 20 characters.");
            continue;
        }

        if (
            id === "details" &&
            (elem.value.trim().length > 200 || elem.value.trim().length < 1)
        ) {
            createError(elem, "Enter details between 1 and 200 characters.");
            continue;
        }
    }
    return !errors.size;
}

let successMessage;

form.addEventListener("submit", (e) => {
    const error = errors.get(e.target);
    if (error) {
        errors.delete(e.target);
        error.remove();
        e.target.removeAttribute("aria-describedby");
        e.target.removeAttribute("aria-invalid");
    }
    if (successMessage) successMessage.remove();

    e.preventDefault();
    const valid = validate(["name", "email", "pickup-date", "details"]);

    if (!valid) {
        const error = document.createElement("div");
        error.textContent = "You have errors in your submission.";
        form.after(error);
        errors.set(form, error);
        return;
    }

    const message = document.createElement("div");
    message.textContent = "Submitted successfully! Thank you for your inquiry!";
    form.after(message);
    successMessage = message;
});

const textInputs = form.querySelectorAll("input");
const textAreas = form.querySelectorAll("textarea");
const inputs = [...textInputs, ...textAreas];

inputs.forEach((input) =>
    input.addEventListener("input", (e) => {
        const error = errors.get(e.target);
        if (!error) return;
        errors.delete(e.target);
        error.remove();
        e.target.removeAttribute("aria-describedby");
        e.target.removeAttribute("aria-invalid");
        e.target.classList.remove("invalid");
    }),
);
