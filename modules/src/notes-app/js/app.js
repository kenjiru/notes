Y.namespace('notes').App = Y.Base.create('app', Y.App, [], {
    views : {
        'login' : {
            type : Y.notes.LoginView,
            preserve : true
        },
        'search' : {
            type : Y.notes.SearchView,
            preserve : true
        },
        'note' : {
            type : Y.notes.NoteView,
            preserve : false,
            parent : 'home'
        }
    },

    handleRoot : function(req) {
        console.log('root');
        this.showView('home');
    },

    handleLogin : function(req) {
        console.log('login');
        this.showView('login');
    },

    handleSearch : function(req) {
        console.log('search');
        this.showView('search');
    },

    handleNote : function(req) {
        console.log('note');
        this.showView('note');
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
                    path : '/search',
                    callbacks : 'handleSearch'
                } , {
                    path : '/note',
                    callbacks : 'handleNote'
                }
            ]
        }
    }
});