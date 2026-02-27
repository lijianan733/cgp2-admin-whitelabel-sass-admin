/**
 * @Description:外派生产的订单，
 * 每个外派订单都有自己的快递信息，
 * 现在同一订单同一生产商的快递信息一样
 * @author nan
 * @date 2022/12/2
 */

Ext.define('CGP.orderdetails.view.details.OutSendOrderItem', {
    extend: 'Ext.form.Panel',
    alias: 'widget.outsendorderitem',
    mixins: ['Ext.ux.util.ResourceInit'],
    layout: 'fit',
    defaultType: 'displayfield',
    bodyStyle: 'border-top:0;border-color:white;',
    header: false,
    defaults: {
        labelAlign: 'left',
        margin: '0 0 3 6',
        width: 600
    },
    initComponent: function () {

        var me = this;
        me.title = '<font color=green>' + i18n.getKey('外派订单项') + '</font>'
        me.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            color: 'black',
            bodyStyle: 'border-color:white;',
            border: '1 0 0 0',
            items: [{
                xtype: 'displayfield',
                fieldLabel: false,
                value: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('外派订单项') + '</font>'
            }, {
                xtype: 'button',
                itemId: 'button',
                text: i18n.getKey('edit'),
                action: 'edit'
            }]

        }];
        me.callParent(arguments);

    },

    setValue: function (order) {

        var me = this;
        me.setEditable(order);
        var paymentMethod = order.get('paymentMethod');
        me.removeAll();
        me.add(Ext.widget({
            xtype: 'displayfield',
            fieldLabel: i18n.getKey('外派订单项'),
            value: paymentMethod
        }))
    },
    setEditable: function (order) {
        var me = this;
        var editBtn = me.getDockedItems('toolbar[dock="top"]')[0].getComponent('button')
        editBtn.setVisible(Ext.Array.contains([40, 100], order.get('status').id));
        editBtn.setDisabled(order.get('hasProducer') == true);
        //只能预览,不能编辑
        if (JSGetQueryString('editable') == 'false') {
            editBtn.setDisabled(true);
            editBtn.setVisible(false);
        }
    }
})
