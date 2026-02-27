/**
 * PushConfigData
 * @Author: miao
 * @Date: 2021/11/16
 */
Ext.define("CGP.tools.view.PushConfigData", {
    extend: "Ext.ux.form.ErrorStrickForm",
    alias: 'widget.pushconfigdata',
    border: 0,
    padding: '10',
    width: '100%',
    autoScroll: true,
    isValidForItems: true,
    fieldDefaults: {
        labelAlign: 'right',
        width: 380,
        labelWidth: 120,
        msgTarget: 'side'
    },
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.tools.controller.PushConfigData');
        var tableStore = Ext.create('CGP.tools.store.PushConfigData', {
            data: [
                {"name": "authresources", "description": "身份验证资源", groupId: 'base'},
                {"name": "permissions", "description": "权限", groupId: 'base'},
                {"name": "navigators", "description": "导航", groupId: 'base'},
                {'name': 'roles', "description": "角色", groupId: 'base'},
                {"name": "languageresources", "description": "多语言配置", groupId: 'base'},
                {'name': 'businessexceptioninfos', 'description': 'businessExceptionInfos', groupId: 'base'},
                {"name": "cmssaasspages", "description": "cmssaasspages", groupId: 'CMS'},
                {"name": "cmscontexts", "description": "cmscontexts", groupId: 'CMS'},
                {"name": "cmssaaspagetemplates", "description": "cmssaaspagetemplates", groupId: 'CMS'},
                {'name': 'cmsconfigs', 'description': 'cmsconfigs', groupId: 'CMS'},
                {"name": "productcategories", "description": "productcategories", groupId: 'CMS'},
                {'name': 'productofcatalogs', 'description': 'productofcatalogs', groupId: 'CMS'},
            ]
        });
        me.tbar = [
            {
                itemId: 'btnExecute',
                text: i18n.getKey('execute'),
                handler: function (btn) {
                    var me = this,
                        pushForm = btn.ownerCt.ownerCt,
                        toolbar = btn.ownerCt;
                    if (!pushForm.isValid()) {
                        return false;
                    }
                    var pushData = pushForm.getValue(),
                        url = '',
                        method = 'PUT';
                    var data = {
                        'remark': pushData.remark,
                        'sourceEnvironment': 'current',
                        'targetEnvironment': pushData.targetEnvironment
                    };
                    var btnExecute = toolbar.getComponent('btnExecute');
                    var progressBar = toolbar.getComponent('progressBar');
                    var syncResult = toolbar.getComponent('syncResult');
                    if (pushData && pushData.tableNames) {
                        progressBar.setVisible(true);
                        progressBar.updateProgress(0, i18n.getKey('synchronizing') + '...', true);
                        btnExecute.setDisabled(true);
                        syncResult.setVisible(false);
                        // 再次请求时 清空原数组中的数据
                        var selectDataLength = pushData.tableNames.length;
                        // 延迟循环 防止一次性发送多次请求导致接口崩溃
                        var count = 0;
                        var taskIds = [];
                        var timer = setInterval(function () {
                            var item = pushData.tableNames[count];
                            var grid = Ext.getCmp('log-' + item.name + '-grid');
                            if (grid) {
                                var extraData = grid.getValue();
                                try {
                                    if (extraData) {
                                        data.query = Ext.JSON.decode(extraData);
                                    }
                                } catch (e) {
                                    Ext.Msg.alert('error', e);
                                    clearInterval(timer);
                                    progressBar.setVisible(false);
                                    syncResult.setVisible(false);
                                    btnExecute.setDisabled(false);
                                    return;
                                }
                            }
                            url = Ext.String.format(adminPath + 'api/collections/{0}/merger?upsert=' + pushData.upsert, item.name);
                            ++count;
                            JSAjaxRequest(encodeURI(url), method, true, data, false, function (require, success, response) {
                                if (success) {
                                    var responseMessage = Ext.JSON.decode(response.responseText);
                                    if (responseMessage.success == true) {
                                        taskIds.push(responseMessage.data);
                                    }
                                }
                                if (count == selectDataLength) {
                                    pushForm.buildBackgroundTask(taskIds);
                                }
                            }, false);
                            if (count == selectDataLength) {
                                clearInterval(timer);
                            }
                        }, 100);
                    }
                }
            },
            {
                xtype: 'progressbar',
                text: i18n.getKey('synchronizing') + '...',
                width: 300,
                animate: true,
                hidden: true,
                itemId: 'progressBar',
            },
            {
                itemId: 'syncResult',
                text: i18n.getKey('sync') + i18n.getKey('result'),
                hidden: true,
                store: '',
                handler: function (btn) {
                    var me = this;
                    var diyStore = Ext.create('Ext.data.Store', {
                        fields: ['_id', 'status', 'failureDesc', 'collection', 'synchronization'],
                        groupField: 'synchronization',
                        pageSize: 25,
                        data: me.store,
                        proxy: {
                            type: 'memory',
                            root: 'data',
                            reader: 'json'
                        },
                        autoLoad: true,
                    });
                    var win = Ext.create('Ext.window.Window', {
                        title: i18n.getKey('check') + i18n.getKey('synchronization'),
                        itemId: 'checkSynchronousRegime',
                        layout: 'fit',
                        width: 700,
                        height: 450,
                        modal: true,
                        autoScroll: true,
                        items: [
                            {
                                xtype: 'grid',
                                store: diyStore,
                                columns: [
                                    {
                                        xtype: 'rownumberer',
                                        align: 'center',
                                        width: 40
                                    },
                                    {
                                        dataIndex: '_id',
                                        text: i18n.getKey('id'),
                                        width: 100,
                                    },
                                    {
                                        dataIndex: 'collection',
                                        text: i18n.getKey('name'),
                                        width: 200,
                                    },
                                    {
                                        dataIndex: 'status',
                                        text: i18n.getKey('status'),
                                        width: 100
                                    },
                                    {
                                        dataIndex: 'synchronization',
                                        text: i18n.getKey('synchronization'),
                                        hidden: true,
                                    },
                                    {
                                        text: i18n.getKey('failureDesc'),
                                        dataIndex: 'failureDesc',
                                        xtype: 'componentcolumn',
                                        sortable: false,
                                        flex: 1,
                                        renderer: function (value, metadata, record) {
                                            return {
                                                xtype: 'displayfield',
                                                value: '<a href="#")>' + i18n.getKey('check') + '</a>',
                                                listeners: {
                                                    render: function (display) {
                                                        var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                                        var ela = Ext.fly(a); //获取到a元素的element封装对象
                                                        ela.on("click", function () {
                                                            JSShowJsonData(value, '错误信息');
                                                        });
                                                    }
                                                }
                                            };
                                        }
                                    },
                                ],
                                features: [
                                    {
                                        ftype: 'grouping',
                                        groupByText: '用本字段分组',
                                        showGroupsText: '显示分组',
                                        groupHeaderTpl: i18n.getKey('synchronization') + ': ' + `{name}`,
                                        startCollapsed: false
                                    }
                                ],
                            }
                        ],
                    });
                    win.show()
                }
            },
        ];
        var targetEnv = me.filterTargetEnv();
        me.items = [
            {
                xtype: 'combo',
                fieldLabel: i18n.getKey('targetEnv'),
                store: Ext.create('Ext.data.Store', {
                    fields: ['name', 'value'],
                    data: targetEnv
                }),
                editable: false,
                allowBlank: false,
                valueField: 'value',
                queryMode: 'local',
                displayField: 'name',
                labelAlign: 'right',
                margin: '10px 0px 5px 0px',
                name: 'targetEnvironment'
            },
            {
                xtype: 'textfield',
                fieldLabel: i18n.getKey('description'),
                labelAlign: 'right',
                allowBlank: true,
                name: 'remark'
            },
            {
                xtype: 'combo',
                fieldLabel: i18n.getKey('同步模式'),
                labelAlign: 'right',
                allowBlank: true,
                name: 'upsert',
                editable: false,
                valueField: 'value',
                displayField: 'display',
                value: false,
                store: {
                    xtype: 'store',
                    fields: [
                        'value', 'display'
                    ],
                    data: [{
                        value: true,
                        display: '同Id数据直接覆盖'
                    }, {
                        value: false,
                        display: '同Id数据跳过'
                    }]
                }
            },
            {
                xtype: 'gridfield',
                fieldLabel: i18n.getKey('table') + i18n.getKey('name'),
                name: 'tableNames',
                itemId: 'tableNames',
                labelWidth: 120,
                width: 900,
                allowBlank: false,
                labelAlign: 'right',
                gridConfig: {
                    renderTo: JSGetUUID(),
                    selModel: Ext.create("Ext.selection.CheckboxModel", {
                        mode: "multi",//multi,simple,single；默认为多选multi
                        checkOnly: true,//如果值为true，则只用点击checkbox列才能选中此条记录
                    }),
                    menuDisabled: false,
                    store: tableStore,
                    width: '100%',
                    features: [
                        {ftype: 'grouping'}
                    ],
                    plugins: [{
                        ptype: 'rowexpander',
                        rowBodyTpl: new Ext.XTemplate(
                            '<div style="width: 100%" id="log-{name}" ></div>'
                        )
                    }],
                    viewConfig: {
                        listeners: {
                            expandbody: function (tr, obj, selector, event) {
                               ;
                                var raw = obj.raw;
                                var dom = document.getElementById('log-' + raw.name);
                                if (Ext.isEmpty(dom.innerHTML)) {
                                    var grid = Ext.create('Ext.ux.form.field.UxTextArea', {
                                        renderTo: 'log-' + raw.name,
                                        width: 600,
                                        height: 150,
                                        id: 'log-' + raw.name + '-grid',
                                        itemId: 'log-' + raw.name + '-grid',
                                        margin: '0 100',
                                        toolbarConfig: {
                                            items: [
                                                {
                                                    xtype: 'splitbutton',
                                                    text: i18n.getKey('模板'),
                                                    iconCls: 'icon_tool', //your iconCls here
                                                    menu: [
                                                        {
                                                            text: i18n.getKey('指定id'),
                                                            handler: function (btn) {
                                                                var str = '{\n' +
                                                                    '    "_id":{\n' +
                                                                    '        "$in":[\n' +
                                                                    '            ids\n' +
                                                                    '        ]}\n' +
                                                                    '}';
                                                                var textarea = btn.ownerCt.ownerButton.ownerCt.ownerCt.textarea;
                                                                textarea.setValue(str);
                                                            },
                                                        },
                                                    ]
                                                }]
                                        },
                                        fieldLabel: i18n.getKey('额外参数'),
                                        listeners: {
                                            el: {
                                                dblclick: function (event) {
                                                    event.stopEvent();
                                                   ;
                                                    console.log('elDblclick')
                                                }
                                            }
                                        }
                                    })
                                }
                            }
                        },
                    },
                    region: "center",
                    tbar: [
                        {
                            text: i18n.getKey('add'),
                            itemId: 'addBtn',
                            iconCls: 'icon_add',
                            handler: function (btn) {
                                var grid = btn.ownerCt.ownerCt;
                                controller.addTable(grid);
                            }
                        }
                    ],
                    columns: [
                        {xtype: 'rownumberer'},
                        {
                            dataIndex: 'name',
                            text: i18n.getKey('name'),
                            tdCls: 'vertical-middle',
                            align: 'center',
                            width: 250,
                            menuDisabled: true
                        },
                        {
                            dataIndex: 'description',
                            text: i18n.getKey('description'),
                            tdCls: 'vertical-middle',
                            align: 'center',
                            width: 300,
                            flex: 1,
                            menuDisabled: true
                        }
                    ]
                },
                isValid: function () {
                    var me = this, isValid = true;
                    var selectedes = me.getGrid().getSelectionModel().getSelection();
                    if (!me.allowBlank && selectedes.length < 1) {
                        isValid = false;
                    }
                    return isValid;
                },
                getErrors: function () {
                    return '至少选择一个表同步数据'
                }
            }
        ];
        me.callParent(arguments);
    },
    /**
     *
     */
    buildBackgroundTask: function (taskIds) {
        var me = this;
        var tbar = me.getDockedItems('toolbar[dock="top"]')[0];
        var syncResult = tbar.getComponent('syncResult');
        var btnExecute = tbar.getComponent('btnExecute');
        var progressBar = tbar.getComponent('progressBar');
        var result = [];
        for (var i = 0; i < taskIds.length; i++) {
            var url = adminPath + 'api/collections/' + taskIds[i] + '/progressLog';
            (function (url) {
                var url = url;
                var fun = function () {
                    console.log(timer);
                    JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
                        if (success) {
                            var responseText = Ext.JSON.decode(response.responseText);
                            var data = responseText.data;
                            var dataStatus = data.status;
                            // 判断结束条件
                            if (dataStatus == 'failure' || dataStatus == 'success') {
                                result.push(data);
                            }
                            // 结束时关闭该循环
                            if (dataStatus == 'failure' || dataStatus == 'success') {
                                clearInterval(timer);
                                progressBar.updateProgress(result.length / taskIds.length, (result.length / taskIds.length) * 100 + '%', true);
                                if (taskIds.length == result.length) {
                                    btnExecute.setDisabled(false);
                                    syncResult.setVisible(true);
                                    syncResult.store = result;
                                    progressBar.updateProgress(0, i18n.getKey('sync') + i18n.getKey('completed'), true);
                                }
                            }
                        } else {
                            result.push({});
                            clearInterval(timer);
                        }
                    }, false)
                };
                var timer = setInterval(fun, 1000);
            })(url);
        }
    },
    filterTargetEnv: function () {
        var me = this;
        var targetEnv = [
            {name: '开发测试', value: 'dev'},
            {name: '内部测试', value: 'test'},
            {name: 'feat_test', value: 'feat_test'},
            {name: '正式环境', value: 'prod'},
            {name: '微软云', value: 'azure_prod'}
        ];
        Ext.Array.each(targetEnv, function (item, index) {
            if (item.value == window.env) {
                targetEnv.splice(index, 1);
                return false;
            }
        })
        return targetEnv;
    },
    getValue: function () {
        var me = this, data = {};
        var items = me.items.items;
        for (var item of items) {
            if (item.name == 'tableNames') {
                var selecteds = item.getGrid().getSelectionModel().getSelection(), selData = [];
                selecteds.forEach(function (rec) {
                    selData.push(rec.data);
                })
                data[item.name] = selData;
            } else {
                data[item.name] = item.getValue()
            }
        }
        return data;
    }
});
