Ext.create('Ext.data.Store', {
    storeId: 'paymentMethod',
    model: 'CGP.model.PaymentModule',
    remoteSort: false,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/paymentModules',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    sorters: [{
        property: 'sortOrder',
        direction: 'ASC'
    }],
    listeners: {
        update: function (me, record, operation, modifiedFieldNames, eOpts) {
            me.sort('sortOrder', 'ASC');
        }
    }
});

Ext.create("Ext.data.Store", {
    fields: ["code", "configInfo"],
    storeId: 'configurableStore',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/paymentModules/allpaymentmethod',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})
var orderStatusStore = Ext.create('CGP.common.store.OrderStatuses', {
    storeId: "orderStatusStore",
    autoLoad: true,
    allowNull: true,
});
//	orderStatusStore.load();