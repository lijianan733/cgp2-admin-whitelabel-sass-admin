Ext.define('CGP.threedmodelconfig.view.EditConfigVersion', {
    extend: 'Ext.window.Window',
    modal: true,
    resizable: false,
    layout: {
        type: 'table',
        // The total column count must be specified here
        columns: 2
    },
    minHeight: 600,
    height: 650,
    width: 950,
    //全局页面的编辑状态
    globalStatus: 'edit',
    autoScroll: true,
    defaults: {
        width: 350
    },
    grid: null,
    data: null,
    title: i18n.getKey('edit') + i18n.getKey('model'),
    draggable: true,
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.threedmodelconfig.controller.Controller');
        me.title = i18n.getKey(me.editOrNew) + i18n.getKey('model');
        var threeDModeStore = Ext.create('CGP.threedmodelconfig.store.3DModeDataStore');
        var modelSet = Ext.create('CGP.threedmodelconfig.view.ThreeModelFieldSet', {
            name: 'threeDModel',
            colspan: 2,
            threeDModeStore: threeDModeStore,
            itemId: 'modelSet',
            title: i18n.getKey('modelConfig'),
            margin: '10 0 10 0',
            width: 850
        });
        var cameraFieldSet = Ext.create('CGP.threedmodelconfig.view.CameraFieldSet', {
            name: 'camera',
            colspan: 2,
            itemId: 'camera',
            title: i18n.getKey('camera'),
            margin: '10 0 10 0',
            width: 850
        });
        var form = Ext.create('Ext.ux.form.ErrorStrickForm', {
            itemId: 'editConfigForm',
            modal: true,
            resizable: false,
            width: '100%',
            border: false,
            layout: {
                type: 'table',
                // The total column count must be specified here
                columns: 2
            },
            defaults: {
                width: 350,
                labelAlign: 'left',
                msgTarget: 'side',
                validateOnChange: false
            },
            listeners: {
                afterrender: function () {
                    me.refreshData();
                    if (me.editOrNew == 'new') {
                        //me.form.getComponent('version').setValue(me.lastVersionId + 1);
                    }
                }
            },
            bodyStyle: {
                padding: '10px'
            },
            items: [
                {
                    name: 'version',
                    xtype: 'numberfield',
                    disabled: true,
                    fieldLabel: i18n.getKey('version'),
                    autoStripChars: true,
                    maskRe: /[PE0-9.]/,
                    listeners: {
                        afterrender: function () {
                            if (me.editOrNew == 'new') {
                                var form = me.getComponent('editConfigForm');
                                form.getComponent('version').setValue(me.lastVersionId + 1);
                            }
                        }
                    },
                    itemId: 'version'
                }, {
                    name: 'status',
                    xtype: 'combo',
                    editable: false,
                    allowBlank: false,
                    fieldLabel: i18n.getKey('status'),
                    itemId: 'status',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['type', "value"],
                        data: [
                            {
                                type: '测试', value: 2
                            }, {
                                type: '上线', value: 3
                            }
                        ]
                    }),
                    value: 2,
                    displayField: 'type',
                    valueField: 'value',
                    queryMode: 'local'

                }, {
                    name: 'structVersion',
                    xtype: 'combo',
                    editable: false,
                    allowBlank: false,
                    fieldLabel: i18n.getKey('schemaVersion'),
                    itemId: 'structVersion',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['type', "value"],
                        data: [
                            {
                                type: '1', value: 1
                            },
                            {
                                type: '2', value: 2
                            }, {
                                type: '3', value: 3
                            }
                        ]
                    }),
                    value: 1,
                    displayField: 'type',
                    valueField: 'value',
                    queryMode: 'local'
                }, {
                    name: 'minZoom',
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('minZoom'),
                    allowDecimals: true,
                    itemId: 'minZoom'
                }, {
                    name: 'maxZoom',
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('maxZoom'),
                    allowDecimals: true,
                    itemId: 'maxZoom'
                }, {
                    name: 'defaultZoom',
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('defaultZoom'),
                    allowDecimals: true,
                    itemId: 'defaultZoom'
                }, {
                    name: 'zoomStep',
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('zoomStep'),
                    allowDecimals: true,
                    itemId: 'zoomStep',
                },
                {
                    xtype: 'textfield',
                    name: 'bgColor',
                    fieldLabel: i18n.getKey('bgColor'),
                    itemId: 'bgColor',
                    value: '0x888888'
                },
                {
                    xtype: 'textfield',
                    name: 'clazz',
                    fieldLabel: i18n.getKey('clazz'),
                    hidden: true,
                    value: 'com.qpp.cgp.domain.product.config.model.ThreeJSVariableConfig',
                    itemId: 'clazz'
                }, {
                    name: 'engine',
                    xtype: 'combo',
                    editable: false,
                    allowBlank: false,
                    fieldLabel: i18n.getKey('engine'),
                    itemId: 'engine',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['type', "value"],
                        data: [
                            {
                                type: 'ThreeJS', value: 'ThreeJS'
                            }
                        ]
                    }),
                    value: 'ThreeJS',
                    displayField: 'type',
                    valueField: 'value',
                    queryMode: 'local'

                },
                {
                    xtype: 'fileuploadv2',
                    name: 'modelFileName',
                    itemId: 'modelFileName',
                    formFileName: 'file',
                    colspan: 2,
                    // model-preview/data/model/2.32x3.58_Corner.svg
                    valueUrlType: 'part',
                    staticDir: 'model-preview/data/model',//指定文件夹
                    fieldLabel: i18n.getKey('modelFileName'),
                    listeners: {
                        afterrender: function () {
                            var me = this;
                            var filePathField = me.getComponent('filePath');
                            filePathField.on('change', function (comp, newValue, oldValue) {
                                threeDModeStore.proxy.url = location.origin + '/file/' + 'jsonFile/content?filePath=' + newValue;
                                threeDModeStore.load();
                            })
                        }
                    }
                },
                {
                    xtype: 'gridfieldwithcrudv2',
                    fieldLabel: i18n.getKey('views'),
                    itemId: 'views',
                    name: 'views',
                    colspan: 2,
                    minHeight: 100,
                    width: 700,
                    winConfig: {
                        formConfig: {
                            width: 500,
                            defaults: {
                                width: 450
                            },
                            items: [
                                {
                                    xtype: 'numberfield',
                                    name: 'x',
                                    itemId: 'x',
                                    fieldLabel: i18n.getKey('x')
                                }, {
                                    xtype: 'numberfield',
                                    name: 'y',
                                    itemId: 'y',
                                    fieldLabel: i18n.getKey('y')
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'z',
                                    itemId: 'z',
                                    fieldLabel: i18n.getKey('z')
                                },
                                {
                                    xtype: 'fileuploadv2',
                                    name: 'icon',
                                    itemId: 'icon',
                                    formFileName: 'file',
                                    height: 80,
                                    fieldLabel: i18n.getKey('icon'),
                                    valueUrlType: 'part',
                                    isShowImage: false,
                                    staticDir: 'model-preview/data/image',//指定文件夹
                                }
                            ],
                        },
                    },
                    //hidden: true,
                    //disabled: true,
                    gridConfig: {
                        store: Ext.create('Ext.data.Store', {
                            autoSync: true,
                            fields: [
                                {name: 'x', type: 'number'},
                                {name: 'y', type: 'number'},
                                {name: 'z', type: 'number'},
                                {name: 'icon', type: 'string'},
                                {
                                    name: 'clazz',
                                    type: 'string',
                                    defaultValue: 'com.qpp.cgp.domain.product.config.model.ThreeDView'
                                }
                            ],
                            data: []
                        }),
                        columns: [
                            {
                                text: i18n.getKey('x'),
                                dataIndex: 'x',
                                tdCls: 'vertical-middle'
                            },
                            {
                                text: i18n.getKey('y'),
                                dataIndex: 'y',
                                tdCls: 'vertical-middle'
                            },
                            {
                                text: i18n.getKey('z'),
                                dataIndex: 'z',
                            }, {
                                text: i18n.getKey('icon'),
                                dataIndex: 'icon',
                                tdCls: 'vertical-middle',
                                flex: 1,
                                xtype:'auto_bread_word_column'
                            },
                        ]
                    },

                },
                modelSet, cameraFieldSet
            ]
        });
        me.items = [
            form
        ];
        me.bbar = ['->', {
            xtype: 'button',
            text: i18n.getKey('preview'),
            iconCls: 'icon_preview',
            handler: function () {
                var modelData = me.getValue();
                var previewData = me.transformData(modelData);
                if (!Ext.isEmpty(previewData.assets)) {
                    Ext.create('Ext.window.Window', {
                        title: i18n.getKey('preview'),
                        autoShow: true,
                        maximized: true,
                        layout: 'fit',
                        items: [
                            Ext.create('CGP.threedpreviewplan.view.preview.PreviewPanel', {
                                listeners: {
                                    afterrender: function (comp) {
                                        comp.refreshData(previewData);
                                    }
                                }
                            })
                        ]
                    })
                }
            }
        },
            {
                xtype: 'button',
                text: i18n.getKey('confirm'),
                iconCls: 'icon_agree',
                itemId: 'saveBtn',
                handler: function (btn) {
                    var data = me.getValue();
                    var form = me.getComponent('editConfigForm');
                    if (form.isValid()) {
                        controller.editTreeDConfigVersion(data, me.editOrNew, me.store, me, me.record, me.globalStatus);
                    }

                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                iconCls: 'icon_cancel',
                handler: function () {
                    me.close();
                }
            }
        ]
        me.callParent(arguments);
    },

    getValue: function () {
        var me = this;
        var resultData = {};
        if (!Ext.isEmpty(me.configModelId)) {
            resultData.model = {
                _id: me.configModelId,
                clazz: 'com.qpp.cgp.domain.product.config.model.ThreeDModelConfig'
            };
        }
        var form = me.getComponent('editConfigForm');
        if (form.isValid()) {
            var items = form.items.items;
            Ext.Array.each(items, function (item) {
                if (item.name == 'views') {
                    resultData[item.name] = item.getSubmitValue();
                } else {
                    resultData[item.name] = item.getValue();
                }

            });
        }
        return resultData;

    },

    refreshData: function () {
        var me = this, form = this.getComponent('editConfigForm');
        if (me.editOrNew == 'edit') {
            me.data = me.record.getData();
            var items = form.items.items;
            Ext.Array.each(items, function (item) {
                if (item.name == 'views') {
                    item.setSubmitValue(me.data[item.name]);
                } else {
                    item.setValue(me.data[item.name]);
                }

            })
        }

    },
    //重新组装数据，满足预览页面需要的数据结构
    transformData: function (originalData) {
        var me = this;
        var resultData = {
            engine: originalData.engine,
            "bgColor": originalData.bgColor,
            "defaultZoom": originalData.defaultZoom,
            "maxZoom": originalData.maxZoom,
            "minZoom": originalData.minZoom,
            "zoomStep": originalData.zoomStep,
            "structVersion": originalData.structVersion,
            modelFileName: originalData.modelFileName,
            camera: {},
            threeDModel: {},
            "views": originalData.views,
            "assets": originalData.assetsInfos
        };

        function cameraTransform(camera) {
            var resultCamera = {
                "positionX": camera.positionX,
                "positionY": camera.positionY,
                "positionZ": camera.positionZ,
                "bgColor": originalData.bgColor,
                "cameraFov": camera.cameraFov,
                "cameraNear": camera.cameraNear,
                "cameraFar": camera.cameraFar
            }
            return resultCamera;
        };

        function assetsTransform(originalAssets) {
            var assets = [];
            Ext.Array.each(originalAssets, function (item) {
                item.defaultImage = item.location;
                assets.push(item);
            })
            return assets;
        }

        function threeDModelTransform(threeDModel, location) {
            var resultThreeDModel = threeDModel;
            resultThreeDModel.location = location;
            return resultThreeDModel;
        };
        resultData.camera = cameraTransform(originalData.camera);
        resultData.threeDModel = threeDModelTransform(originalData.threeDModel, originalData.modelFileName);
        resultData.assets = me.getAssets(me.configModelId, me);
        me.previewData = resultData;
        return resultData;

    },
    assetsTransform: function (originalAssets) {
        var assets = [];
        Ext.Array.each(originalAssets, function (item) {
            item.defaultImage = item.location;
            assets.push(item);
        })
        return assets;
    },
    getAssets: function (modelId, win) {
        var me = this;
        var filterData = Ext.JSON.encode([{
            "name": "config._id",
            "type": "string",
            "value": modelId
        }]);
        var assets = [];
        var mask = win.setLoading();
        Ext.Ajax.request({
            url: encodeURI(adminPath + 'api/threeDModelRuntimeConfigs?page=1&start=0&limit=1000&filter=' + filterData),
            method: 'GET',
            async: false,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    var records = responseMessage.data.content;
                    if (Ext.isEmpty(records)) {
                        Ext.Msg.confirm('无材质图', '是否配置？', callback);

                        function callback(id) {
                            if (id === 'yes') {
                                Ext.create('CGP.threedmodelconfig.view.ModelRunTimeConfigWin', {
                                    modelId: modelId
                                });
                            }
                        }
                    } else {
                        var runtimeConfig = records[0];
                        assets = records[0].assets;
                        me.assets = assets;
                        mask.hide();
                    }

                } else {
                    mask.hide();
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                mask.hide();
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        });
        return assets;
    }
})
