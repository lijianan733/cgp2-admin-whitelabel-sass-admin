Ext.define('CGP.manufactureorderitem.store.ManufactureOrderItemStatusesStore', {
    extend: 'Ext.data.Store',
    requires : ["CGP.manufactureorderitem.model.ManufactureOrderItemStatusesModel"],
    model: 'CGP.manufactureorderitem.model.ManufactureOrderItemStatusesModel',
    pageSize: 25,
    autoLoad:true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/manufactureOrderItemStatuses',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    }
});