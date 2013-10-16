var State = {
    UNKNOWN : 'unknown',
    LOADING : 'loading',
    LOADED : 'loaded',
    ERROR : 'error'
};

var NotesManager = Y.Base.create('notesManager', Y.Base, [], {
    _dropboxProxy : null,
    _notesInfoList : null,
    _notesCache : null,
    _notesLength : null,
    _notesProcessed : null,
    _internalState : null, // _state is used by Y.Base

    initializer : function(config) {
        this._dropboxProxy = Y.di.inject('DropboxProxy');
        this._notesInfoList = new Y.ModelList();
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
        var notesMeta;

        if (error) {
            this._internalState = State.ERROR;
            this.fire('error');

            return;
        }

        this._internalState = State.LOADING;

        notesMeta = manifest.notesMeta;
        this._notesLength = notesMeta.length;

        for(var i=0; i<notesMeta.length; i++) {
            this._notesCache.getNoteInfo(notesMeta[i], Y.bind(this._addNoteInfo, this));
        }
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
        this._notesCache.getNoteInfo({
            id : id,
            version : null
        }, Y.bind(this._returnNote, this, callback));
    },

    _returnNote : function(callback, noteInfo) {
        this._notesCache.getNote(noteInfo, callback);
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
