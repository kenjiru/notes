Y.namespace('notes').LoginView = Y.Base.create('loginView', Y.View, [], {
    render : function() {
        this.get('container').set('text', 'Login View');
        this.get('container').append("<a href='/note'>Note</a>");

        return this;
    }
});