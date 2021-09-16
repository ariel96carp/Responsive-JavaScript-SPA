// VARIABLES DE API
const apiURL = "http://localhost:9393/api"
const apiRegister = `${apiURL}/v1/register`
const apiLogin = `${apiURL}/v1/login`
    
// VARIABLES DE WEBSOCKET
let ws = null

// VARIABLE DE USUARIO
let userName = null

const loginCode = () => {
    const modalLogin = document.getElementById("modal-login")
    const formContainer = document.getElementById("form-container")

    //------------------------ CODIGO DEL LOGIN (LAYOUT)
    // BOTON CON EL QUE SE ABRE EL MODAL.
    const registerButton = document.getElementById("register-button")
    if (registerButton)
    {
        registerButton.addEventListener("click", () => {
            modalLogin.classList.toggle("active")
            formContainer.classList.toggle("active")
        })
    }

    // BOTON CON EL QUE SE CIERRA EL MODAL.
    const cancelButton = document.getElementById("cancel-button")
    if (cancelButton)
    {
        cancelButton.addEventListener("click", () => {
            modalLogin.classList.toggle("active")
            formContainer.classList.toggle("active")
        })
    }


    //------------------------ CODIGO DEL LOGIN (API)
    // EVENTO CON EL QUE REALIZO EL REGISTRO DE USUARIO.
    const registerForm = document.getElementById("register-form")
    if (registerForm)
    {
        registerForm.addEventListener("submit", e => {
            e.preventDefault()
            const target = e.target
            apiCall(apiRegister, target, "register")
        })
    }

    // EVENTO CON EL QUE REALIZO EL LOGIN DE USUARIO.
    const loginForm = document.getElementById("form-login")
    if (loginForm)
    {
        loginForm.addEventListener("submit", e => {
            e.preventDefault()
            const target = e.target
            userName = target.username.value
            apiCall(apiLogin, target, "login")
        })
    }

    // FUNCION CON LA QUE LLAMO A LA API.
    const apiCall = async (url, target, type) => {
        const statusDiv = document.getElementById((type == "register") ? "register-status" : "login-status")
        drawMessage((type == "register") ? "Creando usuario..." : "Verificando usuario...", statusDiv)
        const params = getParams(target)
        try{
            const response = await fetch(url, params)
            if (type == "register")
            {
                switch(response.status)
                {
                    case 201:
                        setTimeout(async () => {
                            drawMessage("¡Registro exitoso!", "ok", statusDiv)
                            setTimeout(() => {
                                closeRegister(statusDiv)
                            },1000);
                        },2000)
                        break
                    default:
                        setTimeout(() => {
                            drawMessage(`Error ${response.status}. Registro fallido`, "error", statusDiv)
                            setTimeout(() => {
                                closeRegister(statusDiv)
                            },1000);
                        },2000)
                }
            }
            else
            {
                switch(response.status)
                {
                    case 200:
                        setTimeout(() => {
                            drawMessage("¡Conexión exitosa!", "ok", statusDiv)
                            setTimeout(async () => {
                                loginForm.reset()
                                statusDiv.innerHTML = ""
                                const dataResponse = await response.json()
                                localStorage.clear()
                                saveData([dataResponse.data, "token"], [userName, "username"])
                                Router.navigate("/chat")
                            },1000);
                        },2000)
                        break
                    case 401:
                        setTimeout(() => {
                            drawMessage(`Error ${response.status}. Usuario o contraseña no válidos.`, "error", statusDiv)
                            setTimeout(() => {
                                loginForm.reset()
                                statusDiv.innerHTML = ""
                            },1000);
                        },2000)
                        break
                    default:
                        setTimeout(() => {
                            drawMessage(`Error ${response.status}. ¡Conexión fallida!.`, "error", statusDiv)
                            setTimeout(() => {
                                loginForm.reset()
                                statusDiv.innerHTML = ""
                            },1000);
                        },2000)
                }
            }
        }
        catch(e){
            setTimeout(() => {
                drawMessage(`${e}. El servidor no se encuentra activo.`, "error", statusDiv)
                setTimeout(() => {
                    (type == "register")
                    ? closeRegister(statusDiv)
                    : (loginForm.reset(), statusDiv.innerHTML = "")
                },2000);
            },2000)
        }
    }

    // FUNCION CON LA QUE CREO LOS PARAMETROS DE LA LLAMADA A LA API.
    const getParams = (target) => {
        const data = {
            nick_name: target.username.value,
            password: target.password.value
        }
        
        const header = new Headers()
        header.append("Content-type", "application/json")
        
        const params = {
            method: "POST",
            headers: header,
            cache: "default",
            body: JSON.stringify(data)
        }
        return params
    }

    // FUNCION CON LA QUE DIBUJO MENSAJES EN EL DOM.
    const drawMessage = (...data) => {
        let templateHTML = null
        switch(data.length)
        {
            case 2:
                data[1].innerHTML = ""
                templateHTML =   `<p class="system-message center-block center-content">
                                        ${data[0]}
                                    </p>`
                data[1].insertAdjacentHTML("beforeend", templateHTML) 
                break
            default:
                data[2].innerHTML = ""
                templateHTML =   `<p class="system-message ${data[1]} center-block center-content">
                                        ${data[0]}
                                    </p>`
                data[2].insertAdjacentHTML("beforeend", templateHTML)
        }                   
    }

    // FUNCION CON LA QUE CIERRO EL REGISTRO.
    const closeRegister = (element) => {
        element.innerHTML = ""
        registerForm.reset()
        modalLogin.classList.toggle("active")
        formContainer.classList.toggle("active")
    }

    // FUNCION QUE GUARDA EL TOKEN Y USUARIO RECIBIDO, EN EL ALMACENAMIENTO LOCAL DEL USUARIO.
    const saveData = (...data) => {
        data.forEach(element => {
            const tokenObject = {
                key: element[1],
                value: element[0]
            }
            localStorage.setItem(tokenObject.key, tokenObject.value)
        });
    }
}

const chatCode = () => {
    const wrapperBp = matchMedia("(min-width: 700px)")
    const usersContainer = document.getElementById("users-container")
    const modalContainer = document.getElementById("modal")
    const messagesContainer = document.getElementById("messages-container")

    //------------------------ CODIGO DEL CHAT (LAYOUT)
    // BOTON CON EL QUE EN PANTALLAS CHICAS, SE VISUALIZAN LOS USUARIOS CONECTADOS.
    const toggleButton = document.getElementById("main-menu-toggle")
    if (toggleButton)
    {
        toggleButton.addEventListener("click", () => {
            usersContainer.classList.toggle("show")
            modalContainer.classList.toggle("active")
            if (document.body.classList.contains("overflow") == false)
            {
                document.body.classList.toggle("overflow")
            }
            else
            {
                document.body.removeAttribute("class")
            }
            if (document.body.classList.contains("overflow"))
            {
                window.scrollTo(0,0)
            }
        })
    }

    /* CADA VEZ QUE SE REDIMENSIONE LA PANTALLA DEL DISPOSITIVO; Y EN CASO DE QUE EL ANCHO SEA DISTINTO AL ULTIMO ANCHO 
    ALMACENADO, SE MODIFICARA LA VARIABLE "screenHeight. */
    const root = document.documentElement
    if (root)
    {
        let screenHeight = window.innerHeight
        root.style.setProperty("--screen-height", `${screenHeight}px`)
        addEventListener("resize", () => {
            if (window.innerHeight != screenHeight)
            {
                screenHeight = window.innerHeight
                root.style.setProperty("--screen-height", `${screenHeight}px`)
            }
        })
    }

    /* DEPENDIENDO DE SI SE CUMPLE O NO EL BREAKPOINT ALMACENADO EN LA VARIABLE "wrapperBp", REUBICO EL CONTENEDOR "wrapper" DENTRO DE
    LA ESTRUCTURA HTML. */
    const toggleWrapper = (breakpoint, aside) => {
        const chatDetails = document.getElementById("chat-details")
        const bodyContainer = document.getElementById("body-chat")
        if (breakpoint.matches)
        {
            if (aside.classList.contains("wrapper"))
            {
                aside.classList.toggle("wrapper")
                messagesContainer.classList.toggle("wrapper")
                chatDetails.classList.toggle("wrapper")
                bodyContainer.classList.toggle("wrapper")
            }
        }
        else if (aside.classList.contains("wrapper") == false)
        {
            aside.classList.toggle("wrapper")
            messagesContainer.classList.toggle("wrapper")
            chatDetails.classList.toggle("wrapper")
            bodyContainer.classList.toggle("wrapper")
        }
    }
    const asideSection = document.getElementById("aside-chat")
    if (asideSection)
    {
        toggleWrapper(wrapperBp, asideSection)
        addEventListener("resize", () => {
            toggleWrapper(wrapperBp, asideSection)
        })
    }

    /* DE CUMPLIRSE EL BREAKPOINT INDICADO; Y LOS ELEMENTOS CORRESPONDIENTES A LAS VARIABLES "modalContainer", "usersContainer" Y 
    "bodyElement", CONTENER LAS CLASES "active", "show" Y "overflow" RESPECTIVAMENTE. ESTAS SE QUITARAN. */
    const bodyElement = document.querySelector("body")
    const hideUsers = (breakpoint) => {
        if (breakpoint.matches)
        {
            if (modalContainer.classList.contains("active"))
            {
                modalContainer.classList.remove("active")
                usersContainer.classList.remove("show")
                bodyElement.removeAttribute("class")
            }
        }
    }
    if (modalContainer)
    {
        addEventListener("resize", () => {
            hideUsers(wrapperBp)
        })
    }


    //------------------------ CODIGO DEL CHAT (WEBSOCKET)
    const usersBox = document.getElementById("users")
    const openWS = (nickName, token) => {
        ws = new WebSocket(`ws://localhost:9393/ws?nick=${nickName}&token=${token}`)
        ws.onopen = () => {
        }
        ws.onerror = () => {
        }
        ws.onmessage = e => {
            const data = JSON.parse(e.data)
            switch(true)
            {
                case data.type == "message" || data.type == "giphy":
                    userMessage(data)
                    break
                case data.type == "connect" || data.type == "disconnect":
                    userFinder(data.from, (data.type == "connect") ? "open" : "close")
                    break
            }
        }
        ws.onclose = () => {
            localStorage.clear()
            clearInterval(pongInterval)
            Router.navigate("/login")
        }
        let pongInterval = setInterval(() => {
            ws.send(JSON.stringify({type: "ping"}))
        },60000)
    }

    openWS(localStorage.getItem("username"), localStorage.getItem("token"))

    //---------- WS (MESSAGE)
    // EVENTO CON EL QUE ENVIO UN MENSAJE.
    const messageForm = document.getElementById("message-form")
    if (messageForm)
    {
        messageForm.addEventListener("submit", async e => {
            e.preventDefault()
            const target = e.target
            const message = target.userMessage.value
            if (message)
            {
                let body = null
                if (message.startsWith("/giphy "))
                {
                    const gif = message.substring(7)
                    const urlGif = await apiGif(gif)
                    if (urlGif != null)
                    {
                        body = {
                            type: "giphy",
                            data: urlGif
                        }
                        ws.send(JSON.stringify(body))
                    }
                }
                else
                {
                    body = {
                        type: "message",
                        data: message
                    }
                    ws.send(JSON.stringify(body))
                }
                messageForm.reset()
            }
        })
    }

    // FUNCION CON LA QUE LLAMO A LA API DE "GIPHY".
    const apiGif = async (gif) => {
        const apiKey = "Evm4Fr299dWNZirqufivprkQwl0B4KsW"
        const gyphyURL = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${gif}&limit=1`
        const header = new Headers()
        header.append("Content-type", "application/json")
        const params = {
            headers: header,
            mode: "cors",
            cache: "default"
        }
        try{
            const response = await fetch(gyphyURL, params)
            switch(response.status)
            {
                case 200:
                    const dataResponse = await response.json()
                    if (dataResponse.data.length > 0)
                    {
                        return dataResponse.data[0].images.fixed_height.url
                    }
                    else
                    {
                        return null
                    }
                default:
                    return null
            }
        }
        catch(e){
            console.log(e)
            return null
        }
    }

    // FUNCION CON LA QUE DIBUJO MENSAJES DEL USUARIO.
    const userMessage = (data) => {
        const userMessage =     `<div class="message">
                                    <img src="img/perfil.svg" alt="Avatar de usuario">
                                    <div class="message-info">
                                        <div class="user-info">
                                            <p class="user-name">${data.from}</p>
                                            <p class="user-time">${messageTime()}</p>
                                        </div>
                                        <div class="content">
                                            ${(data.type == "message") 
                                            ? `<p>${data.data}</p>`
                                            : `<img src=${data.data} alt="Gif animado">`}
                                        </div>
                                    </div>
                                </div>`
        messagesContainer.insertAdjacentHTML("beforeend", userMessage)
        messagesContainer.scrollTop = 0 - messagesContainer.scrollHeight
    }

    // FUNCION QUE DEVUELVE LA HORA EN LA QUE EL MENSAJE FUE CREADO.
    const messageTime = () => {
        const date = new Date()
        const hour = date.getHours()
        const minutes = checkTime(date.getMinutes())
        return `${hour}:${minutes}`
    }

    /* FUNCION QUE VERIFICA QUE LOS MINUTOS DEVUELTOS POR LA FUNCION "messageTime"; Y EN CASO DE SER UN NUMERO MENOR
    O IGUAL A 9, SE LO PRECEDE CON UN 0. */
    const checkTime = (minutes) => {
        if (minutes <= 9)
        {
            return `0${minutes}`
        }
        return minutes
    }

    //---------- WS (FUNCION USADA EN LOS METODOS "OPEN" Y "CLOSE")
    // FUNCION QUE BUSCA EL USUARIO QUE SE HAYA CONECTADO O DESCONECTADO DEL SERVIDOR, Y CAMBIA SU ESTADO.
    const userFinder = (nickName, method) => {
        const users = usersBox.getElementsByClassName("user")
        let b = 0
        for (let user of users)
        {
            if (user.querySelector(".user-name p").textContent == nickName)
            {
                b+=1
            }
            if (b > 0)
            {
                switch(method)
                {
                    case "open":
                        user.querySelector(".user-status p").textContent = "En línea"
                        break;
                    default:
                        user.querySelector(".user-status p").textContent = "Desconectado"
                }
                break;
            }
        }
        if (method == "open" && b == 0)
        {
            showUser(nickName)
        }
    }

    //---------- WS (OPEN)
    const showUser = (user) => {
        const templateHTML =    `<div class="user title">
                                    <div class="user-name">
                                        <p>${user}</p>
                                    </div>
                                    <div class="user-status">
                                        <p>En línea</p>
                                    </div>
                                </div>`
        usersBox.insertAdjacentHTML("beforeend", templateHTML)
    }

    //---------- WS (CLOSE)
    // EVENTO CON EL QUE CIERRO EL SERVIDOR.
    const closeButton = document.getElementById("wsButton")
    if (closeButton)
    {
        closeButton.addEventListener("click", () => {
            ws.close()
        })
    }
}