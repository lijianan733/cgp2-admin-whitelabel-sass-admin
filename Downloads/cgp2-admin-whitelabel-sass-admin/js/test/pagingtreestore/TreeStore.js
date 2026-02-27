Ext.define('CGP.test.pagingtreestore.TreeStore', {
    //extend: 'Ext.data.TreeStore',
    requires: ['CGP.test.pagingtreestore.Tree1'],
    extend: "CGP.test.pagingtreestore.Tree1",
    alias: 'store.pagingtree',
    pageSize: 3,
    model: 'CGP.test.pagingtreestore.TestModel',
    nodeParam: 'id',
    clearOnPageLoad: true,
    currentPage: 1,
    root: {
        id: -1,
        name: ''
    },

    autoSync: true,
    //    expanded: true,

    constructor: function (config) {
        this.proxy = {
            type: 'rest',
            url: adminPath + 'api/admin/productCategory',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            extraParams: {
                website: config.website,
                isMain: config.isMain
            },
            reader: {
                type: 'json',
                root: 'data',
                totalProperty: 'totalProperty'
            }
        };

        this.callParent(arguments);

    }
})