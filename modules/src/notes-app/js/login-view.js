Y.namespace('notes').LoginView = Y.Base.create('loginView', Y.View, [], {
    _loginButton : null,

    render : function() {
        var container = this.get('container'),
            loginButton = new Y.Button({
                label : 'Login'
            });

        container.set('text', 'You are not loggedin!');
        loginButton.render(container);

        this._loginButton = loginButton;

        this._bindUI();

        return this;
    },

    _bindUI : function() {
        this._loginButton.on('click', this._login, this);
    },

    _login : function() {
        console.log('login cliked!');
        Y.notes.dropboxProxy.authenticate();
    }
});