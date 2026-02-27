Ext.define( 'CGP.material.store.MaterialCategory', {
    extend: 'Ext.ux.data.store.UxTreeStore',
    nodeParam: '_id',
    model: 'CGP.material.model.MaterialCategory',
    root: {
        _id: 'root',
        name: ''
    },
    pageSize: 25,
    autoSync: false,
    //    expanded: true,
    autoLoad: true,
    proxy: {
        type: 'treerest',
        url: adminPath + 'api/materialCategories/{id}/children',
        headers: {
            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    constructor: function (config) {
        var me = this;
        this.callParent(arguments);

    }
})