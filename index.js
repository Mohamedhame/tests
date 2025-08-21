// Firebase
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
const auth = firebase.auth();

const test = document.getElementById("test");
const fetchData = document.getElementById("get");
const container = document.getElementById("container");
const container2 = document.getElementById("container2");
const login = document.getElementById("login");
const logout = document.getElementById("logout");
const overlay = document.getElementById("overlay");
const body = document.getElementById("body");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const dialog = document.getElementById("dialog");

var listOfData = [];
var listOfDate = [];
var isEmpty = false;
//=============
const db = firebase.firestore();

togglePassword.addEventListener("click", () => {
  const type =
    passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);

  togglePassword.textContent = type === "password" ? "👁" : "🙈";
});
//==================
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    db.collection("users")
      .where("email", "==", user.email)
      .where("isEdit", "==", true)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          localStorage.setItem("email", user.email);
          test.style.display = "block";
        }
      })
      .catch((error) => {
        console.error("خطأ في جلب البيانات:", error);
      });

    container.style.display = "flex";
    container2.style.display = "none";
  } else {
    container.style.display = "none";
    container2.style.display = "flex";
  }
});
//==================
login.addEventListener("click", function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    overlay.style.display = "flex";
    return;
  }

  auth
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      container2.style.display = "none";
      container.style.display = "flex";
      alert("تم تسجيل الدخول بنجاح");
    })
    .catch((error) => {
      //  alert("خطأ: " + error.message);
      body.innerHTML = error.message;
      overlay.style.display = "flex";
    });
});
// ==================
logout.addEventListener("click", function () {
  auth
    .signOut()
    .then(() => {
      container.style.display = "none";
      container2.style.display = "flex";
    })
    .catch((error) => {
      console.error("حصل خطأ أثناء تسجيل الخروج:", error);
    });
});
//==================
test.addEventListener("click", function () {
  window.location.href = "test.html";
});
//=====
fetchData.addEventListener("click", function () {
  dialog.innerHTML = "";
  const h3 = document.createElement("h3");
  h3.innerHTML = "جلب البيانات";
  dialog.appendChild(h3);
  if (isEmpty == false) {
    console.log(listOfData);
    const select = document.createElement("select");
    listOfData.forEach((element, index) => {
      const option = document.createElement("option");
      option.value = `item${index}`;
      option.innerHTML = element;
      select.appendChild(option);
    });
    dialog.appendChild(select);

    const btnGetData = document.createElement("div");
    btnGetData.classList.add("btn");
    btnGetData.innerHTML = "موافق";
    btnGetData.addEventListener("click", function () {
      const selectedText = select.options[select.selectedIndex].text;
      getAllDataWithParam(selectedText);
    });
    dialog.appendChild(btnGetData);
  } else {
    createDialog();
  }

  overlay.style.display = "flex";
});
//=================
overlay.addEventListener("click", (event) => {
  if (event.target === overlay) {
    overlay.style.display = "none";
  }
});

function getAllData() {
  db.collection("test")
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          if (!listOfData.includes(doc.data()["selectedText"])) {
            listOfData.push(doc.data()["selectedText"]);
          }
        });
      } else {
        console.log("لا توجد بيانات");
        isEmpty = true;
      }
    })
    .catch((error) => {
      console.error("خطأ في جلب البيانات:", error);
    });
}

function getAllDataWithParam(param) {
  db.collection("test")
    .where("selectedText", "==", param)
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        listOfDate = [];
        querySnapshot.forEach((doc) => {
          listOfDate.push({
            date: doc.data()["date"],
            sampleNo: doc.data()["sampleNo"],
            selectedText: param,
            weight: doc.data()["weight"],
            email: doc.data()["email"],
            weightAfter: doc.data()["weightAfter"],
            bitumin:doc.data()["bitumin"],
            bituminPercent:doc.data()["bituminPercent"]
          });
        });
        localStorage.setItem("listOfDate", JSON.stringify(listOfDate));
        window.location.href = "listOfData.html";
      } else {
        console.log("لا توجد بيانات");
      }
    })
    .catch((error) => {
      console.error("خطأ في جلب البيانات:", error);
    });
}

getAllData();

function createDialog() {
  const p = document.createElement("p");
  p.classList.add("empty");
  p.innerHTML = "لا توجد بيانات حتي الان";
  dialog.appendChild(p);

  const btnGetData = document.createElement("div");
  btnGetData.classList.add("btn");
  btnGetData.innerHTML = "موافق";

  btnGetData.addEventListener("click", function () {
    overlay.style.display = "none";
  });

  dialog.appendChild(btnGetData);
}
