Ext.Loader.setConfig({
    paths: {
        // 'CGP.order': path + 'js/order',
        'Ext.ux.grid.plugin': path + 'ClientLibs/extjs/ux/grid/plugin',
    },
    disableCaching: false
});
Ext.Loader.setPath({
    enabled: true,
    "CGP.orderdetails": path + "partials/order/details/app"
});
/*Ext.syncRequire(['CGP.order.view.Table','CGP.order.view.RowExpander']);*/
Ext.Loader.syncRequire([
    'CGP.partner.store.PartnerStore',
    'CGP.product.model.Product',
    'CGP.product.store.ProductStore',
    'CGP.common.field.WebsiteCombo',
    'CGP.order.view.order.CreateWindow',
    'CGP.common.typesettingschedule.TypeSettingGrid',
    'CGP.orderitemsmultipleaddress.view.singleAddress.tool.operationBtn',
    'CGP.common.field.ProductGridCombo',
    'CGP.partner.view.CreateFilterUserAuthInfoComp'
]);
Ext.onReady(function () {
    var backgroundColor = '#87CEFF',
        controller = Ext.create('CGP.order.controller.Order'),
        partnerStore = Ext.create('CGP.order.store.PartnerStore', {
            autoLoad: false
        }),
        permissions = Ext.create('CGP.order.controller.Permission');

    window.controller = controller;
    window.permissions = permissions;
    top.window.permissions = permissions;

    var checkCostInfoPermission = permissions.buttons.checkCostInfo,
        multiplesort = Ext.create('Ext.ux.grid.plugin.MultipleSort', {
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
        }),
        mainRenderer = Ext.create('CGP.orderdetails.view.render.OrderLineItemRender'),
        store = Ext.create('CGP.orderv2.store.OrderListStore'),
        gridColumns = [
            //操作按钮
            {
                sortable: false,
                text: i18n.getKey('operation'),
                width: 100,
                autoSizeColumn: false,
                xtype: 'componentcolumn',
                renderer: function (value, metadata, record, row, col, store) {
                    return {
                        xtype: 'operationBtn',
                        record: record,
                        page: page,
                        isMain: false,
                        margin: '0 0 0 10',
                        itemId: 'operation',
                        permissions: permissions,
                        ui: 'default-toolbar-small',
                        text: i18n.getKey('options'),
                    }
                }
            },
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
                    var template = '<a style="text-decoration: none;" href="#">' + value + '</a>' + isTest;
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
                clickHandler: function (value, metadata, record) {
                    var statusId = record.get('statusId');
                    window.showOrderDetail(record.get('id'), value, statusId);
                }
            },//备注
            {
                text: i18n.getKey('remark'),
                dataIndex: 'remark',
                itemId: 'remark',
                width: 160,
                renderer: function (value, metadata) {
                    metadata.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                }
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
            //实付金额 线下付款用 modifiedAmountStr字段，线上付款用totalPriceString字段
            {
                text: i18n.getKey('实付金额'),
                dataIndex: 'modifiedAmountStr',
                itemId: 'modifiedAmountStr',
                renderer: function (value, metadata, record) {
                    metadata.style = 'color:blue';

                    return value;
                }
            }, {
                text: i18n.getKey('实付货币'),
                dataIndex: 'modifiedCurrency',
                itemId: 'modifiedCurrency',
                width: 80,
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
                        resultName = statusName + extraText;

                    return resultName;
                },
                clickHandler: function (value, metadata, record) {
                    var id = record.get('id'),
                        orderNumber = record.get('orderNumber'),
                        statusId = value.id,
                        store = Ext.create('CGP.common.typesettingschedule.store.LastTypesettingScheduleStore', {
                            params: {
                                filter: '[{"name":"orderNumber","value":"' + orderNumber + '","type":"string"}]',
                            }
                        });

                    Ext.create('CGP.common.typesettingschedule.TypeSettingGrid', {
                        record: record,
                        orderId: id,
                        gridStore: store,
                        statusId: statusId,
                        orderNumber: orderNumber,
                    }).show();
                }
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
                        atagcolumn = [40, 100, 117, 300, 116, 113, 44, 118, 110, 101, 42, 37681428, 9358697, 120].includes(Number(status)) ? '<a href="#">修改</a>' : '',
                        statusGather = {
                            ULGS: '统一配送',
                            SELF_SUPPORT: '自营配送'
                        };

                    return `${statusGather[value || 'SELF_SUPPORT']} ${atagcolumn}`;
                },
                clickHandler: function (value, metadata, record, rowIndex, colIndex, store, view) {
                    const id = record.get('id'),
                        win = Ext.create('Ext.window.Window', {
                            layout: 'fit',
                            modal: true,
                            constrain: true,
                            title: i18n.getKey('修改走货方式'),
                            items: [
                                {
                                    xtype: 'errorstrickform',
                                    layout: 'vbox',
                                    itemId: 'form',
                                    items: [
                                        {
                                            xtype: 'combo',
                                            editable: false,
                                            allowBlank: false,
                                            margin: '10 25 10 25',
                                            fieldLabel: i18n.getKey('走货方式'),
                                            name: 'orderDeliveryMethod',
                                            itemId: 'orderDeliveryMethod',
                                            value: value,
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
                                            valueField: 'key'
                                        }
                                    ]
                                }
                            ],
                            bbar: {
                                xtype: 'bottomtoolbar',
                                saveBtnCfg: {
                                    handler: function (btn) {
                                        var win = btn.ownerCt.ownerCt,
                                            form = win.getComponent('form'),
                                            value = form.getValues();

                                        if (form.isValid()) {
                                            const url = adminPath + 'api/orders/' + id + '/shipment';

                                            controller.asyncEditQuery(url, value, true, function (require, success, response) {
                                                if (success) {
                                                    var responseText = Ext.JSON.decode(response.responseText);
                                                    if (responseText.success) {
                                                        win.close();
                                                        store.load();
                                                    }
                                                }
                                            })
                                        }
                                    }
                                }
                            },
                        });
                    win.show();

                }
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
        page = Ext.create('Ext.ux.ui.GridPage', {
            i18nblock: i18n.getKey('order'),
            block: 'order',
            gridCfg: {
                dockedItems: [multiplesort],
                customPaging: [
                    {value: 20},
                    {value: 50},
                    {value: 75}
                ],
                selModel: Ext.create("Ext.selection.CheckboxModel", {
                    checkOnly: true,
                }),
                store: store,
                showRowNum: false,
                remoteCfg: false,
                frame: false,
                editAction: false,
                deleteAction: false,
                autoHeight: true,
                bodyStyle: 'width:100%',
                autoWidth: true,
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
                columnDefaults: {
                    autoSizeColumn: true,
                    tdCls: 'vertical-middle'
                },
                columns: gridColumns
            },
            filterCfg: {
                layout: {
                    type: 'table',
                    columns: 4
                },
                defaults: {
                    width: 350
                },
                minHeight: 150,
                items: [
                    {
                        xtype: 'hiddenfield',
                        name: 'paymentModuleCode',
                        isLike: false,
                        disabled: true,
                        itemId: 'paymentModuleCode',
                        value: JSGetQueryString('paymentModuleCode')
                    },
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
                        listeners: {
                            render: function (comp) {
                                var orderNumber = JSGetQueryString('orderNumber');
                                if (orderNumber) {
                                    comp.setValue(orderNumber);
                                }
                            }
                        },
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
                        listeners: {
                            render: function (comp) {
                                var bindOrderNumber = JSGetQueryString('bindOrderNumber');
                                if (bindOrderNumber) {
                                    comp.setValue(bindOrderNumber);
                                }
                            }
                        },
                    },
                    {
                        id: 'datePurchasedSearch',
                        style: 'margin-right:50px; margin-top : 0px;',
                        name: 'datePurchased',
                        xtype: 'datefield',
                        itemId: 'fromDate',
                        scope: true,
                        fieldLabel: i18n.getKey('datePurchased'),
                        width: 360,
//                    itemXType: 'datefield',
                        format: 'Y/m/d'
                        //                    scope: true,
                        //                    width: 218
                    },
                    {
                        id: 'paidDate',
                        style: 'margin-right:50px; margin-top : 0px;',
                        name: 'paidDate',
                        xtype: 'datefield',
                        itemId: 'paidDate',
                        scope: true,
                        fieldLabel: i18n.getKey('付款日期'),
                        width: 360,
//                    itemXType: 'datefield',
                        format: 'Y/m/d'
                        //                    scope: true,
                        //                    width: 218
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
                        xtype: 'combobox',
                        fieldLabel: i18n.getKey('orderStatus'),
                        id: 'statusSearch',
                        name: 'statusId',
                        itemId: 'orderStatus',
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
                                },
                                {
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
                        store: new Ext.data.Store({
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
                        }),
                        displayField: 'name',
                        value: JSWebsiteIsTest() || !JSWebsiteIsStage(),
                        valueField: 'value',
                    },
                    /* {
                         name: 'isRedo',
                         xtype: 'combobox',
                         editable: false,
                         haveReset: true,
                         hidden: !Ext.isEmpty(JSGetQueryString('statusId')),
                         fieldLabel: i18n.getKey('redo') + i18n.getKey('order'),
                         itemId: 'isRedo',
                         value: (Ext.Array.contains(['103', '104', '105', '106', '107'], JSGetQueryString('statusId')) ? !Ext.isEmpty(JSGetQueryString('isRedo')) : ''),
                         store: new Ext.data.Store({
                             fields: ['name', {
                                 name: 'value',
                                 type: 'boolean'
                             }],
                             data: [
                                 {
                                     value: true,
                                     name: '是'
                                 },
                                 {
                                     value: false,
                                     name: '否'
                                 },
                             ]
                         }),
                         displayField: 'name',
                         valueField: 'value'
                     },*/
                    /* {
                         xtype: 'booleancombo',
                         name: 'isOutboundOrder',
                         itemId: 'isOutboundOrder',
                         haveReset: true,
                         fieldLabel: i18n.getKey('是否包含外派生产产品')
                     },*/
                    {
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('userAccount'),
                        itemId: 'userName',
                        name: 'userName',
                        labelWidth:　130
                    },
                    {
                        xtype: 'booleancombo',
                        editable: false,
                        haveReset: true,
                        fieldLabel: i18n.getKey('订单标识'),
                        name: 'suspectedSanction',
                        itemId: 'suspectedSanction',
                        store: new Ext.data.Store({
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
                        }),
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
                        store: new Ext.data.Store({
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
                        }),
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
                    {
                        //默认选邮箱
                        xtype: 'user_auth_info',
                        isFilterComp: true,
                        layout: 'hbox',
                        itemId: 'userAuthInfos',
                        width: 450,
                    },
                ]
            },
            selectedRecordsCfg: {
                winConfig: {
                    bbar: {
                        xtype: 'bottomtoolbar',
                        lastStepBtnCfg: {
                            itemId: 'lastStepBtn',
                            iconCls: 'icon_export',
                            text: '导出Excel',
                            hidden: false,
                            menu: [
                                {
                                    text: i18n.getKey('订单导出'),
                                    handler: function (btn) {
                                        var lastStepBtn = btn.up('button[itemId=lastStepBtn]'),
                                            winGrid = lastStepBtn.ownerCt.ownerCt.getComponent('grid'),
                                            grid = page.getComponent('grid'),
                                            tools = grid.getDockedItems('toolbar[dock="top"]')[1],
                                            btnExport = tools.getComponent('btnExport');

                                        controller.getOrderExportTaskStatusInfo('common', checkCostInfoPermission, function () {
                                            controller.createSelectedExportExcelFn(winGrid, btnExport, 'common', checkCostInfoPermission);
                                        });
                                    }
                                },
                                {
                                    text: i18n.getKey('订单导出(带产品信息)'),
                                    handler: function (btn) {
                                        var lastStepBtn = btn.up('button[itemId=lastStepBtn]'),
                                            winGrid = lastStepBtn.ownerCt.ownerCt.getComponent('grid'),
                                            grid = page.getComponent('grid'),
                                            tools = grid.getDockedItems('toolbar[dock="top"]')[1],
                                            btnExport = tools.getComponent('btnExport');

                                        controller.getOrderExportTaskStatusInfo('productInfo', checkCostInfoPermission, function () {
                                            controller.createSelectedExportExcelFn(winGrid, btnExport, 'productInfo', checkCostInfoPermission);
                                        });
                                    }
                                }
                            ],
                            handler: function (btn) {
                            }
                        },
                        saveBtnCfg: {
                            itemId: 'saveBtn',
                            handler: function (btn) {
                                const win = btn.ownerCt.ownerCt,
                                    me = win.context,
                                    winGrid = win.getComponent('grid'),
                                    selectData = [],
                                    getSelection = winGrid.getSelectionModel().getSelection();

                                //有selectedRecord的情况
                                me.grid.selectedRecords?.clear();
                                me.grid.getSelectionModel().deselectAll();
                                getSelection.forEach(item => {
                                    selectData.push(item);
                                    me.grid.selectedRecords?.add(item.getId(), item);
                                })
                                me.grid.getSelectionModel().select(selectData);
                                win.close();
                            }
                        }
                    }
                },
            },
            tbarCfg: {
                hiddenButtons: ['create', 'delete'],
                filterColumnsText: ['operation'],
                btnExport: {
                    xtype: 'button',
                    disabled: false,
                    width: 140,
                    itemId: 'btnExport',
                    text: i18n.getKey('导出Excel文件'),
                    menu: {
                        items: [
                            {
                                text: i18n.getKey('订单导出'),
                                handler: function (btn) {
                                    var btnExport = btn.up('button[itemId=btnExport]'),
                                        selectedIds = btnExport.getSelectedIds(),
                                        filterInfo = btnExport.getFilterInfo(),
                                        orderFilterTotalCount = store.totalCount;

                                    // orderFilterTotalCount = controller.getOrderFilterTotalCount(filterInfo);

                                    controller.getOrderExportTaskStatusInfo('common', checkCostInfoPermission, function () {
                                        controller.createExportExcelFn(btnExport, selectedIds, orderFilterTotalCount, 'common', checkCostInfoPermission);
                                    });
                                }
                            },
                            {
                                text: i18n.getKey('订单导出(带产品信息)'),
                                handler: function (btn) {
                                    var btnExport = btn.up('button[itemId=btnExport]'),
                                        selectedIds = btnExport.getSelectedIds(),
                                        filterInfo = btnExport.getFilterInfo(),
                                        orderFilterTotalCount = controller.getOrderFilterTotalCount(filterInfo);

                                    controller.getOrderExportTaskStatusInfo('productInfo', checkCostInfoPermission, function () {
                                        controller.createExportExcelFn(btnExport, selectedIds, orderFilterTotalCount, 'productInfo', checkCostInfoPermission);
                                    });
                                }
                            },
                        ]
                    },
                    // 导出文件方法
                    originalFn: function (url, filterArray, code) {
                        var me = this,
                            page = me.ownerCt.ownerCt.ownerCt,
                            authorization = 'access_token=' + Ext.util.Cookies.get('token'),
                            store = page.grid.getStore(),
                            property = store.sorters.items[0].property,
                            direction = store.sorters.items[0].direction,
                            sort = {"property": property, "direction": direction},
                            sorters = Ext.JSON.encode([sort]),
                            x = new XMLHttpRequest(),
                            filterString = {
                                filter: filterArray,
                                sort: sorters
                            }

                        JSShowNotification({
                            type: 'info',
                            title: '导出发起成功 请耐心等待!',
                        });
                        me.pullingStyle(true);
                        x.open("POST", url, true);
                        x.setRequestHeader('Content-Type', 'application/json');
                        x.setRequestHeader('Access-Control-Allow-Origin', '*');
                        x.setRequestHeader('Authorization', 'Bearer ' + Ext.util.Cookies.get('token'));
                        x.responseType = 'blob'; // 设置响应类型为 blob

                        x.onload = function (e) {
                            me.pullingStyle(false); // 结束加载样式

                            const contentType = x.getResponseHeader("Content-Type");

                            // 检查响应的内容类型
                            if (x.status === 200) {
                                if (contentType === 'application/json') {
                                    // 处理 JSON 响应
                                    const reader = new FileReader();
                                    reader.onload = function (event) {
                                        var jsonResponse = JSON.parse(event.target.result),
                                            {isSuccess, count, message} = jsonResponse.data,
                                            userInfo = controller.getCookieUser(),
                                            {email} = userInfo;


                                        if (!isSuccess) {
                                            if (count >= 5000) { //超过5000禁止导出
                                                Ext.Msg.alert('提示', '导出数据记录超过5000条,请联系后台工作人员帮助导出! (邮箱: dickwong@qpp.com)');

                                            } else if (count >= 1000) {
                                                var data = { //超过1000邮件导出
                                                    prompt: '导出数据记录超过1000条,系统将采用异步导出文件到您的邮箱!',
                                                    email: email,
                                                    remark: '',
                                                }
                                                controller.createExportPromptWindow(data, function (formData) {
                                                    var {email, remark} = formData,
                                                        result = {
                                                            isSendEmail: true,
                                                            email: email,
                                                            remark: remark,
                                                            dataExportDTO: filterString
                                                        }

                                                    controller.queryExportExcelEmail(result, code);
                                                });

                                            } else {
                                                Ext.Msg.alert('导出请求报错', message);
                                            }
                                        } else {
                                            Ext.Msg.alert('提示', '未获取到文件流!');
                                        }

                                    };
                                    reader.readAsText(x.response); // 读取响应为文本
                                } else {
                                    // 处理文件流响应
                                    const blob = new Blob([x.response], {type: contentType});
                                    const url = window.URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = 'sale_orders.xls'; // 修改文件名为合适的格式
                                    a.click();

                                    JSShowNotification({
                                        type: 'success',
                                        title: '导出成功!',
                                    });
                                }
                            } else {
                                JSShowNotification({
                                    type: 'error',
                                    title: '网络请求错误: ' + x.statusText,
                                });
                            }
                        };

                        x.onerror = function () {
                            me.pullingStyle(false);
                            JSShowNotification({
                                type: 'error',
                                title: '请求失败，请检查网络连接!',
                            });
                        };

                        x.send(Ext.encode({
                            filter: filterArray,
                            sort: sorters
                        }));
                    },
                    // 改变样式
                    pullingStyle: function (isVisiblePull) {
                        // 请求数据拉取状态
                        const comp = this,
                            tools = comp.ownerCt,
                            exportInfoComp = tools.getComponent('exportInfo');

                        comp.setVisible(!isVisiblePull);
                        exportInfoComp.setVisible(isVisiblePull);
                        exportInfoComp.isVisiblePull = isVisiblePull;
                    },
                    // 获取过滤栏数据
                    getFilterInfo: function () {
                        var me = this,
                            page = me.ownerCt.ownerCt.ownerCt,
                            filter = page.getComponent('filter');

                        return filter.getQuery();
                    },
                    // 获取选中行id
                    getSelectedIds: function () {
                        var me = this,
                            grid = me.ownerCt.ownerCt,
                            selected = grid.selectedRecords.items,
                            result = [];

                        selected.forEach(item => {
                            result.push(item.data._id);
                        })
                        return result;
                    },
                },
                btnImport: {
                    disabled: false,
                    width: 120,
                    itemId: 'auditOrderBtn',
                    text: i18n.getKey('批量审批订单'),
                    iconCls: 'icon_audit',
                    // hidden: true, //先提交部分　
                    //  批量审批请求
                    batchAuditQuery: function (orderInfos, selModel, store) {
                        mainRenderer.createOrderItemAuditFormWindow(null, function (win, data) {
                            var {comment} = data,
                                selModelGather = {
                                    all: function () {
                                        var proxy = store.proxy,
                                            queryUrl = proxy.url,
                                            filterComp = proxy.filter,
                                            filterParams = filterComp.getQuery(),
                                            auditStatusOrderTotalData = mainRenderer.getAuditStatusOrderTotalData(queryUrl, filterParams),
                                            newOrderInfos = auditStatusOrderTotalData?.map(item => {
                                                return {
                                                    "orderId": item._id,
                                                    "statusId": "102"  //已审核_待排版
                                                };
                                            });

                                        return {
                                            "orderInfos": newOrderInfos,
                                            "comment": comment,
                                            "actionKey": "Order_Review_Pass", //审核通过的key
                                        }
                                    },
                                    selected: function () {

                                        return {
                                            "orderInfos": orderInfos,
                                            "comment": comment,
                                            "actionKey": "Order_Review_Pass", //审核通过的key
                                        }
                                    }
                                },
                                url = adminPath + `api/orders/batch/stateInstances`,
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
                                            var newData =  mainRenderer.getMergeKeysByValue(data),
                                                auditIds = Object.keys(newData),
                                                idText = i18n.getKey('订单号'),
                                                errorTexts = []

                                            auditIds.forEach(item => {
                                                var auditValue = newData[item],
                                                    isIncludeCode = ['13100102', '13100001', '500024', '108000358', '108000359', '108000360'].includes(auditValue),
                                                    auditValueTextGather = {
                                                        '108000358': `随机状态未完成<br>`,
                                                        '108000359': `报关分类未完备<br>`,
                                                        '108000360': `关联的订单未完成后续数据处理<br>`,
                                                        '13100102': `报关分类未审批<br>`,
                                                        '13100001': `传参错误<br>`,
                                                        '500024': `订单不存在<br>`,
                                                        'default': auditValue,
                                                    },
                                                    auditCode = isIncludeCode ? auditValue: 'default',
                                                    auditValueText = auditValueTextGather[auditCode],
                                                    errorText = `以下订单(${idText}) ${JSCreateFont('green', true, item)} 存在问题:<br>`;

                                                errorTexts.push(`${errorText} ${auditValueText}`);
                                            });

                                            mainRenderer.createAuditErrorTextWindow(errorTexts, function (win, formData) {
                                                win.close();
                                            });
                                        }
                                        store.load();
                                    }
                                }
                            }, true)
                        }, true);
                    },
                    handler: function (btn) {
                        var grid = btn.ownerCt.ownerCt,
                            selectRecords = grid.getSelectionModel().getSelection(),
                            store = grid.store,
                            proxy = store.proxy,
                            queryUrl = proxy.url,
                            filterComp = proxy.filter,
                            filterParams = filterComp.getQuery(),
                            filterSelectRecord = selectRecords.filter(record => {
                                var statusId = record.get('statusId'); //待审核状态
                                return [110, 101].includes(+statusId);
                            }),
                            selectIds = filterSelectRecord?.map(record => {
                                return record.get('_id');
                            }),
                            // orderTotalCount = store.totalCount,
                            orderTotalCount = mainRenderer.getAuditStatusOrderTotalCount(queryUrl, filterParams),
                            title = i18n.getKey('批量审批订单'),
                            fieldLabel = i18n.getKey('审批范围'),
                            orderInfos = selectIds?.map(id => {
                                return {
                                    "orderId": id,
                                    "statusId": "102"  //已审核_待排版
                                };
                            });


                        mainRenderer.createExportExcelWindow(title, fieldLabel, selectIds, orderTotalCount, function (win, selModel) {
                            if ((orderTotalCount > 50) && (selModel === 'all')) {
                                Ext.Msg.confirm('提示', '将审批的订单已超过50条,是否继续审核?', function (selector) {
                                    if (selector === 'yes') {
                                        btn.batchAuditQuery(orderInfos, selModel, store);
                                        win.close();
                                    }
                                });
                            } else {
                                btn.batchAuditQuery(orderInfos, selModel, store);
                                win.close();
                            }
                        });
                    },
                },
                btnConfig: {
                    xtype: 'fieldcontainer',
                    itemId: 'exportInfo',
                    text: '',
                    hidden: true,
                    isVisiblePull: null,
                    disabled: false,
                    width: 160,
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'progressbar',
                            width: 160,
                            animate: true,
                            itemId: 'progressBar',
                            listeners: {
                                afterrender: function (progressBar) {
                                    progressBar.wait({
                                        interval: 100, // 滚动间隔时间，单位为毫秒
                                        increment: 30, // 每次滚动的增量
                                        text: JSCreateFont('green', true, '等待中...'), // 进度条显示的文本
                                        scope: this,
                                        fn: function () {
                                            // 当进度条滚动完成时，重新开始滚动
                                            progressBar.updateProgress(0);
                                            progressBar.wait({
                                                interval: 100,
                                                increment: 30,
                                                text: '拉取中...',
                                                scope: this,
                                                fn: arguments.callee // 递归调用自身，实现循环滚动
                                            });
                                        }
                                    });
                                }
                            }
                        },
                        {
                            xtype: 'atag_displayfield',
                            margin: '0 0 0 8',
                            itemId: 'checkInfoBtn',
                            value: i18n.getKey('查看'),
                            tooltip: '查看_导出信息',
                            queryData: null,
                            hidden: true,
                            exportRunningFn: function (btn, queryData) {
                                const tools = btn.ownerCt.ownerCt,
                                    btnExportComp = tools.getComponent('btnExport');

                                btn.queryData = queryData;
                                btnExportComp.pullingStyle(true);
                            },
                            exportFinishedFn: function (btn, msg) {
                                msg && Ext.Msg.alert('提示', msg);
                            },
                            clickHandler: function (field) {
                                controller.checkOrderExportTaskInfo(field.queryData);
                            },
                        }
                    ],
                },
                btnHelp: {
                    disabled: false,
                    width: 120,
                    text: '查看订单流程图',
                    imageDisplayField: null,
                    handler: function (btn) {
                        //按钮点击查看图片
                        var event = new MouseEvent('click', {button: 1, view: window, bubbles: true, cancelable: true});
                        btn.imageDisplayField.el.dom.childNodes[0].dispatchEvent(event);
                    },
                    listeners: {
                        afterrender: function () {
                            this.imageDisplayField = Ext.widget('imagedisplayfield', {
                                xtype: 'imagedisplayfield',
                                src: imageServer + 'f4c2637e7055fd28cae6ced1d769c755.jpg',
                                autoEl: 'div',
                                height: 50,
                                width: 50,
                                style: 'cursor: pointer',
                                floating: true,
                                title: i18n.getKey('check') + i18n.getKey('图片')
                            });
                            this.imageDisplayField.showAt(-500, -500);
                        }
                    }
                }
            },
            timeOut: null,
            listeners: {
                afterrender: function (p) {
                    p.el.on('keydown', function (event, target) {
                        p.filter.getComponent('orderNumber').on('change', function (comp, newValue, oldValue) {
                            //如果订单号是20 97开头，就只保留12位
                            if (/^((20)|(97)).+/.test(newValue)) {
                                newValue = newValue.substr(0, 12);
                                comp.setValue(newValue);
                            }
                            clearTimeout(p.timeOut);
                            ![7, 12].includes(event.button) && (p.timeOut = setTimeout(() => {
                                p.grid.getStore().loadPage(1)
                                // p.el.removeAllListeners()
                            }, 1000));
                        });
                    }, p);
                    controller.afterPageLoad(p, gridColumns);
                }
            }
        });

    //全局的刷新方法
    window.refreshGrid = function () {
        page.grid.store.reload();
    };
    /*    window.showReprintDetail = function (id) {

            JSOpen({
                id: 'orderreprint',
                url: path + 'partials/order/reprint/reprint.html?id=' + id,
                refresh: true,
                title: i18n.getKey('orderReprint')
            })

        };*/
    window.showRedoDetail = function (id) {
        JSOpen({
            id: 'orderredo',
            url: path + 'partials/order/redo/redo.html?id=' + id,
            refresh: true,
            title: i18n.getKey('orderRedo')
        })

    };
    window.showWindow = function (objectJSON) {
        var window = Ext.create('CGP.order.view.checkExtraParamsWindow.CheckExtraParamsWindow', {
            objectJSON: objectJSON
        });
        window.show();
    };
    window.showOrderDetail = function (id, orderNumber, status) {

        var status = status;
        JSOpen({
            id: 'orderDetails',
            url: path + 'partials/orderitemsmultipleaddress/main.html?id=' + id + '&status=' + status + '&orderNumber=' + orderNumber,
            title: i18n.getKey('orderDetails') + '(' + i18n.getKey('orderNumber') + ':' + orderNumber + ')',
            refresh: true
        });
    }
});
