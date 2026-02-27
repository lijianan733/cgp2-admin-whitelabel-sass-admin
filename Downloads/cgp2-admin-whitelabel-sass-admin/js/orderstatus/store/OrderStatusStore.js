/***
 *
 *
 */
Ext.define('CGP.orderstatus.store.OrderStatusStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.orderstatus.model.OrderStatusModel',
    pageSize: 100,
    remoteSort: true,
    sorters: [{
        property: 'fontSort',
        direction: 'ASC'
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/whitelabelOrderStatuses',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
});
