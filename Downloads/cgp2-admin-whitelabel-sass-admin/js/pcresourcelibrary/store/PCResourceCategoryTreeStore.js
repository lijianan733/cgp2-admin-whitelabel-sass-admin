/**
 * Created by nan on 2021/9/2
 */
Ext.define("CGP.pcresourcelibrary.store.PCResourceCategoryTreeStore", {
    extend: 'Ext.ux.data.store.UxTreeStore',
    nodeParam: '_id',
    model: 'CGP.pcresourcelibrary.model.PCResourceCategoryModel',
    root: {
        _id: 'root',
        name: ''
    },
    rootName: 'root',
    pageSize: 25,
    autoSync: false,
    //    expanded: true,
    autoLoad: true,
    proxy: {
        type: 'treerest',
        url: adminPath + 'api/pCResourceCategories/tree/{id}/children',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
})