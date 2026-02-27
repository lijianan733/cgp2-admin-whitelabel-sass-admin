Ext.define('CGP.product.view.productconfig.productdesignconfig.view.sourceconfig.model.SimplifySBOMMaterialViewType', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        }, {
            name: 'materialPath',
            type: 'string'
        }, {
            name: 'materialViewType',
            type: 'object'
        }, {
            name: 'pageContentQty',
            type: 'object'
        }, {
            name: 'productConfigDesignId',
            type: 'int'
        }, {
            name: 'name',
            type: 'string'
        }, {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.simplifyBom.SimplifyMaterialViewType'
        }, {
            name: 'productMaterialViewTemplateConfigIds',
            type: 'array'
        },
        {
            name:'displayName',
            type:'string',
            convert: function (value, record) {
                return record.get('name') + '(' + record.getId() + ')';
            }
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
});
