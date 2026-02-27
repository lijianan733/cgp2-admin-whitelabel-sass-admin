/**
 * Created by nan on 2019/12/13.
 * 获取到所有属性映射的store,包括单向，双向
 */
Ext.define('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.store.AllProductAttributeMappingStore', {
    extend: 'Ext.data.Store',
    fields: [
        '_id',
        'description',
        {
            name: 'clazz',
            type: 'string'
        },
        {
            name: 'attributeMappingDomain',
            type: 'object'
        },
        {
            name: 'outputs',
            type: 'object'
        },
        {
            name: 'outSkuAttributeIds',
            type: 'array'
        },
        {
            name: 'leftSkuAttributeIds',
            type: 'array'
        },
        {
            name: 'rightSkuAttributeIds',
            type: 'array'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/productAttributeMappings',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true,
    params: null,
    constructor: function (config) {
        var me = this;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
});

