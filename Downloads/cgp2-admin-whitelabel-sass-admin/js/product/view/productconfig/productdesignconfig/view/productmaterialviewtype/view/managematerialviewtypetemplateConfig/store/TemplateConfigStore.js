/**
 * Created by nan on 2020/2/19.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.managematerialviewtypetemplateConfig.store.TemplateConfigStore', {
    extend: 'Ext.data.Store',
    alias: 'widget.templateconfigstore',
    model: 'CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.managematerialviewtypetemplateConfig.model.TemplateConfigModel',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/templateConfigController',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    params: null,
    constructor: function (config) {
        var me = this;
        if (!Ext.isEmpty(config) && !Ext.isEmpty(config.params)) {
            me.proxy.extraParams = config.params;
        }
        me.callParent(arguments);
    },
    autoLoad: true
});
