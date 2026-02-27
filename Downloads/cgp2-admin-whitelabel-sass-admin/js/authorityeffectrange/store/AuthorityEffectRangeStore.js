/**
 * Created by nan on 2018/8/10.
 */
Ext.define('CGP.authorityeffectrange.store.AuthorityEffectRangeStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.authorityeffectrange.model.AuthorityEffectRangeModel',
    pageSize: 25,
    autoLoad: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/security/acp',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    params : null,
    constructor : function(config){
        var me = this;
        if(config.params){
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
})