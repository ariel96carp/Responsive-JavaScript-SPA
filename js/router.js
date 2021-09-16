const Router = {
    routes: [],
    mode: null,
    root: '/',
    config: function(options) {
        this.mode = options && options.mode && options.mode == 'history' 
                    && !!(history.pushState) ? 'history' : 'hash';
        this.root = options && options.root ? '/' + this.clearSlashes(options.root) + '/' : '/';
        return this;
    },
    getFragment: function() {
        var fragment = '';
        if(this.mode === 'history') {
            fragment = this.clearSlashes(decodeURI(location.pathname + location.search));
            fragment = fragment.replace(/\?(.*)$/, '');
            fragment = this.root != '/' ? fragment.replace(this.root, '') : fragment;
        } else {
            var match = window.location.href.match(/#(.*)$/);
            fragment = match ? match[1] : '';
        }
        return this.clearSlashes(fragment);
    },
    clearSlashes: function(path) {
        return path.toString().replace(/\/$/, '').replace(/^\//, '');
    },
    add: function(re, handler) {
        if(typeof re == 'function') {
            handler = re;
            re = '';
        }
        this.routes.push({ re: re, handler: handler});
        return this;
    },
    remove: function(param) {
        for(var i=0, r; i<this.routes.length, r = this.routes[i]; i++) {
            if(r.handler === param || r.re.toString() === param.toString()) {
                this.routes.splice(i, 1); 
                return this;
            }
        }
        return this;
    },
    flush: function() {
        this.routes = [];
        this.mode = null;
        this.root = '/';
        return this;
    },
    check: function(f) {
        var fragment = f || this.getFragment();
        for(var i=0; i<this.routes.length; i++) {
            var match = fragment.match(this.routes[i].re);
            if(match) {
                match.shift();
                this.routes[i].handler.apply({}, match);
                return this;
            }           
        }
        return this;
    },
    listen: function() {
        var self = this;
        var current = self.getFragment();
        var fn = function() {
            if(current !== self.getFragment()) {
                current = self.getFragment();
                self.check(current);
            }
        }
        clearInterval(this.interval);
        this.interval = setInterval(fn, 50);
        return this;
    },
    navigate: function(path) {
        path = path ? path : '';
        if(this.mode === 'history') {
            history.pushState(null, null, this.root + this.clearSlashes(path));
        } else {
            window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
        }
        return this;
    }
}
    
// CONFIGURACION DEL ROUTER
Router.config({mode: 'history'});

// DEVOLVIENDO AL USUARIO AL ESTADO INICIAL
Router.navigate();

// AGREGANDO RUTAS
Router.add(/login/,function (){
    document.body.classList.add("body-login")
    document.body.innerHTML =   `<div class="modal login" id="modal-login">
                                        <div class="form-container s-90 m-60 l-40" id="form-container">
                                            <div class="register-status" id="register-status"></div>
                                            <h2>Formulario de Registro</h2>
                                            <form action="#" class="register-form" id="register-form" autocomplete="off">
                                                <input type="text" name="name" class="form-input" placeholder="Nombre" required>
                                                <input type="text" name="surname" class="form-input" placeholder="Apellido" required>
                                                <input type="text" name="username" class="form-input" placeholder="Usuario" required>
                                                <input type="password" name="password" class="form-input" placeholder="Contraseña" required>
                                                <p class="center-content">Estoy de acuerdo con Términos y Condiciones</p>
                                                <input type="submit" class="button" value="Registrarse">
                                            </form>
                                        <button class="cancel-button" id="cancel-button">Salir</button>
                                        </div>
                                    </div>
                                    <header></header>
                                    <main class="main-login wrapper">
                                        <div class="login-container s-90 lo-70 m-50 l-30">
                                            <div class="login-status" id="login-status"></div>
                                            <img src="img/5b557c57-8969-45ca-b880-a05441ca353b.png" class="center-block" alt="Logo de EDteam">
                                            <form action="#" class="form-login" id="form-login" autocomplete="off">
                                                <input type="text" name="username" class="form-input" placeholder="Usuario" required>
                                                <input type="password" name="password" class="form-input" placeholder="Contraseña" required>
                                                <input type="submit" class="button" value="Ingresar">
                                            </form>
                                            <button class="register-button" id="register-button">Crear Cuenta</button>
                                        </div>
                                    </main>
                                    <footer class="footer-login">
                                        <div class="wrapper">
                                            <p class="footer-title center-content">EDcamp Lima 2018 - 31 de agosto y 1ro de septiembre - EDteam </p>
                                            <ul class="media-container">
                                                <li class="media-item">
                                                    <a href="https://www.youtube.com/c/EDteam/videos" target="_blank">
                                                        <img src="img/008-youtube.svg" alt="Logo de Youtube">
                                                    </a>
                                                </li>
                                                <li class="media-item">
                                                    <a href="https://www.instagram.com/edteamlat/?hl=es" target="_blank">
                                                        <img src="img/011-instagram.svg" alt="Logo de Instagram">
                                                    </a>
                                                </li>
                                                <li class="media-item">
                                                    <a href="https://twitter.com/edteamlat?lang=es" target="_blank">
                                                        <img src="img/013-twitter.svg" alt="Logo de Twitter">
                                                    </a>
                                                </li>
                                                <li class="media-item">
                                                    <a href="https://es-la.facebook.com/EDteamLat/" target="_blank">
                                                        <img src="img/001-facebook.svg" alt="Logo de Facebook">
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                </footer>`
    loginCode()
}).add(/chat/,function (){
    document.body.classList.remove("body-login")
    document.body.innerHTML =   `<header></header>
                                    <div class="body-chat" id="body-chat">
                                        <aside>
                                            <div class="aside-chat wrapper" id="aside-chat">
                                                <img src="img/5b557c57-8969-45ca-b880-a05441ca353b.png" alt="Logo de EDteam">
                                                <div class="main-menu-toggle" id="main-menu-toggle"></div>
                                                <a href="#" class="button center-content" id="wsButton">Cerrar sesión</a>
                                                <div class="modal chat" id="modal"></div>
                                                <div class="users-container" id="users-container">
                                                    <h3 class="center-content">Usuarios conectados</h2>
                                                    <div class="users" id="users">
                                                        <div class="user title">
                                                            <div class="user-name">
                                                                <p>Dante Carrasco</p>
                                                            </div>
                                                            <div class="user-status">
                                                                <p>Desconectado</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    </div>
                                                </div>
                                        </aside>
                                        <main class="main-chat">
                                            <div class="chat-details wrapper" id="chat-details">
                                                <div class="chat-title">
                                                    <h1>Canal público</h1>
                                                </div>
                                                <div class="chat-subtitle">
                                                    <p>Sala general de comunicación</p>
                                                </div>
                                            </div>
                                            <div class="messages-container wrapper" id="messages-container"></div>
                                            <form action="#" class="message-form" id="message-form" autocomplete="off">
                                                <input type="text" class="message" name="userMessage" placeholder="Ingrese su mensaje">
                                                <input type="submit" class="button" value="Enviar">
                                            </form>
                                        </main>
                                    </div>
                                <footer></footer>`
    chatCode()
}).listen()

if (localStorage.getItem("token") === "tokenmuyseguro123456")
{
    Router.navigate("/chat")
}
else
{
    Router.navigate("/login")
}

