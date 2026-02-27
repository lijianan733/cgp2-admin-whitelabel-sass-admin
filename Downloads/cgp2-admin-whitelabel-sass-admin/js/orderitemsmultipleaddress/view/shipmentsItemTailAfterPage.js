/**
 * @author xiu
 * @date 2025/12/18
 */
Ext.Loader.setPath({
    enabled: true,
    "CGP.orderdetails": path + "partials/order/details/app"
});
Ext.Loader.syncRequire([
    'CGP.orderdetails.view.render.OrderLineItemRender',
    'CGP.orderitemsmultipleaddress.view.auditContentGrid',
    'CGP.orderitemsmultipleaddress.model.Order',
    'CGP.orderitemsmultipleaddress.store.shipmentsItemTailAfterStore'
])
Ext.define('CGP.orderitemsmultipleaddress.view.shipmentsItemTailAfterPage', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.shipments_item_tail_after_page',
    layout: 'fit',
    // 获取状态名
    getStatusName: function (shipmentOrder) {
        var result = null;

        if (shipmentOrder) {
            var {status} = shipmentOrder,
                {frontendName, id} = status;

            if (id === 101) {
                frontendName = '待装箱'
            }

            result = {
                name: i18n.getKey(frontendName),
                id: id
            };
        } else {
            result = {
                name: '等待发货',
                id: null
            };
        }

        return result;
    },
    initComponent: function () {
        var me = this,
            orderId = JSGetQueryString('id'),
            //两个接口取出来的数据不同
            mainRenderer = Ext.create('CGP.orderdetails.view.render.OrderLineItemRender'),
            isShowClickItem = {
                changeUserDesignBtn: false,
                builderPageBtn: false,
                customsCategoryBtn: false,
                viewUserStuffBtn: false,
                buildPreViewBtn: false,
                contrastImgBtn: false,
                builderCheckHistoryBtn: false
            },
            orderLineItemStore = Ext.create('CGP.orderitemsmultipleaddress.store.shipmentsItemTailAfterStore', {
                orderId: orderId,
            }),
            orderItem = mainRenderer.getOrderItemCfgV2({
                grid: me,
                orderId: orderId,
            }, me.pageType, isShowClickItem);

        me.items = [
            {
                xtype: 'container',
                itemId: 'container',
                layout: 'fit',
                width: '100%',
                items: [
                    {
                        xtype: 'searchcontainer',
                        itemId: 'grid',
                        width: '60%',
                        height: 600,
                        filterCfg: {
                            header: false,
                            minHeight: 45,
                            bodyStyle: 'border: 1px solid #c0c0c0;',
                            border: '1 1 0 1',
                            hidden: true,
                            items: []
                        },
                        gridCfg: {
                            store: orderLineItemStore,
                            autoScroll: true,
                            showRowNum: false,
                            editAction: false,
                            deleteAction: false,
                            selModel: {
                                selType: 'rowmodel',
                            },
                            customPaging: [
                                {value: 25},
                                {value: 50},
                                {value: 75},
                                {value: 150},
                            ],
                            diySetConfig: Ext.emptyFn,//自定义对已有配置的修改
                            defaults: {
                                tdCls: 'vertical-middle',
                                sortable: false,
                                menuDisabled: true,
                            },
                            viewConfig: {},
                            columns: [
                                {
                                    xtype: 'atagcolumn',
                                    text: i18n.getKey("发货要求编号"),
                                    dataIndex: 'id',
                                    align: 'center',
                                    width: 200,
                                    sortable: false,
                                    getDisplayName: function (value, metaData, record) {
                                        var shipmentRequirement = record.get('shipmentRequirement'),
                                            shipmentRequirementId = shipmentRequirement?.id;
                                        return `${shipmentRequirementId} ${JSCreateHyperLink('发货详情')}`;
                                    },
                                    clickHandler: function (value, metaData, record) {
                                        var shipmentRequirement = record.get('shipmentRequirement'),
                                            {
                                                id,
                                                orderDeliveryMethod,
                                                finalManufactureCenter,
                                                remark
                                            } = shipmentRequirement;

                                        JSOpen({
                                            id: 'sanction',
                                            url: path + "partials/orderstatusmodify/multipleAddress.html?shippingDetailsId=" + id +
                                                '&orderDeliveryMethod=' + orderDeliveryMethod +
                                                '&manufactureCenter=' + finalManufactureCenter +
                                                '&remark=' + remark,
                                            title: '发货详情',
                                            refresh: true
                                        });
                                    }
                                },
                                {
                                    text: i18n.getKey('发货地址'),
                                    width: 200,
                                    dataIndex: 'shipmentRequirement',
                                    sortable: false,
                                    renderer: function (value, metaData, record) {
                                        var {address} = value,
                                            str = value ? JSBuildAddressInfo(address) : '';

                                        metaData.tdAttr = 'data-qtip="' + str + '"';

                                        return str;
                                    },
                                },
                                {
                                    text: i18n.getKey('发货要求信息'),
                                    width: 200,
                                    dataIndex: 'id',
                                    sortable: false,
                                    renderer: function (value, metaData, record) {
                                        var shipmentRequirement = record.get('shipmentRequirement'),
                                            paibanStatus = record.get('paibanStatus'),
                                            shipmentRequirementStatus = shipmentRequirement?.status,
                                            // paibanStatus = shipmentRequirement?.paibanStatus,
                                            productionStatus = shipmentRequirement?.productionStatus,
                                            frontendName = shipmentRequirementStatus?.frontendName,
                                            paibanStatusGather = {
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
                                                0: {
                                                    color: 'grey',
                                                    text: 0,
                                                }
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
                                                0: {
                                                    color: 'grey',
                                                    text: '',
                                                }
                                            },
                                            {color, text} = paibanStatusGather[paibanStatus || 0],
                                            productionStatusText = productionStatusGather[productionStatus || 0].text,
                                            productionStatusColor = productionStatusGather[productionStatus || 0].color,
                                            paibanStatusGatherText = text ? JSCreateFont(color, true, text) : '',
                                            productionStatusGatherText = productionStatusText ? JSCreateFont(productionStatusColor, true, productionStatusText) : '',
                                            result = [
                                                {
                                                    title: i18n.getKey('排版状态'),
                                                    value: paibanStatusGatherText
                                                },
                                                {
                                                    title: i18n.getKey('生产状态'),
                                                    value: productionStatusGatherText
                                                },
                                                {
                                                    title: i18n.getKey('发货状态'),
                                                    value: frontendName
                                                },
                                            ]

                                        return JSCreateHTMLTableV2(result, 'right', 'auto', true);
                                    },
                                },
                                {
                                    xtype: 'diy_date_column',
                                    text: i18n.getKey('预计交收日期'),
                                    width: 200,
                                    dataIndex: 'estimatedDeliveryDate',
                                    sortable: false,
                                },
                                orderItem.get('0'),
                                orderItem.get('7'),
                                orderItem.get('2'),
                                orderItem.get('6'),
                                orderItem.get('5'),
                                orderItem.get('8'),
                            ],
                        },
                    }
                ]
            },
        ];

        me.callParent(arguments);
    }
})