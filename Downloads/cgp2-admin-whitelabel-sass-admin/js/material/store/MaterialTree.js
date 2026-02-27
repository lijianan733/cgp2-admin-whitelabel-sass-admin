Ext.define('CGP.material.store.MaterialTree', {
    extend: 'Ext.data.TreeStore',
    model: 'CGP.material.model.Material',
    nodeParam: 'id',

    root: {
        id: 'root',
        name: ''
    },
    //autoSync: true,
    //    expanded: true,
    autoLoad: true,
    constructor: function (config) {
        this.proxy = {
            type: 'treerest',
            url: adminPath + 'api/admin/materials/categoryTree/{id}/children',
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