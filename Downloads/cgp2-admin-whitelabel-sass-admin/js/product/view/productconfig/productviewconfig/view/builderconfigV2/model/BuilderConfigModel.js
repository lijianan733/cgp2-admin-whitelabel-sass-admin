/**
 * Created by nan on 2021/3/22
 * 改模型不写clazz字段，用于v1和v2的配置
 */
Ext.define("CGP.product.view.productconfig.productviewconfig.view.builderconfigV2.model.BuilderConfigModel", {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [{
        name: '_id',
        type: 'string',
        useNull: true
    }, {
        name: 'description',
        type: 'string'
    }, {
        name: 'builderVersion',
        type: 'string'
    },
        'builderName',
        {//说明使用哪些版本的导航和builder配置
            name: 'schemaVersion',
            type: 'object'
        }, {
            name: 'clazz',
            type: 'string'
        }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/systemBuilderConfigsV2',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})