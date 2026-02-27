Ext.Loader.syncRequire([
    'CGP.common.store.ProductStore',
    'CGP.orderdetails.view.render.OrderLineItemRender',
    'CGP.common.field.ProductGridCombo'
]);
Ext.Loader.setConfig({
    paths: {
        'CGP.orderlineitem': path + 'js/orderlineitem'
    },
    enabled: true,
    disableCaching: false
});

Ext.onReady(function () {
    var controller = Ext.create('CGP.orderlineitem.controller.OrderLineItem'),
        mainRenderer = Ext.create('CGP.orderlineitem.renderer.MainRenderer'),
        orderLineItemRender = Ext.create('CGP.orderdetails.view.render.OrderLineItemRender'),
        productStore = Ext.create('CGP.common.store.ProductStore', {
            autoLoad: false,
            storeId: 'productStore',
        }),
        orderLineItemStore = Ext.create('CGP.orderlineitemv2.store.OrderLineItem'),
        isText = JSGetQueryString('isTest2') === 'true',
        originIsTest = !JSWebsiteIsStage() || isText,
        isTestText = JSGetQueryString('isTest2') === 'null' ? originIsTest : isText;

    window.controller = controller;

    var orderItem = orderLineItemRender.getOrderItemCfgV2({}, 'orderItemPage'),
        page = Ext.widget({
            xtype: 'uxgridpage',
            i18nblock: i18n.getKey('orderLineItem'),
            block: 'orderlineitem',
            gridCfg: {
                store: orderLineItemStore,
                showRowNum: true,
                editAction: false,
                deleteAction: false,
                id: 'gridPageId',
                viewConfig: {
                    stripeRows: false,
                    enableTextSelection: true
                },
                /*columns: [
                    //order inforamtion
                    {
                        dataIndex: 'orderNumber',
                        width: 140,
                        text: i18n.getKey('orderNumber'),
                        renderer: function (value, metadata, record) {
                            var orderNumber = record.get('orderNumber');
                            var orderId = record.get('orderId');
                            var seqNo = record.get('seqNo');
                            var orderLineItemUploadStatus = record.get('orderLineItemUploadStatus');
                            var isRedo = record.get('isRedo');
                            var template = '<a style="text-decoration: none;" href="javascript:{handler}">' + value + '</a>';
                            var orderStatus = record.get('orderStatusId');
                            if (isRedo) {
                                template += '<' + '<text style="color: red">' + i18n.getKey('re-produce') + '</text>' + '>';
                            }
                            if (!Ext.isEmpty(orderLineItemUploadStatus) && Ext.Array.contains([300, 301], orderStatus.id)) {
                                template += '<' + '<text style="color: red">' + '上传设计文档状态：' + i18n.getKey(orderLineItemUploadStatus) + '</text>' + '>';
                            }
    
                            if (seqNo == 1) {
                                metadata.tdAttr = 'data-qtip="' + i18n.getKey('orderDetails') + '"';
                                return new Ext.Template(template).apply({
                                    handler: 'showOrderDetail(' + orderId + ',' + '\'' + orderNumber + '\'' + ')'
                                });
                            } else {
                                return '';
                            }
                        }
                    },
                    {
                        text: i18n.getKey('id'),
                        dataIndex: 'id',
                        itemId: 'id',
                        sortable: true,
                        width: 160,
                        renderer: function (value, metadata, record) {
                            var isLock = record.get('isLock'),
                                lockText = isLock ? `${JSCreateFont('red', true, '(已锁定)')}` : ''
                            return `${value} ${lockText}`
                        }
                    },
                    {
                        sortable: false,
                        text: i18n.getKey('operation'),
                        width: 100,
                        autoSizeColumn: false,
                        xtype: 'componentcolumn',
                        renderer: function (value, metadata, record) {
                            var statusId = record.get('statusId'),
                                isLock = record.get('isLock'),
                                deliveryOrderShow = [120, 121, 122, 106, 107, 108, 109].includes(statusId),
                                shipmentRequirementShow = [40, 100, 101, 300, 116, 44, 113, 118, 42, 37681428, 9358697].includes(statusId);
    
                            return {
                                xtype: 'button',
                                ui: 'default-toolbar-small',
                                height: 26,
                                text: i18n.getKey('options'),
                                width: '100%',
                                flex: 1,
                                menu: [
                                    {
                                        text: i18n.getKey('modifyStatus'),
                                        disabledCls: 'menu-item-display-none',
                                        handler: function () {
                                            var orderId = record.get('orderId');
                                            var orderLineItemId = record.get('id');
                                            var statusName = record.get('statusName');
                                            var isRedo = record.get('isRedo');
                                            controller.modifyOrderLineItemStatus(orderId, orderLineItemId, statusName, isRedo, statusId);
                                        }
                                    },
                                    {
                                        text: i18n.getKey('check') + i18n.getKey('orderLineItem') + i18n.getKey('product'),
                                        disabledCls: 'menu-item-display-none',
                                        handler: function () {
                                            var productId = record.get('productId');
                                            controller.checkProduct(productId);
                                        }
                                    },
                                    {
                                        text: i18n.getKey('check') + i18n.getKey('orderLineItem') + i18n.getKey('material'),
                                        disabledCls: 'menu-item-display-none',
                                        handler: function () {
                                            var materialId = record.get('materialId');
                                            controller.checkMaterial(materialId)
                                        }
                                    },
                                    {
                                        text: i18n.getKey('check') + i18n.getKey('order'),
                                        disabledCls: 'menu-item-display-none',
                                        handler: function () {
                                            var orderNumber = record.get('orderNumber');
                                            JSOpen({
                                                id: 'page',
                                                url: path + "partials/order/order.html?orderNumber=" + orderNumber,
                                                title: '订单 所有订单',
                                                refresh: true
                                            });
                                        }
                                    },
                                    /!*     {
                                             text: i18n.getKey('check') + i18n.getKey('finishedProductItem'),
                                             disabledCls: 'menu-item-display-none',
                                             hidden: !(Ext.Array.contains([103, 104, 105, 106, 400, 401, 402], (record.get('statusId')))),
                                             handler: function () {
                                                 var orderLineItemId = record.getId();
                                                 JSOpen({
                                                     id: 'finishedproductitempage',
                                                     url: path + "partials/finishedproductitem/finishedproductitem.html" +
                                                         "?excludeStatusIds=241635&orderLineItemId=" + orderLineItemId,
                                                     title: '成品项管理 生产中',
                                                     refresh: true
                                                 });
                                             }
                                         },*!/
                                    {
                                        text: i18n.getKey('重新上传设计文档'),
                                        disabledCls: 'menu-item-display-none',
                                        hidden: !(!Ext.isEmpty(record.get('orderLineItemUploadStatus')) && Ext.Array.contains([300, 301], statusId)),
                                        handler: function () {
                                            var orderLineItemId = record.getId();
                                            var productInstanceId = record.get('productInstanceId');
                                            var orderId = record.get('orderId');
                                            var orderInfo = controller.getOrder(orderId);
                                            var order = orderInfo;
                                            Ext.Ajax.request({
                                                url: adminPath + 'api/builder/resource/builder/url/latest' +
                                                    '?productInstanceId=' + productInstanceId + '&platform=PC&language=en',
                                                method: 'GET',
                                                headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                                                success: function (rep) {
                                                    var response = Ext.JSON.decode(rep.responseText);
                                                    if (response.success) {
                                                        if (Ext.isEmpty(response.data)) {
                                                            Ext.Msg.alert('提示', '产品无配置的builder地址。')
                                                        } else {
                                                            Ext.create('CGP.orderlineitem.view.manualuploaddoc.EditProductInstanceWindow', {
                                                                orderLineItemId: orderLineItemId,
                                                                productInstanceId: productInstanceId,
                                                                builderUrl: response.data,
                                                                order: order
                                                            }).show();
                                                        }
                                                    } else {
                                                        Ext.Msg.alert('提示', '请求失败！' + response.data.message);
                                                    }
                                                },
                                                failure: function (resp) {
                                                    var response = Ext.JSON.decode(resp.responseText);
                                                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                                }
                                            });
    
                                        }
                                    },
                                    {
                                        text: i18n.getKey('PC对比工具'),
                                        disabledCls: 'menu-item-display-none',
                                        menu: {
                                            items: [
                                                {
                                                    text: i18n.getKey('定制图片对比'),
                                                    disabledCls: 'menu-item-display-none',
                                                    handler: function () {
                                                        var orderLineItemId = record.getId();
                                                        var productInstanceId = record.get('productId');
                                                        var orderId = record.get('orderId');
                                                        JSOpen({
                                                            id: 'pcCompareBuilder',
                                                            url: path + "partials/test/pcCompare/main.html" +
                                                                "?productInstanceId=" + productInstanceId +
                                                                "&orderLineItemId=" + orderLineItemId +
                                                                '&compareType=cacheImageCompare' +
                                                                '&orderId=' + orderId +
                                                                '&orderItemId=' + orderLineItemId,
                                                            title: 'PC对比builder',
                                                            refresh: true
                                                        });
                                                    }
                                                }, {
                                                    text: i18n.getKey('排版page对比'),
                                                    disabledCls: 'menu-item-display-none',
                                                    hidden: !(Ext.Array.contains([103, 104, 105, 106, 400, 401, 402], (record.get('statusId')))),
                                                    handler: function () {
                                                        var orderLineItemId = record.getId();
                                                        var productInstanceId = record.get('productId');
                                                        var orderId = record.get('orderId');
                                                        var impressionVersion = record.get('impressionVersion');//
                                                        JSOpen({
                                                            id: 'pcCompareBuilder',
                                                            url: path + "partials/test/pcCompare/main.html?" +
                                                                "productInstanceId=" + productInstanceId +
                                                                "&orderLineItemId=" + orderLineItemId +
                                                                '&compareType=pageCompare&orderId=' + orderId +
                                                                '&orderItemId=' + orderLineItemId +
                                                                '&impressionVersion=' + impressionVersion,
                                                            title: 'PC对比builder',
                                                            refresh: true
                                                        });
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        text: i18n.getKey('check') + i18n.getKey('jobTask') + i18n.getKey('distribute'),
                                        disabledCls: 'menu-item-display-none',
                                        handler: function () {
                                            var orderLineItemId = record.getId();
                                            JSOpen({
                                                id: 'orderItemJobTask',
                                                url: path + "partials/orderlineitem/orderlineitemjobtask.html" +
                                                    "?orderLineItemId=" + orderLineItemId,
                                                title: i18n.getKey('orderLineItem') + i18n.getKey('jobTask') + i18n.getKey('distribute'),
                                                refresh: true
                                            });
                                        }
                                    },
                                    {
                                        text: i18n.getKey('check') + i18n.getKey('shipmentRequirement'),
                                        disabledCls: 'menu-item-display-none',
                                        hidden: !shipmentRequirementShow,
                                        handler: function () {
                                            JSOpen({
                                                id: 'shipmentrequirementpage',
                                                url: path + 'partials/shipmentrequirement/main.html' +
                                                    '?oderLineItemId=' + record.get('id'),
                                                title: i18n.getKey('shipmentRequirement'),
                                                refresh: true
                                            })
                                        }
                                    },
                                    //查看发货订单
                                    {
                                        text: i18n.getKey('check') + i18n.getKey('deliveryOrder'),
                                        disabledCls: 'menu-item-display-none',
                                        hidden: !deliveryOrderShow,
                                        handler: function () {
                                            JSOpen({
                                                id: 'deliveryorderpage',
                                                url: path + 'partials/deliveryorder/main.html' +
                                                    '?oderLineItemId=' + record.get('id'),
                                                title: i18n.getKey('deliveryOrder'),
                                                refresh: true
                                            })
                                        }
                                    },
                                    // 锁定
                                    {
                                        text: i18n.getKey('锁定'),
                                        hidden: isLock,
                                        handler: function (btn) {
                                            var id = record.get('id');
                                            setLockStatus(id, true);
                                        }
                                    },
                                    {
                                        text: i18n.getKey('解锁'),
                                        hidden: !isLock,
                                        handler: function (btn) {
                                            var id = record.get('id');
                                            setLockStatus(id, false);
                                        }
                                    }
                                ]
                            }
                        }
                    },
                    {
                        dataIndex: 'seqNo',
                        text: i18n.getKey('seqNo'),
                        width: 60,
                    },
                    {
                        dataIndex: 'productImageUrl',
                        text: i18n.getKey('image'),
                        xtype: 'componentcolumn',
                        width: 140,
                        renderer: function (value, metadata, record) {
                            var thumbnailInfo = record.get('thumbnailInfo');
                            var status = thumbnailInfo?.status;
                            var thumbnail = thumbnailInfo?.thumbnail;
                            if (['', undefined].includes(thumbnail) && status !== 'FAILURE') {
                                status = 'NULL'
                            }
                            var statusGather = {
                                SUCCESS: function () {
                                    return '查看图片';
                                },
                                FAILURE: function () {
                                    return '图片生成失败';
                                },
                                INIT: function () {
                                    return '查看图片';
                                },
                                WAITING: function () {
                                    return '图片正在生成中';
                                },
                                NULL: function () {
                                    return '图片为空';
                                },
                            }
                            metadata.tdAttr = `data-qtip=${statusGather[status]()}`
                            return mainRenderer.rendererImage(value, metadata, record);
                        }
                    },
                    {
                        dataIndex: 'qty',
                        text: i18n.getKey('totalQty'),
                        width: 60
                    },
                    {
                        dataIndex: 'status',
                        width: 140,
                        text: i18n.getKey('orderItemStatus'),
                        renderer: function (value, metadata, record) {
                            metadata.style = 'color:red';
                            var statusName = record.get('statusName');
                            var resultName = i18n.getKey(statusName);
                            if (record.get('isRedo')) {
                                var statusId = record.get('statusId');
                                if (statusId == 103) {
                                    resultName = i18n.getKey('redo-confirmed(waitting print)');
                                } else {
                                    resultName = i18n.getKey('redo') + '-' + i18n.getKey(resultName);
                                }
                            }
                            return resultName;
                        }
                    },
                    {
                        dataIndex: 'productSku',
                        width: 230,
                        text: i18n.getKey('product') + 'sku',
                        renderer: function (value, metadata, record) {
                            var productId = record.get('productId');
                            if (productId) {
                                return value + '(' + productId + ')';
                            } else {
                                return value;
                            }
                        }
                    },
                    {
                        width: 230,
                        text: i18n.getKey('material'),
                        renderer: function (value, metadata, record) {
                            var materialName = record.get('materialName')
                            var materialId = record.get('materialId');
                            metadata.tdAttr = 'data-qtip="' + materialName + '"';
                            if (!Ext.isEmpty(materialName)) {
                                return materialName + '(' + materialId + ')';
                            }
                        }
                    },
                    {
                        text: i18n.getKey('isTest'),
                        dataIndex: 'isTest',
                        itemId: 'isTest',
                        width: 90,
                        renderer: function (value, metadata) {
                            var isTest = value;
                            return JSCreateFont(isTest ? 'green' : 'red', true, i18n.getKey(isTest));
                        }
                    },
                    /!*,
                    {
                        dataIndex: 'thirdManufactureName',
                        text: i18n.getKey('产品外派生产'),
                        flex: 1,
                        minWidth: 140,
                        renderer: function (value) {
                            if (value) {
                                var items = [
                                    {
                                        title: '是否外派生产',
                                        value: '<font color="red">' + i18n.getKey(!Ext.isEmpty(value)) + '</font>'
                                    },
                                    {
                                        title: '生产供应商',
                                        value: value
                                    }
                                ];
                                return JSCreateHTMLTable(items);
                            }
                        }
                    }*!/
                    {
                        text: i18n.getKey('customOrderInfo'),
                        dataIndex: 'id',
                        flex: 1,
                        renderer: function (value, metadata, record) {
                            var bindSeqNo = record.get('bindSeqNo'),
                                bindOrderNumber = record.get('bindOrderNumber');
    
                            if (!Ext.isEmpty(bindOrderNumber)) {
                                return `${bindOrderNumber} - ${bindSeqNo}`;
                            } else {
                                return '';
                            }
    
                        }
                    }
                ],*/
                columns: [
                    orderItem.get('1'),
                    orderItem.get('2'),
                    orderItem.get('3'),
                    orderItem.get('4'),
                    orderItem.get('5'),
                    orderItem.get('0'),
                    orderItem.get('6'),
                    orderItem.get('7'),
                    orderItem.get('11'),
                    orderItem.get('8'),
                    orderItem.get('9'),
                    orderItem.get('10'),
                    orderItem.get('12'),
                ],
                columnDefaults: {
                    tdCls: 'vertical-middle',
                    sortable: false,
                    menuDisabled: true,
                    resizable: true
                }
            },
            filterCfg: {
                layout: {
                    type: 'table',
                    columns: 4
                },
                items: [
                    {
                        name: '_id',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('id'),
                        hideTrigger: true,
                        isLike: false,
                        allowDecimals: false,
                        listeners: {
                            render: function (comp) {
                                var orderLineItemId = JSGetQueryString('id');
                                if (orderLineItemId) {
                                    comp.setValue(parseInt(orderLineItemId));
                                }
                            }
                        },
                        itemId: 'id'
                    },
                    {
                        name: 'orderNumber',
                        enforceMaxLength: true,
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('orderNumber'),
                        itemId: 'orderNumber',
                        listeners: {
                            render: function (comp) {
                                var orderNumber = JSGetQueryString('orderNumber');
                                if (orderNumber) {
                                    comp.setValue(orderNumber);
                                }
                            }
                        },
                    },
                    {
                        xtype: 'multicombobox',
                        fieldLabel: i18n.getKey('订单项状态'),
                        name: 'statusId',
                        itemId: 'statusId',
                        editable: false,
                        haveReset: true,
                        isMultiSelect: true, //是否开启多选查询
                        valueType: 'number',
                        store: Ext.create('CGP.orderlineitem.store.OrderItemStatus'),
                        displayField: 'name',
                        valueField: 'id',
                        titleField: 'tipInfo',
                        listeners: {
                            afterrender: function (combo) {
                                var store = combo.getStore();
                                store.on('load', function () {
                                    this.insert(0, {
                                        id: null,
                                        name: i18n.getKey('allStatus')
                                    });
                                    if (!combo.getValue())
                                        combo.select(store.getAt(0));
                                });
                            }
                        }
                    },
                    {
                        xtype: 'productgridcombo',
                        name: 'productId',
                        itemId: 'productSearch',
                        fieldLabel: i18n.getKey('product'),
                        displayField: 'name',
                        valueField: 'id',
                        labelAlign: 'right',
                        productType: null,//SKU
                        editable: false,
                        haveReset: true,
                        gotoConfigHandler: null,
                        value: function () {
                            //gridCombo的设置初始值是异步请求，所以得在一开始弄个值进去
                            var productId = JSGetQueryString('productId');
                            if (Ext.isEmpty(productId)) {
                                return null;
                            } else {
                                return [{
                                    id: Number(productId)
                                }]
                            }
                        }(),
                    },
                    {
                        style: 'margin-right:50px; margin-top : 0px;',
                        name: 'receivedDate',
                        xtype: 'daterange',
                        itemId: 'receivedDate',
                        fieldLabel: i18n.getKey('receivedDate'),
                        width: 360

                    },
                    {
                        xtype: 'daterange',
                        name: 'datePurchased',
                        itemId: 'fromDate',
                        style: 'margin-right:50px; margin-top : 0px;',
                        scope: true,
                        isLike: true,
                        fieldLabel: i18n.getKey('datePurchased'),
                        width: 360,
                    },
                    {
                        xtype: 'combobox',
                        editable: false,
                        haveReset: true,
                        fieldLabel: i18n.getKey('isTest'),
                        name: 'isTest',
                        itemId: 'isTest',
                        store: {
                            fields: [
                                'name',
                                {
                                    name: 'value',
                                    type: 'boolean'
                                }
                            ],
                            data: [
                                {
                                    value: true,
                                    name: '是'
                                },
                                {
                                    value: false,
                                    name: '否'
                                }
                            ]
                        },
                        displayField: 'name',
                        value: isTestText,
                        valueField: 'value',
                    },
                    {
                        name: 'bindOrderNumber',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('customOrderId'),
                        itemId: 'customOrderId'
                    },
                    {
                        xtype: 'numberfield',
                        name: 'bindSeqNo',
                        minValue: 0,
                        fieldLabel: i18n.getKey('customOrderItemSeq'),
                        labelWidth: 120,
                        hideTrigger: true,
                        itemId: 'customOrderItemSeq'
                    },
                    {
                        xtype: 'combo',
                        fieldLabel: i18n.getKey('生产基地'),
                        name: 'finalManufactureCenter',
                        itemId: 'finalManufactureCenter',
                        isLike: false,
                        editable: false,
                        haveReset: true,
                        displayField: 'key',
                        valueField: 'value',
                        store: {
                            fields: ['key', 'value'],
                            data: [
                                {
                                    'key': '东莞生产基地',
                                    'value': "PL0001"
                                },
                                {
                                    'key': '越南生产基地',
                                    'value': "PL0003"
                                }
                            ]
                        },
                    },
                    {
                        xtype: 'multicombobox',
                        fieldLabel: i18n.getKey('排版状态'),
                        name: 'paibanStatus',
                        itemId: 'paibanStatus',
                        editable: false,
                        haveReset: true,
                        isMultiSelect: true, //是否开启多选查询
                        valueType: 'number',
                        store: {
                            fields: ['id', 'name'],
                            data: [
                                {
                                    id: 1,
                                    name: '等待排版'
                                },
                                {
                                    id: 2,
                                    name: '正在排版'
                                },
                                {
                                    id: 3,
                                    name: '排版失败'
                                },
                                {
                                    id: 4,
                                    name: '排版成功'
                                }
                            ]
                        },
                        displayField: 'name',
                        valueField: 'id',
                        titleField: 'tipInfo',
                    },
                    {
                        xtype: 'textfield',
                        name: 'storeProductId',
                        itemId: 'storeProductId',
                        isLike: true,
                        hideTrigger: true,
                        isMultiSelect: true, //是否开启多选查询
                        valueType: 'string',
                        enforceMaxLength: true,
                        labelWidth: 100,
                        tipInfo: '该字段可通过(,)实现多数据查询,例如: 327486849,327486852',
                        fieldLabel: i18n.getKey('店铺产品Id'),
                    },                         
                    {
                        xtype: 'textfield',
                        name: 'productInstanceId',
                        itemId: 'productInstanceId',
                        isLike: true,
                        hideTrigger: true,
                        isMultiSelect: true, //是否开启多选查询
                        valueType: 'string',
                        enforceMaxLength: true,
                        labelWidth: 140,
                        width: 300,
                        tipInfo: '该字段可通过(,)实现多数据查询,例如: 327486849,327486852',
                        fieldLabel: i18n.getKey('productInstanceId'),
                    },
                ],
            },
            tbarCfg: {
                hiddenButtons: ['create', 'delete', 'help'],
                btnConfig: {
                    text: i18n.getKey('批量锁定'),
                    width: 100,
                    disabled: false,
                    handler: function () {
                        var grid = Ext.getCmp('gridPageId'),
                            selection = grid.getSelectionModel().getSelection();

                        if (selection.length > 0) {
                            Ext.create('Ext.window.Window', {
                                layout: 'fit',
                                modal: true,
                                constrain: true,
                                title: i18n.getKey('批量锁定'),
                                items: [
                                    {
                                        xtype: 'errorstrickform',
                                        itemId: 'form',
                                        defaults: {
                                            margin: '10 25 5 25',
                                        },
                                        layout: 'vbox',
                                        items: [
                                            {
                                                xtype: 'combo',
                                                fieldLabel: i18n.getKey('锁定/解锁'),
                                                name: 'isLock',
                                                itemId: 'isLock',
                                                allowBlank: false,
                                                editable: false,
                                                store: [
                                                    [true, i18n.getKey('锁定')],
                                                    [false, i18n.getKey('解锁')]
                                                ],
                                                value: true
                                            }
                                        ]
                                    },
                                ],
                                bbar: {
                                    xtype: 'bottomtoolbar',
                                    saveBtnCfg: {
                                        handler: function (btn) {
                                            var win = btn.ownerCt.ownerCt,
                                                form = win.getComponent('form'),
                                                formData = form.getValues(),
                                                {isLock} = formData;

                                            if (form.isValid()) {
                                                Ext.each(selection, function (item) {
                                                    var id = item.get('id');
                                                    setLockStatus(id, isLock);
                                                });
                                                win.close();
                                            }
                                        }
                                    }
                                },
                            }).show();
                        } else {
                            Ext.Msg.alert(i18n.getKey('提示'), i18n.getKey('请至少选中一条数据!'));
                        }
                    }
                },
                btnImport: {
                    text: i18n.getKey('批量审批订单项'),
                    width: 140,
                    disabled: false,
                    iconCls: 'icon_audit',
                    // hidden: true, //先提交部分　
                    handler: function (btn) {
                        var tools = btn.ownerCt,
                            grid = tools.ownerCt,
                            store = grid.store,
                            proxy = store.proxy,
                            queryUrl = proxy.url,
                            filterComp = proxy.filter,
                            filterParams = filterComp.getQuery(),
                            selectRecords = grid.getSelectionModel().getSelection(),
                            filterSelectRecord = selectRecords?.filter(record => {
                                var statusId = record.get('statusId'); //待审核状态
                                return [110, 101].includes(+statusId);
                            }),
                            selectIds = filterSelectRecord?.map(record => {
                                return record.get('id').toString();
                            }),
                            title = i18n.getKey('审批_订单项'),
                            fieldLabel = i18n.getKey('审批范围'),
                            orderTotalCount = orderLineItemRender.getAuditStatusOrderTotalCount(queryUrl, filterParams,true);
                        // orderTotalCount = orderLineItemStore.totalCount;

                        orderLineItemRender.createExportExcelWindow(title, fieldLabel, selectIds, orderTotalCount, function (win, selModel) {
                            orderLineItemRender.createOrderItemAuditFormWindow(null, function (win, data) {
                                var {customerNotify, comment} = data,
                                    selModelGather = {
                                        all: function () {
                                            var proxy = grid.store.proxy,
                                                queryUrl = proxy.url,
                                                filterComp = proxy.filter,
                                                filterParams = filterComp.getQuery(),
                                                queryData = orderLineItemRender.getAuditStatusOrderTotalData(queryUrl, filterParams),
                                                queryIds = queryData?.map(item => item._id.toString());

                                            return {
                                                "ids": queryIds,
                                                "customerNotify": customerNotify,
                                                "comment": comment
                                            }
                                        },
                                        selected: function () {

                                            return {
                                                "ids": selectIds,
                                                "customerNotify": customerNotify,
                                                "comment": comment
                                            }
                                        }
                                    },
                                    url = adminPath + `api/orderItems/audit/batch`,
                                    putData = selModelGather[selModel]();

                                JSAsyncEditQuery(url, putData, true, function (require, success, response) {
                                    if (success) {
                                        var responseText = Ext.JSON.decode(response.responseText),
                                            data = responseText?.data;

                                        if (responseText.success) {
                                            if (Ext.Object.isEmpty(data)) {
                                                win.close();
                                                store.load();
                                                JSShowNotification({
                                                    type: 'success',
                                                    title: '审批成功!',
                                                });
                                            } else {
                                                //需报关id
                                                var auditCodes = Object.keys(data),
                                                    codeArr = ['108000358', '108000359', '108000360'],
                                                    idText = i18n.getKey('id'),
                                                    codeGather = {
                                                        '108000358': `下列订单项(${idText})随机状态未完成:<br>`,
                                                        '108000359': `下列订单项(${idText})的报关分类未完备:<br>`,
                                                        '108000360': `下列订单项(${idText})关联的订单未完成后续数据处理:<br>`
                                                    },
                                                    errorTexts = []

                                                auditCodes.forEach(item => {
                                                    var isExist = codeArr.includes(item),
                                                        auditIds = data[item],
                                                        errorText = isExist ? codeGather[item] : '下列订单项存在问题(请询问开发人员):<br>';

                                                    errorTexts.push(`${errorText} ${auditIds}`);
                                                });

                                                orderLineItemRender.createAuditErrorTextWindow(errorTexts, function (win, formData) {
                                                    win.close();
                                                });
                                            }
                                            store.load();
                                        }
                                    }
                                }, true)
                            })
                            win.close();
                        });
                    }
                },
                btnExport: {
                    text: i18n.getKey('导出订单项'),
                    width: 120,
                    disabled: false,
                    handler: function (btn) {
                        var url = adminPath + 'api/orderItems/exportExcel',
                            tools = btn.ownerCt,
                            grid = tools.ownerCt,
                            store = grid.store,
                            selectRecords = grid.getSelectionModel().getSelection(),
                            title = i18n.getKey('导出_订单项Excel'),
                            fieldLabel = i18n.getKey('导出范围'),
                            gridFilterData = grid.filter.getQuery(),
                            selectIds = selectRecords?.map(record => record.get('_id')),
                            orderTotalCount = store.totalCount;

                        orderLineItemRender.createExportExcelWindow(title, fieldLabel, selectIds, orderTotalCount, function (win, selModel) {
                            var selModelGather = {
                                    all: function () {
                                        return JSON.stringify(gridFilterData);
                                    },
                                    selected: function () {
                                        var result = [
                                            {
                                                "name": "includeIds",
                                                "type": "string",
                                                "value": `[${selectIds}]`
                                            }
                                        ]

                                        return JSON.stringify(result);
                                    }
                                },
                                filterArray = selModelGather[selModel]();

                            orderLineItemRender.downloadOriginalFn(url, filterArray, grid, function () {
                                win.close();
                            });
                        });
                    }
                }
            },
            listeners: {
                afterrender: function (comp) {
                    var isTest = JSGetQueryString('isTest2'),
                        filterComp = comp.getComponent('filter'),
                        fromDate = filterComp.getComponent('fromDate'),
                        startComp = fromDate.getComponent('start');

                    if (!isTest){
                        startComp.setValue(Ext.util.Format.date(Ext.Date.add(new Date(), Ext.Date.MONTH, -3), "Y-m-d"));
                    }
                },
                afterload: function (p) {
                    p.filter.getComponent('orderNumber').on('change', function (comp, newValue, oldValue) {
                        if (newValue.length == 12) {
                            p.grid.getStore().loadPage(1);
                        }
                    });
                    controller.proccessUrlSearcherParams(p);


                }
            }
        });

    window.refreshGrid = function () {
        page.grid.store.reload();
    };
    window.showOrderDetail = function (id, orderNumber) {

        var status = 1;
        JSOpen({
            id: 'orderDetails',
            url: path + 'partials/orderitemsmultipleaddress/main.html?id=' + id + '&status=' + status + '&orderNumber=' + orderNumber,
            title: i18n.getKey('orderDetails') + '(' + i18n.getKey('orderNumber') + ':' + orderNumber + ')',
            refresh: true
        });

    }

});
