/**
 * Created by nan on 2019/8/19.
 * 收集所有ProductInstance
 */

Ext.define('CGP.order.view.cgpplaceorder.view.OrderItemGrid', {
    extend: 'Ext.grid.Panel',
    itemId: 'orderItemGrid',
    defaults: {
        sortable: false
    },
    title: i18n.getKey('订单项列表'),
    viewConfig: {
        loadMask: true,
        markDirty: false,//标识修改的字段,
        enableTextSelection: true,
        stripeRows: true
    },
    serializeData: function () {
        var grid = this;
        var lineItemsData = [];
        for (var i = 0; i < grid.store.data.items.length; i++) {
            var item = grid.store.data.items[i];
            lineItemsData.push(item.getData());
        }
        Ext.util.Cookies.set('cgpOrderItemArr', Ext.JSON.encode(lineItemsData));
        if (lineItemsData.length == 0) {
            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('订单项不能为0条'));
            return;
        }
    },
    tbar: [
        {
            xtype: 'button',
            iconCls: 'icon_add',
            text: i18n.getKey('add') + i18n.getKey('orderLineItem'),
            handler: function (btn) {
                var grid = btn.ownerCt.ownerCt;
                //添加新的订单项，sku，还是configurable
                //选择产品，根据选择产品是sku，还是configurable,跳转到景鹏兄的页面
                //后进入同一编辑页面，如果该产品无mvt,则略过配置mvt的流程,
                var window = Ext.create('CGP.order.view.cgpplaceorder.view.SelectProductWindow');
                window.show();
            }
        },
        {
            xtype: 'button',
            iconCls: 'icon_refresh',
            text: i18n.getKey('refresh'),
            handler: function (btn) {
                var grid = btn.ownerCt.ownerCt;
                grid.refreshData();
            }
        }

    ],
    bbar: [
        '->',
        {
            xtype: 'button',
            iconCls: 'icon_next_step',
            text: i18n.getKey('nextStep'),
            handler: function (btn) {
                var grid = btn.ownerCt.ownerCt;
                grid.serializeData();
                var outTab = grid.ownerCt;
                console.log('生成lineItems:');
                if (grid.store.data.items.length > 0) {
                    var orderInfoPanel = outTab.getComponent('orderInfoPanel');
                    outTab.remove(orderInfoPanel);
                    orderInfoPanel = Ext.create('CGP.order.view.cgpplaceorder.view.OrderInfoPanel', {
                        itemId: 'orderInfoPanel'
                    });
                    outTab.add(orderInfoPanel);
                    outTab.setActiveTab(orderInfoPanel);
                }
            }
        }
    ],
    controller: Ext.create('CGP.order.view.cgpplaceorder.controller.Controller'),
    refreshData: function () {
        var me = this;
        var orderItem = Ext.JSON.decode(Ext.util.Cookies.get('cgpOrderItemArr')) || [];
        me.setLoading(true);
        setTimeout(function () {
            me.store.proxy.data = orderItem;
            me.store.load();
            me.setLoading(false);
        }, 500);

    },
    listeners: {
        afterrender: function () {
            var me = this;
            me.refreshData();
        }
    },
    initComponent: function () {
        var me = this;
        me.store = Ext.create('Ext.data.Store', {
            autoSync: true,
            fields: [
                'thumbnail',
                'canEdit',
                {
                    name: 'qty',
                    type: 'int'
                },
                {
                    name: 'price',
                    type: 'int',
                    convert: function (value, record) {
                        return record.get('productInfo').price;
                    }
                },
                {
                    name: 'allPrice',
                    type: 'int',
                    convert: function (value, record) {
                        return (record.get('productInfo').price * record.get('qty')).toFixed(2);
                    }
                }, {
                    name: 'productInfo',
                    type: 'object'
                },
                'productInstanceId',
                'comment'
            ],
            data: [],
            proxy:
                'memory'
        });
        me.columns = [
            {
                xtype: 'actioncolumn',
                width: 50,
                tdCls: 'vertical-middle',
                sortable: false,
                items: [
                    {
                        iconCls: 'icon_edit icon_margin',
                        tooltip: 'Edit',
                        handler: function (gridView, rowIndex, colIndex, a, b, record) {
                            var grid = gridView.ownerCt;
                            grid.serializeData();
                            var canEdit = record.get('canEdit');
                            if (canEdit) {
                                var productInstanceId = record.get('productInstanceId');
                                var productInstance = grid.controller.getProductInstance(productInstanceId);
                                var window = Ext.create('Ext.window.Window', {
                                    title: i18n.getKey('修改') + i18n.getKey('产品定制图片'),
                                    layout: 'fit',
                                    modal: true,
                                    constrain: true,
                                    width: 1100,
                                    height: 800,
                                    items: []
                                });
                                var outPanel = Ext.create('CGP.order.view.cgpplaceorder.view.EditOutPanel', {
                                    productMaterialViewTypes: productInstance.libraries.productMaterialViewTypes,
                                    materialViewTypes: productInstance.libraries.materialViewTypes,
                                    productConfig: productInstance,
                                    productId: productInstance.productId,
                                    header: false,
                                    record: record
                                });
                                var centerPanel = Ext.create('Ext.panel.Panel', {
                                    region: 'center',
                                    itemId: 'centerPanel',
                                    flex: 1,
                                    layout: 'fit'
                                });
                                var leftPanel = Ext.create('CGP.order.view.cgpplaceorder.view.LeftTreePanel', {
                                    productMaterialViewTypes: productInstance.libraries.productMaterialViewTypes,
                                    materialViewTypes: productInstance.libraries.materialViewTypes,
                                    productConfig: productInstance,
                                    productId: productInstance.productId,
                                    itemId: 'leftTreePanel',
                                    editOrCreate: 'edit'
                                });
                                outPanel.add([leftPanel, centerPanel]);
                                window.add(outPanel);
                                window.show();
                            } else {
                                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('该订单项无可自定义的productMaterialView'));
                            }
                        }
                    },
                    {
                        iconCls: 'icon_remove icon_margin',
                        tooltip: 'Delete',
                        handler: function (view, rowIndex, colIndex, a, b, record) {
                            var store = view.getStore();
                            var constraintId = record.getId();
                            Ext.Msg.confirm('提示', '确定删除？', callback);

                            function callback(id) {
                                if (id === 'yes') {
                                    store.remove(record);
                                    var grid = view.ownerCt;
                                    grid.serializeData();
                                }
                            }
                        }
                    }
                ]
            },
            {
                xtype: 'imagecolumn',
                width: 150,
                dataIndex: 'thumbnail',
                text: i18n.getKey('languageImgText'),
                buildUrl: function (value, metadata, record) {
                    var imageUrl = imageServer + value;
                    return imageUrl;
                },
                buildPreUrl: function (value, metadata, record) {
                    var imageUrl = imageServer + value;
                    return imageUrl;
                },
                buildTitle: function (value, metadata, record) {
                    return `${i18n.getKey('check')} < ${value} > 预览图`;
                },
            },
            {
                xtype: 'componentcolumn',
                dataIndex: 'productInfo',
                width: 250,
                sortable: false,
                text: i18n.getKey('product') + i18n.getKey('info'),
                tdCls: 'vertical-middle',
                renderer: function (value, mate, record) {
                    var objArr = [];
                    for (var i in value) {
                        objArr.push({
                            title: i,
                            value: value[i]
                        })
                    }
                    return JSCreateHTMLTable(objArr);
                }
            },
            {
                dataIndex: 'qty',
                tdCls: 'vertical-middle',
                xtype: 'componentcolumn',
                text: i18n.getKey('qty'),
                sortable: false,
                renderer: function (value, mete, record) {
                    return {
                        xtype: 'numberfield',
                        minValue: 1,
                        value: value,
                        addCls: function () {

                        },
                        listeners: {
                            change: function (field) {
                                record.set('qty', field.getValue());
                                record.set(('allPrice', field.getValue() * record.get('price')).toFixed(2));
                                return false;

                            }
                        }
                    }
                }

            },
            {
                dataIndex: 'productInfo',
                tdCls: 'vertical-middle',
                sortable: false,
                text: i18n.getKey('price'),
                renderer: function (value, mete, record) {
                    return value.price;
                }

            },
            {
                dataIndex: 'qty',
                tdCls: 'vertical-middle',
                sortable: false,
                text: i18n.getKey('totalPrice'),
                renderer: function (value, mete, record) {
                    return (value * record.raw.productInfo.price).toFixed(2);
                }
            },
            {
                dataIndex: 'comment',
                tdCls: 'vertical-middle',
                sortable: false,
                text: i18n.getKey('comment'),
                flex: 1,
                xtype: 'componentcolumn',
                renderer: function (value, mete, record) {
                    return {
                        xtype: 'textarea',
                        value: value,
                        width: '100%',
                        height: 100,
                        listeners: {
                            blur: function (field) {
                                record.set('comment', field.getValue())
                            }
                        }
                    }
                }
            }
        ];
        me.callParent();
    }
})
