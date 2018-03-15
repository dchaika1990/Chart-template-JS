// Create Modal
let enterModal = new Modal('#enter-modal');

// Loader
let loader = document.getElementById('loading');

// socket connect
let chat = new Chat();

// enterform
let enterForm = document.forms['enter-form'];
let messageForm = document.forms['message-form'];
let inputMessage = messageForm.elements['message'];
let userInfo = {};

// Create Validate
let validate = new Validate(enterForm);

let allUsers = document.getElementsByClassName('chat-room-item');

function startChat(userData) {
    chat.verify(userData)
        .then( user => {
            userInfo = user;
            localStorage.setItem('userInfo', JSON.stringify(user))
        } )
        .then( () => enterModal.hide() )
        .then( chat.getUsers )
        .then( chat.renderUsers.bind(chat)  )
        .then( setSocketEvents )
        .then( setViewEvents )
        .then( loader.classList.add('hide') )
        .catch( error => console.error(error) );
}

function setSocketEvents() {

    socket.on('chatMessage', function (message, user) {
        chat.renderMessage(message, user);
        // console.log(message, user);
    });

    socket.on('writeMessage', function(name){
        console.log('writing...',name);
    });

}

function setViewEvents() {

    messageForm.addEventListener('submit', function (e) {
        e.preventDefault();

        if (inputMessage.value === '') return console.log('Empty message');

        chat.sendMessage(inputMessage.value, userInfo);
        inputMessage.value = '';
    });

    inputMessage.addEventListener('keyup', function (e) {
        chat.writeMessage(userInfo.name)
    });

    for (let i = 0; i < allUsers.length; i++){
        allUsers[i].addEventListener('click', function (e) {
            // console.log(allUsers[i])
            // console.log(allUsers[i].querySelector('span.last-msg').textContent)
            // chat.renderMessage(allUsers[i]);
        })
    }
}

socket.on('connection', function () {
    console.log('socket connected');

    let lsUserData = JSON.parse(localStorage.getItem('userInfo'));

    if (lsUserData) startChat(lsUserData);
    else {
        enterForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (this.elements['email'].value === '' && this.elements['name'].value === '') {
                return enterModal.show_error('Forms are empty')
            }

            userInfo['email'] = this.elements['email'].value;
            userInfo['name'] = this.elements['name'].value;

            validate.init();
            if (!validate.form_valid_toggle) return;

            startChat(userInfo)
        })
    }

    // if(localStorage.user){
    //
    //     chat.verify(JSON.parse(localStorage.user))
    //         .then( user => {
    //             console.log(user);
    //             userInfo = user;
    //         } )
    //         .then( () => enterModal.hide() )
    //         .then( chat.getUsers )
    //         .then( chat.renderUsers )
    //         .then( setEvents )
    //         .catch( error => console.error(error) );
    // } else {
    //     enterForm.addEventListener('submit', function (e) {
    //         e.preventDefault();
    //
    //         if (this.elements['email'].value === '' && this.elements['name'].value === '') {
    //             return enterModal.show_error('Forms are empty')
    //         }
    //
    //         userInfo['email'] = this.elements['email'].value;
    //         userInfo['name'] = this.elements['name'].value;
    //
    //         validate.init();
    //         if (!validate.form_valid_toggle) return;
    //
    //         chat.verify(userInfo)
    //             .then( user => {
    //                 console.log(user);
    //                 localStorage.setItem('user', JSON.stringify(userInfo));
    //             } )
    //             .then( () => enterModal.hide() )
    //             .then( chat.getUsers )
    //             .then( chat.renderUsers )
    //             .then( setEvents )
    //             .catch( error => console.error(error) );
    //     })
    // }

});


