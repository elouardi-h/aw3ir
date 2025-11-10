
function calcNbChar(id) {
  const input = document.querySelector(`#${id}`);
  const countElem = input.parentElement.querySelector("[data-count]");
  if (countElem) {
    countElem.textContent = input.value.length + " car.";
  }
}

/***************************************************
 *   Afficher la liste des contacts
 **************************************************/
function displayContactList() {
  const tbody = document.querySelector("table tbody");
  const listString = localStorage.getItem("contactList");
  const list = listString ? JSON.parse(listString) : [];

  tbody.innerHTML = "";

  for (const c of list) {
    tbody.innerHTML += `
      <tr>
        <td>${c.name}</td>
        <td>${c.firstname}</td>
        <td>${c.date}</td>
        <td>${c.adress}</td>
        <td><a href="mailto:${c.mail}">${c.mail}</a></td>
      </tr>
    `;
  }

  document.querySelector("#nb").textContent = list.length;
}

function showError(id, message) {
  let el = document.querySelector(`#${id}`);
  let error = el.parentElement.querySelector(".error");

  if (!error) {
    error = document.createElement("div");
    error.className = "error";
    error.style.color = "red";
    error.style.fontSize = "13px";
    el.parentElement.appendChild(error);
  }

  error.textContent = message;
}


function clearError(id) {
  let el = document.querySelector(`#${id}`);
  let error = el.parentElement.querySelector(".error");
  if (error) error.remove();
}


function validateForm({ name, firstname, birth, adresse, mail }) {
  let ok = true;

  /** NOM  */
  clearError("name");
  if (name.trim().length < 5) {
    showError("name", "Le nom doit contenir au moins 5 caractères.");
    ok = false;
  }

  /** PRÉNOM */
  clearError("firstname");
  if (firstname.trim().length < 5) {
    showError("firstname", "Le prénom doit contenir au moins 5 caractères.");
    ok = false;
  }

  /** DATE DE NAISSANCE */
  clearError("birth");
  const today = new Date().toISOString().split("T")[0];
  if (!birth || birth > today) {
    showError("birth", "La date ne peut pas être dans le futur.");
    ok = false;
  }

  /** ADRESSE */
  clearError("adresse");
  if (adresse.trim().length < 5) {
    showError("adresse", "L’adresse doit contenir au moins 5 caractères.");
    ok = false;
  }

  /** EMAIL */
  clearError("mail");
  const regexMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexMail.test(mail)) {
    showError("mail", "Format email invalide.");
    ok = false;
  }

  return ok;
}


/***************************************************
 *  INITIALISATION
 **************************************************/
window.onload = function () {
  console.log("✅ DOM ready !");
  displayContactList();

  /* Soumission du formulaire */
  document.querySelector("#myForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.querySelector("#name").value;
    const firstname = document.querySelector("#firstname").value;
    const birth = document.querySelector("#birth").value;
    const adresse = document.querySelector("#adresse").value;
    const mail = document.querySelector("#mail").value;

    /************* Validation *************/
    if (!validateForm({ name, firstname, birth, adresse, mail })) {
      console.log("⛔ Form invalid");
      return;
    }

    /************* Ajout *************/
    contactStore.add(name, firstname, birth, adresse, mail);

    displayContactList();
    console.log("✅ Contact ajouté !");
  });

  /* GPS */
  document.querySelector("#gps").addEventListener("click", function (event) {
    event.preventDefault();
    console.log("📍 GPS demandée …");
    getLocation();
  });

  /* Reset */
  document.querySelector("#reset").addEventListener("click", function (event) {
    event.preventDefault();
    contactStore.reset();
    displayContactList();
    console.log("🗑 Données effacées");
  });
};
