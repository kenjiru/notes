var State = {
    UNKNOWN : 'unknown',
    LOADING : 'loading',
    LOADED : 'loaded',
    ERROR : 'error'
};

var NotesManager = Y.Base.create('notesManager', Y.Base, [], {
    _dropboxProxy : null,
    _manifestFile : null,
    _notesInfoList : null,
    _notesCache : null,
    _notesLength : null,
    _notesProcessed : null,
    _internalState : null, // _state is used by Y.Base

    initializer : function(config) {
        this._dropboxProxy = Y.di.inject('DropboxProxy');
        this._manifestFile = new Y.notes.ManifestFile();
        this._notesInfoList = new Y.ModelList();
        this._notesCache = new Y.notes.NotesCache();
        this._notesProcessed = 0;
        this._internalState = State.UNKNOWN;
    },

    createNotesInfoList : function() {
        this._readManifestFile(Y.bind(this._getAllNotesInfo, this));
    },

    getNote : function(id, callback) {
        this._readManifestFile(Y.bind(this._getNote, this, id, callback));
    },

    _getNote : function(id, callback, manifest) {
        var noteMeta = manifest.notesMeta[id];

        this._notesCache.getNoteInfo(noteMeta, Y.bind(this._returnNote, this, callback));
    },

    _returnNote : function(callback, noteInfo) {
        this._notesCache.getNote(noteInfo, callback);
    },

    _readManifestFile : function(callback) {
        if (this._internalState == State.LOADED || this._internalState == State.LOADING) {
            callback.call(null, this._manifestFile.getManifest());
        } else {
            this._manifestFile.readFile('/manifest.xml', Y.bind(this._onReadManifest, this, callback));
        }
    },

    _onReadManifest : function(callback, manifest, error) {
        if (error) {
            this._internalState = State.ERROR;
            return;
        }

        this._notesCache.setRevision(manifest.revision);

        callback.call(null, manifest);
    },

    _getAllNotesInfo : function(manifest) {
        var notesMeta = manifest.notesMeta;

        this._internalState = State.LOADING;
        this._notesLength = manifest.notesLength;

        for (var noteId in notesMeta) {
            if (notesMeta.hasOwnProperty(noteId)) {
                this._notesCache.getNoteInfo(notesMeta[noteId], Y.bind(this._addNoteInfo, this));
            }
        }
    },

    _addNoteInfo : function(noteInfo) {
        this._notesInfoList.add(noteInfo);
        this._notesProcessed++;

        if (this._notesProcessed == this._notesLength) {
            this._internalState = State.LOADED;
            this._notesCache.persist();
        }
    },

    getNotesModel : function() {
        return this._notesInfoList;
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
