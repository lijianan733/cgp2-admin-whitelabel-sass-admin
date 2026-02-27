Ext.define('CGP.shipmentrequirement.view.SelectAddressWin', {
    extend: 'Ext.window.Window',

    modal: true,
    layout: 'fit',
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('addressBook');
        me.bbar = {
            xtype: 'bottomtoolbar',
            saveBtnCfg: {
                handler: function (btn) {
                    var win = btn.ownerCt.ownerCt;
                    var record = win.grid.getSelectionModel().getSelection()[0];
                    if (Ext.isEmpty(record)) {
                        Ext.Msg.alert('提示', '未选择地址！');
                    } else {
                        win.addressForm.setValue(record.getData());
                        win.close();
                    }
                }
            }
        };
        me.items = [Ext.create('CGP.shipmentrequirement.view.AddressGrid', {
            filterDate: me.data,
            itemId: 'userAddressList'
        })];
        me.callParent(arguments);
        me.grid = me.getComponent('userAddressList').grid;
    }
})