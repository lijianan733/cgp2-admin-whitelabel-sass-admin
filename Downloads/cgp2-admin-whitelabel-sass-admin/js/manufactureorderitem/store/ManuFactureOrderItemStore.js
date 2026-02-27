Ext.define('CGP.manufactureorderitem.store.ManuFactureOrderItemStore', {
    extend: 'Ext.data.Store',
    requires : ["CGP.manufactureorderitem.model.ManuFactureOrderItemModel"],
    model: 'CGP.manufactureorderitem.model.ManuFactureOrderItemModel',
    pageSize: 25,
    autoLoad:true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/manufactureOrderItems',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    }
});