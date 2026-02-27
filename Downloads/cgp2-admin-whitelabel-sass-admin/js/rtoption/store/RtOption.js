Ext.define('CGP.rtoption.store.RtOption', {
    extend: 'Ext.data.Store',
    requires: ['CGP.rtoption.model.RtOption'],

    model: 'CGP.rtoption.model.RtOption',
    remoteSort: true,
    sorters: [{
        property: '_id',
        direction: 'DESC'
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/rtoptions',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true,
    constructor:function (config){
        var me=this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
});