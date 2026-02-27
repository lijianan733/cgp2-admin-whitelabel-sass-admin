/**
 * @Description: 修改指的范围的sku产品价格
 * 分为指的发货项内的 整个订单内的
 * @author nan
 * @date 2024/8/28
 */
Ext.define('CGP.orderpricemodify.view.ModifySkuProductPriceWin', {
    extend: 'Ext.window.Window',
    modal: true,
    constrain: true,
    layout: 'fit',
    width: 1000,
    height: 500,
    type: 'deliveryOrder',//deliveryOrder 发货单，saleOrder 整个销售订单
    shipmentRequirementId: null,//发货要求id
    orderId: null,//销售订单id
    outFieldset: null,
    outForm: null,
    modifyInfo: null,//记录修改的内容
    bbar: {
        xtype: 'bottomtoolbar',
        saveBtnCfg: {
            handler: function (btn) {
                var win = btn.ownerCt.ownerCt;
                var grid = win.getComponent('grid');
                var selection = grid.getSelectionModel().getSelection();
                if (selection.length > 0) {
                    JSSetLoading(true, '加载中...');
                    setTimeout(function () {
                        Ext.suspendLayouts();
                        console.log(win.modifyInfo);
                        //修改界面数据，同时修改proxy.data的数据和界面的数据
                        for (var i = 0; i < selection.length; i++) {
                            var record = selection[i];
                            var sku = record.get('productInfo').sku;
                            var price = record.get('price');
                            var compArr = [];
                            if (win.type == 'deliveryOrder') {
                                //compArr = win.outFieldset.query(`[itemId=${sku}]`);
                                win.updatePrice([win.outFieldset], sku, price);

                            } else if (win.type == 'saleOrder') {
                                //compArr = win.outForm.query(`[itemId=${sku}]`);
                                var fieldSet = win.outForm.query('[xtype=address_fieldset]');
                                win.updatePrice(fieldSet, sku, price);
                            }
                            // compArr.map(function (item) {
                            //     item.setValue(price);
                            // });
                        }
                        Ext.resumeLayouts();
                        JSSetLoading(false);
                        win.close();
                        Ext.Msg.alert('提示', '修改完成');
                    }, 500);
                } else {
                    Ext.Msg.alert('提示', '请选择需要更改的产品');
                }
            }
        }
    },
    initComponent: function () {
        var me = this;
        me.modifyInfo = {};
        var currencySymbol = JSGetQueryString('currencySymbol');
        me.items = [
            {
                xtype: 'grid',
                itemId: 'grid',
                selModel: Ext.create("Ext.selection.CheckboxModel", {
                    injectCheckbox: 0,//checkbox位于哪一列，默认值为0
                    mode: "simple",//multi,simple,single；默认为多选multi
                    checkOnly: true,//如果值为true，则只用点击checkbox列才能选中此条记录
                }),
                store: {
                    fields: [
                        'productDescription',
                        'qty',
                        'price',
                        'cost',
                        'currency',
                        'productInfo'
                    ],
                    data: []
                },
                columns: [
                    {
                        xtype: 'rownumberer'
                    },
                    {
                        xtype: 'auto_bread_word_column',
                        text: '产品描述',
                        dataIndex: 'productDescription',
                        flex: 1,
                    },
                    {
                        xtype: 'componentcolumn',
                        width: 250,
                        text: '产品|物料',
                        dataIndex: 'productInfo',
                        renderer: function (value) {
                            var items = [
                                {
                                    title: i18n.getKey('name'),
                                    value: value.name
                                },
                                {
                                    title: i18n.getKey('model'),
                                    value: value.model
                                },
                                {
                                    title: 'Sku',
                                    value: value.sku
                                }
                            ];
                            return JSCreateHTMLTable(items);
                        }
                    },
                    {
                        text: '合计下单数量',
                        dataIndex: 'qty',
                    },
                    {
                        xtype: 'componentcolumn',
                        text: '单价' + `(${currencySymbol})`,
                        dataIndex: 'price',
                        renderer: function (value, metaData, record, rowIndex, colIndex, data, gridView) {
                            return {
                                xtype: 'numberfield',
                                minValue: 0,
                                msgTarget: 'side',
                                value: value,
                                checkChangeBuffer: 500,//1秒检查一次改变
                                tagInfo: record.get('productInfo').sku + '_price',//标识组件的唯一标识
                                listeners: {
                                    change: function (field, newValue, oldValue) {
                                        gridView.ownerCt.forceFieldTagInfo = field.tagInfo;
                                        if (field.isValid()) {
                                            setTimeout(function () {
                                                record.set('price', newValue);
                                            }, 100);
                                        }
                                    }
                                }
                            };
                        }
                    },
                    {
                        text: '成本' + `(${currencySymbol})`,
                        dataIndex: 'cost',
                    }
                ],
                forceFieldTagInfo: null,//焦点元素
                viewConfig: {
                    listeners: {
                        //重新获取焦点
                        itemupdate: function () {
                            var view = this;
                            var grid = view.ownerCt;
                            setTimeout(function () {
                                var comp = grid.down(`[tagInfo=${grid.forceFieldTagInfo}]`);
                                if (comp) {
                                    comp.inputEl.dom.selectionStart = String(comp.getValue()).length;
                                    comp.inputEl.dom.selectionEnd = String(comp.getValue()).length;
                                    comp.focus();

                                }
                                console.log(grid.forceFieldTagInfo);
                            }, 100);
                        },
                    }
                }
            }
        ];
        me.callParent();
        me.on('afterrender', function () {
            me.refreshData();
        });
    },
    refreshData: function () {
        var me = this;
        var grid = me.getComponent('grid');
        var controller = Ext.create('CGP.orderpricemodify.controller.Controller');
        var data = controller.getSkuProductInfo(me.type, me.orderId, me.shipmentRequirementId);
        grid.store.proxy.data = data;
        grid.store.load();
    },
    /**
     * 跟新fieldset里面的产品价格
     */
    updatePrice: function (fieldSetArr, sku, price) {
        fieldSetArr.map(function (item) {
            var orderItemStore = item.orderItemStore;
            orderItemStore.proxy.data.map(function (deliveryItem) {
                if (deliveryItem.product.sku == sku) {
                    deliveryItem.price = price;
                    var amount = parseFloat((deliveryItem.qty * price).toFixed(2));
                    deliveryItem.amount = amount;

                }
            });
            orderItemStore.load();
            //重新计算各个fieldset的产品价格信息
            item.reCalculateProductPrice();
        });
    }
})
