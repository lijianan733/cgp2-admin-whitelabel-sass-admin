Ext.define('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.store.RtTypeTreeStore', {
    extend: 'Ext.ux.data.store.UxTreeStore',
    model: 'CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.model.RtType',
    nodeParam: '_id',
    pageSize: 25,
    root: {
        _id: 'root',
        name: ''
    },
    autoLoad: true,
    autoSync: false,
    proxy: {
        type: 'treerest',
        url: composingPath + 'api/pageConfigs/rtTypes/{rtTypeId}/children',
        headers: {
            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    params: null,
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        this.callParent(arguments);
    }
})
