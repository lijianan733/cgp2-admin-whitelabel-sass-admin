Ext.define('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.store.RtAttributeTreeStore', {
    extend: 'Ext.data.TreeStore',
    model: 'CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.model.RtAttributeTreeModel',
    nodeParam: '_id',
    //idProperty : 'code',

    root: {
        _id: 'root',
        name: ''
    },
    autoSync: false,
    //    expanded: true,
    autoLoad: false,
    constructor: function (config) {
        this.proxy = {
            type: 'treerest',
            url: composingPath + 'api/pageConfigs/rtTypes/{id}/rtAttributeDefs',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            reader: {
                type: 'json',
                root: 'data'
            }
        };

        this.callParent(arguments);

    }
})
