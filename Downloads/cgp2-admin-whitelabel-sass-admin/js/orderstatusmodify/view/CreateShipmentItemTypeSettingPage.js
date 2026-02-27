/**
 * @author xiu
 * @date 2025/11/21
 */
Ext.define('CGP.orderstatusmodify.view.CreateShipmentItemTypeSettingPage', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.shipment_item_type_setting',
    layout: 'fit',
    initComponent: function () {
        var me = this,
            configId = JSGetQueryString('configId'),
            pageType = JSGetQueryString('pageType'),
            controller = Ext.create('CGP.orderstatusmodify.controller.Controller'),
            store = Ext.create('CGP.orderstatusmodify.store.ShipmentItemTypeSettingStore', {
                pageType: pageType,
                configId: configId
            });

        me.items = [
            {
                xtype: 'uxgridpage',
                store: store,
                itemId: 'grid',
                pagingBar: false,
                showRowNum: false,
                editAction: false,
                deleteAction: false,
                selModel: 'SINGLE',
                defaults: {
                    tdCls: 'vertical-middle'
                },
                columns: [
                    /* {
                         xtype: 'rownumberer',
                         itemId: 'rownumberer',
                         width: 20,
                         tdCls: 'vertical-middle'
                     },*/
                    {
                        text: i18n.getKey('订单项序号'),
                        dataIndex: 'seqNo',
                        sortable: false,
                        width: 120,
                        align: 'center',  // 使内容居中
                    },
                    {
                        xtype: 'imagecolumn',
                        tdCls: 'vertical-middle',
                        width: 150,
                        dataIndex: 'thumbnail',
                        text: i18n.getKey('图片'),
                        buildUrl: function (value, metadata, record) {
                            return projectThumbServer + value;
                        },
                        buildPreUrl: function (value, metadata, record) {
                            return projectThumbServer + value;
                        },
                        buildTitle: function (value, metadata, record) {
                            if (value) {
                                return `${i18n.getKey('check')} < ${value} > 预览图`;
                            }
                        }
                    },
                    {
                        text: i18n.getKey('产品信息'),
                        width: 400,
                        dataIndex: 'productInfo',
                        renderer: function (value, metadata, record) {
                            if (value) {
                                var {productId, productName, productInstanceId, productSku} = value,
                                    result = [
                                        {
                                            title: i18n.getKey('名称'),
                                            value: productName,
                                        },
                                        {
                                            title: i18n.getKey('sku'),
                                            value: productSku,
                                        },
                                    ]

                                return JSCreateHTMLTable(result);
                            }
                        },
                    },
                    {
                        text: i18n.getKey('排版状态'),
                        width: 200,
                        dataIndex: 'paibanStatus',
                        renderer: function (value, metadata, record, row, col, store) {
                            var paibanGather = {
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
                                        text: i18n.getKey(''),
                                    }
                                },
                                {color, text} = paibanGather[value || 0];

                            return JSCreateFont(color, true, text);
                        }
                    },
                    {
                        text: i18n.getKey('生产状态') + ` <div class="icon_help" data-qtip="推送LEMS的返回状态" style="width:15px;height:15px;display: inline-block"></div>`,
                        width: 200,
                        dataIndex: 'productionStatus',
                        renderer: function (value, metadata, record, row, col, store) {
                            var productionStatusGather = {
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
                                        text: i18n.getKey(''),
                                    }
                                },
                                {color, text} = productionStatusGather[value || 0];

                            return JSCreateFont(color, true, text);
                        }
                    },
                    {
                        text: i18n.getKey('等待排版耗时') + ` <div class="icon_help" data-qtip="订单进入后台后到开始排版的等待时间" style="width:15px;height:15px;display: inline-block"></div>`,
                        width: 400,
                        dataIndex: 'seqNo',
                        renderer: function (value, metadata, record, row, col, store) {
                            var waitingTimeMs = record.get('waitingTimeMs'),
                                waitPaibanTime = record.get('waitPaibanTime'),
                                waitPaibanEndTime = record.get('waitPaibanEndTime'),
                                result = [
                                    {
                                        title: i18n.getKey('执行时间'),
                                        value: `${controller.getEndTime(waitPaibanTime)} ~ ${controller.getEndTime(waitPaibanEndTime)}`,
                                    },
                                    {
                                        title: i18n.getKey('耗时'),
                                        value: JSGetTakeTime(waitPaibanTime, waitPaibanEndTime),
                                    }
                                ]

                            return JSCreateHTMLTable(result);
                        }
                    },
                    {
                        text: i18n.getKey('排版耗时'),
                        width: 400,
                        dataIndex: 'runningTimeMs',
                        /*renderer: function (value, metadata, record, row, col, store) {
                            var composingTaskExecutionTimeStatistics = record.get('composingTaskExecutionTimeStatistics'),
                                startTime = composingTaskExecutionTimeStatistics?.startTime,
                                endTime = composingTaskExecutionTimeStatistics?.endTime,
                                result = [
                                    {
                                        title: i18n.getKey('执行时间'),
                                        value: `${controller.getEndTime(startTime)} ~ ${controller.getEndTime(endTime)}`,
                                    },
                                    {
                                        title: i18n.getKey('耗时'),
                                        value: controller.getTimeDiffType(value || 0),
                                    }
                                ]

                            return JSCreateHTMLTable(result);
                        },*/
                        renderer: function (value, metadata, record, row, col, store) {
                            var paibanStartTime = record.get('paibanStartTime'),
                                paibanEndTime = record.get('paibanEndTime'),
                                executeTimeText = paibanStartTime ? `${controller.getEndTime(paibanStartTime)} ~ ${controller.getEndTime(paibanEndTime)}` : `未获取到信息`,
                                result = [
                                    {
                                        title: i18n.getKey('执行时间'),
                                        value: executeTimeText,
                                    },
                                    {
                                        title: i18n.getKey('耗时'),
                                        value: JSGetTakeTime(paibanStartTime, paibanEndTime),
                                    }
                                ]

                            return JSCreateHTMLTable(result);
                        }
                    },
                    {
                        xtype: 'componentcolumn',
                        text: i18n.getKey('排版耗时概览'),
                        width: 450,
                        dataIndex: 'composingTaskExecutionTimeStatistics',
                        renderer: function (value, metadata, record, row, col, store) {
                            if (value) {
                                var {subTasks} = value,
                                    initArr = controller.getFilterKeySubTask(subTasks, 'type', 'INIT_ORDERITEM_CONTEXT'),
                                    composingJobArr = controller.getFilterKeySubTask(subTasks, 'type', 'COMPOSING_JOB'),
                                    generateSmuContentArr = controller.getFilterKeySubTask(subTasks, 'type', 'GENERATE_SMU_CONTENT'),
                                    typeGather = {
                                        init: function () {
                                            var initData = initArr[0], //初始化只会有一项
                                                {waitingTimeMs, startTime, endTime} = initData,
                                                runningTimeMs = JSGetTakeTime(startTime, endTime);

                                            return {
                                                waitingTimeMs: controller.getTimeDiffType(waitingTimeMs),  //等待时间
                                                runningTimeMs: runningTimeMs,  //执行用时
                                            }
                                        }(),
                                        composingJob: function () {
                                            // 集合排版内所有的子任务
                                            var allItemSubTasks = controller.getAllItemSubTasks(composingJobArr),
                                                // 过滤出对应类型的任务
                                                generatePageArr = controller.getFilterKeySubTask(allItemSubTasks, 'type', 'GENERATE_PAGE'),
                                                impressionArr = controller.getFilterKeySubTask(allItemSubTasks, 'type', 'IMPRESSION'),
                                                distributeArr = controller.getFilterKeySubTask(allItemSubTasks, 'type', 'DISTRIBUTE'),
                                                // 对应任务集合的耗时
                                                generatePageTimeMs = controller.getAllSubTasksTimeMs(generatePageArr),
                                                impressionTimeMs = controller.getAllSubTasksTimeMs(impressionArr),
                                                distributeTimeMs = controller.getAllSubTasksTimeMs(distributeArr);

                                            return {
                                                GENERATE_PAGE: generatePageTimeMs,
                                                IMPRESSION: impressionTimeMs,
                                                DISTRIBUTE: distributeTimeMs,
                                            }
                                        }(),
                                        generateSmuContent: function () {
                                            var generateSmuContentData = generateSmuContentArr[0], //生成内容套只会有一项
                                                {waitingTimeMs, startTime, endTime} = generateSmuContentData,
                                                runningTimeMs = JSGetTakeTime(startTime, endTime);

                                            return {
                                                waitingTimeMs: controller.getTimeDiffType(waitingTimeMs),  //等待时间
                                                runningTimeMs: runningTimeMs,  //执行用时
                                            }
                                        }(),
                                    }

                                return {
                                    xtype: 'uxfieldcontainer',
                                    layout: {
                                        type: 'vbox',
                                        align: 'middle' // 垂直居中
                                    },
                                    width: '100%',
                                    defaults: {},
                                    items: [
                                        {
                                            xtype: 'uxfieldcontainer',
                                            layout: 'hbox',
                                            fieldLabel: i18n.getKey('初始化'),
                                            defaults: {
                                                xtype: 'displayfield',
                                                labelWidth: 60,
                                                allowBlank: true,
                                                margin: '0 0 0 40',
                                            },
                                            diySetValue: function (data) {
                                                if (data) {
                                                    var me = this,
                                                        items = me.items.items;

                                                    items.forEach(item => {
                                                        var {name} = item;
                                                        item.setValue(data[name]);
                                                        // 存在才显示
                                                        item.setVisible(!!data[name]);
                                                    })
                                                }
                                            },
                                            items: [
                                                {
                                                    name: 'waitingTimeMs',
                                                    fieldLabel: i18n.getKey('等待时间'),
                                                },
                                                {
                                                    labelWidth: 30,
                                                    name: 'runningTimeMs',
                                                    fieldLabel: i18n.getKey('耗时'),
                                                }
                                            ],
                                            listeners: {
                                                afterrender: function (comp) {
                                                    comp.diySetValue(typeGather['init']);
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'uxfieldcontainer',
                                            layout: 'vbox',
                                            fieldLabel: i18n.getKey('排版进度'),
                                            defaults: {
                                                xtype: 'uxfieldcontainer',
                                                layout: 'hbox',
                                                allowBlank: true,
                                                labelAlign: 'left',
                                                labelWidth: 50,
                                                margin: '0 0 0 40',
                                                diySetValue: function (data) {
                                                    if (data) {
                                                        var me = this,
                                                            items = me.items.items;

                                                        items.forEach(item => {
                                                            var {name} = item;
                                                            item.setValue(data[name]);
                                                            // 存在才显示
                                                            item.setVisible(!!data[name]);
                                                        })
                                                    }
                                                },
                                                listeners: {
                                                    afterrender: function (comp) {
                                                        var {name} = comp,
                                                            composingJobData = typeGather['composingJob'];

                                                        comp.diySetValue(composingJobData[name]);
                                                    }
                                                }
                                            },
                                            items: [
                                                {
                                                    fieldLabel: i18n.getKey('page生成'),
                                                    name: 'GENERATE_PAGE',
                                                    itemId: 'GENERATE_PAGE',
                                                    defaults: {
                                                        xtype: 'displayfield',
                                                        labelWidth: 60,
                                                        allowBlank: true,
                                                        margin: '0 0 0 20'
                                                    },
                                                    items: [
                                                        {
                                                            name: 'waitingTimeMsTotal',
                                                            fieldLabel: i18n.getKey('等待时间'),
                                                        },
                                                        {
                                                            labelWidth: 30,
                                                            name: 'runningTimeMsTotal',
                                                            fieldLabel: i18n.getKey('耗时'),
                                                        }
                                                    ],
                                                },
                                                {
                                                    fieldLabel: i18n.getKey('大版生成'),
                                                    name: 'IMPRESSION',
                                                    itemId: 'IMPRESSION',
                                                    defaults: {
                                                        xtype: 'displayfield',
                                                        labelWidth: 60,
                                                        allowBlank: true,
                                                        margin: '0 0 0 20'
                                                    },
                                                    items: [
                                                        {
                                                            name: 'waitingTimeMsTotal',
                                                            fieldLabel: i18n.getKey('等待时间'),
                                                        },
                                                        {
                                                            labelWidth: 30,
                                                            name: 'runningTimeMsTotal',
                                                            fieldLabel: i18n.getKey('耗时'),
                                                        }
                                                    ],
                                                },
                                                {
                                                    fieldLabel: i18n.getKey('分发大版'),
                                                    name: 'DISTRIBUTE',
                                                    itemId: 'DISTRIBUTE',
                                                    defaults: {
                                                        xtype: 'displayfield',
                                                        labelWidth: 60,
                                                        allowBlank: true,
                                                        margin: '0 0 0 20'
                                                    },
                                                    items: [
                                                        {
                                                            name: 'waitingTimeMsTotal',
                                                            fieldLabel: i18n.getKey('等待时间'),
                                                        },
                                                        {
                                                            labelWidth: 30,
                                                            name: 'runningTimeMsTotal',
                                                            fieldLabel: i18n.getKey('耗时'),
                                                        }
                                                    ],
                                                },
                                            ]
                                        },
                                        {
                                            xtype: 'uxfieldcontainer',
                                            layout: 'hbox',
                                            fieldLabel: i18n.getKey('生成内容套'),
                                            defaults: {
                                                xtype: 'displayfield',
                                                labelWidth: 60,
                                                allowBlank: true,
                                                margin: '0 0 0 40'
                                            },
                                            diySetValue: function (data) {
                                                if (data) {
                                                    var me = this,
                                                        items = me.items.items;

                                                    items.forEach(item => {
                                                        var {name} = item;
                                                        item.setValue(data[name]);
                                                        // 存在才显示
                                                        item.setVisible(!!data[name]);
                                                    })
                                                }
                                            },
                                            items: [
                                                {
                                                    name: 'waitingTimeMs',
                                                    fieldLabel: i18n.getKey('等待时间'),
                                                },
                                                {
                                                    labelWidth: 30,
                                                    name: 'runningTimeMs',
                                                    fieldLabel: i18n.getKey('耗时'),
                                                }
                                            ],
                                            listeners: {
                                                afterrender: function (comp) {
                                                    console.log(typeGather['generateSmuContent']);
                                                    comp.diySetValue(typeGather['generateSmuContent']);
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'atag_displayfield',
                                            margin: '0 0 0 300',
                                            itemId: 'checkInfoBtn',
                                            value: i18n.getKey('详情'),
                                            tooltip: '查看_排版详情',
                                            clickHandler: function (field) {
                                                var composingTaskExecutionTimeStatistics = record.get('composingTaskExecutionTimeStatistics'),
                                                    taskId = composingTaskExecutionTimeStatistics?.taskId;

                                                JSOpen({
                                                    id: 'typesettingschedule',
                                                    url: path + "partials/typesettingschedule/edit.html?id=" + taskId,
                                                    title: i18n.getKey('check') + '_' + i18n.getKey('typesettingschedule') + '(' + taskId + ')',
                                                    refresh: true
                                                })
                                            },
                                        },
                                    ]
                                }
                            }
                        }
                    },
                    {
                        text: i18n.getKey('生产时间') + ` <div class="icon_help" data-qtip="推送LEMS成功的起始时间和生产完成反馈的时间" style="width:15px;height:15px;display: inline-block"></div>`,
                        width: 350,
                        dataIndex: 'productionPostTime',
                        renderer: function (value, metadata, record, row, col, store) {
                            var productionFinishTime = record.get('productionFinishTime'),
                                executeTimeText = value ? `${controller.getEndTime(value)} ~ ${controller.getEndTime(productionFinishTime)}` : `未获取到信息`,
                                result = [
                                    {
                                        title: i18n.getKey('执行时间'),
                                        value: executeTimeText,
                                    },
                                    {
                                        title: i18n.getKey('耗时'),
                                        value: JSGetTakeTime(value, productionFinishTime),
                                    }
                                ]

                            return JSCreateHTMLTable(result);
                        }
                    },

                ],
                bbar: {
                    xtype: 'pagingtoolbar',
                    store: store,
                    displayInfo: true, // 是否 ? 示， 分 ? 信息
                    displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                    emptyText: i18n.getKey('noDat')
                }
            },
           ]

        me.callParent();
    },
})