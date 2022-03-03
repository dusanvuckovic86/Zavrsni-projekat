

class ChatUI {
    constructor(div) {
        this.divElement = div
    }

    set divElement(div) {
        this._divElement = div

    }
    get divElement() {
        return this._divElement
    }

    formatiranjeVremena(date) {
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let hour = date.getHours();
        let minutes = date.getMinutes();
        let datumPC = new Date();
        let datumKomp = datumPC.getDate();
        if (datumKomp == day) {
            return `${hour}:${minutes}`
        }
        else {
            return `${day}.${month}.${year}  ${hour}:${minutes}`
        }

    }

    templateP(doc) {

        let id = doc.id;
        let data = doc.data();
        let userName = data.username
        let d = data.created_at.toDate();

        if (userName == localStorage.usernameInput) {
            let paragraf = document.createElement('p')
            paragraf.style.float = 'right'
            paragraf.className = "ispisanaPoruka"
            paragraf.id = id;
            paragraf.innerHTML += `${data.username}:`;
            let paragrafIspis = document.createElement('p');
            paragrafIspis.innerHTML += ` ${data.message} <br> ${this.formatiranjeVremena(d)}`;
            paragraf.appendChild(paragrafIspis)
            let slicica = document.createElement('img');
            slicica.src = './asets/kanta_otpad2.png';
            slicica.id = 'slicica';
            paragraf.appendChild(slicica);
            this.divElement.appendChild(paragraf)
        }
        else {
            let paragraf = document.createElement('p')
            paragraf.style.float = 'left'
            paragraf.className = "ispisanaPoruka2"
            paragraf.id = id;
            paragraf.innerHTML += `${data.username}:`;
            let paragrafIspis = document.createElement('p');
            paragrafIspis.innerHTML += ` ${data.message} <br> ${this.formatiranjeVremena(d)}`;
            paragraf.appendChild(paragrafIspis)
            let slicica = document.createElement('img');
            slicica.src = './asets/kanta_otpad.png';
            slicica.id = 'slicica';
            paragraf.appendChild(slicica);
            this.divElement.appendChild(paragraf)
        }
    };


    clear() {
        this.divElement.innerHTML = "";
    };

}

export default ChatUI