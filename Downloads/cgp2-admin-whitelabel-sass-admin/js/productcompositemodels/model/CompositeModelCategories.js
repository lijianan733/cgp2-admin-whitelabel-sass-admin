Ext.define('CGP.productcompositemodels.model.CompositeModelCategories',{
    extend: 'Ext.data.Model',
    idProperty:'id',
    fields:[{
        name: 'id',
        type: 'int',
        useNull: true
    },{
        name: 'name',
        type: 'string'
    },{
        name: 'description',
        type: 'string'
    }],
    proxy:{
        type: 'uxrest',
        url: adminPath+ 'api/admin/compositeModelCategories',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})