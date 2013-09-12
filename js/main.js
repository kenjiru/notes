YUI().use('notes-app', function(Y){
    var app = new Y.notes.App();

    app.render().dispatch();
});