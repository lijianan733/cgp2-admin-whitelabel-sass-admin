Ext.define("CGP.buildermanage.store.ConfigVersionStore",{
    extend : "Ext.data.Store",

    model: 'CGP.buildermanage.model.ConfigVersionModel',
    remoteSort: 'true',
    pageSize: 25,
    url: adminPath + 'api/systemBuilderPublishVersions',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/systemBuilderPublishVersions',
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