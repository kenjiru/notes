var NotesInfoCache = Y.Base.create('notesInfoCache', Y.Base, [], {
    STORAGE_KEY : 'notes-info-cache',
    /**
     * An object that has the following structure:
     *  - revision - manifest revision
     *  - notesMap - a map of notes, with the id of the note as the key
     *      * id - note id
     *      * revision - note revision
     *      * title - note title
     *      * last-change-date - the date when the note was last changed
     */
    _manifestObject : null,

    initializer : function(config) {
//        this.resetCache();
        this._readFromCache();
//        this._mockCache();
    },

    _mockCache : function() {
        this._manifestObject = {
            revision : '3',
            notesMap : {
                '9f4cca5e-aaea-4268-9511-d27d496b1865' : {
                    'id' : '9f4cca5e-aaea-4268-9511-d27d496b1865',
                    'revision' : '0',
                    'title' : 'New Note Template',
                    'last-change-date' : '2013-10-06T23:00:52.5663410+02:00'
                },
                'ae2be171-5fd2-4845-b6a5-5cd41b19fc67' : {
                    'id' : 'ae2be171-5fd2-4845-b6a5-5cd41b19fc67',
                    'revision' : '1',
                    'title' : 'Duis volutpat eget',
                    'last-change-date' : '2013-10-06T23:00:52.5663410+02:00'
                },
                '82ea85e8-7f76-4071-ae73-2efe36ecef97' : {
                    'id' : '82ea85e8-7f76-4071-ae73-2efe36ecef97',
                    'revision' : '1',
                    'title' : 'Lorem Ipsum',
                    'last-change-date' : '2013-10-06T23:00:52.5663410+02:00'
                },
                '1794f7c1-96e7-474b-b41f-56e2da6f6e53' : {
                    'id' : '1794f7c1-96e7-474b-b41f-56e2da6f6e53',
                    'revision' : '2',
                    'title' : 'Phasellus volutpat',
                    'last-change-date' : '2013-10-06T23:00:52.5663410+02:00'
                },
                '6a7bca2e-a436-42f8-bd67-4b0380490ad7' : {
                    'id' : '6a7bca2e-a436-42f8-bd67-4b0380490ad7',
                    'revision' : '3',
                    'title' : 'Morbi rutrum libero',
                    'last-change-date' : '2013-10-06T23:00:52.5663410+02:00'
                },
                'e8dbffcb-d7f3-4b56-a69f-78eb9b2c8ae1' : {
                    'id' : 'e8dbffcb-d7f3-4b56-a69f-78eb9b2c8ae1',
                    'revision' : '4',
                    'title' : 'Sed scelerisque',
                    'last-change-date' : '2013-09-14T23:00:52.5663410+02:00'
                }
            }
        };
    },

    _readFromCache : function() {
        var cachedManifest = Y.StorageLite.getItem(this.STORAGE_KEY, true);

        if (cachedManifest) {
            this._manifestObject = cachedManifest;
        } else {
            this._manifestObject = {
                revision : null,
                notesMap : {}
            };
        }
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
        var noteInfo = this._manifestObject.notesMap[id];

        if (noteInfo) {
            noteInfo.hit = true;
        }

        return noteInfo;
    },

    persist : function() {
        this._cleanUp();
        this._persistCache();
    },

    _cleanUp : function() {
        var notesInfoMap = this._manifestObject.notesMap,
            noteInfo;

        for (var noteId in notesInfoMap) {
            if (notesInfoMap.hasOwnProperty(noteId)) {
                noteInfo = notesInfoMap[noteId];

                if (!noteInfo.hit) {
                    console.log('note with id: ' + noteInfo.id + ' title: ' + noteInfo.title + ' removed from cache!');

                    delete notesInfoMap[noteId];
                }
            }
        }
    },

    _persistCache : function() {
        console.log('object to be persisted: ');
        console.log(this._manifestObject);

        Y.StorageLite.setItem(this.STORAGE_KEY, this._manifestObject, true);
    },

    resetCache : function() {
        Y.StorageLite.setItem(this.STORAGE_KEY, null);
    }
});

Y.namespace('notes').NotesInfoCache = NotesInfoCache;
