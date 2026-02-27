Ext.define('CGP.common.reprint.store.WorkOrderLineItemStorage', {

    url: adminPath + 'api/admin/workLineItem/{0}/storage',
    extend: 'Ext.data.Store',
    fields: [{
        name: 'storageId',
        type: 'int',
        useNull: true
    }, {
        name: 'qty',
        type: 'int'
    }, {
        name: 'storageName',
        type: 'string'
    }],

    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/admin/workLineItem/{0}/storage',
        reader: {
            type: 'json',
            root: 'data'
        },
        extraParams: {
            needNew: true
        }
    },
    autoLoad: true,

    constructor: function (config) {

        var me = this;

        var url = Ext.clone(me.url);

        me.proxy.url = Ext.String.format(url, config.id);
        if (config.needNew === false) {
            me.proxy.extraParams.needNew = false;
        } else {
            me.proxy.extraParams.needNew = true;
        }

        me.callParent(arguments);

    }
})