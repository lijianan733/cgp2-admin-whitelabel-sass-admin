/**
 * Created by nan on 2020/7/30.
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.view.AssertantsGridField',
    'CGP.common.condition.ConditionFieldV3',
    'CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.config.Config',
    'CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.view.RelateComponent',
    'CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.view.CommonNavBarField',
    'CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.view.ElementEditorField',
    'CGP.common.field.MultiLanguageField',
    'CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.view.RegexField',
    'CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.view.TemplateGroupIdField',
    'CGP.businesstype.store.BusinessTypeStore',
    'CGP.pcresourcelibrary.model.PCResourceItemModel',
    'CGP.pcresourcelibrary.store.PCResourceItemStore',
    'CGP.pagecontentschema.view.canvas.config.Config',
    'CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.view.PcNodeSelector'
])
Ext.define('CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.view.DiyComponentFieldSet', {
        extend: 'Ext.form.FieldSet',
        controller: Ext.create('CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.controller.Controller'),
        alias: 'widget.diycomponentfieldset',
        width: 700,
        collapsible: true,
        margin: '10 50 50 50',
        style: {
            padding: '10 25 10 25',
            borderRadius: '8px'
        },
        defaults: {
            width: 650,
            margin: '10 25 10 25',
            labelWidth: 150,
            colspan: 2,
            allowBlank: true,
        },
        editViewType: null,
        model3DStore: null,
        profileStore: null,
        colorStore: null,
        clazz: null,//组件类型
        componentPath: null,//组件路径
        allowDelete: true,
        allowSelectComponent: false,//自己选择以前配置过的组件
        selectComponentCmp: null,
        componentId: null,
        optionalCmpTypeArr: null,//指定可选组件列表[]
        listeners: {
            afterrender: function (fieldSet) {
                var me = this;
                if (me.allowDelete) {
                    fieldSet.legend.add(fieldSet.createDeleteCmp());
                }
                if (me.allowSelectComponent) {
                    fieldSet.legend.add(fieldSet.createSelectComponentCmp());
                }
                fieldSet.setValue(fieldSet.data);
                if (fieldSet.title) {
                    setTimeout(function () {
                        fieldSet.setTitle(fieldSet.title);
                    }, 500)
                }
            },
        },
        configId: null,//标识配置
        isValid: function () {
            var me = this;
            var isValid = true;
            me.items.items.forEach(function (item) {
                if (item.rendered) {
                    if (item.isValid() == false) {
                        isValid = false;
                    }
                }
            });
            return isValid;
        },
        getValue: function () {
            var me = this;
            var result = {};
            me.items.items.forEach(function (item) {
                if (item.disabled == false) {
                    if (item.getName() == 'imageConfig' || item.getName() == 'fileConfig') {
                        result = Ext.Object.merge(result, item.getValue());
                    } else if (item.xtype == 'commonnavbarfield') {//这个也是专门弄个组件管理
                        result = Ext.Object.merge(result, item.diyGetValue());
                    } else {
                        if (item.diyGetValue) {
                            result[item.getName()] = item.diyGetValue();
                        } else {
                            result[item.getName()] = item.getValue();
                        }
                    }
                }
            });
            for (var i in result) {
                //去除空值
                if (typeof result[i] == 'object') {
                    Ext.Object.isEmpty(result[i]) ? delete result[i] : null;
                } else {
                    if (i == 'id') {

                    } else {
                        Ext.isEmpty(result[i]) ? delete result[i] : null;
                    }
                }
            }
            var clazz = result.clazz;
            var componentMapping = CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.config.Config.componentMapping;
            var type = '';
            for (var i in componentMapping) {
                if (componentMapping[i][0] == clazz) {
                    type = i;
                    break;
                }
            }
            result.type = type;
            return result;
        },
        getName: function () {
        },
        getFieldLabel: function () {
            var me = this;
            return me.title;
        },
        getErrors: function () {
            return '该配置必须完备';
        },
        setValue: function (data) {
            var me = this;
            for (var i = 0; i < me.items.items.length; i++) {
                var item = me.items.items[i];
                if (data) {
                    if (item.getName() == 'imageConfig' || item.getName() == 'fileConfig') {
                        item.setValue(data);
                    } else if (item.getName() == 'commonnavbar' && data.clazz == 'com.qpp.cgp.domain.product.config.view.builder.config.v3.CommonNavBarConfig') {
                        item.diySetValue(data);
                    } else if (item.getName() == 'model') {//有两个相同的字段都叫model
                        var itemData = data[item.getName()];
                        if (!Ext.isEmpty(itemData)) {
                            if (item.getItemId() == '3Dmodel' && itemData.clazz == 'com.qpp.cgp.domain.product.config.model.ThreeDModelConfig') {
                                if (item.diySetValue) {
                                    item.diySetValue(data[item.getName()])
                                } else {
                                    item.setValue(data[item.getName()]);
                                }
                            } else if (item.getItemId() == 'model') {
                                if (item.diySetValue) {
                                    item.diySetValue(data[item.getName()])
                                } else {
                                    item.setValue(data[item.getName()]);
                                }
                            }
                        }
                    } else {
                        if (!Ext.isEmpty(data[item.getName()])) {
                            if (item.diySetValue) {
                                item.diySetValue(data[item.getName()])
                            } else {
                                item.setValue(data[item.getName()]);
                            }
                        }
                    }
                }
            }
        },
        createDeleteCmp: function () {
            var me = this;
            me.deleteCmp = Ext.widget({
                xtype: 'button',
                margin: '-2 5 0 5',
                tooltip: '删除配置',
                componentCls: 'btnOnlyIcon',
                icon: path + 'ClientLibs/extjs/resources/themes/images/shared/fam/remove.png',
                handler: function (btn) {
                    Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (selector) {
                        if (selector == 'yes') {
                            //触发修改事件
                            var container = me.ownerCt;
                            container.remove(me);
                        }
                    })
                }
            });
            return me.deleteCmp;
        },
        createSelectComponentCmp: function () {
            var me = this;
            me.selectComponentCmp = Ext.widget({
                xtype: 'button',
                margin: '-2 5 0 5',
                tooltip: '选择配置',
                componentCls: 'btnOnlyIcon',
                icon: path + 'ClientLibs/extjs/resources/themes/images/shared/fam/cog.png',
                handler: function (btn) {
                   
                    var diyComponentFieldSet = btn.ownerCt.ownerCt;
                    var navigationTree = Ext.getCmp('navigationTree');
                    var nextWin = Ext.create('CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.view.managecomponent.ManageComponentInstanceWin', {
                        lastWin: null,
                        pathStr: null,
                        centerBuilderViewConfigPanel: null,
                        title: i18n.getKey('component') + i18n.getKey('manager'),
                        componentInstanceArr: window.componentArr,
                        treePanelCfg: {},
                        allowCreate: false,
                        optionalCmpTypeArr: ['RuntimeModelEditor', 'CanvasDocument', 'ThreeDDocument', 'ColorPropertyEditor',
                            'TextEditor', 'PhotoEditor', 'TemplateDownLoad'],
                        navigationTree: navigationTree,
                        diyComponentFieldSet: diyComponentFieldSet,
                        bbarCfg: {
                            hidden: false,
                            items: [
                                '->',
                                {
                                    xtype: 'displayfield',
                                    value: '<font color="red">如若对对组件配置有修改,请先保存后使用'
                                },
                                {
                                    text: i18n.getKey('使用该配置'),
                                    itemId: 'confirm',
                                    iconCls: 'icon_agree',
                                    handler: function (btn) {
                                        var win = btn.ownerCt.ownerCt;
                                        var treePanel = win.getComponent('treePanel');
                                        var selection = treePanel.getSelectionModel().getSelection();
                                        var initData = {};
                                        var diyComponentFieldSet = win.diyComponentFieldSet;
                                        if (selection.length > 0) {
                                            initData = selection[0].raw;
                                            diyComponentFieldSet.refreshData(initData);
                                            diyComponentFieldSet.setTitle('组件Id:' + initData._id);
                                            win.lastWin ? win.lastWin.close() : null;
                                            win.close();
                                        }
                                    }
                                },
                                {
                                    text: i18n.getKey('cancel'),
                                    iconCls: 'icon_cancel',
                                    handler: function (btn) {
                                        var win = btn.ownerCt.ownerCt;
                                        win.lastWin ? win.lastWin.close() : null;
                                        win.close();
                                    }
                                }
                            ]
                        }
                    });
                    nextWin.show();
                }
            });
            return me.selectComponentCmp;
        },
        initComponent: function () {
            var me = this;
            me.componentInfo = CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.config.Config.componentInfo;
            me.componentMapping = CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.config.Config.componentMapping;
            me.items = me.buildItemArr(me.clazz);
            me.callParent();
        },
        /**
         * 根据输入的组件类型组成items
         */
        buildItemArr: function (clazz) {
            var me = this;
            //可选组件列表
            var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
            var model3DStore = Ext.data.StoreManager.get('3DModelStore');
            var profileStore = Ext.data.StoreManager.get('profileStore');
            var colorStore = Ext.data.StoreManager.get('colorStore');
            var productId = builderConfigTab.productId;
            var productViewConfigId = JSGetQueryString('productViewConfigId');
            var contentData = me.controller.buildPMVTTContentData(productId);
            var businessTypeStore = Ext.create('CGP.businesstype.store.BusinessTypeStore');
            var eventConfigsStore = Ext.create('Ext.data.Store', {
                fields: [
                    'intention', 'eventName'
                ],
                data: []
            });
            var resourceItemStore = Ext.create('Ext.data.Store', {
                pageSize: 5,
                model: 'CGP.pcresourcelibrary.model.PCResourceItemModel',
                data: [],
                proxy: {
                    type: 'pagingmemory'
                }

            });
            var resource = CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.config.Config.resource;
            //建立上下文模板数据
            var contentTemplate = {
                args: {
                    "context": {
                        "smv": {
                            "_id": "",
                            "idReference": "SimplifyMaterialView",
                            "clazz": "com.qpp.cgp.domain.simplifyBom.SimplifyMaterialView",
                            "name": "EVA Top",
                            "materialViewType": null,
                            "isNeedPreprocess": false,
                            "isNeedInitPageContent": false,
                        },
                        "properties": {}
                    }
                }
            };
            var componentMapping = me.componentMapping;
            var clazzStoreData = function () {
                var arr = [];
                for (var i in componentMapping) {
                    //特殊规定了那些组件可用
                    if (me.optionalCmpTypeArr) {
                        if (me.optionalCmpTypeArr.indexOf(i) != -1) {
                            arr.push({
                                value: componentMapping[i][0],
                                display: i
                            });
                        }
                    } else {
                        arr.push({
                            value: componentMapping[i][0],
                            display: i
                        });
                    }
                }
                return arr;
            }();
            var optionalComponents = [
                {
                    xtype: 'textfield',
                    itemId: 'configId',
                    hidden: true,
                    name: 'configId',
                    value: me.configId
                },
                {
                    xtype: 'textfield',
                    fieldLabel: resource['id'],
                    itemId: '_id',
                    hidden: true,
                    name: '_id',
                    value: me.componentId
                },
                {
                    xtype: 'textfield',
                    fieldLabel: resource['description'],
                    itemId: 'description',
                    name: 'description',
                },
                {
                    xtype: 'textfield',
                    itemId: 'componentPath',
                    name: 'componentPath',
                    flex: 1,
                    fieldStyle: 'background-color:silver',
                    editable: false,
                    readOnly: true,
                    allowBlank: true,
                    hidden: true,
                    disabled: true,
                    fieldLabel: resource['component'] + resource['path'],
                    listeners: {
                        change: function (textarea, newValue, oldValue) {
                            textarea.setVisible(!Ext.isEmpty(newValue));
                            textarea.setDisabled(Ext.isEmpty(newValue));
                        }
                    },
                    diySetValue: function (data) {
                        var me = this;
                        if (data) {
                            if (data.clazz == "com.qpp.cgp.domain.product.config.view.builder.config.v3.NamePath") {
                                var name = data.name;
                                var area = data.path.match(/(?<=layoutPosition==').+?(?=\'\)\])/)[0];
                                me.setValue(area + '：' + name);
                            } else {
                                var area = data.path.match(/(?<=layoutPosition==').+?(?=\'\)\])/)[0];
                                var component = data.path.match(/(?<=@.name==').+?(?=\'\)\])/)[0];
                                me.setValue(area + '：' + component);
                            }
                        }
                    },
                    diyGetValue: function () {
                        var me = this;
                        var path = me.getValue();
                        var area = path.split('：')[0];
                        var component = path.split('：')[1];
                        var pathStr = "$.areas[?(@.position.layoutPosition==\'" + area + "\')].components[?(@.name==\'" + component + "\')]";
                        return {
                            clazz: 'com.qpp.cgp.domain.product.config.view.builder.config.v3.FullPath',
                            path: pathStr
                        }
                    }
                },
                {
                    xtype: 'combo',
                    name: 'clazz',
                    itemId: 'clazz',
                    fieldLabel: resource['type'],
                    valueField: 'value',
                    displayField: 'display',
                    allowBlank: false,
                    editable: false,
                    readOnly: true,
                    value: me.clazz,
                    fieldStyle: 'background-color:silver',
                    store: {
                        xtype: 'store',
                        fields: [
                            'display',
                            'value'
                        ],
                        data: clazzStoreData
                    }
                },
                {
                    xtype: 'multilanguagefield',
                    fieldLabel: resource['titleKey'],
                    itemId: 'titleKey',
                    name: 'titleKey',
                },
                {
                    xtype: 'gridfieldwithcrudv2',
                    fieldLabel: resource['buttons'],
                    itemId: 'buttons',
                    name: 'buttons',
                    minHeight: 100,
                    gridConfig: {
                        store: {
                            xtype: 'store',
                            fields: [
                                'intention', 'displayNameKey', 'hitCanvasId', 'hitElementSelector', {
                                    name: 'type',
                                    type: 'string',
                                    convert: function (value, record) {
                                        if (record.raw.hitCanvasId) {
                                            return 'hitCanvasId';
                                        } else {
                                            return 'hitElementSelector';
                                        }
                                    }
                                }
                            ],
                            data: []
                        },
                        columns: [
                            {
                                dataIndex: 'intention',
                                width: 90,
                                text: i18n.getKey('intention'),
                                renderer: function (value) {
                                    var PcsOperationIntention = CGP.pagecontentschema.view.canvas.config.Config.PcsOperationIntention;
                                    var result = '';
                                    PcsOperationIntention.map(function (item) {
                                        if (item.value == value) {
                                            result = item.display;
                                        }
                                    });
                                    return result;
                                }
                            },
                            {
                                dataIndex: 'displayNameKey',
                                width: 160,
                                text: i18n.getKey('button') + i18n.getKey('name'),
                                renderer: function (value, metaData, record) {
                                    return JSAutoWordWrapStr(value);
                                }
                            },
                            {
                                text: i18n.getKey('目标节点'),
                                flex: 1,
                                renderer: function (value, metaData, record) {
                                    var result = null;
                                    if (record.raw.hitCanvasId) {
                                        result = 'hitCanvasId : ' + record.raw.hitCanvasId;
                                    } else {
                                        result = 'hitElementSelector : ' + record.raw.hitElementSelector;
                                    }
                                    return JSAutoWordWrapStr(result);
                                }
                            },
                        ],
                    },
                    winConfig: {
                        formConfig: {
                            items: [
                                {
                                    xtype: 'combo',
                                    itemId: 'intention',
                                    fieldLabel: i18n.getKey('intention'),
                                    name: 'intention',
                                    valueField: 'value',
                                    displayField: 'display',
                                    editable: false,
                                    store: {
                                        xtype: 'store',
                                        fields: [
                                            'value', 'display'
                                        ],
                                        data: CGP.pagecontentschema.view.canvas.config.Config.PcsOperationIntention
                                    }
                                },
                                {
                                    xtype: 'multilanguagefield',
                                    fieldLabel: i18n.getKey('button') + i18n.getKey('name'),
                                    name: 'displayNameKey',
                                    itemId: 'displayNameKey',
                                },
                                {
                                    xtype: 'combo',
                                    editable: false,
                                    name: 'type',
                                    itemId: 'type',
                                    value: 'hitCanvasId',
                                    valueField: 'value',
                                    displayField: 'display',
                                    fieldLabel: i18n.getKey('type'),
                                    store: {
                                        xtype: 'store',
                                        fields: [
                                            'value', 'display'
                                        ],
                                        data: [
                                            {
                                                value: 'hitCanvasId',
                                                display: 'hitCanvasId'
                                            },
                                            {
                                                value: 'hitElementSelector',
                                                display: 'hitElement Selector'
                                            }
                                        ]
                                    },
                                    listeners: {
                                        change: function (combo, newValue, oldValue) {
                                            var hitCanvasId = combo.ownerCt.getComponent('hitCanvasId');
                                            var hitElementSelector = combo.ownerCt.getComponent('hitElementSelector');
                                            if (newValue == 'hitCanvasId') {
                                                hitCanvasId.show();
                                                hitCanvasId.setDisabled(false);
                                                hitElementSelector.hide();
                                                hitElementSelector.setDisabled(true);
                                            } else {
                                                hitElementSelector.show();
                                                hitElementSelector.setDisabled(false);
                                                hitCanvasId.hide();
                                                hitCanvasId.setDisabled(true);
                                            }
                                        }
                                    }
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'hitCanvasId',
                                    fieldLabel: i18n.getKey('hitCanvasId'),
                                    itemId: 'hitCanvasId',
                                },
                                {
                                    name: 'hitElementSelector',
                                    xtype: 'textarea',
                                    hidden: true,
                                    disabled: true,
                                    fieldLabel: i18n.getKey('hitElement Selector'),
                                    itemId: 'hitElementSelector',
                                },
                            ]
                        }
                    }
                },
                {
                    xtype: 'uxfieldset',
                    itemId: 'imageConfig',
                    name: 'imageConfig',
                    autoRender: true,
                    collapsible: true,
                    title: resource['提示信息配置'],
                    layout: {
                        type: 'vbox'
                    },
                    defaults: {
                        labelWidth: 150,
                        width: '100%',
                    },
                    items: [
                        {
                            xtype: 'multilanguagefield',
                            fieldLabel: resource['information LanguageKey'],
                            itemId: 'informationLanguageKey',
                            name: 'informationLanguageKey',
                        },
                        {
                            xtype: 'objectvaluefield',
                            fieldLabel: resource['information Variable'],
                            itemId: 'informationVariable',
                            name: 'informationVariable',
                            maxHeight: 350,
                            optionalKey: ['format', 'dpi', 'maxFileSize', 'maxFileSizeUnit', 'width', 'height'],
                            jsonTreePanelConfig: {
                                isHideActionColumn: false,
                                importBtnConfig: {
                                    hidden: false,
                                }
                            },
                            initData: {
                                format: 'jpg, jpeg, bmp, png, gif',
                                dpi: 300,
                                maxFileSize: 300,
                                maxFileSizeUnit: 'MB'
                            }
                        },
                        {
                            xtype: 'gridfieldwithcrudv2',
                            fieldLabel: resource['information VariableValueEx'],
                            itemId: 'informationVariableValueEx',
                            name: 'informationVariableValueEx',
                            minHeight: 100,
                            diySetValue: function (data) {
                                var me = this;
                                var keys = Object.keys(data || {});
                                var result = [];
                                for (var i = 0; i < keys.length; i++) {
                                    result.push({
                                        key: keys[i],
                                        value: data[keys[i]]
                                    })
                                }
                                me.setSubmitValue(result);
                            },
                            diyGetValue: function () {
                                var me = this;
                                var data = me.getSubmitValue();
                                var result = {};
                                for (var i = 0; i < data.length; i++) {
                                    result[data[i].key] = data[i].value;
                                }
                                return result;
                            },
                            gridConfig: {
                                store: {
                                    xtype: 'store',
                                    autoSync: true,
                                    fields: [
                                        {name: 'key', type: 'string'},
                                        {name: 'value', type: 'object'}
                                    ],
                                    data: []
                                },
                                columns: [
                                    {
                                        flex: 1,
                                        text: resource['key'],
                                        dataIndex: 'key',
                                        tdCls: 'vertical-middle'
                                    },
                                    {
                                        text: resource['value'],
                                        dataIndex: 'value',
                                        flex: 1,
                                        readOnly: true,
                                        canChangeValue: false,
                                        xtype: 'valueexcomponentcolumn',
                                        tdCls: 'vertical-middle'
                                    }
                                ]
                            },
                            winConfig: {
                                formConfig: {
                                    saveHandler: function (btn) {
                                        var form = btn.ownerCt.ownerCt;
                                        var win = form.ownerCt;
                                        if (form.isValid()) {
                                            var data = {};
                                            form.items.items.forEach(function (item) {
                                                if (item.disabled == false) {
                                                    //自定义获取值优先级高于普通getValue
                                                    if (item.diyGetValue) {
                                                        data[item.getName()] = item.diyGetValue();
                                                    } else {
                                                        data[item.getName()] = item.getValue();
                                                    }
                                                }
                                            });
                                            console.log(data);
                                            var record = win.outGrid.store.findRecord('key', data.key);
                                            if (win.createOrEdit == 'create') {
                                                if (record) {
                                                    Ext.Msg.alert(resource['prompt'], resource['该key已经存在，不予许重复添加']);
                                                } else {
                                                    win.outGrid.store.add(data);
                                                    win.close();
                                                }
                                            } else {
                                                if (record && record != win.record) {
                                                    Ext.Msg.alert(resource['prompt'], resource['该key已经存在，不予许重复添加']);
                                                } else {
                                                    for (var i in data) {
                                                        win.record.set(i, data[i]);
                                                    }
                                                    win.close();
                                                }
                                            }
                                        }
                                    },
                                    items: [
                                        {
                                            xtype: 'combo',
                                            name: 'key',
                                            itemId: 'key',
                                            allowBlank: false,
                                            fieldLabel: resource['key'],
                                            displayField: 'display',
                                            valueField: 'value',
                                            editable: true,
                                            store: {
                                                xtype: 'store',
                                                fields: ['value', 'display'],
                                                data: [
                                                    {
                                                        value: 'width',
                                                        display: 'width'
                                                    },
                                                    {
                                                        value: 'height',
                                                        display: 'height'
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            name: 'value',
                                            itemId: 'value',
                                            allowBlank: false,
                                            xtype: 'valueexfield',
                                            msgTarget: 'side',
                                            combineErrors: true,
                                            fieldLabel: resource['value'],
                                            commonPartFieldConfig: {
                                                uxTextareaContextData: true,
                                                defaultValueConfig: {
                                                    type: 'String',
                                                    clazz: 'com.qpp.cgp.value.ExpressionValueEx',
                                                    typeSetReadOnly: false,
                                                    clazzSetReadOnly: true

                                                }
                                            }
                                        }
                                    ],
                                    isValid: function () {
                                        var me = this;
                                        var isValid = true;
                                        for (var i = 0; i < me.items.items.length; i++) {
                                            if (me.items.items[i].isValid() == false) {
                                                isValid = false;
                                            }
                                        }
                                        return isValid;
                                    }
                                },
                            }
                        },
                    ]
                },
                {
                    xtype: 'checkbox',
                    fieldLabel: resource['readOnly'],
                    itemId: 'readOnly',
                    name: 'readOnly',
                },
                {
                    xtype: 'uxfieldset',
                    itemId: 'fileConfig',
                    name: 'fileConfig',
                    autoRender: true,
                    collapsible: true,
                    title: resource['文件上传配置'],
                    layout: {
                        type: 'vbox'
                    },
                    defaults: {
                        labelWidth: 150,
                        width: '100%',
                    },
                    items: [
                        {
                            xtype: 'numberfield',
                            fieldLabel: resource['maxFileSize'],
                            itemId: 'maxFileSize',
                            minValue: 0,
                            /* hidden: true,
                             disabled: true,*/
                            name: 'maxFileSize'
                        },
                        {
                            xtype: 'combo',
                            fieldLabel: resource['maxFileSizeUnit'],
                            itemId: 'maxFileSizeUnit',
                            name: 'maxFileSizeUnit',
                            /*hidden: true,
                            disabled: true,*/
                            valueField: 'value',
                            displayField: 'display',
                            editable: false,
                            store: {
                                xtype: 'store',
                                fields: [
                                    'value', 'display'
                                ],
                                data: [
                                    {
                                        value: 'B',
                                        display: 'B'
                                    }, {
                                        value: 'KB',
                                        display: 'KB'
                                    }, {
                                        value: 'MB',
                                        display: 'MB'
                                    }, {
                                        value: 'GB',
                                        display: 'GB'
                                    }
                                ]
                            }
                        },
                        {
                            name: 'fileExtensions',
                            itemId: 'fileExtensions',
                            xtype: 'arraydatafield',
                            allowBlank: true,
                            /*hidden: true,
                            disabled: true,*/
                            fieldLabel: resource['fileExtensions'],
                            resultType: 'String',
                            tipInfo: '用于界面上提示用户哪些文件类型可以上传',
                            panelConfig: {
                                width: '100%',
                                minHeight: 50,
                                allowBlank: true,
                                bodyStyle: {
                                    borderColor: '#c0c0c0'
                                }
                            },
                            optionalData: [
                                {
                                    value: 'PDF',
                                    display: 'PDF'
                                },
                                {
                                    value: 'jpg',
                                    display: 'jpg'
                                }, {
                                    value: 'jpeg',
                                    display: 'jpeg'
                                }, {
                                    value: 'bmp',
                                    display: 'bmp'
                                }, {
                                    value: 'png',
                                    display: 'png'
                                }, {
                                    value: 'gif',
                                    display: 'gif'
                                }
                            ]
                        },
                        {
                            name: 'fileFilters',
                            itemId: 'fileFilters',
                            xtype: 'arraydatafield',
                            allowBlank: true,
                            resultType: 'String',
                            /*   hidden: true,
                               disabled: true,*/
                            fieldLabel: resource['fileFilters'],
                            tipInfo: '文件上传中限制用户能选择哪些类型的文件',
                            panelConfig: {
                                width: '100%',
                                minHeight: 50,
                                allowBlank: true,
                                bodyStyle: {
                                    borderColor: '#c0c0c0'
                                }
                            },
                            optionalData: [
                                {
                                    value: 'application/pdf',
                                    display: 'application/pdf'
                                },
                                {
                                    value: 'image/jpg',
                                    display: 'image/jpg'
                                },
                                {
                                    value: 'image/jpeg',
                                    display: 'image/jpeg'
                                },
                                {
                                    value: 'image/bmp',
                                    display: 'image/bmp'
                                },
                                {
                                    value: 'image/png',
                                    display: 'image/png'
                                },
                                {
                                    value: 'image/gif',
                                    display: 'image/gif'
                                }, {
                                    value: 'image/tif',
                                    display: 'image/tif'
                                }, {
                                    value: 'image/tiff',
                                    display: 'image/tiff'
                                }
                            ]
                        },
                    ]
                },
                {
                    xtype: 'checkbox',
                    fieldLabel: resource['showOpenLibrary'],
                    itemId: 'showOpenLibrary',
                    name: 'showOpenLibrary',
                },
                {
                    xtype: 'checkbox',
                    fieldLabel: resource['showAutoFill'],
                    itemId: 'showAutoFill',
                    name: 'showAutoFill',
                },

                {
                    xtype: 'checkbox',
                    fieldLabel: resource['"设置为背景"是否显示'],
                    itemId: 'showSetBackground',
                    name: 'showSetBackground',
                    listeners: {
                        change: function (checkbox, newValue, oldValue) {
                           
                            var setBackgroundWithColor = checkbox.ownerCt.getComponent('setBackgroundWithColor');
                            if (newValue) {
                                setBackgroundWithColor.setDisabled(false);
                                setBackgroundWithColor.show();
                            } else {
                                setBackgroundWithColor.setDisabled(true);
                                setBackgroundWithColor.hide();
                            }
                        }
                    }
                },
                {
                    xtype: 'gridcombo',
                    fieldLabel: resource['背景遮盖颜色'],
                    itemId: 'setBackgroundWithColor',
                    name: 'setBackgroundWithColor',
                    valueField: '_id',
                    displayField: 'colorName',
                    store: colorStore,
                    editable: false,
                    matchFieldWidth: false,
                    filterCfg: {
                        minHeight: 60,
                        layout: {
                            type: 'column',
                            columns: 2
                        },
                        items: [
                            {
                                name: '_id',
                                xtype: 'textfield',
                                hideTrigger: true,
                                isLike: false,
                                allowDecimals: false,
                                fieldLabel: resource['id'],
                                itemId: '_id'
                            }, {
                                name: 'colorName',
                                xtype: 'textfield',
                                hideTrigger: true,
                                isLike: false,
                                margin: 0,
                                allowDecimals: false,
                                fieldLabel: resource['color'] + resource['name'],
                                itemId: 'colorName'
                            }
                        ]
                    },
                    hidden: true,
                    disabled: true,
                    gridCfg: {
                        height: 450,
                        width: 550,
                        columns: [
                            {
                                text: resource['id'],
                                dataIndex: '_id',
                                itemId: '_id',
                            },
                            {
                                text: resource['color'] + resource['name'],
                                dataIndex: 'colorName',
                                itemId: 'colorName',
                                width: 110,
                            },
                            {
                                text: resource['color'] + resource['code'] + '(16进制)',
                                dataIndex: 'displayCode',
                                itemId: 'displayCode',
                                width: 150,
                            },
                            {
                                text: resource['显示颜色'],
                                itemId: 'color',
                                dataIndex: 'color',
                                flex: 1,
                                minWidth: 100
                            }
                        ],
                        bbar: {
                            xtype: 'pagingtoolbar',
                            store: colorStore,
                            displayInfo: true,
                            displayMsg: '',
                            emptyMsg: resource['noData']
                        }
                    },
                    diySetValue: function (data) {
                        var me = this;
                        if (data) {
                            me.setInitialValue([data._id]);
                        } else {
                            me.setValue(null);
                        }
                    },
                    diyGetValue: function () {
                        var me = this;
                        var dataMapping = me.getValue();
                        var id = me.getSubmitValue()[0];
                        if (id) {
                            return {
                                '_id': id,
                                'clazz': 'com.qpp.cgp.domain.common.color.RgbColor'
                            };
                        } else {
                            return null;
                        }
                    }
                },
                {
                    name: 'toolTips',
                    itemId: 'toolTips',
                    xtype: 'arraydatafield',
                    allowChangSort: true,
                    allowBlank: true,
                    resultType: 'Array',
                    tipInfo: '可拖拽调整顺序',
                    fieldLabel: resource['提示信息列表'],
                    colspan: 2,
                    panelConfig: {
                        width: '100%',
                        minHeight: 50,
                        allowBlank: true,
                        bodyStyle: {
                            borderColor: '#c0c0c0'
                        }
                    },
                    optionalData: [
                        {
                            value: 'supportIntroduce',
                            display: resource['supportIntroduce']
                        }, {
                            value: 'fontIntroduce',
                            display: resource['fontIntroduce']
                        }, {
                            value: 'cutlineIntroduce',
                            display: resource['cutlineIntroduce']
                        }, {
                            value: 'imgIntroduce',
                            display: resource['imgIntroduce']
                        }
                    ]
                },
                {
                    xtype: 'assertantsgridfield',
                    maxHeight: 350,
                    allowBlank: false,
                    profileStore: profileStore,
                    name: 'assistants',
                    itemId: 'assistants',
                    fieldLabel: resource['内嵌组件列表']
                },
                {
                    xtype: 'numberfield',
                    name: 'column',
                    itemId: 'column',
                    minValue: 0,
                    value: 1,
                    allowDecimals: true,
                    decimalPrecision: 2,
                    fieldLabel: resource['column'],
                },
                {
                    xtype: 'combo',
                    fieldLabel: resource['适应模式'],
                    itemId: 'fitMode',
                    name: 'fitMode',
                    editable: false,
                    valueField: 'value',
                    displayField: 'display',
                    store: {
                        xtype: 'store',
                        fields: [
                            'value', 'display'
                        ],
                        data: [
                            {
                                value: 'fitPage',
                                display: '自适应页面大小'
                            },
                            {
                                value: 'fitWidth',
                                display: '宽自适应页面宽'
                            }
                        ]
                    }
                },
                {
                    xtype: 'gridcombo',
                    fieldLabel: resource['3D模型数据'],
                    allowBlank: false,
                    valueField: '_id',
                    displayField: 'displayField',
                    store: model3DStore,
                    editable: false,
                    itemId: '3Dmodel',
                    name: 'model',
                    matchFieldWidth: false,
                    colspan: 1,
                    gridCfg: {
                        width: 650,
                        store: model3DStore,
                        height: 350,
                        columns: [
                            {
                                text: resource['id'],
                                dataIndex: '_id',
                                itemId: '_id',
                            }, {
                                text: resource['name'],
                                dataIndex: 'modelName',
                                itemId: 'modelName',
                                flex: 1
                            }, {
                                text: resource['description'],
                                dataIndex: 'description',
                                itemId: 'description',
                                flex: 1
                            }
                        ],
                        bbar: {
                            xtype: 'pagingtoolbar',
                            store: model3DStore,
                            displayInfo: true,
                            displayMsg: '',
                            emptyMsg: resource['noData']
                        }
                    },
                    filterCfg: {
                        layout: {
                            type: 'table',
                            columns: 2
                        },
                        defaults: {
                            width: 250,
                        },
                        height: 80,
                        items: [
                            {
                                name: '_id',
                                xtype: 'textfield',
                                isLike: false,
                                fieldLabel: resource['id'],
                                itemId: 'id'
                            },
                            {
                                name: 'description',
                                xtype: 'textfield',
                                fieldLabel: resource['description'],
                                itemId: 'description'
                            },
                            {
                                name: 'modelName',
                                xtype: 'textfield',
                                fieldLabel: resource['name'],
                                itemId: 'name'
                            }
                        ]
                    },
                    haveReset: true,
                    gotoConfigHandler: function (event) {
                        var me = this;
                        var modelId = this.getSubmitValue()[0];
                        JSOpen({
                            id: 'threedmodelconfiggpage',
                            url: path + 'partials/threedmodelconfig/main.html?_id=' + modelId,
                            title: '订单项管理 所有状态',
                            refresh: true,
                        })

                    },
                    getAssets: function (modelId) {
                        var assets = [];
                        var filterData = Ext.JSON.encode([{
                            "name": "config._id",
                            "type": "string",
                            "value": modelId
                        }]);
                        var url = adminPath + 'api/threeDModelRuntimeConfigs?page=1&start=0&limit=1000&filter=' + filterData;
                        JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
                            if (success) {
                                var responseText = Ext.JSON.decode(response.responseText);
                                if (responseText.data.content[0]) {
                                    assets = responseText.data.content[0].assets;
                                }

                            }
                        })
                        return assets;
                    },
                    diyGetValue: function () {
                        var me = this;
                        console.log(me.getSubmitValue())
                        return {
                            clazz: "com.qpp.cgp.domain.product.config.model.ThreeDModelConfig",
                            multilingualKey: "com.qpp.cgp.domain.product.config.model.ThreeDModelConfig",
                            _id: me.getSubmitValue()[0]
                        }
                    },
                    diySetValue: function (data) {
                        var me = this;
                        if (data) {
                            me.lastValue = 'initValue';
                            me.setInitialValue([data._id]);
                        }
                    },
                    listeners: {
                        change: function (field, newValue, oldValue) {
                            var modelId = field.getSubmitValue()[0];
                            var form = field.ownerCt;
                            var assetsField = form.getComponent('assets');
                            //如果是设置初始值,就不再执行下面的逻辑
                            if (oldValue == 'initValue') {
                            } else {
                                if (modelId) {
                                    var assets = field.getAssets(modelId);
                                    if (assets) {
                                        if (assets) {
                                            assetsField._grid.store.removeAll();
                                            var newAssets = assets.map(function (item) {
                                                item.imageName = item.defaultImage;
                                                return item;
                                            });
                                            assetsField._grid.store.loadData(newAssets);
                                        }
                                    }
                                } else {
                                    assetsField._grid.store.removeAll();
                                }
                            }
                        }
                    }
                },
                {
                    xtype: 'numberfield',
                    name: 'pageScale',
                    itemId: 'pageScale',
                    minValue: 0,
                    allowDecimals: false,
                    fieldLabel: resource['放大倍数'],
                },
                {
                    xtype: 'gridfieldwithcrudv2',
                    fieldLabel: resource['模型配置数据'],
                    itemId: 'assets',
                    name: 'assets',
                    height: 200,
                    gridConfig: {
                        autoScroll: true,
                        viewConfig: {
                            autoScroll: true,
                        },
                        store: {
                            xtype: 'store',
                            autoSync: true,
                            fields: [
                                {name: 'name', type: 'string'},
                                {name: 'pcIndex', type: 'number', useNull: true},
                                {
                                    name: 'imageName',
                                    type: 'string',
                                    useNull: true,
                                    convert: function (value, record) {
                                        if (Ext.isEmpty(value)) {
                                            return null;
                                        } else {
                                            return value;
                                        }
                                    }
                                },
                                {name: 'description', type: 'string'},
                                {name: 'useTransparentMaterial', type: 'boolean'},
                                {name: 'condition', type: 'object'},
                                {name: 'conditionDTO', type: 'object'},
                                {name: 'type', type: 'string'}
                            ],
                            data: []
                        },
                        columns: [
                            {
                                text: resource['材质名'],
                                dataIndex: 'name',
                                width: 150,
                                tdCls: 'vertical-middle'
                            },
                            {
                                text: resource['description'],
                                dataIndex: 'description',
                                width: 150,
                                tdCls: 'vertical-middle'
                            },
                            {
                                text: resource['condition'],
                                dataIndex: 'condition',
                                xtype: 'componentcolumn',
                                width: 100,
                                renderer: function (value, metadata, record) {
                                    if (value) {
                                        metadata.tdAttr = 'data-qtip="查看"';
                                        return {
                                            xtype: 'displayfield',
                                            value: '<a href="#")>查看</a>',
                                            listeners: {
                                                render: function (display) {
                                                    var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                                    var ela = Ext.fly(a); //获取到a元素的element封装对象
                                                    ela.on("click", function () {
                                                        JSShowJsonData(value, resource['condition']);
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                text: resource['pcIndex'],
                                dataIndex: 'pcIndex',
                                width: 100,
                            },
                            {
                                text: resource['image'] + resource['name'],
                                dataIndex: 'imageName',
                                tdCls: 'vertical-middle',
                                xtype: 'componentcolumn',
                                width: 100,
                                renderer: function (value, metadata, record) {
                                    if (!Ext.isEmpty(value)) {
                                        metadata.tdAttr = 'data-qtip="查看"';
                                        return {
                                            xtype: 'displayfield',
                                            value: '<a href="#")>查看</a>',
                                            listeners: {
                                                render: function (display) {
                                                    var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                                    var ela = Ext.fly(a); //获取到a元素的element封装对象
                                                    ela.on("click", function () {
                                                        JSShowJsonData(value, '查看图片路径');
                                                    });
                                                }
                                            }
                                        };
                                    }
                                }
                            },
                            {
                                dataIndex: 'useTransparentMaterial',
                                text: resource['是否使用透明材质'],
                                width: 100,
                            },
                            {
                                text: resource['image'] + resource['type'],
                                dataIndex: 'type',
                                width: 100,
                                tdCls: 'vertical-middle',
                                renderer: function (value, mateData, record) {
                                    if (value == 'Fix') {
                                        return '固定内容';
                                    } else if (value == 'Dynamic') {
                                        return '定制内容';
                                    }
                                }
                            },
                        ]
                    },
                    winConfig: {
                        setValueHandler: function (data) {
                            var win = this;
                            //本来应该是去修改组件获取数据的方法，使它们获取到的数据每次都是个独立的对象，使之修改获取到的数据不会互相影响
                            data = Ext.clone(data);
                            var form = win.getComponent('form');
                            form.items.items.forEach(function (item) {
                                if (item.disabled == false) {
                                    if (item.diySetValue) {
                                        item.diySetValue(data[item.getName()]);
                                    } else {
                                        item.setValue(data[item.getName()]);
                                    }
                                }
                            })

                            //对数据进行处理
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
                        formConfig: {
                            width: 500,
                            defaults: {
                                width: 450
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    name: 'name',
                                    itemId: 'name',
                                    allowBlank: false,
                                    fieldLabel: resource['材质名'],
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'description',
                                    itemId: 'description',
                                    allowBlank: false,
                                    fieldLabel: resource['description'],
                                },
                                {
                                    xtype: 'valueexfield',
                                    name: 'condition',
                                    itemId: 'condition',
                                    allowBlank: true,
                                    hidden: true,
                                    fieldLabel: resource['condition'],
                                    commonPartFieldConfig: {
                                        defaultValueConfig: {
                                            type: 'Boolean',
                                            typeSetReadOnly: true,
                                        }
                                    },
                                    diySetValue: function (data) {
                                        if (data) {
                                            this.setValue(data);
                                        }
                                    }
                                },
                                {
                                    xtype: 'conditionfieldv3',
                                    fieldLabel: resource['condition'],
                                    name: 'conditionDTO',
                                    allowBlank: true,
                                    contentData: contentData,
                                    contentTemplate: contentTemplate,
                                    itemId: 'conditionDTO'
                                },
                                {
                                    xtype: 'numberfield',
                                    name: 'pcIndex',
                                    minValue: 0,
                                    itemId: 'pcIndex',
                                    allowBlank: true,
                                    fieldLabel: resource['pcIndex'],
                                },
                                {
                                    xtype: 'fileuploadv2',
                                    name: 'imageName',
                                    itemId: 'imageName',
                                    allowBlank: true,
                                    formFileName: 'file',
                                    maxHeight: 250,
                                    isShowImage: true,
                                    valueUrlType: 'full',
                                    aimFileServerUrl: imageServer + 'upload/static?dirName=',//指定文件夹
                                    staticDir:'model-preview/data/image',
                                    fieldLabel: resource['image'] + resource['name'],
                                },
                                {
                                    xtype: 'checkbox',
                                    name: 'useTransparentMaterial',
                                    itemId: 'useTransparentMaterial',
                                    checked: false,
                                    fieldLabel: resource['是否使用透明材质'],
                                },
                                {
                                    xtype: 'combo',
                                    editable: false,
                                    name: 'type',
                                    itemId: 'type',
                                    valueField: 'value',
                                    displayField: 'display',
                                    value: 'Dynamic',
                                    store: {
                                        xtype: 'store',
                                        fields: ['value', 'display'],
                                        data: [{
                                            value: 'Dynamic',
                                            display: resource['定制内容']
                                        }, {
                                            value: 'Fix',
                                            display: resource['固定内容']
                                        }]
                                    },
                                    fieldLabel: resource['image'] + resource['type'],
                                }
                            ],
                            saveHandler: function (btn) {
                                var form = btn.ownerCt.ownerCt;
                                var win = form.ownerCt;
                                if (form.isValid()) {
                                    var data = {};
                                    form.items.items.forEach(function (item) {
                                        if (item.disabled == false) {
                                            //自定义获取值优先级高于普通getValue
                                            if (item.diyGetValue) {
                                                data[item.getName()] = item.diyGetValue();
                                            } else {
                                                data[item.getName()] = item.getValue();
                                            }
                                        }
                                    });
                                    console.log(data);

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

                                    if (win.createOrEdit == 'create') {
                                        win.outGrid.store.add(data);
                                    } else {
                                        for (var i in data) {
                                            win.record.set(i, data[i]);
                                        }
                                    }
                                    win.close();
                                }
                            },
                            isValid: function () {
                                var form = this;
                                this.msgPanel.hide();
                                var isValid = true,
                                    errors = {};
                                this.items.items.forEach(function (f) {
                                    if (!f.isValid()) {
                                        var errorInfo = f.getErrors();
                                        if (Ext.isObject(errorInfo) && !Ext.Object.isEmpty(errorInfo)) {//处理uxfieldContainer的错误信息
                                            errors = Ext.Object.merge(errors, errorInfo);
                                        } else {
                                            errors[f.getFieldLabel()] = errorInfo;
                                        }
                                        isValid = false;

                                    }
                                });
                                var pcIndex = form.getComponent('pcIndex').getValue();
                                var imageName = form.getComponent('imageName').getValue();
                                if (Ext.isEmpty(pcIndex) && Ext.isEmpty(imageName)) {
                                    errors['提示'] = 'pcIndex或imageName必须配置一项';
                                    isValid = false;
                                } else if ((!Ext.isEmpty(pcIndex)) && (!Ext.isEmpty(imageName))) {
                                    errors['提示'] = '不允许pcIndex和imageName同时配置';
                                    isValid = false;
                                }
                                isValid ? null : this.showErrors(errors);
                                return isValid;
                            }
                        },
                    },
                    diyGetValue: function () {
                        var me = this;
                        var data = me.getSubmitValue();
                        JSClearNullValue(data);
                        return data;
                    }
                },
                {
                    name: 'showWhenInit',
                    xtype: 'combo',
                    fieldLabel: resource['初始化后显示'],
                    itemId: 'showWhenInit',
                    editable: false,
                    valueField: 'value',
                    value: false,
                    displayField: 'display',
                    store: {
                        xtype: 'store',
                        fields: [
                            {
                                name: 'value',
                                type: 'boolean'
                            }, 'display'
                        ],
                        data: [
                            {
                                value: true,
                                display: 'true'
                            },
                            {
                                value: false,
                                display: 'false'
                            }
                        ]
                    }
                },
                {
                    name: 'autoSubmit',
                    xtype: 'combo',
                    fieldLabel: resource['自动提交'],
                    itemId: 'autoSubmit',
                    editable: false,
                    valueField: 'value',
                    displayField: 'display',
                    value: false,
                    store: {
                        xtype: 'store',
                        fields: [
                            {
                                name: 'value',
                                type: 'boolean'
                            }, 'display'
                        ],
                        data: [
                            {
                                value: true,
                                display: 'true'
                            },
                            {
                                value: false,
                                display: 'false'
                            }
                        ]
                    }
                },
                {
                    name: 'color',
                    xtype: 'attributetreecombo',
                    profileStore: profileStore,
                    fieldLabel: resource['color'],
                    itemId: 'color',
                },
                {
                    xtype: 'rttypetortobjectfieldcontainer',
                    itemId: 'model',
                    name: 'model',
                    allowBlank: false,
                    maxHeight: 250,
                    isFormField: true,
                    fieldLabel: resource['template'] + resource['config'],
                    rtTypeAttributeInputFormConfig: {
                        xtype: 'rttypetortobjectformv2',
                        hideRtType: false,
                        maxHeight: 250,
                        rootVisible: false,
                        rtTypeTreeStore: Ext.data.StoreManager.get('rtTypeTreeStore')

                    },
                    listeners: {
                        afterrender: function () {
                            var me = this;
                            var template = me.ownerCt.getComponent('template');
                            var rtTypeField = me.items.items[0].getDockedItems('toolbar[dock="top"]')[0].items.items[0];
                            rtTypeField.on('change', function () {
                                var configName = this.getRawValue();
                                var data = CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.config.Config.runtimeModelEditor[configName];
                                template.setValue(data);
                            })
                        }
                    }
                },
                {
                    name: 'template',
                    xtype: 'uxtextarea',
                    fieldLabel: resource['template'],
                    itemId: 'template',
                    height: 300,
                    readOnly: true,
                    toolbarConfig: {
                        items: [
                            {
                                xtype: 'splitbutton',
                                text: resource['导入模板数据'],
                                importData: function (btn) {
                                    var me = this;
                                    var data = CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.config.Config.runtimeModelEditor[btn.itemId];
                                    var uxtextarea = me.ownerCt.ownerCt;
                                    uxtextarea.setValue(data);

                                },
                                menu: [
                                    {
                                        text: 'easyAdvance',
                                        itemId: 'easyAdvance',
                                        handler: function (btn) {
                                            var splitButton = btn.ownerCt.ownerButton;
                                            splitButton.importData(btn);
                                        }
                                    },
                                    {
                                        text: 'qtySameDifferent',
                                        itemId: 'qtySameDifferent',
                                        handler: function (btn) {
                                            var splitButton = btn.ownerCt.ownerButton;
                                            splitButton.importData(btn);
                                        }
                                    },
                                    {
                                        text: 'pokeColor',
                                        itemId: 'pokeColor',
                                        handler: function (btn) {
                                            var splitButton = btn.ownerCt.ownerButton;
                                            splitButton.importData(btn);
                                        }
                                    },
                                    {
                                        text: 'pokeImage',
                                        itemId: 'pokeImage',
                                        handler: function (btn) {
                                            var splitButton = btn.ownerCt.ownerButton;
                                            splitButton.importData(btn);
                                        }
                                    },
                                    {
                                        text: 'pokeImageText',
                                        itemId: 'pokeImageText',
                                        handler: function (btn) {
                                            var splitButton = btn.ownerCt.ownerButton;
                                            splitButton.importData(btn);
                                        }
                                    }, {
                                        text: 'pokeSameDifferent',
                                        itemId: 'pokeSameDifferent',
                                        handler: function (btn) {
                                            var splitButton = btn.ownerCt.ownerButton;
                                            splitButton.importData(btn);
                                        }
                                    }, {
                                        text: 'calendarDetail',
                                        itemId: 'calendarDetail',
                                        handler: function (btn) {
                                            var splitButton = btn.ownerCt.ownerButton;
                                            splitButton.importData(btn);
                                        }
                                    },
                                    {
                                        text: 'deskCalendaryDetail',
                                        itemId: 'deskCalendaryDetail',
                                        handler: function (btn) {
                                            var splitButton = btn.ownerCt.ownerButton;
                                            splitButton.importData(btn);
                                        }
                                    },
                                    {
                                        text: 'sameDifferent',
                                        itemId: 'sameDifferent',
                                        handler: function (btn) {
                                            var splitButton = btn.ownerCt.ownerButton;
                                            splitButton.importData(btn);
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    textareaConfig: {
                        xtype: 'htmleditor'
                    }

                },
                {
                    xtype: 'commonnavbarfield',
                    name: 'commonnavbar',
                    itemId: 'commonnavbar'
                },
                {
                    xtype: 'textfield',
                    name: 'elementClazz',
                    itemId: 'elementClazz',
                    readOnly: true,
                    fieldStyle: 'background-color: silver',//设置文本框的样式
                    tipInfo: '通过元素样式,筛选触发该组件的元素',
                    fieldLabel: resource['目标元素类型'],
                },
                {
                    xtype: 'textfield',
                    name: 'elementTag',
                    itemId: 'elementTag',
                    tipInfo: '通过元素标签,筛选触发该组件的元素',
                    fieldLabel: resource['目标元素标签'],
                },
                {
                    xtype: 'numberfield',
                    name: 'sizeMin',
                    itemId: 'sizeMin',
                    fieldLabel: resource['字体大小最小值'],
                },
                {
                    xtype: 'numberfield',
                    name: 'sizeMax',
                    itemId: 'sizeMax',
                    fieldLabel: resource['字体大小最大值'],
                },
                {
                    xtype: 'checkbox',
                    name: 'showRotation',
                    colspan: 1,
                    width: 325,
                    checked: true,
                    itemId: 'showRotation',
                    fieldLabel: resource['启用旋转'],
                },
                {
                    xtype: 'checkbox',
                    fieldLabel: resource['启用缩放'],
                    itemId: 'showZoom',
                    colspan: 1,
                    width: 325,
                    checked: true,
                    name: 'showZoom',
                },
                {
                    xtype: 'checkbox',
                    fieldLabel: resource['启用翻转'],
                    itemId: 'showFlip',
                    colspan: 1,
                    width: 325,
                    checked: true,
                    name: 'showFlip',
                },
                {
                    xtype: 'checkbox',
                    fieldLabel: resource['启用明亮度'],
                    itemId: 'showBrightness',
                    colspan: 1,
                    width: 325,
                    checked: true,
                    name: 'showBrightness',
                    listeners: {
                        change: function (checkbox, newValue, oldValue) {
                            var brightnessMin = checkbox.ownerCt.getComponent('brightnessMin');
                            var brightnessMax = checkbox.ownerCt.getComponent('brightnessMax');
                            if (newValue == true) {
                                brightnessMin.show();
                                brightnessMin.setDisabled(false);
                                brightnessMax.show();
                                brightnessMax.setDisabled(false);
                            } else {
                                brightnessMin.hide();
                                brightnessMin.setDisabled(true);
                                brightnessMax.hide();
                                brightnessMax.setDisabled(true);
                            }
                        }
                    }
                },
                {
                    xtype: 'numberfield',
                    fieldLabel: resource['明亮度最小值'],
                    itemId: 'brightnessMin',
                    name: 'brightnessMin',
                },
                {
                    xtype: 'numberfield',
                    fieldLabel: resource['明亮度最大值'],
                    itemId: 'brightnessMax',
                    name: 'brightnessMax',
                },
                {
                    xtype: 'gridfieldwithcrudv2',
                    fieldLabel: resource['滤镜'],
                    itemId: 'filters',
                    name: 'filters',
                    height: 200,
                    triggerAction: 'author',
                    gridConfig: {
                        autoScroll: true,
                        viewConfig: {
                            autoScroll: true,
                        },
                        store: {
                            xtype: 'store',
                            autoSync: true,
                            fields: [
                                {name: 'parameter', type: 'string'},
                                {name: 'displayNameKey', type: 'string'},
                                {name: 'colorCode', type: 'string'}
                            ],
                            data: []
                        },
                        columns: [
                            {
                                text: resource['displayNameKey'],
                                dataIndex: 'displayNameKey',
                                width: 150,
                            },
                            {
                                text: resource['colorCode'],
                                dataIndex: 'colorCode',
                                width: 150,
                            },
                            {
                                text: resource['parameter'],
                                dataIndex: 'parameter',
                                width: 150,
                            },
                        ]
                    },
                    winConfig: {
                        formConfig: {
                            width: 500,
                            defaults: {
                                width: 450
                            },
                            items: [
                                {
                                    xtype: 'multilanguagefield',
                                    fieldLabel: resource['displayNameKey'],
                                    itemId: 'displayNameKey',
                                    name: 'displayNameKey',
                                },
                                {
                                    xtype: 'gridcombo',
                                    fieldLabel: resource['colorCode'],
                                    itemId: 'colorCode',
                                    name: 'colorCode',
                                    valueField: 'displayCode',
                                    displayField: 'displayCode',
                                    store: colorStore,
                                    editable: true,
                                    matchFieldWidth: false,
                                    autoQuery: false,//是否开启输入自动查询功能
                                    filterCfg: {
                                        minHeight: 60,
                                        layout: {
                                            type: 'column',
                                            columns: 2
                                        },
                                        items: [
                                            {
                                                name: '_id',
                                                xtype: 'textfield',
                                                hideTrigger: true,
                                                isLike: false,
                                                allowDecimals: false,
                                                fieldLabel: resource['id'],
                                                itemId: '_id'
                                            }, {
                                                name: 'colorName',
                                                xtype: 'textfield',
                                                hideTrigger: true,
                                                isLike: false,
                                                margin: 0,
                                                allowDecimals: false,
                                                fieldLabel: resource['color'] + resource['name'],
                                                itemId: 'colorName'
                                            }
                                        ]
                                    },
                                    gridCfg: {
                                        height: 430,
                                        width: 650,
                                        columns: [
                                            {
                                                text: resource['id'],
                                                dataIndex: '_id',
                                                itemId: '_id',
                                            },
                                            {
                                                text: resource['color'] + resource['name'],
                                                dataIndex: 'colorName',
                                                itemId: 'colorName',
                                                width: 110,
                                            },
                                            {
                                                text: resource['color'] + resource['code'] + '(16进制)',
                                                dataIndex: 'displayCode',
                                                itemId: 'displayCode',
                                                width: 150,
                                            },
                                            {
                                                text: resource['显示颜色'],
                                                itemId: 'color',
                                                dataIndex: 'color',
                                                flex: 1,
                                                minWidth: 100
                                            }
                                        ],
                                        bbar: {
                                            xtype: 'pagingtoolbar',
                                            store: colorStore,
                                            displayInfo: true,
                                            displayMsg: '',
                                            emptyMsg: resource['noData']
                                        }
                                    },
                                    allowBlank: true,
                                    diySetValue: function (data) {
                                        var me = this;
                                        if (data) {
                                            me.setValue({displayCode: '#' + data})
                                        } else {
                                            me.setValue(null);
                                        }
                                    },
                                    diyGetValue: function () {
                                        var me = this;
                                        var id = me.getRawValue();
                                        if (id) {
                                            if (id.indexOf('#') != -1) {
                                                return id.split('#')[1];
                                            } else {
                                                return id;
                                            }
                                        } else {
                                            return null;
                                        }
                                    },
                                    listeners: {
                                        change: function (gridCombo, newValue, oldValue) {
                                            var parameter = gridCombo.ownerCt.getComponent('parameter');
                                            if (newValue) {
                                                var rawValue = this.getRawValue();
                                                //特殊规定
                                                if (rawValue == '#000000') {
                                                    parameter.setValue('gray');
                                                } else {
                                                    parameter.setValue('colorFilter=' + rawValue.replace('#', ''));
                                                }
                                            } else {
                                                parameter.setValue();
                                            }
                                        }
                                    }
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: resource['parameter'],
                                    itemId: 'parameter',
                                    readOnly: true,
                                    fieldStyle: 'background-color:silver',
                                    name: 'parameter',
                                }
                            ],
                        }
                    }
                },
                {
                    xtype: 'arraydatafield',
                    fieldLabel: resource['缩放比例可选值(%)'],
                    itemId: 'zooms',
                    name: 'zooms',
                    allowChangSort: true,//是否允许拖拽移动组件
                    resultType: 'Array',//该组件获取结果和设置值的数据类型
                    diyInputComponent: {
                        xtype: 'multicombobox',
                        itemId: 'newItem',
                        name: 'newItem',
                        width: '100%',
                        margin: '0 25 0 25',
                        stripCharsRe: /([^0-9\,])/,
                        regex: /^([0-9]|[,])+$/,
                        valueField: 'value',
                        editable: true,
                        emptyText: '若选项无符合的值，可自行输入',
                        displayField: 'display',
                        multiSelect: true,
                        store: {
                            xtype: 'store',
                            fields: [
                                'value', 'display'
                            ],
                            data: [
                                {
                                    value: 25,
                                    display: 25
                                },
                                {
                                    value: 50,
                                    display: 50
                                },
                                {
                                    value: 100,
                                    display: 100
                                },
                                {
                                    value: 200,
                                    display: 200
                                },
                                {
                                    value: 400,
                                    display: 400
                                }
                            ]
                        }
                    },
                },
                {
                    xtype: 'combo',
                    fieldLabel: resource['工具栏位置'],
                    itemId: 'toolPosition',
                    name: 'toolPosition',
                    allowBlank: false,
                    displayField: 'display',
                    valueField: 'value',
                    editable: false,
                    store: {
                        xtype: 'store',
                        fields: ['value', 'display'],
                        data: [
                            {
                                value: 'Top',
                                display: resource['顶部']
                            },
                            {
                                value: 'Bottom',
                                display: resource['底部']
                            },
                            {
                                value: 'Left',
                                display: resource['左侧']
                            },
                            {
                                value: 'Right',
                                display: resource['右侧']
                            }
                        ]
                    }
                },
                {
                    xtype: 'checkbox',
                    fieldLabel: resource['显示‘撤销/恢复’按钮'],
                    itemId: 'showHistory',
                    name: 'showHistory',
                    colspan: 1,
                    checked: true,
                    width: 325
                },
                {
                    xtype: 'checkbox',
                    fieldLabel: resource['显示‘对齐方式’按钮'],
                    itemId: 'showMovement',
                    name: 'showMovement',
                    colspan: 1,
                    checked: true,
                    width: 325
                },
                {
                    xtype: 'checkbox',
                    fieldLabel: resource['显示‘调整顺序’按钮'],
                    itemId: 'showOrder',
                    name: 'showOrder',
                    colspan: 1,
                    checked: true,
                    width: 325
                },
                {
                    xtype: 'checkbox',
                    fieldLabel: resource['显示‘编辑’按钮'],
                    itemId: 'showOperation',
                    name: 'showOperation',
                    colspan: 1,
                    checked: true,
                    width: 325
                },
                {
                    xtype: 'elementeditorfield',
                    fieldLabel: resource['elementEditors'],
                    itemId: 'elementEditors',
                    name: 'elementEditors',
                    height: 200
                },
                {
                    xtype: 'multilanguagefield',
                    fieldLabel: resource['headerKey'],
                    itemId: 'headerKey',
                    name: 'headerKey',
                },
                {
                    xtype: 'multilanguagefield',
                    fieldLabel: resource['descriptionKey'],
                    itemId: 'descriptionKey',
                    name: 'descriptionKey',
                },
                {
                    xtype: 'multilanguagefield',
                    fieldLabel: resource['footerKey'],
                    itemId: 'footerKey',
                    name: 'footerKey',
                },
                {
                    xtype: 'arraydatafield',
                    fieldLabel: resource['文件类型'],
                    itemId: 'fileAccept',
                    name: 'fileAccept',
                    displayField: 'display',
                    valueField: 'value',
                    editable: true,
                    tipInfo: '支持的Mime文件类型,用于打开上传时过滤文件',
                    optionalData: [
                        {
                            value: 'image/jpeg',
                            display: 'jpe,jpeg,jpg'
                        },
                        {
                            value: 'image/bmp',
                            display: 'bmp'
                        },
                        {
                            value: 'image/png',
                            display: 'png'
                        },
                        {
                            value: 'application/pdf',
                            display: 'pdf'
                        },
                        {
                            value: 'image/svg+xml',
                            display: 'svg'
                        }
                    ]
                },
                {
                    xtype: 'regexfield',
                    fieldLabel: resource['文件名正则匹配规则'],
                    itemId: 'fileNameRegular',
                    name: 'fileNameRegular',
                },
                {
                    xtype: 'numberfield',
                    minValue: 0,
                    fieldLabel: resource['最大文件大小(MB)'],
                    itemId: 'maxFileSize',
                    name: 'maxFileSize',
                },
                {
                    xtype: 'numberfield',
                    minValue: 0,
                    fieldLabel: resource['maxColumn'],
                    itemId: 'maxColumn',
                    name: 'maxColumn',
                },
                {

                    xtype: 'templategroupidfield',
                    name: 'templateConfigGroupId',
                    itemId: 'templateConfigGroupId',
                    viewConfigId: productViewConfigId,
                    allowBlank: false,
                    fieldLabel: resource['templateConfig GroupId']
                },
                {
                    name: 'businessLib',
                    xtype: 'gridcombo',
                    fieldLabel: i18n.getKey('businessType'),
                    itemId: 'businessLib',
                    editable: false,
                    allowBlank: false,
                    valueField: '_id',
                    displayField: 'name',
                    pageSize: 25,
                    matchFieldWidth: true,
                    store: businessTypeStore,
                    gridCfg: {
                        height: 450,
                        columns: [
                            {
                                text: i18n.getKey('id'),
                                dataIndex: '_id',
                                itemId: 'id',
                            }, {
                                text: i18n.getKey('name'),
                                dataIndex: 'name',
                                width: 200,
                                itemId: 'name',
                            }, {
                                text: i18n.getKey('resources') + i18n.getKey('type'),
                                dataIndex: 'type',
                                itemId: 'type',
                                flex: 1,
                                renderer: function (value) {
                                    return value.split('.').pop();
                                }
                            }
                        ],
                        bbar: {
                            xtype: 'pagingtoolbar',
                            store: businessTypeStore,
                        }
                    },
                    diySetValue: function (data) {
                        if (data) {
                            this.setInitialValue([data._id]);
                        }
                    },
                    diyGetValue: function (data) {
                        return this.getArrayValue();
                    },
                    listeners: {
                        //改变businessType时，把数据传入initResources组件中
                        change: function (combo, newValue, oldValue) {
                            var initResources = combo.ownerCt.getComponent('initResources');
                            if (!Ext.Object.isEmpty(newValue)) {
                                initResources.resourceType = combo.getArrayValue().type;
                                initResources.setDisabled(false);
                            } else {
                                initResources.setDisabled(true);
                            }
                            if (!Ext.isEmpty(oldValue)) {
                                initResources.getStore().removeAll();
                            }
                        }
                    },
                },
                {
                    xtype: 'checkbox',
                    fieldLabel: resource['showSearch'],
                    itemId: 'showSearch',
                    name: 'showSearch',
                },
                {
                    xtype: 'gridfieldwithcrudv2',
                    fieldLabel: resource['eventConfigs'],
                    itemId: 'eventConfigs',
                    name: 'eventConfigs',
                    minHeight: 100,
                    gridConfig: {
                        store: eventConfigsStore,
                        columns: [
                            {
                                dataIndex: 'eventName',
                                width: 160,
                                text: i18n.getKey('eventName')
                            },
                            {
                                dataIndex: 'intention',
                                flex: 1,
                                text: i18n.getKey('intention'),
                                renderer: function (value) {
                                    var PcsOperationIntention = CGP.pagecontentschema.view.canvas.config.Config.PcsOperationIntention;
                                    var result = '';
                                    PcsOperationIntention.map(function (item) {
                                        if (item.value == value) {
                                            result = item.display;
                                        }
                                    });
                                    return result;
                                }
                            },
                        ],
                    },
                    winConfig: {
                        formConfig: {
                            items: [
                                {
                                    xtype: 'combo',
                                    itemId: 'eventName',
                                    fieldLabel: i18n.getKey('eventName'),
                                    name: 'eventName',
                                    valueField: 'value',
                                    displayField: 'display',
                                    editable: false,
                                    store: {
                                        xtype: 'store',
                                        fields: [
                                            'value', 'display'
                                        ],
                                        data: [
                                            {
                                                value: 'Drop',
                                                display: 'Drop'
                                            }
                                        ]
                                    }
                                },
                                {
                                    xtype: 'combo',
                                    itemId: 'intention',
                                    fieldLabel: i18n.getKey('intention'),
                                    name: 'intention',
                                    valueField: 'value',
                                    displayField: 'display',
                                    editable: false,
                                    store: {
                                        xtype: 'store',
                                        fields: [
                                            'value', 'display'
                                        ],
                                        data: CGP.pagecontentschema.view.canvas.config.Config.PcsOperationIntention
                                    }
                                }
                            ]
                        }
                    }
                },
                {
                    xtype: 'gridfieldextendcontainer',
                    name: 'initResources',
                    itemId: 'initResources',
                    fieldLabel: i18n.getKey('initResources'),
                    maxHeight: 450,
                    colspan: 2,
                    disabled: true,
                    resourceType: null,//资源类型
                    multiselect: true,
                    valueSource: 'storeProxy',
                    gridConfig: {
                        viewConfig: {
                            enableTextSelection: true
                        },
                        disabled: true,
                        selType: 'checkboxmodel',
                        multiselect: true,
                        allowBlank: true,
                        store: resourceItemStore,
                        columns: [
                            {
                                xtype: 'actioncolumn',
                                tdCls: 'vertical-middle',
                                itemId: 'actioncolumn',
                                width: 35,
                                sortable: false,
                                resizable: false,
                                menuDisabled: true,
                                items: [
                                    {
                                        iconCls: 'icon_remove icon_margin',
                                        itemId: 'actionremove',
                                        tooltip: 'Remove',
                                        handler: function (view, rowIndex, colIndex, dom, event, record) {
                                            var store = view.getStore();
                                            store.proxy.data.splice(record.index, 1);
                                            store.load();
                                        }
                                    }
                                ]
                            },
                            {
                                text: i18n.getKey('pcResource'),
                                dataIndex: 'displayDescription',
                                flex: 1,
                                renderer: function (value, mateData, record) {
                                    return JSCreateHTMLTable([
                                        {
                                            title: i18n.getKey('id'),
                                            value: record.get('_id')
                                        },
                                        {
                                            title: i18n.getKey('displayName'),
                                            value: value.displayName
                                        }
                                    ], 'left')
                                }
                            },
                            {
                                text: i18n.getKey('resources'),
                                dataIndex: 'resource',
                                xtype: 'componentcolumn',
                                flex: 1,
                                renderer: function (value, mateData, record) {
                                    var str = JSCreateHTMLTable([
                                        {
                                            title: i18n.getKey('resources') + i18n.getKey('type'),
                                            value: value.clazz.split('.').pop()
                                        },
                                        {
                                            title: i18n.getKey('resources') + i18n.getKey('id'),
                                            value: value._id
                                        }
                                    ])
                                    return {
                                        xtype: 'component',
                                        html: str,
                                    }
                                }
                            },
                            {
                                text: i18n.getKey('thumbnail'),
                                dataIndex: 'displayDescription',
                                xtype: 'componentcolumn',
                                width: 100,
                                renderer: function (value, mateData, record) {
                                    if (value.clazz == 'com.qpp.cgp.domain.pcresource.DisplayColor') {
                                        return {
                                            xtype: 'displayfield',
                                            value: ('<a class=colorpick style="background-color:' + value.colorCode + '"></a>' + value.colorCode)
                                        }
                                    } else {
                                        var imageUrl = imageServer + value.thumbnail;
                                        var imageName = value.displayName;
                                        var preViewUrl = null;
                                        if (imageUrl.indexOf('.pdf') != -1) {
                                            imageUrl += '?format=jpg';
                                        } else {
                                        }
                                        return {
                                            xtype: 'imagecomponent',
                                            src: imageUrl,
                                            autoEl: 'div',
                                            style: 'cursor: pointer',
                                            width: 50,
                                            height: 50,
                                            imgCls: 'imgAutoSize',
                                            listeners: {
                                                el: {
                                                    click: function () {
                                                        var win = Ext.create('Ext.ux.window.CheckImageWindow', {
                                                            src: imageUrl,
                                                            title: i18n.getKey('图片_') + imageName
                                                        });
                                                        win.show();
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                        ],
                        tbar: [
                            {
                                text: i18n.getKey('add'),
                                iconCls: 'icon_create',
                                handler: function (btn) {
                                    var pcResourceLibrary = Ext.create('CGP.pcresourcelibrary.store.PCResourceLibraryStore', {
                                        autoLoad: false,
                                    });
                                    var PCResourceItemStore = Ext.create('CGP.pcresourcelibrary.store.PCResourceItemStore', {
                                        autoLoad: false,
                                    });
                                    var gridField = this.ownerCt.ownerCt.gridField;
                                    var resourceType = gridField.resourceType;
                                    var win = Ext.create('Ext.window.Window', {
                                        modal: true,
                                        constrain: true,
                                        title: i18n.getKey('select') + i18n.getKey('resources'),
                                        layout: 'fit',
                                        items: [
                                            {
                                                xtype: 'errorstrickform',
                                                defaults: {
                                                    margin: '5 25 10 25'
                                                },
                                                items: [
                                                    {
                                                        xtype: 'gridcombo',
                                                        fieldLabel: i18n.getKey('pcResourceLibrary'),
                                                        itemId: 'pcResourceLibrary',
                                                        name: 'pcResourceLibrary',
                                                        valueField: '_id',
                                                        displayField: 'name',
                                                        store: pcResourceLibrary,
                                                        editable: false,
                                                        allowBlank: false,
                                                        matchFieldWidth: false,
                                                        filterCfg: {
                                                            hidden: true,
                                                            minHeight: 60,
                                                            layout: {
                                                                type: 'column',
                                                                columns: 2
                                                            },
                                                            items: [
                                                                {
                                                                    xtype: 'textfield',
                                                                    isLike: true,
                                                                    hidden: true,
                                                                    name: 'type',
                                                                    value: resourceType,
                                                                    itemId: 'type',
                                                                }
                                                            ]
                                                        },
                                                        gridCfg: {
                                                            height: 350,
                                                            width: 650,
                                                            columns: [
                                                                {
                                                                    text: i18n.getKey('id'),
                                                                    dataIndex: '_id'
                                                                }, {
                                                                    text: i18n.getKey('name'),
                                                                    dataIndex: 'name',
                                                                    width: 200,
                                                                },
                                                                {
                                                                    text: i18n.getKey('description'),
                                                                    dataIndex: 'description',
                                                                    width: 200,
                                                                },
                                                                {
                                                                    text: i18n.getKey('resources') + i18n.getKey('type'),
                                                                    dataIndex: 'type',
                                                                    flex: 1,
                                                                    renderer: function (value) {
                                                                        var type = value.split('.').pop();
                                                                        return type;
                                                                    }
                                                                },
                                                            ],
                                                            bbar: {
                                                                xtype: 'pagingtoolbar',
                                                                store: pcResourceLibrary,
                                                            }
                                                        },
                                                        listeners: {
                                                            //改变businessType时，把数据传入initResources组件中
                                                            change: function (combo, newValue, oldValue) {
                                                                var pcResource = combo.ownerCt.getComponent('pcResource');
                                                                if (!Ext.Object.isEmpty(newValue)) {
                                                                    pcResource.setDisabled(false);
                                                                    pcResource.setSubmitValue();
                                                                    pcResource.store.proxy.extraParams = {
                                                                        filter: Ext.JSON.encode([{
                                                                            name: 'library._id',
                                                                            type: 'string',
                                                                            value: combo.getArrayValue()._id
                                                                        }])
                                                                    }
                                                                } else {
                                                                    pcResource.setDisabled(true);
                                                                }
                                                            }
                                                        }
                                                    },
                                                    {
                                                        xtype: 'gridcombo',
                                                        fieldLabel: i18n.getKey('pcResource'),
                                                        itemId: 'pcResource',
                                                        name: 'pcResource',
                                                        valueField: '_id',
                                                        displayField: '_id',
                                                        matchFieldWidth: false,
                                                        store: PCResourceItemStore,
                                                        editable: false,
                                                        allowBlank: false,
                                                        disabled: true,
                                                        multiSelect: true,
                                                        filterCfg: {
                                                            hidden: true,
                                                            minHeight: 60,
                                                            layout: {
                                                                type: 'column',
                                                                columns: 2
                                                            },
                                                            items: []
                                                        },
                                                        gridCfg: {
                                                            height: 350,
                                                            width: 650,
                                                            multiselect: true,
                                                            selType: 'checkboxmodel',
                                                            columns: [
                                                                {
                                                                    text: i18n.getKey('id'),
                                                                    dataIndex: '_id',
                                                                    itemId: 'id',
                                                                },
                                                                {
                                                                    text: i18n.getKey('pcResource'),
                                                                    dataIndex: 'displayDescription',
                                                                    itemId: 'displayName',
                                                                    flex: 1,
                                                                    renderer: function (value, mateData, record) {
                                                                        return value.displayName;
                                                                    }
                                                                },
                                                                {
                                                                    text: i18n.getKey('resources'),
                                                                    dataIndex: 'resource',
                                                                    itemId: 'resource',
                                                                    xtype: 'componentcolumn',
                                                                    flex: 1,
                                                                    renderer: function (value, mateData, record) {
                                                                        var str = JSCreateHTMLTable([
                                                                            {
                                                                                title: i18n.getKey('resources') + i18n.getKey('type'),
                                                                                value: value.clazz.split('.').pop()
                                                                            },
                                                                            {
                                                                                title: i18n.getKey('resources') + i18n.getKey('id'),
                                                                                value: +value._id
                                                                            }
                                                                        ])
                                                                        return {
                                                                            xtype: 'component',
                                                                            html: str,
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    text: i18n.getKey('thumbnail'),
                                                                    dataIndex: 'displayDescription',
                                                                    itemId: 'displayDescription',
                                                                    xtype: 'componentcolumn',
                                                                    width: 100,
                                                                    renderer: function (value, mateData, record) {
                                                                        if (value.clazz == 'com.qpp.cgp.domain.pcresource.DisplayColor') {
                                                                            return {
                                                                                xtype: 'displayfield',
                                                                                value: ('<a class=colorpick style="background-color:' + value.colorCode + '"></a>' + value.colorCode)
                                                                            }
                                                                        } else {
                                                                            var imageUrl = imageServer + value.thumbnail;
                                                                            var imageName = value.displayName;
                                                                            var preViewUrl = null;
                                                                            if (imageUrl.indexOf('.pdf') != -1) {
                                                                                imageUrl += '?format=jpg';
                                                                            } else {
                                                                            }
                                                                            return {
                                                                                xtype: 'imagecomponent',
                                                                                src: imageUrl,
                                                                                autoEl: 'div',
                                                                                style: 'cursor: pointer',
                                                                                width: 50,
                                                                                height: 50,
                                                                                imgCls: 'imgAutoSize',
                                                                                listeners: {
                                                                                    el: {
                                                                                        click: function () {
                                                                                            var win = Ext.create('Ext.ux.window.CheckImageWindow', {
                                                                                                src: imageUrl,
                                                                                                title: i18n.getKey('图片_') + imageName
                                                                                            });
                                                                                            win.show();
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                },
                                                            ],
                                                            bbar: {
                                                                xtype: 'pagingtoolbar',
                                                                store: PCResourceItemStore,
                                                            }
                                                        }
                                                    }
                                                ]
                                            },

                                        ],
                                        bbar: {
                                            xtype: 'bottomtoolbar',
                                            saveBtnCfg: {
                                                handler: function (btn) {
                                                    var win = btn.ownerCt.ownerCt;
                                                    var form = win.items.items[0];
                                                    if (form.isValid()) {
                                                        var data = form.getValue();
                                                        var store = gridField.getStore();
                                                        for (var i = 0; i < data.pcResource.length; i++) {
                                                            var id = data.pcResource[i]._id;
                                                            var record = store.getById(id);
                                                            if (Ext.isEmpty(record)) {
                                                                store.proxy.data.push(data.pcResource[i]);
                                                            }
                                                        }
                                                        store.load();
                                                        win.close();
                                                        console.log(data);
                                                    }
                                                }
                                            }
                                        }
                                    });
                                    win.show();
                                }
                            }, {
                                text: i18n.getKey('delete'),
                                iconCls: 'icon_delete',
                                handler: function (btn) {
                                    var gridField = this.ownerCt.ownerCt.gridField;
                                    var selection = gridField._grid.getSelectionModel().getSelection();
                                    for (var i = 0; i < selection.length; i++) {
                                        gridField._grid.store.proxy.data[selection[i].index] = null;
                                    }
                                    gridField._grid.store.proxy.data = gridField._grid.store.proxy.data.filter(function (item) {
                                        if (item) {
                                            return item;
                                        }
                                    });
                                    gridField._grid.store.load();
                                }
                            }
                        ],
                        bbar: {
                            xtype: 'pagingtoolbar',
                            store: resourceItemStore,
                            displayInfo: true,
                            displayMsg: 'Displaying {0} - {1} of {2}',
                        }
                    }

                },
                {
                    xtype: 'numberfield',
                    fieldLabel: resource['defaultFontSize'],
                    itemId: 'defaultFontSize',
                    name: 'defaultFontSize',
                }
            ];
            var usingComponentItems = [];
            var componentArr = [];
            usingComponentItems = usingComponentItems.concat(me.componentInfo['common']);
            usingComponentItems = usingComponentItems.concat(me.componentInfo[clazz]);
            for (var i = 0; i < optionalComponents.length; i++) {
                if (Ext.Array.contains(usingComponentItems, optionalComponents[i]['itemId'])) {
                    componentArr.push(optionalComponents[i]);
                }
            }
            return componentArr;
        },
        refreshData: function (data) {
            var me = this;
            me.suspendLayouts();
            me.removeAll();
            var items = me.buildItemArr(data.clazz);
            me.add(items);
            me.resumeLayouts();
            me.doLayout();
            setTimeout(function () {
                me.setValue(data);
            }, 100)
        }
    }
)
