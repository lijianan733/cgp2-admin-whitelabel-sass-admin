/**
 * Created by nan on 2021/10/16
 */
Ext.define('CGP.virtualcontainertype.view.PCLayoutFieldSet', {
    extend: 'Ext.ux.form.field.UxFieldSet',
    alias: 'widget.pclayoutfieldset',
    name: 'layout',
    defaults: {
        width: '100%',
        allowBlank: false,
    },
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'combo',
                name: 'clazz',
                itemId: 'clazz',
                fieldLabel: i18n.getKey('clazz'),
                editable: false,
                valueField: 'value',
                displayField: 'display',
                value: 'com.qpp.cgp.domain.pcresource.virtualcontainer.PanelLayout',
                store: Ext.create('Ext.data.Store', {
                    fields: ['display', 'value'],
                    data: [
                        {
                            value: 'com.qpp.cgp.domain.pcresource.virtualcontainer.GridLayout',
                            display: i18n.getKey('GridLayout')
                        },
                        {
                            value: 'com.qpp.cgp.domain.pcresource.virtualcontainer.ColumnLayout',
                            display: i18n.getKey('ColumnLayout')
                        },
                        {
                            value: 'com.qpp.cgp.domain.pcresource.virtualcontainer.PanelLayout',
                            display: i18n.getKey('PanelLayout')
                        }
                    ]
                }),
                mapping: {
                    common: ['margin', 'clazz'],
                    'com.qpp.cgp.domain.pcresource.virtualcontainer.GridLayout': [
                        'row', 'column', 'padding'
                    ],
                    'com.qpp.cgp.domain.pcresource.virtualcontainer.ColumnLayout': [
                        'column', 'padding'
                    ],
                    'com.qpp.cgp.domain.pcresource.virtualcontainer.PanelLayout': [
                        'orientation'
                    ]
                },
                listeners: {
                    change: function (combo, newValue, oldValue) {
                        var fieldset = combo.ownerCt;
                        for (var i = 0; i < fieldset.items.items.length; i++) {
                            var item = fieldset.items.items[i];
                            if (Ext.Array.contains(combo.mapping['common'], item.itemId)) {

                            } else {
                                var isContain = Ext.Array.contains(combo.mapping[newValue], item.itemId);
                                item.setVisible(isContain);
                                item.setDisabled(!isContain);
                            }

                        }
                    }
                }
            },
            {
                xtype: 'combo',
                name: 'orientation',
                itemId: 'orientation',
                fieldLabel: i18n.getKey('Orientation'),
                editable: false,
                valueField: 'value',
                displayField: 'display',
                store: Ext.create('Ext.data.Store', {
                    fields: ['display', 'value'],
                    data: [
                        {
                            value: 'Vertical',
                            display: i18n.getKey('Vertical')
                        },
                        {
                            value: 'Horizontal',
                            display: i18n.getKey('Horizontal')
                        },
                    ]
                }),
            },
            {
                xtype: 'numberfield',
                name: 'column',
                itemId: 'column',
                allowDecimals: false,
                minValue: 0,
                hidden: true,
                disabled: true,
                fieldLabel: i18n.getKey('列数'),
            },
            {
                xtype: 'numberfield',
                name: 'row',
                itemId: 'row',
                allowDecimals: false,
                minValue: 0,
                hidden: true,
                disabled: true,
                fieldLabel: i18n.getKey('行数'),
            },
            {
                xtype: 'uxfieldset',
                title: i18n.getKey('margin'),
                name: 'margin',
                itemId: 'margin',
                layout: {
                    type: 'table',
                    columns: 2
                },
                defaults: {
                    flex: 1,
                    labelWidth: 45,
                    value: 0,
                    allowBlank: false,
                    labelAlign: 'right',
                },
                items: [
                    {
                        xtype: 'numberfield',
                        name: 'top',
                        itemId: 'top',
                        fieldLabel: i18n.getKey('up')
                    },
                    {
                        xtype: 'numberfield',
                        name: 'bottom',
                        itemId: 'bottom',
                        fieldLabel: i18n.getKey('down')
                    },
                    {
                        xtype: 'numberfield',
                        name: 'left',
                        itemId: 'left',
                        fieldLabel: i18n.getKey('left')
                    },
                    {
                        xtype: 'numberfield',
                        name: 'right',
                        itemId: 'right',
                        fieldLabel: i18n.getKey('right')
                    },
                ]
            },
            {
                xtype: 'uxfieldset',
                title: i18n.getKey('padding'),
                name: 'padding',
                itemId: 'padding',
                hidden: true,
                disabled: true,
                layout: {
                    type: 'table',
                    columns: 2
                },
                defaults: {
                    flex: 1,
                    labelWidth: 45,
                    value: 0,
                    allowBlank: false,
                    labelAlign: 'right',
                },
                items: [
                    {
                        xtype: 'numberfield',
                        name: 'top',
                        itemId: 'top',
                        fieldLabel: i18n.getKey('up')
                    },
                    {
                        xtype: 'numberfield',
                        name: 'bottom',
                        itemId: 'bottom',
                        fieldLabel: i18n.getKey('down')
                    },
                    {
                        xtype: 'numberfield',
                        name: 'left',
                        itemId: 'left',
                        fieldLabel: i18n.getKey('left')
                    },
                    {
                        xtype: 'numberfield',
                        name: 'right',
                        itemId: 'right',
                        fieldLabel: i18n.getKey('right')
                    },
                ]
            }
        ];
        me.callParent();
    },
    getFieldLabel: function () {
        return this.title;
    },
    getErrors: function () {
        return '该输入项为必输项';
    },
})