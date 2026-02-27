var websiteStore = new Ext.data.Store({
    fields: [{
        name: 'id',
        type: 'int'
                    }, 'name'],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/websites',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    }
})


var store = Ext.create('Ext.data.TreeStore', {
    storeId: "productCategoryStore",
    model: 'CGP.model.ProductCategory',
    nodeParam: 'id',
    proxy: {
        type: 'rest',
        url: adminPath + 'api/admin/productCategory',
        extraParams: {
            access_token: Ext.util.Cookies.get('token')
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    root: {
        id: -1,
        name: ''
    },
    autoSync: true,
    expanded: true
});


var selectTreeStore = Ext.create('Ext.data.TreeStore', {
    storeId: "selectTreeStore",
    model: 'CGP.model.ProductCategory',
    nodeParam: 'id',
    proxy: {
        type: 'rest',
        url: adminPath + 'api/admin/productCategory',
        extraParams: {
            access_token: Ext.util.Cookies.get('token'),
            website: 1,
            isMain: true

        },
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    root: {
        id: -1,
        name: ''
    },
    autoSync: false,
    expanded: true
});