Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.store.RtAttributeTreeStore', {
    extend: 'Ext.data.TreeStore',
    model: 'CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.model.RtAttributeTreeModel',
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
            url: adminPath + 'api/rtTypes/{id}/rtAttributeDefs',
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
