// 1. socket = io(socket url);
// 2. socket.on(eventName, callback);
// 3. socket.emit(eventName, data, callback)

// verify => eventName, user{email, name}, callback;
// getUsers => eventName, callback;
// chatMessage => eventName, message, userInfo;
// writeMessage => eventName, userName;


let socket = io('https://easycode-test-chat.herokuapp.com/');

class Chat{
    constructor(){
        let self = this;
        this.chat_room_item_container = document.querySelector('.chat-rooms-list');
        this.messageContainer = document.querySelector('.message-container');
        this.class = '';
    }

    verify(user){
        console.log(user);
        return new Promise(function (resolve, reject) {
            socket.emit( 'verify', user, function (error,res) {

                if ( error ) reject(error);
                resolve(res) // в res вы получите данные пользователя которого передали

            } );
        })

    }

    getUsers(){
        
        return new Promise(function (resolve, reject) {

            socket.emit('getUsers', function (users) {

                if (!users) reject('Users not found');
                resolve( users );

            });
        })

    }

    sendMessage(msg, userInfo){
        socket.emit('chatMessage', msg, userInfo)
    }

    writeMessage(userName){
        socket.emit('writeMessage', userName);
    }

    renderUsers(users){
        // перебрать forEach users
        // appendChild chat-room-item container
        users.forEach( user => {
            let template = this.userItemTemplate(user);
            this.chat_room_item_container.insertAdjacentHTML('beforeend', template );
        } )
    }

    userItemTemplate(user){
        // шаблон блока пользователя .chat-room-item
        let userHTML = `
            <div class="chat-room-item d-flex align-items-center">
                <div class="chat-room-user-ava">
                    <img src="img/chat-room-item-ava.png" alt="">
                    <span class="new-msg-count"></span>
                </div>
                <!-- / chat-room-user-ava -->

                <div class="chat-room-user-info">
                    <span class="chat-room-user-name">${user.name}</span>
    
                    <div class="chat-room-last-msg d-flex justify-content-between">
                        <span class="last-msg">${user.lastMessage}</span>
                        <span class="last-msg-time">1 min</span>
                    </div>
                    <!-- / chat-room-last-msg -->
                    
                    <span class="chat-room-user-status online"></span>
                </div>
            </div>
        `;

        return userHTML;
    }

    renderMessage(message, user){
        let templateMessage = this.newMessage(message, user);
        // console.log(user);

        this.messageContainer.insertAdjacentHTML('beforeend', templateMessage)

    }

    newMessage(message, user){

        this.class = (user.name.toLowerCase() || user.querySelector('.chat-room-user-name').textContent.toLowerCase() == JSON.parse(localStorage.user).name.toLowerCase())
            ? 'from-you' : 'to-you';


        let innerHTML = `
            <div class="message ${this.class}" >
                <img src="img/user-message-ava.png" alt="">
                <div class="message-text">
                    ${user.lastMessage} 
                </div>
            </div>
        `;
        return innerHTML;
    }

    textFromUsers(){
        return this.allUsersText
    }
}