/**
 * 统一的订单项显示功能
 */
Ext.Loader.syncRequire([
    'CGP.common.commoncomp.QueryGrid'
])
Ext.define('CGP.orderdetails.view.details.OrderLineItem', {
    extend: 'CGP.common.commoncomp.QueryGrid',
    alias: 'widget.detailsorderlineitem',
    mainRenderer: Ext.create('CGP.orderdetails.view.render.OrderLineItemRender'),
    viewConfig: {
        enableTextSelection: true,
    },
    autoScroll: true,
    diySetConfig: Ext.emptyFn,//自定义对已有配置的修改
    store: null,
    pageType: null,
    order: null,//订单信息
    maxHeight: 1000,
    unConfirmItem: null,//记录为确定报关分类的订单项
    isShowClickItem: null,
    /* @cfg 记录跨页选中的记录 */
    selectedRecords: null,
    deleteItemIndex: null,
    selModel: {
        selType: 'checkboxmodel',
        mode: 'MULTI'
    },
    /* plugins: [{
         ptype: 'cross_page_select',
     }],*/
    hiddenTitle: false,
    initComponent: function () {
        var me = this,
            {hiddenTitle, orderId, orderStatusId, order, remark} = me,
            mainRenderer = this.mainRenderer,
            items = [],
            orderNumber = JSGetQueryString('orderNumber'),
            orderItem = mainRenderer.getOrderItemCfgV2({
                grid: me,
                remark: remark,
                orderId: orderId,
                orderStatusId: orderStatusId,
            }, me.pageType, me.isShowClickItem),
            isAuditPending = [110, 101].includes(+orderStatusId); //待审核状态

        mainRenderer.order = order;

        me.gridCfg = {
            store: me.store,
            autoScroll: true,
            editAction: false,
            deleteAction: false,
            showRowNum: false,
            viewConfig: {},
            selModel: me.selModel,
            customPaging: [
                {value: 25},
                {value: 50},
                {value: 75},
                {value: 150},
            ],
            diySetConfig: Ext.emptyFn,//自定义对已有配置的修改
            defaults: {
                sortable: false,
                menuDisabled: true
            },
            tbar: {
                xtype: 'toolbar',
                dock: 'top',
                //style: 'background-color:silver;',
                color: 'black',
                enableOverflow: true,
                bodyStyle: 'border-color:white;',
                itemId: 'infoDisplayToolbar',
                hidden: me.hiddenCustomsCategory,
                items: [
                    {
                        xtype: 'displayfield',
                        fieldLabel: false,
                        itemId: 'infoDisplay',
                        hidden: hiddenTitle,
                        value: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('orderLineItem') + '</font>'
                    },
                    {
                        xtype: 'button',
                        itemId: 'btn',
                        text: JSCreateFont('blue', false, i18n.getKey('批量报关分类'), 12, false, true),
                        hidden: !Ext.Array.contains(['43', '100', '110', '101', '113', '116', '117', '118', '300', '301'], String(orderStatusId)),
                        componentCls: "btnOnlyIcon",
                        handler: function (btn) {
                            var controller = Ext.create('CGP.orderitemsmultipleaddress.controller.Controller'),
                                url = adminPath + `api/orders/${orderId}/lineItems/v2?page=1&limit=10000`;

                            JSAjaxRequest(url, 'GET', true, null, null, function (require, success, response) {
                                if (success) {
                                    var responseText = Ext.JSON.decode(response.responseText);
                                    if (responseText.success) {
                                        var data = responseText?.data?.content || responseText?.data,
                                            orderLineItemStore = Ext.create('CGP.orderlineitemv2.store.OrderLineItemByOrderStore', {
                                                pageSize: 25,
                                                proxy: {
                                                    type: 'pagingmemory'
                                                },
                                                data: data
                                            }),
                                            gridParams = {
                                                order: me.order,
                                                remark: remark,
                                                orderId: orderId,
                                                store: orderLineItemStore,
                                                originStore: me.store,
                                                orderStatusId: orderStatusId,
                                            };

                                        controller.createCustomsCategory(gridParams);
                                    }
                                }
                            }, true);
                        }
                    },
                    {
                        xtype: 'button',
                        itemId: 'auditBtn',
                        componentCls: "btnOnlyIcon",
                        hidden: !orderNumber || !isAuditPending,
                        // hidden: true, //先提交部分　
                        text: JSCreateFont('blue', false, i18n.getKey('批量审批订单项'), 12, false, true),
                        handler: function (btn) {
                            var tools = btn.ownerCt,
                                grid = tools.ownerCt,
                                store = grid.store,
                                proxy = store.proxy,
                                queryUrl = proxy.url,
                                filterComp = proxy.filter,
                                filterParams = filterComp.getQuery(),
                                selectRecords = grid.getSelectionModel().getSelection(),
                                filterSelectRecord = selectRecords.filter(record => {
                                    var statusId = record.get('statusId'); //待审核状态
                                    return [110, 101].includes(+statusId);
                                }),
                                selectIds = filterSelectRecord?.map(record => {
                                    return record.get('_id').toString();
                                }),
                                title = i18n.getKey('审批_订单项'),
                                fieldLabel = i18n.getKey('审批范围'),
                                orderTotalCount = mainRenderer.getAuditStatusOrderTotalCount(queryUrl, filterParams, true);
                            // orderTotalCount = grid.store.totalCount;

                            mainRenderer.createExportExcelWindow(title, fieldLabel, selectIds, orderTotalCount, function (win, selModel) {
                                mainRenderer.createOrderItemAuditFormWindow(null, function (win, data) {
                                    var {customerNotify, comment} = data,
                                        selModelGather = {
                                            all: function () {
                                                var proxy = grid.store.proxy,
                                                    queryUrl = proxy.url,
                                                    filterComp = proxy.filter,
                                                    filterParams = filterComp.getQuery(),
                                                    queryData = mainRenderer.getAuditStatusOrderTotalData(queryUrl, filterParams),
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

                                                    mainRenderer.createAuditErrorTextWindow(errorTexts, function (win, formData) {
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
                    {
                        xtype: 'button',
                        itemId: 'auditContentBtn',
                        componentCls: "btnOnlyIcon",
                        // hidden: !orderNumber || !isAuditPending,
                        // hidden: true, //先提交部分　,
                        // hidden: !isAuditPending,
                        text: JSCreateFont('blue', false, i18n.getKey('批量审批内容'), 12, false, true),
                        handler: function (btn) {
                            JSOpen({
                                id: 'orderitemauditcontent',
                                url: path + "partials/orderitemsmultipleaddress/auditContentPage.html" +
                                    "?id=" + orderId +
                                    "&status=" + orderStatusId +
                                    "&orderNumber=" + orderNumber,
                                title: i18n.getKey(`批量审批订单项内容 (${orderId})`),
                                refresh: true
                            })
                        }
                    },
                    {
                        xtype: 'button',
                        itemId: 'exportBtn',
                        text: i18n.getKey('导出订单项'),
                        iconCls: 'icon_import',
                        // hidden: true, //先提交部分　
                        handler: function (btn) {
                            var tools = btn.ownerCt,
                                grid = tools.ownerCt,
                                url = adminPath + 'api/orderItems/exportExcel',
                                selectRecords = grid.getSelectionModel().getSelection(),
                                title = i18n.getKey('导出_订单项Excel'),
                                fieldLabel = i18n.getKey('导出范围'),
                                storeUrl = grid.store.proxy.url,
                                gridFilterData = grid.filter.getQuery(),
                                selectIds = selectRecords?.map(record => record.get('_id')),
                                orderTotalCount = grid.store.totalCount;

                            mainRenderer.createExportExcelWindow(title, fieldLabel, selectIds, orderTotalCount, function (win, selModel) {
                                var selModelGather = {
                                        all: function () {
                                            var storeAllData = JSGetQueryAllData(storeUrl, gridFilterData),
                                                storeAllDataId = storeAllData?.map(item => item['_id']),
                                                result = [
                                                    {
                                                        "name": "includeIds",
                                                        "type": "string",
                                                        "value": `[${storeAllDataId}]`
                                                    }
                                                ];

                                            return JSON.stringify(result);
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

                                mainRenderer.downloadOriginalFn(url, filterArray, grid, function () {
                                    win.close();
                                });
                            });
                        }
                    },
                ]
            },
            columns: [
                orderItem.get('0'),
                orderItem.get('2'),
                orderItem.get('3'),
                orderItem.get('5'),
                orderItem.get('6'),
                orderItem.get('7'),
                orderItem.get('11'),
                orderItem.get('8'),
                orderItem.get('9'),
                orderItem.get('10'),
                orderItem.get('12'),
            ],
        }

        me.filterCfg = {
            header: false,
            minHeight: 45,
            bodyStyle: 'border: 1px solid #c0c0c0;',
            border: '1 1 0 1',
            layout: {
                type: 'column',
                columns: 2
            },
            defaults: {
                margin: '10 10 5 10'
            },
            items: [
                {
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('订单项编号'),
                    name: '_id',
                    itemId: '_id',
                    isLike: false,
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
                    enforceMaxLength: true,
                    valueType: 'string',
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
                    enforceMaxLength: true,
                    valueType: 'string',
                    labelWidth: 140,
                    width: 300,
                    tipInfo: '该字段可通过(,)实现多数据查询,例如: 327486849,327486852',
                    fieldLabel: i18n.getKey('productInstanceId'),
                },
            ],
        }

        mainRenderer.order = order;

        me.diySetConfig();
        me.callParent(arguments);
        me.collectCustomInfo();
    },
    /**
     * 收集报关信息
     */
    collectCustomInfo: function () {
        var me = this;
        me.unConfirmItem = Ext.create('Ext.util.MixedCollection');
        doSomeThing = function (records) {
            me.unConfirmItem.removeAll();
            records.map(function (record) {
                var isCustomsClearance = record.get('isCustomsClearance');
                var customsCategoryId = record.get('customsCategoryId');
                if (isCustomsClearance == true && Ext.isEmpty(customsCategoryId)) {
                    me.unConfirmItem.add(record.get('seqNo'), record);
                }
            });
        }
        me.store.on('load', function (store, records) {
            doSomeThing(records);
        });
        me.store.on('datachanged', function (store) {
            var records = store.data.items;
            doSomeThing(records);
        });
    },
})

