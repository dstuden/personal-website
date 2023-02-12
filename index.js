fetch("https://catfact.ninja/fact?max_length=100")
  .then((response) => response.json())
  .then((data) => {
    document.querySelector("#cat-content").innerHTML = data.fact;
  });

const copy = (param) => {
  if (param === "discord") navigator.clipboard.writeText("David&#5419");
};
