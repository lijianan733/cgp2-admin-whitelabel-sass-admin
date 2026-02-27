/**
 * Created by nan on 2018/3/28.
 * 可用供应商,
 * 必须有配置orderId
 */
Ext.define('CGP.order.store.EnableSupplierStore', {
    extend: 'Ext.data.Store',
    model:'CGP.order.model.EnableSupplierModel',
    request:'CGP.order.model.EnableSupplierModel',
    proxy: {
        type: 'uxrest',
        url: adminPath ,
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    autoLoad: true,
    constructor: function (config) {
        var me = this;
        me.proxy.url = adminPath + 'api/orders/' + config.orderId + '/availableProducePartners';
        me.callParent(arguments);
    }
})


