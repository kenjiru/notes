Y.namespace('notes').SearchView = Y.Base.create('searchView', Y.View, [], {
    _app : null,
    _dropboxProxy : null,
    _dataTable : null,

    initializer : function() {
        this._app = Y.di.inject('App');
        this._dropboxProxy = Y.di.inject('DropboxProxy');
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
        this._populateDataTable();

        return this;
    },

    _createDataTable : function() {
        var container = this.get('container'),
            dataTable = new Y.DataTable({
                columns: ["name", "date"]
            });
        dataTable.render(container.one('#data-table-panel'));

        this._dataTable = dataTable;
    },

    _populateDataTable : function() {
        this._dataTable.addRows([
            { name : 'Foo', date : '12 Jun 2013' },
            { name : 'Bar', date : '04 Oct 2013' }
        ]);
    }
});