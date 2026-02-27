Ext.define('CGP.resource.view.compositeDisplayObject.ItemConfig', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    alias: 'widget.itemconfig',
    requires: [],
    fieldDefaults: {
        labelAlign: 'right',
        width: '90%',
        margin: '5'
    },
    initComponent: function () {
        var me=this;
        me.items= [
            {
                name: '_id',
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('id'),
                itemId: '_id',
                hidden: true
            },
            {
                xtype: 'textfield',
                name: 'clazz',
                fieldLabel: i18n.getKey('type'),
                itemId: 'clazz',
                allowBlank: false,
            },
            {
                xtype: 'textfield',
                name: 'clazz',
                fieldLabel: i18n.getKey('type'),
                itemId: 'clazz',
                allowBlank: false,
            },
            {
                name: 'readOnly',
                xtype: 'checkbox',
                fieldLabel: i18n.getKey('readOnly'),
                itemId: 'readOnly',
                allowBlank: false
            },
            {
                xtype: 'textfield',
                fieldLabel: i18n.getKey('description'),
                itemId: 'description',
            },
            {
                name: 'visible',
                xtype: 'combo',
                fieldLabel: i18n.getKey('visible'),
                itemId: 'visible',
                displayField: 'displayName',
                valueField: 'value',
                // editable: false,
                allowBlank: false,
                haveReset: true,
                queryMode: 'local',
                store: Ext.create('Ext.data.Store',{
                    fields: ['value', 'displayName'],
                    data: [
                        {
                            value: true,
                            displayName: i18n.getKey('true')
                        },
                        {
                            value: false,
                            displayName: i18n.getKey('false')
                        }
                    ]
                })
            },
            {
                xtype: 'numberfield',
                name: 'x',
                fieldLabel: i18n.getKey('x'),
                itemId: 'x',
                allowBlank: false,
                minValue: 0,
                allowDecimals: false
            },
            {
                xtype: 'numberfield',
                name: 'y',
                fieldLabel: i18n.getKey('y'),
                itemId: 'y',
                allowBlank: false,
                minValue: 0,
                allowDecimals: false
            },
            {
                xtype: 'numberfield',
                name: 'width',
                fieldLabel: i18n.getKey('width'),
                itemId: 'width',
                allowBlank: false,
                minValue: 0,
                allowDecimals: false
            },
            {
                xtype: 'numberfield',
                name: 'height',
                fieldLabel: i18n.getKey('height'),
                itemId: 'height',
                allowBlank: false,
                minValue: 0,
                allowDecimals: false
            },

        ];
        me.callParent(arguments);
    },

});