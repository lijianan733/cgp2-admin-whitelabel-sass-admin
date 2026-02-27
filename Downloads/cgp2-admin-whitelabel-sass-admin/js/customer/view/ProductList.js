/**
 * productList
 * @Author: miao
 * @Date: 2022/3/16
 */
Ext.define("CGP.customer.view.ProductList", {
    extend: "CGP.common.commoncomp.QueryGrid",
    alias: 'widget.productlist',
    selectedRecord: null,
    initComponent: function () {
        var me = this;
        var loginUser=Ext.JSON.decode(Ext.util.Cookies.get("user"));
        if(Ext.isEmpty(loginUser)||Ext.Object.isEmpty(loginUser)){
            return false;
        }
        var candidateProductStore = Ext.create('CGP.customer.store.CandidateProduct', {
            loginUserEmail: loginUser.email,
            targetUserEmail: me.email
        });
        me.selectedRecord = new Ext.util.MixedCollection();
        me.gridCfg = {
            autoScroll: true,
            editAction: false,//是否启用edit的按钮
            deleteAction: false,//是否启用delete的按钮
            store: candidateProductStore,
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
                    dataIndex: 'name',
                    renderer: function (value, metadata, record, index, count, store) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
                },
                {
                    text: i18n.getKey('sku'),
                    width: 200,
                    dataIndex: 'sku',
                    renderer: function (value, metadata, record, index, count, store) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    }
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
        };
        me.filterCfg = {
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
                    name: 'sku',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('sku'),
                    itemId: 'sku'
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

                }
            ]
        };
        candidateProductStore.on('load', function (store, records, options) {
            //遍历collection恢复翻页选中的产品
            Ext.Array.each(me.selectedRecord, function () {
                for (var i = 0; i < records.length; i++) {
                    var record = records[i];
                    if (me.selectedRecord.get(record.getId())) {
                        me.grid.getSelectionModel().select(i, true, false);    //选中record，并且保持现有的选择，不触发选中事件
                    } else {
                        me.grid.getSelectionModel().deselect(i, true);
                    }
                }
            });
        });
        me.callParent(arguments);
    },

});