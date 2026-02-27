Ext.define('CGP.threedpreviewplan.view.ModelVariableConfig', {
    extend: 'Ext.form.Panel',
    defaultType: 'textfield',
    bodyStyle: 'border-top:0;border-color:white;',
    /*header: {
        style: 'background-color:white;border-color:silver;',
        color: 'white',
        border: '1 0 0 0'
    },*/
    padding: '10 0 0 0',
    header: false,
    defaults: {
        labelAlign: 'left',
        margin: '0 0 3 6',
        width: 430
    },
    layout: {
        type: 'table',
        columns: 2
    },

    initComponent: function () {

        var me = this;
        var modelVariableForm = Ext.create('CGP.threedpreviewplan.view.ModelVariableForm', {
            width: '100%',
            name: 'threeDVariableConfig',
            colspan: 2
        });
        var threeDModeStore = Ext.create('CGP.threedpreviewplan.store.3DModeDataStore');
        var controller = Ext.create('CGP.threedpreviewplan.controller.Controller');
        var editOrNew = JSGetQueryString('editOrNew');

        me.items = [{
            fieldLabel: i18n.getKey('name'),
            name: 'name',
            allowBlank: false,
            itemId: 'name'
        }, {
            fieldLabel: i18n.getKey('clazz'),
            name: 'clazz',
            hidden: true,
            value: 'com.qpp.cgp.domain.product.config.threed.model.ThreeDModelTestPlan',
            itemId: 'clazz'
        }, {
            name: 'status',
            xtype: 'combo',
            fieldLabel: i18n.getKey('status'),
            store: Ext.create('Ext.data.Store', {
                fields: ['name', 'value'],
                data: [{
                    name: 'draft', value: 'draft',
                }, {name: 'release', value: 'release'}, {
                    name: 'deprecated', value: 'deprecated'
                }]
            }),
            value: 'draft',
            valueField: 'value',
            displayField: 'name',
            queryMode: 'local',
            itemId: 'status'
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

        }, {
            xtype: 'fileupload',
            name: 'modelFileName',
            colspan: 2,
            itemId: 'modelFileName',
            formFileName: 'file',
            height: 80,
            aimFileServerUrl: imageServer + 'upload/static?dirName=model-preview/data/model',//指定文件夹
            fieldLabel: i18n.getKey('3D') + i18n.getKey('fileName'),
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
                    var form = me;
                    var downLoadBtn = comp.getComponent('buttonGroup').getComponent('downloadBtn');
                    var filePathField = comp.getComponent('filePath');
                    filePathField.on('change', function (comp, newValue, oldValue) {
                        threeDModeStore.proxy.url = location.origin + '/file/' + 'jsonFile/content?filePath=' + newValue;
                        threeDModeStore.load({
                            callback: function (records, operation, success) {
                                var modelTextures = [];
                                var mainPanel = form.ownerCt;
                                var modelTexturesPanel = mainPanel.getComponent('modelTextureImageConfig');
                                if (editOrNew == 'new' || (editOrNew == 'edit' && !Ext.isEmpty(oldValue))) {
                                    modelTextures = controller.transformtextureData(records[0].data);
                                    modelTexturesPanel.setValue(modelTextures);
                                }
                            }
                        })
                    })
                    downLoadBtn.hide();
                }
            }
        }, modelVariableForm];
        /*me.tbar = [{
            xtype: 'displayfield',
            fieldLabel: false,
            value: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('linkman') + '</font>'
        },{
            xtype: 'button',
            text: i18n.getKey('edit'),
            action: 'edit'
        }];*/

        me.callParent(arguments);

    },
    getValue: function () {
        var me = this;
        var data = {};
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            data[item.name] = item.getValue();
        })
        data.threeDVariableConfig.engine = data.engine;
        data.threeDVariableConfig.structVersion = data.structVersion;
        data.threeDVariableConfig.threeDModel.location = data.modelFileName;
        data.clazz = 'com.qpp.cgp.domain.product.config.threed.model.ThreeDModelTestPlanVariableConfig';
        return data;

    },
    setValue: function (data) {
        var me = this;
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            item.setValue(data[item.name]);
        })
    }
})
