Ext.define("CGP.threedmodelconfig.view.AssetsGrid", {
    extend: "Ext.grid.Panel",
    itemId: 'mtViews',
    minHeight: 450,
    header: false,
    runtimeConfig: null,
    defaults: {
        width: 150
    },

    initComponent: function () {
        var me = this;

        //me.title = i18n.getKey('materialViewType');
        var controller = Ext.create('CGP.threedmodelconfig.controller.Controller');
        me.store = Ext.create("CGP.threedmodelconfig.store.AssetStore", {
            data: []
        });
        var threeDModeStore = Ext.create('CGP.threedpreviewplan.store.3DModeDataStore');
        me.columns = [
            {
                xtype: 'actioncolumn',
                itemId: 'actioncolumn',
                sortable: false,
                resizable: false,
                width: 70,
                menuDisabled: true,
                items: [
                    {
                        iconCls: 'icon_edit icon_margin',
                        itemId: 'actionedit',
                        tooltip: 'Edit',
                        handler: function (view, rowIndex, colIndex) {
                            var store = view.getStore();
                            var record = store.getAt(rowIndex);
                            Ext.create('CGP.threedmodelconfig.view.EditAssetForm', {
                                record: record
                            })
                        }
                    }
                ]
            },
            {
                dataIndex: 'index',
                text: i18n.getKey('sortOrder'),
                width: 70,
                itemId: 'index'
            },
            {
                dataIndex: 'name',
                text: i18n.getKey('name'),
                width: 100,
                itemId: 'name'
            },
            {
                dataIndex: 'type',
                text: i18n.getKey('type'),
                width: 100,
                itemId: 'type'
            },
            {
                dataIndex: 'description',
                text: i18n.getKey('description'),
                width: 200,
                itemId: 'description'
            },
            {
                dataIndex: 'defaultImage',
                text: i18n.getKey('defaultImage'),
                width: 150,
                itemId: 'defaultImage'
            },
            {
                dataIndex: 'useTransparentMaterial',
                text: i18n.getKey('useTransparentMaterial'),
                width: 170,
                itemId: 'useTransparentMaterial'
            }
        ];

        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('save'),
                iconCls: 'icon_save',
                handler: function () {
                    me.runtimeConfig.assets = me.getValue();
                    controller.saveRuntimeConfig(me.runtimeConfig, me.win);
                }
            }, {
                xtype: 'fileupload',
                name: 'modelFileName',
                itemId: 'modelFileName',
                formFileName: 'file',
                height: 80,
                aimFileServerUrl: imageServer + 'upload/static?dirName=model-preview/data/model',//指定文件夹
                fieldLabel: i18n.getKey('threeDModel'),
                uploadHandler: function () {
                    var formPanel = this.ownerCt.ownerCt;
                    var win = formPanel.ownerCt;
                    var file = formPanel.getComponent('file');
                    var url = win.fileUpLoadField.aimFileServerUrl;
                    var filePath = win.fileUpLoadField.getComponent('filePath');
                    if (!Ext.isEmpty(file.getRawValue())) {
                        var myMask = new Ext.LoadMask(win, {msg: "上传中..."});
                        myMask.show();
                        formPanel.getForm().submit({
                            url: url,
                            method: 'POST',
                            success: function (form, action) {
                                myMask.hide();
                                var data = Ext.JSON.decode(action.response.data);
                                filePath.setValue(data[0].path);
                                win.close();
                            },
                            failure: function (form, action) {
                                myMask.hide();
                                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('上传失败'));
                            }
                        });
                    }
                },
                listeners: {
                    afterrender: function () {
                        var comp = this;
                        var downLoadBtn = comp.getComponent('buttonGroup').getComponent('downloadBtn');
                        var filePathField = comp.getComponent('filePath');
                        filePathField.on('change', function (comp, newValue, oldValue) {
                            threeDModeStore.proxy.url = location.origin + '/file/' + 'jsonFile/content?filePath=' + newValue;
                            threeDModeStore.load({
                                callback: function (records, operation, success) {
                                    var modelTextures = [];
                                    modelTextures = controller.transformtextureData(records[0].data);
                                    me.refreshData(modelTextures);
                                }
                            })
                        })
                        downLoadBtn.hide();
                    }
                }
            }
        ];
        me.listeners = {
            render: function (comp) {
                me.getConfigData(me.modelId);
            }
        }
        me.callParent(arguments);
    },
    getValue: function () {
        var me = this;
        var dataArray = [];
        me.store.data.items.forEach(function (item) {
            var data = item.data;
            dataArray.push(data);

        });
        return dataArray;
    },

    refreshData: function (assets) {

        var me = this;
        var store = me.getStore();
        store.removeAll();
        store.add(assets);

    },
    getConfigData: function (modelId) {
        var me = this;
        var filterData = Ext.JSON.encode([{
            "name": "config._id",
            "type": "string",
            "value": modelId
        }]);
        var runtimeConfigTmp = {
            "clazz": "com.qpp.cgp.domain.product.config.model.ThreeJSRuntimeConfig",
            "config": {
                "_id": modelId,
                "clazz": "com.qpp.cgp.domain.product.config.model.ThreeDModelConfig"
            },
            "assets": []
        };
        var mask = me.win.setLoading();
        Ext.Ajax.request({
            url: encodeURI(adminPath + 'api/threeDModelRuntimeConfigs?page=1&start=0&limit=1000&filter=' + filterData),
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    var records = responseMessage.data.content;
                    if (Ext.isEmpty(records)) {
                        me.newRuntimeConfig(runtimeConfigTmp, mask);
                    } else {
                        me.runtimeConfig = records[0];
                        var assets = records[0].assets;
                        me.refreshData(assets);
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
    },
    newRuntimeConfig: function (data, mask) {
        var me = this;
        Ext.Ajax.request({
            url: adminPath + 'api/threeDModelRuntimeConfigs',
            method: 'POST',
            jsonData: data,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    me.runtimeConfig = responseMessage.data;
                    mask.hide();

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
    }

});
