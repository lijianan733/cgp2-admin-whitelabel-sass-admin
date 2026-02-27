Ext.define('CGP.costenterconfig.store.processCostConfigStore', {
    extend: 'Ext.data.Store',
    requires: ['CGP.costenterconfig.model.processCostConfigModel'],
    model: 'CGP.costenterconfig.model.processCostConfigModel',
    pageSize:25,
    proxy: {
        type: 'uxrest',
        url: mccsPath + 'api/processCostConfigs',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true,
    constructor:function (config){
        var me= this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
});
