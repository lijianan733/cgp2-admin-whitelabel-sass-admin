/**
 * Created by shirley on 2021/8/27
 * */
Ext.define('CGP.shippingquotationtemplatemanage.model.AreaQtyShippingModel',{
    extend:'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    },{
        name: 'areas',
        type: 'array'
    },{
        name:'areaQtyShippingConfigs',
        type: 'array'
    },{
        name:'clazz',
        type:'string',
        defaultValue:'com.qpp.cgp.domain.product.shipping.area.AreaShippingConfig'
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