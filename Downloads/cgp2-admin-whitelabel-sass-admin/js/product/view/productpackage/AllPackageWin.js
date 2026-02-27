Ext.define('CGP.product.view.productpackage.AllPackageWin',{
    extend: 'Ext.window.Window',

    modal : true,
    layout: 'fit',
    width: 950,
    height: 600,
    initComponent:function(){
        var me = this;

        me.title = i18n.getKey('addProductPackage');
        me.items = [Ext.create('CGP.product.view.productpackage.AllPackageList',{
            allPackageWin: me
        })];
        me.callParent(arguments);
    }
})