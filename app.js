import Chatroom from "./chat.js";
import ChatUI from "./ui.js"





//DOM
let divChat = document.getElementById('element');
let unosPoruke = document.getElementById('unosPoruke');
let btnUnosPoruke = document.getElementById('btnUnosPoruke');
let userName = document.getElementById('userName');
let btnUserName = document.getElementById('btnUserName');
let ispisUserName = document.getElementById('ispisUserName');
let navigacija = document.getElementById('navigacija');
let ispisanaPoruka = document.getElementsByClassName('ispisanaPoruka');
let btnPromenaBoje = document.getElementById('btnPromenaBoje');
let bojaPozadine = document.getElementById('bojaPozadine');
let pocetniDatum = document.getElementById('datumPocetni');
let krajnjiDatum = document.getElementById('datumKrajnji');
let btnFilter = document.getElementById('btnFilter')
let navLi = document.querySelectorAll('.navLi')


//Objekti klasa

let setUsername = 'Anonimus';
if (localStorage.usernameInput) {
    setUsername = localStorage.usernameInput
}



let chatroom = new Chatroom(setUsername, 'general');
let chatUI = new ChatUI(divChat);

//Ispis dokumenata iz db 

chatroom.getChats(d => {
    chatUI.templateP(d);
    divChat.scrollBy(0, 1000);
})

//Dodavanje poruke u bazu i na staranicu

btnUnosPoruke.addEventListener('click', x => {
    x.preventDefault();

    let unosPorukeValue = unosPoruke.value;
    let unosPorukeValueTrim = unosPorukeValue.trim()

    if (unosPorukeValueTrim == "" || unosPorukeValueTrim == null) {
        alert('You did not enter message')
        unosPoruke.value = "";
    }
    else {
        chatroom.addChat(unosPorukeValueTrim)
            .then(() => {
                unosPoruke.value = "";
            })
            .catch((err) => {
                console.log(err)
            })
    };

});


// Ispis obavestenja o promeni username-a

btnUserName.addEventListener('click', c => {
    c.preventDefault()

    let userNameVal = userName.value;
    let userNameValue = userNameVal.trim()

    if (userNameValue.length >= 2 && userNameValue.length <= 10 && (userNameValue != "" || userNameValue != null)) {

        chatroom.updateUsername(userNameValue);
        let ispis = document.createElement('p');
        ispis.id = 'ispis'
        ispis.innerHTML = `Korisnicko ime je promenjeno: ${userNameValue}`;
        ispisUserName.appendChild(ispis)
        userName.value = "";
        setTimeout(() => {
            ispis.remove();
            document.location.reload();
        }, 2000);
        localStorage.setItem("usernameInput", userNameValue);
    }
    else {

        chatroom.updateUsername(userNameValue);
        let ispis = document.createElement('p');
        ispis.id = 'ispis2'
        ispis.innerHTML = `Korisnicko ime nije pravilno uneto`;
        ispisUserName.appendChild(ispis)
        userName.value = "";
        setTimeout(() => {
            ispis.remove();
        }, 2000);
    }



});

//Ispis poruka u sobama

navigacija.addEventListener('click', e => {
    if (e.target.tagName === "A") {
        chatUI.clear();
        chatroom.updateRoom(e.target.id)
        chatroom.getChats(d => {
            chatUI.templateP(d)
            divChat.scrollBy(0, 1000);
            localStorage.setItem("idRoom", e.target.id);
        });
    };
});


// Aktivna soba nakon relouda stranice

navLi.forEach(el => {
    let eli = el.children;
    el = Array.from(eli);
    console.log(el)
    el.forEach(a => {

        if (localStorage.idRoom == a.id) {
            a.classList.add('active');
        }
    })
});


//Brisanje poruka

divChat.addEventListener('click', function (event) {

    console.log(event.target.parentNode.childNodes)
    if (event.target.tagName === 'IMG') {

        if (event.target.parentNode.childNodes[0].nodeValue.includes(localStorage.usernameInput) == true) {
            let ok = confirm('Da li zelite da obrisete poruku')
            if (ok == true) {
                event.target.parentElement.remove() // brise ga samo sa ekrana
                chatroom.deleteMessage(event.target.parentElement.id)//brise i iz memorije
            }
        }
        else {
            event.target.parentElement.remove()
        }

    }
})


//Promena boje pozadine


if (localStorage.bojaPozadine) {
    document.body.style.backgroundColor = localStorage.bojaPozadine
}
else {
    document.body.style.backgroundColor = '#ffffff';
}

btnPromenaBoje.addEventListener('click', y => {
    y.preventDefault();

    let bojaPozadineValue = bojaPozadine.value;
    localStorage.setItem("bojaPozadine", bojaPozadineValue);
    setTimeout(() => {
        document.body.style.backgroundColor = bojaPozadineValue;
    }, 1000 / 2);
});



//Filter datuma


btnFilter.addEventListener('click', e => {
    e.preventDefault()
    let pocetniDatVal = pocetniDatum.value;
    let pocetni = new Date(pocetniDatVal);
    pocetni = firebase.firestore.Timestamp.fromDate(pocetni);

    let krajnjiDatumVal = krajnjiDatum.value;
    let krajnji = new Date(krajnjiDatumVal);
    krajnji = firebase.firestore.Timestamp.fromDate(krajnji);

    chatUI.clear();
    chatroom.getChats(d => {
        let datumiPoruka = d.data().created_at;
        if (datumiPoruka.seconds > pocetni.seconds && datumiPoruka.seconds < krajnji.seconds) {
            chatUI.templateP(d);
        }
    })
})
