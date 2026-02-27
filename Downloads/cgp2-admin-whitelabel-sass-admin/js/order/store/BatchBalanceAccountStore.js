/**
 * Created by nan on 2018/3/1.
 */
Ext.define('CGP.order.store.BatchBalanceAccountStore', {
    requires: 'CGP.order.model.BatchBalanceAccountModel',
    extend: 'Ext.data.Store',
    model: 'CGP.order.model.BatchBalanceAccountModel',
    remoteSort: true,
    pageSize: 20,
    autoLoad:true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/orderSettleItems',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    }
});