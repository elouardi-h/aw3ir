window.addEventListener("load", () => {
  const paramsString = document.location.search;
  const searchParams = new URLSearchParams(paramsString);

  for (const [key, value] of searchParams) {
    const element = document.getElementById(key);
    if (!element) continue;

    element.textContent = value;

    if (key === "address") {
      const encodedAddress = encodeURIComponent(value);
      element.href = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    } else if (key === "email") {
      const mailBody = encodeURIComponent("What's up?");
      element.href = `mailto:${value}?subject=Hello!&body=${mailBody}`;
    }
  }
});

