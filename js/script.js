addEventListener("DOMContentLoaded", () => {
    // VARIABLES DE API
    const apiURL = "http://localhost:9393"
    const apiRegister = `${apiURL}/api/v1/register`
    const apiLogin = `${apiURL}/api/v1/login`

    //--- CODIGO DEL LOGIN (API-REGISTRO)
    // EVENTO CON EL QUE REALIZO EL REGISTRO DEL USUARIO
    const registerForm = document.getElementById("register-form")
    if (registerForm)
    {
        registerForm.addEventListener("submit", e => {
            e.preventDefault()
            const target = e.target
            registerFetch(apiRegister,target)
        })
    }

    // FUNCION CON LA QUE LLAMO A LA API
    const registerFetch = async (url, target) => {
        const statusDiv = document.getElementById("register-status")
        const params = getParams(target)
        const response = await fetch(url,params)
        drawMessage("Realizando petición...",statusDiv)
        switch(response.status)
        {
            case 201:
                setTimeout(() => {
                    drawMessage("¡Registro exitoso!","ok",statusDiv)
                    setTimeout(() => {
                        closeRegister(statusDiv)
                    },1000);
                },2000)
                break;
            default:
                setTimeout(() => {
                    drawMessage("Registro fallido","error",statusDiv)
                    setTimeout(() => {
                        closeRegister(statusDiv)
                    },1000);
                },2000)
        }
    }

    // FUNCION CON LA QUE CREO LOS PARAMETROS DE LA LLAMADA A LA API
    const getParams = (target) => {
        const data = {
            nick_name: target.username.value,
            password: target.password.value
        }
        
        const header = new Headers()
        header.append("Content-type","application/json")
        
        const params = {
            method: "POST",
            headers: header,
            cache: "default",
            body: JSON.stringify(data)
        }
        return params
    }

    // FUNCION CON LA QUE DIBUJO MENSAJES EN EL DOM
    const drawMessage = (...data) => {
        let templateMessage 
        switch(data.length)
        {
            case 2:
                data[1].innerHTML = ""
                templateMessage = `<p class="system-message center-block">
                                            ${data[0]}
                                        </p>`
                data[1].insertAdjacentHTML("beforeend", templateMessage) 
                break;
            default:
                data[2].innerHTML = ""
                templateMessage = `<p class="system-message ${data[1]} center-block">
                                            ${data[0]}
                                        </p>`
                data[2].insertAdjacentHTML("beforeend", templateMessage)
        }                   
    }

    // FUNCION CON LA QUE CIERRO EL REGISTRO
    const closeRegister = (element) => {
        element.innerHTML = ""
        registerForm.reset()
        modalLogin.classList.toggle("active")
        formContainer.classList.toggle("active")
    }

    //--- CODIGO DEL LOGIN (API-LOGIN)
    const formLogin = document.getElementById("form-login")
    formLogin.addEventListener("submit", e => {
        if (formLogin)
        {
            e.preventDefault()
            const target = e.target
            
        }
    })



    //--- CODIGO DEL CHAT (LAYOUT)
    // BOTON CON EL QUE EN PANTALLAS CHICAS, SE VISUALIZAN LOS USUARIOS CONECTADOS.
    const toggleButton = document.getElementById("main-menu-toggle")
    const usersContainer = document.getElementById("users-container")
    const modalContainer = document.getElementById("modal")
    if (toggleButton && usersContainer && modalContainer)
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
    const wrapperBp = matchMedia("(min-width: 700px)")
    const asideSection = document.getElementById("aside-chat")
    const messagesContainer = document.getElementById("messages-container")
    const chatDetails = document.getElementById("chat-details")
    const bodyContainer = document.getElementById("body-chat")
    const toggleWrapper = (breakpoint) => {
        if (breakpoint.matches)
        {
            if (asideSection.classList.contains("wrapper"))
            {
                asideSection.classList.toggle("wrapper")
                messagesContainer.classList.toggle("wrapper")
                chatDetails.classList.toggle("wrapper")
                bodyContainer.classList.toggle("wrapper")
            }
        }
        else if (asideSection.classList.contains("wrapper") == false)
        {
            asideSection.classList.toggle("wrapper")
            messagesContainer.classList.toggle("wrapper")
            chatDetails.classList.toggle("wrapper")
            bodyContainer.classList.toggle("wrapper")
        }
    }
    if (wrapperBp && asideSection && messagesContainer && chatDetails && bodyContainer)
    {
        toggleWrapper(wrapperBp)
        addEventListener("resize", () => {
            toggleWrapper(wrapperBp)
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
    if (wrapperBp && modalContainer && usersContainer && bodyElement)
    {
        addEventListener("resize", () => {
            hideUsers(wrapperBp)
        })
    }

    //--- CODIGO DEL LOGIN
    // BOTON CON EL QUE SE ABRE EL MODAL
    const registerButton = document.getElementById("register-button")
    const modalLogin = document.getElementById("modal-login")
    const formContainer = document.getElementById("form-container")
    if (registerButton && modalLogin && formContainer)
    {
        registerButton.addEventListener("click", () => {
            modalLogin.classList.toggle("active")
            formContainer.classList.toggle("active")
        })
    }

    // BOTON CON EL QUE SE CIERRA EL MODAL
    const cancelButton = document.getElementById("cancel-button")
    if (cancelButton && modalLogin && formContainer)
    {
        cancelButton.addEventListener("click", () => {
            modalLogin.classList.toggle("active")
            formContainer.classList.toggle("active")
        })
    }
})

