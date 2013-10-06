Y.namespace('notes').App = Y.Base.create('app', Y.App, [], {
    _dropboxProxy : null,
    _redirectUrl : null,

    views : {
        'login' : {
            type : Y.notes.LoginView,
            preserve : false
        },
        'logout' : {
            type : Y.notes.LogoutView,
            preserve : false
        },
        'search' : {
            type : Y.notes.SearchView,
            preserve : true
        },
        'note' : {
            type : Y.notes.NoteView,
            preserve : false,
            parent : 'search'
        }
    },

    initializer : function() {
        this._dropboxProxy = Y.di.inject('DropboxProxy');
    },

    handleRoot : function(req) {
        console.log('root');

        this.showView('login');
    },

    handleLogin : function(req) {
        console.log('login');
        this.showView('login', {
            redirectUrl : this._redirectUrl
        });

        if (this._redirectUrl) {
            this._redirectUrl = null;
        }
    },

    handleLogout : function(req) {
        console.log('logout');
        this.showView('logout');
    },

    handleSearch : function(req) {
        console.log('search');
        this._showViewIfAuthenticated('search');
    },

    handleNote : function(req) {
        console.log('note');
        this._showViewIfAuthenticated('note', {
            id :req.params.id
        });
    },

    _showViewIfAuthenticated : function(viewName, viewConfig) {
        this._dropboxProxy.isAuthenticated(function(ev){
            if (ev.authenticated) {
                this.showView(viewName, viewConfig);
            } else {
                this._redirectUrl = viewName;
                this.navigate('login');
            }
        }, this);
    }
}, {
    ATTRS : {
        root : {
            value : '/'
        },
        serverRouting : true,
        routes : {
            value : [
                {
                    path : '/',
                    callbacks : 'handleRoot'
                }, {
                    path : '/login',
                    callbacks : 'handleLogin'
                }, {
                    path : '/logout',
                    callbacks : 'handleLogout'
                }, {
                    path : '/search',
                    callbacks : 'handleSearch'
                } , {
                    path : '/note/:id',
                    callbacks : 'handleNote'
                }
            ]
        }
    }
});
