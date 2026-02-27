/**
 * @author xiu
 * @date 2023/9/1
 */
Ext.define('CGP.orderstatusmodify.view.DeliverItem', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.deliverItem',
    layout: {
        type: 'fit',
        align: 'center',
        pack: 'center',
    },
    border: 1,
    width: 1000,
    height: 385,
    getName: function () {
        return this.name;
    },
    getValue: Ext.emptyFn,
    setValue: Ext.emptyFn,
    isShowSanctionText: function (isShow) {
        const me = this,
            grid = me.getComponent('grid'),
            column = grid?.columns[1],
            column1 = grid?.columns[2],
            column2 = grid?.columns[3]; // 获取第二列

        column?.setVisible(isShow);
        column1?.setVisible(!isShow);
        column2?.setVisible(isShow);
    },
    pageType: null, //orderStatusModify(生产详细页) || orderItemsMultipleAddress(订单详情页)
    orderDeliveryMethod: null,
    initComponent: function () {
        var me = this,
            // 是否是多地址 isMultiAddressDelivery
            // 是否隐藏制裁信息 hiddenSanction
            {
                orderId,
                userName,
                isMultiAddressDelivery,
                statusId,
                orderDeliveryMethod,
                remark,
                hiddenSanction,
                pageType
            } = me,
            controller = Ext.create('CGP.orderstatusmodify.controller.Controller'),
            store = Ext.create('Ext.data.Store', {
                fields: [
                    {
                        name: 'id',
                        type: 'string',
                        convert: function (value, record) {
                            var shipmentRequirement = record.get('shipmentRequirement');
                            return shipmentRequirement.id;
                        },
                    },
                    {
                        name: 'shipmentRequirement',
                        type: 'object'
                    },
                    {
                        name: 'orderItemNum',
                        type: 'number'
                    },
                    {
                        name: 'shipmentOrder',
                        type: 'object'
                    },
                    {
                        name: 'shipmentOrders',
                        type: 'array'
                    },
                    {
                        name: 'deliveryAddress',
                        type: 'object'
                    },
                    {
                        name: 'billingAddress',
                        type: 'object'
                    },
                    {
                        name: 'singleAddressDeliveryDetails',
                        type: 'array'
                    },
                    {
                        name: 'shipmentOrders',
                        type: 'array'
                    },
                    {
                        name: 'isCanUpdateManufactureCenter',
                        type: 'boolean'
                    },
                    {
                        name: 'sanctionText',
                        type: 'string',
                        convert: function (value, record) {
                            var showText = '',
                                singleAddressDeliveryDetails = record.get('singleAddressDeliveryDetails');

                            singleAddressDeliveryDetails?.forEach(item => {
                                const {addressFlag, supplier, sanctionCheckResult} = item;

                                if (sanctionCheckResult) {
                                    var {hits, count} = sanctionCheckResult,
                                        supplierTypeGather = {
                                            QPSON: function () {
                                                if (hits?.length) {
                                                    showText = JSCreateFont('red', true, '!', 25) + ' ' +
                                                        JSCreateFont('red', true, ' 疑似制裁')
                                                }
                                            },
                                            COMPLYADVANTAGE: function () {
                                                if (hits?.length) {
                                                    showText = JSCreateFont('red', true, '!', 25) + ' ' +
                                                        JSCreateFont('red', true, ' 疑似制裁')
                                                }
                                            },
                                            SANCTIONSIO: function () {
                                                if (count) {
                                                    showText = JSCreateFont('red', true, '!', 25) + ' ' +
                                                        JSCreateFont('red', true, ' 疑似制裁')
                                                }
                                            },
                                        };

                                    supplierTypeGather[supplier || 'QPSON']();
                                }
                            })

                            return showText;
                        }
                    },
                    {
                        name: 'baseCustomsAmount',
                        type: 'string',
                        convert: function (value, record) {
                            var result = '',
                                shipmentOrder = record.get('shipmentOrder');
                            if (shipmentOrder) {
                                result = shipmentOrder['baseCustomsAmount'];
                            }
                            return result;
                        }
                    },
                    {
                        name: 'isCanAudit',
                        type: 'boolean'
                    },
                    {
                        name: 'itemSeqNos',
                        type: 'array',
                        convert: function (value, record) {
                            var shipmentRequirement = record.get('shipmentRequirement'),
                                itemSeqNos = shipmentRequirement?.itemSeqNos;

                            return itemSeqNos;
                        }
                    }
                ],
                remoteSort: true,
                autoLoad: true,
                pageSize: 25,
                sorters: [{
                    property: 'shipmentRequirement.id',
                    direction: 'DESC'
                }],
                proxy: {
                    type: 'uxrest',
                    url: adminPath + 'api/order/' + orderId + '/multiAddressList/v2',
                    reader: {
                        type: 'json',
                        root: 'data.content',
                        idProperty: 'id'
                    }
                },
            }),
            mainRenderer = Ext.create('CGP.orderdetails.view.render.OrderLineItemRender'),
            isAuditPending = [110, 101].includes(+statusId), //待审核状态
            isOrderStatusModify = pageType === 'orderStatusModify';

        me.items = [
            {
                xtype: 'searchcontainer',
                itemId: 'grid',
                width: '60%',
                height: 600,
                gridCfg: {
                    store: store,
                    autoScroll: true,
                    editAction: false,
                    deleteAction: false,
                    customPaging: [
                        {value: 25},
                        {value: 50},
                        {value: 75},
                        {value: 150},
                    ],
                    viewConfig: {},
                    diySetConfig: Ext.emptyFn,//自定义对已有配置的修改
                    defaults: {
                        tdCls: 'vertical-middle',
                        sortable: false,
                        menuDisabled: true,
                    },
                    tbar: {
                        hidden: !isOrderStatusModify,
                        items: [
                            {
                                text: JSCreateFont('blue', false, i18n.getKey('批量审批发货项'), 12, false, true),
                                itemId: 'auditShipmentRequirementBtn',
                                componentCls: "btnOnlyIcon",
                                // hidden: true, //先提交部分　
                                hidden: !isAuditPending,
                                handler: function (btn) {
                                    var tools = btn.ownerCt,
                                        grid = tools.ownerCt,
                                        store = grid.store,
                                        selectRecords = grid.getSelectionModel().getSelection(),
                                        selectIds = selectRecords?.map(record => {
                                            var shipmentRequirementId = record.get('shipmentRequirement')['id'];
                                            return shipmentRequirementId ? shipmentRequirementId.toString() : '';
                                        }),
                                        title = i18n.getKey('审批_发货项'),
                                        fieldLabel = i18n.getKey('审批范围'),
                                        orderTotalCount = store.totalCount;

                                    mainRenderer.createExportExcelWindow(title, fieldLabel, selectIds, orderTotalCount, function (win, selModel) {
                                        mainRenderer.createOrderItemAuditFormWindow(null, function (win, data) {
                                            var {customerNotify, comment} = data,
                                                selModelGather = {
                                                    all: function () {
                                                        var proxy = grid.store.proxy,
                                                            queryUrl = proxy.url,
                                                            filterComp = proxy.filter,
                                                            filterParams = filterComp.getQuery(),
                                                            queryData = JSGetQueryAllData(queryUrl, filterParams),
                                                            queryIds = queryData?.map(item => {
                                                                var shipmentRequirementId = item?.shipmentRequirement?.id;

                                                                return shipmentRequirementId ? shipmentRequirementId.toString() : '';
                                                            });

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
                                                url = adminPath + `api/shipmentRequirements/orderLineItem/batchAudit`,
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
                                text: JSCreateFont('blue', false, i18n.getKey('发货细项跟踪'), 12, false, true),
                                componentCls: "btnOnlyIcon",
                                // hidden: true, //先提交部分　
                                handler: function (btn) {
                                    JSOpen({
                                        id: 'shipmentsItemTailAfterPage',
                                        url: path + "partials/orderitemsmultipleaddress/shipmentsItemTailAfterPage.html" +
                                            "?id=" + orderId,
                                        title: i18n.getKey('发货细项跟踪'),
                                        refresh: true
                                    })
                                }
                            },
                            {
                                xtype: 'button',
                                itemId: 'exportBtn',
                                text: i18n.getKey('导出发货项'),
                                iconCls: 'icon_import',
                                // hidden: true, //先提交部分　
                                handler: function (btn) {
                                    var tools = btn.ownerCt,
                                        grid = tools.ownerCt,
                                        url = adminPath + 'api/shipmentRequirements/exportExcel',
                                        selectRecords = grid.getSelectionModel().getSelection(),
                                        title = i18n.getKey('导出_发货项Excel'),
                                        fieldLabel = i18n.getKey('导出范围'),
                                        storeUrl = grid.store.proxy.url,
                                        gridFilterData = grid.filter.getQuery(),
                                        storeAllData = JSGetQueryAllData(storeUrl, gridFilterData),
                                        selectIds = selectRecords?.map(record => record.get('shipmentRequirement')['id']),
                                        orderTotalCount = store.totalCount;

                                    mainRenderer.createExportExcelWindow(title, fieldLabel, selectIds, orderTotalCount, function (win, selModel) {
                                        var selModelGather = {
                                                all: function () {
                                                    var storeAllData = JSGetQueryAllData(storeUrl, gridFilterData),
                                                        storeAllDataId = storeAllData?.map(item => item['shipmentRequirement']['id']),
                                                        result = [
                                                        {
                                                            "name": "includeIds",
                                                            "type": "number",
                                                            "value": `[${storeAllDataId}]`
                                                        }
                                                    ];

                                                    return JSON.stringify(result);
                                                },
                                                selected: function () {
                                                    var result = [
                                                        {
                                                            "name": "includeIds",
                                                            "type": "number",
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
                        {
                            dataIndex: 'sanctionText',
                            hidden: hiddenSanction,
                            width: 150,
                        },

                        { //发货单操作
                            xtype: 'componentcolumn',
                            text: i18n.getKey('操作'),
                            dataIndex: '_id',
                            width: 130,
                            hidden: !hiddenSanction,
                            sortable: false,
                            renderer: function (v, m, r) {
                                var {name, id} = controller.getStatusName(r),
                                    isCanAudit = r.get('isCanAudit'),
                                    sanctionText = r.get('sanctionText'),
                                    shipmentRequirement = r.get('shipmentRequirement'),
                                    singleAddressDeliveryDetails = r.get('singleAddressDeliveryDetails'),
                                    shippingDetailsId = shipmentRequirement?.id,
                                    deliveryAddress = r.get('deliveryAddress'),
                                    {isLock} = shipmentRequirement,
                                    shipmentOrder = r.get('shipmentOrder'),
                                    finalManufactureCenter = shipmentRequirement['finalManufactureCenter'],
                                    statusId = shipmentOrder?.status?.id,
                                    params = {
                                        remark: remark,
                                        orderId: orderId,
                                        statusName: name,
                                        statusId: id,
                                        shippingDetailsId: shippingDetailsId,
                                        orderDeliveryMethod: orderDeliveryMethod,
                                    },
                                    shippingDetailsBtn = controller.getShippingDetailsBtn([finalManufactureCenter], params),
                                    isHideShipmentRequirement = isLock || !(shipmentRequirement && !shipmentOrder);//有发货要求，但没生成发货单前，都可以修改

                                return {
                                    xtype: 'fieldcontainer',
                                    layout: 'vbox',
                                    items: Ext.Array.merge(
                                        shippingDetailsBtn,
                                        [
                                            {
                                                xtype: 'atag_displayfield',
                                                value: '修改发货要求',
                                                tooltip: `修改发货要求`,
                                                hidden: isHideShipmentRequirement,//有发货要求，但没生成发货单前，都可以修改
                                                clickHandler: function (field) {
                                                    var id = shipmentRequirement.id;
                                                    JSOpen({
                                                        id: 'shipmentrequirement_edit',
                                                        url: path + "partials/shipmentrequirement/edit.html" +
                                                            "?id=" + id,
                                                        title: `修改_发货要求(${id})`,
                                                        refresh: true
                                                    });
                                                }
                                            },
                                            {
                                                xtype: 'atag_displayfield',
                                                value: '修改收件人地址',
                                                tooltip: `修改收件人地址`,
                                                hidden: !([101, 102].includes(statusId) && shipmentOrder),
                                                clickHandler: function () {
                                                    var controller = Ext.create('CGP.orderstatusmodify.view.orderitemsmultipleaddress.controller.Controller');
                                                    var deliveryAddress1 = {
                                                        "shipmentOrderId": shipmentOrder?.id,
                                                        "addressBook": deliveryAddress,
                                                        "shipMethod": shipmentRequirement?.shipmentMethod
                                                    }
                                                    controller.editReceiverAddress(deliveryAddress1, function (data) {
                                                        r.set('deliveryAddress', data['addressBook']);

                                                        shipmentRequirement['shipmentMethod'] = data['shipMethod']
                                                        r.set('shipmentRequirement', shipmentRequirement);
                                                    });
                                                }
                                            },
                                            {
                                                xtype: 'atag_displayfield',
                                                itemId: 'audit',
                                                value: '审批订单项',
                                                tooltip: `审批订单项`,
                                                hidden: !isCanAudit, //发货项可审核时
                                                clickHandler: function () {
                                                    var pageType = 'deliverItem';
                                                    JSOpen({
                                                        id: 'auditOrderItempage',
                                                        url: path + 'partials/orderstatusmodify/auditorderitempage.html' +
                                                            '?shippingDetailsId=' + shippingDetailsId +
                                                            '&isSanction=' + !!sanctionText +    //是否为制裁单
                                                            '&pageType=' + pageType +            //标记进入页面
                                                            '&orderId=' + orderId +              //做返回参数
                                                            '&orderNumber=' + JSGetQueryString('orderNumber') +      //做返回参数
                                                            '&isEditManufactureCenter=' + true,  //标记是否是修改生产基地页面(不显示子组件)
                                                        title: i18n.getKey('订单项审核'),
                                                        refresh: true
                                                    })
                                                }
                                            },
                                        ]
                                    )
                                }
                            }
                        },
                        { //制裁操作
                            xtype: 'componentcolumn',
                            text: i18n.getKey('操作'),
                            dataIndex: '_id',
                            width: 130,
                            hidden: hiddenSanction,
                            sortable: false,
                            renderer: function (v, m, r) {
                                const {name, id} = controller.getStatusName(r),
                                    isCanAudit = r.get('isCanAudit'),
                                    sanctionText = r.get('sanctionText'),
                                    // isLock = record.get('isLock'),
                                    billingAddress = r.get('billingAddress'),
                                    deliveryAddress = r.get('deliveryAddress'),
                                    shipmentRequirement = r.get('shipmentRequirement'),
                                    {isLock} = shipmentRequirement,
                                    singleAddressDeliveryDetails = r.get('singleAddressDeliveryDetails'),
                                    shippingDetailsId = shipmentRequirement?.id,
                                    shipmentOrder = r.get('shipmentOrder'),
                                    finalManufactureCenter = shipmentRequirement['finalManufactureCenter'],
                                    statusId = shipmentOrder?.status?.id,
                                    params = {
                                        statusId: id,
                                        remark: remark,
                                        statusName: name,
                                        orderId: orderId,
                                        shippingDetailsId: shippingDetailsId,
                                        orderDeliveryMethod: orderDeliveryMethod,
                                    },
                                    shippingDetailsBtn = controller.getShippingDetailsBtn([finalManufactureCenter], params),
                                    addressFlagGather = controller.getAddressFlagStatus(singleAddressDeliveryDetails),
                                    isHideShipmentRequirement = isLock || !(shipmentRequirement && !shipmentOrder);//有发货要求，但没生成发货单前，都可以修改

                                return {
                                    xtype: 'fieldcontainer',
                                    layout: 'vbox',
                                    items: Ext.Array.merge(
                                        shippingDetailsBtn,
                                        [
                                            {
                                                xtype: 'atag_displayfield',
                                                value: '收件人制裁详细',
                                                itemId: 'shippingAddress',
                                                hidden: !addressFlagGather[1],
                                                clickHandler: function (field) {
                                                    controller.jumpJSOpenV1('shippingAddress', singleAddressDeliveryDetails, deliveryAddress, orderId, shippingDetailsId);
                                                }
                                            },
                                            {
                                                xtype: 'atag_displayfield',
                                                value: '账单用户制裁详细',
                                                itemId: 'billAddress',
                                                hidden: !addressFlagGather[0],
                                                clickHandler: function (field) {
                                                    controller.jumpJSOpenV1('billAddress', singleAddressDeliveryDetails, deliveryAddress, orderId, shippingDetailsId);
                                                }
                                            },
                                            {
                                                xtype: 'atag_displayfield',
                                                value: '修改发货要求',
                                                tooltip: `修改发货要求`,
                                                hidden: isHideShipmentRequirement,//有发货要求，但没生成发货单前，都可以修改
                                                clickHandler: function (field) {
                                                    var id = shipmentRequirement?.id;
                                                    JSOpen({
                                                        id: 'shipmentrequirement_edit',
                                                        url: path + "partials/shipmentrequirement/edit.html" +
                                                            "?id=" + id,
                                                        title: `修改_发货要求(${id})`,
                                                        refresh: true
                                                    });
                                                }
                                            },
                                            {
                                                xtype: 'atag_displayfield',
                                                value: '修改收件人地址',
                                                hidden: !([101, 102].includes(statusId) && shipmentOrder),
                                                clickHandler: function () {
                                                    var controller = Ext.create('CGP.orderstatusmodify.view.orderitemsmultipleaddress.controller.Controller'),
                                                        deliveryAddress1 = {
                                                            "shipmentOrderId": shipmentOrder?.id,
                                                            "addressBook": deliveryAddress,
                                                            "shipMethod": shipmentRequirement?.shipmentMethod
                                                        }
                                                    controller.editReceiverAddress(deliveryAddress1, function (data) {
                                                        r.set('deliveryAddress', data['addressBook']);

                                                        shipmentRequirement['shipmentMethod'] = data['shipMethod']
                                                        r.set('shipmentRequirement', shipmentRequirement);
                                                    });
                                                }
                                            },
                                            {
                                                xtype: 'atag_displayfield',
                                                itemId: 'audit',
                                                value: '审批订单项',
                                                tooltip: `审批订单项`,
                                                hidden: !isCanAudit, //发货项可审核时
                                                clickHandler: function () {
                                                    var pageType = 'deliverItem';
                                                    JSOpen({
                                                        id: 'auditOrderItempage',
                                                        url: path + 'partials/orderstatusmodify/auditorderitempage.html' +
                                                            '?shippingDetailsId=' + shippingDetailsId +
                                                            '&isSanction=' + !!sanctionText +    //是否为制裁单
                                                            '&pageType=' + pageType +            //标记进入页面
                                                            '&orderId=' + orderId +              //做返回参数
                                                            '&orderNumber=' + JSGetQueryString('orderNumber') +      //做返回参数
                                                            '&isEditManufactureCenter=' + true,  //标记是否是修改生产基地页面(不显示子组件)
                                                        title: i18n.getKey('订单项审核'),
                                                        refresh: true
                                                    })
                                                }
                                            },
                                        ]
                                    )
                                };
                            }
                        },

                        {
                            text: i18n.getKey('订单项数量'),
                            dataIndex: 'orderItemNum',
                            width: 120,
                        },
                        {
                            xtype: 'atagcolumn',
                            text: i18n.getKey('订单项序号'),
                            width: 150,
                            dataIndex: 'itemSeqNos',
                            sortable: false,
                            getDisplayName: function (value, mateData, record) {
                                var isGreaterFive = value?.length > 5,
                                    valueText = value.join(','),
                                    showText = isGreaterFive ? `${valueText.substring(0, 9)}...` + JSCreateHyperLink('更多') : value;

                                if (isGreaterFive) {
                                    mateData.tdAttr = `data-qtip=跳转至_发货详情(${valueText})`;
                                }

                                return showText;
                            },
                            clickHandler: function (value, mateData, record) {
                                var shippingDetailsId = record.get('id'),
                                    orderDeliveryMethod = record.get('orderDeliveryMethod'),
                                    manufactureCenter = record.get('finalManufactureCenter') || '',
                                    remark = record.get('remark');

                                JSOpen({
                                    id: 'sanction',
                                    url: path + "partials/orderstatusmodify/multipleAddress.html?shippingDetailsId=" + shippingDetailsId +
                                        '&orderDeliveryMethod=' + orderDeliveryMethod +
                                        '&manufactureCenter=' + manufactureCenter +
                                        '&remark=' + remark,
                                    title: '发货详情',
                                    refresh: true
                                });
                            }
                        },
                        {
                            text: i18n.getKey('状态'),
                            dataIndex: '_id',
                            width: 150,
                            sortable: false,
                            renderer: function (value, metadata, record) {
                                var {name} = controller.getStatusName(record),
                                    shipmentRequirement = record.get('shipmentRequirement'),
                                    {isLock,status} = shipmentRequirement,
                                    frontendName = status?.frontendName,
                                    lockText = isLock ? '(已锁定)' : '';

                                return `${frontendName} ` + JSCreateFont('red', true, lockText);
                            }
                        },
                        {
                            xtype: 'componentcolumn',
                            text: i18n.getKey('进程信息'),
                            dataIndex: '_id',
                            width: 200,
                            sortable: false,
                            renderer: function (value, metadata, record, row, col, store, gridView) {
                                var shipmentRequirement = record.get('shipmentRequirement'),
                                    {paibanStatus, productionStatus} = shipmentRequirement,
                                    shipmentRequirementId = shipmentRequirement?.id,
                                    paibanGather = {
                                        4: {
                                            color: 'green',
                                            text: i18n.getKey('排版成功'),
                                        },
                                        3: {
                                            color: 'red',
                                            text: i18n.getKey('排版失败'),
                                        },
                                        2: {
                                            color: 'blue',
                                            text: i18n.getKey('正在排版'),
                                        },
                                        1: {
                                            color: 'grey',
                                            text: i18n.getKey('等待排版'),
                                        },
                                    },
                                    productionStatusGather = {
                                        5: {
                                            color: 'blue',
                                            text: i18n.getKey('正在推送'),
                                        },
                                        4: {
                                            color: 'green',
                                            text: i18n.getKey('生产完成'),
                                        },
                                        3: {
                                            color: 'orange',
                                            text: i18n.getKey('生产中'),
                                        },
                                        2: {
                                            color: 'blue',
                                            text: i18n.getKey('已推送'),
                                        },
                                        1: {
                                            color: 'grey',
                                            text: i18n.getKey('等待推送'),
                                        },
                                    },
                                    paibanInfo = paibanGather[paibanStatus || 1],
                                    productionStatusInfo = productionStatusGather[productionStatus || 1],
                                    paibanStatusText = JSCreateFont(paibanInfo['color'], true, paibanInfo['text']),
                                    productionStatusText = JSCreateFont(productionStatusInfo['color'], true, productionStatusInfo['text']);

                                return {
                                    xtype: 'fieldcontainer',
                                    layout: 'hbox',
                                    items: [
                                        {
                                            xtype: 'fieldcontainer',
                                            layout: 'vbox',
                                            defaults: {
                                                labelWidth: 60
                                            },
                                            items: [
                                                {
                                                    xtype: 'displayfield',
                                                    name: 'paibanStatus',
                                                    itemId: 'paibanStatus',
                                                    fieldLabel: i18n.getKey('排版状态'),
                                                    value: paibanStatusText,
                                                },
                                                {
                                                    xtype: 'displayfield',
                                                    name: 'productionStatus',
                                                    itemId: 'productionStatus',
                                                    fieldLabel: i18n.getKey('生产状态'),
                                                    value: productionStatusText,
                                                },
                                            ]
                                        },
                                        {
                                            xtype: 'fieldcontainer',
                                            layout: 'hbox',
                                            defaults: {
                                                labelWidth: 60
                                            },
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    itemId: 'infoTip',
                                                    iconCls: 'icon_help',
                                                    margin: '30 0 0 5',
                                                    componentCls: "btnOnlyIcon",
                                                    tooltip: '推送LEMS的返回状态',
                                                },
                                                {
                                                    xtype: 'atag_displayfield',
                                                    value: i18n.getKey('详情'),
                                                    margin: '12 0 0 7',
                                                    tooltip: `查看_订单项排版详情`,
                                                    clickHandler: function (value, metaData, record) {
                                                        JSOpen({
                                                            id: 'shipmentItemTypeSetting',
                                                            url: path + "partials/orderstatusmodify/ShipmentItemTypeSetting.html" +
                                                                "?configId=" + shipmentRequirementId +
                                                                "&pageType=" + 'shipmentRequirementId',
                                                            title: '订单项排版详情',
                                                            refresh: true
                                                        });
                                                    },
                                                },
                                            ]
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            text: i18n.getKey('发货信息'),
                            dataIndex: 'shipmentRequirement',
                            width: 250,
                            sortable: false,
                            renderer: function (value, metadata, record) {
                                var shipmentMethod = value?.shipmentMethod,
                                    shipmentOrder = record.get('shipmentOrder'),
                                    result = [
                                        {
                                            title: '发货方式',
                                            value: shipmentMethod
                                        }
                                    ]

                                if (shipmentOrder) {
                                    var {shipmentNo} = shipmentOrder;
                                    shipmentNo && result.push({
                                        title: '统一发货单号',
                                        value: shipmentNo
                                    })
                                }

                                return JSCreateHTMLTable(result);
                            }
                        },
                        {
                            text: i18n.getKey('收件人地址'),
                            dataIndex: 'deliveryAddress',
                            width: 250,
                            sortable: false,
                            renderer: function (value, metadata, record) {
                                var str = value ? JSBuildAddressInfo(value) : '';
                                metadata.tdAttr = 'data-qtip="' + str + '"';
                                return str;
                            }
                        },
                        {
                            xtype: 'atagcolumn',
                            width: 250,
                            dataIndex: 'shipmentRequirement',
                            text: i18n.getKey('生产基地'),
                            sortable: false,
                            getDisplayName: function (value, metaData, record) {
                                var {name} = controller.getStatusName(record),
                                    isCanUpdateManufactureCenter = record.get('isCanUpdateManufactureCenter'),
                                    {id, finalManufactureCenter} = value,
                                    link = '',
                                    {text} = controller.getManufactureCenterText(finalManufactureCenter),
                                    result = text + '生产基地';

                                if (name === '等待发货') { //非等待发货不可修改生产基地
                                    link = JSCreateHyperLink('修改');
                                }

                                if (!isCanUpdateManufactureCenter) { //如果是第三方生产 优先级最高 放最后
                                    link = JSCreateFont('red', true, ' (第三方生产)')
                                }

                                return `${result} ${link}`;
                            },
                            clickHandler: function (value, metaData, record) {
                                var {id, finalManufactureCenter} = value;
                                JSOpen({
                                    id: 'shipmentrequirement_edit',
                                    url: path + "partials/orderstatusmodify/manufacturingbasepage.html" +
                                        "?manufactureCenter=" + finalManufactureCenter +
                                        "&shippingDetailsId=" + id +
                                        "&isEditManufactureCenter=true",
                                    title: `修改_生产基地`,
                                    refresh: true
                                });
                            }
                        },
                        {
                            text: i18n.getKey('出口报关金额'),
                            dataIndex: 'baseCustomsAmount',
                            minWidth: 150,
                            flex: 1,
                            sortable: false,
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip="' + value + '"';
                                return value;
                            }
                        }
                    ],
                    plugins: [{
                        ptype: 'cross_page_select',
                    }],
                },
                filterCfg: {
                    header: false,
                    minHeight: 45,
                    bodyStyle: 'border: 1px solid #c0c0c0;',
                    border: '1 1 0 1',
                    layout: {
                        type: 'column',
                        columns: 4
                    },
                    defaults: {
                        margin: '10 10 5 10'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            name: 'itemSeqNos',
                            itemId: 'itemSeqNos',
                            isLike: true,
                            isMultiSelect: true, //是否开启多选查询
                            enforceMaxLength: true,
                            valueType: 'number',
                            tipInfo: '该字段可通过(,)实现多数据查询,例如: 327486849,327486852',
                            fieldLabel: i18n.getKey('订单项序号'),
                        },
                        {
                            xtype: 'textfield',
                            name: 'address.emailAddress',
                            itemId: 'address.emailAddress',
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
                            xtype: 'combo',
                            fieldLabel: i18n.getKey('生产基地'),
                            name: 'finalManufactureCenter',
                            itemId: 'finalManufactureCenter',
                            isLike: false,
                            editable: false,
                            haveReset: true,
                            hidden: true,
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

                    ]
                }
            }
        ]

        me.callParent();
    }
})
