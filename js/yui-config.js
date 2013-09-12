/**
 * This configuration is meant to be used from inside a web server.
 * It won't work if run from the local file system.
 */
YUI_config = {
    filter: "raw",
    debug: true,
    combine: true,
    base: 'http://yui.yahooapis.com/3.12.0/build/',

    groups: {
        NotesModules: {
            base: '/modules/build/',
            combine: false,

            modules: {
                'notes-app' : {},
                'dropbox-demo' : {}
            }
        },
        ExternalModules : {
            combine : false,
            modules : {
                'dropbox' : {
                    async: false,
                    fullpath : "//cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.10.1/dropbox.min.js"
                }
            }
        }
    }
};