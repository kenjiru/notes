Y.namespace('notes').LoginView = Y.Base.create('loginView', Y.View, [], {
    _app : null,
    _dropboxProxy : null,

    initializer : function() {
        this._app = Y.di.inject('App');
        this._dropboxProxy = Y.di.inject('DropboxProxy');
    },

    _checkAuthentication : function() {
        this._dropboxProxy.isAuthenticated(function(ev){
            if (ev.authenticated) {
                this._uiShowLogoutButton();
            } else {
                this._uiShowLoginButton();
            }
        }, this);
    },

    render : function() {
        this._uiShowChecking();
        this._checkAuthentication();

        return this;
    },

    _uiShowChecking : function() {
        var container = this.get('container');

        container.set('text', 'Checking login status..');
    },

    _uiShowLoginButton : function() {
        var container = this.get('container'),
            loginButton = new Y.Button({
                label : 'Login'
            });

        container.set('text', 'You are not loggedin!');
        loginButton.render(container);
        loginButton.on('click', this._login, this);
    },

    _uiShowLogoutButton : function() {
        var container = this.get('container'),
            loginButton = new Y.Button({
                label : 'Login'
            });

        container.set('text', 'You are not loggedin!');
        loginButton.render(container);
        loginButton.on('click', this._logout, this);
    },

    _login : function() {
        console.log('login cliked!');
        this._dropboxProxy.authenticate();
    },

    _logout : function() {
    }
});