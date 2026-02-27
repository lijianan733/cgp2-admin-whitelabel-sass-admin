Ext.define("CGP.product.edit.component.skuproducts.SimpleCreateWin",{
    extend: "Ext.window.Window",

    layout: 'border',
    width: 800,
    height: 600,
    modal: true,
    initComponent: function(){
        var me = this;

        me.title = i18n.getKey('simpleCreate');
        me.items = [me.skuProductGeneralAttributeBlock];
        me.callParent(arguments);

    }
})