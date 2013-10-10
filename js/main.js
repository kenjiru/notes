YUI().use('notes-app', 'dropbox-proxy', 'model-list', function(Y) {
    // configure the dependency injection
    Y.di.configure(function(injector){
        injector.bind('DropboxProxy').to(Y.notes.DropboxProxy).on(Y.di.Scope.SINGLETON);
        injector.bind('App').to(Y.notes.App).on(Y.di.Scope.SINGLETON);
        injector.bind('NotesModel').to(Y.ModelList).on(Y.di.Scope.SINGLETON);
        injector.bind('NoteSerializer').to(Y.notes.NoteSerializer).on(Y.di.Scope.SINGLETON);
    });

    var app = Y.di.inject('App');

    app.render().dispatch();
});
