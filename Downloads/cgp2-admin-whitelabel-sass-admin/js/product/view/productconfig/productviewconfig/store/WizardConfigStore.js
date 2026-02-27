/**
 * Created by nan on 2018/4/16.
 */

Ext.define('CGP.product.view.productconfig.productviewconfig.store.WizardConfigStore',{
    extend: 'Ext.data.Store',
    fields:[{
        name:'_id',
        type:'string'
    },{
        name:'clazz',
        type:'string'
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/productConfigViews/{productConfigViewId}/wizardConfig',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    constructor : function(config){
        var me = this;
        if(config.productConfigViewId){
            me.proxy.url =adminPath + 'api/productConfigViews/'+config.productConfigViewId+'/wizardConfig';
        }
        me.callParent(arguments);
    },
    autoLoad: true
})