Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV2.model.MaterialMapping', {
    extend: 'Ext.data.Model',
    idProperty : '_id',
    fields: [{
        name: '_id',
        type: 'string'
    },
        'materialPath',
        {name: 'productConfigDesignId',type: 'int'},{
        name: 'bomItemMappingConfigs',
        type: 'array'
    },{
        name: 'materialAttrMappingConfigs',
        type: 'array'
    },{
        name: 'clazz',
        type: 'string',
        defaultValue: 'com.qpp.cgp.domain.product.config.material.mapping2.MaterialMappingConfig'
    },{
            name: 'packageQty',
            type: 'object'
        }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/materialMappingConfigs',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
