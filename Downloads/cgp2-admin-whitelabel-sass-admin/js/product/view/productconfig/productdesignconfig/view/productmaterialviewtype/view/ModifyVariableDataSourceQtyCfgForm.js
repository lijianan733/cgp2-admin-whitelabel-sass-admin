/**
 * Created by nan on 2019/12/30.
 */
Ext.define("CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.ModifyVariableDataSourceQtyCfgForm", {
    extend: 'Ext.ux.form.ErrorStrickForm',
    region: 'center',
    itemId: 'centerPanel',
    createOrEdit: 'create',
    record: null,
    data: null,
    border: false,
    bodyStyle: {
        borderColor: 'silver'
    },
    defaults: {
        height: 800,
        width: 600,
        hidden: true,
        margin: '10 10 10 10',
    },
    listeners: {
        afterrender: function (panel) {
            panel.el.mask();
        }
    },
    tbar: [
        {
            xtype: 'button',
            text: i18n.getKey('save') + i18n.getKey('VariableDataSourceQtyCfg'),
            iconCls: 'icon_save',
            hidden: true,
            itemId: 'saveBtn',
            handler: function (btn) {
                var centerPanel = btn.ownerCt.ownerCt;
                var leftPanel = centerPanel.ownerCt.getComponent('leftPanel');
                var data = centerPanel.getValue();
                if (centerPanel.isValid()) {
                    if (centerPanel.createOrEdit == 'create') {
                        leftPanel.store.proxy.data.push(data);
                        leftPanel.store.load();
                        leftPanel.getSelectionModel().select(leftPanel.store.proxy.data.length - 1);
                    } else {
                        var index = centerPanel.record.index;
                        leftPanel.store.proxy.data[index] = data;
                        leftPanel.store.load();
                        leftPanel.getSelectionModel().select(index);
                    }
                }
            }
        },
       /* {
            xtype: 'button',
            text: i18n.getKey('refresh'),
            iconCls: 'icon_refresh',
            itemId: 'refreshBtn',
            handler: function (btn) {
                var panel = btn.ownerCt.ownerCt;
                panel.setValue(panel.data);
            }
        },*/
        {
            xtype: 'button',
            text: i18n.getKey('查看原variableDataSource'),
            iconCls: 'icon_check',
            handler: function (btn) {
                var panel = btn.ownerCt.ownerCt;
                var fieldset = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.OriginalVariableDataSourceQtyCfgForm', {
                    itemId: 'originalData',
                    readOnly: true
                });
                var win = Ext.create('Ext.window.Window', {
                    constrain: true,
                    title: '原variableDataSource',
                    items: [
                        fieldset
                    ]
                });
                var variableDataSourceId = panel.data.variableDataSource._id;
                var variableDataSourceData = panel.ownerCt.allVariableDataSource.find(function (item) {
                    if (item._id == variableDataSourceId) {
                        return true;
                    } else {
                        return false
                    }
                });
                /*
                                var variableDataSourceData = panel.ownerCt.variableDataSourceStore.findRecord('_id', variableDataSourceId).getData();
                */
                fieldset.setValue(variableDataSourceData);
                win.show();
            }
        }
    ],
    isValid: function () {
        this.msgPanel.hide();
        var errors = {};
        var isValid = true;
        this.items.items.forEach(function (f) {
            if (!f.isValid()) {
                isValid = false;
                if (Ext.isObject(f.getErrors())) {
                    Ext.Object.merge(errors, f.getErrors());
                } else {
                    errors[f.getFieldLabel()] = f.getErrors();
                }
            }
        });
        isValid ? null : this.showErrors(errors);
        return isValid;
    },
    setValue: function (data) {
        var me = this;
        me.data = data;
        console.log(data);
        if (data && !Ext.isEmpty(data.vdQtyCfg)) {
            data.qtyRange = {
                rangeType: 'FIX',
                vdQtyCfg: data.vdQtyCfg,
                clazz: "com.qpp.cgp.domain.bom.QuantityRange"
            }
        }else{
            data.qtyRange = {
                rangeType: 'FIX',
                clazz: "com.qpp.cgp.domain.bom.QuantityRange"
            }
        }
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.itemId == 'variableDataSource') {
                item.setValue(data[item.getName()]._id);
            } else if (item.itemId == 'clazz') {
                item.setValue(data['variableDataSource'].clazz);
            } else {
                item.setValue(data[item.getName()]);
            }
        }
        me.el.unmask();
    },
    reset: function () {
        var me = this;
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.xtype == 'expressionfield') {
                item.setValue({});
            } else {
                item.reset();
            }
        }
    },
    getValue: function () {
        var me = this;
        var result = {};
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.disabled != true) {
                if (item.itemId == 'dataSourceGridcombo') {
                    var dataSourceId = item.getSubmitValue()[0];
                    if (dataSourceId) {
                        var variableDataSource = item.getValue()[dataSourceId];
                        result[item.getName()] = {
                            _id: item.getSubmitValue()[0],
                            clazz: variableDataSource.clazz
                        };
                    }
                } else {
                    result[item.getName()] = item.getValue();
                }
            }
        }
        result.variableDataSource = {
            _id: result.variableDataSource,
            clazz: result.clazz,
        };
        if (result.qtyRange && result.qtyRange.rangeType == 'FIX') {
            result.vdQtyCfg = result.qtyRange.vdQtyCfg;
            delete result.qtyRange;
        }else{
            result.vdQtyCfg=null;
        }
        delete result.clazz;
        return result;
    },
    initComponent: function () {
        var me = this;
        me.defaults = {
            width: 550,
            margin: '5 15 5 15'
        };
        me.items = [
            {
                xtype: 'textfield',
                itemId: 'description',
                name: 'description',
                allowBlank: false,
                fieldLabel: i18n.getKey('description')
            },
            {
                xtype: 'uxfieldcontainer',
                name: 'qtyRange',
                fieldLabel: i18n.getKey('vd上传元素') + i18n.getKey('qty'),
                defaults: {
                    margin: '10 0 10 50',
                    allowBlank: true,
                    width: '100%',
                },
                items: [
                    {
                        fieldLabel: i18n.getKey('value') + i18n.getKey('type'),
                        xtype: 'combo',
                        valueField: 'value',
                        itemId: 'rangeType',
                        editable: false,
                        displayField: 'name',
                        queryMode: 'local',
                        value: 'FIX',
                        name: 'rangeType',
                        store: Ext.create('Ext.data.Store', {
                            fields: [
                                'name', 'value'
                            ],
                            data: [
                                {name: '固定值', value: 'FIX'},
                                {name: '范围值', value: 'RANGE'}
                            ]
                        }),
                        mapping: {
                            common: ['rangeType', 'clazz'],
                            FIX: ['vdQtyCfg'],
                            RANGE: ['minExpression', 'maxExpression']
                        },
                        listeners: {
                            change: function (comp, newValue, oldValue) {
                                var fieldContainer = comp.ownerCt;
                                for (var i = 1; i < fieldContainer.items.items.length; i++) {
                                    var item = fieldContainer.items.items[i];
                                    if (Ext.Array.contains(comp.mapping['common'], item.itemId)) {
                                    } else if (Ext.Array.contains(comp.mapping[newValue], item.itemId)) {
                                        item.show();
                                        item.setDisabled(false);
                                    } else {
                                        item.hide();
                                        item.setDisabled(true);
                                    }
                                }
                            }
                        },
                    },
                    {
                        fieldLabel: i18n.getKey('clazz'),
                        hidden: true,
                        itemId: 'clazz',
                        value: 'com.qpp.cgp.domain.bom.QuantityRange',
                        xtype: 'textfield',
                        name: 'clazz'
                    },
                    {
                        fieldLabel: i18n.getKey('minValue') + i18n.getKey('expression'),
                        xtype: 'textarea',
                        hidden: true,
                        disabled: true,
                        grow: true,
                        itemId: 'minExpression',
                        name: 'minExpression'
                    },
                    {
                        fieldLabel: i18n.getKey('maxValue') + i18n.getKey('expression'),
                        xtype: 'textarea',
                        hidden: true,
                        disabled: true,
                        grow: true,
                        itemId: 'maxExpression',
                        name: 'maxExpression'
                    },
                    {
                        name: 'vdQtyCfg',
                        itemId: 'vdQtyCfg',
                        xtype: 'valueexfield',
                        fieldLabel: i18n.getKey('固定值'),
                        commonPartFieldConfig: {
                            defaultValueConfig: {
                                type: 'Number',
                                typeSetReadOnly: true,
                            }
                        }
                    }
                ]
            },
            {
                xtype: 'textfield',
                itemId: 'variableDataSource',
                name: 'variableDataSource',
                hidden: true,
                fieldLabel: i18n.getKey('variableDataSource')
            },
            {
                xtype: 'textfield',
                itemId: 'clazz',
                name: 'clazz',
                hidden: true,
                fieldLabel: i18n.getKey('clazz')
            }
        ];
        me.callParent();
    }
})
