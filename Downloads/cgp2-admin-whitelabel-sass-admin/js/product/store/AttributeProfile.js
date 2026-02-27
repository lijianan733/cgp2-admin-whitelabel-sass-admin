/**
 * Created by admin on 2019/12/12.
 */
Ext.define('CGP.product.store.AttributeProfile', {
    extend: 'Ext.data.Store',
    model: 'CGP.product.model.AttributeProfile',
    url: adminPath + 'api/skuAttributes/{0}/attributeProfiles',
    proxy: {
        type: 'uxrest',
        //url: adminPath + 'api/skuAttributes/1514055/attributeProfiles',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    //autoLoad :true,
    params: null,
    constructor: function (config) {
        var me = this;
        var url = Ext.String.format(Ext.clone(me.url),config.skuAttributeId);
        me.proxy.url = url;
        if (config && config.params) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    }
})