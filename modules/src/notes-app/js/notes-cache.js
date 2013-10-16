var NotesCache = Y.Base.create('notesCache', Y.Base, [], {
    _dropboxProxy : null,
    _notesMap : {},

    initializer : function(config) {
        this._dropboxProxy = Y.di.inject('DropboxProxy');
    },

    getNote : function(noteInfo, callback) {
        var note = this._notesMap[noteInfo.id],
            noteFilePath;

        if (note) {
            callback.call(null, note);
        } else {
            noteFilePath = this._getNotePath(noteInfo);
            this._dropboxProxy.readFile(noteFilePath, Y.bind(this._onReadNoteFile, this, noteInfo.id, callback));
        }
    },

    _onReadNoteFile : function(noteId, callback, error, data) {
        var note;

        if (error) {
            console.log('Could NOT read note file ' + noteId);
            console.log(error);

            return;
        }

        note = this._parseNoteFile(data);
        // save the id of the note
        note['id'] = noteId;

        // add the note to the map
        this._notesMap[noteId] = note;

        callback.call(null, note);
    },

    _parseNoteFile : function(data) {
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

        return note;
    },

    _getNotePath : function(noteInfo) {
        return '/' + Math.floor(noteInfo.revision / 100) + '/' + noteInfo.revision + '/' + noteInfo.id + '.note';
    }
});

Y.namespace('notes').NotesCache = NotesCache;