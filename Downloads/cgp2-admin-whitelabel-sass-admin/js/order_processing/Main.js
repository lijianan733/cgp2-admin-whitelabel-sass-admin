/**
 * @author nan
 * @date 2025/6/20
 * @description TODO
 */
/*Ext.Loader.setConfig({
    paths: {
        // 'CGP.order': path + 'js/order',
        'Ext.ux.grid.plugin': path + 'ClientLibs/extjs/ux/grid/plugin'
    },
    disableCaching: false
});*/
/*Ext.syncRequire(['CGP.order.view.Table','CGP.order.view.RowExpander']);*/
Ext.Loader.syncRequire([
    'CGP.partner.store.PartnerStore',
    'CGP.product.model.Product',
    'CGP.product.store.ProductStore',
    'CGP.common.field.WebsiteCombo',
    'CGP.order.view.order.CreateWindow',
    'CGP.common.typesettingschedule.TypeSettingGrid',
    'CGP.orderitemsmultipleaddress.view.singleAddress.tool.operationBtn',
    'CGP.common.field.ProductGridCombo'
]);
Ext.onReady(function () {
    var controller = Ext.create('CGP.order.controller.Order');
    window.controller = controller;
    var store = Ext.create('CGP.orderv2.store.OrderListStore', {
        autoLoad: true,
    });
    var partnerStore = Ext.create('CGP.order.store.PartnerStore', {
        autoLoad: false
    });
    var permissions = Ext.create('CGP.order.controller.Permission');
    window.permissions = permissions;
    top.window.permissions = permissions;
    var checkCostInfoPermission = permissions.buttons.checkCostInfo;
    var multiplesort = Ext.create('Ext.ux.grid.plugin.MultipleSort', {
        width: 1000,
        default: {
            width: 70,
            height: 24
        },
        items: [
            {
                xtype: 'tbtext',
                width: 50,
                text: i18n.getKey('sorter') + ":",
                reorderable: false
            },
            {
                text: i18n.getKey('datePurchased'),
                sortData: {
                    property: 'datePurchased',
                    direction: 'DESC'
                }
            },
        ]
    });
    var page = Ext.create('Ext.ux.ui.GridPage', {
        i18nblock: i18n.getKey('订单'),
        block: 'order_processing',
        tbarCfg: {
            btnCreate: {
                disabled: true,
            },
            btnDelete: {
                disabled: true,
            },
        },
        gridCfg: {
            // store是指store.js
            store: store,
            frame: false,
            editAction: false,
            deleteAction: false,
            plugins: [
                {
                    ptype: 'rowexpander',
                    mergeData: true,
                    rowBodyTpl: new Ext.XTemplate(
                        '<div><div id="order-line-item-{id}"  style="float:left;"></div>' +
                        '<div id="order-total-{id}" style="float:left; width: -webkit-fill-available;"></div></div>'
                    )
                },
                multiplesort
            ],
            viewConfig: {
                enableTextSelection: true,
                listeners: {
                    expandBody: function (rowNode, record, expandRow) {
                        controller.expandBody(rowNode, record, expandRow);
                    }
                },

                getRowClass: function (record, index, rowParams, store) {
                    if (record.get('orderType') == 'RM') {
                        return 'blah';
                    }
                }
            },
            columns: [
                //操作按钮
                {
                    text: i18n.getKey('id'),
                    dataIndex: 'id',
                    hidden: !JSWebsiteIsTest(),
                    itemId: 'id',
                    width: 100
                },
                {
                    xtype: 'atagcolumn',
                    text: i18n.getKey('orderNumber'),
                    dataIndex: 'orderNumber',
                    autoSizeColumn: false,
                    width: 240,
                    getDisplayName: function (value, metadata, record) {
                        var isTest = record.get('isTest') ? `<${JSCreateFont('#ff0000', false, "测试")}>` : '';
                        var isRedo = record.get('isRedo');
                        var statusId = record.get('statusId')
                        var isPause = record.get('isPause');
                        var uploadedCountSum = record.get('uploadedCountSum');
                        var waitUploadCount = record.get('waitUploadCount');
                        var template = value + isTest;
                        metadata.tdAttr = 'data-qtip=跳转至订单详情';
                        if (isPause) {
                            template += '<' + '<font color=red>' + i18n.getKey('pause') + '</font>' + '>';
                        }
                        if (isRedo && statusId != 240710 && (Ext.Array.contains([103, 104, 105, 106, 107], statusId) || record.get('orderType') == 'RD')) {
                            template += '<' + '<text style="color: red">' + i18n.getKey('redo') + i18n.getKey('order') + '</text>' + '>';
                        }
                        if (uploadedCountSum != 0 && waitUploadCount != 0) {
                            template += '<' + '<text style="color: red">' + '待上传文档订单项：' + waitUploadCount + '</text>' + '>';
                        }
                        return template;
                    },
                },//备注
                {
                    xtype: 'atagcolumn',
                    dataIndex: 'id',
                    width: 150,
                    text: '拼单信息处理状态',
                    getDisplayName: function (value, metadata, record) {
                        var mapping = {
                            INITIALIZED: '初始化',
                            IN_PROGRESS: '处理中',
                            COMPLETED: '已完成',
                            FAILED: '失败'
                        };
                        var key = JSGetQueryString('orderPostPreprocessTaskStatus');
                        var str = mapping[key];
                        return `<font  color="green" style="font-weight: bold">${str}</font>  <a class="atag_display">重试</a>`;
                    },
                    clickHandler: function (value, metaData, record, rowIndex, colIndex, store, view) {
                        Ext.Msg.confirm('提醒', '是否确定重试?', function (selector) {
                            if (selector == 'yes') {
                                var orderId = record.get('id');
                                var url = adminPath + `api/orders/${orderId}/post_preprocess/retry`;
                                JSAjaxRequest(url, "PUT", true, null, null, function (require, success, response) {
                                    if (success) {
                                        var responseText = Ext.JSON.decode(response.responseText);
                                        if (responseText.success) {
                                            Ext.Msg.alert('提示', '重试成功');
                                            view.ownerCt.store.load();
                                        }
                                    }
                                });
                            }
                        });
                    }
                },
                {
                    text: i18n.getKey('remark'),
                    dataIndex: 'remark',
                    itemId: 'remark',
                    width: 160,
                },
                {
                    text: i18n.getKey('订单标识'),
                    dataIndex: 'suspectedSanction',
                    width: 100,
                    renderer: function (value, metadata, record, row, col, store) {
                        return value ? (JSCreateFont('red', true, '!', 25) + ' ' +
                            JSCreateFont('red', true, ' 疑似制裁')) : ''
                    }
                },
                {
                    text: i18n.getKey('currency'),
                    dataIndex: 'currency',
                    width: 60,
                    renderer: function (value, metadata, record, row, col, store) {
                        return value?.code;
                    }
                },
                //总价
                {
                    sortable: false,
                    text: i18n.getKey('totalPrice'),
                    dataIndex: 'totalPriceString',
                    itemId: 'totalPriceString',
                    width: 80,
                    renderer: function (value, metadata, record) {
                        metadata.style = 'color:blue';
                        return value;
                    }
                },
                //总成本
                {
                    text: i18n.getKey('总成本'),
                    dataIndex: 'totalCostString',
                    itemId: 'totalCostString',
                    hidden: !checkCostInfoPermission,
                    renderer: function (value, metadata, record) {
                        metadata.style = 'color:blue';
                        return value;
                    }
                },
                //订单类型
                {
                    text: i18n.getKey('orderType'),
                    dataIndex: 'type',
                    itemId: 'orderType',
                    width: 100,
                    renderer: function (value, metadata) {
                        var valueMapping = {
                            'NORMAL': '普通订单',
                            'PARTNER_SAMPLE': 'SAMPLE订单',
                            'ONE_DRAGON': '一条龙订单',
                            'PROOFING': '打样订单'
                        };

                        metadata.style = 'color:red';
                        return valueMapping[value];
                    }
                },
                {
                    text: i18n.getKey('sourcePlatform'),
                    dataIndex: 'sourcePlatform',
                    width: 100,
                    renderer: function (value, metadata, record, row, col, store) {
                        if (value) {

                        } else {
                            value = '其它';
                        }
                        return value;
                    }
                },
                //订单状态
                {
                    xtype: 'atagcolumn',
                    text: i18n.getKey('status'),
                    dataIndex: 'statusId',
                    sortable: false,
                    width: 160,
                    getDisplayName: function (value, metadata, record) {
                        metadata.style = 'color:red';
                        var statusId = record.get('statusId');
                        var statusName = record.get('statusName');
                        var resultName = '<font color="red">' + i18n.getKey(statusName) + '</font>';

                        if (record.get('isRedo')) {
                            if (statusId == 103) {
                                resultName = i18n.getKey('redo-confirmed(waitting print)');
                            } else {
                                if (statusId != 240710 && Ext.Array.contains([104, 105, 106, 107], Number(statusId))) {
                                    resultName = i18n.getKey('redo') + '-' + i18n.getKey(statusName);
                                }
                            }
                        }
                        return resultName;
                    }
                },
                //订单项数
                {
                    sortable: true,
                    text: i18n.getKey('totalCount'),
                    dataIndex: 'totalCount',
                    itemId: 'totalCount',
                    xtype: 'numbercolumn',
                    format: '0,000',
                    width: 65,
                    renderer: function (value, metadata, record) {
                        metadata.style = 'color:blue';
                        return value;
                    }
                },
                //产品个数
                {
                    sortable: false,
                    text: i18n.getKey('totalQty'),
                    dataIndex: 'totalQty',
                    itemId: 'totalQty',
                    xtype: 'numbercolumn',
                    format: '0,000',
                    width: 65,
                    renderer: function (value, metadata) {
                        metadata.style = 'color:blue';
                        return value;
                    }
                },
                //下单时间
                {
                    text: i18n.getKey('datePurchased'),
                    dataIndex: 'datePurchased',
                    itemId: 'datePurchased',
                    xtype: 'datecolumn',
                    align: 'center',
                    renderer: function (value, metadata) {
                        if (Ext.isEmpty(value)) {
                            return
                        }
                        value = Ext.Date.format(value, 'Y/m/d H:i');
                        metadata.style = 'color:gray';
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return '<div style="white-space:normal;">' + value + '</div>'
                    }
                },
                //付款日期
                {
                    text: i18n.getKey('付款日期'),
                    dataIndex: 'paidDate',
                    itemId: 'paidDate',
                    xtype: 'datecolumn',
                    align: 'center',
                    renderer: function (value, metadata) {
                        if (Ext.isEmpty(value)) {
                            return
                        }
                        value = Ext.Date.format(value, 'Y/m/d H:i');
                        metadata.style = 'color:gray';
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return '<div style="white-space:normal;">' + value + '</div>'
                    }
                },
                // 排版状态
                {
                    xtype: 'atagcolumn',
                    text: i18n.getKey('排版状态'),
                    dataIndex: 'paibanStatus',
                    itemId: 'paibanStatus',
                    sortable: false,
                    width: 160,
                    getDisplayName: function (value, metadata, record) {
                        metadata.style = 'color:red';
                        var statusNameGather = {
                                4: {
                                    color: 'green',
                                    text: i18n.getKey('排版成功'),
                                    extraText: ' <a href="#">' + i18n.getKey('排版进度') + '</a>'
                                },
                                3: {
                                    color: 'red',
                                    text: i18n.getKey('排版失败'),
                                    extraText: ' <a href="#">' + i18n.getKey('排版进度') + '</a>'
                                },
                                2: {
                                    color: 'blue',
                                    text: i18n.getKey('正在排版'),
                                    extraText: ' <a href="#">' + i18n.getKey('排版进度') + '</a>'
                                },
                                1: {
                                    color: 'grey',
                                    text: i18n.getKey('等待排版'),
                                    extraText: ' <a href="#">' + i18n.getKey('排版进度') + '</a>'
                                },
                            },
                            {color, text, extraText} = statusNameGather[value],
                            statusName = JSCreateFont(color, true, text),
                            resultName = statusName;

                        return resultName;
                    },
                },
                //付款方式
                {
                    text: i18n.getKey('paymentMethod'),
                    dataIndex: 'paymentMethod',
                    itemId: 'paymentMethod',
                    width: 100
                },
                {
                    xtype: 'atagcolumn',
                    text: i18n.getKey('走货方式'),
                    dataIndex: 'orderDeliveryMethod',
                    getDisplayName: function (value, metadata, record) {
                        const status = record.get('statusId'),
                            //已组装(待装箱)状态之前
                            statusGather = {
                                ULGS: '统一配送',
                                SELF_SUPPORT: '自营配送'
                            };

                        return `${statusGather[value || 'SELF_SUPPORT']}`;
                    },
                },
                //收货人
                {
                    text: i18n.getKey('deliveryName'),
                    dataIndex: 'deliveryName',
                    itemId: 'deliveryName',
                    width: 120,
                    xtype: 'gridcolumn'
                },

                {
                    width: 250,
                    text: i18n.getKey('partner'),
                    dataIndex: 'partner',
                    itemId: 'partner',
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        var partnerId = record.get('partnerId');
                        var partnerName = record.get('partnerName');
                        if (partnerId) {
                            var result = partnerName + '<' + partnerId + '>';
                            metadata.tdAttr = 'data-qtip="' + result + '"';
                            return result;
                        }
                    }
                },
                //审核日期
                {
                    text: i18n.getKey('confirmedDate'),
                    dataIndex: 'confirmedDate',
                    itemId: 'confirmedDate',
                    xtype: 'datecolumn',
                    align: 'center',
                    renderer: function (value, metadata) {
                        if (Ext.isEmpty(value)) {
                            return
                        }
                        if (value.getTime() == 0)
                            return '';
                        value = Ext.Date.format(value, 'Y/m/d H:i');
                        metadata.style = 'color:gray';
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return '<div style="white-space:normal;">' + value + '</div>'
                    }
                },
                //预计交收日期
                {
                    text: i18n.getKey('预计交收日期'),
                    dataIndex: 'estimatedDeliveryDate',
                    itemId: 'estimatedDeliveryDate',
                    xtype: 'datecolumn',
                    align: 'center',
                    renderer: function (value, metadata) {
                        if (Ext.isEmpty(value)) {
                            return
                        }
                        value = Ext.Date.format(value, 'Y/m/d H:i');
                        metadata.style = 'color:gray';
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return '<div style="white-space:normal;">' + value + '</div>'
                    }
                },
                {
                    xtype: 'atagcolumn',
                    text: i18n.getKey('bindOrderNumbers'),
                    dataIndex: 'bindOrders',
                    width: 140,
                    getDisplayName: function (value, metadata, record) {
                        var bindOrderId = value[0]['_id'];
                        var orderNumber = value[0].orderNumber ? value[0].orderNumber : '';
                        metadata.tdAttr = 'data-qtip=跳转至业务网站销售信息';
                        return bindOrderId ? '<a href="#" style="text-decoration: none">' + orderNumber + '</a>' : orderNumber;
                    },
                    clickHandler: function (value, metadata, record) {
                        var id = record.get('id');
                        var bindOrderId = value[0]['_id'];
                        var bindOrderNumber = value[0].orderNumber;
                        bindOrderNumber && JSOpenWin();

                        function JSOpenWin() {
                            var orderNumber = value[0].orderNumber ? value[0].orderNumber : '';
                            JSOpen({
                                id: 'orderInfo',
                                url: path + 'partials/ordersign/OrderInfo.html?bindOrderId=' + bindOrderId + '&orderNumber=' + orderNumber + '&id=' + id,
                                title: i18n.getKey('业务网站销售信息') + `(关联订单号:${i18n.getKey(orderNumber)})`,
                                refresh: true
                            })
                        }
                    }
                },
                //关联单号
                {
                    width: 120,
                    text: i18n.getKey('original') + i18n.getKey('orderNumber'),
                    dataIndex: 'originalOrderNumber',
                    itemId: 'originalOrderNumber',
                    sortable: false,
                    renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                        return value;
                    }
                }
            ],

        },
        // 查询输入框
        filterCfg: {
            layout: {
                type: 'table',
                columns: 4
            },
            items: [
                {
                    name: '_id',
                    itemId: 'id',
                    isLike: false,
                    hideTrigger: true,
                    fieldLabel: i18n.getKey('id'),
                    xtype: 'textfield',
                    hidden: JSWebsiteIsStage()
                },
                {
                    name: 'orderNumber',
                    enforceMaxLength: true,
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('orderNumber'),
                    itemId: 'orderNumber',
                    width: 360
                },
                {
                    name: 'bindOrderNumber',
                    enforceMaxLength: true,
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('bindOrderNumbers'),
                    itemId: 'bindOrderNumbers',
                },
                {
                    style: 'margin-right:50px; margin-top : 0px;',
                    name: 'datePurchased',
                    xtype: 'datefield',
                    itemId: 'fromDate',
                    scope: true,
                    fieldLabel: i18n.getKey('datePurchased'),
                    width: 360,
                },
                {
                    style: 'margin-right:50px; margin-top : 0px;',
                    name: 'paidDate',
                    xtype: 'datefield',
                    itemId: 'paidDate',
                    scope: true,
                    fieldLabel: i18n.getKey('付款日期'),
                    width: 360,
                    format: 'Y/m/d'
                },
                {
                    name: 'type',
                    xtype: 'combobox',
                    editable: false,
                    isLike: false,
                    fieldLabel: i18n.getKey('orderType'),
                    itemId: 'orderType',
                    store: new Ext.data.Store({
                        fields: ['title', 'value'],
                        data: [
                            {
                                value: '',
                                title: i18n.getKey('allType')
                            },
                            {
                                value: 'NORMAL',
                                title: '普通订单'
                            },
                            {
                                value: 'PARTNER_SAMPLE',
                                title: 'SAMPLE订单'
                            },
                            {
                                value: 'ONE_DRAGON',
                                title: '一条龙订单'
                            },
                            {
                                value: 'PROOFING',
                                title: '打样订单'
                            }
                        ]
                    }),
                    value: '',
                    displayField: 'title',
                    valueField: 'value'
                },
                {
                    fieldLabel: i18n.getKey('orderStatus'),
                    id: 'statusSearch',
                    name: 'statusId',
                    itemId: 'orderStatus',
                    xtype: 'combo',
                    editable: false,
                    store: Ext.create('CGP.common.store.OrderStatuses', {
                        autoLoad: false
                    }),
                    displayField: 'name',
                    valueField: 'id',
                    titleField: 'tipInfo',
                    listeners: {
                        afterrender: function (combo) {
                            var store = combo.getStore();
                            store.on('load', function () {
                                if (!combo.getValue())
                                    combo.select(store.getAt(0));
                            });
                        }
                    }
                },
                {
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('排版状态'),
                    name: 'paibanStatus',
                    itemId: 'paibanStatus',
                    editable: false,
                    store: {
                        fields: ['id', 'name'],
                        data: [
                            {
                                id: '',
                                name: '所有状态'
                            },
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
                    value: '',
                    displayField: 'name',
                    valueField: 'id',
                    titleField: 'tipInfo',
                },
                {
                    name: 'websiteId',
                    itemId: 'website',
                    id: 'websiteSearch',
                    xtype: 'websitecombo',
                    hidden: true,
                },
                {
                    name: 'partnerId',
                    xtype: 'gridcombo',
                    pageSize: 25,
                    editable: false,
                    haveReset: true,
                    store: partnerStore,
                    displayField: 'name',
                    valueField: 'id',
                    matchFieldWidth: false,
                    fieldLabel: i18n.getKey('partner'),
                    itemId: 'partner',
                    filterCfg: {
                        layout: {
                            type: 'column',
                            columns: 2
                        },
                        fieldDefaults: {
                            labelAlign: 'right',
                            layout: 'anchor',
                            style: 'margin-right:20px; margin : 5px;',
                            labelWidth: 50,
                            width: 250,
                        },
                        items: [
                            {
                                name: 'id',
                                xtype: 'numberfield',
                                fieldLabel: i18n.getKey('id'),
                                allowDecimals: false,
                                hideTrigger: true,
                                itemId: 'id'
                            }, {
                                name: 'name',
                                xtype: 'textfield',
                                itemId: 'name',
                                fieldLabel: i18n.getKey('name')
                            },
                            {
                                name: 'email',
                                xtype: 'textfield',
                                itemId: 'email',
                                fieldLabel: i18n.getKey('email')
                            },
                        ]
                    },
                    gridCfg: {
                        store: partnerStore,
                        height: 300,
                        width: 550,
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
                                text: i18n.getKey('email'),
                                flex: 1,
                                dataIndex: 'email'
                            }
                        ],
                        bbar: {
                            xtype: 'pagingtoolbar',
                            store: partnerStore,
                        }
                    },
                },
                {
                    xtype: 'productgridcombo',
                    name: 'product.id',
                    itemId: 'product',
                    fieldLabel: i18n.getKey('product'),
                    displayField: 'name',
                    valueField: 'id',
                    labelAlign: 'right',
                    productType: null,//SKU
                    editable: false,
                    haveReset: true,
                    gotoConfigHandler: null,
                },
                {
                    name: 'isTest',
                    xtype: 'combobox',
                    editable: false,
                    haveReset: true,
                    fieldLabel: i18n.getKey('isTest'),
                    itemId: 'isTest',
                    store: {
                        xtype: 'store',
                        fields: ['name', {
                            name: 'value',
                            type: 'boolean'
                        }],
                        data: [
                            {
                                value: true,
                                name: i18n.getKey('true')
                            },
                            {
                                value: false,
                                name: i18n.getKey('false')
                            },
                        ]
                    },
                    displayField: 'name',
                    value: JSWebsiteIsTest() || !JSWebsiteIsStage(),
                    valueField: 'value',
                },
                {
                    name: 'customerEmail',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('customerEmail'),
                    itemId: 'customerEmail'
                },
                {
                    xtype: 'booleancombo',
                    editable: false,
                    haveReset: true,
                    fieldLabel: i18n.getKey('订单标识'),
                    name: 'suspectedSanction',
                    itemId: 'suspectedSanction',
                    store: {
                        xtype: 'store',
                        fields: ['name', {
                            name: 'value',
                            type: 'boolean'
                        }],
                        data: [
                            {
                                value: null,
                                name: i18n.getKey('所有')
                            },
                            {
                                value: true,
                                name: i18n.getKey('疑似制裁')
                            },
                        ]
                    },
                    value: null,
                    displayField: 'name',
                    valueField: 'value',
                },
                {
                    xtype: 'combo',
                    editable: true,
                    isLike: false,
                    haveReset: true,
                    fieldLabel: i18n.getKey('sourcePlatform'),
                    name: 'sourcePlatform',
                    itemId: 'sourcePlatform',
                    store: {
                        xtype: 'store',
                        fields: ['name', {
                            name: 'value',
                            type: 'string'
                        }],
                        data: [
                            {
                                value: '',
                                name: i18n.getKey('所有')
                            },
                            {
                                value: 'QPMN',
                                name: i18n.getKey('QPMN')
                            },
                        ]
                    },
                    displayField: 'name',
                    valueField: 'value'
                },
                {
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('走货方式'),
                    name: 'orderDeliveryMethod',
                    itemId: 'orderDeliveryMethod',
                    isLike: false,
                    editable: false,
                    haveReset: true,
                    store: {
                        fields: [
                            {
                                name: 'key',
                                type: 'string'
                            },
                            {
                                name: 'value',
                                type: 'string'
                            }
                        ],
                        data: [
                            {
                                key: '',
                                value: i18n.getKey('所有')
                            },
                            {
                                key: 'ULGS',
                                value: i18n.getKey('统一配送')
                            },
                            {
                                key: 'SELF_SUPPORT',
                                value: i18n.getKey('自营配送')
                            }
                        ]
                    },
                    displayField: 'value',
                    valueField: 'key',
                },
                {
                    xtype: 'textfield',
                    name: 'emailAddress',
                    itemId: 'emailAddress',
                    enforceMaxLength: true,
                    fieldLabel: i18n.getKey('收件人邮箱'),
                },
                {
                    xtype: 'textfield',
                    name: 'customerProperty',
                    itemId: 'customerProperty',
                    enforceMaxLength: true,
                    fieldLabel: i18n.getKey('收件人信息'),
                },
                {
                    xtype: 'textfield',
                    name: 'trackingNo',
                    itemId: 'trackingNo',
                    enforceMaxLength: true,
                    isLike: false,
                    fieldLabel: i18n.getKey('邮递单号'),
                },
                // INITIALIZED,
                // IN_PROGRESS,
                // COMPLETED,
                // FAILED
                {
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('处理状态'),
                    name: 'orderPostPreprocessTaskStatus',
                    itemId: 'orderPostPreprocessTaskStatus',
                    isLike: false,
                    editable: false,
                    haveReset: true,
                    hidden: true,
                    displayField: 'display',
                    valueField: 'value',
                    store: {
                        fields: ['value', 'display'],
                        data: [
                            {
                                display: 'INITIALIZED',
                                value: i18n.getKey('INITIALIZED')
                            },
                            {
                                display: 'IN_PROGRESS',
                                value: i18n.getKey('IN_PROGRESS')
                            },
                            {
                                display: 'COMPLETED',
                                value: i18n.getKey('COMPLETED')
                            },
                            {
                                display: 'FAILED',
                                value: i18n.getKey('FAILED')
                            }
                        ]
                    },
                }
            ]
        }
    });
});
