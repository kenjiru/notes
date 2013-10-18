var ManifestFile = Y.Base.create('manifestFile', Y.Base, [], {
    _dropboxProxy : null,
    _manifestObject : null,

    initializer : function(config) {
        this._dropboxProxy = Y.di.inject('DropboxProxy');
    },

    getManifest : function(callback) {
        if (this._manifestObject) {
            callback.call(null, this._manifestObject);
        } else {
            this._dropboxProxy.readFile('/manifest.xml', Y.bind(this._readManifestFile, this, callback));
        }
    },

    _readManifestFile : function(callback, error, data) {
        if (error) {
            console.log('could not read manifest file!');
            console.log(error);
            return;
        }

        console.log('Manifest file read successfully!');
        this._parseXmlFile(data, callback);
    },

    _parseXmlFile : function(data, callback) {
        var xmlDoc = Y.DataType.XML.parse(data),
            rootNode = xmlDoc.childNodes[0],
            revision = rootNode.getAttribute('revision'),
            notesMeta = {},
            notesLength = 0,
            node, noteId,
            manifestObject;

        for(var i=0; i<rootNode.childNodes.length; i++) {
            node = rootNode.childNodes[i];

            if (node.nodeType == 1) {
                noteId = node.getAttribute('id');

                notesMeta[noteId] = {
                    id : noteId,
                    revision : node.getAttribute('rev')
                };

                notesLength++;
            }
        }

        manifestObject = {
            revision : revision,
            notesMeta : notesMeta,
            notesLength : notesLength
        };

        this._manifestObject = manifestObject;

        callback.call(null, manifestObject);
    }
}, {
    ATTRS : {
        filePath : null
    }
});

Y.namespace('notes').ManifestFile = ManifestFile;
