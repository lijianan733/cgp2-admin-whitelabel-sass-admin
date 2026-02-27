/**
 * Created by nan on 2018/3/16.
 */
Ext.define('CGP.common.valueExV2.store.SkuAttributeConstraintStore', {
    extend: 'Ext.data.Store',
    autoLoad:true,
    request: ['CGP.common.valueExV2.model.SkuAttributeConstraintModel'],
    model: 'CGP.common.valueExV2.model.SkuAttributeConstraintModel',
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