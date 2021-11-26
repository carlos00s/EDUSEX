const loggedOutLinks = document.querySelectorAll(".logged-out");
const loggedInLinks = document.querySelectorAll(".logged-in");





const loginCheck = (user) => {
  if (user) {
    loggedInLinks.forEach((link) => (link.style.display = "block"));
    loggedOutLinks.forEach((link) => (link.style.display = "none"));
  } else {
    loggedInLinks.forEach((link) => (link.style.display = "none"));
    loggedOutLinks.forEach((link) => (link.style.display = "block"));
  }
};


const signUpForm = document.querySelector("#signup-form");
signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = signUpForm["signup-email"].value;
  const password = signUpForm["signup-password"].value;


  auth
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
     
      signUpForm.reset();
     
      $("#signupModal").modal("hide");
    });
});


const logout = document.querySelector("#logout");

logout.addEventListener("click", (e) => {
  e.preventDefault();
  auth.signOut().then(() => {
    console.log("signup out");
  });
});


const signInForm = document.querySelector("#login-form");

signInForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = signInForm["login-email"].value;
  const password = signInForm["login-password"].value;

 
  auth.signInWithEmailAndPassword(email, password).then((userCredential) => {
   
    signInForm.reset();
   
    $("#signinModal").modal("hide");
  });
});


const postList = document.querySelector(".posts");
const setupPosts = (data) => {
  if (data.length) {
    let html = "";
    data.forEach((doc) => {
      const post = doc.data();
      const li = `
      <li class="list-group-item list-group-item-action">
      <h5 style="text-align: center;">${post.titutlo}</h5>
      <button style="float: right;" onclick="window.location.href='/crud.html'" class="btn btn-primary">INGRESAR</button>      </li>
      <br>
      <li class="list-group-item list-group-item-action">
      <h5 style="text-align: center;">${post.descripcion}</h5>
      <button style="float: right;" onclick="window.location.href='/modulos.html'" class="btn btn-primary">INGRESAR</button>      </li>
          
    `;
      html += li;
    });
    postList.innerHTML = html;
  } else {
    
    postList.innerHTML = `
    
    <header class="bg_animate">
    <div class="header_nav">
        
    </div>

    <section class="banner contenedor">
        <secrion class="banner_title">
            <h2>BIENVENIDOS, ES HORA DE APRENDER<br> ¿VAMOS?</h2>
        </secrion>
        <div class="banner_img">
        <img  src="/img/genero.png" alt="">
        </div>
    </section>

    <div class="burbujas">
        <div class="burbuja"></div>
        <div class="burbuja"></div>
        <div class="burbuja"></div>
        <div class="burbuja"></div>
        <div class="burbuja"></div>
        <div class="burbuja"></div>
        <div class="burbuja"></div>
        <div class="burbuja"></div>
        <div class="burbuja"></div>
        <div class="burbuja"></div>
    </div>
</header>`;
  }
};


auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("signin");
    fs.collection("posts")
      .get()
      .then((snapshot) => {
        setupPosts(snapshot.docs);
        loginCheck(user);
      });
  } else {
    console.log("signout");
    setupPosts([]);
    loginCheck(user);
  }
});

