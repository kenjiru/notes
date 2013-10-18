var NotesManager = Y.Base.create('notesManager', Y.Base, [], {
    _dropboxProxy : null,
    _manifestFile : null,
    _notesInfoList : null,
    _notesCache : null,
    _notesLength : null,
    _notesProcessed : null,

    initializer : function(config) {
        this._dropboxProxy = Y.di.inject('DropboxProxy');
        this._manifestFile = new Y.notes.ManifestFile();
        this._notesInfoList = new Y.ModelList();
        this._notesCache = new Y.notes.NotesCache();
        this._notesProcessed = 0;
    },

    createNotesInfoList : function() {
        this._manifestFile.getManifest(Y.bind(this._getAllNotesInfo, this));
    },

    getNote : function(id, callback) {
        this._manifestFile.getManifest(Y.bind(this._getNote, this, id, callback));
    },

    _getNote : function(id, callback, manifest) {
        var noteMeta = manifest.notesMeta[id];

        this._notesCache.getNoteInfo(noteMeta, Y.bind(this._returnNote, this, callback));
    },

    _returnNote : function(callback, noteInfo) {
        this._notesCache.getNote(noteInfo, callback);
    },

    _getAllNotesInfo : function(manifest) {
        var notesMeta = manifest.notesMeta;

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
            this._notesCache.persist();
        }
    },

    getNotesModel : function() {
        return this._notesInfoList;
    }
}, {
    ATTRS : {
        model : null
    }
});

Y.namespace('notes').NotesManager = NotesManager;
