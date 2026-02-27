/**
 * Created by shirley on 2021/07/15
 */
Ext.define('CGP.pcspreprocesscommonsource.view.CgpDynamicSizeSourceForm', {
    extend: 'CGP.pcspreprocesscommonsource.view.SubEditForm',
    designId: '',
    defaults: {
        padding: '10 25 5 25',
        width: 375,
        labelAlign: 'left',
        labelWidth: 120
    },
    isValidForItems:true,
    initComponent: function () {
        var me = this;
        me.items = [
            {
                name: 'clazz',
                itemId: 'clazz',
                xtype: 'textfield',
                hidden: true,
                allowBlank: false,
                value: 'com.qpp.cgp.domain.pcspreprocess.source.CgpDynamicSizeSourceConfig'
            },
            {
                name: 'format',
                itemId: 'format',
                xtype: 'combo',
                width:397,
                readOnly: true,
                fieldStyle: 'background-color:silver',
                fieldLabel: i18n.getKey('format'),
                store: Ext.create("Ext.data.Store", {
                    fields: [
                        {name: 'value', type: 'string'}
                    ],
                    data: [
                        {value: 'pdf'},
                        {value: 'svg'}
                    ]
                }),
                valueField: 'value',
                displayField: 'value',
                value: 'pdf',
                editable: true,
                allowBlank: false,
                tipInfo:'format当前只能为pdf'
            },
            {
                name: 'dpi',
                xtype: 'combo',
                itemId: 'dpi',
                fieldLabel:'dpi',
                store: Ext.create("Ext.data.Store", {
                    fields: [
                        {name: 'value', type: 'string'}
                    ],
                    data: [
                        {value: 72},
                        {value: 100},
                        {value: 300}
                    ]
                }),
                valueField: 'value',
                displayField: 'value',
                value: 72,
                editable: true,
                allowBlank: false
            },
            {
                name: 'standardExpression',
                width:397,
                itemId: 'standardExpression',
                xtype: 'valueexfield',
                allowBlank: true,
                fieldLabel: i18n.getKey('standardExpression'),
                commonPartFieldConfig: {
                    defaultValueConfig: {
                        type: 'String',
                        clazz: 'com.qpp.cgp.value.ConstantValue',
                        typeSetReadOnly: true,
                        clazzSetReadOnly: false
                    }
                }
            },
            {
                name: 'standard',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('standard'),
                itemId: 'standard'
            },
            {
                name: 'palettes',
                itemId: 'palettes',
                xtype: 'combo',
                fieldLabel: i18n.getKey('palettes'),
                store: Ext.create("Ext.data.Store", {
                    fields: [
                        {name: 'value', type: 'string'}
                    ],
                    data: [
                        {value: 'Cut'},
                        {value: 'Bleeds'},
                        {value: 'Creas'}
                    ]
                }),
                valueField: 'value',
                displayField: 'value',
                editable: false,
                allowBlank: true,
                multiSelect: true,
                editable: true
            },
            {
                name: 'excludePalettes',
                itemId: 'excludePalettes',
                xtype: 'combo',
                fieldLabel: i18n.getKey('excludePalettes'),
                store: Ext.create("Ext.data.Store", {
                    fields: [
                        {name: 'value', type: 'string'}
                    ],
                    data: [
                        {value: 'Cut'},
                        {value: 'Bleeds'},
                        {value: 'Creas'}
                    ]
                }),
                valueField: 'value',
                displayField: 'value',
                editable: false,
                allowBlank: true,
                multiSelect: true,
                editable: true
            }
        ];
        me.callParent();
    }
})