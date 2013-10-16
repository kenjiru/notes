var State = {
    UNKNOWN : 'unknown',
    LOADING : 'loading',
    LOADED : 'loaded',
    ERROR : 'error'
};

var NotesManager = Y.Base.create('notesManager', Y.Base, [], {
    _dropboxProxy : null,
    _notesInfoList : null,
    _notesInfoCache : null,
    _notesCache : null,
    _notesLength : null,
    _notesProcessed : null,
    _internalState : null, // _state is used by Y.Base

    initializer : function(config) {
        this._dropboxProxy = Y.di.inject('DropboxProxy');
        this._notesInfoList = new Y.ModelList();
        this._notesInfoCache = new Y.notes.NotesInfoCache();
        this._notesCache = new Y.notes.NotesCache();
        this._notesProcessed = 0;
        this._internalState = State.UNKNOWN;

        this.publish('noteRead');
        this.publish('allNotesRead');
        this.publish('error');
    },

    readNotes : function() {
        if (this._internalState !== State.LOADED) {
            this._readManifestFile();
        }
    },

    _readManifestFile : function() {
        var manifestFile = new Y.notes.ManifestFile();

        manifestFile.readFile('/manifest.xml', Y.bind(this._onReadManifest, this));
    },

    _onReadManifest : function(manifest, error) {
        var notesInfo;

        if (error) {
            this._internalState = State.ERROR;
            this.fire('error');

            return;
        }

        this._internalState = State.LOADING;

        notesInfo = manifest.notesArray;
        this._notesLength = notesInfo.length;

        for(var i=0; i<notesInfo.length; i++) {
            this._processNoteInfo(notesInfo[i]);
        }
    },

    _processNoteInfo : function(noteInfo) {
        var cachedNoteInfo = this._notesInfoCache.getNoteInfo(noteInfo.id);

        if (!cachedNoteInfo || cachedNoteInfo.revision !== noteInfo.revision) {
            console.log('Note ' + noteInfo.id + ' NOT found in cache!');

            this._notesCache.getNote(noteInfo, Y.bind(this._onGetNote, this));
        } else {
            console.log('Note ' + noteInfo.id + ' found in cache!');

            cachedNoteInfo.id = noteInfo.id;
            cachedNoteInfo.hit = true;

            this._addNoteInfo(cachedNoteInfo);
        }
    },

    _onGetNote : function(note, error) {
        // add the note info to cache
        this._notesInfoCache.addNoteInfo(note);

        this._addNoteInfo({
            'id' : note['id'],
            'revision' : note['revision'],
            'title' : note['title'],
            'last-change-date' : note['last-change-date']
        });
    },

    _addNoteInfo : function(noteInfo) {
        this._notesInfoList.add(noteInfo);
        this._notesProcessed++;

        this.fire('noteRead', {
            note : noteInfo,
            cached : false
        });

        if (this._notesProcessed == this._notesLength) {
            this._internalState = State.LOADED;
            this.fire('allNotesRead');
        }
    },

    getNotesModel : function() {
        return this._notesInfoList;
    },

    getNote : function(id, callback) {
        var noteInfo = this._notesInfoCache.getNoteInfo(id);

        return this._notesCache.getNote(noteInfo, callback);
    },

    getState : function() {
        return this._internalState;
    }
}, {
    ATTRS : {
        model : null
    },

    State : State
});

Y.namespace('notes').NotesManager = NotesManager;
