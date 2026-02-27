/**
 * Created by nan on 2021/3/8
 */
Ext.define('CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.model.3DModelModel', {
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
        },
        {
            name: 'displayField',
            type: 'string',
            convert: function (value, record) {
                return record.get('modelName') + '(' + record.getId() + ')'
            }

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
