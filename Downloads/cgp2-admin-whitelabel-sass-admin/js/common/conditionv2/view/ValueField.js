/**
 * @Description: 值的选择组件
 * @author nan
 * @date 2022/9/26
 */
Ext.Loader.syncRequire([
    'CGP.common.store.ProductAttributeStore',
])
Ext.define("CGP.common.conditionv2.view.ValueField", {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.valuefield',
    labelAlign: 'top',
    msgTarget: 'none',
    readOnly: false,
    border: false,
    productId: null,//必填
    contextStore: null,//必填
    layout: {
        type: 'vbox'
    },
    clazzReadOnly: false,//类型是否只读
    clazzHidden: false,
    defaults: {
        hidden: true,
        width: '100%',
        margin: '5 0 5 25',
        disabled: true,
    },
    itemsConfig: {},//itemId:{}的格式配置
    getValue: function () {
        var me = this;
        var result = {};
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.disabled == false) {
                if (item.diyGetValue) {
                    result[item.getName()] = item.diyGetValue();
                } else {
                    result[item.getName()] = item.getValue();
                }
            }
        }
        return result;
    },
    setValue: function (data) {
        var me = this;
        if (data) {
            if (me.rendered == true) {
                for (var i = 0; i < me.items.items.length; i++) {
                    var item = me.items.items[i];
                    if (item.diySetValue) {
                        item.diySetValue(data[item.getName()]);
                    } else {
                        item.setValue(data[item.getName()]);
                    }
                }
            } else {
                me.on('afterrender', function () {
                    for (var i = 0; i < me.items.items.length; i++) {
                        var item = me.items.items[i];
                        if (item.diySetValue) {
                            item.diySetValue(data[item.getName()]);
                        } else {
                            item.setValue(data[item.getName()]);
                        }
                    }
                });
            }
        }
    },
    constructor: function () {
        var me = this;
        me.callParent(arguments);
    },
    /**
     * 合并自定义配置
     */
    mergeConfig: function (itemsConfig) {
        var me = this;
        if (me.itemsConfig) {
            for (var i in me.itemsConfig) {
                var itemId = i;
                var config = me.itemsConfig[i];
                for (var j = 0; j < me.items.length; j++) {
                    if (itemId == me.items[j].itemId) {
                        Ext.Object.merge(me.items[j], config);
                    }
                }
            }
        }
    },
    initComponent: function () {
        var me = this;
        var clazzId = JSGetUUID();
        var contextStore = me.contextStore;
        me.contextTemplate = JSBuildContentTemplateTreeDate(me.contextStore);
        var treeData = JSJsonToTree(me.contextTemplate, me.title);
        var treeStore = Ext.create('Ext.data.TreeStore', {
            autoLoad: true,
            fields: [
                'text', 'value'
            ],
            proxy: {
                type: 'memory'
            },
            root: {
                expanded: true,
                children: treeData.children
            }
        });
        me.items = [
            {
                xtype: 'radiogroup',
                columns: 4,
                id: JSGetUUID(),
                itemId: 'clazz',
                name: 'clazz',
                hidden: false,
                disabled: false,
                fieldLabel: i18n.getKey('取值方式'),
                vertical: true,
                clazz: 'clazz_' + clazzId,
                items: [
                    {boxLabel: '固定值', name: 'clazz_' + clazzId, inputValue: 'ConstantValue', checked: true,},
                    {boxLabel: '属性值', name: 'clazz_' + clazzId, inputValue: 'ProductAttributeValue'},
                    {boxLabel: '上下文', name: 'clazz_' + clazzId, inputValue: 'ContextPathValue'},
                    {boxLabel: '表达式', name: 'clazz_' + clazzId, inputValue: 'CalculationValue'},
                ],
                mapping: {
                    common: ['clazz'],
                    ContextPathValue: ['path'],
                    ProductAttributeValue: ['attributeId'],
                    PropertyPathValue: ['skuAttributeId', 'attributeProfile', 'propertyName'],
                    ConstantValue: ['stringValue', 'numberValue', 'booleanValue', 'arrayValue', 'valueType'],
                    CalculationValue: ['expression', 'parameter'/*, 'valueType'*/]
                },
                listeners: {
                    change: function (combo, newValue, oldValue) {
                        var form = combo.ownerCt;
                        var clazz = newValue[combo.clazz];
                        if (newValue && clazz) {
                            form.suspendLayouts();//挂起布局
                            form.items.items.map(function (item) {
                                if (Ext.Array.contains(combo.mapping.common, item.itemId)) {
                                    //不做处理
                                } else if (item.name == 'value' && clazz == 'ConstantValue') {
                                    //不做处理，ConstantValue的组件由valueType来控制
                                } else {
                                    if (Ext.Array.contains(combo.mapping[clazz], item.itemId)) {
                                        item.show();
                                        item.setDisabled(false);
                                    } else {
                                        item.hide();
                                        item.setDisabled(true);
                                    }
                                }
                            });
                            form.resumeLayouts();//恢复布局
                            form.doLayout();
                        }
                    }
                },
                diyGetValue: function () {
                    var me = this;
                    return me.getValue()[me.clazz];
                },
                diySetValue: function (data) {
                    var me = this;
                    var object = {};
                    object[me.clazz] = data;
                    me.setValue(object);
                }
            },
            {
                xtype: 'checkbox',
                hidden: true,
                disabled: true,
                fieldLabel: i18n.getKey('是否允许为空'),
                name: 'nullable',
                checked: true,
                itemId: 'nullable'
            },
            {
                xtype: 'combo',
                hidden: false,
                disabled: false,
                itemId: 'valueType',
                name: 'valueType',
                valueField: 'value',
                displayField: 'display',
                editable: false,
                value: 'String',
                fieldLabel: i18n.getKey('值类型'),
                store: {
                    xtype: 'store',
                    fields: [
                        'value', 'display'
                    ],
                    data: [
                        {
                            value: 'String',
                            display: 'String'
                        }, {
                            value: 'Number',
                            display: 'Number'
                        }, {
                            value: 'Boolean',
                            display: 'Boolean'
                        }, {
                            value: 'Array',
                            display: 'Array'
                        }, {
                            value: 'Null',
                            display: 'Null'
                        }
                    ]
                },
                listeners: {
                    change: function (combo, newValue, oldValue) {
                        var stringValue = combo.ownerCt.getComponent('stringValue');
                        var numberValue = combo.ownerCt.getComponent('numberValue');
                        var booleanValue = combo.ownerCt.getComponent('booleanValue');
                        var arrayValue = combo.ownerCt.getComponent('arrayValue');
                        var arr = [stringValue, numberValue, booleanValue, arrayValue];
                        var aimField = null;
                        if (newValue == 'String') {
                            aimField = stringValue;
                        } else if (newValue == 'Number') {
                            aimField = numberValue;
                        } else if (newValue == 'Boolean') {
                            aimField = booleanValue;
                        } else if (newValue == 'Array') {
                            aimField = arrayValue;
                        } else if (newValue == 'Null') {

                        }
                        arr.map(function (item) {
                            if (aimField == item) {
                                aimField.show();
                                aimField.setDisabled(false);
                            } else {
                                item.hide();
                                item.setDisabled(true);
                            }
                        });
                    },
                    show: function () {
                        var me = this;
                        if (me.value) {
                            me.fireEvent('change', me, me.value, me.value);
                        }
                    },
                    afterrender: function () {
                        var me = this;
                        if (me.value) {
                            me.fireEvent('change', me, me.value, me.value);
                        }
                    }
                },
                diySetValue: function (value) {
                    if (value) {
                        this.setValue(value);
                    }
                }
            },
            {
                xtype: 'textfield',
                name: 'value',
                itemId: 'stringValue',
                allowBlank: false,
                fieldLabel: i18n.getKey('固定值')
            },
            {
                xtype: 'numberfield',
                name: 'value',
                hidden: true,
                disabled: true,
                itemId: 'numberValue',
                allowBlank: false,
                fieldLabel: i18n.getKey('固定值')
            },
            {
                xtype: 'combo',
                name: 'value',
                hidden: true,
                disabled: true,
                itemId: 'booleanValue',
                haveReset: true,
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        'display', 'value'
                    ],
                    data: [
                        {
                            value: true,
                            display: 'true'
                        }, {
                            value: false,
                            display: 'false'
                        }
                    ]
                }),
                editable: false,
                displayField: 'display',
                valueField: 'value',
                allowBlank: false,
                fieldLabel: i18n.getKey('固定值')
            },
            {
                xtype: 'arraydatafield',
                name: 'value',
                hidden: true,
                disabled: true,
                itemId: 'arrayValue',
                allowBlank: false,
                resultType: 'string',
                fieldLabel: i18n.getKey('固定值'),
                diyGetValue: function () {
                    var me = this;
                    return '[' + me.getValue() + ']';
                },
                diySetValue: function (data) {
                    var me = this;
                    var arr = [];
                    if (data && /\[.*\]/.test(data)) {
                        var str = data.replace(/(\[|\])/g, '');
                        me.setValue(str);
                    }
                }
            },
            {
                xtype: 'treecombo',
                fieldLabel: i18n.getKey('JsonPath'),
                name: 'path',
                itemId: 'path',
                padding: 0,
                allowBlank: false,
                multiselect: false,
                valueField: 'text',
                displayField: 'text',
                dataIndex: 'name',
                matchFieldWidth: false,
                treePanelConfig: {
                    width: 700,
                    columns: [
                        {
                            xtype: 'treecolumn',
                            text: '<font color="green">上下文本变量</font>',
                            dataIndex: 'text',
                            width: 250,
                            renderer: function (value, metadata, record, rowIndex, colIndex, store, view) {
                                metadata.tdAttr = 'data-qtip=""';
                                return value;
                            }
                        },
                        {
                            text: '<font color="green">值类型</font>',
                            width: 100,
                            dataIndex: 'text',
                            renderer: function (value, metadata, record, rowIndex, colIndex, store, view) {
                                var record = view.ownerCt.ownerTreeCombo.ownerCt.contextStore.findRecord('key', value);
                                return record.get('valueType');
                            }
                        },
                        {
                            dataIndex: 'text',
                            text: '<font color="green">描述</font>',
                            flex: 1,
                            renderer: function (value, metadata, record, rowIndex, colIndex, store, view) {
                                var record = view.ownerCt.ownerTreeCombo.ownerCt.contextStore.findRecord('key', value);
                                if (record) {
                                    return record.get('displayName');
                                }
                            }
                        }],
                    listeners: {
                        afterrender: function () {
                            var me = this;
                            me.expandAll();
                        }
                    }
                },
                store: treeStore,
                initEvents: function () {
                    var me = this;
                    //这里强行调用指定方法，由于是强行写的的，没有EXT类继承体系中的相关字段，无法调用me.callParent
                    me.__proto__.initEvents.apply(this, arguments || []);
                    me.mon(me.inputEl, 'click', me.onTriggerClick, me);
                },
                setValue: function (value) {
                    var me = this;
                    var arr = [];
                    var record = me.tree.getView().getSelectionModel().getSelection()[0];
                    if (record) {
                        do {
                            if (record.isLeaf()) {
                                arr.push('["' + record.get('text').trim() + '"]');
                            } else {
                                arr.push(record.get('text').trim());
                            }
                            record = record.parentNode;
                        } while (!record.isRoot());
                        arr = arr.reverse();
                        var str = arr.pop();
                        value = arr.join('.') + str;
                        //这里强行调用指定方法，由于是强行写的的，没有EXT类继承体系中的相关字段，无法调用me.callParent
                        Ext.form.field.Text.prototype.setValue.apply(this, [value] || []);
                    } else {
                        Ext.form.field.Text.prototype.setValue.apply(this, [value] || []);
                    }
                },
            },
            {
                xtype: 'gridcombo',
                fieldLabel: i18n.getKey('属性值'),
                name: 'attributeId',
                itemId: 'attributeId',
                allowBlank: false,
                haveReset: true,
                valueField: 'key',
                displayField: 'displayName',
                hidden: true,
                disabled: true,
                store: me.contextStore,
                editable: false,
                matchFieldWidth: false,
                gridCfg: {
                    store: me.contextStore,
                    height: 350,
                    width: 500,
                    columns: [
                        {
                            dataIndex: 'displayName',
                            flex: 1,
                            text: '上下属性'
                        },
                        {
                            dataIndex: 'valueType',
                            width: 100,
                            text: '值类型'
                        }
                    ]
                },
                diyGetValue: function () {
                    var me = this;
                    return me.getSubmitValue()[0];
                },
                diySetValue: function (data) {
                    var me = this;
                    return me.setSubmitValue(data);
                }
            },
            {
                xtype: 'treecombo',
                fieldLabel: i18n.getKey('skuAttributeId'),
                name: 'skuAttributeId',
                itemId: 'skuAttributeId',
                padding: 0,
                allowBlank: false,
                editable: false,
                haveReset: true,
                multiselect: false,
                valueField: 'value',
                displayField: 'name',
                dataIndex: 'name',
                matchFieldWidth: false,
                treePanelConfig: {
                    width: 450,
                    listeners: {
                        beforeselect: function (selmodel, record) {
                            if (record.get('type') == 'skuAttribute') {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }
                },
                store: Ext.create('Ext.data.TreeStore', {
                    fields: [
                        'name', 'value', 'icon', 'id', 'leaf', 'type'
                    ],
                    root: {}
                }),
                listeners: {
                    afterrender: function () {
                        var treeCombo = this;
                        var url = adminPath + 'api/attributeProfile?page=1&start=0&limit=25&filter=[{"name":"productId","value":133829,"type":"number"}]';
                        JSAjaxRequest(url, 'GET', true, null, false, function (require, success, response) {
                            if (success) {
                                var responseText = Ext.JSON.decode(response.responseText);
                                if (responseText.success) {
                                    var result = responseText.data.content;
                                    var rootNode = treeCombo.tree.getRootNode();
                                    var buildChildren = function (groups, parentId) {
                                        var result = [];
                                        groups.map(function (group) {
                                            var attributes = group.attributes;
                                            result.push({
                                                name: 'group_' + group.displayName + '<' + group._id + '>',
                                                value: group._id,
                                                parentId: parentId,
                                                type: 'group',
                                                expanded: false,
                                                leaf: false,
                                                id: group._id,
                                                icon: path + 'ClientLibs/extjs/resources/themes/images/shared/fam/tag_orange.png',
                                                children: attributes ? attributes.map(function (skuAttribute) {
                                                    return {
                                                        name: 'skuAttribute_' + skuAttribute.displayName + '<' + skuAttribute.id + '>',
                                                        value: skuAttribute.id,
                                                        expanded: true,
                                                        parentId: group._id,
                                                        type: 'skuAttribute',
                                                        leaf: true,
                                                        id: group._id + '_' + skuAttribute.id,
                                                        icon: path + 'ClientLibs/extjs/resources/themes/images/shared/fam/tag_green.png',
                                                    }
                                                }) : []
                                            })
                                        });
                                        return result;
                                    };
                                    result = result.map(function (item) {
                                        return {
                                            name: 'profile_' + item.name + '<' + item._id + '>',
                                            value: item._id,
                                            expanded: true,
                                            type: 'profile',
                                            id: item._id,
                                            icon: path + 'ClientLibs/extjs/resources/themes/images/shared/fam/tag_red.png',
                                            children: buildChildren(item.groups || [], item._id)
                                        }
                                    });
                                    rootNode.appendChild(result);
                                    treeCombo.tree.expandAll();
                                }
                            }
                        })
                    },
                },
            },
            {
                xtype: 'gridfieldwithcrudv2',
                hideLabel: true,
                itemId: 'parameter',
                allowBlank: true,
                name: 'parameter',
                fieldLabel: i18n.getKey('自定义参数'),
                winConfig: {
                    formConfig: {
                        width: 500,
                        defaults: {
                            width: 450
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                name: 'key',
                                allowBlank: false,
                                itemId: 'key',
                                fieldLabel: i18n.getKey('key')
                            },
                            {
                                name: 'value',
                                fieldLabel: i18n.getKey('value'),
                                xtype: 'valuefield',
                                allowBlank: false,
                                contextStore: contextStore,
                                productId: me.productId,
                                itemId: 'value'
                            }
                        ]
                    },
                },
                gridConfig: {
                    tbar: {
                        hiddenButtons: ['read', 'clear', 'config', 'help', 'export', 'import'],
                        btnDelete: {
                            hidden: false,
                            xtype: 'displayfield',
                            flex: 1,
                            value: '<font color="green">双击添加变量到表达式</font>',
                            handler: function (btn) {

                            }
                        }
                    },
                    store: {
                        xtype: 'store',
                        fields: [
                            'key',
                            {
                                name: 'value',
                                type: 'object'
                            }
                        ],
                        data: []
                    },
                    columns: [
                        {
                            text: i18n.getKey('key'),
                            dataIndex: 'key',
                            tdCls: 'vertical-middle'
                        },
                        {
                            xtype: 'componentcolumn',
                            text: i18n.getKey('value'),
                            dataIndex: 'value',
                            readOnly: true,
                            canChangeValue: false,//是否可以通过编辑改变record的
                            flex: 1,
                            renderer: function (value, metaData, record) {
                                if (value.clazz == 'ContextPathValue') {
                                    metaData.tdAttr = 'data-qtip="' + JSUbbToHtml(value.path) + '"';
                                    return '上下文路径：' + value.path;

                                } else if (value.clazz == 'ProductAttributeValue') {
                                    metaData.tdAttr = 'data-qtip="' + JSUbbToHtml(value.attributeId + '') + '"';
                                    return '产品属性：' + value.attributeId;

                                } else if (value.clazz == 'ConstantValue') {
                                    return '固定值：' + value.value;

                                } else if (value.clazz == 'CalculationValue') {
                                    return {
                                        xtype: 'displayfield',
                                        value: "<a href='#'>查看</a>",
                                        listeners: {
                                            render: function (display) {
                                                display.getEl().on("click", function () {
                                                    JSShowJsonData(null, '表达式', {
                                                        xtype: 'valuefield',
                                                        margin: '25 25 25 0',
                                                        contextStore: contextStore,
                                                        productId: me.productId
                                                    }, {
                                                        layout: 'fit',
                                                        autoScroll: true,
                                                        width: 600,
                                                        height: null,
                                                        listeners: {
                                                            afterrender: function () {
                                                                var me = this;
                                                                this.items.items[0].setValue(value)
                                                            }
                                                        }
                                                    });
                                                });
                                            }
                                        }
                                    }
                                }
                            },
                        }
                    ],
                    listeners: {
                        itemdblclick: function (view, record, item, index, e, eOpts) {
                            var expression = arguments[0].ownerCt.ownerCt.ownerCt.getComponent('expression');
                            var str = expression.getValue() || '';
                            var key = record.get('key');
                            str = str + '${' + key + '}';
                            expression.setValue(str);
                        }
                    }
                },
            },
            {
                xtype: 'uxtextarea',
                fieldLabel: i18n.getKey('expression'),
                name: 'expression',
                itemId: 'expression',
                allowBlank: false,
                height: 100,
                toolbarConfig: {
                    items: [{
                        xtype: 'button',
                        iconCls: 'icon_help',
                        text: i18n.getKey('help')
                    }]
                },
                emptyText: '例如：${L}*${W}*${H}*1.2/1000'
            },
        ];
        //对指定组件进行配置
        me.mergeConfig(me.itemsConfig);
        me.callParent();
    }
})
