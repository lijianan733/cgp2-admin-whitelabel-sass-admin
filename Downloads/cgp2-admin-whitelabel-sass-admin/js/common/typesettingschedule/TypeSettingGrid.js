Ext.Loader.syncRequire([
    'CGP.common.typesettingschedule.controller.Controller'
])
Ext.define('CGP.common.typesettingschedule.TypeSettingGrid', {
    extend: 'Ext.window.Window',
    alias: 'widget.typesettinggrid',
    layout: 'fit',
    modal: true,
    allowScroll: true,
    title: i18n.getKey('typesettingschedule'),
    record: null,
    orderId: null,
    statusId: null,
    gridStore: null,
    orderNumber: null,
    width: '80%',
    height: '80%',
    getTypeSettingSchedule: function () {
        const me = this,
            {orderId, orderNumber, record} = me,
            typesettingscheduleUrl = composingPath + 'api/orders/' + orderId + '/composing/statistics',
            totalUrl = composingPath + 'api/composing/lastProgresses?' +
                'page=1' +
                '&limit=25' +
                `&filter=[{"name":"orderNumber","value":"${orderNumber}","type":"string"}]`,
            controller = Ext.create('CGP.common.typesettingschedule.controller.Controller'),
            {
                failureCount,
                waitingCount,
                runningCount,
                finishedCount,
            } = controller.getQuery(typesettingscheduleUrl),
            countGather = [
                {
                    color: 'green',
                    text: '成功',
                    count: finishedCount
                },
                {
                    color: 'red',
                    text: '失败',
                    count: failureCount
                },
                {
                    color: 'blue',
                    text: '进行中',
                    count: runningCount
                },
                {
                    color: 'gray',
                    text: '等待中',
                    count: waitingCount
                },
            ],
            total = controller.getTotalCount(totalUrl),
            typesettingscheduleText = countGather.reduce((m, key) => {
                var {color, text, count} = key,
                    result = m;
                if (count) {
                    result = m + '  ' + JSCreateFont(color, true, `${text}:${count}`)
                }
                return result;
            }, '')

        return {
            total: total,
            typesettingschedule: finishedCount / total,
            // typesettingscheduleText: typesettingscheduleText + ` / ${JSCreateFont('green', true, total)}`
            typesettingscheduleText: `${JSCreateFont('green', true, `${finishedCount} / ${total}`)}`
        }
    },
    upDataTypeSetting: function (comp) {
        var me = this,
            progressbar = comp.getComponent('progressbar'),
            {total, typesettingschedule, typesettingscheduleText} = me.getTypeSettingSchedule();

        progressbar && comp.remove(progressbar);

        comp.add({
            xtype: 'progressbar',
            animate: false,
            hidden: !total,
            itemId: 'progressbar',
            text: typesettingscheduleText,
            value: typesettingschedule,
            width: 300
        })
    },
    initComponent: function () {
        var me = this,
            {orderId, statusId, record, orderNumber} = me,
            controller = Ext.create('CGP.common.typesettingschedule.controller.Controller'),
            // 生产中及之后的状态
            paibanIngState = [9358697, 120, 121, 122, 106, 107, 108, 109],
            itemGenerateStatus = record?.get('itemGenerateStatus'),
            isSuccessGenerateStatus = (!itemGenerateStatus) || (itemGenerateStatus === 'SUCCESS'); //老订单没这字段 为空都算成功

        var actioncolumnGather = [
            {
                xtype: 'button',
                iconCls: 'icon_query icon_margin',
                itemId: 'actioncheck',
                tooltip: '查看详细',
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

        if (!paibanIngState.includes(statusId)) {
            actioncolumnGather.push({
                xtype: 'button',
                iconCls: 'icon_reset icon_margin',
                itemId: 'reorder',
                tooltip: '重新排版',
                hidden: !(isSuccessGenerateStatus && !paibanIngState.includes(statusId)),
                handler: function (view, rowIndex, colIndex, action, event, record) {
                    var orderItemId = record.raw.datas.orderItemId,
                        contorller = Ext.create('CGP.orderlineitem.controller.OrderLineItem');

                    Ext.Msg.confirm(i18n.getKey('提示'), i18n.getKey('是否重新排版? (重排不会清除排版文件)'), function (selector) {
                        if (selector === 'yes') {
                            contorller.rePrint(orderId, orderItemId, false, function () {
                                Ext.Msg.alert('提示', `重排请求发起成功;\n将在大约10秒后开始重排!`, function () {
                                    setTimeout(() => {
                                        me.gridStore.load();
                                    }, 10000);
                                })
                            });
                        }
                    })
                }
            })
        }

        me.items = [
            {
                xtype: 'searchcontainer',
                itemId: 'typeSetting',
                autoScroll: true,
                filterCfg: {
                    header: false,
                    layout: {
                        type: 'table',
                        columns: 3
                    },
                    defaults: {
                        isLike: false
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            name: 'orderNumber',
                            itemId: 'orderNumber',
                            fieldLabel: i18n.getKey('orderNumber'),
                            hidden: true,
                            value: orderNumber,
                            margin: '5 10'
                        },
                        {
                            xtype: 'textfield',
                            name: 'datas.orderItemId',
                            itemId: 'datas.orderItemId',
                            fieldLabel: i18n.getKey('orderLineItem'),
                            margin: '5 10'
                        },
                        {
                            xtype: 'combo',
                            name: 'status',
                            itemId: 'status',
                            isLike: false,
                            editable: false,
                            store: {
                                fields: ['key', 'value'],
                                data: [
                                    {
                                        key: 'FINISHED',
                                        value: i18n.getKey('FINISHED'),
                                    },
                                    {
                                        key: 'FAILURE',
                                        value: i18n.getKey('FAILURE'),
                                    },
                                    {
                                        key: 'RUNNING',
                                        value: i18n.getKey('RUNNING'),
                                    },
                                    {
                                        key: 'WAITING',
                                        value: i18n.getKey('WAITING'),
                                    },
                                ]
                            },
                            valueField: 'key',
                            displayField: 'value',
                            fieldLabel: i18n.getKey('status'),
                        },
                        /* {
                             xtype: 'combo',
                             fieldLabel: i18n.getKey('生产基地'),
                             name: 'manufactureCenter',
                             itemId: 'manufactureCenter',
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
                             }
                         }*/
                    ]
                },
                gridCfg: {
                    store: me.gridStore,
                    showRowNum: false,
                    editAction: false,
                    deleteAction: false,
                    columnDefaults: {
                        align: 'center'
                    },
                    columns: [
                        {
                            xtype: 'actioncolumn',
                            tdCls: 'vertical-middle',
                            width: 80,
                            sortable: false,
                            items: actioncolumnGather,
                        },
                        {
                            text: i18n.getKey('序号'),
                            width: 120,
                            dataIndex: 'seqNo',
                        },
                        {
                            xtype: 'atagcolumn',
                            text: i18n.getKey('orderLineItem'),
                            width: 120,
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
                            width: 120,
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
                                return JSCreateHTMLTable(result, 'left');

                            }
                        },
                        {
                            xtype: 'imagecolumn',
                            tdCls: 'vertical-middle',
                            width: 150,
                            dataIndex: 'datas',
                            text: i18n.getKey('thumbnail'),
                            buildUrl: function (value, metadata, record) {
                                var thumbnail = value['productInfo']['thumbnail'];
                                return projectThumbServer + thumbnail;
                            },
                            buildPreUrl: function (value, metadata, record) {
                                var thumbnail = value['productInfo']['thumbnail'];
                                return projectThumbServer + thumbnail;
                            },
                            buildTitle: function (value, metadata, record) {
                                var thumbnail = value['productInfo']['thumbnail'];
                                return i18n.getKey('check') + ` < ${thumbnail} > ` + i18n.getKey('预览图');
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
                        /* {
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
                            flex: 1,
                            minWidth: 350,
                            dataIndex: 'startTime',
                            align: 'left',
                            renderer: function (value, metadata, record) {
                                var hour, minute, second, groupTime;
                                var controller = Ext.create('CGP.common.typesettingschedule.controller.Controller')
                                var startTime = controller.getEndTime(value);
                                var endTime = controller.getEndTime(record.get('endTime'));
                                var time = startTime + ` ~ ` + endTime;
                                var takeTime = ((new Date(+record.get('endTime')) - new Date(+value)) / 1000).toFixed(0);
                                if (value && record.get('endTime')) {
                                    groupTime = takeTime + i18n.getKey('秒');
                                    if (takeTime > 60) {
                                        minute = Math.floor(takeTime / 60);
                                        second = takeTime - (minute * 60);
                                        groupTime = minute + '分' + second + '秒';
                                    }
                                    if (minute > 60) {
                                        minute = Math.floor(takeTime / 60);
                                        hour = Math.floor(minute / 60);
                                        second = takeTime - (minute * 60);
                                        minute = minute - (hour * 60);
                                        groupTime = hour + '小时' + minute + '分' + second + '秒';
                                    }
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
                    pagingBar: false,
                    bbar: {//底端的分页栏
                        xtype: 'pagingtoolbar',
                        store: me.gridStore,
                        displayInfo: true, // 是否 ? 示， 分 ? 信息
                        displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                        emptyMsg: i18n.getKey('noData'),
                        listeners: {
                            afterrender: function (comp) {
                                me.gridStore.on('load', function () {
                                    me.upDataTypeSetting(comp);
                                })
                            }
                        }
                    },
                },
            },
        ];
        me.callParent();
    }
})
