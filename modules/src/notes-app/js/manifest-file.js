var ManifestFile = Y.Base.create('manifestFile', Y.Base, [], {
    _dropboxProxy : null,

    initializer : function(config) {
        this._dropboxProxy = Y.di.inject('DropboxProxy');
    },

    readFile : function(file, callback) {
        this._dropboxProxy.readFile(file, Y.bind(this._readManifestFile, this, callback));
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
            notesMeta = [],
            node;

        for(var i=0; i<rootNode.childNodes.length; i++) {
            node = rootNode.childNodes[i];

            if (node.nodeType == 1) {
                notesMeta.push({
                    id : node.getAttribute('id'),
                    revision : node.getAttribute('rev')
                })
            }
        }

        callback.call(null, {
            revision : revision,
            notesMeta : notesMeta
        });
    }
}, {
    ATTRS : {
        filePath : null
    }
});

Y.namespace('notes').ManifestFile = ManifestFile;
