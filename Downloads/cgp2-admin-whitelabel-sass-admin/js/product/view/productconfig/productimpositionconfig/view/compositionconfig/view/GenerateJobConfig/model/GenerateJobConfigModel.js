/**
 * Created by nan on 2020/7/1.
 */
Ext.define('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.model.GenerateJobConfigModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [{
        name: '_id',
        type: 'string'
    },
        {
            name: 'id',
            type: 'string',
            convert: function (value, record) {
                if (value) {
                    return value;
                } else {
                    return record.get('_id');
                }
            }
        },
        {
            name: 'jobConfig',
            type: 'object',
            useNull: true
        },
        {
            name: 'condition',
            type: 'object'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'supportTypes',
            type: 'array'
        },
        {
            name: 'singleJobConfigs',
            type: 'array'
        },
        {
            name: 'singleJobConfig',
            type: 'object'
        }, {
            name: 'contextConfig',
            type: 'object'
        }, {
            name: 'pages',
            type: 'array'
        }, {
            name: 'compositeJobConfigId',
            type: 'string'
        }, {
            name: 'compositeJobConfig',
            type: 'object'
        }, {
            name: 'jobConfig',
            type: 'object',
            convert: function (value, record) {
                return record.get('compositeJobConfig') || record.get('singleJobConfig');
            }
        }, {
            name: 'productConfigImpositionId',
            type: 'string'
        }, {
            name: 'singleJobConfigId',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.composing.config.JobGenerateConfig'
        },
        {
            name:'preview',
            type:'boolean'
        },{
            name: 'conditionDTO',
            type: 'object'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: cgp2ComposingPath + 'api/jobGenerateConfigsV2',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})
