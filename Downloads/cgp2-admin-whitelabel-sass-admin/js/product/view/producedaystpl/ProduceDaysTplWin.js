Ext.define('CGP.product.view.producedaystpl.ProduceDaysTplWin',{
    extend: 'Ext.window.Window',

    layout: 'fit',
    modal: true,
    initComponent: function(){
        var  me = this;

        var controller = Ext.create('CGP.product.controller.Controller');
        me.title = i18n.getKey('produceDaysTpl');
        //me.layout = 'vhox',
        me.bbar = ['->',{
            xtype: 'button',
            text: i18n.getKey('modify'),
            handler: function(){
                var store = me.down("grid").getStore();
                var filterId = store.data.keys[0];
                controller.showProduceDaysTpl(me.productId,store,filterId);
            }
        }];
        me.items = [Ext.create('CGP.product.view.producedaystpl.ProduceDaysTplList',{
            productId:me.productId,
            id: 'ProductPackageList'
        })];
        me.callParent(arguments);

    }
})