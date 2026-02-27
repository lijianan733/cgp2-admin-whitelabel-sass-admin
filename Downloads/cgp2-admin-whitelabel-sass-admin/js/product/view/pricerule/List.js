Ext.define('CGP.product.view.pricerule.List', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.pricerulelist',


    initComponent: function () {
         var me = this,
            productId = this.productId;

        me.columns = [
            {
                xtype: 'actioncolumn',
                itemId: 'actioncolumn',
                sortable: false,
                hidden: me.hiddenAction,
                resizable: false,
                menuDisabled: true,
                items: [
                    {
                        iconCls: 'icon_edit icon_margin',
                        itemId: 'actionedit',
                        tooltip: i18n.getKey('edit'),
                        handler: function (view, rowIndex, colIndex) {
                            var record = view.getStore().getAt(rowIndex);
                            Ext.create('CGP.product.view.pricerule.EditWindow', {
                                record: record
                            }).show();
                        }
                    },
                    {
                        iconCls: 'icon_remove icon_margin',
                        itemId: 'actiondelete',
                        tooltip: i18n.getKey('destory'),
                        handler: function (view, rowIndex, colIndex) {
                            Ext.MessageBox.confirm(i18n.getKey('comfirmCaption'), i18n.getKey('deleteConfirm'), function (btn) {
                                var selected = me.getSelectionModel().getSelection();
                                if (btn == 'yes') {
                                    view.loadMask.show();
                                    var store = view.getStore();
                                    store.removeAt(rowIndex);
                                    if (store.getProxy().url) {
                                        store.sync({
                                            callback: function (o, m) {
                                                view.loadMask.hide();
                                                if (o.proxy.reader.rawData['success'] === true) {
                                                    Ext.ux.util.prompt(i18n.getKey('deleteSuccess'), i18n.getKey('prompt'));
                                                } else {
                                                    Ext.ux.util.prompt(o.proxy.reader.rawData.message);
                                                    store.reload({
                                                        callback: function () {
                                                            me.getSelectionModel().select(selected);
                                                        }
                                                    });

                                                }
                                            }
                                        });
                                    } else {
                                        view.loadMask.hide();
                                    }
                                }
                            });
                        }
                    }
                ]

            },
            {
                dataIndex: 'qtyFrom',
                text: i18n.getKey('qtyFrom')
            },
            {
                dataIndex: 'qtyTo',
                text: i18n.getKey('qtyTo')
            },
            {
                dataIndex: 'price',
                text: i18n.getKey('price')
            }
        ];

        me.callParent();
    },

    getValue: function () {
        var store = me.getStore();
        var data = [];
        store.each(function (record) {
            data.push(record.getData());
        });
        return data;
    }
})