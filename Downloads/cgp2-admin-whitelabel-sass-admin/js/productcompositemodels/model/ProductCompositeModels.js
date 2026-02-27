Ext.define('CGP.productcompositemodels.model.ProductCompositeModels',{
    extend: 'Ext.data.Model',
    idProperty:'id',
    fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    },{
        name: 'name',
        type: 'string'
    },{
        name: 'code',
        type: 'string'
    },{
        name: 'categoryId',
        type: 'int'
    },{
        name: 'categoryName',
        type: 'string'
    }],
    proxy : {
        type : 'uxrest',
        url : adminPath + 'api/admin/productCompositeModels',
        reader:{
            type:'json',
            root:'data'
        }
    }
})