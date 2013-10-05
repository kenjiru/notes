var ManifestFile = Y.Base.create('manifestFile', Y.Base, [], {
    _dropboxProxy : null,
    _callback : null,

    initializer : function(config) {
        this._dropboxProxy = Y.di.inject('DropboxProxy');
        this._notesArray = [];
    },

    readFile : function(file, callback) {
        this._callback = callback;
        this._dropboxProxy.readFile(file, Y.bind(this._readManifestFile, this));
    },

    getNotes : function() {
        return this._notesArray;
    },

    _readManifestFile : function(error, data) {
        if (error) {
            console.log('could not read manifest file!');
            console.log(error);
            return;
        }

        console.log('Manifest file read successfully!');
        this._parseXmlFile(data);
    },

    _parseXmlFile : function(data) {
        var xmlDoc = Y.DataType.XML.parse(data),
            rootNode = xmlDoc.childNodes[0],
            revision = rootNode.getAttribute('revision'),
            notes = [],
            node;

        for(var i=0; i<rootNode.childNodes.length; i++) {
            node = rootNode.childNodes[i];

            if (node.nodeType == 1) {
                notes.push({
                    id : node.getAttribute('id'),
                    rev : node.getAttribute('rev')
                })
            }
        }

        this._callback.call(null, {
            revision : revision,
            notes : notes
        });
    }
}, {
    ATTRS : {
        filePath : null
    }
});

Y.namespace('notes').ManifestFile = ManifestFile;
