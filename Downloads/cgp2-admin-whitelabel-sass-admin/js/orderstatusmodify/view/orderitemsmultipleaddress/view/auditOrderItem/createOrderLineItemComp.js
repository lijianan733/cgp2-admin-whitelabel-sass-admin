/**
 * 统一的订单项显示功能
 */
Ext.Loader.syncRequire([
    'CGP.common.commoncomp.QueryGrid',
    'CGP.orderitemsmultipleaddress.controller.Controller',
    'CGP.orderlineitemv2.store.OrderLineItemByOrderStore'
])
Ext.define('CGP.orderstatusmodify.view.orderitemsmultipleaddress.view.auditOrderItem.createOrderLineItemComp', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.order_line_item',
    // rowLines: true,//是否添加行边线
    // columnLines: true,//是否添加列边线
    store: null,
    viewConfig: {
        stripeRows: false,
    },
    autoScroll: true,
    isLock: false,
    pageType: null, // deliverInfo(发货详情页) || orderStatusModify(生产详细页) || orderItemsMultipleAddress(订单详情页) || auditOrderItem 订单项审核页
    maxHeight: 700,
    minHeight: 450,
    toolsHidden: false,
    orderStatusId: null,
    remark: JSGetQueryString('remark'),
    orderId: JSGetQueryString('orderId'),
    selModel: {
        selType: 'rowmodel',
        mode: 'SINGLE'
    },
    setManufactureCenterText: function (data) {
        var me = this,
            tools = me.getDockedItems('toolbar[dock="top"]')[0],
            manufactureCenterField = tools.getComponent('manufactureCenter');

        manufactureCenterField.setValue(JSCreateFont('red', true, `${data}`, 13));
    },
    initComponent: function () {
        var me = this,
            {orderRecord, pageType} = me,
            mainRenderer = Ext.create('CGP.orderdetails.view.render.OrderLineItemRender'),
            orderId = orderRecord.get('_id'),
            remark = orderRecord.get('remark'),
            orderNumber = orderRecord.get('orderNumber'),
            orderStatusId = orderRecord.get('statusId'),
            urlPageType = JSGetQueryString('pageType'),
            isShowCustomsCategoryPageType = urlPageType === 'deliverItem',
            isShowCustomsCategoryOrderStatus = Ext.Array.contains(['43', '100', '110', '101', '113', '116', '117', '118', '300', '301'], String(orderStatusId)),
            orderItem = mainRenderer.getOrderItemCfgV2({
                grid: me,
                remark: remark,
                orderId: orderId,
                orderStatusId: orderStatusId,
            }, pageType, me.isShowClickItem);

        me.tbar = {
            xtype: 'toolbar',
            dock: 'top',
            //style: 'background-color:silver;',
            color: 'black',
            enableOverflow: true,
            bodyStyle: 'border-color:white;',
            itemId: 'infoDisplayToolbar',
            items: [
                {
                    xtype: 'displayfield',
                    fieldLabel: false,
                    itemId: 'infoDisplay',
                    value: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('orderLineItem') + '</font>'
                },
                {
                    xtype: 'button',
                    itemId: 'btn',
                    text: JSCreateFont('blue', false, i18n.getKey('批量报关分类'), 12, false, true),
                    hidden: !isShowCustomsCategoryPageType || !isShowCustomsCategoryOrderStatus,
                    // hidden: true,
                    componentCls: "btnOnlyIcon",
                    handler: function (btn) {
                        var pageType = JSGetQueryString('pageType'),
                            shippingDetailsId = JSGetQueryString('shippingDetailsId'),
                            controller = Ext.create('CGP.orderitemsmultipleaddress.controller.Controller'),
                            queryData = pageType === 'shipmentrequirement' ? controller.getCustomsCategoryListDataV2(shippingDetailsId) : controller.getCustomsCategoryListData(orderId),
                            orderLineItemStore = Ext.create('CGP.orderlineitemv2.store.OrderLineItemByOrderStore', {
                                pageSize: 10000,
                                proxy: {
                                    type: 'pagingmemory',
                                    data: [],
                                },
                                data: queryData
                            }),
                            gridParams = {
                                order: orderRecord,
                                originStore: me.store,
                                store: orderLineItemStore,
                            };


                        console.log(pageType);
                        controller.createCustomsCategory(gridParams);
                    }
                },
                {
                    xtype: 'button',
                    itemId: 'auditOrderItemBtn',
                    componentCls: "btnOnlyIcon",
                    // hidden: true, //先提交部分　
                    hidden: !isShowCustomsCategoryPageType || !isShowCustomsCategoryOrderStatus,
                    text: JSCreateFont('blue', false, i18n.getKey('批量审批订单项'), 12, false, true),
                    handler: function (btn) {
                        var orderItemList = btn.ownerCt.ownerCt,
                            grid = orderItemList,
                            store = grid.store,
                            proxy = store.proxy,
                            queryUrl = proxy.url,
                            filterComp = proxy.filter,
                            // filterParams = filterComp.getQuery(),
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
                            // orderTotalCount = mainRenderer.getAuditStatusOrderTotalCount(queryUrl, filterParams,true);
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
                    // hidden: true, //先提交部分　
                    // hidden: !isShowCustomsCategoryPageType || !isShowCustomsCategoryOrderStatus,
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
            ]
        }

        me.columns = [
            orderItem.get('0'),
            orderItem.get('2'),
            Ext.Object.merge(orderItem.get('3'), {
                hidden: me.isLock
            }),
            orderItem.get('5'),
            orderItem.get('6'),
            orderItem.get('7'),
            orderItem.get('11'),
            orderItem.get('8'),
            orderItem.get('9'),
            orderItem.get('10'),
            orderItem.get('12'),
        ]

        me.bbar = {
            xtype: 'pagingtoolbar',
            store: me.store,
            displayInfo: true, // 是否 ? 示， 分 ? 信息
            displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
            emptyText: i18n.getKey('noDat')
        }

        me.callParent();
    },
})

