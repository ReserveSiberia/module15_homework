const wsUrl = "wss://echo-ws-service.herokuapp.com"; // адрес сервера
// получаем необходимые элементы
const chatEl = document.querySelector('.chat')
const userInput = chatEl.querySelector('.userInput__msg')
const sendBtn = chatEl.querySelector('.--send')
const geoBtn = chatEl.querySelector('.--geo')
const msgWin = chatEl.querySelector('.msgWindow') 

let websocket // переменная для создания экземпляра класса вебсокета

// функция для создания элемента сообщения пользователя
function writeMsgUser(massage) {
    let msgUser = document.createElement("div")
    msgUser.classList.add('msgUser')
    msgUser.innerHTML = massage
    msgWin.appendChild(msgUser)
}

// функция для создания элемента сообщения сервера
function writeMsgServer(response) {
  let msgServer = document.createElement("div")
  msgServer.classList.add('msgServer')
  msgServer.innerHTML = response
  msgWin.appendChild(msgServer)
}

// обработчик события нажания кнопки отправки сообщения
sendBtn.addEventListener('click', () => {
    websocket = new WebSocket(wsUrl); // создание экземпляра класса вебсокета
    websocket.onopen = function(evt) { // событие открытия канала
    let userMessage = userInput.value
    websocket.send(userMessage) // отправка сообщения пользователя

    writeMsgUser(userMessage) // запись в окно сообщений сообщения пользователя

    userInput.value = ''
    };
    
    websocket.onmessage = function(evt) { //событие при получении сообщения с сервера
      writeMsgServer(evt.data) // запись в окно сообщений сообщения сервера
    };

    websocket.onerror = function() {  //событие при ошибке получения ответа от сервера
      console.error('error')
    };
})

const success = (position) => { // функция отправки местоположения
  const latitude  = position.coords.latitude;
  const longitude = position.coords.longitude;
  let userMessage = `<a href="https://www.openstreetmap.org/#map=18/${latitude}/${longitude}">Ваше местоположение</a>`
  writeMsgUser(userMessage)
}

const error = () => { //функция ошибки, если пользователь отказался от получения местоположения
  console.error('Невозможно получить ваше местоположение')
}

geoBtn.addEventListener('click', () => { // обработчик местоположения
  if (!navigator.geolocation) {
    console.error('Geolocation не поддерживается вашим браузером')
  } else {
    console.log('Определение местоположения…')
    navigator.geolocation.getCurrentPosition(success, error)
  }
});
