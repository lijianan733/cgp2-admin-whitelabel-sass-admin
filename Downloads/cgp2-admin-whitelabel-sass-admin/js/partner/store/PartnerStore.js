Ext.define('CGP.partner.store.PartnerStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.partner.model.PartnerModel',
    remoteSort: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/partners',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    sorters: [{
        property: 'createdDate',
        direction: 'DESC'
    }],
    autoLoad: true,
    constructor : function(config){
        var me = this;
        if(config && config.params){
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
})
