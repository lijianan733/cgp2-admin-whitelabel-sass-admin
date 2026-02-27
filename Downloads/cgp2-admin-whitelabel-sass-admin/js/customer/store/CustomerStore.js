Ext.define("CGP.customer.store.CustomerStore", {
    extend: 'Ext.data.Store',
    requires: ["CGP.customer.model.Customer"],
    model: 'CGP.customer.model.Customer',
    storeId: 'CustStore',
    remoteSort: true,
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/users',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true,
    sorters: [
        {
            property: 'registerDate',
            direction: 'DESC'
        }
    ],
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        this.callParent(arguments);

    }
});
