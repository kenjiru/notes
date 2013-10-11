Y.namespace('notes').SearchView = Y.Base.create('searchView', Y.View, [], {
    _app : null,
    _notesManager : null,
    _dataTable : null,

    initializer : function() {
        this._app = Y.di.inject('App');
        this._notesManager = Y.di.inject('NotesManager');

        this._notesManager.readNotes();
    },

    render : function() {
        var container = this.get('container'),
            template = "" +
                "<div class='header'>" +
                "   <button id='new-note-button'>New Note</button>" +
                "   <div id='user-info'>" +
                "       You are logged in as: <span id='user-name'>Foo</span>" +
                "       <a href='/logout'>Logout</a>" +
                "   </div>" +
                "</div>" +
                "<div class='search-panel'>" +
                "   <button id='search-button'>Search</button>" +
                "   <input id='search-input'/>" +
                "</div>" +
                "<div id='data-table-panel'></div>",
            node = Y.Node.create(template),
            className = Y.ClassNameManager.getClassName('search-view');

        container.append(node);
        container.addClass(className);

        this._createDataTable();

        return this;
    },

    _createDataTable : function() {
        var container = this.get('container'),
            dataTable = new Y.DataTable({
                recordType : [ "id", "title", "last-change-date", "create-date" ],
                columns : [
                    {
                        key: 'title',
                        label: 'Label',
                        formatter : function(o) {
                            var template = "<a href='/note/{id}'>{title}</a>";

                            return Y.substitute(template, o.data);
                        },
                        allowHTML : true
                    }, {
                        key : 'last-change-date',
                        label : 'Last changed'
                    }
                ],
                data : this._notesManager.getNotesModel()
            });
        dataTable.render(container.one('#data-table-panel'));

        this._dataTable = dataTable;
    },

    _onNotesRead : function() {
        console.log('All notes read!');
    }
});
