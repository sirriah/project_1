const content = document.getElementById("content");
const disabled = document.getElementById("disabled");
const firstMenu = document.getElementById("firstMenu");
const signupDiv = document.getElementById("signupDiv");
const loginDiv = document.getElementById("loginDiv");
const dashboard = document.getElementById("dashboard");
const newList = document.getElementById("new-list");
const nameList = document.getElementById("listName");
let listUL = document.getElementById("toDoList");

const login = document.getElementById("login");
const signup = document.getElementById("signup");

const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");

const noListsMessage = document.createElement("p");
let isNewList = true;
let foundedList = {};

let userMenu = document.getElementById("userMenu");
const userAccount = document.getElementById("userAccount");
const userAccountForm = document.getElementById("userAccountForm");

// global variable for logged user
let user = {};
// =============== firstmenu page ===============

//let clonNode = firstMenu.cloneNode(true);
//clonNode.id = "firstMenuClone";
content.appendChild(firstMenu);

// check if the user is logged in
const isUserLogged = () => {
  if(user.name){
    username.innerHTML = `${user.name} ${user.surname}`;
    userMenu.innerHTML = `You are logged in as `;
    userMenu.appendChild(username);
  } else {
    
    userMenu.innerHTML = `You are not logged in`;
  }


}

// username in header
const username = document.createElement("span");
username.classList.add("username");
username.id = "username";

username.addEventListener("click", (e) => {
  content.innerHTML = ""; // delete the content

  const nameAccount = document.getElementById("nameAccount");
  nameAccount.value = user.name;

  const surnameAccount = document.getElementById("surnameAccount");
  surnameAccount.value = user.surname;

  const emailAccount = document.getElementById("emailAccount");
  emailAccount.value = user.email;

  const passwordAccount = document.getElementById("passwordAccount");
  passwordAccount.value = user.password;

  content.appendChild(userAccount);
});

userAccountForm.addEventListener("submit", (e) => {
  localStorage.removeItem(user.email);

  user.name = document.getElementById("nameAccount").value;
  user.surname = document.getElementById("surnameAccount").value;
  user.email = document.getElementById("emailAccount").value;
  user.password = document.getElementById("passwordAccount").value;

  console.log(user);
  
  localStorage.setItem(user.email, JSON.stringify(user));
  isUserLogged();
  content.innerHTML = ""; // delete the content
  content.appendChild(dashboard);
});


isUserLogged();



login.addEventListener("click", (e) => {
  //content.innerHTML = loginDiv.innerHTML;

  //console.log(content.children);
  //disabled.appendChild(content.children);
  content.innerHTML = ""; // delete the content
  // let clonNode = loginDiv.cloneNode(true);
  // clonNode.id = "loginDivClone";
  isUserLogged();
  content.appendChild(loginDiv);
});

signup.addEventListener("click", (e) => {
  // disabled.appendChild(content.childNodes);
  isUserLogged();
  content.innerHTML = ""; // delete the content
  content.appendChild(signupDiv);
});

// =============== Login page ===============

loginForm.addEventListener("submit", loginUser);
function loginUser(e) {
  e.preventDefault();
  const emailLogin = document.getElementById("email-login").value;
  const passwordLogin = document.getElementById("password-login").value;
  //console.log(emailLogin);
  const loggedUser = JSON.parse(localStorage.getItem(emailLogin));
  //console.log(typeof loggedUser);

  if (loggedUser && passwordLogin === loggedUser["password"]) {
    console.log("this user exists");
    user = loggedUser;
    console.log(user);
    content.innerHTML = "";
    writeOutLists();
    content.appendChild(dashboard);
  } else {
    const errorLogin = document.getElementById("errorLogin");
    errorLogin.innerHTML = "User with this email does not exists.";
    console.log("this user not exists");
  }

  isUserLogged();
}

// =============== Signup page ===============

let createNewUser = (e) => {
  console.log("before prevent");
  e.preventDefault();

  if (!document.getElementById("termsofuse").checked) {
    const errorSignup = document.getElementById("errorSignup");
    errorSignup.innerHTML = "You have to agree with the Terms of Use.";
  } else {
      // form validation and new user is created
    validationSignup();
    
    // to the dashboard
    content.innerHTML = ""; // delete the content
  content.appendChild(dashboard);
  }
  isUserLogged();
};
signupForm.addEventListener("submit", createNewUser);

let validationSignup = () => {
  const name = document.getElementById("name").value;
  const surname = document.getElementById("surname").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  user = {
    name: name,
    surname: surname,
    email: email,
    password: password,
    lists: [],
  };

  console.log(user);
  localStorage.setItem(email, JSON.stringify(user));
};

// =============== DASHBOARD ===============

// dashboard - displays form

const createNewList = document.getElementById("createNewList");
createNewList.addEventListener("click", () => {
  content.innerHTML = "";

  content.appendChild(newList);
  nameList.value = "";
  listUL.innerHTML = "";
  document.getElementById("itemNew").value = "";
});

// dasboard displays lists

// add new item into the list

let listObject = {};
// inserts the new LI into the UL list
const listItemForm = document.getElementById("listItemForm");
listItemForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newItem = document.getElementById("itemNew").value;
  const newLI = document.createElement("li");
  newLI.innerHTML = newItem;
  listUL.appendChild(newLI);
  document.getElementById("itemNew").value = "";
});

// ============= SAVE THE FORM WITH LIST ============

// saves the whole list with the name and timestamp into the user.lists array
const listSaveForm = document.getElementById("listSaveForm");
listSaveForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (isNewList) {
    //console.log(listUL);

    const nameList = document.getElementById("listName").value;
    // toISOString converts the UTC date-time to ISO object 
    const creationDate = (new Date()).toISOString();

    listObject = {
      nameList: nameList,
      creationDate: creationDate,
      listUL: listUL.innerHTML,
    };
    user.lists.push(listObject);
    localStorage.setItem(user.email, JSON.stringify(user));
    //console.log(listObject);

    // vypis listy
  } else {
    localStorage.removeItem(user.email);
    const renamedList = document.getElementById("listName").value;
    const renewedUL = document.getElementById("toDoList");

    for (const iterator of user.lists) {
      if (iterator.creationDate == foundedList.creationDate) {
        iterator.nameList = renamedList;
        iterator.listUL = renewedUL.innerHTML; // err pri dopisovani
      }
    }
    localStorage.setItem(user.email, JSON.stringify(user));
    isNewList = true;
  }

  content.innerHTML = "";
  writeOutLists();
  content.appendChild(dashboard);
});

/*
function for write out the list of to-do lists on the Dashboard

*/
let listOfLists = document.createElement("div");
listOfLists.id = "list-of-lists";

const writeOutLists = () => {
  if (user.lists.length !== 0) {
    noListsMessage.innerHTML = "";
    listOfLists.innerHTML = "";

    user.lists.forEach((element) => {
      const listButton = document.createElement("div");
      listButton.classList.add("list--detail");

      // add headline tag with the name of the list into the button
      const listHeadline = document.createElement("h3");
      listHeadline.innerHTML = element.nameList;
      listButton.appendChild(listHeadline);

      // add date into the "button > span" in nicer format
      const listDate = document.createElement("span");
      const optionsDate = { day: "numeric", month: "short", year: "numeric" }; // format of the date

      // in the element.creationDate is not stored the Date object, but only a String - so it have to be parsed via "new Date"
      listDate.innerHTML = new Intl.DateTimeFormat("en-US", optionsDate).format(
        new Date(element.creationDate)
      );
      listButton.appendChild(listDate);

      // dataset https://stackoverflow.com/questions/33760520/how-can-i-get-the-values-of-data-attributes-in-javascript-code
      listButton.setAttribute("data-timestamp", element.creationDate);

      listOfLists.appendChild(listButton);
    });

    dashboard.appendChild(listOfLists);
  } else {
    noListsMessage.innerHTML = "You have not added any list yet.";
    dashboard.appendChild(noListsMessage);
  }
};

listOfLists.addEventListener("click", (e) => {
  //console.log(e.target);
  isNewList = false;
  const selectedList = e.target;
  console.log(selectedList);
  console.log("dataset " + selectedList.getAttribute("data-timestamp"));

  // https://usefulangle.com/post/3/javascript-search-array-of-objects
  foundedList = user.lists.find((list, timestamp) => {
    if (list.creationDate == selectedList.getAttribute("data-timestamp")) {
      return true;
    }
  });

  nameList.value = foundedList.nameList;
  listUL.innerHTML = foundedList.listUL;
 
  // insert the list from e.target into the html form

  content.innerHTML = "";
  content.appendChild(newList);
});


// ============= CHECK AS "DONE" =============

listUL.addEventListener("click", (e) => {
    const itemLI = e.target;
    itemLI.classList.toggle("done");
});


