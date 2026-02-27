Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3test.store.BomTree', {
    extend: 'Ext.data.TreeStore',
    model: 'CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3test.model.Material',
    nodeParam: '_id',

    root: {
        _id: 'root',
        name: ''
    },
    //autoSync: true,
    //    expanded: true,
    //autoLoad: true,
    constructor: function (config) {
        this.proxy = {
            extraParams: config.params,
            type: 'treerest',
            isRepeat: true,
            url: adminPath + 'api/materials/bomTree/{id}/children',
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
