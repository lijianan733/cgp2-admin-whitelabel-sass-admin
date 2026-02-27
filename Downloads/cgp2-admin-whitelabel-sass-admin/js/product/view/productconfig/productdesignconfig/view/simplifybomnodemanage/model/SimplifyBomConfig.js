Ext.define('CGP.product.view.productconfig.productdesignconfig.view.simplifybomnodemanage.model.SimplifyBomConfig', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        }, {
            name: 'sbomNode',
            type: 'obejct'
        }, {
            name: 'materialViewType',
            type: 'object'
        }, {
            name: 'views',
            type: 'array'
        }, {
            name: 'producConfigDesigntId',
            type: 'int'
        }, {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.simplifyBom.SimplifyBomConfig'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/simplifyBomController',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})