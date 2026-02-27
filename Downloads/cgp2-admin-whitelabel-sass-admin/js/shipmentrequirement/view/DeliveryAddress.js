/**
 * 收货人信息
 **/
Ext.define('CGP.shipmentrequirement.view.DeliveryAddress', {
    extend: 'CGP.common.commoncomp.AddressBookForm',
    alias: 'widget.deliveryaddress',
    header: false,
    address: null,
    editable: true,
    border: false,
    layout: {
        type: 'table',
        columns: 2
    },
    defaults: {
        margin: '5 25 5 25',
        labelWidth: 80,
        width: 350,
        msgTarget: 'side',
    },
    initComponent: function () {
        var me = this;
        me.tbar = {
            xtype: 'toolbar',
            border: '0 0 1 0',
            disabled: me.readOnly,
            items: [
                {
                    xtype: 'displayfield',
                    value: JSCreateFont('green', true, i18n.getKey('收件人地址信息'))
                },
                {
                    xtype: 'button',
                    itemId: 'button',
                    text: i18n.getKey('import') + i18n.getKey('address'),
                    handler: function () {
                        Ext.create('CGP.shipmentrequirement.view.SelectAddressWin', {
                            addressForm: me
                        }).show();
                    }
                }]
        };
        me.callParent(arguments);
    },
    setValue: function (data) {
        var me = this;
        me.address = data;
        Ext.Array.each(me.items.items, function (item) {
            if (item.diySetValue) {
                item.diySetValue(data[item.name])
            } else {
                item.setValue(data[item.name])
            }
        })
    },
    getValue: function () {
        var me = this;
        var data = me.getValues();
        return data;
    }

})