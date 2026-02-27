/**
 * @author xiu
 * @date 2023/8/22
 */
Ext.define('CGP.orderstatusmodify.view.orderitemsmultipleaddress.store.DetailsOrderLineItem', {
    extend: 'Ext.data.Store',
    model: 'CGP.orderstatusmodify.view.orderitemsmultipleaddress.model.OrderLineItem',
    pageSize: 25,
    autoLoad: true,
    remoteSort: false,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/order/shipmentRequirement/{shipmentRequirementId}/orderItems',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            const {params} = config;
            me.proxy.extraParams = params;
        }
        if (config && config.shipmentRequirementId) {
            const {shipmentRequirementId} = config;
            me.proxy.url = adminPath + `api/order/shipmentRequirement/${shipmentRequirementId}/orderItems`;
        }
        me.callParent(arguments);
    }
})