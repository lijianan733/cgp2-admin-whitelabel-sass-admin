/**
 * @author xiu
 * @date 2025/3/25
 */
Ext.define('CGP.customerordermanagement.store.QpsonOrderItemStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.customerordermanagement.model.QpsonOrderItemModel',
    pageSize: 5,
    autoLoad: true,
    remoteSort: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + `api/orders/{customerOrderId}/shipmentRequirements/{shipmentRequirementId}/orderItems`,
        reader: {
            type: 'json',
            root: 'data.content',
        }
    },
    constructor: function (config) {
        var me = this,
            {shipmentRequirementId, customerOrderId} = config;
        
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }

        if (customerOrderId && shipmentRequirementId) {
            me.proxy.url = adminPath + `api/orders/${customerOrderId}/shipmentRequirements/${shipmentRequirementId}/orderItems`;
        }
        me.callParent(arguments);
    }
})