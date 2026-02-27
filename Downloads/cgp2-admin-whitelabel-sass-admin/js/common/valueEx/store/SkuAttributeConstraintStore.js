/**
 * Created by nan on 2018/3/16.
 */
Ext.define('CGP.common.valueEx.store.SkuAttributeConstraintStore', {
    extend: 'Ext.data.Store',
    autoLoad:true,
    request: ['CGP.common.valueEx.model.SkuAttributeConstraintModel'],
    model: 'CGP.common.valueEx.model.SkuAttributeConstraintModel',
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