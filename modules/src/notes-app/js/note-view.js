Y.namespace('notes').NoteView = Y.Base.create('noteView', Y.View, [], {
    _notesModel : null,
    _noteSerializer : null,
    _titleNode : null,
    _contentNode : null,

    initializer : function(config) {
        this._notesModel = Y.di.inject('NotesModel');
        this._noteSerializer = Y.di.inject('NoteSerializer');
    },

    render : function() {
        var container = this.get('container'),
            template = "" +
                "<div>" +
                "   <div id='note-title'></div>" +
                "   <div id='note-content'></div>" +
                "</div>",
            contentNode = Y.Node.create(template);

        this._titleNode = contentNode.one('#note-title');
        this._contentNode = contentNode.one('#note-content');

        container.append(contentNode);

        this._loadNote();

        return this;
    },

    _loadNote : function() {
        var id = this.get('id'),
            note = this._notesModel.getById(id),
            text;

        if (note) {
            text = note.get('text');
            text = this._noteSerializer.convertToHtml(text);

            this._contentNode.appendChild(Y.Node.create(text));
        }
    }
}, {
    ATTRS : {
        id : null
    }
});