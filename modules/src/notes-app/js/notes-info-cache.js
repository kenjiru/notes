var NotesInfoCache = Y.Base.create('notesInfoCache', Y.Base, [], {
    STORAGE_KEY : 'notes-info-cache',
    /**
     * An object that has the following structure:
     *  - revision - manifest revision
     *  - notesMap - a map of notes, with the id of the note as the key
     *      * revision - note revision
     *      * title - note title
     *      * last-change-date - the date when the note was last changed
     */
    _manifestObject : null,

    initializer : function(config) {
//        this._readFromCache();
        this._mockCache();
    },

    _mockCache : function() {
        this._manifestObject = {
            revision : '3',
            notesMap : {
                '9f4cca5e-aaea-4268-9511-d27d496b1865' : {
                    'revision' : '0',
                    'title' : 'New Note Template',
                    'last-change-date' : '2013-10-06T23:00:52.5663410+02:00'
                },
                'ae2be171-5fd2-4845-b6a5-5cd41b19fc67' : {
                    'revision' : '1',
                    'title' : 'Duis volutpat eget',
                    'last-change-date' : '2013-10-06T23:00:52.5663410+02:00'
                },
                '82ea85e8-7f76-4071-ae73-2efe36ecef97' : {
                    'revision' : '1',
                    'title' : 'Lorem Ipsum',
                    'last-change-date' : '2013-10-06T23:00:52.5663410+02:00'
                },
                '1794f7c1-96e7-474b-b41f-56e2da6f6e53' : {
                    'revision' : '2',
                    'title' : 'Phasellus volutpat',
                    'last-change-date' : '2013-10-06T23:00:52.5663410+02:00'
                },
                '6a7bca2e-a436-42f8-bd67-4b0380490ad7' : {
                    'revision' : '3',
                    'title' : 'Morbi rutrum libero',
                    'last-change-date' : '2013-10-06T23:00:52.5663410+02:00'
                }
            }
        };
    },

    _readFromCache : function() {
        this._manifestObject = Y.StorageLite.getItem(this.STORAGE_KEY, true);
    },

    persist : function() {
        Y.StoreLite.setItem(this.STORAGE_KEY, this._manifestObject, true);
    },

    addNoteInfo : function(note) {
        this._manifestObject.notesMap[note.id] = {
            'id' : note['id'],
            'revision' : note['revision'],
            'title' : note['title'],
            'last-change-date' : note['last-change-date'],
            'hit' : true
        };
    },

    setRevision : function(revision) {
        this._manifestObject.revision = revision;
    },

    getRevision : function() {
        return this._manifestObject.revision;
    },

    getNoteInfo : function(id) {
        return this._manifestObject.notesMap[id];
    }
});

Y.namespace('notes').NotesInfoCache = NotesInfoCache;