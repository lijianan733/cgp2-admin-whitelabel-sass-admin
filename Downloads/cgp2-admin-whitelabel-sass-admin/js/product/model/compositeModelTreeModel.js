/*Ext.define('CGP.product.model.compositeModelTreeModel',{
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'name',
        type: 'string'
    }]
    ,proxy: {
        type: 'rest',
        url: adminPath + 'api/admin/productCompositeModels/treeData',
        extraParams: {
            access_token: Ext.util.Cookies.get('token'),
            isMain: true
        },
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})*/
Ext.define('CGP.product.model.compositeModelTreeModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'name',
        type: 'string'
    }]
});