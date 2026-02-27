/**
 * Created by nan on 2020/1/7.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.PageContentConfig', {
    extend: 'Ext.panel.Panel',
    layout: 'fit',
    recordId: null,
    itemId: 'pageContentConfig',
    productConfigDesignId: null,
    productBomConfigId: null,
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('pageContentConfig');
        var form = {
            xtype: 'form',
            border: false,
            itemId: 'form',
            padding: '10 0 0 10',
            header: false,
            defaults: {
                width: 500,
            },
            items: [
                {
                    xtype: 'uxfieldset',
                    name: 'pageContentRange',
                    itemId: 'pageContentRange',
                    disabled: true,
                    hidden: true,
                    title: i18n.getKey('pageContentRange'),
                    defaults: {
                        margin: '10 0 5 50',
                        allowBlank: true,
                        width: '100%',
                    },
                    legendItemConfig: {
                        disabledBtn: {
                            hidden: false,
                            disabled: false,
                            isUsable: false,//初始化时，是否是禁用

                        },
                        deleteBtn: {
                            hidden: false,
                            disabled: false
                        },
                    },
                    items: [
                        {
                            fieldLabel: i18n.getKey('rangeType'),
                            xtype: 'combo',
                            valueField: 'value',
                            editable: false,
                            displayField: 'name',
                            queryMode: 'local',
                            store: Ext.create('Ext.data.Store', {
                                fields: [
                                    'name', 'value'
                                ],
                                data: [
                                    {name: 'Fix', value: 'FIX'},
                                    {name: 'Range', value: 'RANGE'}
                                ]
                            }),
                            listeners: {
                                change: function (comp, newValue, oldValue) {
                                    var fieldContainer = comp.ownerCt;
                                    var maxExpression = fieldContainer.getComponent('maxExpression');
                                    if (newValue == 'FIX' && maxExpression) {
                                        fieldContainer.remove(maxExpression)
                                    } else if (newValue == 'RANGE' && !maxExpression) {
                                        fieldContainer.add(
                                            {
                                                fieldLabel: i18n.getKey('maxExpression'),
                                                xtype: 'textarea',
                                                itemId: 'maxExpression',
                                                name: 'maxExpression'
                                            }
                                        )
                                    }
                                }
                            },
                            value: 'RANGE',
                            name: 'rangeType'
                        },
                        {
                            fieldLabel: i18n.getKey('clazz'),
                            hidden: true,
                            value: 'com.qpp.cgp.domain.bom.QuantityRange',
                            xtype: 'textfield',
                            name: 'clazz'
                        },
                        {
                            fieldLabel: i18n.getKey('minExpression'),
                            xtype: 'textarea',
                            height: 80,
                            itemId: 'minExpression',
                            name: 'minExpression'
                        },
                        {
                            fieldLabel: i18n.getKey('maxExpression'),
                            xtype: 'textarea',
                            height: 80,
                            itemId: 'maxExpression',
                            name: 'maxExpression'
                        }
                    ]
                },
                {
                    xtype: 'uxtextarea',
                    allowBlank: true,
                    height: 150,
                    havePreView: false,
                    name: 'pageContentIndexExpression',
                    itemId: 'pageContentIndexExpression',
                    showJsonDataWindowConfig: {
                        showValue: true,
                    },
                    configData: {
                        context: {
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
                    },
                    extraTools: [
                        {
                            xtype: 'button',
                            text: i18n.getKey('表达式模板'),
                            iconCls: 'icon_tool', //your iconCls here
                            scope: this,
                            tooltip: '表达式模板',
                            overflowText: '表达式模板',
                            handler: function () {
                                JSShowJsonData({}, '表达式模板');
                            }
                        }
                    ],
                    fieldLabel: i18n.getKey('pageContent IndexExpression'),
                    tipInfo: 'function expression(index, args) {if (args.pcQty == 1) {return 0;} else if (args.pcQty != 1) {return args.pciIndex;}}',
                    listeners:{
                        afterrender:function (comp){
                            var toolbar=comp.down('toolbar');
                            toolbar.add('->');
                            toolbar.add({
                                xtype: 'button',
                                text: i18n.getKey('使用默认表达式'),
                                handler: function () {
                                    comp.setValue('function expression(index, args) {if (args.pcQty == 1) {return 0;} else if (args.pcQty != 1) {return args.pciIndex;}}');
                                },
                                scope: this,
                                tooltip: '使用默认表达式',
                                overflowText: '使用默认表达式'
                            });
                        }
                    }
                },
                {
                    name: 'pageContentQty',
                    xtype: 'valueexfield',
                    allowBlank: true,
                    commonPartFieldConfig: {
                        uxTextareaContextData: true,
                        defaultValueConfig: {
                            type: 'Number',
                            typeSetReadOnly: true
                        }
                    },
                    fieldLabel: 'pageContentQty',
                    itemId: 'pageContentQty'
                }
            ]
        };
        me.items = [form];
        me.callParent(arguments);
    },
    /**
     * 设置值
     * pageContentRange里面的最大最小值为空数据时，不显示整个组件
     * @param data
     */
    setValue: function (data) {
        var me = this;
        var form = me.down('form');
        if (form.rendered) {
            for (var i = 0; i < form.items.items.length; i++) {
                var item = form.items.items[i];
                //有值
                if (item.name == 'pageContentRange') {
                    if (data.pageContentRange && Ext.isEmpty(data.pageContentRange.minExpression) && Ext.isEmpty(data.pageContentRange.maxExpression)) {
                        item.setDisabled(true);
                        item.hide();
                    }
                    if (Ext.isEmpty(data.pageContentRange)) {
                        item.setDisabled(true);
                        item.hide();
                    } else {
                        /*   item.setDisabled(false);
                           item.show();*/
                    }
                }
                item.setValue(data[item.getName()]);
            }
        } else {
            form.on('afterrender', function (form) {
                for (var i = 0; i < form.items.items.length; i++) {
                    var item = form.items.items[i];
                    item.setValue(data[item.getName()]);
                }
            }, this, {
                single: true
            })
        }
    },
    isValid: function () {
        var me = this;
        var form = this.getComponent('form');
        var isValid = true,
            errors = {};
        if (form.rendered == false) {
            return true;
        } else {
            form.items.items.forEach(function (f) {
                if (!f.isValid()) {
                    if (f.xtype == 'uxfieldcontainer') {
                        errors = Ext.Object.merge(errors, f.getErrors());
                    } else {
                        errors[f.getFieldLabel()] = f.getErrors();
                    }
                    isValid = false;

                }
            });
            if (isValid == false) {
                me.ownerCt.setActiveTab(me);
            }
            return isValid;
        }
    },
    getValue: function () {
        var me = this;
        var data = {};
        var form = me.down('form');
        if (form.rendered == false) {
            return null;
        } else {
            Ext.Array.each(form.items.items, function (item) {
                if (item.disabled == false) {
                    data[item.name] = item.getValue();
                }
            });
            if (data.pageContentRange) {
                data.pageContentRange.clazz = 'com.qpp.cgp.domain.bom.QuantityRange';
            }
            return data;
        }
    }
})
