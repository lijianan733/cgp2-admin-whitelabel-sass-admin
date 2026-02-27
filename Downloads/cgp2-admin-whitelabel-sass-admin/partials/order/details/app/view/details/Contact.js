Ext.define('CGP.orderdetails.view.details.Contact', {
    extend: 'Ext.form.Panel',
    alias: 'widget.detailscontact',
    mixins: ['Ext.ux.util.ResourceInit', 'CGP.orderdetails.view.interface.Valuable'],
    defaultType: 'displayfield',
    bodyStyle: 'border-top:0;border-color:white;',
    header: false,
    defaults: {
        labelAlign: 'left',
        margin: '0 0 3 6',
        width: 430
    },
    initComponent: function () {
        var me = this;
        me.items = [{
            fieldLabel: i18n.getKey('linkman'),
            name: 'billingName',
            itemId: 'billingName'
        }, {
            fieldLabel: i18n.getKey('telephone'),
            name: 'billingTelephone',
            itemId: 'billingTelephone'
        }];
        me.title = '<font color=green>' + i18n.getKey('linkman') + '</font>'
        me.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            color: 'black',
            bodyStyle: 'border-color:white;',
            border: '1 0 0 0',
            items: [{
                xtype: 'displayfield',
                fieldLabel: false,
                value: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('linkman') + '</font>'
            }, {
                xtype: 'button',
                itemId: 'button',
                text: i18n.getKey('edit'),
                action: 'edit'
            }]

        }];
        me.callParent(arguments);

    },
    setEditable: function (order) {
        var me = this;
        //特定状态才有编辑
        var editBtn = me.getDockedItems('toolbar[dock="top"]')[0].getComponent('button');
        editBtn.setVisible(!Ext.Array.contains([107, 108, 109, 112], order.get('status').id));
        editBtn.setDisabled(order.get('hasProducer') == true);
        //指定只能预览,不能编辑
        if (JSGetQueryString('editable') == 'false') {
            editBtn.setDisabled(true);
            editBtn.setVisible(false);
        }
    }
})