var State = {
    UNKNOWN : 'unknown',
    LOADING : 'loading',
    LOADED : 'loaded',
    ERROR : 'error'
};

var NotesManager = Y.Base.create('notesManager', Y.Base, [], {
    _dropboxProxy : null,
    _notesModel : null,
    _notesLength : null,
    _notesRead : null,
    _internalState : null, // _state is used by Y.Base

    initializer : function(config) {
        this._dropboxProxy = Y.di.inject('DropboxProxy');
        this._notesModel = new Y.ModelList();
        this._notesRead = 0;
        this._internalState = State.UNKNOWN;

        this.publish('noteRead');
        this.publish('allNotesRead');
        this.publish('error');
    },

    /**
     * Reads the notes listed in the manifest file.
     */
    readNotes : function() {
        if (this._internalState !== State.LOADED) {
            this._readManifestFile();
        }
    },

    /**
     * Invalidates the notes and resets the state.
     */
    invalidateNotes : function() {
        this._notesModel.reset();
        this._internalState = State.UNKNOWN;

        this._notesLength = null;
        this._notesRead = 0;
    },

    _readManifestFile : function() {
        var manifestFile = new Y.notes.ManifestFile();

        manifestFile.readFile('/manifest.xml', Y.bind(this._onReadManifest, this));
    },

    _onReadManifest : function(manifest, error) {
        var notesInfo,
            noteFilePath;

        if (error) {
            this._internalState = State.ERROR;
            this.fire('error');

            return;
        }

        this._internalState = State.LOADING;

        notesInfo = manifest.notes;
        this._notesLength = notesInfo.length;

        for(var i=0; i<notesInfo.length; i++) {
            noteFilePath = this._getNotePath(notesInfo[i]);

            this._dropboxProxy.readFile(noteFilePath, Y.bind(this._readNoteFile, this, notesInfo[i].id));
        }
    },

    _readNoteFile : function(noteId, error, data) {
        if (error) {
            console.log('could not read manifest file!');
            console.log(error);

            return;
        }

        this._parseNoteFile(noteId, data);
    },

    _parseNoteFile : function(noteId, data) {
        var xmlDoc = Y.DataType.XML.parse(data),
            rootNode = xmlDoc.childNodes[0],
            revision = rootNode.getAttribute('revision'),
            note = {},
            node, nodeName,
            noteContentNode;

        for(var i=0; i<rootNode.childNodes.length; i++) {
            node = rootNode.childNodes[i];

            if (node.nodeType == 1) {
                nodeName = node.nodeName;

                if (nodeName === 'text') {
                    noteContentNode = node.childNodes[0];
                    // we add the namespaces here, as we might need them later

                    note[nodeName] = Y.DataType.XML.format(noteContentNode);
                } else {
                    note[nodeName] = node.textContent;
                }
            }
        }
        // save the id of the note
        note['id'] = noteId;

        this._notesModel.add(note);
        this._notesRead++;

        this.fire('noteRead', {
            note : note
        });

        if (this._notesRead == this._notesLength) {
            this._internalState = State.LOADED;
            this.fire('allNotesRead');
        }
    },

    _getNotePath : function(noteInfo) {
        return '/' + Math.floor(noteInfo.rev / 100) + '/' + noteInfo.rev + '/' + noteInfo.id + '.note';
    },

    getNotesModel : function() {
        return this._notesModel;
    },

    /**
     * Searches for the note id in the list of notes.
     * @param id Note id to search for.
     */
    getById : function(id) {
        return this._notesModel.getById(id);
    },

    /**
     * Exposes the internal state.
     * @returns {State} The current state.
     */
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
