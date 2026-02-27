/**
 * @Description:
 * @author xiu
 * @date 2023/1/11
 */
Ext.define('CGP.common.typesettingschedule.view.EditPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.edit_panel',
    data: null,
    orderId: null,
    orderItemId: null,
    autoScroll: true,
    initComponent: function () {
        var me = this,
            titleGather = {
                0: {
                    color: '#999999',
                    text: '等待中'
                },
                1: {
                    color: '#1D7DA7',
                    text: '进行中'
                },
                2: {
                    color: '#DC143C',
                    text: '失败'
                },
                3: {
                    color: 'green',
                    text: '成功'
                },
            },
            controller = Ext.create('CGP.common.typesettingschedule.controller.Controller'),
            setTitle = index => '<font color="' + titleGather[index]['color'] + '">' + titleGather[index]['text'] + '</font>';

        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('刷新'),
                iconCls: 'icon_refresh',
                margin: '0 0 0 10',
                handler: function () {
                    location.reload();
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('订单信息'),
                iconCls: 'icon_check',
                margin: '0 0 0 10',
                handler: function (btn) {
                    var orderInfo = null,
                        panel = btn.ownerCt.ownerCt,
                        title = i18n.getKey('订单信息'),
                        orderInfoUrl = adminPath + 'api/orderItems/' + panel.orderItemId + '/composing';

                    JSAjaxRequest(orderInfoUrl, 'GET', true, null, null, function (require, success, response) {
                        if (success) {
                            var responseText = Ext.JSON.decode(response.responseText);
                            if (responseText.success) {
                                orderInfo = responseText.data;
                                JSShowJsonDataV2(orderInfo, title);
                            }
                        }
                    }, true)
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('历史排版'),
                iconCls: 'icon_check',
                margin: '0 0 0 10',
                handler: function (btn) {
                    var store = Ext.create('CGP.common.typesettingschedule.store.TypesettingScheduleStore', {
                        params: {
                            filter: '[{"name":"datas.orderItemId","operator":"exactMatch","value":"' + me.orderItemId + '","type":"string"}]'
                        }
                    });

                    var win = Ext.create('Ext.window.Window', {
                        layout: 'fit',
                        modal: true,
                        allowScroll: true,
                        title: i18n.getKey('历史排版'),
                        items: [
                            {
                                xtype: 'gridfieldextendcontainer',
                                itemId: 'typeSetting',
                                autoScroll: true,
                                height: 500,
                                width: 1400,
                                gridConfig: {
                                    store: store,
                                    width: '100%',
                                    columns: [
                                        {
                                            xtype: 'rownumberer',
                                            tdCls: 'vertical-middle',
                                            width: 50,
                                            sortable: false,
                                        },
                                        {
                                            xtype: 'actioncolumn',
                                            tdCls: 'vertical-middle',
                                            itemId: 'actioncolumn',
                                            width: 50,
                                            sortable: false,
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    iconCls: 'icon_query',
                                                    itemId: 'actioncheck',
                                                    handler: function (view, rowIndex, colIndex, action, event, record) {
                                                        var _id = record.get('_id'),
                                                            orderItemId = record.raw.datas.orderItemId;
                                                        JSOpen({
                                                            id: 'typesettingschedule',
                                                            url: path + "partials/typesettingschedule/edit.html?id=" + _id + '&orderItemId=' + orderItemId,
                                                            title: i18n.getKey('check') + '_' + i18n.getKey('typesettingschedule') + '(' + _id + ')',
                                                            refresh: true
                                                        })
                                                    }
                                                },
                                            ]
                                        },
                                        {
                                            text: i18n.getKey('orderNumber'),
                                            width: 150,
                                            dataIndex: 'datas',
                                            renderer: function (value, metadata, record) {
                                                if (value) {
                                                    return value['orderNumber'];
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'atagcolumn',
                                            text: i18n.getKey('orderLineItem'),
                                            width: 80,
                                            dataIndex: 'datas',
                                            getDisplayName: function (value) {
                                                return '<a href="#">' + value['orderItemId'] + '</a>'
                                            },
                                            clickHandler: function (value, metadata, record) {
                                                var {orderItemId, isTest} = value;
                                                JSOpen({
                                                    id: 'orderLineItem',
                                                    url: path + '/partials/orderlineitem/orderlineitem.html' +
                                                        '?id=' + orderItemId +
                                                        '&isTest2=' + isTest,
                                                    title: i18n.getKey('orderLineItem'),
                                                    refresh: true
                                                })
                                            },
                                            sortable: false,
                                        },
                                        {
                                            text: i18n.getKey('status'),
                                            width: 150,
                                            dataIndex: 'status',
                                            renderer: function (value) {
                                                if (value) {
                                                    var color = {
                                                        FINISHED: 'green',
                                                        FAILURE: '#DC143C',
                                                        RUNNING: '#1D7DA7',
                                                        WAITING: '#999999'
                                                    };
                                                    return controller.getTitleBold(color[value], true, i18n.getKey(value));
                                                }
                                            }
                                        },
                                        {
                                            text: i18n.getKey('productInfo'),
                                            width: 300,
                                            dataIndex: 'datas',
                                            renderer: function (value) {
                                                var result;
                                                var productInfo = value['productInfo']
                                                if (productInfo) {
                                                    result = [
                                                        {
                                                            title: i18n.getKey('sku'),
                                                            value: i18n.getKey(productInfo['productSku'])
                                                        },
                                                        {
                                                            title: i18n.getKey('name'),
                                                            value: i18n.getKey(productInfo['productName'])
                                                        }
                                                    ]
                                                }
                                                return JSCreateHTMLTable(result);

                                            }
                                        },
                                        {
                                            xtype: 'imagecolumn',
                                            tdCls: 'vertical-middle',
                                            width: 150,
                                            dataIndex: 'datas',
                                            text: i18n.getKey('thumbnail'),
                                            //订单的缩略图特殊位置
                                            buildUrl: function (value, metadata, record) {
                                                var thumbnail = value['productInfo']['thumbnail'];
                                                return projectThumbServer + thumbnail;
                                            },
                                            //订单的缩略图特殊位置
                                            buildPreUrl: function (value, metadata, record) {
                                                var thumbnail = value['productInfo']['thumbnail'];
                                                return projectThumbServer + thumbnail;
                                            },
                                        },
                                        {
                                            text: i18n.getKey('version'),
                                            width: 100,
                                            dataIndex: 'datas',
                                            renderer: function (value, metadata, record) {
                                                if (value) {
                                                    return value['version'];
                                                }
                                            }
                                        },
                                        /*{
                                            text: i18n.getKey('生产基地'),
                                            width: 150,
                                            dataIndex: 'manufactureCenter',
                                            renderer: function (value, metadata, record) {
                                                var {color, text} = controller.getManufactureCenterText(value);

                                                return JSCreateFont(color, true, text);
                                            }
                                        },*/
                                        {
                                            text: i18n.getKey('执行时间'),
                                            minWidth: 350,
                                            flex: 1,
                                            dataIndex: 'startTime',
                                            renderer: function (value, metadata, record) {
                                                var hour, minute, second, groupTime,
                                                    startTime = controller.getEndTime(value),
                                                    endTime = controller.getEndTime(record.get('endTime')),
                                                    time = startTime + ` ~ ` + endTime,
                                                    takeTime = ((new Date(+record.get('endTime')) - new Date(+value)) / 1000).toFixed(0);

                                                if (value && record.get('endTime')) {
                                                    groupTime = JSGetTakeTime(startTime, endTime)
                                                }

                                                return JSCreateHTMLTable([
                                                    {
                                                        title: i18n.getKey('执行时间'),
                                                        value: time
                                                    },
                                                    {
                                                        title: i18n.getKey('用时'),
                                                        value: groupTime
                                                    }
                                                ]);
                                            }
                                        },
                                    ],

                                    bbar: Ext.create('Ext.PagingToolbar', {//底端的分页栏
                                        store: store,
                                        displayInfo: true, // 是否 ? 示， 分 ? 信息
                                        displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                                        emptyMsg: i18n.getKey('noData')
                                    })
                                },
                            },
                        ]
                    })
                    win.show();
                }
            },
            {
                xtype: 'container',
                layout: 'hbox',
                margin: '0 0 0 50',
                float: 'right',
                defaults: {
                    margin: '0 0 0 10',
                    iconScale: 0.8
                },
                items: [
                    {
                        xtype: 'stepitems_btn',
                        status: -1,
                        width: 25,
                        finishColor: 'green',
                    },
                    {
                        xtype: 'displayfield',
                        margin: '5 0 0 10',
                        value: setTitle(0)
                    },
                    {
                        xtype: 'stepitems_btn',
                        status: -2,
                        width: 25,
                        schedule: 50,
                        finishColor: 'green',
                    },
                    {
                        xtype: 'displayfield',
                        margin: '5 0 0 10',
                        value: setTitle(1)
                    },
                    {
                        xtype: 'stepitems_btn',
                        status: 0,
                        width: 25,
                        finishColor: 'green',
                    },
                    {
                        xtype: 'displayfield',
                        margin: '5 0 0 10',
                        value: setTitle(2)
                    },
                    {
                        xtype: 'stepitems_btn',
                        status: 1,
                        width: 25,
                        finishColor: 'green',
                    },
                    {
                        xtype: 'displayfield',
                        margin: '5 0 0 10',
                        value: setTitle(3)
                    },
                ]
            },
        ];
        me.items = [
            {
                xtype: 'top_stepbar',
                width: 35,
                direct: 'vbox',
                queryData: me.data,
                itemId: 'stepbar',
            },
            {
                xtype: 'container',
                width: '85%',
                layout: 'vbox',
                defaults: {
                    margin: '10 0 0 0',
                },
                items: [
                    {
                        xtype: 'data_container',
                        initData: me.data[0],
                        minHeight: 180,
                        allowBlank: false,
                        titleLabel: i18n.getKey('init'),
                    },
                    {
                        xtype: 'type_setting',
                        orderId: me.orderId,
                        typeSettingData: me.data[1],
                        orderItemId: me.orderItemId,
                        minHeight: 180,
                    },
                    {
                        xtype: 'data_container',
                        initData: me.data[2],
                        allowBlank: false,
                        titleLabel: i18n.getKey('createContent'),
                    },
                ]
            }
        ];
        me.callParent();
        me.listeners = {
            render: function (view) {
                view.body.dom.style.overflowX = 'hidden';
            }
        }
        me.scrollBarControl();
    },
    scrollBarControl: function () {
        var me = this;
        me.scrollData = {
            left: 0,
            top: 0
        };
        me.on('afterrender', function () {
            var form = this;
            form.addEvents({
                "scroll": true//监听滚动条事件
            });
            //代理监听内部body的滚动条事件，渲染后才有body
            form.relayEvents(form.body.el, ['scroll']);
        });
        me.on('scroll', function () {
            var me = this;
            me.scrollData = me.body.getScroll();
        });
        me.on('afterLayout', function () {
            var me = this;
            me.body.setScrollTop(me.scrollData.top);
        });
    },
})