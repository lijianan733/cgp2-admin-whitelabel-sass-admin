/**
 * Created by nan on 2020/8/6.
 */
Ext.define('CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.model.ViewConfigV3DTOModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string'
        }, {
            name: 'productConfigViewId',
            type: 'number'
        }, {
            name: 'description',
            type: 'string'
        }, {
            name: 'builderViewConfigDomain',
            type: 'object'
        }, {
            name: 'editViewConfigs',
            type: 'array'
        },
        /**
         * 记录配置了的组件，用于该组件配置中重用
         */
        {
            name: 'componentConfigs',
            type: 'array'
        },
        /**
         * 记录自定义组件
         */
        {
            name: 'customComponentArr',
            type: 'array'
        },
        {
            name: 'defaultThemes',
            type: 'string'
        }
    ]
});

