/**
 * Created by nan on 2018/10/24.
 */
Ext.define('CGP.product.view.productconfig.productbomconfig.view.producecomponentconfig.model.ProduceComponentConfigModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.product.config.ProduceComponentConfig'
        },
        {
            name: 'modifiedDate',
            type: 'date',
            convert: function (value) {
                return new Date(value)
            },
            serialize: function (value) {
                var time = value.getTime();
                return time;
            }
        },
        {
            name: 'productConfigBomId',
            type: 'int'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'materialName',
            type: 'string'
        },
        {
            name: 'materialPath',
            type: 'string'
        },
        {
            name: 'isNeedPrint',
            type: 'boolean'

        },
        {
            name: 'availablePrinters',
            type: 'array'
        },
        {
            name: 'modifiedBy',
            type: 'string'
        }


    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/produceComponentConfigs',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
