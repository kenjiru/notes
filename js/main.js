YUI().use('notes-app', 'dropbox-proxy', function(Y) {
    // configure the dependency injection
    Y.di.configure(function(injector){
        injector.bind('DropboxProxy').to(Y.notes.DropboxProxy).on(Y.di.Scope.SINGLETON);
    });

    var app = new Y.notes.App();
    app.render().dispatch();
});
