addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("main-menu-toggle")
    const usersContainer = document.getElementById("users-container")
    const modalContainer = document.getElementById("modal")
    if (toggleButton && usersContainer)
    {
        toggleButton.addEventListener("click", () => {
            usersContainer.classList.toggle("show")
            modalContainer.classList.toggle("active")
        })
    }

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

    const mediaBp = matchMedia("(min-width: 1024px)")
    const hideModal = (breakpoint) => {
        if (breakpoint.matches)
        {
            if (modalContainer.classList.contains("active"))
            {
                modalContainer.classList.toggle("active")
            }
        }
    }
    if (mediaBp)
    {
        addEventListener("resize", () => {
            hideModal(mediaBp)
        })
    }

    /* DEPENDIENDO DE SI SE CUMPLE O NO EL BREAKPOINT ALMACENADO EN LA VARIABLE "wrapperBp", REUBICO EL CONTENEDOR "wrapper" DENTRO DE
    LA ESTRUCTURA HTML. */
    const wrapperBp = matchMedia("(min-width: 750px)")
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
})