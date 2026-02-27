/**
 * @Description:
 * @author xiu
 * @date 2023/1/11
 */
Ext.syncRequire([
    'CGP.common.typesettingschedule.view.NewInteriorContainer',
])
Ext.define('CGP.common.typesettingschedule.view.NewFieldsetContainer', {
    extend: 'Ext.container.Container',
    alias: 'widget.new_fieldset_container',
    layout: 'hbox',
    width: '100%',
    params: null,
    initComponent: function () {
        var me = this,
            {
                data,
                time,
                type,
                value,
                index,
                takeTime,
                endTime,
                startTime,
                endTimeText,
                startTimeText,
                errorCode,
                errorInfo,
                relatedInfo,
                stageStatus,
                tooltipText,
                subTasksItem,
                errorInfo_zh,
                imageResolutionModifyRecordItems
            } = me['params'],
            {datas} = data,
            {fileSizeExceptionInfo} = datas,
            isHideDetailBtn = (!['FINISHED'].includes(stageStatus['isSuccess'])) || (type === 'DISTRIBUTE'),
            // isHideImageInfo = (index !== 0) || (type === 'DISTRIBUTE') || !imageResolutionModifyRecordItems.length,
            isHideImageInfo = !imageResolutionModifyRecordItems.length,
            takeTimeText = (data['endTime'] && JSGetTakeTime(data['startTime'], data['endTime'])) || '无';

        me.items = [
            {
                xtype: 'new_interior_container',
                itemId: 'interiorContainer',
                allowBlank: true,
                hidden: (index !== 2) || (!data['stages'].length), //只在分发大版 却data存在的时候 显示
                index: index,
                initData: data,
                status: me.status,
                endTime: endTimeText,
                takeTime: takeTime,
                startTime: startTimeText,
                subTasks: me.subTasks,
                subTasksItem: subTasksItem,
                titleLabel: i18n.getKey(value),
                detailBtnConfig: {
                    hidden: !['FINISHED'].includes(stageStatus['isSuccess']),
                    tooltip: i18n.getKey('跳转至') + tooltipText[index],
                    handler: function () {
                        var clickFn = {
                            0: function () {
                                var jobConfigId = data.datas.jobConfigId;
                                var orderItemId = JSGetQueryString('orderItemId');
                                var pageConfigId = data.datas.pageConfigId;
                                JSOpen({
                                    id: 'pageTask',
                                    url: path + 'partials/typesettingschedule/detail.html' +
                                        '?type=0&jobConfigId=' + jobConfigId +
                                        '&orderItemId=' + orderItemId +
                                        '&pageConfigId=' + pageConfigId +
                                        '&time=' + time,
                                    title: i18n.getKey('pageTask执行详情'),
                                })
                            },
                            1: function () {
                                var jobTaskId = data.datas.jobTaskId;
                                JSOpen({
                                    id: 'impressionDetail',
                                    url: path + 'partials/typesettingschedule/detail.html' +
                                        '?type=1&jobTaskId=' + jobTaskId +
                                        '&time=' + time,
                                    title: i18n.getKey('大版详情'),
                                })
                            },
                            2: function () {
                                var jobTaskId = data.datas.jobTaskId;
                                JSOpen({
                                    id: 'distributeDetail',
                                    url: path + 'partials/typesettingschedule/detail.html' +
                                        '?type=2&jobTaskId=' + jobTaskId +
                                        '&time=' + time,
                                    title: i18n.getKey('分发详情'),
                                })
                            },
                        }
                        clickFn[index]()
                    }
                }
            },
            {
                xtype: 'button',
                componentCls: "btnOnlyIcon",
                iconCls: 'icon_detail',
                hidden: isHideDetailBtn,
                margin: '10 10 0 0',
                tooltip: i18n.getKey('跳转至') + tooltipText[index],
                handler: function (btn) {
                    var clickFn = {
                        0: function () {
                            var jobConfigId = data.datas.jobConfigId;
                            var orderItemId = JSGetQueryString('orderItemId');
                            var pageConfigId = data.datas.pageConfigId;
                            JSOpen({
                                id: 'pageTask',
                                url: path + 'partials/typesettingschedule/detail.html' +
                                    '?type=0&jobConfigId=' + jobConfigId +
                                    '&orderItemId=' + orderItemId +
                                    '&pageConfigId=' + pageConfigId +
                                    '&time=' + time,
                                title: i18n.getKey('pageTask执行详情'),
                            })
                        },
                        1: function () {
                            var jobTaskId = data.datas.jobTaskId;
                            JSOpen({
                                id: 'impressionDetail',
                                url: path + 'partials/typesettingschedule/detail.html' +
                                    '?type=1&jobTaskId=' + jobTaskId +
                                    '&time=' + time,
                                title: i18n.getKey('大版详情'),
                            })
                        },
                        2: function () {
                            var jobTaskId = data.datas.jobTaskId;
                            JSOpen({
                                id: 'distributeDetail',
                                url: path + 'partials/typesettingschedule/detail.html' +
                                    '?type=2&jobTaskId=' + jobTaskId +
                                    '&time=' + time,
                                title: i18n.getKey('分发详情'),
                            })
                        },
                    }
                    clickFn[index]()
                }
            },
            {
                xtype: 'displayfield',
                labelWidth: 70,
                margin: '10 0 0 0',
                value: value
            },
            /*{
                xtype: 'button',
                itemId: 'time',
                margin: '10 0 0 0',
                iconCls: 'icon_time',
                componentCls: "btnOnlyIcon",
                tooltip: JSCreateHTMLTable([
                    {
                        title: i18n.getKey('执行时间'),
                        value: time || '未查询到信息'
                    },
                    {
                        title: i18n.getKey('用时'),
                        value: data['endTime'] && JSGetTakeTime(data['startTime'], data['endTime'])
                    }
                ], 'right'),
            },*/
            {
                xtype: 'button',
                itemId: 'timeText',
                componentCls: "btnOnlyIcon",
                margin: '10 0 0 0',
                text: JSCreateFont('gray', true, `用时: ${takeTimeText}`),
                tooltip: JSCreateHTMLTable([
                    {
                        title: i18n.getKey('执行时间'),
                        value: time
                    },
                    {
                        title: i18n.getKey('用时'),
                        value: takeTimeText
                    }
                ], 'right'),
            },
            {
                xtype: 'button',
                margin: '10 0 0 0',
                itemId: 'errorInfo',
                iconCls: 'icon_errorInfo',
                componentCls: "btnOnlyIcon",
                hidden: !(subTasksItem['status'] === 'FAILURE'),
                tooltip: subTasksItem ? '点击查看_错误信息' : '未查询到_错误信息',
                handler: function (btn) {
                    subTasksItem && Ext.create('Ext.window.Window', {
                        modal: true,
                        constrain: true,
                        width: 600,
                        maxHeight: 700,
                        title: i18n.getKey('check') + '_' + i18n.getKey('错误信息'),
                        autoScroll: true,
                        layout: 'fit',
                        items: [
                            {
                                xtype: 'uxfieldcontainer',
                                margin: '5 10 5 10',
                                defaults: {
                                    xtype: 'displayfield',
                                    labelWidth: 100,
                                    allowBlank: true,
                                },
                                autoScroll: true,
                                items: [
                                    {
                                        fieldLabel: i18n.getKey('失败时间'),
                                        value: endTimeText,
                                    },
                                    {
                                        fieldLabel: i18n.getKey('错误代码'),
                                        value: errorCode,
                                    },
                                    {
                                        xtype: 'fieldcontainer',
                                        layout: 'hbox',
                                        defaults: {
                                            xtype: 'displayfield',
                                            labelWidth: 100,
                                            allowBlank: true,
                                        },
                                        width: '100%',
                                        items: [
                                            {
                                                xtype: 'displayfield',
                                                readOnly: true,
                                                autoScroll: true,
                                                width: '95%',
                                                itemId: 'errorInfo',
                                                fieldStyle: {border: 'none'},
                                                fieldLabel: i18n.getKey('错误信息'),
                                                value: errorInfo,
                                            },
                                            {
                                                xtype: 'displayfield',
                                                readOnly: true,
                                                autoScroll: true,
                                                width: '95%',
                                                itemId: 'errorInfo_zh',
                                                hidden: true,
                                                fieldStyle: {border: 'none'},
                                                fieldLabel: i18n.getKey('错误信息_中文'),
                                                value: errorInfo_zh,
                                            },
                                            {
                                                xtype: 'button',
                                                iconCls: 'icon_switch_type',
                                                componentCls: "btnOnlyIcon",
                                                tooltip: '更换中文',
                                                isChangeZh: false,
                                                handler: function (btn) {
                                                    const parentComp = btn.ownerCt,
                                                        errorInfo = parentComp.getComponent('errorInfo'),
                                                        errorInfo_zh = parentComp.getComponent('errorInfo_zh');

                                                    errorInfo.setVisible(btn.isChangeZh);
                                                    errorInfo_zh.setVisible(!btn.isChangeZh);
                                                    btn.setTooltip(btn.isChangeZh ? '更换中文' : '更换English');
                                                    btn.isChangeZh = !btn.isChangeZh;
                                                }
                                            },
                                        ]
                                    },
                                    {
                                        xtype: 'uxfieldcontainer',
                                        fieldLabel: i18n.getKey('相关参数'),
                                        defaults: {
                                            xtype: 'displayfield',
                                            labelWidth: 160,
                                            allowBlank: true,
                                            margin: '0 0 0 80'
                                        },
                                        items: relatedInfo
                                    },
                                ]
                            }
                        ]
                    }).show()
                }
            },
            {
                xtype: 'button',
                itemId: 'imageInfo',
                margin: '10 0 0 0',
                iconCls: (subTasksItem['status'] === 'FAILURE') ? 'icon_imageErrorInfo' : 'icon_imageInfo',
                componentCls: "btnOnlyIcon",
                hidden: isHideImageInfo,
                tooltip: imageResolutionModifyRecordItems.length ? '点击查看_图片缩放信息' : '未查询到_图片缩放信息',
                handler: function (btn) {
                    imageResolutionModifyRecordItems.length && Ext.create('Ext.window.Window', {
                        modal: true,
                        constrain: true,
                        title: i18n.getKey('check') + '_' + i18n.getKey('图片缩放信息'),
                        autoScroll: true,
                        maxHeight: 700,
                        items: [
                            {
                                xtype: 'uxfieldcontainer',
                                margin: '5 10 5 10',
                                defaults: {
                                    xtype: 'displayfield',
                                    labelWidth: 160,
                                    allowBlank: true,
                                    margin: '5 25 15 25'
                                },
                                autoScroll: true,
                                items: imageResolutionModifyRecordItems
                            }
                        ]
                    }).show()
                }
            },
            {
                xtype: 'button',
                itemId: 'recordInfo',
                margin: '10 0 0 0',
                iconCls: (subTasksItem['status'] === 'FAILURE') ? 'icon_recordInfo' : 'icon_recordInfo',
                componentCls: "btnOnlyIcon",
                hidden: !fileSizeExceptionInfo?.length,
                tooltip: fileSizeExceptionInfo?.length ? '点击查看_档案传输异常信息' : '未查询到_档案传输异常信息',
                handler: function (btn) {
                    fileSizeExceptionInfo.length && Ext.create('Ext.window.Window', {
                        modal: true,
                        constrain: true,
                        title: i18n.getKey('查看') + '_' + i18n.getKey('档案传输异常信息'),
                        autoScroll: true,
                        width: 700,
                        maxHeight: 700,
                        layout: 'fit',
                        items: [
                            {
                                xtype: 'grid',
                                itemId: 'grid',
                                store: {
                                    fields: [
                                        'filePath',
                                        {
                                            name: 'originalFileSize',
                                            type: 'number'
                                        },
                                        {
                                            name: 'uploadedFileSize',
                                            type: 'number'
                                        },
                                    ],
                                    data: fileSizeExceptionInfo
                                },
                                columns: [
                                    {
                                        xtype: 'rownumberer',
                                        tdCls: 'vertical-middle',
                                    },
                                    {
                                        text: i18n.getKey('文件大小变化'),
                                        dataIndex: 'originalFileSize',
                                        width: 150,
                                        renderer: function (value, metadata, record) {
                                            var uploadedFileSize = record.get('uploadedFileSize');
                                            return `${value} -> ${uploadedFileSize}`;
                                        }
                                    },
                                    {
                                        xtype: 'componentcolumn',
                                        text: i18n.getKey('文件路径'),
                                        dataIndex: 'filePath',
                                        flex: 1,
                                        renderer: function (value, metaData, record) {
                                            if (value) {
                                                return {
                                                    xtype: 'container',
                                                    width: '100%',
                                                    value: value,
                                                    layout: 'column',
                                                    items: [
                                                        {
                                                            xtype: 'button',
                                                            iconCls: 'icon_copy',
                                                            itemId: 'copyBtn',
                                                            componentCls: 'btnOnlyIconV2',
                                                            ui: 'default-toolbar-small',
                                                            width: 30,
                                                            margin: '0px 5px',
                                                            tooltip: '复制路径',
                                                            handler: function (btn, Msg) {
                                                                const range = document.createRange();
                                                                var dom = btn.ownerCt.getComponent('url').el.dom;
                                                                range.selectNode(dom); //获取复制内容的 id 选择器
                                                                const selection = window.getSelection();  //创建 selection对象
                                                                if (selection.rangeCount > 0) selection.removeAllRanges(); //如果页面已经有选取了的话，会自动删除这个选区，没有选区的话，会把这个选取加入选区
                                                                selection.addRange(range); //将range对象添加到selection选区当中，会高亮文本块
                                                                document.execCommand('copy'); //复制选中的文字到剪贴板
                                                                Msg && Ext.Msg.alert('prompt', '复制成功');
                                                            }
                                                        },
                                                        {
                                                            xtype: 'component',
                                                            itemId: 'url',
                                                            html: JSAutoWordWrapStr(value),
                                                            columnWidth: 0.8
                                                        }
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                ],
                            }
                        ]
                    }).show()
                }
            },
        ]
        me.callParent();
    }
})