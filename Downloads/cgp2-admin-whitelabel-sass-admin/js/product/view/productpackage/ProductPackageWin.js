Ext.define('CGP.product.view.productpackage.ProductPackageWin',{
    extend: 'Ext.window.Window',

    modal : true,
    layout: 'fit',
    initComponent: function(){
         var me = this;

        me.title = i18n.getKey('productPackage');
        var  controller = Ext.create('CGP.product.controller');
        me.bbar = ['->',{
            xtype: 'button',
            text: i18n.getKey('add'),
            handler: function(){
                var grid = me.down("grid");
                var packageData = grid.getStore().data.items;
                var store = grid.getStore();
                var filterPackageId = store.data.keys[0];
                controller.modifyProductPackageWin(me.productId,store,filterPackageId,packageData);
            }
        }];
        me.items = [Ext.create('CGP.product.view.productpackage.ProductPackageList',{
            productId:me.productId,
            id: 'productPackageList'
        })];
        me.callParent(arguments);
    }
})