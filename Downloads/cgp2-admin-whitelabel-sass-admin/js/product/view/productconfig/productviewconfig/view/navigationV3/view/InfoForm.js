Ext.Loader.syncRequire([
    'CGP.common.field.MultiLanguageField',
    'CGP.product.view.productconfig.productviewconfig.view.navigationV3.view.QTYRuleGrid'
]);
Ext.define('CGP.product.view.productconfig.productviewconfig.view.navigationV3.view.InfoForm', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    treePanel: null,
    record: null,
    treeNode: null,//树中的节点
    createOrEdit: 'create',
    isValidForItems: true,
    controller: Ext.create('CGP.product.view.productconfig.productviewconfig.view.navigationV3.controller.Controller'),
    //title: false,
    //header: false,
    mask: null,
    bodyPadding: 20,
    defaults: {
        width: 450,
        /*
                margin: '5 25 5 25'
        */
    },
    itemId: 'infoForm',
    listeners: {},
    navigationId: null,
    region: 'center',
    initComponent: function () {
        var me = this;
        me.items = [];
        var navigationStore = Ext.create('CGP.product.view.productconfig.productviewconfig.view.navigationV3.store.NavigationStore', {
            navigationId: me.navigationId,
            root: {
                id: 0,
                name: 'root'
            },
            listeners: {
                load: function (store, node, records) {
                    Ext.Array.each(records, function (item) {
                        var type = item.get('clazz');
                        var typeSubStr = type.split('.').pop();
                        if (type.split('.').pop() == 'FixedNavItemDto' || type.split('.').pop() == 'DynamicNavItemDTO' || typeSubStr == 'CalendarNavItemDTO') {
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
                if (me.isValid()) {
                    var data = me.getValue();
                    data.id = me.data.id;
                    console.log(data);
                    var treeStore = me.tree.getStore();
                    //var parentNode = me.record.parentNode;
                    me.controller.updateNode(me.record, me, treeStore, JSGetQueryString('navigationId'), me.data.id, data);
                }
            }
        }];
        me.callParent(arguments);
    },
    refreshData: function (data, record, tree) {
        var me = this;
        var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
        var isLock = false;//builderConfigTab.isLock;
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
        var index = {
            xtype: 'numberfield',
            fieldLabel: i18n.getKey('index'),
            name: 'index',
            itemId: 'index',
            minValue: 0
        };
        var displayNameKey = {
            xtype: 'multilanguagefield',
            fieldLabel: i18n.getKey('displayNameKey'),
            name: 'displayNameKey',
            itemId: 'displayNameKey',
        };
        var displayNameKeysExpression = Ext.Object.merge({
            xtype: 'expressionfield',
            tipInfo: i18n.getKey('获取导航key值'),
            width: 450,
            name: 'displayNameKeysExpression',
            autoFitErrors: true,
            itemId: 'displayNameKeysExpression',
            combineErrors: true,
            fieldLabel: i18n.getKey('displayNameKeysExpression'),
            defaultResultType: 'String',
            value: {
                clazz: "com.qpp.cgp.expression.Expression",
                expression: "function expression(args) {\n            var index = args.context['index'];\n  " +
                    "          var qty = args.context['qty'];\n " +
                    "           var keys = [\"FRONT\", \"INSIDE_FRONT_PAGE\", \"PAGES\", \"PAGE_INSIDE_BACK\", \"BACK\"];\n  " +
                    "          switch (true) {\n                case index == 0:\n                    return keys[index];\n    " +
                    "            case index == qty - 1:\n                    return keys[keys.length - 1];\n           " +
                    "   case index == 1:\n                    return keys[index];\n             " +
                    "   case index == 2 && qty >= 3:\n                    return keys[index - 1];\n       " +
                    "   case index > 2 && index <= qty - 3:\n                    return keys[2];\n    " +
                    "            case index == qty - 2:\n                    return keys[keys.length - 2];\n            }\n        }",
                expressionEngine: "JavaScript",
                resultType: "String",
            }

        }, contextTemplate);
        var navItemIndexExpression = Ext.Object.merge({
            xtype: 'expressionfield',
            tipInfo: i18n.getKey('获取导航序号'),
            width: 450,
            name: 'navItemIndexExpression',
            autoFitErrors: true,
            itemId: 'navItemIndexExpression',
            combineErrors: true,
            isFormField: true,
            allowBlank: false,
            fieldLabel: i18n.getKey('index'),
            defaultResultType: 'Number',//expression中的结果类型
            value: {
                clazz: "com.qpp.cgp.expression.Expression",
                expression: "function expression(args) {\n            return args.context['index'];\n        }",
                expressionEngine: "JavaScript",
                resultType: "Number",
            }
            /*      expressionConfig: {//表达式编写组件配置
                      value: 'function expression(args) {\n' +
                          '            return args.context[\'index\'];\n' +
                          '        }'
                  },*/

        }, contextTemplate);
        var displayNameExpression = Ext.Object.merge({
            xtype: 'expressionfield',
            tipInfo: i18n.getKey('displayName'),
            width: 450,
            name: 'displayNameExpression',
            autoFitErrors: true,
            itemId: 'displayNameExpression',
            combineErrors: true,
            fieldLabel: i18n.getKey('获取导航Value值'),
            defaultResultType: 'String',
            value: {
                clazz: "com.qpp.cgp.expression.Expression",
                expression: "function expression(args) {\n            var value = args.context['value'];\n" +
                    "            var index = args.context['index'];\n            index = (index - 1) * 2;\n     " +
                    "       value = value.replace(/\\$\\{p1\\}/, index);\n     " +
                    "       value = value.replace(/\\$\\{p2\\}/, index + 1);\n            return value;\n        }",
                expressionEngine: "JavaScript",
                resultType: "String",
            }
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
                    var name = !Ext.isEmpty(record.get("description")) ? record.get("description") : record.get("displayNameKey");
                    return name + '<' + record.get('id') + '>' + '[' + record.get('clazz').split('.').pop() + ']';
                }
            },
            diyGetValue: function () {
                var me = this;
                var value = me.getValue();
                if (value) {
                    return {
                        clazz: 'com.qpp.cgp.domain.product.config.view.navigation.config.v3.ReferenceNavItem',
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
                        if ((record.get('clazz') == 'com.qpp.cgp.domain.product.config.view.navigation.dto.v3.DynamicNavItemDTO' ||
                                record.get('clazz') == 'com.qpp.cgp.domain.product.config.view.navigation.dto.v3.FixedNavItemDTO') &&
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
                margin: '5 25 5 0',
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
                        value: 'com.qpp.cgp.domain.product.config.view.navigation.config.v3.IdTargetSelector',
                        displayField: 'name',
                        valueField: 'value',
                        store: Ext.create('Ext.data.Store', {
                            fields: ['name', 'value'],
                            data: [
                                {
                                    name: 'IdTargetSelector',
                                    value: 'com.qpp.cgp.domain.product.config.view.navigation.config.v3.IdTargetSelector'
                                },
                                {
                                    name: 'JsonPathTargetSelector',
                                    value: 'com.qpp.cgp.domain.product.config.view.navigation.config.v3.JsonPathTargetSelector'
                                },
                                {
                                    name: 'ExpressionTargetSelector',
                                    value: 'com.qpp.cgp.domain.product.config.view.navigation.config.v3.ExpressionTargetSelector'
                                }]
                        }),
                        mapping: {
                            'common': ['clazz'],
                            'com.qpp.cgp.domain.product.config.view.navigation.config.v3.IdTargetSelector': ['targetContainer'],
                            'com.qpp.cgp.domain.product.config.view.navigation.config.v3.JsonPathTargetSelector': ['selector'],
                            'com.qpp.cgp.domain.product.config.view.navigation.config.v3.ExpressionTargetSelector': ['expression']
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
                                allowBlank: false,
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
                        isValid: function () {
                            return this.getComponent('selector').isValid();
                        },
                        getErrors: function () {
                            return '不允许为空';
                        },
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
                                allowBlank: false,
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
                        getErrors: function () {
                            return '不允许为空';
                        },
                        isValid: function () {
                            return this.getComponent('targetId').isValid();
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
                        disabled: true,
                        autoScroll: true,
                        allowBlank: false,
                        fieldLabel: i18n.getKey('expression'),

                    }, contextTemplate)
                ]
            }
        ;
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
        };
        var imagePath = {
            xtype: 'fileuploadv2',
            width: 450,
            fieldLabel: i18n.getKey('image') + i18n.getKey('path'),
            allowBlank: true,
            name: 'imagePath',
            itemId: 'imagePath',
            valueUrlType: 'part',
        };
        var imagePathExpression = Ext.Object.merge({
            xtype: 'expressionfield',
            tipInfo: i18n.getKey('获取导航图片路径'),
            width: 450,
            name: 'imagePathExpression',
            autoFitErrors: true,
            allowBlank: true,
            itemId: 'imagePathExpression',
            combineErrors: true,
            fieldLabel: i18n.getKey('image') + i18n.getKey('path') + i18n.getKey('expression')
        }, contextTemplate);
        var isOrderly = {
            xtype: 'checkbox',
            name: 'isOrderly',
            itemId: 'isOrderly',
            fieldLabel: i18n.getKey('isOrderly')
        };
        var imageLibGroupId = {
            xtype: 'uxfieldcontainer',
            itemId: 'imageLibGroupId',
            name: 'imageLibGroupId',
            layout: 'hbox',
            allowBlank: true,
            defaults: {},
            labelAlign: 'left',
            tipInfo: 'imageLibGroupId相同的导航项将会使用相同的图片库',
            fieldLabel: i18n.getKey('imageLibGroupId'),
            isValid: function () {
                var me = this;
                me.Errors[me.getFieldLabel()] = '该输入项为必输项';
                return me.getComponent('imageLibGroupId').isValid();
            },
            diySetValue: function (data) {
                var me = this;
                me.getComponent('imageLibGroupId').setValue(data);
            },
            diyGetValue: function () {
                var me = this;
                return me.getComponent('imageLibGroupId').getValue();
            },
            items: [
                {
                    xtype: 'numberfield',
                    name: 'imageLibGroupId',
                    fieldLabel: false,
                    flex: 1,
                    minValue: 0,
                    margin: '0 5 0 0',
                    hideTrigger: true,
                    allowBlank: true,
                    itemId: 'imageLibGroupId'
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('selfCreate'),
                    width: 65,
                    handler: function (button) {
                        var id = JSGetCommonKey();
                        button.ownerCt.getComponent('imageLibGroupId').setValue(id);
                    }
                }
            ]
        };
        var navItemQuantityExpression = Ext.Object.merge({
            xtype: 'expressionfield',
            tipInfo: i18n.getKey('navItemQuantity'),
            width: 450,
            hidden: true,
            disabled: true,
            allowBlank: false,
            isFormField: true,
            name: 'navItemQuantityExpression',
            autoFitErrors: true,
            itemId: 'navItemQuantityExpression',
            combineErrors: true,
            fieldLabel: i18n.getKey('navItemQuantity'),
            defaultResultType: 'Number',
            defaultClazz: null,
        }, contextTemplate);
        var navItemQuantity = {
            title: i18n.getKey('导航项数量'),
            xtype: 'uxfieldset',
            name: 'navItemQuantity',
            itemId: 'uxfieldset',
            width: 850,
            extraButtons: {
                switchBtn: {
                    xtype: 'button',
                    tooltip: '切换输入模式',
                    margin: '0 0 0 10',
                    componentCls: 'btnOnlyIcon',
                    iconCls: 'icon_switch',
                    handler: function (btn) {
                        var fieldSet = this.ownerCt.ownerCt;
                        var expression = fieldSet.items.items[0];
                        var ruleGrid = fieldSet.items.items[1];
                        fieldSet.setWidth(expression.hidden ? 500 : 850);
                        expression.setVisible(expression.hidden);
                        expression.setDisabled(!expression.disabled);
                        ruleGrid.setVisible(ruleGrid.hidden);
                        ruleGrid.setDisabled(!ruleGrid.disabled);
                    }
                }
            },
            items: [
                navItemQuantityExpression,
                {
                    xtype: 'qtyrulegrid',
                    name: 'navItemQuantityRules',
                    itemId: 'navItemQuantityRules',
                    width: 800,
                    fieldLabel: i18n.getKey('navItemQuantity'),
                    outputValueFieldConfig: {
                        tipInfo: '日历类型的导航项数量=月份数量+封面数量'
                    },
                }
            ],
            diySetValue: function (data) {
                var fieldSet = this;
                var expression = fieldSet.getComponent('navItemQuantityExpression');
                var ruleGrid = fieldSet.getComponent('navItemQuantityRules');
                if (data.navItemQuantityRules) {
                    //有这个配置优先使用
                    fieldSet.setWidth(850);
                    expression.setVisible(false);
                    expression.setDisabled(true);
                    ruleGrid.setVisible(true);
                    ruleGrid.setDisabled(false);
                    ruleGrid.setSubmitValue(data.navItemQuantityRules);
                    expression.setValue(data.navItemQuantityExpression);
                } else if (data.navItemQuantityExpression) {
                    fieldSet.setWidth(500);
                    expression.setVisible(true);
                    expression.setDisabled(false);
                    ruleGrid.setVisible(false);
                    ruleGrid.setDisabled(true);
                    expression.setValue(data.navItemQuantityExpression);
                }
            },
            diyGetValue: function () {
                var fieldSet = this;
                var data = fieldSet.getValue();
                var ruleGrid = fieldSet.getComponent('navItemQuantityRules');
                if (data.navItemQuantityRules) {
                    var conditionController = Ext.create('CGP.common.condition.controller.Controller', {
                        contentAttributeStore: Ext.StoreManager.get('contentAttributeStore')
                    });
                    var valueEx = conditionController.builderExpression(ruleGrid.getSubmitValue(), 'Number');
                    data.navItemQuantityExpression = valueEx.expression;
                }
                console.log(data);
                return data;
            }
        };
        var multilingualKey = {
            name: 'multilingualKey',
            itemId: 'multilingualKey',
            readOnly: true,
            fieldStyle: 'background-color: silver',
            fieldLabel: i18n.getKey('displayNameKeys'),
            xtype: 'multilanguagefield',
            listeners: {
                afterrender: function () {
                    this.setValue({name: 'MONTH'})
                }
            }
        };
        var startMonthValueRules = {
            xtype: 'qtyrulegrid',
            name: 'startMonthValueRules',
            itemId: 'startMonthValueRules',
            width: 800,
            allowBlank: false,
            outputValueFieldConfig: {
                xtype: 'textfield',
                emptyText: '格式:2021-7',
                regex: /^(\d{4})-((0|1){0,1}\d{1})$/,
                regexText: '格式如:2021-7'
            },
            fieldLabel: i18n.getKey('日历起始月份规则'),
            diySetValue: function (data) {
                var fieldSet = this;
                fieldSet.setSubmitValue(data);

            },
            diyGetValue: function () {
                var fieldSet = this;
                var data = fieldSet.getSubmitValue();
                console.log(data);
                return data;
            }
        }
        var resultItems = [];
        if (data.clazz == 'com.qpp.cgp.domain.product.config.view.navigation.dto.v3.FixedNavItemDTO') {
            resultItems = [clazz, description, index, targetSelector2, displayNameKey, imagePath, previewItem, showWhenPreview, imageLibGroupId,];
        } else if (data.clazz == 'com.qpp.cgp.domain.product.config.view.navigation.dto.v3.DynamicNavItemDTO') {
            resultItems = [clazz, description, navItemIndexExpression, targetSelector2, displayNameKeysExpression, imagePathExpression, displayNameExpression, previewItem, showWhenPreview, imageLibGroupId,];
        } else if (data.clazz == 'com.qpp.cgp.domain.product.config.view.navigation.dto.v3.CalendarNavItemDTO') {
            resultItems = [clazz, description, navItemIndexExpression, targetSelector2, multilingualKey, startMonthValueRules, previewItem, showWhenPreview, imageLibGroupId];
        } else if (data.clazz == 'com.qpp.cgp.domain.product.config.view.navigation.dto.v3.FixedNavBarDTO') {
            resultItems = [clazz, description, isOrderly];
        } else if (data.clazz == 'com.qpp.cgp.domain.product.config.view.navigation.dto.v3.DynamicNavBarDTO') {
            resultItems = [clazz, description, isOrderly, navItemQuantity];
        }
        me.add(resultItems);
        me.componentInit = false;

    },
    setValue: function (data) {
        var me = this;
        var items = me.items.items;
        me.parentNode = data.parent;
        me.dataId = data.id;
        me.clearErrorMsg();
        Ext.Array.each(items, function (item) {
            if (item.name == 'navItemQuantity') {
                //特殊处理下navItemQuantity
                item.diySetValue(data);
            } else if (!Ext.isEmpty(data[item.name])) {
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
            if (item.name == 'navItemQuantity') {
                var navItemQuantity = item.diyGetValue();
                data = Ext.Object.merge(data, navItemQuantity);
            } else if (item.diyGetValue) {
                data[item.name] = item.diyGetValue();
            } else {
                data[item.name] = item.getValue();
            }
        });
        if (!Ext.isEmpty(me.parentNode)) {
            data.parent = me.parentNode;
        }
        console.log(data)
        data.id = me.dataId;
        return data;
    }
});
