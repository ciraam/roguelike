const information = document.getElementById('info')
information.innerText = `Cette application utilise Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), et Electron (v${versions.electron()})`
// information.style.height = "90%";
const func = async () => {
    const response = await window.versions.ping()
    console.log(response) // Affichera 'pong'
}
func()

// test depuis le renderer
// const NOTIFICATION_TITLE = 'Notification test depuis le renderer.js'
// const NOTIFICATION_BODY = 'test depuis le renderer.js'
// new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY })
  
