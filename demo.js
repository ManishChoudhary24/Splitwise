// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";
import { getDatabase, ref, push ,set,get,remove,onValue} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";

import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged  } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_TdHVQVTqQcsrkWYXzjnTnG2Yppkki7A",
  authDomain: "auth-d91ee.firebaseapp.com",
  databaseURL: "https://auth-d91ee-default-rtdb.firebaseio.com",
  projectId: "auth-d91ee",
  storageBucket: "auth-d91ee.appspot.com",
  messagingSenderId: "434302120828",
  appId: "1:434302120828:web:58d157f68935c2baf96af9",
  measurementId: "G-JMNVV13TWH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth= getAuth();
const provider = new GoogleAuthProvider();
const database = getDatabase(app);


const signInButton=document.getElementById("signInButton");
const signOutButton=document.getElementById("signOutButton");
const message=document.getElementById("message");
const mainContent = document.getElementById("main-content");
const logoHeader=document.getElementById("logo-heading");
var expensesToPay=document.getElementById("expense-to-pay");
const footer=document.getElementById("footer");


function forMobileMedia(x) {
    if (x.matches) { // If media query matches
        message.style.display="none";
        signOutButton.innerHTML=`<img src="https://toppng.com/uploads/preview/logout-11551049168o9cg0mxxib.png" alt="#" width="40px" height="40px">`
        signOutButton.style.height="fit-content";
        signInButton.innerHTML='<img src="https://firebasestorage.googleapis.com/v0/b/task-traker-4f454.appspot.com/o/loginwithgoogle1.png?alt=media&token=c54c3f66-e902-4a41-b02f-aec3ffe452bf" alt="#" width="100%">'
        signInButton.style.height="fit-content";
    } else {
        message.style.display="flex";
        signInButton.innerHTML='<img src="https://firebasestorage.googleapis.com/v0/b/task-traker-4f454.appspot.com/o/loginwithgoogle1.png?alt=media&token=c54c3f66-e902-4a41-b02f-aec3ffe452bf" alt="#" width="100%" height="80px">'
    }
  }
var x = window.matchMedia("(max-width: 500px)");
forMobileMedia(x);
x.addEventListener("change", function() {
    forMobileMedia(x);
});

const userSignIn = async() => {
    signInWithPopup(auth,provider)
    .then((result)=>{
        const user=result.user;
        console.log(user);
        //store
        var usersRef = ref(database,'user/'+user.uid);
        set(usersRef,{
            name:user.displayName,
            email:user.email
        })
        console.log(database);
    })
    .catch((error) => {
        // const errorCode = error.code;
        // const errorMessage=error.message;
        console.log(error);
    })
}

const userSignOut = async() => {
    signOut(auth).then(()=>{
        // alert("You are signed out!!");
    }).catch((error)=>{

    })
}
onAuthStateChanged(auth,(user)=>{
    if(user){
        // alert("You are signed in!");
        signInButton.style.display="none";
        signOutButton.style.display="block";
        message.innerHTML="Hello "+user.displayName;
        mainContent.style.display="none";
        logoHeader.style.display="flex";
        splitGroup.style.display="block";
        expensesToPay.style.display="block";
        footer.style.display="block";
        forMobileMedia(x);
    }
    else{
        document.body.style.backgroundColor="#C0EEE4";
        signInButton.style.display="flex";
        signOutButton.style.display="none";
        message.style.display="none";
        mainContent.style.display="none";
        logoHeader.style.display="none";
        splitGroup.style.display="none";
        expensesToPay.style.display="none";
        footer.style.display="none";
    }
})

signInButton.addEventListener('click',userSignIn);
signOutButton.addEventListener('click',userSignOut);

var items=document.getElementById("items");
var getData;


onValue(ref(database,'user'),(sp)=>{
    var obj = sp.val()
    var keys = Object.keys(obj)

    var selectFreind = document.getElementById("select-friend")
    while (selectFreind.childNodes.length>2) {
        selectFreind.lastChild.remove()
    }
    keys.forEach(key=>{
        var checkDiv = document.createElement("div");
        checkDiv.innerHTML = `
          <input type="checkbox" id="${obj[key].name}" name="${obj[key].name}" checked />
          <label for="scales">${obj[key].name}</label>
        `
        selectFreind.appendChild(checkDiv)
    })

    console.log(keys.map(key=>{

        return obj[key].name
    }))
})

function handleDeleteBtn(id){
    console.log(id);
    remove(ref(database,'groups/'+id));
}

onValue(ref(database,'groups'),
    (snapshot)=>{
        while (expensesToPay.firstChild) {
            expensesToPay.firstChild.remove()
        }
        var obj =snapshot.val();
        if(!obj) return
        var keys= Object.keys(obj);
        
        keys.forEach((key)=>{
            var newExpense=document.createElement("div");
            newExpense.className="expenses-to-pay";
            newExpense.innerHTML+=`<h2 id="expenses-to-pay-heading">${obj[key].name}</h2>`
                
            obj[key].payouts.forEach((pays)=>{
                newExpense.innerHTML+=`<p>${pays.paidTo} will pay ${pays.amountPaid} to ${pays.paidBy}</p>`
            })

            newExpense.innerHTML+=`<button class="delete-btn" name="deletebtn" id="${key}" type="button">Delete</button>`;

            expensesToPay.appendChild(newExpense);
        })
        
        let a  = document.getElementsByClassName('delete-btn')
        for(let i=0;i<a.length;i++){
            a[i].onclick=()=>{
                handleDeleteBtn(a[i].id);

            }
        }
    }
)

const splitGroup=document.getElementById("splitGroup");
const groupCard = document.getElementById("group-card");
const groupHeading = document.getElementById("group-heading");
const groupValue = document.getElementById("group-value");
const addPayer = document.getElementById("add-payer");
let dataArr;
var amountToPay=[];
var map=new Map();

splitGroup.addEventListener("submit",function(e){
    e.preventDefault()
    mainContent.style.display="block";
    splitGroup.style.display="none";
    expensesToPay.style.display="none";
    const data = new FormData(e.target);
    dataArr = [...data.entries()] ;
    for(var i=0;i<dataArr.length;i++){
        
        if(i==0){
            groupHeading.innerHTML=dataArr[i][1];
        }
        else{
            groupValue.innerHTML+=`<li style="list-style:none">${dataArr[i][0]}</li>`;
            addPayer.innerHTML+=`<option name="payer" id="payer">${dataArr[i][0]}</option>`;
            amountToPay.push(0);
            map.set(`${dataArr[i][0]}`,'0');
        }
    }
    console.log(amountToPay);
})


const addExpenses=document.getElementById("add-expenses");
const expenseDetails=document.getElementById("expense-details");
let cost;
var totalAmount=0;
var groups=[];


addExpenses.addEventListener("submit",function(e){
    e.preventDefault();
    expenseDetails.innerHTML="";
    
    const data = new FormData(e.target);
    let dataValue = [...data.entries()] ;
    let len=dataArr.length-1;
    let payerName=dataValue[1][1];
    cost=parseInt(dataValue[0][1]);
    console.log(cost);
    console.log(dataArr.length-1);
    console.log([...data.entries()]);
    console.log(map.get(`${payerName}`));
    let valuePaid=parseInt(map.get(`${payerName}`))+cost;
    map.set(`${payerName}`,valuePaid);
    console.log(map);

    totalAmount+=cost;
    console.log(totalAmount);
    const perPersonPay=totalAmount/len;
    console.log(perPersonPay);

    var giveMoney=new Map();
    var takeMoney=new Map();

    for(var key of map.keys()){
        let moneyPaid=parseInt(map.get(key));
        if(moneyPaid>=perPersonPay){
            takeMoney.set(key,moneyPaid-perPersonPay);
        }
        else{
            giveMoney.set(key,perPersonPay-moneyPaid);
        }

    }

    console.log(giveMoney);
    console.log(takeMoney);
    groups=[];
    for(var key of giveMoney.keys()){
         
        let amountToGive = parseInt(giveMoney.get(key));
        for(var take of takeMoney.keys()){
            let amountToTake=parseInt(takeMoney.get(take));
            if(amountToTake>0 && amountToGive>0){
                if(amountToGive>=amountToTake){
                    expenseDetails.innerHTML+=`<p>${key} will pay ${amountToTake} to ${take}</p>`
                    groups.push({
                        paidBy: `${take}`,
                        paidTo: `${key}`,
                        amountPaid: `${amountToTake}`
                    })
                    takeMoney.set(take,0);
                    amountToGive=amountToGive-amountToTake;
                }
                else{
                    expenseDetails.innerHTML+=`<p>${key} will pay ${amountToGive} to ${take}</p>`
                    groups.push({
                        paidBy: `${take}`,
                        paidTo: `${key}`,
                        amountPaid: `${amountToGive}`
                    })
                    takeMoney.set(take,amountToTake-amountToGive);
                    amountToGive=0;
                    break;
                }
            }
        }
        console.log(takeMoney);
    }
    document.getElementById("amount").value="";
})

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const saveBtn=document.getElementById("save");
saveBtn.onclick=function(){
    console.log(groups);
    if(groups.length!=0){
        set(ref(database,'groups/'+uuidv4()),{
            name: `${dataArr[0][1]}`,
            payouts: groups
        })
    }
    window.location.href = "/Splitwise";
}


