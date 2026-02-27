Ext.Loader.syncRequire([
    'CGP.cmspages.store.ContextStore',
    'CGP.cmspages.model.CMSPageModel',
]);
Ext.onReady(function () {
    Ext.apply(Ext.form.field.VTypes, {
        filePath: function (v) {
            return !/^[/]$/.test(v);
        },
        filePathText: '路径不允许只输入"/"',
        filePathMask: /[\w/]$/i     //限制输入
    });
    Ext.apply(Ext.form.field.VTypes, {
        onlyNum: function (v) {
            return !/[\u4e00-\u9fa5]/.test(v);
        },
        onlyNumText: '该项仅允许输入数字',
        onlyNumMask: /[\d]$/i     //限制输入
    });
    var contextStore = Ext.create('CGP.cmspages.store.ContextStore');
    var limitStore = Ext.create('Ext.data.Store', {
        fields: [
            {name: 'key', type: 'string'},
            {name: 'diff', type: 'number'},
            {name: 'diffUnit', type: 'string'},
            {name: 'width', type: 'number'},
            {name: 'height', type: 'number'}
        ],
        PageSize: 25,
        proxy: {
            type: 'memory'
        },
        data: [],
        autoLoad: true
    });
    var listenerPathFun = {
        // 更改时 判断'/'
        change: function (data) {
            var dataValue = data.getValue();
            var dataValueLength = dataValue.length - 1
            var dataLastValue = dataValue.charAt(dataValueLength);
            var dataTwoLastValue = dataValue.charAt(dataValueLength - 1);
            var newValue = '';
            // 判断'/'
            if (dataLastValue == '/' && dataTwoLastValue == '/') {
                newValue = data.getValue().substr(0, dataValueLength);
                data.setValue(newValue);
            }
        },
        // 获得焦点时 添加'/'
        focus: function (data) {
            var dataValue = data.getValue();
            var dataLastValue = dataValue.charAt(dataValue.length - 1);
            var newValue = '';
            if (dataValue != '' && dataLastValue != '/') {
                newValue = data.getValue() + '/';
                data.setValue(newValue);
            }
        },
        // 失去焦点时 删除结尾'/'
        blur: function (data) {
            var dataValue = data.getValue();
            var dataLastValue = dataValue.charAt(dataValue.length - 1);
            var newValue = '';
            if (dataLastValue == '/') {
                newValue = data.getValue().substr(0, dataValue.length - 1);
                data.setValue(newValue);
            }
        }
    };
    var page = Ext.widget({
        xtype: 'uxeditpage',
        block: 'cmspages',
        gridPage: 'main.html',
        i18nblock: i18n.getKey('CMSPages'),
        formCfg: {
            model: 'CGP.cmspages.model.CMSPageModel',
            remoteCfg: false,
            isValidForItems: true,
            itemId: 'formCfg',
            layout: {
                type: 'table',
                columns: 1,
                tdAttrs: {
                    style: {
                        'padding-right': '120px'
                    }
                }
            },
            defaults: {
                width: 380
            },
            fieldDefaults: {
                labelAlign: 'right',
                labelWidth: 110,
                width: undefined,
                validateOnChange: false,
                plugins: [
                    {
                        ptype: 'uxvalidation'
                    }
                ]
            },
            items: [
                {
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    allowBlank: false,
                    name: 'name',
                    itemId: 'name'
                },
                {
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('status'),
                    allowBlank: false,
                    editable: false,
                    name: 'status',
                    itemId: 'status',
                    displayField: 'key',
                    valueField: 'value',
                    tipInfo: '发布时,该配置状态为草稿的不会被发布',
                    store: {
                        xtype: 'store',
                        fields: ['key', 'value'],
                        data: [
                            {
                                'key': '正式',
                                'value': 3
                            },
                            {
                                'key': '草稿',
                                'value': 1
                            }
                        ]
                    }
                },
                {
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('type'),
                    allowBlank: false,
                    editable: false,
                    name: 'cmsType',
                    itemId: 'cmsType',
                    displayField: 'key',
                    valueField: 'value',
                    store: {
                        xtype: 'store',
                        fields: ['key', 'value'],
                        data: [
                            {
                                'key': '普通页',
                                'value': 'Normal'
                            },
                            {
                                'key': '产品详情页',
                                'value': 'ProductDetail'
                            },
                            {
                                'key': '产品类目页',
                                'value': 'ProductCategory'
                            }
                        ]
                    }
                },
                {
                    xtype: 'gridcombo',
                    fieldLabel: i18n.getKey('CMS编译') + i18n.getKey('context'),
                    allowBlank: true,
                    editable: false,
                    name: 'cmsContext',
                    itemId: 'cmsContext',
                    store: contextStore,
                    haveReset: true,
                    displayField: 'displayName',
                    valueField: '_id',
                    matchFieldWidth: false,
                    diySetValue: function (data) {
                        var me = this;
                        me.setInitialValue([data._id]);
                    },
                    gotoConfigHandler: function (value, metadata, record) {
                        var id = this.getSubmitValue()[0];
                        JSOpen({
                            id: 'cmscontextpage',
                            url: path + 'partials/cmscontext/main.html?_id=' + id,
                            title: i18n.getKey('context'),
                            refresh: true,
                        });
                    },
                    filterCfg: {
                        height: 70,
                        layout: {
                            type: 'column',
                            columns: 2
                        },
                        items: [
                            {
                                name: '_id',
                                xtype: 'textfield',
                                isLike: false,
                                fieldLabel: i18n.getKey('id'),
                                itemId: '_id'
                            }, {
                                name: 'name',
                                xtype: 'textfield',
                                isLike: false,
                                allowDecimals: false,
                                fieldLabel: i18n.getKey('name'),
                                itemId: 'name'
                            }
                        ]
                    },
                    gridCfg: {
                        store: contextStore,
                        minHeight: 300,
                        width: 560,
                        columns: [
                            {
                                text: i18n.getKey('id'),
                                dataIndex: '_id',
                                flex: 1
                            },
                            {
                                text: i18n.getKey('name'),
                                dataIndex: 'name',
                                flex: 1
                            }
                        ],
                        bbar: Ext.create('Ext.PagingToolbar', {
                            store: contextStore,
                            displayInfo: true,
                            displayMsg: 'Displaying {0} - {1} of {2}',
                            emptyMsg: i18n.getKey('noData')
                        })
                    }
                },
                {
                    xtype: 'fileuploadv2',
                    width: 450,
                    hiddenDown: true,
                    hideTrigger: true,
                    isFormField: true,
                    allowBlank: true,
                    isShowImage: true,
                    imageSize: 50,
                    valueUrlType: 'part',
                    allowFileType: ['image/*'],
                    msgTarget: 'none',
                    fieldLabel: i18n.getKey('staticPreviewFile'),
                    UpFieldLabel: i18n.getKey('image'),
                    name: 'staticPreviewFile',
                    itemId: 'staticPreviewFile',
                },
                {
                    xtype: 'textarea',
                    height: 60,
                    width: 600,
                    isFormField: true,
                    fieldLabel: i18n.getKey('templateFilePath'),
                    emptyText: '例: 目录1/目录2/文件名.html',
                    allowBlank: false,
                    name: 'templateFilePath',
                    itemId: 'templateFilePath',
                    vtype: 'filePath',
                    valueType: 'String',
                    listeners: listenerPathFun
                },
                {
                    xtype: 'textfield',
                    width: 600,
                    isFormField: true,
                    fieldLabel: i18n.getKey('生成文件存放路径'),
                    allowBlank: false,
                    name: 'outputDir',
                    itemId: 'outputDir',
                },
                {
                    xtype: 'arraydatafield',  // 缺少验证红框
                    width: 600,
                    isFormField: true,
                    fieldLabel: i18n.getKey('tags'),
                    allowBlank: true,
                    name: 'tags',
                    resultType: 'Array',
                    itemId: 'tags',
                },
                {
                    xtype: 'textarea',
                    height: 100,
                    width: 600,
                    fieldLabel: i18n.getKey('description'),
                    name: 'description',
                    itemId: 'description'
                },
                {
                    xtype: 'gridfieldwithcrudv2',
                    allowBlank: true,
                    fieldLabel: i18n.getKey('imageSizeLimits'),
                    name: 'imageSizeLimits',
                    itemId: 'imageSizeLimits',
                    width: 600,
                    gridConfig: {
                        store: limitStore,
                        height: 150,
                        autoScroll: true,
                        columns: [
                            {
                                xtype: 'rownumberer'
                            },
                            {
                                text: i18n.getKey('imageKey'),
                                dataIndex: 'key',
                                width: 80,
                                renderer: function (value) {
                                    var map = {
                                        'small': i18n.getKey('产品小图'),
                                        'large': i18n.getKey('产品大图')
                                    };
                                    return map[value];
                                },
                            },
                            {
                                text: i18n.getKey('width'),
                                dataIndex: 'width',
                                width: 80
                            },
                            {
                                text: i18n.getKey('height'),
                                dataIndex: 'height',
                                width: 80
                            },
                            {
                                text: i18n.getKey('allow') + i18n.getKey('diff'),
                                dataIndex: 'diff',
                                minWidth: 80,
                                flex: 1,
                                draggable: false,
                                resizable: false,
                                renderer: function (value, metadata, record) {
                                    var diffUnit = record.data.diffUnit;
                                    return value + diffUnit;
                                }
                            }
                        ]
                    },
                    winConfig: {
                        formConfig: {
                            isValidForItems: true,
                            getValue: function () {
                                var me = this;
                                return me.form.getValues();
                            },
                            setValue: function (data) {
                                var me = this;
                                return me.form.setValues(data);
                            },
                            defaults: {
                                msgTarget: 'none',
                                margin: '10 20',
                                hideTrigger: true
                            },
                            items: [
                                {
                                    xtype: 'combo',
                                    fieldLabel: i18n.getKey('imageKey'),
                                    allowBlank: false,
                                    hideTrigger: false,
                                    editable: false,
                                    marginTop: 10,
                                    readOnlyCls: 'x-item-disabled',
                                    name: 'key',
                                    itemId: 'key',
                                    displayField: 'display',
                                    valueField: 'value',
                                    store: {
                                        xtype: 'store',
                                        fields: ['display', 'value'],
                                        data: [
                                            {
                                                display: i18n.getKey('产品小图'),
                                                value: 'small'
                                            },
                                            {
                                                display: i18n.getKey('产品大图'),
                                                value: 'large'
                                            }
                                        ]
                                    },
                                    listeners: {
                                        afterrender: function (combo) {
                                            var win = combo.ownerCt.ownerCt;
                                            var createOrEdit = win.createOrEdit;
                                            var limitStoreLength = limitStore.getCount();
                                            var newValue = '';
                                            if (limitStoreLength != 0 && createOrEdit == 'create') {
                                                combo.setReadOnly(true);
                                                var oldValue = limitStore.data.items[0].data.key
                                                if (limitStoreLength == 1 && oldValue == 'large') {
                                                    newValue = 'small';
                                                } else if (limitStoreLength == 1 && oldValue == 'small') {
                                                    newValue = 'large';
                                                } else if (limitStoreLength == 2) {
                                                    return null;
                                                }
                                                combo.setValue(newValue);
                                            }
                                            if (limitStoreLength == 2 && createOrEdit == 'edit') {
                                                combo.setReadOnly(true);
                                            }
                                        }
                                    }
                                },
                                {
                                    xtype: 'numberfield',
                                    fieldLabel: i18n.getKey('width'),
                                    minValue: 0,
                                    allowBlank: false,
                                    name: 'width',
                                    itemId: 'width',
                                    vtype: 'onlyNum'
                                },
                                {
                                    xtype: 'numberfield',
                                    fieldLabel: i18n.getKey('height'),
                                    minValue: 0,
                                    allowBlank: false,
                                    marginBottom: '10',
                                    name: 'height',
                                    itemId: 'height',
                                    vtype: 'onlyNum'
                                },
                                {
                                    xtype: 'uxfieldcontainer',
                                    name: 'container',
                                    colspan: 2,
                                    itemId: 'container',
                                    labelAlign: 'left',
                                    allowBlank: false,
                                    fieldLabel: i18n.getKey('allow') + i18n.getKey('diff'),
                                    layout: {
                                        type: 'hbox'
                                    },
                                    defaults: {
                                        labelWidth: 30,
                                        allowBlank: false,
                                        flex: 1
                                    },
                                    items: [
                                        {
                                            xtype: 'numberfield',
                                            allowBlank: false,
                                            name: 'diff',
                                            itemId: 'diff',
                                            vtype: 'onlyNum',
                                            margin: '0 5 0 0',
                                            minValue: 0
                                        },
                                        {
                                            xtype: 'combo',
                                            allowBlank: false,
                                            editable: false,
                                            name: 'diffUnit',
                                            itemId: 'diffUnit',
                                            hideTrigger: false,
                                            displayField: 'diffUnits',
                                            valueField: 'diffUnits',
                                            store: {
                                                fields: ['diffUnits', 'name'],
                                                data: [
                                                    {
                                                        diffUnits: 'Pixel',
                                                        name: 'Pixel'
                                                    },
                                                    {
                                                        diffUnits: '%',
                                                        name: '百分号'
                                                    }
                                                ]
                                            }
                                        }
                                    ],
                                    getErrors: function () {
                                        var me = this;
                                        return me.Errors[i18n.getKey('allow') + i18n.getKey('diff')] = '该输入项为必输项';
                                    }
                                }
                            ]
                        }
                    },
                    listeners: {
                        afterrender: function () {
                            var field = this;
                            field._grid.store.on('datachanged', function () {
                                var store = this;
                                var toolbar = field._grid.getDockedItems('toolbar[dock="top"]')[0];
                                toolbar?.getComponent('btnCreate')?.setDisabled(store.getCount() == 2);
                            })
                        }
                    }
                }
            ]
        },
        tbarCfg: {
            btnReset: {
                handler: function (btn) {
                    var form = btn.ownerCt.ownerCt;
                    var tags = form.getComponent('tags');
                    tags.reset();
                    form.form.reset();
                }
            },
            btnConfig: {
                text: '<font style="color:red">' + i18n.getKey('saveAs') + i18n.getKey('templates') + '</font>',
                iconCls: 'icon_import',
                disabled: false,
                listeners: {
                    afterrender: function (comp) {
                        if (!JSGetQueryString('id')) {
                            comp.setDisabled(true);
                        }
                    }
                },
                handler: function (btn) {
                    var form = btn.ownerCt.ownerCt;
                    var url = cmsPagePath + 'api/cms-saas-page-template';
                    if (form.isValid()) {
                        form.form.updateModel(form.model);
                        var result = Ext.clone(form.getModel(form.model).getData());
                        result.clazz = 'com.qpp.domain.cms.CMSSaasPageTemplate';
                        result._id = null;
                        JSSetLoading(true);
                        JSAjaxRequest(url, 'POST', false, result, '另存为模板成功', function () {
                            JSSetLoading(false);
                        })
                    }
                }
            }
        },
        listeners: {
            afterrender: function (page) {
                var templateId = JSGetQueryString('templateId');
                var form = page.form;
                if (templateId) {
                    JSSetLoading(true);
                    var url = cmsPagePath + 'api/cms-saas-page-template/' + templateId;
                    JSAjaxRequest(url, 'GET', true, null, false, function (require, success, response) {
                        JSSetLoading(false);
                        if (success) {
                            var responseText = Ext.JSON.decode(response.responseText);
                            if (responseText.success) {
                                var data = responseText.data;
                                data._id = null;
                                data.clazz = 'com.qpp.domain.cms.CMSSaasPage';
                                var model = form.getModel(form.model);
                                model.data = data;
                                form.form.clearInvalid();
                                form.form.loadModel(model);
                            }
                        }
                    })
                }
            }
        }
    })
})
