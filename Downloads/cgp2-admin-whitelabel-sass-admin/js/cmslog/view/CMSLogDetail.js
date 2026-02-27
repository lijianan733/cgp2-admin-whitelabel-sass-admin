/**
 * @Description:发布记录详情，发布中的状态需要特殊处理，显示加载的进度条
 * @author nan
 * @date 2022/5/10
 */
Ext.Loader.syncRequire([
    'CGP.cmslog.view.FeatureBlock',
    'CGP.cmslog.model.CMSPublishRecordModel',
    'CGP.cmslog.config.Config',
    'CGP.cmslog.view.DetailGrid',
    'CGP.common.steps.StepBar',
    'CGP.common.stepv2.StepBarV2'
])
Ext.define('CGP.cmslog.view.CMSLogDetail', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.cmslogdetail',
    isValidForItems: true,
    defaults: {
        margin: '5 0 5 0'
    },
    record: null,
    bodyStyle: 'overflow-x:hidden;overflow-y:auto',
    tbar: {
        defaults: {
            margin: '0 15 0 0',
        },
        layout: {
            type: 'hbox',
        },
        items: []
    },
    items: [
        {
            xtype: 'featureblock',
            title: i18n.getKey('发布进度'),
            componentArr: [
                {
                    xtype: 'step_bar_v2',
                    width: 800,
                    margin: '15 0 0 0',
                    layout: 'hbox',
                    itemId: 'step_bar_v2',
                    allowItemClick: false,
                    allowClickChangeProcess: false,
                    stepItemContainerArr: [
                        {
                            xtype: 'step_item_container',
                            stepTitleConfig: {
                                width: '100%',
                                html: '校验CMS配置'
                            },
                        },
                        {
                            xtype: 'step_item_container',
                            stepTitleConfig: {
                                width: '100%',
                                html: '调用CMS系统'
                            },
                        },
                        {
                            xtype: 'step_item_container',
                            stepTitleConfig: {
                                width: '100%',
                                html: '生成CMS发布页'
                            },
                        },
                        {
                            xtype: 'step_item_container',
                            stepTitleConfig: {
                                width: '100%',
                                html: '连接Jenkins'
                            },
                        },
                        {
                            xtype: 'step_item_container',
                            stepTitleConfig: {
                                width: '100%',
                                html: 'Jenkins发布中'
                            },
                        },
                        {
                            xtype: 'step_item_container',
                            stepTitleConfig: {
                                width: '100%',
                                html: 'Jenkins发布结果'
                            },
                        }
                    ],
                    diySetValue: function (data) {
                        var me = this;
                        var index = 0;
                        var resultStatus = 2;
                        var status = data.status;
                        if (status == 0) {
                            index = 0;
                            resultStatus = -1;
                        } else if (status == 2) {
                            index = 1;
                            resultStatus = 1;
                        } else if (status == 3) {
                            index = 2;
                            resultStatus = -1;
                        } else if (status == 4) {
                            index = 2;
                            resultStatus = 1;
                        } else if (status == 5) {
                            index = 3;
                            resultStatus = -1;
                        } else if (status == 6) {
                            index = 4;
                            resultStatus = 1;
                        } else if (status == 7) {
                            index = 5;
                            resultStatus = -1;
                        } else if (status == 200) {
                            index = 5;
                            resultStatus = 1;
                        }
                        var afterSetProcess = function () {
                            var map = {
                                0: '校验CMS配置',
                                1: '调用CMS系统',
                                2: '生成CMS发布页',
                                3: '连接Jenkins',
                                4: 'Jenkins发布中',
                                5: 'Jenkins发布结果',
                            };
                            me.items.each(function (item, index) {
                                if (item.status == -1) {
                                    item.updateTitle(map[index] + '\n(' + i18n.getKey('failure') + ')');
                                } else if (item.status == 0) {
                                } else if (item.status == 1) {
                                    item.updateTitle(map[index] + '\n(' + i18n.getKey('success') + ')');
                                }
                            })
                        };
                        if (me.rendered == true) {
                            me.setProcess(index, resultStatus);
                            afterSetProcess();
                        } else {
                            me.on('afterrender', function () {
                                me.setProcess(index, resultStatus);
                                afterSetProcess();
                            });
                        }
                    },
                },
                /*
                                {
                                    xtype: 'stepbar',
                                    data: [
                                        {
                                            stepName: "校验CMS配置",
                                            status: -1,
                                        },
                                        {
                                            stepName: "调用CMS系统",
                                            status: -1,
                                        },
                                        {
                                            stepName: "生成CMS发布页",
                                            status: -1,
                                        },
                                        {
                                            stepName: "连接Jenkins",
                                            status: -1,
                                        },
                                        {
                                            stepName: "Jenkins发布中",
                                            status: -1
                                        },
                                        {
                                            stepName: "Jenkins发布结果",
                                            status: -1,
                                        }
                                    ],
                                    margin: '25 0 0 0',
                                    itemId: 'stepBar',
                                    diySetValue: function (data) {
                                        var me = this;
                                        var index = 0;
                                        var resultStatus = 2;
                                        /!*      0: 'CMS发布配置错误',
                                                  1: '准备开始',
                                                  2: '成功调用到CMS系统',
                                                  3: 'CMS发布页生成失败',
                                                  4: 'CMS发布页生成成功',
                                                  5: '连接Jenkins失败',
                                                  6: 'Jenkins发布中',
                                                  7: 'Jenkins发布失败',
                                                  200: 'CMS发布成功'*!/
                                        var status = data.status;

                                        if (status == 0) {
                                            index = 0;
                                            resultStatus = 0;
                                        } else if (status == 2) {
                                            index = 1;
                                            resultStatus = 1;
                                        } else if (status == 3) {
                                            index = 2;
                                            resultStatus = 0;
                                        } else if (status == 4) {
                                            index = 2;
                                            resultStatus = 1;
                                        } else if (status == 5) {
                                            index = 3;
                                            resultStatus = 0;
                                        } else if (status == 6) {
                                            index = 4;
                                            resultStatus = 1;
                                        } else if (status == 7) {
                                            index = 5;
                                            resultStatus = 0;
                                        } else if (status == 200) {
                                            index = 5;
                                            resultStatus = 1;
                                        }
                                        if (me.rendered == true) {
                                            me.setProcess(index, resultStatus);
                                        } else {
                                            me.on('afterrender', function () {
                                                me.setProcess(index, resultStatus);
                                            })
                                        }
                                    },
                                    listeners: {
                                        afterSetProcess: function () {
                                            var me = this;
                                            me.items.each(function (item) {
                                                if (item.status == -1) {
                                                    item.updateTitle(me.items.items[count].stepName + '\n(' + i18n.getKey('failure') + ')');
                                                } else if (item.status == 0) {
                                                } else if (item.status == 1) {
                                                    item.updateTitle(item.stepName + '\n(' + i18n.getKey('success') + ')');
                                                }
                                            })
                                        }
                                    }
                                }
                */
            ],
            diySetValue: function (data) {
                /*       var stepBar = this.getComponent('stepBar');
                       stepBar.diySetValue(data);*/
                var step_bar_v2 = this.getComponent('step_bar_v2');
                step_bar_v2.diySetValue(data);
            },
        },
        {
            xtype: 'featureblock',
            title: i18n.getKey('baseInfo'),
            componentArr: [
                {
                    xtype: 'errorstrickform',
                    border: false,
                    itemId: 'form',
                    layout: {
                        type: 'table',
                        columns: 2
                    },
                    defaults: {
                        width: 350,
                        xtype: 'displayfield'
                    },
                    items: [
                        {
                            xtype: 'displayfield',
                            fieldLabel: i18n.getKey('publish') + i18n.getKey('type'),
                            name: 'publishType',
                            itemId: 'publishType',
                            renderer: function (value) {
                                value = value.split(',')
                                var map = {
                                    ProductDetail: '产品详情页',
                                    ProductCategory: '产品分类页',
                                    Normal: '普通页'
                                };
                                if (Ext.isArray(value)) {
                                    var data = value.map(function (item) {
                                        return map[item];
                                    });
                                    return data.toString();
                                }
                            }
                        },
                        {
                            xtype: 'displayfield',
                            fieldLabel: i18n.getKey('productMode'),
                            name: 'statusOfProduct',
                            itemId: 'statusOfProduct',
                            diySetValue: function (value) {
                                var me = this;
                                if (Ext.isEmpty(value)) {
                                    me.hide();
                                } else {
                                    me.setValue(value);
                                }
                            },
                            renderer: function (value) {
                                value = value.split(',');
                                if (Ext.isArray(value)) {
                                    var data = value.map(function (item) {
                                        var map = {
                                            TEST: '测试',
                                            RELEASE: '正式'
                                        }
                                        return map[item];
                                    });
                                    return data;
                                }
                            }
                        },
                        {
                            fieldLabel: i18n.getKey('publish') + i18n.getKey('total'),
                            name: 'total',
                            itemId: 'total',
                        },
                        {
                            fieldLabel: i18n.getKey('发布时间'),
                            name: 'createdDate',
                            itemId: 'createdDate',
                            renderer: function (value) {
                                value = Ext.Date.format(new Date(Number(value)), 'Y/m/d H:i');
                                return value;
                            }
                        },
                        {
                            fieldLabel: i18n.getKey('发布人'),
                            name: 'createdUser',
                            itemId: 'createdUser',
                            diySetValue: function (value) {
                                this.setValue(value.emailAddress);
                            }
                        },
                        {
                            fieldLabel: i18n.getKey('目标环境'),
                            name: 'targetEnv',
                            itemId: 'targetEnv',
                        },
                        {
                            xtype: 'displayfield',
                            fieldLabel: i18n.getKey('目标环境状态'),
                            name: 'targetEnvStatus',
                            itemId: 'targetEnvStatus',

                        }
                    ]
                }
            ],
            diySetValue: function (data) {
                var form = this.getComponent('form');
                form.setValue(data)
            }
        },
        {
            xtype: 'featureblock',
            title: i18n.getKey('生成的CMS发布页列表'),
            autoScroll: true,
            componentArr: [
                {
                    xtype: 'detailgrid',
                    resultStatus: null,
                    itemId: 'detailGrid',
                    selModel: Ext.create("Ext.selection.CheckboxModel", {
                        mode: "simple",
                    }),
                    autoScroll: true,
                }
            ],
            toolbarActionBtn: [
                {
                    xtype: 'displayfield',
                    value: ' 总数：8 成功： 5 失败： 3',
                    itemId: 'message',
                    margin: '0 5 0 0'
                },
                {
                    xtype: 'button',
                    text: '重新发布指定配置',
                    iconCls: 'icon_redo',
                    handler: function () {
                        var me = this;
                        var container = me.ownerCt.ownerCt;
                        var detailGrid = container.getComponent('detailGrid');
                        var selection = detailGrid.getSelectionModel().getSelection();
                        if (selection.length == 0) {
                            Ext.Msg.alert('提示', '请选择需发布的记录');
                        } else {
                            var controller = Ext.create('CGP.cmslog.controller.Controller');
                            //修改发布的内容
                            var selectionSources = [];
                            selection.map(function (item) {
                                selectionSources.push(item.get('cmsConfig')._id);
                            });
                            var data = controller.buildPublishData(container.ownerCt.record);
                            data.selectionSources = selectionSources;
                            Ext.Msg.confirm(i18n.getKey('prompt'), '是否确认重新发布?', function (selector) {
                                if (selector == 'yes') {
                                    controller.publish(data);
                                }
                            });
                        }
                    }
                }
            ],
            diySetValue: function (data) {
                var me = this;
                var detailGrid = this.getComponent('detailGrid');
                detailGrid.diySetValue(data.details, data);
                var toolbar = me.getDockedItems('toolbar[dock="top"]')[0];
                var message = toolbar.getComponent('message');
                var str = new Ext.Template("<font style= 'color:black;font-weight: bold'>总数:{0}&nbsp&nbsp&nbsp&nbsp</font>"
                    + "<font style='color:green;font-weight: bold'>成功:{1}&nbsp&nbsp&nbsp&nbsp</font>"
                    + "<font style='color:red;font-weight: bold'>失败:{2}&nbsp&nbsp&nbsp&nbsp</font>");
                message.setValue(str.apply([data.total, data.success, data.failure]));

            }
        },
        {
            xtype: 'featureblock',
            title: i18n.getKey('调用发布的接口参数'),
            componentArr: [{
                xtype: 'jsontreepanel',
                width: '100%',
                itemId: 'jsonTreePanel',
                minHeight: 70,
                maxHeight: 350,
                showValue: true,//默认只显示key
                canAddNode: false,
                autoScroll: true,
                editable: false,
                store: {
                    xtype: 'treestore',
                    autoLoad: true,
                    fields: [
                        'text', 'value'
                    ],
                    proxy: {
                        type: 'memory'
                    },
                    root: {
                        expanded: true,
                        children: []
                    }
                },
                keyColumnConfig: {
                    editable: false,
                    flex: 1
                },
                valueColumnConfig: {
                    renderer: function (value) {
                        return '<div style="white-space:normal;word-wrap:break-word; overflow:hidden;">' + value + '</div>'
                    },
                    flex: 3
                },
                extraBtn: [
                    {
                        index: 0,
                        config: {
                            xtype: 'button',
                            text: i18n.getKey('展开子节点'),
                            iconCls: 'icon_expand',
                            count: 0,//展开的次数
                            expandableNode: [],//一个可展开的节点的数组
                            handler: function (btn) {
                                var treePanel = btn.ownerCt.ownerCt;
                                if (btn.count == 0) {
                                    var rootNode = treePanel.getRootNode();
                                    rootNode.eachChild(function (item) {
                                        if (item.isLeaf() == true) {
                                        } else {
                                            item.expand();
                                            btn.expandableNode.push(item);
                                        }
                                    })
                                    btn.count++;
                                } else {
                                    var expandableNode = [];
                                    for (var i = 0; i < btn.expandableNode.length; i++) {
                                        var itemNode = btn.expandableNode[i];
                                        itemNode.eachChild(function (item) {
                                            if (item.isLeaf() == true) {
                                            } else {
                                                item.expand();
                                                expandableNode.push(item);
                                            }
                                        })
                                    }
                                    btn.expandableNode = expandableNode;
                                    btn.count++;
                                }

                            }
                        }
                    },
                    {
                        index: 2,
                        config: {
                            xtype: 'button',
                            text: i18n.getKey('check') + i18n.getKey('源JSON'),
                            iconCls: 'icon_check',
                            handler: function (btn) {
                                var treePanel = btn.ownerCt.ownerCt;
                                var valueString = JSON.stringify(treePanel.getValue(), null, "\t");
                                var win = Ext.create("Ext.window.Window", {
                                    id: "pageContentInstanceRange",
                                    modal: true,
                                    layout: 'fit',
                                    title: i18n.getKey('check') + i18n.getKey('源JSON'),
                                    items: [
                                        {
                                            xtype: 'textarea',
                                            fieldLabel: false,
                                            width: 600,
                                            height: 400,
                                            value: valueString
                                        }
                                    ]
                                });
                                win.show();
                            }
                        }
                    }
                ]
            }],
            diySetValue: function (data) {
                var jsonTreePanel = this.getComponent('jsonTreePanel');
                var snapshot = Ext.clone(data?.cmsPublishRequestSnapShot || {});
                delete snapshot?.extraParams;
                jsonTreePanel.setValue(snapshot);
            }
        },
        {
            xtype: 'featureblock',
            title: i18n.getKey('errorDetail'),
            componentArr: [{
                width: '100%',
                itemId: 'htmlEditor',
                xtype: 'htmleditor',
            }],
            diySetValue: function (data) {
                var me = this;
                if (data.message) {
                    var htmlEditor = this.getComponent('htmlEditor');
                    htmlEditor.setValue(data.message);
                    me.show();
                } else {
                    me.hide();
                }
            }
        }
    ],
    initComponent: function () {
        var me = this;
        me.callParent();
        me.on('afterrender', function () {
            me.refreshData();
        });
    },
    refreshData: function () {
        var me = this;
        JSSetLoading(true);
        CGP.cmslog.model.CMSPublishRecordModel.load(JSGetQueryString('id'), {
            scope: this,
            success: function (record) {
                me.diySetValue(record);
                me.toolbarControl(record);
                JSSetLoading(false);
            },
            failure: function () {
                JSSetLoading(false);
            },
            callback: function () {
                JSSetLoading(false);
            }
        })
    },
    diySetValue: function (record) {
        var me = this;
        me.record = record;
        var data = record.getData();
        var controller = Ext.create('CGP.cmslog.controller.Controller');
        var targetEnv = controller.judgeTargetEnv(data);
        data.targetEnv = targetEnv;
        me.suspendLayouts();
        for (var i = 0; i < me.items.items.length; i++) {
            var field = this.items.items[i];
            if (field.diySetValue) {//如果有自定义的设置值方式，优先使用
                field.diySetValue(data);
            } else {
                field.setValue(data);
            }
        }
        me.resumeLayouts()
        me.doLayout();
    },
    /**
     * 根据statusId决定工具栏内容,可以自定义额外的功能按钮
     */
    toolbarControl: function (record) {
        var me = this;
        var bbar = me.getDockedItems('toolbar[dock="top"]')[0];
        bbar.removeAll();
        //正式环境不给发布，只能发布stage环境然后通过切换服务器来进行更换
        var isProduction = /*false;*/(JSWebsiteIsStage() && (JSWebsiteIsTest() == false));
        var items = [
            {
                xtype: 'displayfield',
                labelStyle: 'font-weight: bold',
                fieldStyle: 'color:red;font-weight: bold',
                labelWidth: 65,
                value: record.getId(),
                fieldLabel: i18n.getKey('记录编号'),
                renderer: function (value) {
                    return i18n.getKey(value)
                }
            },
            {
                xtype: 'displayfield',
                labelStyle: 'font-weight: bold',
                fieldStyle: 'color:red;font-weight: bold',
                labelWidth: 65,
                value: record.get('status'),
                fieldLabel: i18n.getKey('publish') + i18n.getKey('status'),
                renderer: function (value) {
                    return CGP.cmslog.config.Config.statusMap[value];
                }
            },
            {
                xtype: 'progressbar',
                text: i18n.getKey('发布中...'),
                width: 300,
                cls: 'left-align',
                animate: true,
                hidden: record.get('status') != 6,
                listeners: {
                    afterrender: function () {
                        var p = this;
                        if (p.ownerCt.ownerCt.record.get('status') == 6) {
                            var panel = p.ownerCt.ownerCt;
                            var recordId = panel.record.getId();
                            var count = 0;
                            var timer = setInterval(function () {
                                count = count + 0.05;
                                if (count >= 0.9) {
                                    count = 0.9
                                }
                                p.updateProgress(count, null, true);
                                CGP.cmslog.model.CMSPublishRecordModel.load(recordId, {
                                    scope: panel,
                                    success: function (record) {
                                        var status = record.get('status');
                                        if (status != 6) {
                                            clearInterval(timer);
                                            panel.refreshData();
                                        }
                                    }
                                })
                            }, 2500);
                        }
                    }
                }
            },
            {
                //失败状态显示重试功能
                xtype: 'button',
                iconCls: 'icon_redo',
                disabled: isProduction,
                text: Ext.Array.contains([0, 3, 5, 7], record.get('status')) ? i18n.getKey('retry') : i18n.getKey('重新发布'),
                handler: function (btn) {
                    var detailPanel = btn.ownerCt.ownerCt;
                    var record = detailPanel.record;
                    Ext.Msg.confirm(i18n.getKey('prompt'), '是否确认重新发布?', function (selector) {
                        if (selector == 'yes') {
                            var controller = Ext.create('CGP.cmslog.controller.Controller');
                            var data = controller.buildPublishData(record);
                            controller.publish(data);
                        }
                    });
                }
            },
            {
                xtype: 'button',
                iconCls: 'icon_refresh',
                text: i18n.getKey('refresh'),
                handler: function (btn) {
                    var panel = btn.ownerCt.ownerCt;
                    panel.refreshData();
                }
            },
            {
                xtype: 'button',
                iconCls: 'icon_check',
                text: i18n.getKey('Jenkins发布信息'),
                hidden: !Ext.Array.contains([6, 7, 200], record.get('status')),
                handler: function (btn) {
                    var detailPanel = btn.ownerCt.ownerCt;
                    var record = detailPanel.record;
                    var url = record.raw.cmsPublishRecordLog.jenkinsPublishUrl;
                    url = url.replace('/buildWithParameters', '');
                    url += '/' + record.raw.cmsPublishRecordLog.jenkinsPublishVersion + '/console';
                    JSOpen({
                        id: 'JenkinsInfo',
                        url: url,
                        target: "nan",
                        title: i18n.getKey('JenkinsInfo'),
                        refresh: true,
                    })
                }
            }
        ];
        bbar.add(items);
    }
})

