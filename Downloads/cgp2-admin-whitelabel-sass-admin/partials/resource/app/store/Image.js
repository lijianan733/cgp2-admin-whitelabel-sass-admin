Ext.define('CGP.resource.store.Image', {
    extend: 'Ext.data.Store',
    requires: ['CGP.resource.model.Image'],

    model: 'CGP.resource.model.Image',
    remoteSort: true,
    sorters: [{
        property: '_id',
        direction: 'DESC'
    }],
    /**
     * @cfg {Number} pageSize
     * 每页的记录数
     */
    pageSize:25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/images',
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