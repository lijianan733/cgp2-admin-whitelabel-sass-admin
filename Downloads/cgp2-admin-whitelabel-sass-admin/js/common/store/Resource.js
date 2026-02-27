Ext.define('CGP.common.store.Resource', {
    extend: 'Ext.data.Store',
    model: 'CGP.common.model.Resource',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/resources',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    constructor : function(config){
        var me = this;
        if(config.params){
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    },
    autoLoad: true
});