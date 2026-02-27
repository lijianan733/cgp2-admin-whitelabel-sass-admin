Ext.define('CGP.ordersign.view.orderInfo.OrderAmount', {
    extend: 'Ext.ux.form.field.UxFieldSet',
    alias: 'widget.order_amount',
    padding: '5 0 0 0',
    queryResult: null,
    isEmptyResult: null,
    initComponent: function () {
        var me = this;
        var paddingDescValue = null;
        var orderId = JSGetQueryString('id');
        var controller = Ext.create('CGP.ordersign.controller.Controller');
        var store = Ext.create('CGP.ordersign.store.SalesOrderItemStore', {
            proxy: {
                type: 'uxrest',
                url: adminPath + 'api/orders/' + orderId + '/lineItemsV2',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            },
        });
        var queryResult = me.queryResult;
        var lineItems = queryResult['lineItems'];
        var lineItemsLength = lineItems.length;
        var changeFn = function (container) {
            var orderAmount = container.ownerCt;
            var items = container.items.items;
            var increase = 0, decrease = 0;
            var totalPriceAfterDiscount = container.getComponent('totalPriceAfterDiscount');
            var totalPriceAfterDiscountValue = totalPriceAfterDiscount.getComponent('value');
            items.forEach(item => {
                if (!item.hidden) {
                    var name = item.name;
                    var value = item.diyGetValue ? item.diyGetValue() : item.getValue();
                    (name === 'extraList') && (value = value['paddingPrice']);
                    !(['bankTransferDiscount', 'discountAmount', 'totalPriceAfterDiscount'].includes(name)) && (increase += +value);
                    ['bankTransferDiscount', 'discountAmount'].includes(name) && (decrease += +value);
                }
            })
            var totalPrice = Math.floor((increase - decrease) * 100) / 100;
            var totalPriceText = controller.getTitleBold('#C76989', true, totalPrice);
            var showTotalPrice = orderAmount.getComponent('showTotalPrice');
            totalPriceAfterDiscountValue.diySetValue(totalPriceText, totalPrice);
            showTotalPrice.diySetValues(totalPriceText, totalPrice);
        }
        var item = [
            {
                xtype: 'grid',
                width: '100%',
                name: 'lineItems',
                itemId: 'lineItems',
                store: store,
                maxHeight: 350,
                margin: '5 5 5 5',
                getValue: function () {
                    var me = this;
                    var result = lineItems;
                    var componentColumn = me.query('[itemId*=componentColumn]');
                    componentColumn.forEach((item, index) => {
                        var totalPriceItemValue = item.getComponent('unitPrice').getValue() || 0;
                        result[index]['retailPrice'] = totalPriceItemValue;
                    });
                    return result;
                },
                diySetValue: Ext.emptyFn,
                disableSelection: true,
                columns: [
                    {
                        width: 65,
                        tdCls: 'vertical-middle',
                        dataIndex: 'seqNo',
                        text: i18n.getKey('seqNo'),
                    },
                    {
                        xtype: 'imagecolumn',
                        tdCls: 'vertical-middle',
                        width: 150,
                        dataIndex: 'thumbnailInfo',
                        text: i18n.getKey('preview'),
                        buildUrl: function (value, metadata, record) {
                            var status = value['status'];
                            var thumbnail = value['thumbnail'];
                            if (['', undefined].includes(thumbnail) && status !== 'FAILURE') {
                                status = 'NULL'
                            }
                            if (status === 'SUCCESS') {
                                return projectThumbServer + thumbnail;
                            }
                        },
                        buildPreUrl: function (value, metadata, record) {
                            var status = value['status'];
                            var thumbnail = value['thumbnail'];
                            if (['', undefined].includes(thumbnail) && status !== 'FAILURE') {
                                status = 'NULL'
                            }
                            var statusGatherInfo = {
                                SUCCESS: {
                                    tdAttrText: '查看图片',
                                    image: thumbnail
                                },
                                FAILURE: {
                                    tdAttrText: '图片生成失败',
                                    image: 'FAILURE.jpg'
                                },
                                WAITING: {
                                    tdAttrText: '图片生成中',
                                    image: 'WAITING.gif'
                                },
                                NULL: {
                                    tdAttrText: '图片为空',
                                    image: 'NULL.jpg'
                                }
                            }
                            metadata.tdAttr = 'data-qtip=' + statusGatherInfo[status]['tdAttrText'];
                            var prefix = (status === 'SUCCESS') ? projectThumbServer : path;
                            return prefix + statusGatherInfo[status]['image'];
                        },
                        buildTitle: function (value, metadata, record) {
                            var seqNo = record.get('seqNo');
                            return i18n.getKey('check') + ` < ${me.orderNumber}-${seqNo} > ` + i18n.getKey('预览图');
                        },
                    },
                    {
                        width: 350,
                        dataIndex: 'product',
                        text: i18n.getKey('productInfo') + '  ||  ' + i18n.getKey('material'),
                        renderer: function (value, metadata, record) {
                            var result;
                            var sku = value['sku'];
                            var productName = value['name'];
                            result = [
                                {
                                    title: i18n.getKey('productName'),
                                    value: productName
                                },
                                {
                                    title: i18n.getKey('sku'),
                                    value: sku
                                },
                            ]
                            return JSCreateHTMLTable(result);
                        }
                    },
                    {
                        xtype: 'componentcolumn',
                        width: 200,
                        dataIndex: 'price',
                        text: i18n.getKey('orderItemInfo'),
                        renderer: function (value, metadata, record) {
                            var seqNo = record.get('seqNo'),
                                id = record.get('id'),
                                queryResult = me.queryResult,
                                lineItem = {};

                            queryResult['lineItems'].forEach(item=>{
                                if (item['orderItemId'] === id){
                                    lineItem = item;
                                }
                            })

                            var  qty = lineItem['qty'],
                                price = lineItem['retailPrice'],
                                totalPrice = (price * qty || 0).toFixed(2);

                            return {
                                xtype: 'container',
                                layout: 'vbox',
                                itemId: 'componentColumn',
                                defaults: {
                                    xtype: 'displayfield',
                                    width: 150,
                                    labelWidth: 70,
                                    readOnly: true,
                                    hideTrigger: true,
                                    fieldStyle: {
                                        'border': '0',
                                    },
                                },
                                items: [
                                    {
                                        xtype: 'numberfield',
                                        width: 150,
                                        itemId: 'unitPrice',
                                        fieldLabel: i18n.getKey('Unit Price'),
                                        value: price,
                                        minValue: 0,
                                        readOnly: false,
                                        fieldStyle: 'border: 1',
                                        listeners: {
                                            change: function (comp, newValue, oldValue) {
                                                var gridContainer = comp.ownerCt;
                                                var totalPrice = +newValue * +qty;
                                                var productsPriceValue = totalPrice;
                                                var container = me.getComponent('container');
                                                var productsPrice = container.getComponent('productsPrice');
                                                var totalPriceComp = gridContainer.getComponent('totalPrice');
                                                var componentColumn = me.query('[itemId*=componentColumn]');
                                                componentColumn.forEach((item, index) => {
                                                    var totalPriceItemValue = item.getComponent('totalPrice').getValue() || 0;
                                                    index !== (seqNo - 1) && (productsPriceValue += +totalPriceItemValue);
                                                });
                                                totalPriceComp.setValue(totalPrice.toFixed(2));  //单产品总价
                                                productsPrice.setValue(productsPriceValue.toFixed(2)); //所有产品总价
                                            }
                                        }
                                    },
                                    {
                                        fieldLabel: i18n.getKey('qty'),
                                        itemId: 'qty',
                                        value: qty,
                                    },
                                    {
                                        fieldLabel: i18n.getKey('totalPrice'),
                                        itemId: 'totalPrice',
                                        value: totalPrice,
                                    },
                                ]
                            }
                        }
                    },
                    {
                        flex: 1,
                        width: 150,
                        dataIndex: 'comment',
                        text: i18n.getKey('comment'),
                        renderer: function (value, metadata, record) {
                            var seqNo = record.get('seqNo');
                            var lineItem = queryResult['lineItems'][seqNo - 1];
                            return lineItem?.comment;
                        }
                    },
                ]
            },
            {
                xtype: 'container',
                name: 'container',
                itemId: 'container',
                width: '100%',
                margin: '5 165 5 15',
                layout: {
                    type: 'vbox',
                    align: 'right',
                },
                defaults: {
                    xtype: 'displayfield',
                    width: 230,
                    margin: '5 40 5 15',
                    labelAlign: 'left',
                    fieldStyle: 'border: 0',
                    minValue: 0,
                    readOnly: true,
                    hideTrigger: true,
                },
                diyGetValue: function () {
                    var result = {},
                        me = this,
                        items = me.items.items;

                    items.forEach(item => {
                        var name = item.name,
                            value = item.diyGetValue ? item.diyGetValue() : item.getValue();
                        item.diyGetValue ? (result = Ext.Object.merge(result, value)) : (result[name] = value);
                    })
                    return result;
                },
                diySetValue: function (value) {
                    var me = this,
                        items = me.items.items;

                    items.forEach(item => item.diySetValue ? item.diySetValue(value) : item.setValue(value[item.name]))
                },
                items: [
                    {
                        fieldLabel: i18n.getKey('productTotal'), //产品总价🐕
                        name: 'productsPrice',
                        itemId: 'productsPrice',
                        listeners: {
                            change: function (view) {
                                var container = view.ownerCt;
                                changeFn(container);
                            }
                        },
                    },
                    {
                        fieldLabel: i18n.getKey('tax'),  //税金🐕
                        name: 'tax',
                        itemId: 'tax'
                    },
                    {
                        fieldLabel: i18n.getKey('paidSalesTax'), //美国销售税金🐕
                        name: 'paidSalesTax',
                        itemId: 'paidSalesTax',
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        width: 230,
                        name: 'extraList',
                        itemId: 'extraList',
                        diyGetValue: function () {
                            var me = this;
                            var result = {};
                            var items = me.items.items;
                            items.forEach(item => {
                                var value = item.diyGetValue ? item.diyGetValue() : item.getValue();
                                var name = item.name;
                                result[name] = value;
                            })
                            return result;
                        },
                        diySetValue: function (value) {
                            var me = this,
                                items = me.items.items;

                            items.forEach(item => item.diySetValue ? item.diySetValue(value) : item.setValue(value[item.name]));
                        },
                        items: [
                            {
                                xtype: 'numberfield',
                                name: 'paddingPrice',
                                itemId: 'paddingPrice',
                                fieldLabel: i18n.getKey('paddingPrice'), //额外费用🐕
                                fieldStyle: 'border: 1',
                                minValue: 0,
                                width: 195,
                                readOnly: false,
                                allowBlank: false,
                                hideTrigger: true,
                                listeners: {
                                    change: function (view) {
                                        var container = view.ownerCt.ownerCt;
                                        changeFn(container);
                                    }
                                }
                            },
                            {
                                xtype: 'button',
                                name: 'paddingDesc',
                                itemId: 'paddingDesc',
                                tooltip: '填写费用说明',
                                text: controller.getTitleBold('blue', true, i18n.getKey('说明'), 12),
                                componentCls: "btnOnlyIcon",
                                diyGetValue: function () {
                                    return paddingDescValue;
                                },
                                diySetValue: function (value) {
                                    var me = this;
                                    var name = me.name;
                                    paddingDescValue = value[name];
                                },
                                handler: function (btn) {
                                    Ext.create('Ext.window.Window', {
                                        title: i18n.getKey('额外费用说明'),
                                        width: 400,
                                        height: 200,
                                        modal: true,
                                        layout: 'fit',
                                        bbar: ['->',
                                            {
                                                xtype: 'button',
                                                iconCls: "icon_save",
                                                text: i18n.getKey('confirm'),
                                                handler: function (btn) {
                                                    var win = btn.ownerCt.ownerCt;
                                                    var textarea = win.getComponent('textarea');
                                                    paddingDescValue = textarea.getValue();
                                                    Ext.Msg.alert(i18n.getKey('prompt'), '保存成功');
                                                    win.close();
                                                }
                                            },
                                            {
                                                xtype: 'button',
                                                iconCls: "icon_cancel",
                                                text: i18n.getKey('cancel'),
                                                handler: function (btn) {
                                                    var win = btn.ownerCt.ownerCt;
                                                    win.close();
                                                }
                                            }
                                        ],
                                        items: [
                                            {
                                                xtype: 'textarea',
                                                itemId: 'textarea',
                                                emptyText: '请输入额外费用说明'
                                            }
                                        ],
                                        listeners: {
                                            show: function (view) {
                                                var textarea = view.getComponent('textarea');
                                                textarea.setValue(paddingDescValue);
                                            }
                                        }
                                    }).show();
                                }
                            },
                        ]
                    },
                    {
                        xtype: 'numberfield',
                        fieldLabel: i18n.getKey('shippingPrice'), //总运费🐕
                        name: 'shippingPrice',
                        itemId: 'shippingPrice',
                        fieldStyle: 'border: 1',
                        readOnly: false,
                        allowBlank: false,
                        listeners: {
                            change: function (view) {
                                var container = view.ownerCt;
                                changeFn(container);
                            }
                        }
                    },
                    {
                        fieldLabel: i18n.getKey('bankTransferDiscount'), //银行转账优惠🐕
                        name: 'bankTransferDiscount',
                        itemId: 'bankTransferDiscount',
                    },
                    {
                        fieldLabel: i18n.getKey('discountAmount'), //折扣金额🐕
                        name: 'discountAmount',
                        itemId: 'discountAmount',
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        width: 230,
                        name: 'totalPriceAfterDiscount',  //折扣后总价
                        itemId: 'totalPriceAfterDiscount',
                        margin: '15 40 5 15',
                        hidden: true,
                        getValue: function () {
                            var me = this;
                            var value = me.getComponent('value');
                            return value.rewValue;
                        },
                        setValue: function (data) {
                            var me = this;
                            var value = me.getComponent('value');
                            value.setValue(data);
                        },
                        getCalculatePrice: function (view) {
                            var container = view.ownerCt.ownerCt;
                            var items = container.items.items;
                            var increase = 0, decrease = 0;
                            items.forEach(item => {
                                if (!item.hidden) {
                                    var name = item.name;
                                    var value = item.diyGetValue ? item.diyGetValue() : item.getValue();
                                    (name === 'extraList') && (value = value['paddingPrice']);
                                    !(['bankTransferDiscount', 'discountAmount', 'totalPriceAfterDiscount'].includes(name)) && (increase += +value);
                                    ['bankTransferDiscount', 'discountAmount'].includes(name) && (decrease += +value);
                                }
                            })
                            var totalPrice = Math.floor((increase - decrease) * 100) / 100;
                            var totalPriceText = controller.getTitleBold('#C76989', true, totalPrice);
                            var orderAmount = view.ownerCt.ownerCt.ownerCt;
                            var showTotalPrice = orderAmount.getComponent('showTotalPrice');

                            view.diySetValue(totalPriceText, totalPrice);
                            totalPrice && showTotalPrice.diySetValues(totalPriceText, totalPrice);
                        },
                        items: [
                            {
                                xtype: 'displayfield',
                                itemId: 'value',
                                rewValue: null,
                                diySetValue: function (data, rewValue) {
                                    var me = this;
                                    me.rewValue = rewValue;
                                    me.setValue(data);
                                },
                                fieldLabel: controller.getTitleBold('#C76989', true, i18n.getKey('totalPriceAfterDiscount')), //折扣后总价🐕
                                listeners: {
                                    change: function (view) {
                                        view.ownerCt.getCalculatePrice(view);
                                    }
                                }
                            },
                            {
                                xtype: 'button',
                                itemId: 'symbol',
                                getValue: Ext.emptyFn,
                                setValue: Ext.emptyFn,
                                componentCls: "btnOnlyIcon",
                                text: controller.getTitleBold('#C76989', true, '$'),
                            },
                        ]
                    },
                    {
                        fieldLabel: i18n.getKey('rewardCredit'), //现金券🐕
                        hidden: true,
                        name: 'rewardCredit',
                        itemId: 'rewardCredit',
                    },
                    {
                        fieldLabel: i18n.getKey('totalPrice'), //总价🐕
                        hidden: true,
                        name: 'totalPrice',
                        itemId: 'totalPrice',
                    },
                ],
            },
            {
                xtype: 'container',
                itemId: 'showTotalPrice',
                name: 'showTotalPrice',
                diyGetValue: Ext.emptyFn,
                diySetValues: function (data, rewValue) {
                    var me = this;
                    var items = me.items.items;
                    items.forEach(item => item.diySetValue(data, rewValue));
                },
                width: '100%',
                height: 50,
                style: {
                    border: '1px solid #bdc3c7',
                    borderLeft: 0,
                    borderRight: 0,
                    borderBottom: 0,
                    backgroundColor: '#ecf0f1',
                },
                layout: {
                    type: 'vbox',
                    align: 'right',
                },
                margin: '5 0 0 0',
                defaults: {
                    xtype: 'displayfield',
                    width: 230,
                    margin: '5 40 0 15',
                    labelAlign: 'left',
                    fieldStyle: 'border: 0',
                    minValue: 0,
                    readOnly: true,
                    hideTrigger: true,
                },
                items: [
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        width: 230,
                        name: 'totalPriceAfterDiscount',  //折扣后总价
                        itemId: 'totalPriceAfterDiscount',
                        margin: '15 15 5 180',
                        diySetValue: function (data, rewValue) {
                            var me = this;
                            var items = me.items.items;
                            items.forEach(item => item.diySetValue(data, rewValue));
                        },
                        items: [
                            {
                                xtype: 'displayfield',
                                itemId: 'value',
                                rewValue: null,
                                diySetValue: function (data, rewValue) {
                                    var me = this;
                                    me.setValue(controller.getTitleBold('red', true, rewValue));
                                },
                                fieldLabel: controller.getTitleBold('#000000', true, i18n.getKey('totalPriceAfterDiscount')), //折扣后总价🐕
                            },
                            {
                                xtype: 'button',
                                itemId: 'symbol',
                                getValue: Ext.emptyFn,
                                diySetValue: Ext.emptyFn,
                                componentCls: "btnOnlyIcon",
                                text: controller.getTitleBold('red', true, '$'),
                            },
                        ]
                    },
                ]
            },
        ];
        var emptyItem = [
            {
                xtype: 'displayfield',
                margin: '5 5 5 300',
                width: '100%',
                allowBlank: true,
                diySetValue: function () {
                    var me = this;
                    me.setValue('<font color="red">订单项为空</font>')
                }
            }
        ];
        me.layout = 'vbox';
        me.isEmptyResult = !(lineItemsLength > 0);
        me.items = me.isEmptyResult ? emptyItem : item;
        me.callParent();
    },
    diyGetValue: function () {
        var me = this,
            result = {},
            items = me.items.items;

        items.forEach(item => {
            var name = item.name,
                value = item.diyGetValue ? item.diyGetValue() : item.getValue();

            item.diyGetValue ? (result = Ext.Object.merge(result, value)) : (result[name] = value);
        })
        return me.isEmptyResult ? {} : result;
    },
    diySetValue: function (value) {
        var me = this,
            items = me.items.items;

        items.forEach(item => item.diySetValue && item.diySetValue(value));
    },
})