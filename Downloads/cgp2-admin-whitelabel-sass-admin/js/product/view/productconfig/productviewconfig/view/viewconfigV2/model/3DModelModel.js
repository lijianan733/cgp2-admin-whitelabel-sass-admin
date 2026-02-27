/**
 * Created by nan on 2021/3/8
 */
Ext.define('CGP.product.view.productconfig.productviewconfig.view.viewconfigV2.model.3DModelModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        }, {
            name: 'modelName',
            type: 'string'
        }, {
            name: 'description',
            type: 'string'
        }, {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.product.config.model.ThreeDModelConfig'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/threedmodelconfigs',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
});
