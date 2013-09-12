Y.namespace('notes').DropboxDemo = Y.Base.create('dropboxDemo', Y.Base, [], {
    initializer : function() {
        var client = new Dropbox.Client({
            key: "yuq3vtwkkvqnaty"
        });

        client.authDriver(new Dropbox.AuthDriver.Popup({
            receiverUrl: "http://localhost:8080/oauth_receiver.html"}));

        client.authenticate(function(error, client) {
            if (error) {
                console.log('error authenticating!');
                return;
            }

            // client is a Dropbox.Client instance that you can use to make API calls.
            console.log('authentication successful!');
        });
    }
});