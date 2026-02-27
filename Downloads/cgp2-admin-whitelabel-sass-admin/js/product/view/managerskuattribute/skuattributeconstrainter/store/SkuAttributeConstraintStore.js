/**
 * Created by nan on 2018/1/5.
 */
Ext.define('CGP.product.view.managerskuattribute.skuattributeconstrainter.store.SkuAttributeConstraintStore', {
    extend: 'Ext.data.Store',
    autoLoad:true,
    request: ['CGP.product.view.managerskuattribute.skuattributeconstrainter.model.SkuAttributeConstraintModel'],
    model: 'CGP.product.view.managerskuattribute.skuattributeconstrainter.model.SkuAttributeConstraintModel',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/skuAttributes/{skuAttributeId}/constraints/v2',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    constructor:function(config){
        var me = this;
        me.proxy.url=adminPath + 'api/skuAttributes/'+config.skuAttributeId+'/constraints/v2/',
        me.callParent();
    }
})
