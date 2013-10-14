var State = {
    UNKNOWN : 'unknown',
    LOADING : 'loading',
    LOADED : 'loaded',
    ERROR : 'error'
};

var NotesManager = Y.Base.create('notesManager', Y.Base, [], {
    _dropboxProxy : null,
    _manifestCache : null,
    _notesInfoList : null,
    _notesLength : null,
    _notesProcessed : null,
    _internalState : null, // _state is used by Y.Base

    initializer : function(config) {
        this._dropboxProxy = Y.di.inject('DropboxProxy');
        this._manifestCache = new Y.notes.ManifestCache();
        this._notesInfoList = new Y.ModelList();
        this._notesProcessed = 0;
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
        this._notesInfoList.reset();
        this._internalState = State.UNKNOWN;

        this._notesLength = null;
        this._notesProcessed = 0;
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
        var cachedNoteInfo = this._manifestCache.getNoteInfo(noteInfo.id),
            noteFilePath;

        if (!cachedNoteInfo || cachedNoteInfo.revision !== noteInfo.revision) {
            console.log('Note ' + noteInfo.id + ' NOT found in cache!');

            noteFilePath = this._getNotePath(noteInfo);
            this._dropboxProxy.readFile(noteFilePath, Y.bind(this._readNoteFile, this, noteInfo.id));
        } else {
            console.log('Note ' + noteInfo.id + ' found in cache!');

            cachedNoteInfo.id = noteInfo.id;
            cachedNoteInfo.hit = true;

            this._addNoteInfo(cachedNoteInfo);
        }
    },

    _readNoteFile : function(noteId, error, data) {
        if (error) {
            console.log('Could NOT read note file ' + noteId);
            console.log(error);

            return;
        }

        this._parseNoteFile(noteId, data);
    },

    _parseNoteFile : function(noteId, data) {
        var xmlDoc = Y.DataType.XML.parse(data),
            rootNode = xmlDoc.childNodes[0],
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
        // add the note info to cache
        this._manifestCache.addNoteInfo(note);

        this._addNoteInfo(note);
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

    _getNotePath : function(noteInfo) {
        return '/' + Math.floor(noteInfo.revision / 100) + '/' + noteInfo.revision + '/' + noteInfo.id + '.note';
    },

    getNotesModel : function() {
        return this._notesInfoList;
    },

    /**
     * Searches for the note id in the list of notes.
     * @param id Note id to search for.
     */
    getNote : function(id) {
        return this._notesInfoList.getById(id);
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
