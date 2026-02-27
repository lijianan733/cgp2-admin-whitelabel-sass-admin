/**
 * @author xiu
 * @date 2025/3/25
 */
Ext.Loader.syncRequire([
    'CGP.customerordermanagement.controller.Controller'
])
Ext.define('CGP.customerordermanagement.defaults.CustomerordermanagementDefaults', {
    //正式配置
    config: {
        customer_order_management: {
            columnsText: [
                 {
                   text: '编号',
                   type: 'string',
                   name: '_id'
               },
                {
                    text: '操作',
                    type: 'container',
                    name: '_id',
                    width: 380,
                    renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                        var customerStatus = record.get('customerStatus'),
                            customerCode = record.get('customerCode'),
                            isPopStore = customerCode === 'PopUp',
                            isCancelStatus = customerStatus === 'cancelled',
                            controller = Ext.create('CGP.customerordermanagement.controller.Controller')

                        return {
                            xtype: 'fieldcontainer',
                            defaults: {
                                margin: '0 5 0 5',
                                ui: 'default-toolbar-small',
                                width: 80
                            },
                            layout: {
                                type: 'hbox',
                                pack: 'center', // 水平居中
                                align: 'middle' // 垂直居中
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('删除'),
                                    itemId: 'delete',
                                    iconCls: 'icon_delete',
                                    tooltip: '删除订单',
                                    handler: function () {
                                        Ext.Msg.confirm(i18n.getKey('prompt'), '是否删除该订单!', function (selector) {
                                            if (selector === 'yes') {
                                                controller.deleteCustomerOrderFn(value, function () {
                                                    store.load();
                                                })
                                            }
                                        });
                                    }
                                },
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('取消'),
                                    itemId: 'cancelled',
                                    hidden: isCancelStatus || !isPopStore,
                                    iconCls: 'icon_cancel',
                                    tooltip: '取消订单',
                                    handler: function () {
                                        Ext.Msg.confirm(i18n.getKey('prompt'), '是否取消该订单!', function (selector) {
                                            if (selector === 'yes') {
                                                controller.cancelCustomerOrderFn(value, function () {
                                                    store.load();
                                                })
                                            }
                                        });
                                    }
                                },
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('退款'),
                                    itemId: 'refund',
                                    hidden: !isPopStore,
                                    iconCls: 'icon_refund',
                                    tooltip: '退款（仅限于pop-up store订单）',
                                    handler: function () {
                                        Ext.Msg.confirm('提示', '是否确定退款？', function (select) {
                                            if (select === 'yes') {
                                                JSOpen({
                                                    id: 'customer_orderrefund_edit',
                                                    url: path + 'partials/custormer_order_refund/edit.html' +
                                                        '?customerOrderId=' + value +
                                                        '&refundOrderType=' + 'CustomerOrder',
                                                    title: i18n.getKey('create') + i18n.getKey('refundApply'),
                                                    refresh: true
                                                });
                                            }
                                        });
                                    }
                                },
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('发票'),
                                    itemId: 'invoice',
                                    iconCls: 'icon_export',
                                    tooltip: '下载发票',
                                    handler: function () {
                                        Ext.Msg.alert('提示','该功能还在开发中...')
                                    }
                                },
                            ]
                        }
                    }
                },
                {
                    text: '订单号',
                    type: 'link',
                    width: 200,
                    name: 'bindOrderNumber',
                    renderer: function (value, metaData, record) {
                        metaData.tdAttr = 'data-qtip="' + `查看_店铺订单详情` + '"';
                        return JSCreateHyperLink(value);
                    },
                    clickHandler: function (value, metadata, record) {
                        var id = record.get('_id');

                        JSOpen({
                            id: 'customer_order_info',
                            title: i18n.getKey(`店铺订单详情(${id})`),
                            url: path + 'partials/customerordermanagement/customer_order_info.html' +
                                '?customerId=' + id,
                            refresh: true
                        })
                    }
                },

                {
                    text: '邮箱',
                    type: 'link',
                    width: 200,
                    name: 'partnerEmail',
                    isSortable: false,
                    renderer: function (value, metaData, record) {
                        metaData.tdAttr = 'data-qtip="' + `查看_partner盈余总览` + '"';

                        return JSCreateHyperLink(value);
                    },
                    clickHandler: function (value, metadata, record) {
                        var partnerId = record.get('partnerId');

                        JSOpen({
                            id: 'partner_profit_checkpage',
                            title: i18n.getKey('Partner盈余总览'),
                            url: path + 'partials/profitmanagement/partner_profit_check.html' +
                                '?partnerId=' + partnerId +
                                '&partnerEmail=' + value,
                            refresh: true
                        })
                    }
                },
                {
                    text: '所属店铺',
                    type: 'link',
                    width: 200,
                    name: 'customerNameText',
                    renderer: function (value, metaData, record) {
                        metaData.tdAttr = 'data-qtip="' + `查看_店铺地址` + '"';

                        return JSCreateHyperLink(value);
                    },
                    clickHandler: function (value, metadata, record) {
                        var customerUrl = record.get('customerUrl');

                        window.open(customerUrl, '_blank');
                    }
                },
                {
                    text: '订单金额',
                    type: 'string',
                    width: 200,
                    name: 'storeOrderAmount',
                    isSortable: false,
                },
                {
                    text: '订单状态',
                    type: 'string',
                    width: 200,
                    name: 'customerStatus',
                    isSortable: false,
                },
                {
                    text: '下单时间',
                    type: 'date',
                    width: 200,
                    name: 'datePurchased',
                    isSortable: true,
                },
                {
                    text: 'QPSON订单号',
                    type: 'container',
                    width: 200,
                    name: 'qpsonOrderInfos',
                    isSortable: false,
                    renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                        metaData.tdAttr = 'data-qtip="' + `查看_QPSON单详情` + '"';
                        return {
                            xtype: 'fieldcontainer',
                            defaults: {
                                margin: '0 5 0 5',
                            },
                            layout: {
                                type: 'vbox',
                                align: 'center' // 设置子项水平居中
                            },
                            diySetValue: function (data) {
                                var me = this,
                                    result = [];

                                data?.forEach((item, index) => {
                                    var {_id, orderNumber, status} = item;
                                    result.push({
                                        xtype: 'atag_displayfield',
                                        value: orderNumber,
                                        itemId: _id + `_${index}`,
                                        tooltip: '查看_订单详情',
                                        clickHandler: function (field) {
                                            JSOpen({
                                                id: 'qpson_order_info',
                                                title: i18n.getKey(`QPSON订单详情(${_id})`),
                                                url: path + 'partials/customerordermanagement/qpson_order_info.html' +
                                                    '?QPSONOrderNumber=' + orderNumber +
                                                    '&id=' + _id +
                                                    '&customerOrderId=' + _id,
                                                refresh: true
                                            })
                                        }
                                    })
                                })
                                me.add(result);
                            },
                            items: [],
                            listeners: {
                                afterrender: function (comp) {
                                    comp.diySetValue(value);
                                }
                            }
                        }
                    },
                },
                {
                    text: '收件人地址',
                    type: 'string',
                    width: 400,
                    name: 'deliveryAddressText'
                },
                {
                    text: '收件人邮箱',
                    type: 'string',
                    width: 200,
                    name: 'emailAddress'
                },
            ],
            filtersText: [
                {
                    text: '编号',
                    name: '_id',
                    type: 'string'
                },
                {
                    text: '订单号',
                    name: 'bindOrderNumber',
                    type: 'string'
                },
                {
                    text: '邮箱',
                    name: 'partnerEmail',
                    type: 'string',
                },
                {
                    type: 'combo',
                    text: '店铺类型',
                    name: 'platformCode',
                    comboArray: ['WooCommerce', 'PopUp']
                },
                {
                    text: '店铺名',
                    name: 'storeName',
                    type: 'string'
                },
                {
                    text: 'QPSON订单号',
                    name: 'orderNumber',
                    type: 'string'
                },
            ]
        },
        customer_order_info: {
            columnsText: [
                /* {
                   text: '序号',
                   type: 'string',
                   name: 'orderNo'
               },*/
                /* {
                     text: '预览图',
                     type: 'image',
                     name: 'productInstanceThumbnail',
                     severPath: imageServer,
                 },*/
                {
                    text: '预览图',
                    type: 'container',
                    name: 'productInstanceThumbnail',
                    renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                        var controller = Ext.create('CGP.customerordermanagement.controller.Controller'),
                            productInstanceId = record.get('productInstanceId'),
                            image = projectThumbServer + value

                        metaData.tdAttr = "data-qtip='<div>" + '查看图片' + "</div>'";

                        return {
                            xtype: 'fieldcontainer',
                            defaults: {
                                margin: '0 5 0 5',
                            },
                            layout: {
                                type: 'vbox',
                                align: 'center' // 设置子项水平居中
                            },
                            items: [
                                {
                                    xtype: 'imagecomponent',
                                    src: image + '/100/100',
                                    autoEl: 'div',
                                    style: {
                                        cursor: 'pointer',
                                        border: '1px solid #000',
                                        boxSizing: 'border-box',
                                        overflow: 'hidden',
                                        boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
                                    },
                                    margin: '0 10 0 0',
                                    listeners: {
                                        afterrender: function (view) {
                                            var img = new Image();
                                            img.src = view.src;
                                            img.onload = function () {
                                                // 根据图片设置边框宽高
                                                view.setWidth(img.width);
                                                view.setHeight(img.height);
                                                Ext.create('Ext.ux.window.ImageViewer', {
                                                    imageSrc: image,
                                                    actionItem: view.el.dom.id,
                                                    winConfig: {
                                                        title: i18n.getKey('check') + ` < ${value}> 预览图`
                                                    }
                                                });
                                            }
                                        }
                                    }
                                },
                                {
                                    xtype: 'button',
                                    text: JSCreateFont('blue', false, '预览', 12, true, true),
                                    componentCls: "btnOnlyIcon",
                                    tooltip: '查看builder预览',
                                    handler: function (btn) {
                                        if (value) {
                                            var builderId = 'builderPreview',
                                                tabs = top.parent.Ext.getCmp('tabs'),
                                                title = i18n.getKey('builder') + i18n.getKey('preview'),
                                                newUrl = controller.getBuilderUrl(productInstanceId),
                                                tab = tabs.getComponent(builderId);
                                            if (!tab) {
                                                tab = tabs.add({
                                                    id: builderId,
                                                    origin: origin,
                                                    title: title,
                                                    html: '<iframe id="tabs_iframe_' + builderId + '" src="' + newUrl + '" width="100%" height="100%""></iframe>',
                                                    closable: true
                                                })
                                            } else {
                                                tab.update('<iframe id="tabs_iframe_' + builderId + '" src="' + newUrl + '" width="100%" height="100%""></iframe>');
                                                tab.setTitle(title);
                                            }
                                            tabs.setActiveTab(tab);
                                        }
                                    }
                                }
                            ]
                        }
                    }
                },
                {
                    text: '产品信息',
                    type: 'string',
                    name: 'storeRetailOrderStatus',
                    renderer: function (value, metaData, record) {
                        var productSku = record.get('productSku'),
                            productWeight = record.get('productWeight'),
                            price = record.get('price'),
                            unitPrice = record.get('unitPrice'),
                            titleData = [
                                {
                                    title: 'SKU',
                                    value: JSAutoWordWrapStr(productSku || '')
                                },
                                {
                                    title: '单重',
                                    value: JSAutoWordWrapStr(productWeight || '')
                                },
                                {
                                    title: '单价',
                                    value: JSAutoWordWrapStr(`${unitPrice || ''}`)
                                },
                                {
                                    title: '拼单价',
                                    value: JSAutoWordWrapStr(`${price || ''}`)
                                },
                            ];

                        return JSCreateHTMLTable(titleData);
                    }
                },
                {
                    text: '属性信息',
                    type: 'date',
                    name: 'productDescription',
                    renderer: function (value, metaData, record) {
                        return JSAutoWordWrapStr(value || '');
                    }
                },
                {
                    text: '数量',
                    type: 'string',
                    name: 'qty',
                    width: 100
                },
                {
                    text: '总计',
                    type: 'string',
                    name: 'id',
                    renderer: function (value, metaData, record) {
                        var amount = record.get('amount'),
                            totalWeight = record.get('totalWeight'),
                            titleData = [
                                {
                                    title: 'Payment Subtotal',
                                    value: JSCreateFont('red', true, `${amount}`, 15)
                                },
                                {
                                    title: 'Subtotal',
                                    value: JSCreateFont('red', true, totalWeight, 15)
                                },

                            ];

                        return JSCreateHTMLTable(titleData);
                    }
                },
                {
                    text: '其它',
                    type: 'link',
                    name: 'id',
                    renderer: function (value, metaData, record) {
                        var status = record.get('status'),
                            whitelabelOrderNumber = record.get('whitelabelOrderNumber'),
                            titleData = [
                                {
                                    title: '付款状态',
                                    value: JSCreateFont('red', true, status, 15)
                                },
                                {
                                    title: 'QPMN订单号',
                                    value: whitelabelOrderNumber && JSCreateHyperLink(whitelabelOrderNumber)
                                },
                            ];

                        metaData.tdAttr = 'data-qtip="' + `查看_QPSON订单详情` + '"';

                        return JSCreateHTMLTable(titleData);
                    },
                    clickHandler: function (value, metadata, record) {
                        var whitelabelOrderId = record.get('whitelabelOrderId'),
                            status = record.get('status'),
                            whitelabelOrderNumber = record.get('whitelabelOrderNumber');

                        JSOpen({
                            id: 'qpson_order_info',
                            title: i18n.getKey(`QPSON订单详情(${value})`),
                            url: path + 'partials/customerordermanagement/qpson_order_info.html' +
                                '?QPSONOrderNumber=' + whitelabelOrderNumber +
                                '&id=' + whitelabelOrderId +
                                '&customerOrderId=' + whitelabelOrderId,
                            refresh: true
                        })
                    }
                },
            ],
            filtersText: []
        },
        customer_order_total_info: {
            columnsText: [
                {
                    name: 'title',
                    type: 'string',
                    align: 'left',
                    renderer: function (value, metaData, record, rowIndex) {
                        var result = '';
                        if (value) {
                            result = `${value}:`
                        }
                        return result;
                    },
                },
                {
                    text: i18n.getKey('零售价'),
                    name: 'retailPrice',
                    width: 220,
                    type: 'string',
                    align: 'right',
                    renderer: function (value, metaData, record, rowIndex) {
                        var result = value;

                        if (value) {
                            var id = record.get('id'),
                                title = record.get('title');

                            if (title === 'total') {
                                result = JSCreateFont('red', true, result, 16);
                            }

                            //订单盈余
                            if (id === 6) {
                                result = JSCreateFont('#000', false, result, 16);
                            }
                        }

                        return result;
                    },
                },
                {
                    text: i18n.getKey('拼单价'),
                    name: 'billPrice',
                    type: 'string',
                    align: 'right',
                    renderer: function (value, metaData, record, rowIndex) {
                        var result = '';
                        if (value) {
                            var id = record.get('id');

                            result = `${value}`;

                            //订单盈余
                            if (id === 6) {
                                result = JSCreateFont('#000', false, result, 16);
                            }
                        }
                        return result;
                    },
                },
            ],
            filtersText: []
        },
        qpson_order_item: {
            columnsText: [
                /* {
                   text: '序号',
                   type: 'string',
                   name: 'orderNo'
               },*/
                /* {
                     text: '预览图',
                     type: 'image',
                     name: 'productInstanceThumbnail',
                     severPath: imageServer,
                 },*/
                {
                    text: '预览图',
                    type: 'container',
                    name: 'customThumbnail',
                    renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                        var controller = Ext.create('CGP.customerordermanagement.controller.Controller'),
                            productInstanceId = record.get('productInstanceId'),
                            image = projectThumbServer + value

                        metaData.tdAttr = "data-qtip='<div>" + '查看图片' + "</div>'";

                        return {
                            xtype: 'fieldcontainer',
                            defaults: {
                                margin: '0 5 0 5',
                            },
                            layout: {
                                type: 'vbox',
                                align: 'center' // 设置子项水平居中
                            },
                            items: [
                                {
                                    xtype: 'imagecomponent',
                                    src: image + '/100/100',
                                    autoEl: 'div',
                                    style: {
                                        cursor: 'pointer',
                                        border: '1px solid #000',
                                        boxSizing: 'border-box',
                                        overflow: 'hidden',
                                        boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
                                    },
                                    margin: '0 10 0 0',
                                    listeners: {
                                        afterrender: function (view) {
                                            var img = new Image();
                                            img.src = view.src;
                                            img.onload = function () {
                                                // 根据图片设置边框宽高
                                                view.setWidth(img.width);
                                                view.setHeight(img.height);
                                                Ext.create('Ext.ux.window.ImageViewer', {
                                                    imageSrc: image,
                                                    actionItem: view.el.dom.id,
                                                    winConfig: {
                                                        title: i18n.getKey('check') + ` < ${value}> 预览图`
                                                    }
                                                });
                                            }
                                        }
                                    }
                                },
                                {
                                    xtype: 'button',
                                    text: JSCreateFont('blue', false, '预览', 12, true, true),
                                    componentCls: "btnOnlyIcon",
                                    tooltip: '查看builder预览',
                                    handler: function (btn) {
                                        if (value) {
                                            var builderId = 'builderPreview',
                                                tabs = top.parent.Ext.getCmp('tabs'),
                                                title = i18n.getKey('builder') + i18n.getKey('preview'),
                                                newUrl = controller.getBuilderUrl(productInstanceId),
                                                tab = tabs.getComponent(builderId);
                                            if (!tab) {
                                                tab = tabs.add({
                                                    id: builderId,
                                                    origin: origin,
                                                    title: title,
                                                    html: '<iframe id="tabs_iframe_' + builderId + '" src="' + newUrl + '" width="100%" height="100%""></iframe>',
                                                    closable: true
                                                })
                                            } else {
                                                tab.update('<iframe id="tabs_iframe_' + builderId + '" src="' + newUrl + '" width="100%" height="100%""></iframe>');
                                                tab.setTitle(title);
                                            }
                                            tabs.setActiveTab(tab);
                                        }
                                    }
                                }
                            ]
                        }
                    }
                },
                {
                    text: '产品信息',
                    type: 'string',
                    name: 'storeRetailOrderStatus',
                    renderer: function (value, metaData, record) {
                        var productSku = record.get('productSku'),
                            productWeight = record.get('productWeight'),
                            unitPrice = record.get('unitPrice'),
                            titleData = [
                                {
                                    title: 'SKU',
                                    value: JSAutoWordWrapStr(productSku || '')
                                },
                                {
                                    title: '单重',
                                    value: JSAutoWordWrapStr(productWeight || '')
                                },
                                {
                                    title: '单价',
                                    value: JSAutoWordWrapStr(`${unitPrice || ''}`)
                                },
                            ];

                        return JSCreateHTMLTable(titleData);
                    }
                },
                {
                    text: '属性信息',
                    type: 'date',
                    name: 'productDescription',
                    renderer: function (value, metaData, record) {
                        return JSAutoWordWrapStr(value);
                    }
                },
                {
                    text: '数量',
                    type: 'string',
                    name: 'qty',
                    width: 100
                },
                {
                    text: '总计',
                    type: 'string',
                    name: 'id',
                    renderer: function (value, metaData, record) {
                        var totalPrice = record.get('totalPrice'),
                            totalWeight = record.get('totalWeight'),
                            titleData = [
                                {
                                    title: 'Payment Subtotal',
                                    value: JSCreateFont('red', true, `${totalPrice}`, 15)
                                },
                                {
                                    title: 'Subtotal',
                                    value: JSCreateFont('red', true, totalWeight, 15)
                                },

                            ];

                        return JSCreateHTMLTable(titleData);
                    }
                },
                {
                    text: '其它',
                    type: 'link',
                    name: 'id',
                    renderer: function (value, metaData, record) {
                        metaData.tdAttr = 'data-qtip="' + `查看_店铺订单详情` + '"';
                        var bindOrderNumber = record.get('bindOrderNumber'),
                            titleData = [
                                {
                                    title: '店铺订单号',
                                    value: JSCreateHyperLink(bindOrderNumber)
                                },
                            ];

                        return JSCreateHTMLTable(titleData);
                    },
                    clickHandler: function (value, metaData, record) {
                        var bindOrderId = record.get('bindOrderId');

                        JSOpen({
                            id: 'customer_order_info',
                            title: i18n.getKey(`店铺订单详情(${value})`),
                            url: path + 'partials/customerordermanagement/customer_order_info.html' +
                                '?customerId=' + bindOrderId,
                            refresh: true
                        })
                    }
                },
            ],
            filtersText: []
        },
    },
    //测试配置
    test: {
        id: 12345
    }
})