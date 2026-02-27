Ext.define('CGP.product.store.Material', {
    extend: 'Ext.data.TreeStore',
    model: 'CGP.product.model.Material',
    nodeParam: '_id',

    root: {
        _id: 'root',
        name: ''
    },
    autoSync: true,
    //    expanded: true,
    autoLoad: true,
    constructor: function (config) {
        this.proxy = {
            type: 'treerest',
            url: adminPath + 'api/materials/{id}/children',
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