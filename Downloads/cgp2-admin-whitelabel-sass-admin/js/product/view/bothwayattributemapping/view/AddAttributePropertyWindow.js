/**
 * Created by nan on 2019/1/16.
 * 选择左右attributeProperty时的窗口
 */
Ext.define('CGP.product.view.bothwayattributemapping.view.AddAttributePropertyWindow', {
    extend: 'Ext.window.Window',
    requires: ['CGP.product.view.bothwayattributemapping.model.Attribute'],
    constrain: true,
    width: 400,
    modal: true,
    height: '40%',
    layout: 'fit',
    createOrEdit: 'create',
    record: null,
    attributeTreePanel: null,
    localSkuAttributes: null,//对应的AttributeTreePanel中选择了的skuAttribute
    anotherPanelSelectedSkuAttributes: null,//数据互补panel中选择了的skuAttribute数组
    productId: null,
    setValue: function (data) {
        var me = this;
        var form = me.items.items[0]
        var skuAttribute = form.getComponent('skuAttribute');
        var propertyName = form.getComponent('propertyName');
        var propertyValue = form.getComponent('propertyValueContainer');
        data.skuAttribute.name = data.skuAttribute.attribute.name;
        skuAttribute.setValue([data.skuAttribute]);
        propertyName.setValue(data.propertyName);
        propertyValue.setValue(data.propertyValue);
    },
    constructor: function (config) {
        var me = this;
        var store = Ext.create('CGP.product.view.bothwayattributepropertyrelevanceconfig.store.Attribute', {
            productId: config.productId
        });
        var valueEx = Ext.create('CGP.common.valueExV3.view.CommonPartField', {
            itemId: 'propertyValue',
            fieldLabel: 'propertyValue',
            name: 'value',//定义获取值时的键名必须传入
            padding: '10 0 10 45',
            defaults: {
                padding: '10 10 0 15',
                msgTarget: 'side',
                allowBlank: false
            }

        });
        var form = Ext.create('Ext.form.Panel', {
            defaults: {
                padding: '10 0 10 20'

            },
            layout: {
                type: 'vbox'
            },
            getValue: function () {
                var me = this;
                var propertyName = me.getComponent('propertyName').getSubmitValue();
                var propertyValue = me.getComponent('propertyValueContainer').getValue();
                var skuAttribute = me.getComponent('skuAttribute').getArrayValue();
                return {
                    propertyName: propertyName,
                    propertyValue: propertyValue,
                    skuAttribute: skuAttribute
                }
            },
            items: [
                {
                    xtype: 'gridcombo',
                    itemId: 'skuAttribute',
                    name: 'skuAttribute',
                    allowBlank: false,
                    editable: false,
                    fieldLabel: i18n.getKey('skuAttribute'),
                    multiSelect: false,
                    displayField: 'name',
                    valueField: 'id',
                    store: store,
                    matchFieldWidth: false,
                    gridCfg: {
                        store: store,
                        height: 280,
                        autoScroll: true,
                        width: 600,
                        columns: [
                            {
                                dataIndex: 'id',
                                width: 80,
                                text: i18n.getKey('id')
                            },
                            {
                                dataIndex: 'attribute',
                                width: 80,
                                xtype: "componentcolumn",
                                text: i18n.getKey('attributeId'),
                                renderer: function (value, metadata, record) {
                                    metadata.tdAttr = 'data-qtip="' + i18n.getKey('check') + i18n.getKey('attribute') + '"';
                                    return value.id;
                                }
                            },
                            {
                                text: i18n.getKey('displayName'),
                                dataIndex: 'displayName',
                                itemId: 'displayName',
                                renderer: function (value, metadata) {
                                    metadata.tdAttr = 'data-qtip="' + value + '"';
                                    return value;
                                }
                            },
                            {
                                dataIndex: 'attribute',
                                text: i18n.getKey('code'),
                                renderer: function (value, metadata, record) {
                                    return value.code;
                                }
                            },
                            {
                                dataIndex: 'attribute',
                                text: i18n.getKey('name'),
                                renderer: function (value, metadata, record) {
                                    return value.name;
                                }
                            },
                            {
                                dataIndex: 'attribute',
                                text: i18n.getKey('inputType'),
                                renderer: function (value, metadata, record) {
                                    return value.inputType;
                                }
                            },
                            {
                                dataIndex: 'sortOrder',
                                text: i18n.getKey('sortOrder')
                            },
                            {
                                text: i18n.getKey('options'),
                                dataIndex: 'attribute',
                                itemId: 'options',
                                width: 150,
                                renderer: function (value, metadata, record) {
                                    value = value.options;
                                    var v = [];
                                    Ext.Array.each(value, function (data) {
                                        v.push(data.name);
                                    })
                                    //是颜色option 展示颜色块
                                    if (record.get('attribute').inputType == 'Color') {
                                        var color = [];
                                        Ext.Array.each(v, function (c) {

                                            color.push(c.split(':')[0] + '<a class=colorpick style="background-color:' + c.split(':')[1] + '"></a>');

                                        })
                                        v = color;
                                    }
                                    v = v.join(',');
                                    return v;
                                }
                            }
                        ],
                        listeners: {
                            'viewReady': function (view) {
                                view.store.clearFilter();
                                view.store.filter([//一直有效
                                    {
                                        filterFn: function (item) {
                                            return !Ext.Array.contains(me.anotherPanelSelectedSkuAttributes, item.getId());
                                        }
                                    }
                                ]);
                                view.store.load();
                            }
                        }/*,
                         bbar: Ext.create('Ext.PagingToolbar', {

                         store: store,
                         displayInfo: true, // 是否 ? 示， 分 ? 信息
                         displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                         emptyMsg: i18n.getKey('noData')
                         })*/
                    }
                },
                {
                    xtype: 'combo',
                    displayField: 'name',
                    valueField: 'value',
                    store: Ext.create('Ext.data.Store',{
                        fields: ['name','value'],
                        data: [
                            {name: 'Enable',value: 'Enable'},
                            {name:'Value',value: 'Value'},
                            {name:'HiddenOption',value: 'HiddenOption'},
                            {name: 'EnableOption',value: 'EnableOption'},
                            {name: 'Hidden',value: 'Hidden'},{
                                name: 'Required',value: 'Required'
                            }]
                    }),
                    fieldLabel: i18n.getKey('propertyName'),
                    allowBlank: false,
                    itemId: 'propertyName',
                    name: 'propertyName'
                },
                /*   valueEx*/
                {
                    xtype: 'uxfieldcontainer',
                    allowBlank: false,
                    labelAlign: 'left',
                    defaults: {},
                    itemId: 'propertyValueContainer',
                    fieldLabel: i18n.getKey('propertyValue'),
                    getValue: function () {
                        var me = this;
                        return me.getComponent('propertyValue').getValue();
                    },
                    setValue: function (value) {
                        var me = this;
                        me.getComponent('propertyValue').setValue(value);
                    },
                    items: [
                        {
                            xtype: 'button',
                            value: null,
                            width: 185,
                            itemId: 'propertyValue',
                            getValue: function () {
                                var me = this;
                                return me.value;
                            },
                            setValue: function (value) {
                                var me = this;
                                me.value = value;
                            },
                            text: i18n.getKey('compile'),
                            handler: function (button) {
                                var valueEx = Ext.create('CGP.common.valueExV3.GroupGridTab', {
                                    itemId: 'diyCustomsCategoryWindow',
                                    listeners: {
                                        'afterrender': function (view) {
                                            view.getFormPanel().form.getFields().items[0].setValue('com.qpp.cgp.value.ExpressionValueEx');//设置初始的type
                                            view.getFormPanel().form.getFields().items[1].setValue('Array');//设置初始的数据类型
                                            if (button.value) {
                                                view.getGridPanel().setValue(button.value.constraints);
                                                view.getFormPanel().setValue(button.value);
                                            } else {
                                                view.getGridPanel().setValue({});
                                            }
                                        }
                                    }
                                });
                                var win = Ext.create('Ext.window.Window', {
                                    modal: true,
                                    constrain: true,
                                    maximizable: true,
                                    layout: 'fit',
                                    width: '60%',
                                    height: '70%',
                                    title: i18n.getKey('compile'),
                                    items: [valueEx],
                                    tbar: [
                                        {
                                            xtype: 'button',
                                            text: i18n.getKey('save'),
                                            iconCls: 'icon_save',
                                            handler: function (btn) {
                                                var formPanel = btn.ownerCt.ownerCt.getComponent('diyCustomsCategoryWindow').getFormPanel();
                                                var gridPanelValue = btn.ownerCt.ownerCt.getComponent('diyCustomsCategoryWindow').getGridPanelValue();
                                                var formPanelValue = btn.ownerCt.ownerCt.getComponent('diyCustomsCategoryWindow').getFormPanelValue();
                                                formPanelValue.constraints = gridPanelValue;
                                                if (!formPanel.isValid()) {
                                                    return
                                                } else {
                                                    if (formPanelValue.clazz == 'com.qpp.cgp.value.ExpressionValueEx' && Ext.isEmpty(formPanelValue.expression)) {
                                                        Ext.Msg.alert(i18n.getKey('prompt'), '基本信息中的表达式不能为空！')
                                                    } else {
                                                        button.value = formPanelValue;
                                                        win.close();
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'button',
                                            text: i18n.getKey('cancel'),
                                            iconCls: 'icon_cancel',
                                            handler: function (btn) {
                                                win.close();
                                            }
                                        }
                                    ]
                                });
                                win.show();
                            }
                        }
                    ]
                }
            ],
            bbar: [
                '->',
                {
                    xtype: 'button',
                    text: i18n.getKey('save'),
                    iconCls: 'icon_save',
                    handler: function (btn) {
                        var form = btn.ownerCt.ownerCt;
                        var isValid = false;
                        if (form.getComponent('propertyValueContainer').getComponent('propertyValue').getValue() == null) {
                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('propertyValue') + '必须经编辑！');
                        } else if (form.isValid()) {
                            isValid = true;
                        }
                        if (isValid) {
                            var result = form.getValue();
                            var node = me.attributeTreePanel.store.getRootNode().findChild('text', result.skuAttribute.attribute.name + '(' + result.skuAttribute.id + ')');
                            if (node) {
                                var childrenNode = node.findChild('text', result.propertyName);
                                if (me.createOrEdit == 'edit') {
                                    Ext.Msg.confirm(i18n.getKey('prompt'), '该property已经存在,是否覆盖其值?', function (select) {
                                        if (select == 'yes') {
                                            if (result.propertyName == me.record.get('propertyName')) {
                                                //没修改属性名
                                            } else {
                                                //修改了属性名，判断修改后的属性名是否已经存在
                                                var extraNode = node.findChild('text', me.record.get('propertyName'));
                                                node.removeChild(extraNode);

                                            }
                                            node.removeChild(childrenNode);
                                            node.appendChild({
                                                text: result.propertyName,
                                                propertyValue: result.propertyValue,
                                                leaf: true,
                                                id: JSGetUUID(),
                                                skuAttribute: result.skuAttribute,
                                                parentId: result.skuAttribute.attribute.name + '(' + result.skuAttribute.id + ')',
                                                propertyName: result.propertyName,
                                                icon: '../../../ClientLibs/extjs/resources/themes/images/ux/property.png'
                                            })
                                            me.attributeTreePanel.expandAll();
                                            me.close();
                                        }
                                    })
                                    return;
                                } else {
                                    node.appendChild({
                                        text: result.propertyName,
                                        propertyValue: result.propertyValue,
                                        leaf: true,
                                        id: JSGetUUID(),
                                        skuAttribute: result.skuAttribute,
                                        parentId:result.skuAttribute.attribute.name + '(' + result.skuAttribute.id + ')',
                                        propertyName: result.propertyName,
                                        icon: '../../../ClientLibs/extjs/resources/themes/images/ux/property.png'
                                    })
                                }
                            } else {
                                me.attributeTreePanel.store.getRootNode().appendChild({
                                    text: result.skuAttribute.attribute.name + '(' + result.skuAttribute.id + ')',
                                    leaf: false,
                                    skuAttribute: result.skuAttribute,
                                    id: result.skuAttribute.attribute.name + '(' + result.skuAttribute.id + ')',
                                    icon: '../../../ClientLibs/extjs/resources/themes/images/ux/attribute.png',
                                    children: [
                                        {
                                            text: result.propertyName,
                                            propertyValue: result.propertyValue,
                                            leaf: true,
                                            id: JSGetUUID(),
                                            skuAttribute: result.skuAttribute,
                                            propertyName: result.propertyName,
                                            icon: '../../../ClientLibs/extjs/resources/themes/images/ux/property.png'
                                        }
                                    ]
                                })
                                me.localSkuAttributes.push(result.skuAttribute.id)
                            }
                            me.attributeTreePanel.expandAll();
                            me.close();
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function () {
                        me.close();
                    }
                }
            ]
        });
        me.items = [
            form
        ];
        me.callParent(arguments)
    }
})
