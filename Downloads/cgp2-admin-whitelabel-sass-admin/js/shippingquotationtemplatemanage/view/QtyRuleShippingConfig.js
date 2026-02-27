/**
 * Created by shirley on 2020/9/1.
 * 计价规则组件
 */
Ext.define('CGP.shippingquotationtemplatemanage.view.QtyRuleShippingConfig', {
    extend: 'Ext.ux.form.GridFieldWithCRUDV2',
    alias: 'widget.qtyruleshippingconfig',
    gridConfig: {
        minHeight: 200,
        maxHeight: 300,
        autoScroll: true,
        itemId: 'productList',
        selType: 'checkboxmodel',
        store: {
            xtype: 'store',
            fields: [{
                name: 'firstQty',
                type: 'int'
            }, {
                name: 'firstPrice',
                type: 'double'
            }, {
                name: 'additionalQty',
                type: 'int'
            }, {
                name: 'additionalPrice',
                type: 'double'
            }],
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    idProperty: 'firstQty'//设置唯一标识
                }
            },
            data: []
        },
        tbar: {
            hiddenButtons: ['read', 'clear', 'config', 'help', 'export', 'import'],
            btnCreate: {
                text: i18n.getKey('add') + i18n.getKey('quantityRule'),
                width: 130
            },
            btnDelete: {
                text: i18n.getKey('batch') + i18n.getKey('delete') + i18n.getKey('quantityRule'),
                iconCls: 'icon_delete',
                width: 150,
                handler: function () {
                    var me = this;
                    var grid = me.ownerCt.ownerCt;
                    Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (selector) {
                        if (selector == 'yes') {
                            //获取批量删除项个数
                            var deleteNumber = grid.getSelectionModel().getSelection().length;
                            //依次删除数据项，删除操作之前进行刷新
                            while (deleteNumber > 0) {
                                //每次删除操作之前刨床当前store中的数据为最新数据，更新store
                                var newViewData = grid.getView().dataSource.data.items;
                                var store = grid.getStore();
                                store.proxy.data = newViewData;
                                store.load();
                                var rowIndex = grid.getSelectionModel().getSelection()[0].index;
                                store.removeAt(rowIndex);
                                if (store.proxy.data) {//处理本地数据
                                    store.proxy.data.splice(rowIndex, 1);
                                }
                                deleteNumber--;
                            }
                            grid.getStore().load();
                        }
                    });
                }
            }
        },
        columns: [
            {
                text: i18n.getKey('firstQty'),
                xtype: 'gridcolumn',
                itemId: 'firstQty',
                dataIndex: 'firstQty',
                flex: 1
            },
            {
                text: i18n.getKey('firstPrice'),
                xtype: 'gridcolumn',
                itemId: 'firstPrice',
                dataIndex: 'firstPrice',
                flex: 1
            }, {
                text: i18n.getKey('additionalQty'),
                xtype: 'gridcolumn',
                itemId: 'additionalQty',
                dataIndex: 'additionalQty',
                flex: 1
            }, {
                text: i18n.getKey('additionalPrice'),
                xtype: 'gridcolumn',
                itemId: 'additionalPrice',
                dataIndex: 'additionalPrice',
                flex: 1
            }]
    },
    winConfig: {
        winTitle: null,
        setValueHandler: null,//新建和修改的具体操作
        formConfig: {
            saveHandler: function (btn) {
                var form = btn.ownerCt.ownerCt;
                var win = form.ownerCt;
                if (form.isValid()) {
                    var data = {};
                    data = form.getValue();
                    var store = win.outGrid.store;
                    console.log(data);
                    store.proxy.data ? null : store.proxy.data = [];
                    var record = win.outGrid.store.getById(data['firstQty']);
                    if (record) {
                        if (win.createOrEdit == 'create') {
                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('firstQty值为:' + data['firstQty'] + '的配置已存在'));
                            return;
                        } else if (win.createOrEdit == 'edit') {
                            if (win.record != record) {
                                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('firstQty值为:' + data['firstQty'] + '的配置已存在'));
                                return;
                            }
                        }
                    }
                    if (win.createOrEdit == 'create') {
                        store.proxy.data.push(data);
                    } else {
                        store.proxy.data[win.record.index] = data;
                    }
                    store.load();
                    win.close();
                }
            },
            itemId: 'form',
            border: false,
            defaults: {
                margin: '5 25 5 25',
                width: 450,
                maxValue: 2147483647
            },
            items: [
                {
                    name: 'firstQty',
                    xtype: 'numberfield',
                    itemId: 'firstQty',
                    fieldLabel: i18n.getKey('firstQty'),
                    value: 1,
                    step: 1,
                    minValue: 1,
                    allowBlank: false,
                    allowDecimals: false
                },
                {
                    name: 'firstPrice',
                    xtype: 'numberfield',
                    itemId: 'firstPrice',
                    fieldLabel: i18n.getKey('firstPrice'),
                    value: 1,
                    step: 1,
                    minValue: 1,
                    // 保留两位小数
                    decimalPrecision: 2,
                    allowBlank: false
                },
                {
                    name: 'additionalQty',
                    xtype: 'numberfield',
                    itemId: 'additionalQty',
                    fieldLabel: i18n.getKey('additionalQty'),
                    value: 1,
                    step: 1,
                    minValue: 1,
                    allowBlank: false,
                    allowDecimals: false
                },
                {
                    name: 'additionalPrice',
                    xtype: 'numberfield',
                    itemId: 'additionalPrice',
                    fieldLabel: i18n.getKey('additionalPrice'),
                    value: 0,
                    step: 1,
                    minValue: 0,
                    // 保留两位小数
                    decimalPrecision: 2,
                    allowBlank: false
                }
            ]
        }
    },
    initComponent: function () {
        var me = this;
        me.callParent();
    }
})
