class Chatroom {
    constructor(u, r) {
        this.room = r;
        this.username = u;
        this.chats = db.collection("chats");
        this.unsub = false;
    }

    set room(r) {
        this._room = r;
    }
    get room() {
        return this._room;
    }



    set username(u) {
        let userNameVal = u;
        let userNameValue = userNameVal.trim();
        if ((userNameValue != "" || userNameValue != null) && userNameValue.length >= 2 && userNameValue.length <= 10) {
            this._username = u;
            console.log('Ispravno korisnicko ime');
        }
        else {
            alert('Username must include more than two and less then ten letters or numbers');
        };
    };
    get username() {
        return this._username;
    };


    // Dodavanje nove poruke

    async addChat(message) {

        let vreme = new Date();

        let docChat = {
            message: message,
            username: this.username,
            room: this.room,
            created_at: firebase.firestore.Timestamp.fromDate(vreme)
        };

        let response = await this.chats.add(docChat);
        return response;

    };

    // Update room

    updateRoom(ur) {
        this.room = ur;
        if (this.unsub != false) {
            this.unsub();
        };
    };

    getChats(callback) {
        this.unsub = this.chats
            .where('room', '==', this.room)
            .orderBy('created_at', 'asc')
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if (change.type == "added") {
                        callback(change.doc)
                    }
                });
            });
    };


    updateUsername(username) {
        this.username = username;
    };

    deleteMessage(id) {
        this.chats
            .doc(id)
            .delete()
            .then(
                console.log(`Message deleted`)
            )
            .catch(err => {
                console.log(`Error ${err}`)
            })
    };



}

export default Chatroom;