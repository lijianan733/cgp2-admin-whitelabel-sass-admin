var productStore = new Ext.data.Store({
    model: 'CGP.model.Product',
    storeId: 'productStore',
    remoteSort: true,
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + "api/products/list",
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    sorters: [{
        property: 'id',
        direction: 'DESC'
    }],
    autoLoad: true

});
/*var allProductCategoryStore = Ext.create('CGP.product.store.AllProductCategory', {
    storeId: "allCategoryStore",
    params: {
        website: 38,//默认38
        isMain: true,
        limit: 25
    },
    listeners: {
        load: function (store, node, recrods) {
            recrods.forEach(function (record) {
                record.set('checked', false);
            })
        }
    }
});/!*Ext.create('CGP.product.store.AllProductCategory', {
    storeId: "allCategoryStore",
    params: {
        limit: 25,
        isMain: true
    }
});*!/

/!*
var allProductCategoryStore = Ext.create('CGP.product.store.ProductCategory', {
    storeId: "allCategoryStore",
    model: 'CGP.model.ProductCateogry',
    nodeParam: 'id',
    proxy: {
        type: 'rest',
        url: adminPath + 'api/productCategories/allwebsitetree/{id}',
        extraParams: {
            access_token: Ext.util.Cookies.get('token'),
            isMain: true
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    root: {
        id: 0,
        name: ''
    }
});*!/*/
Ext.define('CGP.productcategory.store.ProductCategory', {
    extend: 'Ext.ux.data.store.UxTreeStore',
    model: 'CGP.productcategory.model.ProductCategory',
    nodeParam: 'id',
    root: {
        id: '-1',
        name: ''
    },
    pageSize: 25,
    autoSync: true,
    autoLoad: false,
    //    expanded: true,
    onProxyLoad: function (operation) {
        var me = this,
            successful = operation.wasSuccessful(),
            records = operation.getRecords(),
            node = operation.node,
            resultSet = operation.getResultSet();
        me.loading = false;
        if (resultSet && operation.id == '-1') {
            me.treeTotalCount = resultSet.total;
        }
        node.set('loading', false);
        if (successful) {
            if (!me.clearOnLoad) {
                records = me.cleanRecords(node, records);
            }
            records = me.fillNode(node, records);
        }
        me.fireEvent('read', me, operation.node, records, successful);
        me.fireEvent('load', me, operation.node, records, successful);
        Ext.callback(operation.callback, operation.scope || me, [records, operation, successful]);
    },
    proxy: {
        type: 'treerest',
        url: adminPath + 'api/productCategories/{id}',
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
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        this.callParent(arguments);

    }
})
/*var subProductCategoryStore = Ext.create('CGP.product.store.AllProductCategory', {
    storeId: "subProductCategoryStore",
    params: {
        website: 38,//默认38
        isMain: false,
        limit: 25
    },
    listeners: {
        load: function (store, node, recrods) {
            recrods.forEach(function (record) {
                record.set('checked', false);
            })
        }
    }
});*/
/*Ext.create('CGP.product.store.AllProductCategory', {
    params: {
        limit: 25,
        isMain: false
    },
    storeId: "subProductCategoryStore"
});*/

/*var subProductCategoryStore = Ext.create('Ext.data.TreeStore', {
    storeId: "subProductCategoryStore",
    model: 'CGP.model.ProductCateogry',
    nodeParam: 'id',
    proxy: {
        type: 'rest',
        url: adminPath + 'api/productCategories/allwebsitetree',
        extraParams: {
            access_token: Ext.util.Cookies.get('token'),
            isMain: false
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    root: {
        id: 0,
        name: ''
    }
});*/
/*
var compositeModelTreeStore = Ext.create('Ext.data.TreeStore',{
    storeId: 'compositeModelTreeStore',
    model: 'CGP.product.model.compositeModelTreeModel',
    nodeParam: 'id',
    proxy: {
        type: 'rest',
        url: adminPath + 'api/admin/productCompositeModels/treeData',
        extraParams: {
            access_token: Ext.util.Cookies.get('token')*/
/*,
            isMain: true*//*

        },
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    root: {
        id: 0,
        name:''
    },
    autoLoad: true
})*/
