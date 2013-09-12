Y.namespace('notes').HomeView = Y.Base.create('homeView', Y.View, [], {
    render : function() {
        this.get('container').set('text', 'Home View');
        this.get('container').append("<a href='/note'>Note</a>");

        return this;
    }
});