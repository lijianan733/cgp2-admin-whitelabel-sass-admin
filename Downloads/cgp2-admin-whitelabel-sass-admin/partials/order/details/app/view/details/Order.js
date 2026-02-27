Ext.define('CGP.orderdetails.view.details.Order', {
    extend: 'Ext.form.Panel',
    alias: 'widget.detailsorder',
    mixins: ['Ext.ux.util.ResourceInit', 'CGP.orderdetails.view.interface.Valuable'],




    defaultType: 'displayfield',
    bodyStyle: 'border-color:white;',
    /*header: {
        style: 'background-color:white;',
        color: 'black',
        border: '1 0 0 0'
    },*/
    header: false,
    height:100,
    hidden: true,
    width: '100%',
    defaults: {
        labelAlign: 'left',
        margin: '0 0 3 6',
        width: 430
    },
    initComponent: function () {

        var me = this;



        me.items = [{
            fieldLabel: i18n.getKey('orderNo'),
            name: 'orderNo',
            itemId: 'orderNo'
        }, {
            fieldLabel: i18n.getKey('sourceOrderNo'),
            name: 'sourceOrderNo',
            itemId: 'sourceOrderNo',
            hidden: true
        }, {
            fieldLabel: i18n.getKey('datePurchased'),
            name: 'datePurchased',
            itemId: 'datePurchased',
            renderer: function (value) {
                return Ext.Date.format(new Date(value), 'Y-m-d H:i:s');
            }
        }];

        //me.title = '<font color=green>基本信息</font>';
        me.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            //style: 'background-color:silver;',
            color: 'black',
            bodyStyle: 'border-color:white;',
            border: '0 0 0 0',
            items:[{xtype: 'displayfield',
                fieldLabel: false,
                value: "<font style= ' color:green;font-weight: bold'>" + '基本信息' + '</font>'}]

        }];
        me.callParent(arguments);
    },

    setValue: function (order) {

        var me = this;
        if (order.get('orderType') !== 'RM') {
            me.getComponent('orderNo').setValue(order.get("orderNumber") + '(<font color=blue>' + i18n.getKey(order.get('status').name)+ '</font>)')
            me.getComponent('datePurchased').setValue(order.get("datePurchased"));
        } else {
            me.getComponent('orderNo').setValue(order.get("orderNumber") + '(<font color=blue>' + i18n.getKey(order.get('status').name) + '</font>)');
            me.getComponent('orderNo').setFieldLabel(i18n.getKey('replenishmentNo'));
            me.getComponent('sourceOrderNo').setValue(order.get("sourceOrderNumber"));
            me.getComponent('sourceOrderNo').setFieldLabel(i18n.getKey('orderNo'));
            me.getComponent('sourceOrderNo').setVisible(true);
            me.getComponent('datePurchased').setValue(order.get("datePurchased"));
        }
    }

})