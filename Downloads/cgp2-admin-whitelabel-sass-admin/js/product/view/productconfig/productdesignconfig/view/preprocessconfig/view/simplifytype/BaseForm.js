/**
 * Created by  on 2021/05/27
 *
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.simplifytype.BaseForm', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.simplifybase',
    layout: {
        type: 'vbox',
    },
    defaults: {
        allowBlank: true,
        msgTarget: 'side',
        width: 600,
        labelWidth:120,
        labelAlign:'right',
        margin: '5 0 5 0'
    },

    initComponent: function () {
        var me = this;

        me.items = [
            {
                name: '_id',
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('id'),
                id: 'editId',
                hidden:true
            },
            {
                name: 'description',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('description'),
                itemId: 'description'
            },
            {
                name: 'runWhenInit',
                xtype: 'combo',
                fieldLabel: i18n.getKey('runWhenInit'),
                itemId: 'runWhenInit',
                value: true,
                store: Ext.create('Ext.data.Store', {
                    fields: ['value', 'displayName'],
                    data: [
                        {"value": true, "displayName": i18n.getKey('true') },
                        {"value": false, "displayName": i18n.getKey('false') }
                    ]
                }),
                queryMode: 'local',
                displayField: 'displayName',
                valueField: 'value',
                editable: false,
                allowBlank: false
            },
            {
                name: 'isReversible',
                xtype: 'combo',
                fieldLabel: i18n.getKey('isReversible'),
                itemId: 'isReversible',
                value: false,
                store: Ext.create('Ext.data.Store', {
                    fields: ['value', 'displayName'],
                    data: [
                        {"value": true, "displayName": i18n.getKey('true') },
                        {"value": false, "displayName": i18n.getKey('false') }
                    ]
                }),
                queryMode: 'local',
                displayField: 'displayName',
                valueField: 'value',
                editable: false,
                allowBlank: false
            },
            {
                name: 'leftIsMain',
                xtype: 'combo',
                fieldLabel: i18n.getKey('leftIsMain'),
                itemId: 'leftIsMain',
                hidden: true,
                value: true,
                store: Ext.create('Ext.data.Store', {
                    fields: ['value', 'displayName'],
                    data: [
                        {"value": true, "displayName": i18n.getKey('true') },
                        {"value": false, "displayName": i18n.getKey('false') }
                    ]
                }),
                queryMode: 'local',
                displayField: 'displayName',
                valueField: 'value',
            },
            {
                name: 'materialViewMappingRelations',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('materialViewMappingRelations'),
                itemId: 'materialViewMappingRelations',
                hidden: true,
                value: 'PositiveOrder',
                store: Ext.create('Ext.data.Store', {
                    fields: ['value', 'displayName'],
                    data: [
                        {"value": 'PositiveOrder', "displayName": i18n.getKey('PositiveOrder') },
                        {"value": 'ReverseOrder', "displayName": i18n.getKey('ReverseOrder') }
                    ]
                }),
                queryMode: 'local',
                displayField: 'displayName',
                valueField: 'value',

            }
        ];
        me.callParent();
    },
    getValue: function () {
        var me = this;
        var items = me.items.items, result = {};
        if (me.rendered == true) {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                result[item.name] =item.getValue();
            }
            return result;
        } else {
            return me.rawData;
        }
    },
    setValue: function (data) {
        var me = this, items = me.items.items;
        me.rawData = Ext.clone(data);

        if (me.rendered == true) {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                item.setValue(data[item.name])
            }
        } else {
            me.on('afterrender', function () {
                me.setValue(me.rawData);
            })
        }
    }
})
