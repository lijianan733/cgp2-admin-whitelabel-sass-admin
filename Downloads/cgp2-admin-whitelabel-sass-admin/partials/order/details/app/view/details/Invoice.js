Ext.define('CGP.orderdetails.view.details.Invoice', {
    extend: 'Ext.form.Panel',
    alias: 'widget.detailsinvoice',
    mixins: ['Ext.ux.util.ResourceInit'],
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
        me.items = [{
            xtype: 'numberfield',
            name: 'id',
            itemId: 'invoiceId',
            hidden: true
        }, {
            fieldLabel: i18n.getKey('type'),
            name: 'type',
            itemId: 'invoiceType',
            renderer: function (value) {
                if (value == 1) {
                    return i18n.getKey('personal')
                } else if (value == 2) {
                    return i18n.getKey('company')
                }
            }
        }, {
            fieldLabel: i18n.getKey('title'),
            name: 'title',
            itemId: 'invoiceTitle'
        }, {
            fieldLabel: i18n.getKey('content'),
            name: 'content',
            itemId: 'invoiceContent'
        }];


        me.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            //style: 'background-color:silver;',
            color: 'black',
            bodyStyle: 'border-color:white;',
            border: '1 0 0 0',
            items:[{
                xtype: 'displayfield',
                fieldLabel: false,
                value: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('invoiceInfo') + '</font>'
            },{
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
        me.order = order;
        me.setEditable(order);
        var invoice = order.get('invoice');
        if (Ext.isEmpty(invoice)) {
            return;
        }
        me.items.each(function (item) {
            item.setValue(invoice[item.name]);
        })

    },
    setEditable: function (order) {
        var me = this;
        var editBtn = me.getDockedItems('toolbar[dock="top"]')[0].getComponent('button')
        editBtn.setVisible(!Ext.Array.contains([107, 108, 109, 112], order.get('status').id));
        editBtn.setDisabled(order.get('hasProducer') == true);
        //只能预览,不能编辑
        if (JSGetQueryString('editable') == 'false') {
            editBtn.setDisabled(true);
            editBtn.setVisible(false);
        }
    }
})