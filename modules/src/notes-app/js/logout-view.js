Y.namespace('notes').LogoutView = Y.Base.create('logoutView', Y.View, [], {
    render : function() {
        this.get('container').set('text', 'Logout View');

        return this;
    }
});