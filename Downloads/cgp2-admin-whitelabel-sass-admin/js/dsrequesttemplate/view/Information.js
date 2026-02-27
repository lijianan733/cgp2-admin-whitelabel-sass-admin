Ext.Loader.syncRequire(["CGP.dsrequesttemplate.model.RequestTemplate"]);
Ext.define('CGP.dsrequesttemplate.view.Information', {
    extend: 'Ext.form.Panel',
    layout: {
        type: 'table',
        columns: 1
    },
    itemId: 'information',
    bodyStyle: 'padding:10px',
    autoScroll: true,
    fieldDefaults: {
        labelAlign: 'right',
        width: 380,
        labelWidth: 120,
        msgTarget: 'side',
        validateOnChange: false,
        plugins: [
            {
                ptype: 'uxvalidation'
            }
        ]
    },

    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('information');

        var id = JSGetQueryString('id');
        var controller = Ext.create('CGP.dsrequesttemplate.controller.Controller');

        me.items = [
            {
                name: '_id',
                itemId: 'id',
                readOnly: true,
                fieldLabel: i18n.getKey('id'),
                xtype: 'numberfield',
                hidden: Ext.isEmpty(id),
                fieldStyle: 'background-color:silver',
                width: 350
            },
            {
                name: 'method',
                xtype: 'combobox',
                editable: false,
                displayField: 'typeName',
                valueField: 'value',
                store:new Ext.data.Store({
                    fields: ['value','typeName'],
                    data: [
                        {
                            value: 'POST',
                            typeName: 'POST'
                        },
                        {
                            value: 'GET',
                            typeName: 'GET'
                        }
                    ]
                }),
                fieldLabel: i18n.getKey('method'),
                itemId: 'method',
                width: 350,
                allowBlank: false
            },
            {
                name: 'urlTemplate',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('urlTemplate'),
                itemId: 'urlTemplate',
                width: 350,
                allowBlank: false
            },
            {
                name: 'bodyTemplate',
                xtype: 'textareafield',
                fieldLabel: i18n.getKey('bodyTemplate'),
                itemId: 'bodyTemplate',
                width: 500,
                cols:10,
                allowBlank: false
            },
            {
                name: 'description',
                xtype: 'textareafield',
                fieldLabel: i18n.getKey('description'),
                itemId: 'description',
                cols:10,
                width: 500
            }

            //selectorsPanle
        ];

        me.callParent(arguments);

    },
    validateForm: function () {
        var me = this;
        if (!me.isValid()) {
            Ext.Msg.alert('WARN', 'Requeied infomation must not be blank!');

            // throw new Error('Requeied infomation must not be blank!');
        }
    },
    getValue: function () {
        var me = this;
        me.validateForm();
        var items = me.items.items;
        var data = {};
        Ext.Array.each(items, function (item) {
            data[item.name] = item.getValue();
        });

        return data;
    },

    refreshData: function (data) {
        var me = this;
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            if (item.xtype == 'selectoredit') {
                item.setSelectorValue(data[item.name],item)
            } else if (item.xtype == 'singlegridcombo') {
                item.setSingleValue(data[item.name]);
            }
            else {
                item.setValue(data[item.name]);
            }
        })
    }
});