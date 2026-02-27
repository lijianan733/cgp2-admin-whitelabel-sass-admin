Ext.Loader.syncRequire([
    'CGP.common.backgroundtask.BackgroundTask'
]);
Ext.onReady(function () {
    Ext.apply(Ext.form.field.VTypes, {
        filePath: function (v) {
            return !/^[/]$/.test(v);
        },
        filePathText: '路径开头不允许输入"/"',
        filePathMask: /[\w/]$/i,     //限制输入
    });
    var fileStore = Ext.create('CGP.tools.fileupload.store.FileValidStore');
    var page = Ext.create('Ext.container.Viewport', {
        layout: {
            type: 'fit',
        },
        bodyStyle: {
            paddingTop: 0,
        }
    });

    var env = [
        {name: '开发测试', value: 'dev'},
        {name: '内部测试', value: 'test'},
        {name: 'feat_test', value: 'feat_test'},
        {name: '微软云', value: 'azure_prod'}
    ];
    var getTargetEnv = function (env) {
        Ext.Array.each(env, function (item, index) {
            if (item.value == window.env) {
                env.splice(index, 1);
                return false;
            }
        })
        return env;
    };

    var targetEnv = getTargetEnv(Ext.clone(env));
    var fileNameStore = Ext.create('Ext.data.Store', {
        autoSync: true,
        fields: [
            {name: 'name', type: 'string'},
        ],
        proxy: {
            type: 'pagingmemory'
        },
        data: []
    })
    page.add([
        {
            xtype: 'tabpanel',
            items: [
                {
                    xtype: 'form',
                    autoScroll: false,
                    title: '文件上传',
                    height: '100%',
                    itemId: 'uploadFile',
                    bodyStyle: {
                        borderColor: 'silver'
                    },
                    defaults: {
                        margin: '5 25 5 25',
                        width: 450
                    },
                    items: [
                        {
                            xtype: 'checkboxfield',
                            name: 'type',
                            itemId: 'type',
                            editable: false,
                            fieldLabel: i18n.getKey('是否存到静态目录'),
                            displayField: 'display',
                            valueField: 'value',
                            listeners: {
                                change: function (field, newValue, oldValue) {
                                    var dirName = field.ownerCt.getComponent('dirName');
                                    dirName.setVisible(newValue);
                                    dirName.setDisabled(!newValue)
                                }
                            }
                        },
                        {
                            xtype: 'combo',
                            name: 'dirName',
                            itemId: 'dirName',
                            hidden: true,
                            disabled: true,
                            vtype: 'filePath',
                            emptyText: '文件路径 例:aa/bb/cc',
                            fieldLabel: i18n.getKey('目录'),
                            valueField: 'value',
                            displayField: 'display',
                            store: {
                                xtype: 'store',
                                fields: ['value', 'display'],
                                data: []
                            },
                        },

                        {
                            xtype: 'form',
                            border: false,
                            width: 600,
                            itemId: 'fileForm',
                            items: [
                                {
                                    xtype: 'uxfilefield',
                                    itemId: 'file',
                                    name: 'file',
                                    width: 600,
                                    allowBlank: false,
                                    autoScroll: true,
                                    margin: '5 0',
                                    enableKeyEvents: true,
                                    buttonText: i18n.getKey('choice'),
                                    fieldLabel: i18n.getKey('file'),
                                    getButtonMarginProp: function () {
                                        return 'margin-bottom:';
                                    },
                                    listeners: {
                                        change: function (data, value) {
                                            var fileDom = data.getEl().down('input[type=file]');
                                            var files = fileDom.dom.files;
                                            var fileHeight = '30';
                                            if (files.length > 1) {
                                                fileHeight = files.length * 30;
                                                data.setHeight(fileHeight);
                                            } else {
                                                data.setHeight(fileHeight);
                                            }
                                        }
                                    },
                                },
                            ]
                        },
                        {
                            xtype: 'gridfield',
                            itemId: 'result',
                            name: 'result',
                            fieldLabel: i18n.getKey('result'),
                            autoScroll: true,
                            gridConfig: {
                                tbar: [{
                                    xtype: 'button',
                                    text: i18n.getKey('同步以下文件'),
                                    iconCls: 'icon_import',
                                    handler: function (btn) {
                                        var grid = btn.ownerCt.ownerCt;
                                        var gridField = grid.gridField;
                                        var filesArr = gridField.getSubmitValue();
                                        var form = gridField.ownerCt;
                                        var tab = form.ownerCt;
                                        var syncFile = tab.getComponent('syncFile');
                                        var files = syncFile.getComponent('files');
                                        var arr = [];
                                        if (filesArr.length > 0) {
                                            filesArr.map(function (item) {
                                                var name = item.url.split('/').pop();
                                                arr.push({
                                                    name: name
                                                })
                                            });
                                            tab.setActiveTab(syncFile);
                                            var store = files.getStore();
                                            store.proxy.data = arr;
                                            store.load();
                                        } else {
                                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('请先上传文件'));
                                        }
                                    }
                                }],
                                store: fileStore,
                                width: 600,
                                maxHeight: 450,
                                minHeight: 150,
                                autoScroll: true,
                                columns: [
                                    {
                                        xtype: 'rownumberer',
                                        itemId: 'order',
                                        width: 40,
                                        tdCls: 'vertical-middle',
                                    },
                                    {
                                        xtype: 'auto_bread_word_column',
                                        text: i18n.getKey('originalFileName'),
                                        sortable: false,
                                        dataIndex: 'originalFileName',
                                        itemId: 'originalFileName',
                                        flex: 1,
                                        renderer: function (value, metaData, record) {
                                            metaData.tdAttr = 'data-qtip=' + value;
                                            return value
                                        }
                                    },
                                    {
                                        xtype: 'auto_bread_word_column',
                                        text: i18n.getKey('文件url'),
                                        dataIndex: 'url',
                                        itemId: 'url',
                                        flex: 2,
                                    }
                                ]
                            },
                        }
                    ],
                    tbar: {
                        xtype: 'uxedittoolbar',
                        defaults: {
                            disabled: true,
                        },
                        btnSave: {
                            xtype: 'button',
                            iconCls: 'icon_save',
                            disabled: false,
                            text: i18n.getKey('submit'),
                            handler: function (btn) {
                                var form = btn.ownerCt.ownerCt;
                                var uploadForm = form.getComponent('fileForm');
                                if (form.isValid()) {
                                    var type = form.getComponent('type').getValue();
                                    var dirNameValue = form.getComponent('dirName').getValue();
                                    var myMask = new Ext.LoadMask(form, {msg: '上传中...'});
                                    var serverUrl = imageServer;
                                    if (serverUrl.indexOf('localhost') != -1) {
                                        serverUrl = 'https://dev-sz-qpson-nginx.qppdev.com';
                                    }
                                    var url = serverUrl + 'uploadv2';
                                    if (type == true) {
                                        if (dirNameValue) {
                                            url = url + '?staticDir=' + dirNameValue;
                                        }
                                    }
                                    myMask.show();
                                    uploadForm.getForm().submit({
                                        method: 'POST',
                                        url: url,
                                        success: function (form, action) {
                                            var fileValidData = {};
                                            fileValidData = [];
                                            action.response.map(function (item) {
                                                fileValidData.push(item.data);
                                            });
                                            fileStore.add(fileValidData);
                                            myMask.hide();
                                        },
                                        failure: function (form, action) {
                                            Ext.Msg.alert(i18n.getKey('parse'), i18n.getKey('请求失败'))
                                            myMask.hide();
                                        }
                                    })
                                }
                            },
                        },
                        btnCreate: {
                            hidden: true,
                        },
                        btnCopy: {
                            hidden: true,
                        }
                    }
                },
                {
                    xtype: 'errorstrickform',
                    height: '100%',
                    title: '文件同步',
                    isValidForItems: true,
                    itemId: 'syncFile',
                    defaults: {
                        margin: '5 25 5 25',
                        width: 450
                    },
                    bodyStyle: {
                        borderColor: 'silver'
                    },
                    flex: 1,
                    width: '100%',
                    items: [
                        {
                            xtype: 'combo',
                            fieldLabel: i18n.getKey('targetEnv'),
                            width: 500,
                            store: {
                                xtype: 'store',
                                fields: ['name', 'value'],
                                data: targetEnv
                            },
                            editable: false,
                            allowBlank: false,
                            valueField: 'value',
                            queryMode: 'local',
                            displayField: 'name',
                            name: 'targetEnvironment'
                        },

                        {
                            xtype: 'checkboxfield',
                            name: 'type',
                            itemId: 'type',
                            editable: false,
                            fieldLabel: i18n.getKey('同步指定静态目录'),
                            displayField: 'display',
                            valueField: 'value',
                            listeners: {
                                change: function (field, newValue, oldValue) {
                                    var dirName = field.ownerCt.getComponent('dirName');
                                    dirName.setVisible(newValue);
                                    dirName.setDisabled(!newValue)
                                }
                            }
                        },
                        {
                            xtype: 'textfield',
                            name: 'dirName',
                            itemId: 'dirName',
                            hidden: true,
                            disabled: true,
                            vtype: 'filePath',
                            emptyText: '文件路径 例:aa/bb/cc',
                            fieldLabel: i18n.getKey('目录'),
                            valueField: 'value',
                            displayField: 'display',
                            store: {
                                xtype: 'store',
                                fields: ['value', 'display'],
                                data: []
                            },
                        },
                        {
                            xtype: 'gridfieldwithcrudv2',
                            name: 'files',
                            itemId: 'files',
                            fieldLabel: i18n.getKey('需同的步文件'),
                            width: 600,
                            minHeight: 100,
                            allowBlank: false,
                            valueSource: 'storeProxy',
                            gridConfig: {
                                autoScroll: true,
                                minHeight: 100,
                                maxHeight: 350,
                                store: fileNameStore,
                                columns: [
                                    {
                                        text: i18n.getKey('文件名'),
                                        dataIndex: 'name',
                                        flex: 1,
                                    },
                                ],
                                tbar: {
                                    btnDelete: {
                                        hidden: false,
                                        disabled: false,
                                        iconCls: 'icon_create',
                                        width: 100,
                                        text: '批量添加',
                                        handler: function (btn) {
                                            var grid = btn.ownerCt.ownerCt;
                                            var win = Ext.create('Ext.window.Window', {
                                                modal: true,
                                                constrain: true,
                                                title: '批量添加',
                                                layout: 'fit',
                                                items: [
                                                    {
                                                        xtype: 'textarea',
                                                        width: 400,
                                                        height: 350,
                                                        itemId: 'name',
                                                        emptyText: JSTransformHtml('格式如下："15183958077695173.jpg",15183958077695173.jpg' +
                                                            '\n文件名之间用","号分隔;\n文件名开头和结尾的特殊符号都会被截取掉;'),
                                                    }
                                                ],
                                                bbar: {
                                                    xtype: 'bottomtoolbar',
                                                    saveBtnCfg: {
                                                        handler: function (btn) {
                                                            var win = btn.ownerCt.ownerCt;
                                                            var textarea = win.getComponent('name');
                                                            var name = textarea.getValue();
                                                            var arr = name.split(',');
                                                            arr = arr.map(function (item) {
                                                                var result = item.replaceAll('"', '');
                                                                result = result.replaceAll("'", '');
                                                                return result.trim();
                                                            });
                                                            arr = arr.map(function (item) {
                                                                return {
                                                                    name: item
                                                                };
                                                            })
                                                            grid.store.proxy.data = grid.store.proxy.data.concat(arr);
                                                            //去重
                                                            var set = new Set(grid.store.proxy.data);
                                                            grid.store.proxy.data = Array.from(set);
                                                            grid.store.load();
                                                            win.close();
                                                        }
                                                    }
                                                }
                                            });
                                            win.show();
                                        }
                                    }
                                },
                                bbar: {
                                    xtype: 'pagingtoolbar',
                                    store: fileNameStore,
                                    displayInfo: true, // 是否 ? 示， 分 ? 信息
                                }
                            },
                            winConfig: {
                                formConfig: {
                                    items: [
                                        {
                                            xtype: 'textarea',
                                            name: 'name',
                                            itemId: 'name',
                                            margin: '5 25',
                                            allowBlank: false,
                                            width: 350,
                                            height: 80,
                                            fieldLabel: i18n.getKey('name')
                                        }
                                    ]
                                }
                            },
                            diyGetValue: function () {
                                var me = this;
                                var arr = me.getSubmitValue();
                                arr = arr.map(function (item) {
                                    return item.name;
                                });
                                return arr;
                            }
                        },
                    ],
                    tbar: {
                        xtype: 'uxedittoolbar',
                        defaults: {
                            disabled: true,
                        },
                        btnSave: {
                            xtype: 'button',
                            iconCls: 'icon_save',
                            disabled: false,
                            text: i18n.getKey('submit'),
                            handler: function (btn) {
                                var form = btn.ownerCt.ownerCt;
                                var backgroundTask = btn.ownerCt.getComponent('backgroundTask');
                                if (form.isValid()) {
                                    var data = form.getValue();
                                    var url = adminPath + 'api/files/sync';
                                    var jsonData = {
                                        "clazz": "com.qpp.cgp.domain.FileSyncProgressLog",
                                        'sourceEnvironment': 'current',
                                        "targetEnvironment": data.targetEnvironment,
                                    };
                                    if (data.type == true) {
                                        jsonData['staticFiles'] = [];
                                        data.files.map(function (item) {
                                            jsonData['staticFiles'].push({
                                                "fileName": item,
                                                "staticFileDir": data.dirName
                                            });
                                        })
                                        jsonData["fileNames"] = [];
                                    } else {
                                        jsonData["fileNames"] = data.files;
                                        jsonData["staticFiles"] = [];
                                    }
                                    var buildTask = function (handler) {
                                        JSAjaxRequest(url, 'POST', true, jsonData, false, function (require, success, response) {
                                            if (success) {
                                                var responseMessage = Ext.JSON.decode(response.responseText);
                                                if (responseMessage.success) {
                                                    var syncProgressId = responseMessage.data;
                                                    var url = adminPath + 'api/files/' + syncProgressId + '/progressLog';
                                                    handler(syncProgressId, url);
                                                }
                                            } else {
                                                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('同步产品失败'));
                                            }
                                        })
                                    };
                                    var task = Ext.create('CGP.common.backgroundtask.Task', {
                                        title: '同步任务',
                                        buildTask: buildTask,
                                        updateProgress: function (url, callback) {
                                            var count = 0;
                                            var timer = setInterval(function () {
                                                JSAjaxRequest(url, 'GET', true, null, null, function (require, success, response) {
                                                    ++count;
                                                    if (success) {
                                                        var responseText = Ext.JSON.decode(response.responseText);
                                                        task.result = responseText.data;
                                                        callback(responseText.data, count, timer);
                                                    }
                                                });
                                            }, 1000);
                                        },
                                    });
                                    backgroundTask.addTask(task);

                                }
                            },
                        },
                        btnCreate: {
                            hidden: true,
                        },
                        btnCopy: {
                            hidden: true,
                        },
                        btnConfig: {
                            xtype: 'tbfill',
                        },
                        btnHelp: {
                            xtype: 'backgroundtask',
                            itemId: 'backgroundTask',
                            disabled: false,
                            taskGridCfg: {
                                width: 600,
                                extraColumns: [
                                    {
                                        width: 150,
                                        text: i18n.getKey('status'),
                                        dataIndex: 'status',
                                        xtype: 'atagcolumn',
                                        getDisplayName: function (value, metadata, record) {
                                            if (value == 'failure') {
                                                return value + '  <a href="#">错误信息</a>';
                                            } else {
                                                return value;
                                            }

                                        },//自定义显示的内容的方法
                                        clickHandler: function (value, metadata, record) {
                                            var task = record.get('task');
                                            JSShowJsonData(task.result.failureDesc, '错误信息');
                                        }
                                    },
                                ],
                            }
                        }
                    }
                }
            ]
        }
    ])
})