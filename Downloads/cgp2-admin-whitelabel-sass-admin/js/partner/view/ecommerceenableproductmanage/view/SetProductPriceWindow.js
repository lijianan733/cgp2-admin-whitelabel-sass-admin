/**
 * Created by nan on 2018/7/20.
 *
 */
Ext.define("CGP.partner.view.ecommerceenableproductmanage.view.SetProductPriceWindow", {
    extend: 'Ext.window.Window',
    modal: true,
    width: '60%',
    height: '70%',
    maximizable: true,
    selectedRecord: null,//保存选中的记录
    constrain:true,
    layout: 'fit',
    title: '设置价格',
    page: null,//查看可支持产品的页面
    preWin: null,//上一级的win
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.partner.view.ecommerceenableproductmanage.controller.Controller');
        var unAddProductStore = Ext.create('Ext.data.Store', {
            fields: [
                {
                    name: 'id',
                    type: 'string'
                },
                {
                    name: 'name',
                    type: 'string'
                },
                {
                    name: 'price',
                    type: 'string',
                    defaultValue: '<font color="gray">双击设置价格</font>'
                },
                {
                    name: 'sku',
                    type: 'string'
                }
            ],
            data: me.selectedRecord.getRange(),
            autoSync: true,
            autoLoad: true,
            proxy: {
                type: 'memory'
            }
        });
        me.loadMask = new Ext.LoadMask(me, {msg: "Please wait..."});
        var grid = Ext.widget('grid', {
            autoScroll: true,
            editAction: false,//是否启用edit的按钮
            deleteAction: true,//是否启用delete的按钮
            store: unAddProductStore,
            viewConfig: {
                enableTextSelection: true
            },
            plugins: Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 2,
                listeners: {
                    'edit': function (editor, param, e) {
                        var value = param.value;
                        var record = param.record.getId();
                        me.selectedRecord.getByKey(record).price = value;
                    }
                }
            }),
            columns: [
                {
                    xtype: 'rownumberer'
                },
                {
                    xtype: 'actioncolumn',
                    itemId: 'actioncolumn',
                    sortable: false,
                    resizable: false,
                    width: 50,
                    menuDisabled: true,
                    tdCls: 'vertical-middle',
                    items: [
                        {
                            iconCls: 'icon_remove icon_margin',
                            itemId: 'actiondelete',
                            tooltip: i18n.getKey('destroy'),
                            handler: function (view, rowIndex, colIndex, grid, event, record, dom) {
                                Ext.MessageBox.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (btn) {
                                    if (btn == 'yes') {
                                        var recordId = record.get('id');
                                        me.selectedRecord.removeAtKey(recordId);
                                        var store = view.getStore();
                                        store.removeAll();
                                        store.loadData(me.selectedRecord.getRange());
                                    }
                                });
                            }
                        }
                    ]
                },
                {
                    text: i18n.getKey('id'),
                    width: 80,
                    dataIndex: 'id'
                },
                {
                    text: i18n.getKey('name'),
                    width: 200,
                    dataIndex: 'name'
                },
                {
                    text: i18n.getKey('sku'),
                    width: 200,
                    dataIndex: 'sku'
                },
                {
                    text: i18n.getKey('price') + '(双击编辑)',
                    width: 150,
                    dataIndex: 'price',
                    editor: {
                        xtype: 'numberfield',
                        minValue: 0
                    }
                }
            ]
        });
        me.items = [grid];
        me.grid = grid;
        me.bbar = [
            {
                text: i18n.getKey('lastStep'),
                iconCls: 'icon_previous_step',
                handler: function (btn) {
                    me.preWin.show();
                    me.preWin.grid.grid.store.load();
                    me.close();
                }
            },
            '->',
            {
                text: i18n.getKey('ok'),
                iconCls: 'icon_agree',
                handler: function (btn) {
                    controller.patchCreateEnableProduct(me);
                }
            },
            {
                text: i18n.getKey('cancel'),
                iconCls: 'icon_cancel',
                handler: function (btn) {
                    me.close();
                }
            }
        ];
        me.callParent(arguments);

    }
})