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
                this._uiShowLogout();
            } else {
                this._uiShowLoginError();
            }
        }, this);
    },

    render : function() {
        var template = "<div id='message'></div>" +
            "<div id='login-panel' class='panel'>" +
            "   <input id='login-button' value='Login' type='button'/>" +
            "</div>"  +
            "<div id='logout-panel' class='panel'>" +
            "   <input id='logout-button' value='Logout' type='button'/>" +
            "</div>",
            contentNode = Y.Node.create(template),
            container = this.get('container');

        this._ui = {
            message : contentNode.one('#message'),
            loginPanel : contentNode.one('#login-panel'),
            logoutPanel : contentNode.one('#logout-panel'),
            loginButton : contentNode.one('#login-button'),
            logoutButton : contentNode.one('#logout-button')
        };

        contentNode.appendTo(container);

        this._bindUi();

        this._uiShowChecking();

        this._checkAuthentication();

        return this;
    },

    _bindUi : function() {
        this._ui.loginButton.on('click', this._login, this);
        this._ui.logoutButton.on('click', this._logout, this);
    },

    _uiShowChecking : function() {
        this._setMessage('Checking login status..');
    },

    _uiShowLogin : function() {
        this._setMessage('You are not logged in!');
        this._ui.logoutPanel.hide();
        this._ui.loginPanel.show();
    },

    _uiShowLogout : function() {
        this._setMessage('You are logged in!');
        this._ui.loginPanel.hide();
        this._ui.logoutPanel.show();
    },

    _uiShowLoginError : function() {
        this._setMessage('Error during authentication!');
    },

    _uiShowLogoutSuccess : function() {
        this._setMessage('You\'ve been logged out successfully!');
        this._ui.logoutPanel.hide();
        this._ui.loginPanel.show();
    },

    _uiShowLogoutFail : function() {
        this._setMessage('Failed to logout!');
    },

    _setMessage : function(msg) {
        this._ui.message.set('text', msg);
    },

    _login : function() {
        this._dropboxProxy.authenticate(function(ev){
            if (ev.authenticated) {
                this._uiShowLogout();
            } else {
                this._uiShowLoginError();
            }
        }, this);
    },

    _logout : function() {
        this._dropboxProxy.signOut(function(ev){
            if (ev.success) {
                this._uiShowLogoutSuccess();
            } else {
                this._uiShowLogoutFail();
            }
        }, this);
    }
});