Y.namespace('notes').NoteView = Y.Base.create('noteView', Y.View, [], {
    render : function() {
        this.get('container').set('text', 'Note View');

        return this;
    }
});