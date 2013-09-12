Y.namespace('notes').App = Y.Base.create('app', Y.App, [], {
    views : {
        'home' : {
            type : Y.notes.HomeView,
            preserve : true
        },
        'note' : {
            type : Y.notes.NoteView,
            preserve : false,
            parent : 'home'
        }
    },

    handleHome : function(req) {
        console.log('home');
        this.showView('home');
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
                    callbacks : 'handleHome'
                }, {
                    path : '/note',
                    callbacks : 'handleNote'
                }
            ]
        }
    }
});