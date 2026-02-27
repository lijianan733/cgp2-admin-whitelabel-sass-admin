Ext.define('CGP.orderlineitem.store.OrderItemStatus', {
    extend: 'Ext.data.Store',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true
        },{
            name: 'name',
            type: 'string',
            convert: function(value,record){
                return i18n.getKey(value);
            }
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/orderItemStatuses/all',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    autoLoad: false
})