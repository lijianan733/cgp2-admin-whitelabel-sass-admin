Ext.Loader.syncRequire(["CGP.dssheettemplateconfig.model.SheetTemplateConfig"]);
Ext.define('CGP.dssheettemplateconfig.view.Information', {
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
        var controller = Ext.create('CGP.dssheettemplateconfig.controller.Controller');
        var dataSourceStore=Ext.create('CGP.dsdatasource.store.DsdataSource');
        var placeholders=Ext.create('CGP.dssheettemplateconfig.view.placeholders');
        var impPlaceholders=Ext.create('CGP.dssheettemplateconfig.view.impplaceholders');
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
                name: 'productType',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('productType'),
                itemId: 'productType',
                hideMode:'offsets',
                width: 350,
                allowBlank: false
            },
            {
                name: 'sheetType',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('sheetType'),
                itemId: 'sheetType',
                width: 350,
                allowBlank: false
            },
            {
                name: 'index',
                xtype: 'numberfield',
                fieldLabel: i18n.getKey('index'),
                itemId: 'index',
                width: 350,
                allowBlank: false
            },
//            {
//                name: 'dataSourceId',
//                xtype: 'numberfield',
//                fieldLabel: i18n.getKey('dataSourceId'),
//                itemId: 'dataSourceId',
//                width: 350
//            },
            {
                name: "dataSourceId",
                id: 'dataSourceId',
                fieldLabel: i18n.getKey('dataSourceId'),
                itemId: 'dataSourceId',
                xtype: 'singlegridcombo',
                displayField: '_id',
                valueField: '_id',
                editable: false,
                listeners: {
                    render: function (comp) {
                        if (!Ext.isEmpty(me.record)) {
                            comp.setSingleValue(me.record.get('DsdataSource')['_id'])
                        }
                    }
                },
                width: 350,
                store: dataSourceStore,
                matchFieldWidth: false,
                multiSelect: false,
                autoScroll: true,
                gridCfg: {
                    store: dataSourceStore,
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
                            text: i18n.getKey('type'),
                            width: 180,
                            dataIndex: 'type'
                        },
                        {
                            text: i18n.getKey('version'),
                            width: 100,
                            dataIndex: 'version'
                        },
                        {
                            text: i18n.getKey('description'),
                            width: 220,
                            dataIndex: 'description',
                            renderer: function (value, metaData, record, rowIndex) {
                                metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                return value
                            }
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
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('type'),
                                name: 'type',
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
                        store: dataSourceStore,
                        displayInfo: true, // 是否 ? 示， 分 ? 信息
                        displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                        emptyMsg: i18n.getKey('noData')
                    })
                }
            },

            {
                name: 'strategy',
                xtype: 'combobox',
                displayField: 'strategy',
                valueField: 'strategy',
                store:new Ext.data.Store({
                    fields: ['strategy'],
                    data: [
                        {
                            strategy: 'manyToOne'
                        },
                        {
                            strategy: 'fromFileService'
                        }
                    ]
                }),
                fieldLabel: i18n.getKey('strategy'),
                itemId: 'strategy',

                width: 350,
                allowBlank: false
            },
            {
                name: 'fileNameSuffix',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('fileNameSuffix'),
                itemId: 'fileNameSuffix',
                width: 350,
                allowBlank: false
            },
            {
                name: 'textTemplateFileName',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('textTemplateFileName'),
                itemId: 'textTemplateFileName',
                width: 350
            },
            {
                name: 'condition',
                xtype: 'textareafield',
                fieldLabel: i18n.getKey('condition'),
                itemId: 'condition',
                cols:5,
                width: 1025,
                allowBlank: false
            },
            impPlaceholders,
            placeholders,
            {
                name: 'description',
                xtype: 'textareafield',
                fieldLabel: i18n.getKey('description'),
                itemId: 'description',
                cols:10,
                width: 1025
            }
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
                data[item.name]=me.getGridValue(item);
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
    getGridValue:function(item){
        var me = item;
        var value = [];
        me._grid.getStore().each(function (record) {
            if (me.valueType == "id") {
                value.push(record.get("id"));
            } else {
                //
                if(record.data.attributes&&!Ext.isArray(record.data.attributes)){
                    record.data.attributes=record.data.attributes.split(",");
                }
                value.push(record.data);
            }
        });

        return value;
    },
    refreshData: function (data) {
        var me = this;
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            if (item.xtype == 'gridfield') {
                item.setSubmitValue(data[item.name])
            }
            else if (item.xtype == 'singlegridcombo') {
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