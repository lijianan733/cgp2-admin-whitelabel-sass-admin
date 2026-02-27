/**
 * Created by nan on 2020/6/23.
 */

Ext.define("CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.model.JobConfigModel", {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [{
        name: '_id',
        type: 'number'
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'description',
        type: 'string'
    }, {
        name: 'isMixed',
        type: 'boolean',
        defaultValue: false
    }, {
        name: 'clazz',
        type: 'string'
    }, {
        name: 'pageGroupConfig',
        type: 'object'
    }, {
        name: 'pageFilterConfig',
        type: 'object'
    }, {
        name: 'jobLaunchTrigger',
        type: 'object'
    }, {
        name: 'singleJobConfigs',
        type: 'array'
    }, {
        name: 'context',
        type: 'object'
    }, {
        name: 'jobType',
        type: 'string'
    }, {
        name: 'pages',
        type: 'array'
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/jobConfigs',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});
