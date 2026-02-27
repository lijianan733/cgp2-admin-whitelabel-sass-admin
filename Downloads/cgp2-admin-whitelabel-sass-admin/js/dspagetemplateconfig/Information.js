Ext.Loader.syncRequire(["CGP.dspagetemplateconfig.model.Dspagetemplateconfig","CGP.dsdatasource.view.DatasourceCombo"]);
Ext.define('CGP.dspagetemplateconfig.Information', {
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
//        var urlParams = Ext.Object.fromQueryString(location.search);
//        var pagetemplateModel = null;
//        if (urlParams.id != null) {
//            pagetemplateModel = Ext.create("CGP.dspagetemplateconfig.model.Dspagetemplateconfig");
//        }
        var id = JSGetQueryString('id');
        var controller = Ext.create('CGP.dspagetemplateconfig.controller.Controller');
        var dataSourceStore=Ext.create('CGP.dsdatasource.store.DsdataSource');
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
                name: 'pageType',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('pageType'),
                itemId: 'pageType',
                width: 350,
                allowBlank: false
            },
            {
                name: 'dataSourceId',
                xtype: 'datasourcecombo',
                id: 'dataSourceId',
                fieldLabel: i18n.getKey('dataSourceId'),
                itemId: 'dataSourceId',
                displayField: '_id',
                valueField: '_id',
                editable: false,
                width: 350,
                store:dataSourceStore
            },
            {
                name: 'templateFileName',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('templateFileName'),
                itemId: 'templateFileName',
                width: 350,
                allowBlank: false

            },
            {
                name: 'description',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('description'),
                itemId: 'description',
                width: 350
            }
        ];

        me.callParent(arguments);
//        pagetemplateModel.load('', {
//            callback: function (records, operation, success) {
//                if (success == true) {
//                    // 填充数据
//                    me.loadRecord(records);
//                }
//
//            }
//        });
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
            if (item.xtype == 'gridfield') {
                item.setSubmitValue(data)
            }
            else {
                item.setValue(data[item.name]);
            }
        })
    }
});