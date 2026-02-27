/**
 * Created by nan on 2023/9/12
 * 国家
 * */
Ext.define('CGP.postageconfigforweight.model.PostageConfigModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [{
        name: '_id',
        type: 'int',
        useNull: true
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'areaWeightBasedPostageConfigs',
        type: 'array'
    }, {
        name: 'clazz',
        type: 'string',
        defaultValue: 'com.qpp.cgp.domain.shipment.WeightBasedPostageConfig'
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/postageConfigs',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})