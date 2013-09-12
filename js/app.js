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

    client.getAccountInfo(function(error, accountInfo) {
        if (error) {
            return console.log(error);  // Something went wrong.
        }

        document.writeln('Hello, ' + accountInfo.name + '!');
    });

    client.readdir("/", function(error, entries) {
        if (error) {
            return showError(error);  // Something went wrong.
        }

        document.writeln('Your Dropbox contains ' + (entries.join(', ') || '0') + ' items');
    });
});