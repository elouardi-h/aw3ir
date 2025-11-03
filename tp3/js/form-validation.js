function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

window.onload = function () {

  
  const birthdayInput = document.getElementById("birthday");
  birthdayInput.max = new Date().toISOString().split("T")[0];

  const form = document.querySelector("#myForm");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const lastname = document.querySelector("#lastname").value.trim();
    const firstname = document.querySelector("#firstname").value.trim();
    const birthday = document.querySelector("#birthday").value.trim();
    const address = document.querySelector("#address").value.trim();
    const email = document.querySelector("#email").value.trim();

    let isValid = true;
    let errorMsg = "";

    
    if (!lastname || !firstname || !birthday || !address || !email) {
      isValid = false;
      errorMsg += "Tous les champs sont obligatoires.\n";
    }

   
    function checkLength(field, name) {
      if (field && field.length < 5) {
        isValid = false;
        errorMsg += `${name} doit contenir au moins 5 caractères.\n`;
      }
    }

    checkLength(lastname, "Nom");
    checkLength(firstname, "Prénom");
    checkLength(address, "Adresse");

   
    if (email && !validateEmail(email)) {
      isValid = false;
      errorMsg += "Email invalide.\n";
    }

   
    if (birthday) {
      const d = new Date(birthday);
      const dateVal = d.getTime();
      const now = Date.now();

      if (isNaN(dateVal)) {
        isValid = false;
        errorMsg += "Date de naissance invalide.\n";
      } else if (dateVal > now) {
        isValid = false;
        errorMsg += "La date de naissance ne doit pas être dans le futur.\n";
      }
    }

    
    if (!isValid) {
      const title = document.querySelector(".modal-title");
      title.textContent = "Erreur dans le formulaire";
      title.style.color = "red";   // ✅ Option 5

      document.querySelector(".modal-body").textContent = errorMsg;

      var myModal = new bootstrap.Modal(document.getElementById("myModal"));
      myModal.show();
      return;
    }

    
    showGoogleMap(address);
  });
};



function showGoogleMap(address) {

  const title = document.querySelector(".modal-title");
  title.textContent = "Localisation (Google Maps)";
  title.style.color = "#0d6efd";  

  const encoded = encodeURIComponent(address);

  const urlImg = `https://maps.googleapis.com/maps/api/staticmap?markers=${encoded}&zoom=14&size=400x300&scale=2&key=AIzaSyAkmvI9DazzG9p77IShsz_Di7-5Qn7zkcg`;

  const mapHTML = `
    <a href="https://www.google.com/maps?q=${encoded}" target="_blank">
      <img src="${urlImg}" alt="Carte - ${address}" style="width:100%;max-width:350px;"/>
    </a>
  `;

  document.querySelector(".modal-body").innerHTML = mapHTML;

  var myModal = new bootstrap.Modal(document.getElementById("myModal"));
  myModal.show();
}
