/**
 * Created by nan on 2018/4/20.
 */
Ext.define('CGP.configuration.productdefaultsupplier.model.ProductDefaultSupplierConfigModel', {
    extend: 'Ext.data.Model',
    idProperty:'_id',
    fields: [
        {
            name:'id',
            type:'string',
            defaultValue:undefined
        },{
            name:'clazz',
            type:'string',
            defaultValue:'com.qpp.cgp.domain.product.config.ProductDefaultProducerConfig'
        },{
            name:'websiteId',
            type:'int'
        },{
            name:'product',
            type:'object'
        },{
            name:'partner',
            type:'object'
        }
    ]
})
