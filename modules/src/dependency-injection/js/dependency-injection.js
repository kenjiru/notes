var Injector = Y.Base.create('injector', Y.Base, [], {
    _bindings : {},

    configure : function(configureCallback) {
        configureCallback.call(this, this);
    },

    bind : function(name) {
        var binding = new Binding({
            name : name
        });

        this._bindings[name] = binding;

        return binding;
    },

    inject : function(name) {
        var binding = this._bindings[name];

        if (!binding) {
            return null;
        }

        return binding.getInstance();
    }
}, {
    _injector : null,

    configure : function(configureCallback) {
        if (!Injector._injector) {
            Injector._injector = new Injector();
        }

        Injector._injector.configure(configureCallback);
    },

    inject : function(name) {
        return Injector._injector.inject(name);
    }
});

var Binding = Y.Base.create('binding', Y.Base, [], {
    _name : null,
    _implementation : null,
    _scope : null,
    _instance : null,

    initializer : function(config) {
        this._name = config.name;
        this._scope = Scope.PROTOTYPE;
    },

    to : function(implementation) {
        this._implementation = implementation;

        return this;
    },

    on : function(scope) {
        this._scope = scope;
    },

    getInstance : function() {
        if (this._scope == Scope.SINGLETON) {
            if (!this._instance) {
                this._instance = new this._implementation();
            }

            return this._instance;
        } else
        if (this._scope == Scope.PROTOTYPE) {
            return new this._implementation();
        }
    }
});

var Scope = {
    SINGLETON : 'singleton',
    PROTOTYPE : 'prototype'
};

Y.namespace('di').Scope = Scope;

Y.namespace('di').configure = Injector.configure;
Y.namespace('di').inject = Injector.inject;