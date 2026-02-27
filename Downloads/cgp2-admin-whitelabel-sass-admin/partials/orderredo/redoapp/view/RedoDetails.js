/**
 * Created by admin on 2019/9/26.
 */
Ext.Loader.syncRequire(["CGP.order.model.Order"]);
Ext.define('CGP.redodetails.view.RedoDetails',{
    extend: 'Ext.panel.Panel',
    mixins: ['Ext.ux.util.ResourceInit'],
    itemId:'redoDetails',
    layout: {
        type: 'vbox',
        align: 'left'
    },
    region: 'center',
    autoScroll: true,
    defaults: {
        width: '100%'
    },
    bodyPadding: '0 10 20 10',
    initComponent: function () {
        var me = this;
        me.status=Ext.Object.fromQueryString(location.search).status;
        var order=Ext.ModelManager.getModel("CGP.order.model.Order");
        var controller=Ext.create('CGP.redodetails.controller.RedoDetails');
        me.tbar = [
            {
                margin: '0 0 0 12',
                xtype: 'displayfield',
                labelStyle: 'font-weight: bold',
                labelWidth: 50,
                fieldLabel: i18n.getKey('orderNo'),
                name: 'orderNo',
                itemId: 'orderNo',
                fieldStyle: 'color:red;font-weight: bold'
            },
            {
                xtype: 'button',
                margin: '0 0 0 10',
                id: 'saveRedoOrder',
                text: i18n.getKey('order')+i18n.getKey('redo'),
                handler: function () {
                    var mask=me.setLoading();
                    controller.saveRedoOrder(mask,me,'redoOrder');
                }
            },
            {
                xtype: 'button',
                id: 'saveRedoItem',
                margin: '0 0 0 10',
                text: i18n.getKey('save'),
                disabled:true,
                handler: function (btn) {

                    var mask=me.setLoading();
                    controller.saveRedoOrder(mask,me,'redoItem');
                }
            }
        ];

        me.items = [

            Ext.create('CGP.redodetails.view.OrderLineItems'),
            Ext.create('CGP.redodetails.view.RedoLineItems')
//            {//重做订单项信息
//                xtype: 'redolineitem',
//                overflowX: 'auto',
//                overflowY: 'hidden'
//            }
        ];
        me.callParent(arguments);
        order.load(Number(Ext.Object.fromQueryString(location.search).id),{
            success: function(record, operation) {
                me.orderRecord=record;
                me.setValue(record);
            }
        })

    },
    setValue: function (order) {
        var me = this;
        me.dockedItems.items[0].getComponent('orderNo').setValue(order.get("orderNumber"));
    }
});