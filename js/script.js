addEventListener("DOMContentLoaded", () => {
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
    const asideSection = document.getElementById("aside")
    const messagesContainer = document.getElementById("messages-container")
    const chatDetails = document.getElementById("chat-details")
    const bodyContainer = document.getElementById("body")
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
})

