Ext.Loader.syncRequire([]);
Ext.define('CGP.product.view.productconfig.productviewconfig.view.navigationV2.view.InfoTab', {
    extend: 'Ext.form.Panel',
    treePanel: null,
    record: null,
    treeNode: null,//树中的节点
    createOrEdit: 'create',
    controller: Ext.create('CGP.product.view.productconfig.productviewconfig.view.navigationV2.controller.Controller'),
    //title: false,
    //header: false,
    mask: null,
    bodyPadding: 20,
    fieldDefaults: {
        width: 450,
        margin: '5 25 5 25'
    },
    itemId: 'infoForm',
    listeners: {},
    navigationId: null,
    region: 'center',
    initComponent: function () {
        var me = this;
        me.items = [];

        var navigationStore = Ext.create('CGP.product.view.productconfig.productviewconfig.view.navigationV2.store.NavigationStore', {
            navigationId: me.navigationId,
            root: {
                id: 0,
                name: 'root'
            },
            listeners: {
                load: function (store, node, records) {
                    Ext.Array.each(records, function (item) {
                        var type = item.get('clazz');
                        if (type.split('.').pop() == 'FixedNavItemDto' || type.split('.').pop() == 'DynamicNavItemDTO') {
                            item.set('icon', path + 'ClientLibs/extjs/resources/themes/images/ux/node.png');
                        } else {
                            item.set('icon', path + 'ClientLibs/extjs/resources/themes/images/ux/category.png');
                        }
                    });
                }
            }
        });
        me.navigationStore = navigationStore;
        me.tbar = [{
            xtype: 'button',
            text: i18n.getKey('save'),
            iconCls: 'icon_save',
            disabled: true,
            itemId: 'btnSave',
            handler: function () {
                //me.controller.updateNode();
                var data = me.getValue();

                data.id = me.data.id;
                console.log(data);
                var treeStore = me.tree.getStore();
                //var parentNode = me.record.parentNode;
                me.controller.updateNode(me.record, me, treeStore, JSGetQueryString('navigationId'), me.data.id, data);
            }
        }];
        me.callParent(arguments);
    },

    refreshData: function (data, record, tree) {
        var me = this;
        var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
        var isLock = builderConfigTab.isLock;
        me.down('toolbar').getComponent('btnSave').setDisabled(false || isLock);
        var type = data.type;
        me.record = record;
        me.tree = tree;
        me.data = data;
        me.removeAll();
        if (!me.componentInit)
            me.addItem(data, record, tree);
        //me.setTitle(i18n.getKey('material') + ':' + data.name);
        me.setValue(data);
    },
    addItem: function (data, record, tree) {
        var me = this;
        /*var saveButton = me.child("toolbar").getComponent("btnSave");
         saveButton.setDisabled(false);*/
        var contextTemplate = {
            setExpressionValueWindowConfig: {
                validExpressionContainerConfig: {
                    showJsonDataWindowConfig: {
                        treePanelConfig: {
                            columns: {
                                items: [
                                    {
                                        xtype: 'treecolumn',
                                        text: 'key',
                                        flex: 1,
                                        dataIndex: 'text',
                                        sortable: true
                                    },
                                    {
                                        text: 'value',
                                        flex: 1,
                                        dataIndex: 'value',
                                        sortable: true
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            uxTextareaContextData: {
                context: {
                    'index': '可变尺寸导航项的位置',
                    '产品属性Id(A)': '属性值',
                    '产品属性Id(B)': '属性值',
                    "产品属性Id(C)": {
                        'length': '属性值',
                        'width': '属性值'
                    },
                    "产品属性Id(D)": [
                        '属性值1', '属性值2'
                    ]
                }
            }
        };
        var description = {
            xtype: 'textarea',
            fieldLabel: i18n.getKey('description'),
            name: 'description',
            itemId: 'description'
        };
        var clazz = {
            xtype: 'textfield',
            hidden: true,
            name: 'clazz',
            itemId: 'clazz'
        };
        var verifyType = {
            xtype: 'combo',
            name: 'verifyType',
            queryMode: 'local',
            displayField: 'name',
            editable: false,
            fieldLabel: i18n.getKey('verify') + i18n.getKey('type'),
            valueField: 'value',
            value: 'None',
            store: Ext.create('Ext.data.Store', {
                fields: ['name', 'value'],
                data: [{name: 'None', value: 'None'},
                    {name: 'SBOMNode', value: 'SBOMNode'},
                    {name: 'SimplifyMaterialView', value: 'SimplifyMaterialView'},
                    {name: 'PageContent', value: 'PageContent'},
                    {
                        name: 'PageContentItemPlaceholderObject', value: 'PageContentItemPlaceholderObject'
                    }]
            })

        };
        var sortOrder = {
            xtype: 'numberfield',
            fieldLabel: i18n.getKey('sortOrder'),
            name: 'sortOrder',
            itemId: 'sortOrder',
            minValue: 0
        };
        var displayName = {
            xtype: 'combo',
            fieldLabel: i18n.getKey('displayName'),
            name: 'displayName',
            itemId: 'displayName',
            valueField: 'value',
            displayField: 'display',
            editable: true,
            tipInfo: '<table style=&quot;width: 300px;margin-bottom: 5px&quot; border=&quot;1&quot;>' +
                '<tr><th>key</th><th>value</th></tr>' +
                '<tr><td>STEP_NAME_ONE</td><td>Customize</td></tr>' +
                '<tr><td>STEP_NAME_ONE_PDF</td><td>PDF Upload</td></tr>' +
                '<tr><td>STEP_NAME_TOP</td><td>top</td></tr>' +
                '<tr><td>STEP_NAME_FRONT</td><td>front</td></tr>' +
                '<tr><td>STEP_NAME_RIGHT</td><td>right</td></tr>' +
                '<tr><td>STEP_NAME_BACK</td><td>back</td></tr>' +
                '<tr><td>STEP_NAME_LEFT</td><td>left</td></tr>' +
                '<tr><td>STEP_NAME_BOTTOM</td><td>bottom</td></tr>' +
                '<tr><td>STEP_NAME_COVER</td><td>cover</td></tr>' +
                '<tr><td>STEP_NAME_LINER</td><td>liner</td></tr>' +
                '<tr><td>STEP_NAME_PREVIEW</td><td>preview</td></tr></table>',
            store: Ext.create('Ext.data.Store', {
                fields: ['value', 'display'],
                data: [
                    {
                        value: 'STEP_NAME_ONE',
                        display: 'STEP_NAME_ONE'
                    },
                    {
                        value: 'STEP_NAME_ONE_PDF',
                        display: 'STEP_NAME_ONE_PDF'
                    }, {
                        value: 'STEP_NAME_TOP',
                        display: 'STEP_NAME_TOP'
                    }, {
                        value: 'STEP_NAME_FRONT',
                        display: 'STEP_NAME_FRONT'
                    }, {
                        value: 'STEP_NAME_RIGHT',
                        display: 'STEP_NAME_RIGHT'
                    },
                    {
                        value: 'STEP_NAME_BACK',
                        display: 'STEP_NAME_BACK'
                    },
                    {
                        value: 'STEP_NAME_LEFT',
                        display: 'STEP_NAME_LEFT'
                    },
                    {
                        value: 'STEP_NAME_BOTTOM',
                        display: 'STEP_NAME_BOTTOM'
                    },
                    {
                        value: 'STEP_NAME_COVER',
                        display: 'STEP_NAME_COVER'
                    },
                    {
                        value: 'STEP_NAME_LINER',
                        display: 'STEP_NAME_LINER'
                    },
                    {
                        value: 'STEP_NAME_PREVIEW',
                        display: 'STEP_NAME_PREVIEW'
                    },
                ]
            })
        };
        var displayTitle = {
            xtype: 'combo',
            fieldLabel: i18n.getKey('displayTitle'),
            name: 'displayTitle',
            itemId: 'displayTitle',
            valueField: 'value',
            displayField: 'display',
            editable: true,
            store: Ext.create('Ext.data.Store', {
                    fields: ['value', 'display'],
                    data: [
                        {
                            value: 'STEP_NAME_ONE_TITLE',
                            display: 'STEP_NAME_ONE_TITLE'
                        }
                    ]
                }
            )
        };
        var displayTitleExpression = Ext.Object.merge({
            xtype: 'expressionfield',
            tipInfo: i18n.getKey('displayTitle'),
            width: 450,
            name: 'displayTitleExpression',
            autoFitErrors: true,
            itemId: 'displayTitleExpression',
            combineErrors: true,
            fieldLabel: i18n.getKey('displayTitle')
        }, contextTemplate);
        var navItemQuantityExpression = Ext.Object.merge({
            xtype: 'expressionfield',
            tipInfo: i18n.getKey('navItemQuantity'),
            width: 450,
            name: 'navItemQuantityExpression',
            autoFitErrors: true,
            itemId: 'navItemQuantityExpression',
            combineErrors: true,
            fieldLabel: i18n.getKey('navItemQuantity'),
            defaultResultType: 'Number',
            defaultClazz: null,
        }, contextTemplate);
        var navItemIndexExpression = Ext.Object.merge({
            xtype: 'expressionfield',
            tipInfo: i18n.getKey('sortOrder'),
            width: 450,
            name: 'navItemIndexExpression',
            autoFitErrors: true,
            itemId: 'navItemIndexExpression',
            combineErrors: true,
            fieldLabel: i18n.getKey('sortOrder'),
        }, contextTemplate);
        var displayNameExpression = Ext.Object.merge({
            xtype: 'expressionfield',
            tipInfo: i18n.getKey('displayName'),
            width: 450,
            name: 'displayNameExpression',
            autoFitErrors: true,
            itemId: 'displayNameExpression',
            combineErrors: true,
            fieldLabel: i18n.getKey('displayName')
        }, contextTemplate);
        var previewItem = {
            name: 'previewItem',
            xtype: 'uxtreecombo',
            hideTopBar: true,
            fieldLabel: i18n.getKey('previewItem'),
            store: me.navigationStore,
            forceSelection: false,
            displayField: 'id',
            valueField: 'id',
            haveReset: true,
            multiselect: false,
            editable: false,
            rootVisible: false,
            matchFieldWidth: false,
            data: null,//一个记录数据的字段
            defaultColumnConfig: {
                renderer: function (value, metadata, record) {
                    var name = !Ext.isEmpty(record.get("description")) ? record.get("description") : record.get("displayName");
                    return name + '<' + record.get('id') + '>' + '[' + record.get('clazz').split('.').pop() + ']';
                }
            },
            diyGetValue: function () {
                var me = this;
                var value = me.getValue();
                if (value) {
                    return {
                        clazz: 'com.qpp.cgp.domain.product.config.view.navigation.config.ReferenceNavItem',
                        referenceId: value,
                        id: me.data ? me.data.id : JSGetCommonKey(false)
                    }
                } else {
                    return null;
                }
            },
            diySetValue: function (data) {
                var me = this;
                me.data = data;
                if (data) {
                    me.setValue(data.referenceId + '');
                }
            },
            listeners: {
                afterrender: function (treeCombo) {
                    treeCombo.tree.expandAll();
                }
            },
            treePanelConfig: {
                width: 450,
                listeners: {
                    beforeselect: function (selectModel, record) {
                        var infoTab = this.ownerTreeCombo.ownerCt;
                        var recordId = infoTab.data ? infoTab.data.id : '';
                        //不能选择自己这个节点且非FixedNavItemConfig和DynamicNavItemConfig
                        if ((record.get('clazz') == 'com.qpp.cgp.domain.product.config.view.navigation.dto.DynamicNavItemDto' ||
                            record.get('clazz') == 'com.qpp.cgp.domain.product.config.view.navigation.dto.FixedNavItemDto') &&
                            record.getId() != recordId
                        ) {
                            return true;
                        } else {
                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('不允许选择当前节点和非NavItemDto节点'));
                            return false;
                        }
                    }
                },
                tbar: [
                    {
                        xtype: 'button',
                        text: i18n.getKey('expandAll'),
                        iconCls: 'icon_expandAll',
                        count: 0,
                        handler: function (btn) {
                            var treepanel = btn.ownerCt.ownerCt;
                            if (btn.count % 2 == 0) {
                                treepanel.expandAll();
                                btn.setText(i18n.getKey('collapseAll'));
                                btn.setIconCls('icon_collapseAll');

                            } else {
                                treepanel.collapseAll();
                                btn.setText(i18n.getKey('expandAll'));
                                btn.setIconCls('icon_expandAll');
                            }
                            btn.count++;
                        }
                    },
                    {
                        xtype: 'button',
                        text: i18n.getKey('refresh'),
                        iconCls: 'icon_refresh',
                        handler: function (btn) {
                            var tree = btn.ownerCt.ownerCt;
                            tree.store.load();
                        }
                    }
                ],
            }
        };
        var targetSelector2 = {
            name: 'targetSelector',
            xtype: 'uxfieldset',
            readOnly: true,
            //labelAlign: 'left',
            width: 450,
            margin: '5 25 5 25',
            title: i18n.getKey('targetSelector'),
            itemId: 'targetSelector',
            legendItemConfig: {
                disabledBtn: {
                    hidden: false,
                    disabled: false,
                    isUsable: false,
                }
            },
            defaults: {
                labelWidth: 60,
                width: '100%'
            },
            items: [
                {
                    xtype: 'combo',
                    name: 'clazz',
                    itemId: 'clazz',
                    fieldLabel: i18n.getKey('type'),
                    queryMode: 'local',
                    editable: false,
                    value: 'com.qpp.cgp.domain.product.config.view.navigation.config.IdTargetSelector',
                    displayField: 'name',
                    valueField: 'value',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['name', 'value'],
                        data: [
                            {
                                name: 'IdTargetSelector',
                                value: 'com.qpp.cgp.domain.product.config.view.navigation.config.IdTargetSelector'
                            },
                            {
                                name: 'JsonPathTargetSelector',
                                value: 'com.qpp.cgp.domain.product.config.view.navigation.config.JsonPathTargetSelector'
                            },
                            {
                                name: 'ExpressionTargetSelector',
                                value: 'com.qpp.cgp.domain.product.config.view.navigation.config.ExpressionTargetSelector'
                            }]
                    }),
                    mapping: {
                        'common': ['clazz'],
                        'com.qpp.cgp.domain.product.config.view.navigation.config.IdTargetSelector': ['targetContainer'],
                        'com.qpp.cgp.domain.product.config.view.navigation.config.JsonPathTargetSelector': ['selector'],
                        'com.qpp.cgp.domain.product.config.view.navigation.config.ExpressionTargetSelector': ['expression']
                    },
                    listeners: {
                        change: function (comp, newValue, oldValue) {
                            var fieldContainer = comp.ownerCt;
                            for (var i = 0; i < fieldContainer.items.items.length; i++) {
                                var item = fieldContainer.items.items[i];
                                if (Ext.Array.contains(comp.mapping['common'], item.itemId)) {
                                    continue;
                                } else if (Ext.Array.contains(comp.mapping[newValue], item.itemId)) {
                                    item.show();
                                    item.setDisabled(false);
                                } else {
                                    item.hide();
                                    item.setDisabled(true);
                                }
                            }
                        }
                    }
                },
                {
                    xtype: 'fieldcontainer',
                    name: 'selector',
                    defaults: {},
                    itemId: 'selector',
                    allowBlank: true,
                    hidden: true,
                    disabled: true,
                    fieldLabel: i18n.getKey('jsonPath'),
                    layout: {
                        type: 'hbox',
                        align: 'center',
                        pack: 'center'
                    },
                    items: [
                        {
                            xtype: 'textarea',
                            flex: 1,
                            name: 'selector',
                            itemId: 'selector',
                            margin: '0 5 0 0',
                            readOnly: false,
                        },
                        {
                            xtype: 'button',
                            text: i18n.getKey('choice'),
                            width: 50,
                            handler: function (btn) {
                                var component = btn.ownerCt;
                                me.controller.getSimplifyBom(me.productViewConfigId, component, 'jsonPathSelector');
                            }
                        }
                    ],
                    getName: function () {
                        return this.name;
                    },
                    setValue: function (data) {
                        var me = this;
                        me.getComponent('selector').setValue(data);
                    },
                    getValue: function () {
                        var me = this;
                        var selector = me.getComponent('selector').getValue(data);
                        return selector;
                    }
                },
                {
                    xtype: 'fieldcontainer',
                    name: 'targetId',
                    layout: {
                        type: 'hbox',
                        align: 'center',
                        pack: 'center'
                    },
                    defaults: {},
                    itemId: 'targetContainer',
                    allowBlank: true,
                    fieldLabel: i18n.getKey('targetId'),
                    items: [
                        {
                            xtype: 'numberfield',
                            flex: 1,
                            name: 'targetId',
                            hideLabel: true,
                            itemId: 'targetId',
                            id: 'targetId',
                            margin: '0 5 0 0',
                            readOnly: false,
                            allowBlank: true,
                            fieldLabel: i18n.getKey('targetId')
                        },
                        {
                            xtype: 'button',
                            text: i18n.getKey('choice'),
                            width: 50,
                            hidden: me.hideChangeMaterialPath,
                            handler: function () {
                                var targetId = Ext.getCmp('targetId').getValue();
                                var component = Ext.getCmp('targetId');
                                me.controller.getSimplifyBom(me.productViewConfigId, component, 'idSelector');
                            }
                        }
                    ],
                    getName: function () {
                        return this.name;
                    },
                    setValue: function (data) {
                        var me = this;
                        me.getComponent('targetId').setValue(data);
                    },
                    getValue: function () {
                        var me = this;
                        var targetId = me.getComponent('targetId').getValue(data);
                        return targetId;
                    }
                },
                Ext.Object.merge({
                    xtype: 'expressionfield',
                    name: 'expression',
                    itemId: 'expression',
                    hidden: true,
                    autoScroll: true,
                    allowBlank: true,
                    fieldLabel: i18n.getKey('expression'),

                }, contextTemplate)
            ]
        };
        var isOrderly = {
            xtype: 'checkbox',
            name: 'isOrderly',
            itemId: 'isOrderly',
            fieldLabel: i18n.getKey('isOrderly')
        };
        var useHistory = {
            xtype: 'checkbox',
            name: 'useHistory',
            itemId: 'useHistory',
            fieldLabel: i18n.getKey('useHistory')
        };
        var showWhenPreview = {
            xtype: 'combo',
            name: 'showWhenPreview',
            fieldLabel: i18n.getKey('showWhen Preview'),
            itemId: 'showWhenPreview',
            valueField: 'value',
            displayField: 'display',
            allowBlank: true,
            editable: false,
            haveReset: true,
            store: Ext.create('Ext.data.Store', {
                fields: ['value', 'display'],
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
            })
        }

        var resultItems = [];
        if (data.clazz == 'com.qpp.cgp.domain.product.config.view.navigation.dto.FixedNavItemDto') {
            resultItems = [clazz, verifyType, sortOrder, displayName, displayTitle, targetSelector2, previewItem, showWhenPreview];
        } else if (data.clazz == 'com.qpp.cgp.domain.product.config.view.navigation.dto.FixedNavBarDto') {
            resultItems = [clazz, isOrderly, useHistory, description];
        } else if (data.clazz == 'com.qpp.cgp.domain.product.config.view.navigation.dto.DynamicNavBarDto') {
            resultItems = [clazz, isOrderly, useHistory, description, navItemQuantityExpression];
        } else if (data.clazz == 'com.qpp.cgp.domain.product.config.view.navigation.dto.DynamicNavItemDto') {
            resultItems = [clazz, verifyType, previewItem, targetSelector2, navItemIndexExpression, displayNameExpression, displayTitleExpression, showWhenPreview];
        }
        me.add(resultItems);
        me.componentInit = false;

    },
    setValue: function (data) {
        var me = this;
        var items = me.items.items;
        me.parentNode = data.parent;
        me.dataId = data.id;
        Ext.Array.each(items, function (item) {
            if (!Ext.isEmpty(data[item.name])) {
                if (item.diySetValue) {
                    item.diySetValue(data[item.name]);
                } else {
                    item.setValue(data[item.name]);
                }
            }
        })
    },
    getValue: function () {
        var me = this;
        var data = {};
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            if (item.diyGetValue) {
                data[item.name] = item.diyGetValue();
            } else {
                data[item.name] = item.getValue();
            }
        });
        if (!Ext.isEmpty(me.parentNode)) {
            data.parent = me.parentNode;
        }
        data.id = me.dataId;
        return data;
    }
});
