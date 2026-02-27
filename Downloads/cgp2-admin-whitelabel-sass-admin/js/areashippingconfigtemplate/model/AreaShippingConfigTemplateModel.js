/**
 * Created by shirley on 2021/8/28
 * */
Ext.define('CGP.areashippingconfigtemplate.model.AreaShippingConfigTemplateModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [{
        name: '_id',
        type: 'int',
        useNull: true
    }, {
        name: 'areas',
        type: 'array'
    }, {
        name: 'areaQtyShippingConfigs',
        type: 'array'
    },{
        name: 'clazz',
        type: 'string',
        defaultValue:'com.qpp.cgp.domain.product.shipping.area.AreaShippingConfigTemplate'
    }],
    proxy: {
        //当基于单个实例执行请求时，将自动附加Model实例的ID
        //appendId:false,
        type: 'uxrest',
        url: adminPath + 'api/areaShippingConfigTemplates',
        reader: {
            type: 'json',
            //设置返回信息的名称，为必填项
            root: 'data'
        }
    }
})