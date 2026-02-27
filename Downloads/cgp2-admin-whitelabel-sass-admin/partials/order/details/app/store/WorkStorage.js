Ext.define('CGP.orderdetails.store.WorkStorage', {
    extend: 'Ext.data.Store',

    fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    }, 'name'],

    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/admin/workStorage/{0}',
        reader: {
            type: 'json',
            root: 'data'
        }

    },
    autoLoad: true,

    url: adminPath + 'api/admin/workStorage/{0}',

    constructor: function (config) {

        var me = this;

        var url = Ext.clone(me.url);

        me.proxy.url = Ext.String.format(url, config.id);

        me.callParent(arguments);

    }


});