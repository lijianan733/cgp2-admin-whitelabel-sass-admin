Ext.define('CGP.common.store.AllWebsite', {
    extend: 'Ext.data.Store',
    alias: 'widget.allwebsite',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'code',
            type: 'string'
        },
        {
            name: 'url',
            type: 'string'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/websites',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            const {params} = config;
            me.proxy.extraParams = params;
        }
        me.callParent(arguments);
    },
    autoLoad: true
});
