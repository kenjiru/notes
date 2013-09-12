YUI().use('notes-app', 'dropbox-demo', function(Y){
    var app = new Y.notes.App();
    app.render().dispatch();

    var dropboxDemo = new Y.notes.DropboxDemo();
});