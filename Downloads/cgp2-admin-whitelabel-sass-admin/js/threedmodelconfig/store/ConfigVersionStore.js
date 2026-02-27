Ext.define("CGP.threedmodelconfig.store.ConfigVersionStore",{
    extend : "Ext.data.Store",

    model: 'CGP.threedmodelconfig.model.ConfigVersionModel',
    remoteSort: 'true',
    pageSize: 25,
    url: adminPath + 'api/threedmodelvariableconfigs',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/threedmodelvariableconfigs',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoSync: true,
    autoLoad : true,
    constructor : function(config){
        var me = this;
        if(config.params){
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }

});