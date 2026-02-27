Ext.define('CGP.material.store.Material', {
    extend: 'Ext.ux.data.store.UxTreeStore',
    model: 'CGP.material.model.Material',
    nodeParam: '_id',

    root: {
        _id: 'root',
        name: 'root',
        leaf: false,
    },
    //autoSync: true,
    //    expanded: true,
    autoLoad: true,
    constructor: function (config) {
        this.proxy = {
            type: 'treerest',
            url: adminPath + 'api/materials/{id}/childNodes',
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