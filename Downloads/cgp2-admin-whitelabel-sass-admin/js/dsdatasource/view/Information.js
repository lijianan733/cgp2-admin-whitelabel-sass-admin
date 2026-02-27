Ext.Loader.syncRequire(["CGP.dsdatasource.model.DsdataSource"]);
Ext.define('CGP.dsdatasource.view.Information', {
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
        var controller = Ext.create('CGP.dsdatasource.controller.Controller');

        var selectField = Ext.create("CGP.dsdatasource.view.selectors");

//        var selectField=Ext.create("Ext.ux.form.GridField", {
//            name: 'selectors',
//            xtype: 'gridfield',
//            gridConfig: selectGrid,
//            fieldLabel: i18n.getKey('selectors'),
//            itemId: 'selectors'
//        });
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
                name: 'type',
                xtype: 'combobox',
                editable: false,
                displayField: 'typeName',
                valueField: 'value',
                store:new Ext.data.Store({
                    fields: ['value','typeName'],
                    data: [
                        {
                            value: 'ImpactSvg',
                            typeName: 'ImpactSvg'
                        },
                        {
                            value: 'ImpactPdf',
                            typeName: 'ImpactPdf'
                        }
                    ]
                }),
                fieldLabel: i18n.getKey('type'),
                itemId: 'type',
                width: 350,
                allowBlank: false
            },
            {
                name: 'version',
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('version'),
                itemId: 'version',
                width: 350
            },
            {
                name: 'description',
                xtype: 'textareafield',
                fieldLabel: i18n.getKey('description'),
                itemId: 'description',
                cols:10,
                width: 350
            },
            selectField
        ];

        me.callParent(arguments);
//        me.listeners = {
//            "render": function (me) {
//                var selctGrid = Ext.create("CGP.dsdatasource.view.selectors");
//                me.form.add(selctGrid);
//            }
//        };
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
            if(item.xtype == 'gridfield'){
                data[item.name]=item.getSubmitValue();
            }
            else{
                data[item.name] = item.getValue();
            }

        });

        return data;
    },

    refreshData: function (data) {
        var me = this;
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            if (item.xtype == 'gridfield') {
                item.setSubmitValue(data[item.name])
            }
            else {
                item.setValue(data[item.name]);
            }
        })
    }
});