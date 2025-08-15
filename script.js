class Sieve {
  constructor(mm, no, reserved, passing) {
    this.mm = mm;
    this.no = no;
    this.resrved = reserved;
    this.passing = passing;
  }
}

class Data {
  constructor(weightOfSample, list) {
    this.weightOfSample = weightOfSample;
    this.list = list;
  }
}

var extraction = [
  new Sieve(19, "3/4", 0, ""),
  new Sieve(9, "3/8", 0, ""),
  new Sieve(4.75, "4", 0, ""),
  new Sieve(2.36, "8", 0, ""),
  new Sieve(0.6, "30", 0, ""),
  new Sieve(0.3, "50", 0, ""),
  new Sieve(0.15, "100", 0, ""),
  new Sieve(0.075, "200", 0, ""),
];

var size1 = [
  new Sieve(12.5, "1/2", 0, ""),
  new Sieve(9, "3/8", 0, ""),
  new Sieve(4.75, "4", 0, ""),
];

var size2 = [
  new Sieve(19, "3/4", 0, ""),
  new Sieve(12.5, "1/2", 0, ""),
  new Sieve(9, "3/8", 0, ""),
  new Sieve(4.75, "4", 0, ""),
];

var sand = [
  new Sieve(4.75, "4", 0, ""),
  new Sieve(2.36, "8", 0, ""),
  new Sieve(0.6, "30", 0, ""),
  new Sieve(0.3, "50", 0, ""),
  new Sieve(0.15, "100", 0, ""),
  new Sieve(0.075, "200", 0, ""),
];

const container = document.getElementById("container");
const sampleWeight = document.getElementById("sample");
const headTable = document.getElementById("headTable");
const mySelect = document.getElementById("mySpinner");
const userEmail = localStorage.getItem("email");
const overlay = document.getElementById("overlay");
const closeDialog = document.getElementById("closeDialog");
const body = document.getElementById("body");
const dialog = document.getElementById("dialog");
let email = localStorage.getItem("email")

const firebaseConfig = {
  apiKey: "AIzaSyB2A4sAeKJIpoU2uJRq0qELk4l2u1LisS0",
  authDomain: "asphalt-6a221.firebaseapp.com",
  projectId: "asphalt-6a221",
  storageBucket: "asphalt-6a221.firebasestorage.app",
  messagingSenderId: "289926018846",
  appId: "1:289926018846:web:06b4f182e330c0046efb0f",
  measurementId: "G-3CN6ZJ2B48",
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();
const db = firebase.firestore();

let content;
let saveButton;
var sampleNo = 1;

function createTableOfExtrac(list) {
  content = globalSieve();
  list.forEach((element, index) => {
    const hr = document.createElement("hr");
    content.appendChild(rowTable(element.mm, element.no, index, list));
    if (index < list.length - 1) {
      content.appendChild(hr);
    }
  });

  // زر الحفظ
  saveButton = document.createElement("div");
  saveButton.classList.add("btn");
  saveButton.innerHTML = "حفظ";

  saveButton.addEventListener("click", function () {
    const sampleWeightInput = document.getElementById("sample");
    const sampleWeight = sampleWeightInput.value.trim();
    const selectedText = mySelect.options[mySelect.selectedIndex].text;
    const date = getDate();
    fetchDataFunction(selectedText, date, sampleWeight, list);
  });

  container.appendChild(content);
  container.appendChild(saveButton);
}


function rowTable(sieveMM, sieveNo, index, list) {
  const rowTable = document.createElement("div");
  rowTable.classList.add("rowTable");
  const titleSieve = document.createElement("titleSieve");
  titleSieve.classList.add("titleSieve");
  const mm = document.createElement("div");
  const no = document.createElement("div");
  mm.innerHTML = sieveMM;
  no.innerHTML = sieveNo;
  titleSieve.appendChild(mm);
  titleSieve.appendChild(no);
  const input = document.createElement("input");
  input.classList.add("resrved");

  const passing = document.createElement("div");
  passing.classList.add("passing");
  input.addEventListener("input", function () {
    if (sampleWeight.value != "") {
      passing.innerHTML = getPassingForOneSieve(input.value);
      list[index].resrved = input.value;
      list[index].passing = getPassingForOneSieve(input.value);
    }
  });

  sampleWeight.addEventListener("input", function () {
    if (sampleWeight.value != "") {
      passing.innerHTML = "";
      if (input.value != "") {
        passing.innerHTML = getPassingForOneSieve(input.value);
        list[index].resrved = input.value;
        list[index].passing = getPassingForOneSieve(input.value);
        console.log(list[index].passing);
      }
    }else{
      passing.innerHTML = "";
    }
  });
  rowTable.appendChild(titleSieve);
  rowTable.appendChild(input);
  rowTable.appendChild(passing);

  return rowTable;
}

function getPassingForOneSieve(resrved) {
  const value = sampleWeight.value.trim();
  if (value !== "" && !isNaN(value)) {
    var passing = Number(value) - Number(resrved);
    var percentPass = ((passing / value) * 100).toFixed(2);
    return `${percentPass} %`;
  }
}

function globalSieve() {
  headTable.style.display = "flex";
  const content = document.createElement("div");
  content.classList.add("contnetTable");
  return content;
}

createTableOfExtrac(extraction);

mySelect.addEventListener("change", function () {
  const selectedValue = this.value;

  if (content) {
    content.innerHTML = "";
    saveButton.innerHTML = "";
    content.style.display = "none";
    saveButton.style.display = "none";
  }

  let list;
  switch (selectedValue) {
    case "item1":
      list = extraction;
      break;
    case "item2":
      list = size1;
      break;
    case "item3":
      list = size2;
      break;
    case "item4":
      list = sand;
      break;
    default:
      return;
  }

  createTableOfExtrac(list);
});

function getDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}
//=======
overlay.addEventListener("click", (event) => {
  if (event.target === overlay) {
    overlay.style.display = "none";
  }
});

function createDialog(text = "لا يمكن ترك اي حقل فارغ") {
  const h3 = document.createElement("h3");
  h3.innerHTML = "خطأ";
  dialog.appendChild(h3);
  //=============
  const p = document.createElement("p");
  p.classList.add("empty");
  p.innerHTML = text;
  dialog.appendChild(p);

  const btnGetData = document.createElement("div");
  btnGetData.classList.add("btn");
  btnGetData.innerHTML = "موافق";

  btnGetData.addEventListener("click", function () {
    overlay.style.display = "none";
  });

  dialog.appendChild(btnGetData);
}

function fetchDataFunction(selectedText, date, sampleWeight, list) {
  db.collection("test")
    .where("selectedText", "==", selectedText)
    .where("date", "==", date)
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        var number = querySnapshot.size;
        sampleNo = number + 1;
      } else {
        sampleNo = 1;
        console.log("لا توجد بيانات");
      }
      addData(sampleWeight, list, selectedText, date);
    })
    .catch((error) => {
      console.error("خطأ في جلب البيانات:", error);
    });
}

function addData(sampleWeight, list, selectedText, date) {
  if (!sampleWeight) {
    createDialog();
    overlay.style.display = "flex";
    return;
  }

  dialog.innerHTML = `
        <div class="loader"></div>
        <p>جاري الحفظ...</p>
      `;
  overlay.style.display = "flex";

  const plainList = list.map((item) => ({
    mm: item.mm,
    no: item.no,
    resrved: item.resrved,
    passing: item.passing,
  }));
  db.collection("test")
    .add({
      selectedText: selectedText,
      date: date,
      weight: sampleWeight,
      sampleNo: sampleNo,
      list: plainList,
      email:email
    })
    .then(() => {
      overlay.style.display = "none";
      console.log("تم الحفظ بنجاح");
    })
    .catch((error) => {
      overlay.style.display = "none";
      console.error("حصل خطأ أثناء الحفظ:", error);
    });
}
