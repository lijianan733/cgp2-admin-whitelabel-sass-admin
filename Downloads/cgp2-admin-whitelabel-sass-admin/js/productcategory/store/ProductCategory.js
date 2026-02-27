Ext.define('CGP.productcategory.store.ProductCategory', {
    extend: 'Ext.data.TreeStore',
    model: 'CGP.productcategory.model.ProductCategory',
    nodeParam: 'id',

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
                root: 'data'
            }
        };

        this.callParent(arguments);

    }
})