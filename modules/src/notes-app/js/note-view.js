Y.namespace('notes').NoteView = Y.Base.create('noteView', Y.View, [], {
    _notesManager : null,
    _noteSerializer : null,
    _titleNode : null,
    _contentNode : null,

    initializer : function(config) {
        this._noteSerializer = Y.di.inject('NoteSerializer');
        this._notesManager = Y.di.inject('NotesManager');
    },

    render : function() {
        this._uiShowLoading();
        this._loadNote();

        return this;
    },

    _loadNote : function() {
        var id = this.get('id');

        this._notesManager.getNote(id, Y.bind(this._onGetNote, this));
    },

    _onGetNote : function(note, error) {
        var text;

        if (note) {
            this._uiShowNote();

            text = note.text;
            text = this._noteSerializer.convertToHtml(text);

            this._contentNode.appendChild(Y.Node.create(text));
        }
    },

    _uiShowLoading : function() {
        var container = this.get('container'),
            template = "" +
                "<div id='loading-panel'>" +
                "   <div class='icon'><img alt='Loading'/></div>" +
                "   <div class='message'>Loading notes..</div>" +
                "</div>";

        container.empty();
        container.append(template);
    },

    _uiShowNote : function() {
        var container = this.get('container'),
            template = "" +
                "<div>" +
                "   <div id='note-title'></div>" +
                "   <div id='note-content'></div>" +
                "</div>",
            contentNode = Y.Node.create(template);

        this._titleNode = contentNode.one('#note-title');
        this._contentNode = contentNode.one('#note-content');

        container.empty();
        container.append(contentNode);
    }
}, {
    ATTRS : {
        id : null
    }
});
