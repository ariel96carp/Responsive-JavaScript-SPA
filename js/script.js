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

    const mainSection = document.getElementById("main")
    if (mainSection)
    {
        let screenHeight = screen.height
        mainSection.style.setProperty("--container-height", `${screenHeight}px`)
        addEventListener("resize", () => {
            if (screen.height != screenHeight)
            {
                screenHeight = screen.height
                mainSection.style.setProperty("--container-height", `${screenHeight}px`)
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
})