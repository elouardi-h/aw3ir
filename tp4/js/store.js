var contactStore = (function () {
  // Charger la liste depuis localStorage (ou tableau vide)
  let contactList = [];
  try {
    const saved = localStorage.getItem("contactList");
    contactList = saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.warn("localStorage invalide, réinitialisation", e);
    contactList = [];
  }

  function persist() {
    localStorage.setItem("contactList", JSON.stringify(contactList));
  }

  return {
    add: function (_name, _firstname, _date, _adress, _mail) {
      // Normaliser un minimum (trim)
      const contact = {
        name: String(_name || "").trim(),
        firstname: String(_firstname || "").trim(),
        date: String(_date || "").trim(),
        adress: String(_adress || "").trim(),
        mail: String(_mail || "").trim(),
      };
      contactList.push(contact);
      persist();
      return contactList;
    },

    getList: function () {
      return contactList.slice(); // copie défensive
    },

    reset: function () {
      contactList = [];
      localStorage.removeItem("contactList");
      return contactList;
    },
  };
})();
