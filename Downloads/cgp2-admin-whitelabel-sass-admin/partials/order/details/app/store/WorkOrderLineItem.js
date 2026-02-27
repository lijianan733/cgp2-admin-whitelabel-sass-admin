Ext.define('CGP.orderdetails.store.WorkOrderLineItem', {
    requires: ['CGP.orderdetails.model.WorkOrderLineItem'],
    extend: 'Ext.data.Store',
    model: 'CGP.orderdetails.model.WorkOrderLineItem',
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/admin/workLineItem',
        reader: {
            type: 'json',
            root: 'data.content'
        },
        extraParams: {
            filter: Ext.JSON.encode([{
                name: 'order.id',
                type: 'number',
                value: Ext.Object.fromQueryString(location.search).id
                }])
        }
    },
    autoLoad: true
})