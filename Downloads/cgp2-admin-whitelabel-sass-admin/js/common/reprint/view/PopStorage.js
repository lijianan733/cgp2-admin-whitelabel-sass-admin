Ext.define('CGP.common.reprint.view.PopStorage', {
    extend: 'Ext.window.Window',
    alias: 'widget.reprintpopstorage',
    requires: [
        'CGP.common.reprint.controller.Controller',
        'CGP.common.reprint.store.WorkOrderLineItemStorage'
    ],


    applyStatus: {
        printed: 'printed',
        produced: 'produced',
        deliveried: 'deliveried'
    },


    title: '产品退仓补印',
    modal: true,
    width: 600,
    height: 700,
    data: [],

    initComponent: function () {
        var me = this,
            record = this.record,
            data = me.data;

        me.controller = Ext.create('CGP.common.reprint.controller.Controller');

        var id = record.get('id');


        me.items = [{
            xtype: 'grid',
            height: 250,
            itemId: 'grid',
            selModel: new Ext.selection.CheckboxModel({
                mode: 'MULTI'
            }),
            store: Ext.create('CGP.common.reprint.store.WorkOrderLineItemStorage', {
                id: record.get('id'),
                needNew: false
            }),
            columns: [{
                text: '仓位',
                dataIndex: 'storageName'
            }, {
                text: '数量',
                dataIndex: 'qty'
            }, {
                text: '退仓数',
                xtype: 'componentcolumn',
                renderer: function (value, metadata, record) {
                    var storageId = record.get('storageId');
                    data[storageId] = 1;
                    return {
                        xtype: 'numberfield',
                        minValue: 1,
                        maxValue: record.get('qty'),
                        allowDecimals: false,
                        allowExponential: false,
                        allowBlank: false,
                        value: 1,
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                if (!field.isValid()) {
                                    this.setValue(1);
                                }
                                data[storageId] = newValue;
                            }
                        }
                    }
                }
            }]
        }, {
            xtype: 'reasonselector'

            }, {
            xtype: 'textarea',
            itemId: 'remark',
            width: 400,
            height: 150,
            fieldLabel: i18n.getKey('remark')
        }];

        me.bbar = [{
            xtype: 'button',
            text: '确定',
            handler: function () {
                me.submitApply();
            }
        }];


        me.callParent(arguments);
    },

    submitApply: function () {

        var me = this,
            window = this,
            grid = this.down('grid'),
            data = this.data,
            id = this.record.get('id'),
            reprintWindow = this.reprintWindow;

        reprintWindow.close();

        var records = grid.getSelectionModel().getSelection();
        if (records.length == 0) {
            Ext.Msg.alert('提示', '必须选中一个仓位!')
            return;
        }

        var submitData = [];
        var totalQty = 0;
        Ext.Array.each(records, function (record) {
            var item = {};
            item.storageId = record.get('storageId');
            item.qty = data[record.get('storageId')];
            totalQty += item.qty;
            submitData.push(item);
        });

        var remark = me.getComponent('remark').getValue();
        if (Ext.isEmpty(remark)) {
            Ext.Msg.alert('提示', '备注不能为空!')
            return;
        }

        Ext.Ajax.request({
            method: 'DELETE',
            url: adminPath + 'api/admin/workLineItem/' + id + '/storage',
            jsonData: submitData,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (resp, operation) {
                var response = Ext.JSON.decode(resp.responseText);
                if (response.success) {

                    var data = {
                        status: me.applyStatus.produced,
                        qty: totalQty,
                        remark: remark
                    }
                    me.controller.confirmReprintApply(id, null, window, me.applyStatus.produced, data, me.callback);

                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            },
            failure: function (resp, operation) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
    }
})