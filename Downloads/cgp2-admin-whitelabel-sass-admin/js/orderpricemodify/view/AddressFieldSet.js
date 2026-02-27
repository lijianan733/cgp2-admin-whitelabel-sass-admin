/**
 * @Description:发货要求相同的订单项分为一组
 * 订单分为simple和拼单，如果是拼单，则会有一个新的字段叫零售价格 retailPrice
 * @author nan
 * @date 2024/8/21
 */
Ext.Loader.setPath({
    enabled: true,
    'CGP.orderdetails': path + 'partials/order/details/app/'
});
Ext.Loader.syncRequire([
    'CGP.orderdetails.view.render.OrderLineItemRender',
    'CGP.orderlineitemv2.model.OrderLineItem'
]);
Ext.define('CGP.orderpricemodify.view.AddressFieldSet', {
    extend: 'Ext.ux.form.field.UxFieldSet',
    alias: 'widget.address_fieldset',
    layout: {
        type: 'vbox',
    },
    defaults: {
        flex: 1,
        margin: '5 25',
        colspan: 2,
        width: '100%',
    },
    collapsible: true,
    editable: false,//是否可编辑
    orderId: null,
    rawData: null,
    orderType: null,
    type: 'item',//item total
    shipmentRequirementId: '',//该配置所属发货要求
    currencySymbol: '',//货币符号
    orderItemStore:null,//记录发货项信息
    diySetValue: function (data) {
        var fieldset = this;
        var deliveryAddress = fieldset.down('[itemId=deliveryAddress]');
        var billingAddress = fieldset.down('[itemId=billingAddress]');
        var itemSummary = fieldset.down('[itemId=itemSummary]');
        var orderItems = fieldset.down('[itemId=orderItems]');
        var addressDetail = data.addressDetail;
        fieldset.shipmentRequirementId = data.shipmentRequirementId;//记录发货要求
        deliveryAddress.diySetValue(addressDetail.deliveryAddress);
        billingAddress.diySetValue(addressDetail.billingAddress);
        orderItems.diySetValue(data.orderItems);
        itemSummary.diySetValue(data.priceInfo);
    },
    /**
     * 重算税费和运费
     */
    calculateTaxAndShopping: function (field) {
        var fieldSet = field.ownerCt.ownerCt;
        var form = field.ownerCt;
        var shipmentRequirementId = fieldSet.shipmentRequirementId;
        var orderItems = fieldSet.getComponent('orderItems');
        var url = adminPath + `api/shipmentRequirements/${shipmentRequirementId}/price`;
        var jsonData = []
        orderItems._grid.store.proxy.data.map(function (item) {
            //运费使用单价计算的，税费是用零售价计算的
            jsonData.push({
                id: item.id,
                qty: item.qty,
                retailPrice: item.retailPrice,
                price: item.price
            });
        });
        JSAjaxRequest(url, 'POST', true, jsonData, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    var newTax = responseText?.data?.tax;
                    var newShopping = responseText?.data?.shippingPrice;
                    form.getComponent('tax').setValue(newTax);
                    form.getComponent('shippingPrice').setValue(newShopping);
                    Ext.Msg.alert('提醒', '更新运费和税费完成');
                }
            }
        }, true);

    },
    /**
     * 改变了任意数据后，重新计算产品总价
     * 统计订单项数据和合计中运费，税费等信息，合计出产品价格
     * @param fieldset
     */
    reCalculateProductPrice: function () {
        var fieldset = this;
        var orderItems = this.getComponent('orderItems');
        var itemSummary = this.getComponent('itemSummary');
        var count = 0;
        orderItems._grid.store.proxy.data.map(function (item) {
            count += item.qty * item.price;
        });
        var productsAmount = itemSummary.getComponent('productsAmount');
        var totalAmount = itemSummary.getComponent('totalAmount');
        productsAmount.setValue(parseFloat(Number(count).toFixed(2)));
        var itemSummaryData = itemSummary.getValue();
        //设置该发货项总金额
        var totalAmountData = itemSummaryData.shippingPrice +
            itemSummaryData.tax -
            itemSummaryData.discountAmount +
            itemSummaryData.paddingPrice +
            Number(itemSummaryData.importService) +
            Number(itemSummaryData.productsAmount);
        totalAmount.setValue(parseFloat(Number(totalAmountData).toFixed(2)));
        fieldset.fireEvent('reCalculateProductPrice', itemSummary.getValue());//触发事件
    },
    initComponent: function () {
        var me = this;
        var orderLineItemRender = Ext.create('CGP.orderdetails.view.render.OrderLineItemRender');
        var cfg = orderLineItemRender.getOrderItemCfg({
            grid: me,
            remark: null,
            orderId: JSGetQueryString('orderId'),
            orderStatusId: 100
        }, null, false);
        //注册事件
        var currencySymbol = me.currencySymbol;
        me.addEvents({"reCalculateProductPrice": true});
        var columnItems = [
            cfg.get('0'),
            {
                xtype: 'imagecolumn',
                text: i18n.getKey('图片'),
                dataIndex: 'thumbnailInfo',
                width: 120,
                buildUrl: function (value) {
                    var thumbnail = value.thumbnail;
                    return (projectThumbServer + thumbnail);
                },
                buildPreUrl: function (value) {
                    var thumbnail = value.thumbnail;
                    var imgSize = '/100/100/png?' + Math.random();
                    return (projectThumbServer + thumbnail + imgSize);
                },
                buildTitle: function (value, metadata, record) {
                    return `${i18n.getKey('check')} < ${value.originalFileName} >预览图`;
                },
            },
            {
                dataIndex: 'product',
                text: i18n.getKey('product') + i18n.getKey('description'),
                width: 270,
                xtype: 'atagcolumn',
                getDisplayName: function (value, metadata, record) {
                    var productDescription = record.get('productDescription');
                    var productName = value.name;
                    return JSAutoWordWrapStr(JSCreateFont('#000000', true, productDescription || productName));
                },
            },
            {
                dataIndex: 'product',
                text: i18n.getKey('product'),
                width: 270,
                renderer: function (value) {
                    var arr = [{
                        title: '名称',
                        value: value.name
                    }, {
                        title: '型号',
                        value: value.model
                    }, {
                        title: 'sku',
                        value: value.sku
                    }];
                    return JSCreateHTMLTable(arr);
                }
            },
            {
                text: '重量(g)',
                dataIndex: 'productWeight',
            },
            {
                xtype: 'componentcolumn',
                text: '数量',
                dataIndex: 'qty',
                renderer: function (value, metaData, record, rowIndex, colIndex, data, gridView) {
                    return {
                        xtype: me.type == 'item' ? 'numberfield' : 'displayfield',
                        minValue: 1,
                        msgTarget: 'side',
                        value: value,
                        allowBlank: false,
                        tagInfo: record.get('id') + '_qty',//记录订单项编号
                        checkChangeBuffer: 500,//1秒检查一次改变
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                if (field.isValid()) {
                                    var store = record.store;
                                    var orderItemId = record.get('id');
                                    store.proxy.data.map(function (item) {
                                        if (item.id == orderItemId) {
                                            item.qty = newValue;
                                            item.amount = parseFloat((newValue * item.price).toFixed(2));
                                            gridView.ownerCt.forceFieldTagInfo = field.tagInfo;
                                            setTimeout(function () {
                                                //设置值会导致界面重新渲染，导致field组件会重新生成，导致change后续处理报错
                                                record.beginEdit();
                                                record.set('qty', newValue);
                                                record.set('amount', item.amount);
                                                record.endEdit();
                                            }, 100);
                                        }
                                    });
                                    me.reCalculateProductPrice();
                                }
                            }
                        }
                    };
                }
            },
            {
                xtype: 'componentcolumn',
                text: '单价' + `(${currencySymbol})`,
                dataIndex: 'price',
                renderer: function (value, metaData, record, rowIndex, colIndex, data, gridView) {
                    var productSku = record.get('product').sku;
                    return {
                        xtype: me.type == 'item' ? 'numberfield' : 'displayfield',
                        minValue: 0,
                        value: value,
                        itemId: productSku,
                        msgTarget: 'side',
                        allowBlank: false,
                        checkChangeBuffer: 500,//1秒检查一次改变
                        tagInfo: record.get('id') + '_price',//记录订单项编号
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                if (field.isValid()) {
                                    var store = record.store;
                                    var orderItemId = record.get('id');
                                    store.proxy.data.map(function (item) {
                                        if (item.id == orderItemId) {
                                            item.price = newValue;
                                            item.amount = parseFloat((newValue * item.qty).toFixed(2));
                                            gridView.ownerCt.forceFieldTagInfo = field.tagInfo;
                                            setTimeout(function () {
                                                //设置值会导致界面重新渲染，导致field组件会重新生成，导致change后续处理报错
                                                record.set('price', newValue);
                                                record.set('amount', item.amount);
                                                //设置值后组件更新重新生成
                                            }, 100);
                                        }
                                    });
                                    me.reCalculateProductPrice();
                                }
                            }
                        }
                    };
                }
            },
            {
                xtype: 'componentcolumn',
                hidden: me.orderType != 'NORMAL',//拼单才显示零售价格
                text: '零售单价' + `(${currencySymbol})`,
                dataIndex: 'retailPrice',
            },
            {
                text: '成本' + `(${currencySymbol})`,
                dataIndex: "cost",
                renderer: function (value) {
                    return value;
                }
            },
            {
                text: '小计' + `(${currencySymbol})`,
                flex: 1,
                dataIndex: "amount",
                renderer: function (value) {
                    return value
                }
            }
        ];
        var orderItemStore = Ext.create('Ext.data.Store', {
            fields: [
                'productDescription', 'productWeight', 'qty',
                'price', 'cost', 'amount', 'currency',
                'product', 'thumbnailInfo', 'seqNo', 'retailPrice'
            ],
            data: [],
            proxy: {
                type: 'pagingmemory',
            }
        });
        me.orderItemStore = orderItemStore;
        me.items = [
            {
                xtype: 'container',
                defaults: {
                    flex: 1,
                    margin: '5 25 5 0',

                },
                width: '100%',
                layout: 'hbox',
                items: [
                    {
                        xtype: 'container',
                        itemId: 'deliveryAddressContainer',
                        name: 'deliveryAddressContainer',
                        layout: 'vbox',
                        defaults: {
                            width: '100%',
                        },
                        items: [
                            {
                                xtype: 'splitbar',
                                title: '<font style="font-weight: bold">收件人地址信息</font>'
                            },
                            {
                                xtype: 'displayfield',
                                name: 'deliveryAddress',
                                itemId: 'deliveryAddress',
                                value: 'xxxxxxxxxxxx',
                                margin: '5 0 5 25',
                                diySetValue: function (data) {
                                    var me = this;
                                    if (data) {
                                        var result = JSBuildAddressInfo(data);
                                        me.setValue(result);
                                    }
                                },
                            },
                        ]
                    },
                    {
                        xtype: 'container',
                        itemId: 'billingAddressContainer',
                        name: 'billingAddressContainer',
                        layout: 'vbox',
                        defaults: {
                            width: '100%',
                        },
                        items: [
                            {
                                xtype: 'splitbar',
                                title: '<font style="font-weight: bold">账单地址</font>'
                            },
                            {
                                xtype: 'displayfield',
                                name: 'billingAddress',
                                itemId: 'billingAddress',
                                value: 'xxxxxxxxxxxx',
                                margin: '5 0 5 25',
                                diySetValue: function (data) {
                                    var me = this;
                                    if (data) {
                                        var result = JSBuildAddressInfo(data);
                                        me.setValue(result);
                                    }
                                },
                            },
                        ]
                    },
                ]
            },
            {
                xtype: 'splitbar',
                items: [
                    {
                        xtype: 'displayfield',
                        value: '<font style="font-weight: bold">订单项</font>'
                    },
                    {
                        xtype: 'button',
                        text: '切换全屏',
                        handler: function (btn) {
                            var container = btn.ownerCt.ownerCt,
                                orderItems = container.getComponent('orderItems')
                            JSCreateToggleFullscreenWindowGrid('订单项', orderItems, {
                                tbar: {
                                    hidden: true
                                }
                            })
                        }
                    },
                    {
                        xtype: 'atag_displayfield',
                        value: me.type == 'item' ? '批量修改单价' : '',
                        clickHandler: function (btn) {
                            var fieldset = btn.ownerCt.ownerCt;
                            var win = Ext.create('CGP.orderpricemodify.view.ModifySkuProductPriceWin', {
                                type: 'deliveryOrder',
                                title: '批量修改当前发货项内Sku产品价格',
                                outFieldset: fieldset,
                                shipmentRequirementId: fieldset.shipmentRequirementId
                            });
                            win.show();
                        }
                    },
                ]
            },
            {
                xtype: 'gridfieldwithcrudv2',
                itemId: 'orderItems',
                name: 'orderItems',
                actionRemoveHidden: true,
                actionCopyHidden: true,//是否隐藏复制功能
                actionEditHidden: true,
                isFormField: true,//该标识为true的组件会被getFields方法收集到
                maxHeight: 500,
                gridConfig: {
                    tbar: {
                        hidden: true,
                    },
                    store: orderItemStore,
                    columns: columnItems,
                    forceFieldTagInfo: null,//修改时获取到焦点的元素
                    viewConfig: {
                        listeners: {
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
                    },
                    bbar: {
                        xtype: 'pagingtoolbar',
                        store: orderItemStore,
                        displayInfo: true, // 是否 ? 示， 分 ? 信息
                        displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                        emptyText: i18n.getKey('noDat')
                    }
                },
            },
            {
                xtype: 'splitbar',
                title: '<font style="font-weight: bold">合计</font>'
            },
            {
                xtype: 'errorstrickform',
                itemId: 'itemSummary',
                name: 'itemSummary',
                border: false,
                defaults: {
                    margin: '5 25',
                    width: 250,
                    vtype: 'nonNegative',
                    columnWidth: 0.25,
                    msgTarget: 'side',
                    checkChangeBuffer: 500,//1秒检查一次改变
                    allowBlank: false,
                },
                margin: '5 0',
                layout: {
                    type: 'column'
                },
                items: [
                    {
                        xtype: me.type == 'item' ? 'numberfield' : 'displayfield',
                        fieldLabel: '普通运费' + `(${currencySymbol})`,
                        itemId: 'shippingPrice',
                        name: 'shippingPrice',
                        listeners: {
                            change: function () {
                                if (this.isValid()) {
                                    me.reCalculateProductPrice();
                                }
                            }
                        }
                    },
                    {
                        xtype: me.type == 'item' ? 'numberfield' : 'displayfield',
                        fieldLabel: '税费' + `(${currencySymbol})`,
                        itemId: 'tax',
                        name: 'tax',
                        listeners: {
                            change: function () {
                                if (this.isValid()) {
                                    me.reCalculateProductPrice();
                                }
                            }
                        }
                    },
                    {
                        xtype: 'atag_displayfield',
                        columnWidth: 0.50,
                        vtype: null,
                        value: me.type == 'item' ? '系统重算运费和税费' : '',
                        diySetValue: function () {

                        },
                        clickHandler: function (field) {
                            me.calculateTaxAndShopping(field);
                        }
                    },
                    {
                        xtype: me.type == 'item' ? 'numberfield' : 'displayfield',
                        fieldLabel: '子单折扣' + `(${currencySymbol})`,
                        itemId: 'discountAmount',
                        name: 'discountAmount',
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                var data = field.ownerCt.getValue();
                                //运费+税费+产品价格
                                field.maxValue = parseFloat((
                                    Number(data.shippingPrice) +
                                    Number(data.tax) +
                                    Number(data.paddingPrice) +
                                    Number(data.productsAmount)).toFixed(2));
                                if (field.isValid()) {
                                    me.reCalculateProductPrice();
                                }
                            }
                        }
                    },
                    {
                        xtype: me.type == 'item' ? 'numberfield' : 'displayfield',
                        fieldLabel: '附加费用' + `(${currencySymbol})`,
                        itemId: 'paddingPrice',
                        name: 'paddingPrice',
                        listeners: {
                            change: function () {
                                if (this.isValid()) {
                                    me.reCalculateProductPrice();
                                }
                            }
                        }
                    },
                    {
                        xtype: me.type == 'item' ? 'textfield' : 'displayfield',
                        fieldLabel: '附加费用说明',
                        itemId: 'paddingDesc',
                        width: 350,
                        vtype: null,
                        allowBlank: true,
                        columnWidth: 0.50,
                        name: 'paddingDesc'
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: '产品金额' + `(${currencySymbol})`,
                        itemId: 'productsAmount',
                        name: 'productsAmount'
                    },
                    {
                        //xtype: me.type == 'item' ? 'numberfield' : 'displayfield',
                        xtype: 'displayfield',
                        fieldLabel: 'importService ' + `(${currencySymbol})`,
                        itemId: 'importService',
                        minValue: 0,
                        name: 'importService',
                        diyGetValue: function () {
                            var data = this.getValue();
                            return Number(data);
                        },
                        listeners: {
                            change: function () {
                                if (this.isValid()) {
                                    me.reCalculateProductPrice();
                                }
                            }
                        }
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: '总金额' + `(${currencySymbol})`,
                        itemId: 'totalAmount',
                        name: 'totalAmount',
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                if (newValue < 0) {
                                    var discountAmount = field.ownerCt.getComponent('discountAmount');
                                    discountAmount.fireEvent('change', discountAmount);
                                }
                            }
                        }
                    }
                ],
                diySetValue: function (data) {
                    var me = this;
                    me.setValue(data);
                }
            },
        ];
        me.callParent();
        me.on('afterrender', function () {
            me.diySetValue(me.rawData);
        });
    }
});
