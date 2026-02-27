Ext.define('CGP.product.view.productconfig.productdesignconfig.view.materialtypetospuconfigs.model.Model', {
    extend: 'Ext.data.Model',
    idProperty : '_id',
    fields: [{
        name: '_id',
        type: 'string'
    }, 'materialPath',{name: 'productConfigDesignId',type: 'int'},{
        name: 'spuRtObjectFillConfigs',
        type: 'array'
    },{
        name: 'bomItemToFixedConfigs',
        type: 'array'
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/materialTypeToSpuConfigs',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});