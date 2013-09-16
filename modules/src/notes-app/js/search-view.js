Y.namespace('notes').SearchView = Y.Base.create('searchView', Y.View, [], {
    render : function() {
        this.get('container').set('text', 'Search View');
        this.get('container').append("<a href='/note'>Note</a>");

        return this;
    }
});