Ext.define('CGP.product.view.productconfig.ProductConfigWin',{
    extend: 'Ext.window.Window',

    modal: true,
    layout: 'fit',
    width: 900,
    height:600,
    autoScroll: false,
    autoShow: true,
    initComponent: function(){
        var  me = this;

        me.title = i18n.getKey('builderConfig');
        var controller = Ext.create('CGP.product.view.productconfig.controller.Controller')
        me.listeners = {
            beforerender: function(){
                controller.previewBuilderConfigTabs(me);
            }
        };
        me.callParent(arguments);

    }
})