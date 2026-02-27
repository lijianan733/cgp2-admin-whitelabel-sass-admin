/**
 * Created by shirley on 2021/8/24
 * */
Ext.define('CGP.shippingquotationtemplatemanage.model.CurrencyModel',{
    extend:'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    },{
        name: 'title',
        type: 'string'
    },{
        name:'code',
        type: 'string'
    },{
        name:'clazz',
        type:'string'
    },{
        name:'value',
        type:'number'
    },{
        name:'symbol',
        type:'string'
    }],
    proxy: {
        //当基于单个实例执行请求时，将自动附加Model实例的ID
        //appendId:false,
        type: 'uxrest',
        url: adminPath + 'api/currencies',
        reader: {
            type: 'json',
            //设置返回信息的名称，为必填项
            root: 'data.content'
        }
    }
})