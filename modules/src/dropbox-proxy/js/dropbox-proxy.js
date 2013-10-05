// this class hidden from the rest of the modules
Y.namespace('notes').DropboxProxy = Y.Base.create('dropboxProxy', Y.Base, [], {
    _client : null,
    _isAuthenticated : false,

    initializer : function() {
        this._client = new Dropbox.Client({
            key: "yuq3vtwkkvqnaty"
        });
    },

    isAuthenticated : function(callback, context) {
        context = context || null;

        this._client.authenticate({interactive: false}, function(error, client) {
            if (error) {
                return this._handleError(error);
            }
            if (client.isAuthenticated()) {
                this._isAuthenticated = true;
            }

            callback.call(context, {
                authenticated : this._isAuthenticated
            });
        });
    },

    authenticate : function(callback, context) {
        this._client.authDriver(new Dropbox.AuthDriver.Popup({
            receiverUrl: "http://localhost:8080/oauth_receiver.html"}));

        this._client.authenticate(function(error, client) {
            if (error) {
                this._isAuthenticated = false;
                this._handleError(error);
            } else {
                this._isAuthenticated = true;
            }

            callback.call(context, {
                authenticated : this._isAuthenticated
            })
        });
    },

    signOut : function(callback, context) {
        this._client.signOut(null, function(error){
            callback.call(context, {
                success : !error
            });
        });
    },

    readFile : function(fileName, callback) {
        this._client.readFile(fileName, callback);
    },

    _handleError : function(error) {
        console.log(error);
    }
});
