let receivedList = JSON.parse(localStorage.getItem("listOfDate"));
const container = document.getElementById("container");

function createList() {
  container.style.display = "flex";
  receivedList.forEach((element) => {
    const btn = document.createElement("div");
    btn.classList.add("btn");
    const p = document.createElement("p");
    p.innerHTML = `${element["date"]} (Sample No:  ${element["sampleNo"]})`;
    btn.appendChild(p);
    btn.addEventListener("click",function(){
      localStorage.setItem("element", JSON.stringify(element));
      window.location.href = "data.html";
    })
    container.appendChild(btn);
  });
}

createList();
