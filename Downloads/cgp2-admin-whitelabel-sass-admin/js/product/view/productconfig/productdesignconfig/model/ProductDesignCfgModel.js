Ext.define('CGP.product.view.productconfig.productdesignconfig.model.ProductDesignCfgModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true
        }, {
            name: 'bomType',
            type: 'string'
        }, {
            name: 'configVersion',
            type: 'number'
        }, {
            name: 'configValue',
            type: 'string'
        }, {
            name: 'status',
            type: 'int'
        }, {
            name: 'bomCompatibilities',
            type: 'array',
            serialize: function (value) {
                if (Ext.isEmpty(value)) {
                    return [];
                }
                return value;
            }

        }, {
            name: 'productConfigId',
            type: 'int'
        }, {
            name: 'mappingVersion',
            type: 'string'/*,
            convert: function (value){
                if(Ext.isEmpty(value)){
                    return '2'
                }else{
                    return value;
                }
            }*/
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/productConfigDesigns',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})
