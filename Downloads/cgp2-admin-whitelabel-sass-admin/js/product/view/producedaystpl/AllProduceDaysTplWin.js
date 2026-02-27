Ext.define('CGP.product.view.producedaystpl.AllProduceDaysTplWin',{
    extend: 'Ext.window.Window',

    modal : true,
    layout: 'fit',
    initComponent:function(){
        var me = this;

        me.title = i18n.getKey('produceDaysTpl');
        me.items = [Ext.create('CGP.product.view.producedaystpl.AllProduceDaysTplList',{
            allProductDaysTplWin: me
        })];
        me.callParent(arguments);
    }
})