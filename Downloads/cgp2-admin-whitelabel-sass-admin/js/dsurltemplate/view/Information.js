Ext.Loader.syncRequire(["CGP.dsurltemplate.model.UrlTemplate","CGP.dsurltemplate.view.variables"]);
Ext.define('CGP.dsurltemplate.view.Information', {
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
        var controller = Ext.create('CGP.dsurltemplate.controller.Controller');
        var requestStore=Ext.create("CGP.dsrequesttemplate.store.RequestTemplate");
        var variablesPanle=Ext.create('CGP.dsurltemplate.view.variables');
//        var variablesPanle=Ext.create('CGP.dsurltemplate.view.variables',{
//            name: 'variables',
//            xtype: 'gridfield',
//
//            fieldLabel: i18n.getKey('variables'),
//            itemId: 'variables',
//            gridConfig: variablesGrid
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
//            {
//                name: 'requestTemplateId',
//                xtype: 'numberfield',
//                fieldLabel: i18n.getKey('requestTemplateId'),
//                itemId: 'requestTemplateId',
//                width: 350,
//                allowBlank: false
//            },
            {
                name: "requestTemplateId",
                id: 'requestTemplateId',
                fieldLabel: i18n.getKey('requestTemplateId'),
                itemId: 'requestTemplateId',
                xtype: 'singlegridcombo',
                displayField: '_id',
                valueField: '_id',
                editable: false,
                listeners: {
                    render: function (comp) {
                        if (!Ext.isEmpty(me.record)) {
                            comp.setSingleValue(me.record.get('RequestTemplate')['_id'])
                        }
                    }
                },
                width: 350,
                store: requestStore,
                matchFieldWidth: false,
                multiSelect: false,
                autoScroll: true,
                gridCfg: {
                    store: requestStore,
                    height: 300,
                    width: 600,
                    autoScroll: true,
                    //hideHeaders : true,
                    columns: [
                        {
                            text: i18n.getKey('id'),
                            width: 80,
                            dataIndex: '_id',
                            renderer: function (value, metaData) {
                                metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                return value;
                            }
                        },
                        {
                            text: i18n.getKey('method'),
                            width: 80,
                            dataIndex: 'method'
                        },
                        {
                            text: i18n.getKey('description'),
                            width: 220,
                            dataIndex: 'description',
                            renderer: function (value, metaData, record, rowIndex) {
                                metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                return value
                            }
                        },
                        {
                            text: i18n.getKey('urlTemplate'),
                            width: 100,
                            dataIndex: 'urlTemplate'
                        },
                        {
                            text: i18n.getKey('bodyTemplate'),
                            width: 100,
                            dataIndex: 'bodyTemplate'
                        }
                    ],
                    tbar: {
                        layout: {
                            type: 'column'
                        },
                        defaults: {
                            width: 170,
                            isLike: false,
                            padding: 2
                        },
                        items: [
                            {
                                xtype: 'numberfield',
                                fieldLabel: i18n.getKey('id'),
                                name: '_id',
                                isLike: false,
                                labelWidth: 40
                            },
                            {
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
                                        },
                                        {
                                            value: '',
                                            typeName: i18n.getKey('allMethod')
                                        }
                                    ]
                                }),
                                value: '',
                                fieldLabel: i18n.getKey('method'),
                                name: 'method',
                                labelWidth: 40
                            },
                            {
                                xtype: 'button',
                                text: i18n.getKey('search'),
                                handler: controller.searchGridCombo,
                                width: 80
                            },
                            {
                                xtype: 'button',
                                text: i18n.getKey('clear'),
                                handler: controller.clearParams,
                                width: 80
                            }
                        ]
                    },
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: requestStore,
                        displayInfo: true, // 是否 ? 示， 分 ? 信息
                        displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                        emptyMsg: i18n.getKey('noData')
                    })
                }
            },
            {
                name: 'template',
                xtype: 'textareafield',
                fieldLabel: i18n.getKey('template'),
                itemId: 'template',
                cols:10,
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
            variablesPanle
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
            if(item.xtype == 'gridfield'){
                data[item.name]=item.getSubmitValue();
            }
            else if (item.xtype == 'singlegridcombo') {
                if(item.getValue()){
                data[item.name]=Object.keys(item.getValue())[0];
                }
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
            } else if (item.xtype == 'singlegridcombo') {
                if(!Ext.isEmpty(data[item.name])&&data[item.name]!=0){
                    item.setSingleValue(data[item.name]);
                }
            }
            else {
                item.setValue(data[item.name]);
            }
        })
    }
});