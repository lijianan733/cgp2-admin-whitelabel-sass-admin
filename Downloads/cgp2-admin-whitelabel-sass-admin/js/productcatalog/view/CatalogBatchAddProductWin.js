/**
 * Created by nan on 2018/7/23.
 */
Ext.define("CGP.productcatalog.view.CatalogBatchAddProductWin", {
    extend: 'Ext.window.Window',
    modal: true,
    width: '60%',
    height: '70%',
    selectedRecord: null,//保存选中的记录
    layout: 'fit',
    title: '选择产品',
    constrain: true,
    catalogId: null,
    maximizable: true,
    outGridStore: null,//gridpanel的store
    initComponent: function () {
        var me = this;
        me.selectedRecord = new Ext.util.MixedCollection();
        var unAddProductStore = Ext.create('CGP.productcatalog.store.ExcludeCatalogProductStore', {
            catalogId: me.catalogId
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
                        dataIndex: 'model',
                        width: 200,
                        itemId: 'model',
                        renderer: function (value, metadata, record, index, count, store) {
                            metadata.tdAttr = 'data-qtip="' + value + '"';
                            return value;
                        }
                    },
                    {
                        text: i18n.getKey('type'),
                        dataIndex: 'type',
                        width: 150,
                        itemId: 'type',
                        renderer: function (value, metadata, record, index, count, store) {
                            metadata.tdAttr = 'data-qtip="' + value + '"';
                            return value;
                        }
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
                width: '100%',
                minHeight: 100,
                layout: {
                    type: 'table',
                    columns: 3
                },
                header: false,
                items: [
                    {
                        name: 'id',
                        xtype: 'numberfield',
                        fieldLabel: i18n.getKey('product') + i18n.getKey('id'),
                        itemId: 'productId',
                        minValue: 1,
                        allowDecimals: false,
                        allowExponential: false,
                        hideTrigger: true
                    },
                    {
                        name: 'name',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('name'),
                        itemId: 'name'
                    },
                    {
                        name: 'model',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('model'),
                        itemId: 'model'
                    },
                    {
                        name: 'type',
                        fieldLabel: i18n.getKey('type'),
                        itemId: 'type',
                        xtype: 'combo',
                        editable: false,
                        store: Ext.create('Ext.data.Store', {
                            fields: ['type', "value"],
                            data: [
                                {
                                    type: 'Sku', value: 'SKU'
                                },
                                {
                                    type: 'Configurable', value: 'Configurable'
                                }
                            ]
                        }),
                        displayField: 'type',
                        valueField: 'value',
                        queryMode: 'local'

                    },
                    {
                        name: 'sku',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('sku'),
                        itemId: 'sku'
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
                    var win = this.ownerCt.ownerCt;
                    var addProductIds = me.selectedRecord.keys;
                    //查找出要添加的产品对应的发布配置
                    var result = [];
                    var count = 0;
                    if (addProductIds.length > 0) {
                        JSSetLoading(true);
                        for (var i = 0; i < addProductIds.length; i++) {
                            var url = adminPath + 'api/cms-configs' +
                                '?page=1&start=0&limit=25&filter=[' +
                                '{"name":"clazz","value":"com.qpp.cgp.domain.cms.ProductDetailCMSConfig","type":"string"},' +
                                '{"name":"product._id","value":' + addProductIds[i] + ',"type":"number"}]';
                            JSAjaxRequest(url, 'GET', true, false, false, function (require, success, response) {
                                if (success) {
                                    count = count + 1;
                                    var responseText = Ext.JSON.decode(response.responseText);
                                    if (responseText.success) {
                                        var data = responseText.data.content[0];
                                        if (data) {
                                            result.push(data);
                                        }
                                        if (count == (addProductIds.length)) {
                                            JSSetLoading(false);
                                            var controller = Ext.create('CGP.productcatalog.controller.Controller');
                                            controller.showNextStepWin(result, me.selectedRecord, win.catalogId, win);
                                            win.hide();
                                        }
                                    }
                                } else {
                                    JSSetLoading(false);
                                }
                            }, false);
                        }
                    } else {
                        Ext.Msg.alert('提示', '请先选择要添加的产品!');
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
