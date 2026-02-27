Ext.define('CGP.testreconstructgridpage.store.PartnerStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.testreconstructgridpage.model.PartnerModel',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/partners',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true,
    constructor : function(config){
        var me = this;
        if(config && config.params){
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
})