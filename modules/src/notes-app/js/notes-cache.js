var NotesCache = Y.Base.create('notesCache', Y.Base, [], {
    _dropboxProxy : null,
    _notesCache : {},
    _notesInfoCache : null,

    initializer : function(config) {
        this._dropboxProxy = Y.di.inject('DropboxProxy');
        this._notesInfoCache = new Y.notes.NotesInfoCache();
    },

    setRevision : function(revision) {
        this._notesInfoCache.setRevision(revision);
    },

    getNoteInfo : function(noteMeta, callback) {
        var noteInfo = this._notesInfoCache.getNoteInfo(noteMeta.id);

        if (noteInfo && (noteMeta.revision == noteInfo.revision || noteMeta.revision == null)) {
            console.log('note with id: ' + noteInfo.id + ' title: ' + noteInfo.title + ' found in cache!');

            callback.call(null, noteInfo);
        } else {
            console.log('note with id: ' + noteMeta.id + ' revision: ' + noteMeta.revision + ' NOT found in cache!');

            this.getNote(noteMeta, Y.bind(this._returnNoteInfo, this, callback));
        }
    },

    _returnNoteInfo : function(callback, note, error) {
        var noteInfo = {
            'id' : note['id'],
            'revision' : note['revision'],
            'title' : note['title'],
            'last-change-date' : note['last-change-date'],
            'hit' : true
        };

        callback.call(null, noteInfo);
    },

    getNote : function(noteMeta, callback) {
        var note = this._notesCache[noteMeta.id],
            noteFilePath;

        if (note) {
            callback.call(null, note);
        } else {
            noteFilePath = this._getNotePath(noteMeta);
            this._dropboxProxy.readFile(noteFilePath, Y.bind(this._onReadNoteFile, this, noteMeta, callback));
        }
    },

    _onReadNoteFile : function(noteMeta, callback, error, data) {
        var note;

        if (error) {
            console.log('Could NOT read note file ' + noteMeta.id);
            console.log(error);

            return;
        }

        note = this._parseNoteFile(data);
        // save the 'id' and the 'revision' from the noteMeta
        note['id'] = noteMeta.id;
        note['revision'] = noteMeta.revision;

        // add the note to the map
        this._notesCache[noteMeta.id] = note;
        this._notesInfoCache.addNoteInfo(note);

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

    _getNotePath : function(noteMeta) {
        return '/' + Math.floor(noteMeta.revision / 100) + '/' + noteMeta.revision + '/' + noteMeta.id + '.note';
    },

    persist : function() {
        this._notesInfoCache.persist();
    }
});

Y.namespace('notes').NotesCache = NotesCache;
