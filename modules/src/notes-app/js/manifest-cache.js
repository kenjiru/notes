var ManifestCache = Y.Base.create('manifestCache', Y.Base, [], {
    STORAGE_KEY : 'manifest-cache',
    /**
     * An object that has the following structure:
     *  - revision - manifest revision
     *  - notes - a map of notes, with the id of the note as the key
     *      * revision - note revision
     *      * title - note title
     */
    _manifestObject : null,
    _notes : null,

    initializer : function(config) {
        this._readFromCache();
    },

    _readFromCache : function() {
        this._manifestObject = Y.StorageLite.getItem(this.STORAGE_KEY, true);
    },

    persist : function() {
        Y.StoreLite.setItem(this.STORAGE_KEY, this._manifestObject, true);
    },

    addNote : function(note) {
        this._manifestObject.notes[note.id] = {
            revision : note.revision,
            title : note.title
        };
    },

    setRevision : function(revision) {
        this._manifestObject.revision = revision;
    },

    getRevision : function() {
        return this._manifestObject.revision;
    },

    getNoteInfo : function(id) {
        return this._manifestObject.notes[id];
    }
});
