Y.namespace('notes').NoteView = Y.Base.create('noteView', Y.View, [], {
    _notesManager : null,
    _noteSerializer : null,
    _titleNode : null,
    _contentNode : null,

    initializer : function(config) {
        this._noteSerializer = Y.di.inject('NoteSerializer');
        this._notesManager = Y.di.inject('NotesManager');

        this._notesManager.readNotes();

        this._bindUI();
    },

    render : function() {
        switch (this._notesManager.getState()) {
            case Y.notes.NotesManager.State.UNKNOWN :
            case Y.notes.NotesManager.State.LOADING :
                this._uiShowLoading();
                break;

            case Y.notes.NotesManager.State.LOADED :
                this._uiShowNote();
                break;

            default :
                this._uiShowError();
        }

        return this;
    },

    _bindUI : function() {
        if (this._notesManager.getState() == Y.notes.NotesManager.State.UNKNOWN ||
            this._notesManager.getState() == Y.notes.NotesManager.State.LOADING) {

            this._notesManager.on('notesManager:noteRead', function(ev) {
                if (ev.note.id == this.get('id')) {
                    this._uiShowNote();
                }
            }, this);
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

    _uiShowError : function() {
        var container = this.get('container'),
            template = "" +
                "<div id='error-panel'>" +
                "   <div class='icon'><img alt='Error'/></div>" +
                "   <div class='message'>Could not load notes!</div>" +
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

        this._loadNote();
    },

    _loadNote : function() {
        var id = this.get('id');

        this._notesManager.getNote(id, Y.bind(this._onGetNote, this));
    },

    _onGetNote : function(note, error) {
        var text;

        if (note) {
            text = note.text;
            text = this._noteSerializer.convertToHtml(text);

            this._contentNode.appendChild(Y.Node.create(text));
        }
    }
}, {
    ATTRS : {
        id : null
    }
});
