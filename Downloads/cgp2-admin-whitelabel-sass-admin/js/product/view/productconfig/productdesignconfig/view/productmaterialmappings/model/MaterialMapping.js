Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappings.model.MaterialMapping', {
    extend: 'Ext.data.Model',
    idProperty : '_id',
    fields: [{
        name: '_id',
        type: 'string'
    }, 'materialPath',{name: 'productConfigDesignId',type: 'int'},{
        name: 'bomItemMappings',
        type: 'array'
    },{
        name: 'packageQty',
        type: 'object',
        defaultValue: null
    },{
        name: 'spuRtObjectMappings',
        type: 'array'
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/materialMappings',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});