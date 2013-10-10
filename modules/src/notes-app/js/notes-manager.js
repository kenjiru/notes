var NotesManager = Y.Base.create('notesManager', Y.Base, [], {
    _dropboxProxy : null,
    _callback : null,
    _notesLength : null,
    _notesRead : null,
    _notesModel : null,

    initializer : function(config) {
        this._dropboxProxy = Y.di.inject('DropboxProxy');
        this._notesModel = Y.di.inject('NotesModel');
        this._notesRead = 0;
    },

    readNotes : function(callback) {
        this._callback = callback;

        this._readManifestFile();
    },

    _readManifestFile : function() {
        var manifestFile = new Y.notes.ManifestFile();

        manifestFile.readFile('/manifest.xml', Y.bind(this._onReadManifest, this));
    },

    _onReadManifest : function(manifest) {
        var notesInfo = manifest.notes,
            noteFilePath;

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

        note['id'] = noteId;

        this._notesModel.add(note);
        this._notesRead++;

        if (this._notesRead == this._notesLength) {
            this._callback.call(null);
        }
    },

    _getNotePath : function(noteInfo) {
        return '/' + Math.floor(noteInfo.rev / 100) + '/' + noteInfo.rev + '/' + noteInfo.id + '.note';
    },

    getById : function(id) {
        var note = this._notesModel.getById(id),
            text = note['text'];
    }
}, {
    ATTRS : {
        model : null
    }
});

Y.namespace('notes').NotesManager = NotesManager;
