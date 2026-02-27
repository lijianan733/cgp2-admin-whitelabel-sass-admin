Ext.define('CGP.threedpreviewplan.view.preview.ModelInfo', {
    extend: 'Ext.form.Panel',


    defaultType: 'displayfield',
    bodyStyle: 'border-top:0;border-color:white;',
    /*header: {
        style: 'background-color:white;border-color:silver;',
        color: 'white',
        border: '1 0 0 0'
    },*/
    header: false,
    resultValue: null,
    bodyPadding: 10,
    defaults: {
        labelAlign: 'left',
        width: 400
    },
    testPlanData: null,
    previewData: null,
    layout: {
        type: 'table',
        columns: 1
    },

    initComponent: function () {

        var me = this;
        var planStore = Ext.create('CGP.threedpreviewplan.store.store', {
            params: {
                filter: '[{"name":"status","value":' + 'release' + ',"type":"string"}]'
            }
        });
        var defaultTestPlan = JSGetQueryString('defaultTestPlan');
        var testPlan = {
            xtype: 'uxfieldset',
            collapsible: false,
            style: {
                borderRadius: '10px'
            },
            padding: 10,
            itemId: 'testPlan',
            border: false,
            defaults: {
                width: 250
            },
            items: [
                {
                    name: 'testplan',
                    xtype: 'combo',
                    pageSize: 10,
                    editable: false,
                    fieldLabel: i18n.getKey('testplan'),
                    store: planStore,
                    listeners: {
                        change: function (comp, newValue, oldValue) {
                            me.testPlanData = me.getTestPlanData(newValue, me);
                            if (!Ext.Object.isEmpty(me.testPlanData)) {
                                me.setValue(me.testPlanData);
                            }
                        },
                        afterrender: function (comp) {
                            if (!Ext.isEmpty(defaultTestPlan)) {
                                comp.setValue(defaultTestPlan);
                            }
                        }
                    },
                    width: 350,
                    valueField: '_id',
                    displayField: 'displayName',
                    itemId: 'status'
                }
            ]
        };
        var cameraInfo = Ext.create('CGP.threedpreviewplan.view.preview.CameraInfo', {
            width: 438,
            modelInfoForm: me,
            testPlanData: me.testPlanData,
            itemId: 'camera'
        });
        var modelTextureImageForm = Ext.create('CGP.threedpreviewplan.view.ModelTextureImageConfig', {
            itemId: 'modelTextureImageConfig',
            fieldMargin: '0 0 0 0',
            width: 438,
            bbar: ['->',
                {
                    text: i18n.getKey('apply'),
                    id: 'applyButton',
                    handler: function () {
                        var previewPanel = me.ownerCt.getComponent('previewPanel');
                        var assets = modelTextureImageForm.getValue();
                        if (!Ext.isEmpty(me.previewData)) {
                            me.previewData.assets = me.assetsTransform(assets);
                            console.log(me.previewData);
                            if (previewPanel.status == 'initialize') {
                                previewPanel.refreshData(me.previewData)
                            } else {
                                previewPanel.builderRefresh({
                                    threeDModelRuntime: me.previewData
                                });
                            }

                        } else {
                            Ext.Msg.alert(i18n.getKey('prompt'), '无预览数据！');
                        }

                    }
                }
            ],
            layout: {
                type: 'table',
                columns: 2
            },
            preview: true
        });

        me.items = [testPlan, cameraInfo, modelTextureImageForm];

        me.callParent(arguments);

    },
    getValue: function () {
        var me = this;
        var result = {};
        var camera = me.getComponent('camera').getValue();
        var baseInfo = me.getComponent('baseInfo').getValue();
        baseInfo.camera = camera;
        result = baseInfo;
        return result;

    },
    //加载测试方案数据载入预览信息表单中
    setValue: function (testPlanData) {
        var me = this;
        var previewData = me.transformData(testPlanData);
        var cameraInfo = me.getComponent('camera');
        var modelTextureImage = me.getComponent('modelTextureImageConfig');
        cameraInfo.setValue(previewData.camera);
        modelTextureImage.setValue(previewData.assets);
    },
    //重新组装数据，满足预览页面需要的数据结构
    transformData: function (originalData) {
        var me = this;
        var resultData = {
            engine: originalData.threeDVariableConfig.engine,
            "bgColor": originalData.threeDVariableConfig.bgColor,
            "defaultZoom": originalData.threeDVariableConfig.defaultZoom,
            "maxZoom": originalData.threeDVariableConfig.maxZoom,
            "minZoom": originalData.threeDVariableConfig.minZoom,
            "zoomStep": originalData.threeDVariableConfig.zoomStep,
            "structVersion": originalData.threeDVariableConfig.structVersion,
            modelFileName: originalData.threeDVariableConfig.threeDModel.location,
            camera: {},
            threeDModel: {},
            "views": originalData.threeDVariableConfig.views,
            "assets": originalData.threeDVariableConfig.assetsInfos
        };

        function cameraTransform(camera) {
            var resultCamera = {
                "positionX": camera.positionX,
                "positionY": camera.positionY,
                "positionZ": camera.positionZ,
                "bgColor": originalData.threeDVariableConfig.bgColor,
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
        resultData.camera = cameraTransform(originalData.threeDVariableConfig.camera);
        resultData.threeDModel = threeDModelTransform(originalData.threeDVariableConfig.threeDModel, originalData.modelFileName);
        resultData.assets = me.assetsTransform(originalData.threeDVariableConfig.assetsInfos);
        me.previewData = resultData;
        return resultData;

    },
    getTestPlanData: function (testPlanId, page) {
        var testPlanData = {};
        var mask = page.setLoading();
        Ext.Ajax.request({
            url: adminPath + 'api/threedmodeltestplans/' + testPlanId,
            method: 'GET',
            async: false,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    mask.hide();
                    testPlanData = responseMessage.data;
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
        return testPlanData;
    },
    assetsTransform: function (originalAssets) {
        var assets = [];
        Ext.Array.each(originalAssets, function (item) {
            item.defaultImage = item.location;
            assets.push(item);
        })
        return assets;
    }
})
