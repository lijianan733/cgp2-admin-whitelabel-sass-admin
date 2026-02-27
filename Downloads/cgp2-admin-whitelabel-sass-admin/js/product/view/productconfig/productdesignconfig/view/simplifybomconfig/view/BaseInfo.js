Ext.Loader.syncRequire([
    'CGP.common.store.MaterialViewTypeStore', 'CGP.common.valueExV3.ValueExField',
    'CGP.common.condition.ConditionFieldV3'
]);
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.simplifybomconfig.view.BaseInfo', {
    extend: 'Ext.panel.Panel',
    modal: true,
    layout: 'fit',
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('baseInfo');
        var materialViewTypeStore = Ext.data.StoreManager.lookup('materialViewTypeStore');
        var mainController = Ext.create('CGP.product.view.productconfig.controller.Controller');
        //me.materialPath = '';
        if (!Ext.Object.isEmpty(me.sbomNode) && Ext.isEmpty(me.record) && me.sbomNode.isNode) {
            //me.materialPath = me.sbomNode.get('materialPath');
        } else if (Ext.Object.isEmpty(me.sbomNode) && Ext.isEmpty(me.record)) {
            me.materialPath = '';
        } else if (!Ext.isEmpty(me.record)) {
            me.materialPath = me.record.get('materialPath');
        }

        var productController = Ext.create('CGP.product.view.productconfig.controller.Controller');
        var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
        var productId = builderConfigTab.productId;
        var contentData = productController.buildPMVTContentData(productId);
        var materialViewTypeStore = Ext.data.StoreManager.lookup('materialViewTypeStore');
        var form = {
            xtype: 'errorstrickform',
            itemId: 'form',
            isValidForItems: true,
            border: false,
            padding: '10 10 0 10',
            header: false,
            defaults: {
                width: 500
            },
            items: [
                {
                    xtype: 'textfield',
                    itemId: 'name',
                    fieldLabel: i18n.getKey('name'),
                    name: 'name'
                },
                {
                    name: "materialViewType",
                    id: 'materialViewType',
                    fieldLabel: i18n.getKey('materialViewType'),
                    itemId: 'materialViewType',
                    allowBlank: false,
                    xtype: 'singlegridcombo',
                    displayField: 'displayName',
                    valueField: '_id',
                    editable: false,
                    width: 500,
                    store: materialViewTypeStore,
                    matchFieldWidth: false,
                    multiSelect: false,
                    autoScroll: true,
                    gridCfg: {
                        store: materialViewTypeStore,
                        height: 300,
                        width: 500,
                        autoScroll: true,
                        //hideHeaders : true,
                        columns: [
                            {
                                text: i18n.getKey('id'),
                                width: 80,
                                dataIndex: '_id',
                                renderer: function (value, metaData) {
                                    metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                    return value;
                                }
                            },
                            {
                                text: i18n.getKey('name'),
                                width: 180,
                                dataIndex: 'name',
                                renderer: function (value, metaData, record, rowIndex) {
                                    metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                    return value
                                }
                            },
                            {
                                text: i18n.getKey('description'),
                                width: 220,
                                dataIndex: 'description',
                                renderer: function (value, metaData, record, rowIndex) {
                                    metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                    return value
                                }
                            }
                        ],
                        tbar: {
                            layout: {
                                type: 'column'
                            },
                            defaults: {
                                width: 170,
                                isLike: false,
                                padding: 2
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    fieldLabel: i18n.getKey('id'),
                                    name: '_id',
                                    isLike: false,
                                    labelWidth: 40
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: i18n.getKey('name'),
                                    name: 'name',
                                    labelWidth: 40
                                },
                                /*{
                                 xtype: 'textfield',
                                 fieldLabel: i18n.getKey('category'),
                                 name: 'category',
                                 labelWidth: 40
                                 },*/ '->',
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('search'),
                                    handler: mainController.searchGridCombo,
                                    width: 80
                                },
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('clear'),
                                    handler: mainController.clearParams,
                                    width: 80
                                }
                            ]
                        },
                        bbar: Ext.create('Ext.PagingToolbar', {
                            store: materialViewTypeStore,
                            displayInfo: true, // 是否 ? 示， 分 ? 信息
                            displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                            emptyMsg: i18n.getKey('noData')
                        })
                    },
                    listeners: {
                        change: function (gridCombo, newValue, oldValue) {
                            if (Ext.isEmpty(newValue) || Ext.Object.isEmpty(newValue)) {
                                return;
                            }
                            var tabPanel = gridCombo.ownerCt.ownerCt.ownerCt;
                            var placeHolderVdCfg = tabPanel.getComponent('PlaceHolderVdCfg');
                            var pageContentSchemaId = newValue[gridCombo.getSubmitValue()[0]].pageContentSchema._id;
                            Ext.Ajax.request({
                                url: adminPath + 'api/pageContentSchemas/' + pageContentSchemaId,
                                method: 'GET',
                                headers: {
                                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                },
                                success: function (response) {
                                    var responseMessage = Ext.JSON.decode(response.responseText);
                                    var responseData = responseMessage.data;
                                    if (responseMessage.success) {
                                        var variableDataSourceQtyCfg = tabPanel.getComponent('variableDataSourceQtyCfg');
                                        var data = responseData;
                                        if (data.pageContentItemPlaceholders && data.pageContentItemPlaceholders.length > 0) {
                                            tabPanel.remove(placeHolderVdCfg);
                                            tabPanel.remove(variableDataSourceQtyCfg);
                                            placeHolderVdCfg = Ext.create("CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.PlaceHolderVdCfg", {
                                                pageContentSchemaId: pageContentSchemaId,
                                                placeHolderVdCfgs: tabPanel.data ? (tabPanel.data.placeHolderVdCfgs || []) : []
                                            });
                                            variableDataSourceQtyCfg = Ext.create("CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.VariableDataSourceQtyCfg", {
                                                pageContentSchemaId: pageContentSchemaId,
                                                variableDataSourceQtyCfgs: tabPanel.data ? (tabPanel.data.variableDataSourceQtyCfgs || []) : []
                                            });
                                            tabPanel.add(placeHolderVdCfg);
                                            tabPanel.add(variableDataSourceQtyCfg);
                                        } else {
                                            tabPanel.remove(placeHolderVdCfg);
                                            tabPanel.remove(variableDataSourceQtyCfg);
                                        }
                                    } else {
                                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                    }
                                },
                                failure: function (response) {
                                    var responseMessage = Ext.JSON.decode(response.responseText);
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                }
                            });

                        }
                    },
                    diySetValue: function (data) {
                        var me = this;
                        if (data) {
                            me.setSingleValue(data['_id']);
                        }
                    },
                    diyGetValue: function () {
                        var me = this;
                        return {
                            _id: me.getSingleValue(),
                            idReference: 'MaterialViewType',
                            clazz: domainObj.MaterialViewType
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    itemId: 'clazz',
                    value: 'com.qpp.cgp.domain.simplifyBom.SimplifyMaterialViewType',
                    name: 'clazz',
                    hidden: true
                },
                {
                    xtype: 'uxfieldcontainer',
                    layout: 'hbox',
                    name: 'materialPath',
                    labelAlign: 'left',
                    allowBlank: false,
                    defaults: {},
                    fieldLabel: i18n.getKey('materialPath'),
                    items: [
                        {
                            xtype: 'textarea',
                            itemId: 'materialPath',
                            id: 'materialPath',
                            name: 'materialPath',
                            flex: 1,
                            margin: '0 5 0 0',
                            readOnly: true,
                            allowBlank: false,
                            value: me.materialPath,
                            fieldLabel: false
                        },
                        {
                            xtype: 'button',
                            text: i18n.getKey('choice'),
                            width: 65,
                            hidden: !Ext.Object.isEmpty(me.sbomNode) && me.sbomNode.isNode,
                            handler: function () {
                                var materialPath = Ext.getCmp('materialPath').getValue();
                                var component = Ext.getCmp('materialPath');
                                mainController.getMaterialPath(me.productBomConfigId, materialPath, component);
                            }
                        }
                    ],
                    isValid: function () {
                        var me = this;
                        me.Errors[me.getFieldLabel()] = '该输入项为必输项';
                        return me.getComponent('materialPath').isValid();
                    },
                    diySetValue: function (data) {
                        var me = this;
                        me.getComponent('materialPath').setValue(data);
                    },
                    diyGetValue: function () {
                        var me = this;
                        return me.getComponent('materialPath').getValue();
                    }
                },
                {
                    xtype: 'numberfield',
                    name: 'productConfigDesignId',
                    value: me.productConfigDesignId,
                    itemId: 'productConfigDesignId',
                    hidden: true
                },
                {
                    xtype: 'valueexfield',
                    name: 'condition',
                    itemId: 'condition',
                    hidden:true,
                    allowBlank: true,
                    fieldLabel: i18n.getKey('condition'),
                    commonPartFieldConfig: {
                        uxTextareaContextData: true,
                        defaultValueConfig: {
                            type: 'Boolean',
                            clazz: 'com.qpp.cgp.value.ExpressionValueEx',
                            typeSetReadOnly: true,
                            clazzSetReadOnly: false

                        }
                    },
                    tipInfo: '执行条件'
                },
                {
                    xtype: 'conditionfieldv3',
                    fieldLabel: i18n.getKey('condition'),
                    itemId: 'conditionDTO',
                    checkOnly: false,
                    tipInfo: '执行条件',
                    contentData: contentData,
                    name: 'conditionDTO',
                    allowBlank: true,
                },
                {//需要用的实际参数
                    xtype: 'uxfieldset',
                    title: i18n.getKey('actualParams'),
                    name: 'actualParams',
                    itemId: 'actualParams',
                    legendItemConfig: {
                        disabledBtn: {
                            hidden: false,
                            disabled: false,
                            isUsable: false,//初始化时，是否是禁用
                        }
                    },
                    defaults: {
                        allowBlank: false,
                    },
                    items: [
                        {
                            name: 'actualWidthEx',
                            xtype: 'valueexfield',
                            width: '100%',
                            commonPartFieldConfig: {
                                uxTextareaContextData: true,
                                defaultValueConfig: {
                                    type: 'Number',
                                    typeSetReadOnly: true,
                                }
                            },
                            fieldLabel: i18n.getKey('actualWidth'),
                            itemId: 'actualWidthEx'
                        },
                        {
                            name: 'actualHeightEx',
                            xtype: 'valueexfield',
                            width: '100%',
                            commonPartFieldConfig: {
                                uxTextareaContextData: true,
                                defaultValueConfig: {
                                    type: 'Number',
                                    typeSetReadOnly: true,
                                }
                            },
                            fieldLabel: i18n.getKey('actualHeight'),
                            itemId: 'actualHeightEx'
                        },
                        {
                            xtype: 'combo',
                            name: 'actualUnit',
                            width: '100%',
                            fieldLabel: i18n.getKey('actualUnit'),
                            itemId: 'actualUnit',
                            value: 'mm',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['value', 'display'],
                                data: [

                                    {
                                        value: 'cm',
                                        display: i18n.getKey('cm')
                                    },
                                    {
                                        value: 'mm',
                                        display: i18n.getKey('mm')
                                    },
                                    {
                                        value: 'in',
                                        display: i18n.getKey('in')
                                    }
                                ]
                            }),
                            editable: false,
                            valueField: 'value',
                            displayField: 'display'
                        }
                    ]
                },
                {
                    xtype: 'textfield',
                    name: 'mvtGroup',
                    itemId: 'mvtGroup',
                    allowBlank: true,
                    fieldLabel: i18n.getKey('mvtGroup'),
                }
            ]
        };
        me.items = [form];
        me.callParent(arguments);
    },
    isValid: function () {
        var me = this;
        var form = this.ownerCt.ownerCt.down('form');
        return form.isValid();
    },
    setValue: function (data) {
        var me = this;
        var form = me.down('form');
        if (data.actualHeightEx || data.actualWidthEx || data.actualUnit) {
            data.actualParams = {
                actualHeightEx: data.actualHeightEx,
                actualWidthEx: data.actualWidthEx,
                actualUnit: data.actualUnit
            };
        }
        form.setValue(data);

        //新的条件组件的设置值处理
        var condition = form.getComponent('condition');
        var conditionDTO = form.getComponent('conditionDTO');
        if (data.conditionDTO) {
            //如果有配置conditionDto，则显示新的条件组件，否则使用旧的
            conditionDTO.show();
            conditionDTO.setDisabled(false);
            condition.hide();
            condition.setDisabled(true);
        } else {
            if (Ext.isEmpty(data.condition)) {
                //两个都没配置使用新的组件
                conditionDTO.show();
                conditionDTO.setDisabled(false);
                condition.hide();
                condition.setDisabled(true);
            } else {
                condition.show();
                condition.setDisabled(false);
                conditionDTO.hide();
                conditionDTO.setDisabled(true);
            }
        }
    },
    getValue: function () {
        var me = this;
        var data = {};
        var form = me.down('form');
        data = form.getValue();
        if (data.actualParams) {
            data = Ext.Object.merge(data, data.actualParams);
        } else {
            data = Ext.Object.merge(data, {
                actualHeightEx: null,
                actualWidthEx: null,
                actualUnit: null
            });
        }

        //对conditionDTO字段进行处理，用改字段生成condition字段,如果以前有旧数据,使用以前的
        //如果是使用conditionDTO组件，再期其清空数据时，把condition也做清除
        var conditionDTO = form.getComponent('conditionDTO');
        if (conditionDTO.hidden == false) {
            if (data.conditionDTO) {
                data.condition = conditionDTO.getExpression();
            } else {
                data.condition = null;
            }
        } else {
            data.conditionDTO = null;
        }
        return data;
    }
});
