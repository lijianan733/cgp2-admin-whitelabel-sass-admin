/**
 *详细页
 **/
Ext.Loader.syncRequire(["CGP.threedpreviewplan.model.model"]);
Ext.define('CGP.threedpreviewplan.edit', {
    extend: 'Ext.panel.Panel',


    layout: {
        type: 'vbox',
        align: 'left'
    },

    autoScroll: true,

    defaults: {
        width: '100%'
    },
    /*overflowX: 'hidden',
     overflowY: 'auto',*/

    /*bodyStyle: {
     padding: '10px'
     },*/
    bodyPadding: '0 10 20 10',
    editOrNew: 'new',
    configModelId: '',
    /*bodyStyle :'overflow: hidden;',*/
    //padding: '0 10 0 10',
    initComponent: function () {

        var me = this;
        var configModel = null;
        me.configModelId = JSGetQueryString('id');
        var controller = Ext.create('CGP.threedpreviewplan.controller.Controller');
        var editOrNew = 'new';
        if (!Ext.isEmpty(me.configModelId)) {
            me.editOrNew = 'edit';
            configModel = Ext.ModelManager.getModel("CGP.threedpreviewplan.model.model");
        }

        /*me.tbar = [{
         xtype: 'displayfield',
         fieldLabel: false,
         value: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('linkman') + '</font>'
         },{
         xtype: 'button',
         text: i18n.getKey('edit'),
         action: 'edit'
         }];*/
        me.dockedItems = [
            {
                xtype: 'toolbar',
                dock: 'top',
                style: 'background-color:white;',
                color: 'black',
                bodyStyle: 'border-color:white;',
                border: '0 0 0 0',
                items: [
                    {
                        xtype: 'button',
                        margin: '0 0 0 10',
                        itemId: 'button',
                        text: i18n.getKey('save'),
                        iconCls: 'icon_save',
                        handler: function () {
                            var data = me.getValue();
                            controller.saveTestPlan(me.editOrNew,data,me,me.configModelId)
                        }
                    }
                ]

            }
        ];
        me.items = [
            Ext.create('CGP.threedpreviewplan.view.ModelVariableConfig', {
                configModelId: me.configModelId,
                editOrNew: me.editOrNew,
                width: '100%',
                itemId: 'modelVariableConfig',
                configModel: configModel
            }),
            Ext.create('CGP.threedpreviewplan.view.ModelTextureImageConfig', {
                fieldMargin: '10 50 10 50',
                itemId: 'modelTextureImageConfig'
            })
            /*,
            {//收件人信息
                xtype: 'detailsdelivery',
                height: 220
            }*/
        ];
        me.listeners = {
            render: function () {
                var me = this;
                if (!Ext.isEmpty(me.configModelId)) {
                    configModel.load(Number(me.configModelId), {
                        success: function (record, operation) {
                            me.setValue(record.data);
                        }
                    });
                }
            }

        }
        me.callParent(arguments);
        me.form = me.down('form');


    },
    getValue: function () {
        var me = this;
        var result = {};
        var modelTextureImageConfig = me.getComponent('modelTextureImageConfig').getValue();
        var modelVariableConfig = me.getComponent('modelVariableConfig').getValue();
        modelVariableConfig.threeDVariableConfig.assetsInfos = modelTextureImageConfig;
        result = modelVariableConfig;
        result.clazz = 'com.qpp.cgp.domain.product.config.threed.model.ThreeDModelTestPlan';
        return result;
    },
    //把数据转换成表单数据格式
    transformData: function (data) {
        var me = this;
    },
    setValue: function (data) {
        var me = this;
        var threeDVariable = data.threeDVariableConfig;
        var assetsInfos = threeDVariable.assetsInfos;
        var modelTextureImageConfig = me.getComponent('modelTextureImageConfig');
        modelTextureImageConfig.setValue(assetsInfos || []);
        var modelVariableConfig = me.getComponent('modelVariableConfig');
        data.structVersion = threeDVariable.structVersion;
        data.engine = threeDVariable.engine;
        data.modelFileName = threeDVariable.threeDModel?.location;
        modelVariableConfig.setValue(data);
    },
    transformtextureData: function (modelData) {
        var me = this;
        var result;
        if (Ext.isEmpty(modelData.object)) {
            result = me.dealSingleModelTexture(modelData);
        } else {
            result = me.dealMultiModelTexture(modelData);
        }
        return result;
    },
    dealSingleModelTexture: function (modelData) {
        var modelTextures = [];
        if (!Ext.isEmpty(modelData.materials)) {
            Ext.Array.each(modelData.materials, function (material) {
                var modelTexture = {name: '', location: '', type: '', useTransparentMaterial: false};
                modelTexture.name = material.DbgName;
                modelTexture.useTransparentMaterial = material.transparent;
                modelTexture.type = material.type;
                modelTextures.push(modelTexture);
            })
        }
        return modelTextures;
    },
    dealMultiModelTexture: function (modelData) {
        var modelTextures = [];
        var modelMaterials = [];
        Ext.Array.each(modelData.object.children,function (material){
            if(!Ext.isEmpty(material.material)){
                modelMaterials.push(material);
            }
        });
        Ext.Array.each(modelMaterials,function (modelMaterial){
            var modelTexture = {name: '', location: '', type: '', useTransparentMaterial: false};
            modelTexture.name = modelMaterial.name;
            modelTexture.useTransparentMaterial = modelMaterial.transparent;
            modelTexture.type = modelMaterial.type;
            modelTextures.push(modelTexture);
        });
        return modelTextures;
    }


});
