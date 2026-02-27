/**
 * @author xiu
 * @date 2025/11/21
 */
Ext.define('CGP.orderstatusmodify.view.CreateShipmentItemTypeSettingPageV2', {  //v1没有过滤栏 所以写了个v2
    extend: 'Ext.ux.ui.GridPage',
    alias: 'widget.shipment_item_type_setting_v2',
    block: 'orderstatusmodify',
    editPage: 'edit.html',
    i18nblock: i18n.getKey('orderstatusmodify'),
    initComponent: function () {
        var me = this,
            configId = JSGetQueryString('configId'),
            pageType = JSGetQueryString('pageType'),
            controller = Ext.create('CGP.orderstatusmodify.controller.Controller'),
            store = Ext.create('CGP.orderstatusmodify.store.ShipmentItemTypeSettingStore', {
                pageType: pageType,
                configId: configId
            });

        me.config = {
            block: me.block,
            tbarCfg: {
                hidden: true,
                hiddenButtons: ['config', 'help', 'export', 'import'],
                btnCreate: {
                    handler: function () {
                        JSOpen({
                            id: me.block + me.editSuffix,
                            url: path + "partials/" + me.block + "/" + me.editPage,
                            title: me.pageText.create + '_' + me.i18nblock,
                            refresh: true
                        });
                    }
                },
            },
            gridCfg: {
                xtype: 'uxgridpage',
                store: store,
                itemId: 'grid',
                showRowNum: false,
                editAction: false,
                deleteAction: false,
                selModel: {
                    selType: 'rowmodel',
                },
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
                            return projectThumbServer + value + '/100/100';
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
                                            title: i18n.getKey('sku'),
                                            value: productSku,
                                        },
                                        {
                                            title: i18n.getKey('名称'),
                                            value: productName,
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
                        dataIndex: 'seqNo',
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
                        dataIndex: 'seqNo',
                        renderer: function (value, metadata, record, row, col, store) {
                            var composingTaskExecutionTimeStatistics = record.get('composingTaskExecutionTimeStatistics');
                            if (composingTaskExecutionTimeStatistics) {
                                var {subTasks, taskId} = composingTaskExecutionTimeStatistics,
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
                                                // 获取过滤对应类型的所有任务 返回[]
                                                generatePageArr = controller.getFilterKeySubTask(allItemSubTasks, 'type', 'GENERATE_PAGE'), //生成page
                                                impressionArr = controller.getFilterKeySubTask(allItemSubTasks, 'type', 'IMPRESSION'),  //大版生成
                                                distributeArr = controller.getFilterKeySubTask(allItemSubTasks, 'type', 'DISTRIBUTE'),  //分发大版

                                                // 获取对应任务集合的总耗时 返回{ waitingTimeMsTotal, runningTimeMsTotal }
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
                                    // 统一处理
                                    diySetValue: function (data) {
                                        if (data) {
                                            var me = this,
                                                items = me.items.items;

                                            items.forEach(item => {
                                                var {name, isFilterComp} = item;
                                                if (!isFilterComp) {
                                                    item.diySetValue ? item.diySetValue(data[name]) : item.setValue(data[name]);
                                                }
                                            })
                                        }
                                    },
                                    defaults: {
                                        xtype: 'uxfieldcontainer',
                                        labelAlign: 'left',
                                        labelWidth: 90,
                                        layout: 'hbox',
                                        margin: '0 0 10 10',
                                        defaults: {
                                            xtype: 'displayfield',
                                            labelWidth: 60,
                                            allowBlank: true,
                                            margin: '0 10 0 0',
                                            minWidth: 140,
                                        },
                                        diySetValue: function (data) {
                                            if (data) {
                                                var me = this,
                                                    items = me.items.items;

                                                items.forEach(item => {
                                                    var {name, itemId} = item;
                                                    if (itemId) {
                                                        item.setValue(data[name]);
                                                        // 存在才显示
                                                        item.setVisible(!!data[name]);
                                                    }
                                                })
                                            }
                                        },
                                    },
                                    items: [
                                        {
                                            name: 'init',
                                            itemId: 'init',
                                            fieldLabel: i18n.getKey('初始化'),
                                            items: [
                                                {
                                                    name: 'waitingTimeMs',
                                                    itemId: 'waitingTimeMs',
                                                    fieldLabel: i18n.getKey('等待时间'),
                                                },
                                                {
                                                    labelWidth: 30,
                                                    name: 'runningTimeMs',
                                                    itemId: 'runningTimeMs',
                                                    fieldLabel: i18n.getKey('耗时'),
                                                }
                                            ],
                                        },
                                        {
                                            layout: 'vbox',
                                            fieldLabel: i18n.getKey('排版进度'),
                                            name: 'composingJob',
                                            itemId: 'composingJob',
                                            labelAlign: 'top',
                                            diySetValue: function (data) {
                                                if (data) {
                                                    var me = this,
                                                        items = me.items.items;

                                                    items.forEach(item => {
                                                        var {name} = item;
                                                        item.diySetValue ? item.diySetValue(data[name]) : item.setValue(data[name]);
                                                    })
                                                }
                                            },
                                            defaults: {
                                                xtype: 'uxfieldcontainer',
                                                layout: 'hbox',
                                                allowBlank: true,
                                                labelAlign: 'left',
                                                labelWidth: 60,
                                                margin: '0 0 0 20',
                                                defaults: {
                                                    xtype: 'displayfield',
                                                    labelWidth: 60,
                                                    allowBlank: true,
                                                    margin: '0 10 0 20',
                                                    minWidth: 120,
                                                },
                                                // labelSeparator: '', //不使用冒号
                                                diySetValue: function (data) {
                                                    if (data) {
                                                        var me = this,
                                                            items = me.items.items;

                                                        items.forEach(item => {
                                                            var {name, itemId} = item;
                                                            if (itemId) {
                                                                item.setValue(data[name]);
                                                                // 存在才显示
                                                                item.setVisible(!!data[name]);
                                                            }
                                                        })
                                                    }
                                                },
                                            },
                                            items: [
                                                {
                                                    fieldLabel: i18n.getKey('Page生成'),
                                                    name: 'GENERATE_PAGE',
                                                    itemId: 'GENERATE_PAGE',
                                                    items: [
                                                       /* {
                                                            xtype: 'displayfield',
                                                            labelSeparator: '', //不使用冒号
                                                            labelWidth: 5,
                                                            width: 5,
                                                            margin: '0 5 0 0',
                                                            fieldLabel: i18n.getKey('['),
                                                        },*/
                                                        {
                                                            name: 'waitingTimeMsTotal',
                                                            itemId: 'waitingTimeMsTotal',
                                                            margin: '0 10 0 10',
                                                            fieldLabel: i18n.getKey('等待时间'),
                                                        },
                                                        {
                                                            labelWidth: 30,
                                                            name: 'runningTimeMsTotal',
                                                            itemId: 'runningTimeMsTotal',
                                                            fieldLabel: i18n.getKey('耗时'),
                                                        },
                                                        /*{
                                                            xtype: 'displayfield',
                                                            labelSeparator: '', //不使用冒号
                                                            labelWidth: 5,
                                                            width: 5,
                                                            margin: '0 20 0 5',
                                                            fieldLabel: i18n.getKey(']'),
                                                        },*/
                                                    ],
                                                },
                                                {
                                                    fieldLabel: i18n.getKey('大版生成'),
                                                    name: 'IMPRESSION',
                                                    itemId: 'IMPRESSION',
                                                    items: [
                                                       /* {
                                                            xtype: 'displayfield',
                                                            labelSeparator: '', //不使用冒号
                                                            labelWidth: 5,
                                                            width: 5,
                                                            margin: '0 5 0 0',
                                                            fieldLabel: i18n.getKey('['),
                                                        },*/
                                                        {
                                                            name: 'waitingTimeMsTotal',
                                                            itemId: 'waitingTimeMsTotal',
                                                            margin: '0 10 0 10',
                                                            fieldLabel: i18n.getKey('等待时间'),
                                                        },
                                                        {
                                                            labelWidth: 30,
                                                            name: 'runningTimeMsTotal',
                                                            itemId: 'runningTimeMsTotal',
                                                            fieldLabel: i18n.getKey('耗时'),
                                                        },
                                                       /* {
                                                            xtype: 'displayfield',
                                                            labelSeparator: '', //不使用冒号
                                                            labelWidth: 5,
                                                            width: 5,
                                                            margin: '0 20 0 5',
                                                            fieldLabel: i18n.getKey(']'),
                                                        },*/
                                                    ],
                                                },
                                                {
                                                    fieldLabel: i18n.getKey('分发大版'),
                                                    name: 'DISTRIBUTE',
                                                    itemId: 'DISTRIBUTE',
                                                    items: [
                                                        /*{
                                                            xtype: 'displayfield',
                                                            labelSeparator: '', //不使用冒号
                                                            labelWidth: 5,
                                                            width: 5,
                                                            margin: '0 5 0 0',
                                                            fieldLabel: i18n.getKey('['),
                                                        },*/
                                                        {
                                                            name: 'waitingTimeMsTotal',
                                                            itemId: 'waitingTimeMsTotal',
                                                            margin: '0 10 0 10',
                                                            fieldLabel: i18n.getKey('等待时间'),
                                                        },
                                                        {
                                                            labelWidth: 30,
                                                            name: 'runningTimeMsTotal',
                                                            itemId: 'runningTimeMsTotal',
                                                            fieldLabel: i18n.getKey('耗时'),
                                                        },
                                                       /* {
                                                            xtype: 'displayfield',
                                                            labelSeparator: '', //不使用冒号
                                                            labelWidth: 5,
                                                            width: 5,
                                                            margin: '0 20 0 5',
                                                            fieldLabel: i18n.getKey(']'),
                                                        },*/
                                                    ],
                                                },
                                            ]
                                        },
                                        {
                                            name: 'generateSmuContent',
                                            itemId: 'generateSmuContent',
                                            fieldLabel: i18n.getKey('生成内容套'),
                                            items: [
                                                {
                                                    name: 'waitingTimeMs',
                                                    itemId: 'waitingTimeMs',
                                                    fieldLabel: i18n.getKey('等待时间'),
                                                },
                                                {
                                                    labelWidth: 30,
                                                    name: 'runningTimeMs',
                                                    itemId: 'runningTimeMs',
                                                    fieldLabel: i18n.getKey('耗时'),
                                                }
                                            ],
                                        },
                                        {
                                            xtype: 'atag_displayfield',
                                            margin: '0 0 0 350',
                                            itemId: 'checkInfoBtn',
                                            value: i18n.getKey('详情'),
                                            tooltip: '查看_排版详情',
                                            isFilterComp: true,
                                            clickHandler: function (field) {
                                                JSOpen({
                                                    id: 'typesettingschedule',
                                                    url: path + "partials/typesettingschedule/edit.html?id=" + taskId,
                                                    title: i18n.getKey('check') + '_' + i18n.getKey('typesettingschedule') + '(' + taskId + ')',
                                                    refresh: true
                                                })
                                            },
                                        },
                                    ],
                                    listeners: {
                                        afterrender: function (comp) {
                                            // 给排版耗时预览赋值
                                            comp.diySetValue(typeGather);
                                        },
                                    }
                                }
                            } else {
                                return {
                                    xtype: 'displayfield',
                                    value: '无'
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
            },
            filterCfg: {
                items: [
                    {
                        xtype: 'numberfield',
                        name: 'seqNo',
                        itemId: 'seqNo',
                        hideTrigger: true,
                        isLike: false,
                        fieldLabel: i18n.getKey('订单项序号'),
                    },
                    {
                        xtype: 'combo',
                        name: 'paibanStatus',
                        itemId: 'paibanStatus',
                        isLike: false,
                        editable: false,
                        haveReset: true,
                        store: Ext.create('Ext.data.Store', {
                            fields: ['value', 'display'],
                            data: [
                                {
                                    value: 4,
                                    display: i18n.getKey('排版成功')
                                },
                                {
                                    value: 3,
                                    display: i18n.getKey('排版失败')
                                },
                                {
                                    value: 2,
                                    display: i18n.getKey('正在排版')
                                },
                                {
                                    value: 1,
                                    display: i18n.getKey('等待排版')
                                }
                            ]
                        }),
                        valueField: 'value',
                        displayField: 'display',
                        fieldLabel: i18n.getKey('排版状态'),
                    },
                    {
                        xtype: 'combo',
                        name: 'manufactureStatus',
                        itemId: 'manufactureStatus',
                        isLike: false,
                        editable: false,
                        haveReset: true,
                        store: Ext.create('Ext.data.Store', {
                            fields: ['value', 'display'],
                            data: [
                                {
                                    value: 'PRODUCTION_COMPLETE',
                                    display: i18n.getKey('生产完成')
                                },
                                {
                                    value: 'PRODUCTION_ING',
                                    display: i18n.getKey('生产中')
                                },
                                {
                                    value: 'PUSH_COMPLETE',
                                    display: i18n.getKey('已推送')
                                },
                                {
                                    value: 'WAITING_PUSH',
                                    display: i18n.getKey('等待推送')
                                }
                            ]
                        }),
                        valueField: 'value',
                        displayField: 'display',
                        fieldLabel: i18n.getKey('生产状态'),
                    },
                ]
            }
        }
        me.callParent();
    },
    constructor: function (config) {
        var me = this;
        me.initConfig(config);
        me.callParent([config]);
    },
})