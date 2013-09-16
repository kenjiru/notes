// this class hidden from the rest of the modules
var DropboxProxy = Y.Base.create('dropboxProxy', Y.Base, [], {
    _client : null,
    _isAuthenticated : false,

    initializer : function() {
        this._client = new Dropbox.Client({
            key: "yuq3vtwkkvqnaty"
        });

        this._client.authenticate({interactive: false}, function(error, client) {
            if (error) {
                return this._handleError(error);
            }
            if (client.isAuthenticated()) {
                this._isAuthenticated = true;
            }
        });
    },

    authenticate : function() {
        this._client.authDriver(new Dropbox.AuthDriver.Popup({
            receiverUrl: "http://localhost:8080/oauth_receiver.html"}));

        this._client.authenticate(function(error, client) {
            if (error) {
                this._handleError(error);
                return;
            }

            this._isAuthenticated = true;

            // client is a Dropbox.Client instance that you can use to make API calls.
            console.log('authentication successful!');
        });
    },

    isAuthenticated : function() {
        return this._isAuthenticated;
    },

    _handleError : function(error) {
        console.log(error);
    }
});

// the only object exposed
Y.namespace('notes').dropboxProxy = new DropboxProxy();