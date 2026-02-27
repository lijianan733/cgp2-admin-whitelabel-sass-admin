Ext.define('Order.status.view.deliveritems.store.BoxSizeUnit', {
    extend: 'Ext.data.Store',
    model: 'Order.status.view.deliveritems.model.DeliverLineItem',
    proxy: {
        type: 'memory'
    }
})