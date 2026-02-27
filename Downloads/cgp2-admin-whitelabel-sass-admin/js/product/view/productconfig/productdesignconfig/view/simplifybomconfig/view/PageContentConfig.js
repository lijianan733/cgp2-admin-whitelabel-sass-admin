/**
 * Created by nan on 2020/1/7.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.simplifybomconfig.view.PageContentConfig', {
    extend: 'Ext.panel.Panel',
    layout: 'fit',
    recordId: null,
    itemId: 'pageContentConfig',
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('pageContentConfig');
        var form = {
            xtype: 'form',
            itemId: 'form',
            border: false,
            padding: '10 0 0 10',
            header: false,
            defaults: {
                width: 500,
            },
            items: [
                {
                    xtype: 'uxfieldcontainer',
                    name: 'pageContentRange',
                    itemId: 'pageContentRange',
                    fieldLabel: i18n.getKey('pageContentRange'),
                    defaults: {
                        margin: '10 0 5 50',
                        allowBlank: true,
                        width: '100%',
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
                    xtype: 'textarea',
                    height:150,
                    name: 'pageContentIndexExpression',
                    allowBlank: true,
                    itemId: 'pageContentIndexExpression',
                    fieldLabel: i18n.getKey('pageContent IndexExpression')
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
    setValue: function (data) {
        var me = this;
        var form = me.down('form');
        if (form.rendered) {
            for (var i = 0; i < form.items.items.length; i++) {
                var item = form.items.items[i];
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
    },
    getValue: function () {
        var me = this;
        var data = {};
        var form = me.down('form');
        if (form.rendered == false) {
            return null;
        } else {
            Ext.Array.each(form.items.items, function (item) {
                data[item.name] = item.getValue();
            });
            if (data.pageContentRange) {
                data.pageContentRange.clazz = 'com.qpp.cgp.domain.bom.QuantityRange';
            }
            return data;
        }
    }
})
