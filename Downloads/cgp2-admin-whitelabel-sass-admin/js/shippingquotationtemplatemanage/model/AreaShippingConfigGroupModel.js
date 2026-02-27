/**
 * Created by shirley on 2021/8/23
 * */
Ext.define('CGP.shippingquotationtemplatemanage.model.AreaShippingConfigGroupModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [{
        name: '_id',
        type: 'string',
        useNull: true
    }, {
        name: 'name',
        type: 'string',
        useNull: true
    }, {
        name: 'tags',
        type: 'array'
    }, {
        name: 'clazz',
        type: 'string',
        defaultValue: 'com.qpp.cgp.domain.product.shipping.area.AreaShippingConfigGroup'
    }, {
        name: 'currencyCode',
        type: 'string'
    }, {
        name: 'areaShippingConfigs',
        type: 'array'
    }],
    proxy: {
        //当基于单个实例执行请求时，将自动附加Model实例的ID
        //appendId:false,
        type: 'uxrest',
        url: adminPath + 'api/areaShippingConfigGroups',
        reader: {
            type: 'json',
            //设置返回信息的名称，为必填项
            root: 'data'
        }
    }
})