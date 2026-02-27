/**
 * Created by nan on 2018/3/8.
 * 现在要界面化配置条件字段，新建的配置和改字段为空值的字段使用界面化配置
 * 旧的数据有condition字段的情况用旧的组件
 * 现在取消对materialSelector其他类型的支持。只支持materialPathSelector
 */
Ext.Loader.syncRequire([
    'CGP.common.store.MaterialViewTypeStore',
    'CGP.product.view.managerskuattribute.skuattributeconstrainter.view.ValidExpressionContainer',
    'CGP.product.view.managerskuattribute.skuattributeconstrainter.controller.Controller',
    'CGP.common.valueExV3.ValueExField',
    'CGP.common.condition.ConditionFieldV3'
]);
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.BaseInfoForBomV5', {
    extend: 'Ext.panel.Panel',
    layout: 'fit',
    recordId: null,
    productConfigDesignId: null,
    productBomConfigId: null,
    bomVersion: '5',//4和5的区别为，v5支持selector中多种类型，v4只支持materialPath
    isValid: function () {
        var me = this;
        var form = this.getComponent('form');
        var isValid = form.isValid();
        if (isValid == false) {
            me.ownerCt.setActiveTab(me);
        }
        return isValid;
    },
    getValue: function () {
        var me = this;
        var form = me.down('form');
        var data = {};
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
        //对数据进行处理，如果是版本V5的数据，selector类型为idPathSelector，则在数据中加上materialPath字段，反之删掉
        if (data.materialSelector) {
            if (data.materialSelector.clazz == 'com.qpp.cgp.domain.bom.material.IdPathSelector') {
                data.materialPath = data.materialSelector.idPath;
            } else {
                delete data.materialPath;
            }
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
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('baseInfo');
        me.controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.controller.Controller');
        if (me.record) {
            if (Ext.isEmpty(me.record.get('materialSelector'))) {//当有记录，但是没有selector该字段时
                me.recordData = me.record.getData();
                me.recordData.materialSelector = {};
            } else {
                window.buttonInitValue = me.record.get('materialSelector')['expression'];
                me.recordData = me.record.getData();
            }
        }
        //这里是树形结构展示时，直接设置其路径
        var materialPath = ''
        if (!Ext.isEmpty(me.materialPath) && Ext.isEmpty(me.record)) {
            materialPath = me.materialPath;
        } else if (Ext.isEmpty(me.materialPath) && Ext.isEmpty(me.record)) {
            materialPath = '';
        } else if (!Ext.isEmpty(me.record)) {
            materialPath = me.record.get('materialPath');
        }
        var productController = Ext.create('CGP.product.view.productconfig.controller.Controller');
        var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
        var productId = builderConfigTab.productId;
        var contentData = productController.buildPMVTContentData(productId);
        var contentTemplate = {
            args: {
                "context": {}
            }
        };
        for (var i = 0; i < contentData.length; i++) {
            contentTemplate.args.context[contentData[i].key] = null;
        }
        var materialViewTypeStore = Ext.data.StoreManager.lookup('materialViewTypeStore');
        var form = {
            xtype: 'errorstrickform',
            isValidForItems: true,
            border: false,
            itemId: 'form',
            padding: '10 0 0 10',
            header: false,
            defaults: {
                width: 500,
                margin: '5 15 0 15'
            },
            /*layout: {
                type: 'table',
                columns: 2,
            },*/
            items: [
                {
                    xtype: 'textfield',
                    itemId: 'clazz',
                    value: 'com.qpp.cgp.domain.bom.ProductMaterialViewType',
                    name: 'clazz',
                    hidden: true
                },
                {
                    xtype: 'textfield',
                    itemId: 'productMaterialTypeName',
                    name: 'name',
                    fieldLabel: i18n.getKey('name'),
                    allowBlank: false
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
                    store: materialViewTypeStore,
                    matchFieldWidth: false,
                    multiSelect: false,
                    autoScroll: true,
                    gridCfg: {
                        store: materialViewTypeStore,
                        height: 300,
                        width: 550,
                        autoScroll: true,
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
                                '->',
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('search'),
                                    handler: me.controller.searchGridCombo,
                                    width: 80
                                },
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('clear'),
                                    handler: me.controller.clearParams,
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
                            var variableDataSourceQtyCfg = tabPanel.getComponent('variableDataSourceQtyCfg');
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
                                        var data = responseData;
                                        tabPanel.remove(placeHolderVdCfg);
                                        tabPanel.remove(variableDataSourceQtyCfg);
                                        if (data.pageContentItemPlaceholders && data.pageContentItemPlaceholders.length > 0) {
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
                    diyGetValue: function () {
                        var me = this;
                        return {
                            _id: me.getSingleValue(),
                            idReference: 'MaterialViewType',
                            clazz: domainObj.MaterialViewType
                        };
                    },
                    diySetValue: function (data) {
                        var me = this;
                        me.setSingleValue(data['_id']);
                    }
                },
                {
                    xtype: 'uxfieldcontainer',
                    itemId: 'productViewType',
                    name: 'productMaterialViewTypeId',
                    layout: 'hbox',
                    allowBlank: false,
                    defaults: {},
                    labelAlign: 'left',
                    fieldLabel: i18n.getKey('productMaterialViewTypeId'),
                    isValid: function () {
                        var me = this;
                        me.Errors[me.getFieldLabel()] = '该输入项为必输项';
                        return me.getComponent('productMaterialViewTypeId').isValid();
                    },
                    diySetValue: function (data) {
                        var me = this;
                        me.getComponent('productMaterialViewTypeId').setValue(data);
                    },
                    diyGetValue: function () {
                        var me = this;
                        return me.getComponent('productMaterialViewTypeId').getValue();
                    },
                    items: [
                        {
                            xtype: 'numberfield',
                            name: 'productMaterialViewTypeId',
                            fieldLabel: false,
                            flex: 1,
                            minValue: 0,
                            margin: '0 5 0 0',
                            hideTrigger: true,
                            allowBlank: false,
                            itemId: 'productMaterialViewTypeId'
                        },
                        {
                            xtype: 'button',
                            text: i18n.getKey('selfCreate'),
                            width: 65,
                            handler: function (button) {
                                me.controller.productMaterialViewTypeIdCreate(button)
                            }
                        }
                    ]
                },
                {
                    xtype: 'numberfield',
                    name: 'productConfigDesignId',
                    itemId: 'productConfigDesignId',
                    value: me.productConfigDesignId,
                    hidden: true
                },
                {
                    name: 'productMaterialViewTypeIds',
                    xtype: 'valueexfield',
                    allowBlank: true,
                    commonPartFieldConfig: {
                        uxTextareaContextData: true,
                        defaultValueConfig: {
                            type: 'Array',
                            clazz: 'com.qpp.cgp.value.ExpressionValueEx',
                            /*
                                                                clazzSetReadOnly: true,
                            */
                            typeSetReadOnly: true,
                        }
                    },
                    fieldLabel: 'product Material ViewTypeIds(已弃用)',
                    itemId: 'productMaterialViewTypeIds'
                },
                {
                    xtype: 'uxfieldcontainer',
                    width: 500,
                    name: 'materialPath',
                    layout: 'hbox',
                    labelAlign: 'left',
                    defaults: {},
                    hidden: me.bomVersion == 5,
                    disabled: me.bomVersion == 5,
                    allowBlank: false,
                    fieldLabel: i18n.getKey('materialPath'),
                    items: [
                        {
                            xtype: 'textarea',
                            itemId: 'materialPath',
                            id: 'materialPath',
                            name: 'materialPath',
                            margin: '0 5 0 0',
                            flex: 1,
                            readOnly: true,
                            allowBlank: false,
                            fieldLabel: false,
                            value: materialPath,
                        },
                        {
                            xtype: 'button',
                            text: i18n.getKey('choice'),
                            width: 65,
                            hidden: me.hideChangeMaterialPath,
                            handler: function () {
                                var materialPath = Ext.getCmp('materialPath').getValue();
                                var component = Ext.getCmp('materialPath');
                                var controller = Ext.create('CGP.product.view.productconfig.controller.Controller');
                                controller.getMaterialPath(me.productBomConfigId, materialPath, component);
                            }
                        }
                    ],
                    isValid: function () {
                        var me = this;
                        var materialPath = me.getComponent('materialPath')
                        if (me.disabled == true) {
                            return true
                        } else {
                            if (materialPath.isValid()) {
                                return true;
                            } else {
                                me.Errors[me.getFieldLabel()] = '该输入项为必输项';
                                return me.getComponent('materialPath').isValid();
                            }
                        }
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
                    xtype: 'uxfieldcontainer',
                    fieldLabel: 'MaterialSelector',
                    name: 'materialSelector',
                    itemId: 'materialSelector',
                    hidden: me.bomVersion != 5,
                    disabled: me.bomVersion != 5,
                    defaults: {
                        width: '100%',
                        margin: '10 0 5 50',
                        allowBlank: false
                    },
                    getErrors: function () {
                        return '不允许为空';
                    },
                    isValid: function () {
                        var me = this;
                        //待完整，
                        var isValid = true;
                        if (me.disabled == true) {
                            return true;
                        } else {
                            for (var i = 0; i < me.items.items.length; i++) {
                                var item = me.items.items[i];
                                if (item.disabled != true) {
                                    if (item.isValid() == false) {
                                        isValid = false;
                                        continue;
                                    }
                                }
                            }
                            return isValid;
                        }
                    },
                    setValue: function (data) {
                        var me = this;
                        if (data) {
                            var MaterialSelectorType = me.getComponent('MaterialSelectorType');
                            var IdPathSelector = me.getComponent('IdPathSelector');
                            var MaterialIdSelector = me.getComponent('MaterialIdSelector');
                            var JsonPathSelector = me.getComponent('JsonPathSelector');
                            var expression = me.getComponent('ExpressionSelector');
                            MaterialSelectorType.setValue(data.clazz);
                            if (data.clazz == 'com.qpp.cgp.domain.bom.material.IdPathSelector') {
                                IdPathSelector.getComponent('materialPath').setValue(data.idPath);
                            } else if (data.clazz == 'com.qpp.cgp.domain.bom.material.MaterialIdSelector') {
                                MaterialIdSelector.getComponent('materialId').setValue(data.materialId);
                            } else if (data.clazz == 'com.qpp.cgp.domain.bom.material.JsonPathSelector') {
                                JsonPathSelector.setValue(data.jsonPath);
                            } else (data.clazz == 'com.qpp.cgp.domain.bom.material.ExpressionSelector')
                            {
                                expression.setValue(data.expression);
                            }
                        }
                    },
                    getValue: function () {
                        var me = this;
                        var data = {};
                        data.clazz = me.getComponent('MaterialSelectorType').getValue();
                        if (data.clazz == 'com.qpp.cgp.domain.bom.material.IdPathSelector') {
                            data.idPath = me.getComponent('IdPathSelector').getComponent('materialPath').getValue();
                        }
                        if (data.clazz == 'com.qpp.cgp.domain.bom.material.MaterialIdSelector') {
                            data.materialId = me.getComponent('MaterialIdSelector').getComponent('materialId').getValue();
                        }
                        if (data.clazz == 'com.qpp.cgp.domain.bom.material.JsonPathSelector') {
                            data.jsonPath = me.getComponent('JsonPathSelector').getValue();
                        }
                        if (data.clazz == 'com.qpp.cgp.domain.bom.material.ExpressionSelector') {
                            data.expression = me.getComponent('ExpressionSelector').getValue();
                        }
                        return data;
                    },
                    items: [
                        {
                            xtype: 'combo',
                            editable: false,
                            fieldLabel: i18n.getKey('type'),
                            itemId: 'MaterialSelectorType',
                            readOnly: true,
                            /*
                                                        readOnly: me.hideChangeMaterialPath,
                            */
                            msgTarget: 'side',
                            tipInfo: '<font color=red>' + 'MaterialSelectorType的优先级为：<br>IdPathSelector>MaterialIdSelector><br>JsonPathSelector>ExpressionSelector' + '</font>',
                            value: 'com.qpp.cgp.domain.bom.material.IdPathSelector',
                            displayField: 'type',
                            valueField: 'value',
                            store: Ext.create('Ext.data.Store', {
                                fields: [
                                    {
                                        name: 'type',
                                        type: 'string'
                                    },
                                    {
                                        name: 'value',
                                        type: 'string'
                                    }
                                ],
                                data: [
                                    {
                                        type: 'IdPathSelector',
                                        value: 'com.qpp.cgp.domain.bom.material.IdPathSelector'
                                    },
                                    {
                                        type: 'MaterialIdSelector',
                                        value: 'com.qpp.cgp.domain.bom.material.MaterialIdSelector'
                                    },
                                    {
                                        type: 'JsonPathSelector',
                                        value: 'com.qpp.cgp.domain.bom.material.JsonPathSelector'
                                    },
                                    {
                                        type: 'ExpressionSelector',
                                        value: 'com.qpp.cgp.domain.bom.material.ExpressionSelector'
                                    }
                                ]
                            }),
                            listeners: {
                                'change': function (view, newValue, oldValue) {
                                    var materialSelector = view.ownerCt;
                                    var materialPath = materialSelector.getComponent('IdPathSelector');
                                    var materialId = materialSelector.getComponent('MaterialIdSelector');
                                    var jsonPath = materialSelector.getComponent('JsonPathSelector');
                                    var expression = materialSelector.getComponent('ExpressionSelector');
                                    switch (newValue) {
                                        case 'com.qpp.cgp.domain.bom.material.IdPathSelector': {
                                            materialPath.show();
                                            materialId.hide();
                                            jsonPath.hide();
                                            expression.hide();
                                            materialPath.setDisabled(false);
                                            materialId.setDisabled(true);
                                            jsonPath.setDisabled(true);
                                            expression.setDisabled(true);
                                            break;
                                        }
                                        case 'com.qpp.cgp.domain.bom.material.MaterialIdSelector' : {
                                            materialPath.hide();
                                            materialId.show();
                                            jsonPath.hide();
                                            expression.hide();
                                            materialPath.setDisabled(true);
                                            materialId.setDisabled(false);
                                            jsonPath.setDisabled(true);
                                            expression.setDisabled(true);
                                            break;
                                        }
                                        case 'com.qpp.cgp.domain.bom.material.JsonPathSelector' : {
                                            materialPath.hide();
                                            materialId.hide();
                                            jsonPath.show();
                                            expression.hide();
                                            materialPath.setDisabled(true);
                                            materialId.setDisabled(true);
                                            jsonPath.setDisabled(false);
                                            expression.setDisabled(true);
                                            break;
                                        }
                                        case 'com.qpp.cgp.domain.bom.material.ExpressionSelector' : {
                                            materialPath.hide();
                                            materialId.hide();
                                            jsonPath.hide();
                                            expression.show();
                                            materialPath.setDisabled(true);
                                            materialId.setDisabled(true);
                                            jsonPath.setDisabled(true);
                                            expression.setDisabled(false);
                                            break;
                                        }
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'fieldcontainer',
                            itemId: 'IdPathSelector',
                            layout: 'hbox',
                            fieldLabel: i18n.getKey('materialPath'),
                            items: [
                                {
                                    xtype: 'textarea',
                                    itemId: 'materialPath',
                                    name: 'idPath',
                                    flex: 1,
                                    value: me.materialPath,
                                    margin: '0 5 0 0',
                                    allowBlank: false,
                                    readOnly: true,
                                    fieldLabel: false
                                },
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('choice'),
                                    width: 50,
                                    hidden: me.hideChangeMaterialPath,
                                    handler: function (button) {
                                        var materialPath = button.ownerCt.getComponent('materialPath').getValue();
                                        var component = button.ownerCt.getComponent('materialPath');
                                        var controller = Ext.create('CGP.product.view.productconfig.controller.Controller');
                                        controller.getMaterialPath(me.productBomConfigId, materialPath, component);
                                    }
                                }
                            ],
                            isValid: function () {
                                var me = this;
                                var materialPath = me.getComponent('materialPath');
                                if (me.disabled == true) {
                                    return true;
                                } else {
                                    return materialPath.isValid();
                                }
                            }
                        },
                        {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            hidden: true,
                            disabled: true,
                            itemId: 'MaterialIdSelector',
                            fieldLabel: i18n.getKey('productMaterialId'),
                            items: [
                                {
                                    xtype: 'textarea',
                                    itemId: 'materialId',
                                    allowBlank: false,
                                    name: 'materialId',
                                    flex: 1,
                                    margin: '0 5 0 5',
                                    readOnly: true,
                                    fieldLabel: false
                                },
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('choice'),
                                    width: 50,
                                    handler: function (button) {
                                        var materialPath = button.ownerCt.getComponent('materialId').getValue();
                                        var component = button.ownerCt.getComponent('materialId');
                                        var controller = Ext.create('CGP.product.view.productconfig.controller.Controller');
                                        controller.getMaterialPath(me.productBomConfigId, materialPath, component);
                                    }
                                }
                            ],
                            isValid: function () {
                                var me = this;
                                var materialId = me.getComponent('materialId');
                                if (me.disabled == true) {
                                    return true;
                                } else {
                                    return materialId.isValid();
                                }
                            }
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('jsonPath'),
                            name: 'jsonPath',
                            msgTarget: 'under',
                            hidden: true,
                            disabled: true,
                            itemId: 'JsonPathSelector',
                            allowBlank: false
                        },
                        {
                            xtype: 'expressionfield',
                            name: 'expression',
                            itemId: 'ExpressionSelector',
                            labelAlign: 'left',
                            hidden: true,
                            disabled: true,
                            fieldLabel: i18n.getKey('expression'),

                        }
                    ],
                },
                {
                    xtype: 'textarea',
                    name: 'conditionExpression',
                    itemId: 'conditionExpression',
                    fieldLabel: i18n.getKey('conditionExpression'),
                    minHeight: 100,
                    maxHeight: 200,
                    tipInfo: '条件配置优先级低于valueEx类型的条件'
                },
                {
                    xtype: 'valueexfield',
                    name: 'condition',
                    itemId: 'condition',
                    allowBlank: true,
                    hidden: true,
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
                    tipInfo: '新的条件'
                },
                {
                    xtype: 'conditionfieldv3',
                    fieldLabel: i18n.getKey('condition'),
                    itemId: 'conditionDTO',
                    checkOnly: false,
                    inputModel: 'MULTI',
                    contentData: contentData,
                    name: 'conditionDTO',
                    allowBlank: true,
                    contentTemplate: contentTemplate
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
                    margin: '15 15 0 15',
                    fieldLabel: i18n.getKey('mvtGroup'),
                    tipInfo: '把多个PMVT或者SMVT分为一组'
                }
            ]
        };
        me.items = [form];
        me.callParent(arguments);
    }
});
