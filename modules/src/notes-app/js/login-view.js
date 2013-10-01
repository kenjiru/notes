Y.namespace('notes').LoginView = Y.Base.create('loginView', Y.View, [], {
    _app : null,
    _dropboxProxy : null,
    _ui : null,

    initializer : function() {
        this._app = Y.di.inject('App');
        this._dropboxProxy = Y.di.inject('DropboxProxy');
    },

    _checkAuthentication : function() {
        this._dropboxProxy.isAuthenticated(function(ev){
            if (ev.authenticated) {
                this._uiShowLoginSuccess();
            } else {
                this._uiShowLogin();
            }
        }, this);
    },

    render : function() {
        var container = this.get('container'),
            template = "" +
                "<div id='message'>Checking login status..</div>" +
                "<div id='login-panel' class='panel'>" +
                "   <input id='login-button' value='Login' type='button'/>" +
                "</div>",
            contentNode = Y.Node.create(template);

        this._ui = {
            message : contentNode.one('#message'),
            loginPanel : contentNode.one('#login-panel'),
            loginButton : contentNode.one('#login-button')
        };

        contentNode.appendTo(container);

        this._bindUi();

        this._uiShowChecking();

        this._checkAuthentication();

        return this;
    },

    _bindUi : function() {
        this._ui.loginButton.on('click', this._login, this);
    },

    _uiShowChecking : function() {
        this._setMessage('Checking login status..');
        this._ui.loginPanel.hide();
    },

    _uiShowLogin : function() {
        this._setMessage('You are not logged in!');
        this._ui.loginPanel.show();
    },

    _uiShowLoginSuccess : function() {
        this._setMessage('You\'ve been logged in successfully!');
        this._ui.loginPanel.hide();

        Y.later(300, this, function() {
            this._app.navigate('search');
        });
    },

    _uiShowLoginError : function() {
        this._setMessage('Error during authentication!');
    },

    _setMessage : function(msg) {
        this._ui.message.set('text', msg);
    },

    _login : function() {
        this._dropboxProxy.authenticate(function(ev){
            if (ev.authenticated) {
                this._uiShowLoginSuccess();
            } else {
                this._uiShowLoginError();
            }
        }, this);
    }
});