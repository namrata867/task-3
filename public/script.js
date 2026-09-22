// small helper used by all the pages to show a message
function showMessage(text, type) {
  const box = document.getElementById("message");
  box.textContent = text;
  box.className = "message " + type;
}
