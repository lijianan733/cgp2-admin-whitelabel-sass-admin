/**
 * Created by nan on 2018/4/28.
 */
Ext.define("CGP.partner.view.suppliersupportableproduct.view.SelectEnaddableProductWindow", {
    extend: 'Ext.window.Window',
    modal: true,
    width: '60%',
    height: '70%',
    constrain: true,
    maximizable: true,
    selectedRecord: null,//保存选中的记录
    layout: 'fit',
    title: '选择产品',
    initComponent: function () {
        var me = this;
        me.selectedRecord = new Ext.util.MixedCollection();
        var controller = Ext.create('CGP.partner.view.suppliersupportableproduct.controller.Controller');
        var unAddProductStore = Ext.create('CGP.partner.view.suppliersupportableproduct.store.AddAbleSupportableProductStore', {
            partnerId: me.partnerId,
            params: {
                filter: '[{"name":"type","value":"%sku%","type":"string"}]'
            }
        });
        var grid = me.grid = Ext.create('CGP.common.commoncomp.QueryGrid', {
            gridCfg: {
                autoScroll: true,
                editAction: false,//是否启用edit的按钮
                deleteAction: false,//是否启用delete的按钮
                store: unAddProductStore,
                selType: 'checkboxmodel',
                viewConfig: {
                    enableTextSelection: true
                },
                columns: [
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
                        text: i18n.getKey('model'),
                        width: 200,
                        dataIndex: 'model'
                    }
                ],
                listeners: {
                    //选中时加到collection集合中
                    'select': function (checkModel, record) {
                        me.selectedRecord.add(record.get("id"), record.data);
                    },
                    //取消选中时 从集合中去除
                    'deselect': function (checkModel, record, index, eOpts) {
                        me.selectedRecord.removeAtKey(record.get("id"));
                    }
                }
            },
            filterCfg: {
                minHeight: 80,
                header: false,
                items: [
                    {
                        xtype: 'numberfield',
                        fieldLabel: i18n.getKey('id'),
                        name: 'id',
                        itemId: 'id',
                        hideTrigger: true,
                        isLike: false,
                        labelWidth: 40
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('sku'),
                        name: 'sku',
                        itemId: 'sku',
                        isLike: true,
                        labelWidth: 40
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('model'),
                        name: 'model',
                        itemId: 'model',
                        isLike: true,
                        labelWidth: 40
                    }
                ]
            }
        });
        unAddProductStore.on('load', function (store, records, options) {
            //遍历collection恢复翻页选中的产品
            Ext.Array.each(me.selectedRecord, function () {
                for (var i = 0; i < records.length; i++) {
                    var record = records[i];
                    if (me.selectedRecord.get(record.getId())) {
                        grid.grid.getSelectionModel().select(i, true, false);    //选中record，并且保持现有的选择，不触发选中事件
                    } else {
                        grid.grid.getSelectionModel().deselect(i, true);
                    }
                }
            });
        });
        me.items = [grid];
        me.grid = grid;
        me.bbar = [
            '->',
            {
                text: i18n.getKey('nextStep'),
                iconCls: 'icon_next_step',
                handler: function (btn) {
                    if (me.selectedRecord.getCount() > 0) {
                        var win2 = Ext.create('CGP.partner.view.suppliersupportableproduct.view.SetProductPriceWindow', {
                            selectedRecord: me.selectedRecord,
                            preWin: me,
                            partnerId: me.partnerId,
                            page: me.page
                        });
                        win2.show();
                        me.hide();
                    } else {
                        Ext.Msg.alert(i18n.getKey('prompt'), '请先选择要添加的产品');
                    }
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
});
