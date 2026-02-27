Ext.Loader.syncRequire(["CGP.materialviewtype.model.Model"]);
Ext.define('CGP.materialviewtype.view.edit.Information', {
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
        var rtObjectTree = Ext.create('CGP.materialviewtype.view.TreeField', {
            fieldLabel: i18n.getKey('predesignObject'),
            name: 'rtObject',
            itemId: 'rtObject'
        });
        var id = JSGetQueryString('id');
        var pageContentSchema = Ext.create('CGP.materialviewtype.store.PageContentSchema');
        me.items = [
            {
                name: '_id',
                itemId: 'id',
                readOnly: true,
                fieldLabel: i18n.getKey('id'),
                xtype: 'textfield',
                hidden: Ext.isEmpty(id),
                fieldStyle: 'background-color:silver',
                width: 350
            },
            {
                name: 'name',
                xtype: 'textfield',
                fieldLabel: 'name',
                itemId: 'name',
                width: 350,
                allowBlank: false
            },
            {
                name: 'sequenceNumber',
                xtype: 'numberfield',
                width: 350,
                minValue: 0,
                itemId: 'sequenceNumber',
                fieldLabel: i18n.getKey('sequenceNumber')
            },
            {
                name: 'userAssign',
                xtype: 'combo',
                width: 350,
                editable: false,
                itemId: 'userAssign',
                queryMode: 'local',
                displayField: 'name',
                valueField: 'value',
                store: Ext.create('Ext.data.Store', {
                    fields: ['name', 'value'],
                    data: [
                        {name: 'PCICOUNT', value: 'PCICOUNT'},
                        {name: 'VDCOUNT', value: 'VDCOUNT'},
                        {
                            name: 'NONE', value: 'NONE'
                        }
                    ]
                }),
                fieldLabel: i18n.getKey('userAssign')
            },
            {
                name: 'isFixedStructure',
                xtype: 'checkbox',
                fieldLabel: i18n.getKey('isFixedStructure'),
                itemId: 'isFixedStructure'
            },
            {
                name: 'templateType',
                xtype: 'combo',
                width: 350,
                editable: false,
                itemId: 'templateType',
                value: 'NONE',
                allowBlank: false,
                queryMode: 'local',
                displayField: 'name',
                valueField: 'value',
                listeners: {
                    change: function (comp, newValue, oldValue) {
                        var dsDataSourceId = comp.ownerCt.getComponent('dsDataSourceId');
                        if (newValue == 'NONE') {
                            dsDataSourceId.setVisible(false);
                            dsDataSourceId.setDisabled(true);
                        } else if (newValue == 'DYNAMIC_SIZE') {
                            dsDataSourceId.setVisible(true);
                            dsDataSourceId.setDisabled(false);
                        }
                    }
                },
                store: Ext.create('Ext.data.Store', {
                    fields: ['name', 'value'],
                    data: [
                        {name: 'DYNAMIC_SIZE', value: 'DYNAMIC_SIZE'},
                        {
                            name: 'NONE', value: 'NONE'
                        }
                    ]
                }),
                fieldLabel: i18n.getKey('templateType')
            },
            {
                name: 'dsDataSourceId',
                xtype: 'textfield',
                itemId: 'dsDataSourceId',
                width: 350,
                disabled: true,
                //hidden: true,
                listeners: {
                    afterrender: function (comp) {
                        comp.setVisible(false);
                    }
                },
                allowBlank: false,
                regex: /\d/,
                regexText: '请输入数字！',
                fieldLabel: i18n.getKey('dsDataSource')
            },
            {
                name: "pageContentSchemaId",
                id: 'pageContentSchemaId',
                fieldLabel: i18n.getKey('pageContent Schema'),
                itemId: 'pageContentSchemaId',
                allowBlank: false,
                xtype: 'singlegridcombo',
                displayField: '_id',
                valueField: '_id',
                editable: false,
                width: 350,
                matchFieldWidth: false,
                multiSelect: false,
                autoScroll: true,
                store: pageContentSchema,
                gridCfg: {
                    store: pageContentSchema,
                    height: 300,
                    width: 400,
                    viewConfig: {
                        enableTextSelection: true
                    },
                    autoScroll: true,
                    columns: [
                        {
                            xtype: 'rownumberer',
                            width: 50
                        },
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
                            text: i18n.getKey('name'),
                            flex: 1,
                            dataIndex: 'name',
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
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('id'),
                                name: '_id',
                                isLike: false,
                                labelWidth: 40
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('name'),
                                name: 'name',
                                labelWidth: 40
                            },
                            '->',
                            {
                                xtype: 'button',
                                text: i18n.getKey('search'),
                                handler: me.searchGridCombo,
                                width: 80
                            },
                            {
                                xtype: 'button',
                                text: i18n.getKey('clear'),
                                handler: me.clearParams,
                                width: 80
                            }
                        ]
                    },
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: pageContentSchema,
                        displayInfo: true, // 是否 ? 示， 分 ? 信息
                        displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                        emptyMsg: i18n.getKey('noData')
                    })
                },
                listeners: {
                    change: function (gridCombo, newValue, oldValue) {
                        var tabPanel = gridCombo.ownerCt.ownerCt;
                        var placeHolderVdCfg = tabPanel.getComponent('PlaceHolderVdCfg');
                        var pageContentSchemaId = gridCombo.getSubmitValue()[0];
                        var variableDataSourceQtyCfg = tabPanel.getComponent('variableDataSourceQtyCfg');
                        var data = gridCombo.getValue()[pageContentSchemaId];
                        tabPanel.remove(placeHolderVdCfg);
                        tabPanel.remove(variableDataSourceQtyCfg);
                        if (data.pageContentItemPlaceholders && data.pageContentItemPlaceholders.length > 0) {
                            placeHolderVdCfg = Ext.create("CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.PlaceHolderVdCfg", {
                                pageContentSchemaId: pageContentSchemaId,
                                placeHolderVdCfgs: tabPanel.data.placeHolderVdCfgs || []
                            });
                            variableDataSourceQtyCfg = Ext.create("CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.VariableDataSourceQtyCfg", {
                                pageContentSchemaId: pageContentSchemaId,
                                variableDataSourceQtyCfgs: tabPanel.data.variableDataSourceQtyCfgs || []
                            });
                            tabPanel.add(placeHolderVdCfg);
                            tabPanel.add(variableDataSourceQtyCfg);
                        } else {

                            delete tabPanel.data.placeHolderVdCfgs;
                            delete tabPanel.data.variableDataSourceQtyCfgs;
                        }
                    }
                }
            },
            {
                name: 'mainVariableDataSourceId',
                xtype: 'textfield',
                itemId: 'mainVariableDataSourceId',
                width: 350,
                regex: /\d/,
                regexText: '请输入数字！',
                fieldLabel: i18n.getKey('mainVariable DataSource')/*,
             name: "mainVariableDataSourceId",
             id: 'mainVariableDataSourceId',
             fieldLabel: i18n.getKey('mainVariable DataSource'),
             itemId: 'mainVariableDataSourceId',
             allowBlank: true,
             xtype: 'singlegridcombo',
             displayField: '_id',
             valueField: '_id',
             editable: false,
             width: 350,
             store: Ext.create('CGP.materialviewtype.store.PageContentSchema'),
             matchFieldWidth: false,
             multiSelect: false,
             autoScroll: true,
             gridCfg: {
             store: Ext.create('CGP.materialviewtype.store.PageContentSchema'),
             height: 300,
             width: 400,
             viewConfig:{
             enableTextSelection:true
             },
             autoScroll: true,
             columns: [
             {
             xtype: 'rownumberer'
             },
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
             text: i18n.getKey('name'),
             width: 200,
             dataIndex: 'name',
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
             xtype: 'textfield',
             fieldLabel: i18n.getKey('id'),
             name: '_id',
             isLike: false,
             labelWidth: 40
             },
             {
             xtype: 'textfield',
             fieldLabel: i18n.getKey('name'),
             name: 'name',
             labelWidth: 40
             },
             '->',
             {
             xtype: 'button',
             text: i18n.getKey('search'),
             handler: me.searchGridCombo,
             width: 80
             },
             {
             xtype: 'button',
             text: i18n.getKey('clear'),
             handler: me.clearParams,
             width: 80
             }
             ]
             },
             bbar: Ext.create('Ext.PagingToolbar', {
             store: Ext.create('CGP.materialviewtype.store.PageContentSchema'),
             displayInfo: true, // 是否 ? 示， 分 ? 信息
             displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
             emptyMsg: i18n.getKey('noData')
             })
             }*/
            },

            /*            {
             name: 'mainVariableDataSourceId',
             xtype: 'combo',
             width: 350,
             itemId: 'mainVariableDataSourceId',
             editable: false,
             //colspan: 2,
             pageSize: 25,
             store: Ext.create('CGP.materialviewtype.store.PageContentSchema'),
             fieldLabel: i18n.getKey('mainVariable DataSource'),
             displayField: 'displayName',
             valueField: '_id'
             },*/
            {
                name: 'config',
                xtype: 'textarea',
                itemId: 'config',
                width: 700,
                fieldLabel: 'config'
            },
            {
                name: 'description',
                xtype: 'textarea',
                width: 700,
                itemId: 'description',
                fieldLabel: 'description'
            }
        ];
        me.callParent(arguments)
    },

    validateForm: function () {
        var me = this;
        if (!me.isValid()) {
            Ext.Msg.alert('WARN', 'Requeied infomation must not be blank!');
            // throw new Error('Requeied infomation must not be blank!');
        }
    },
    searchGridCombo: function () {
        var queries = [];

        var items = this.ownerCt.items.items;

        var store = this.ownerCt.ownerCt.getStore();

        var params = {};

        for (var i = 0; i < items.length; i++) {
            var query = {};
            if (items[i].xtype == 'button')
                continue;
            if (Ext.isEmpty(items[i].value))
                continue;
            query.name = items[i].name;
            if (!Ext.isEmpty(items[i].isLike) && !items[i].isLike) {
                query.value = items[i].getValue();
            } else if (Ext.isEmpty(items[i].isLike) || items[i].isLike) {
                query.value = '%' + items[i].getValue() + '%'
            }
            query.type = 'string';
            queries.push(query);
        }

        if (queries.length > 0) {
            store.proxy.extraParams = {
                filter: Ext.JSON.encode(queries)
            }
        } else {
            store.proxy.extraParams = null;
        }
        store.loadPage(1);
    },
    clearParams: function () {
        var items = this.ownerCt.items.items;
        var store = this.ownerCt.ownerCt.getStore();
        for (var i = 0; i < items.length; i++) {
            if (items[i].xtype == 'button')
                continue;
            if (Ext.isEmpty(items[i].value))
                continue;
            items[i].setValue('');
        }
        store.proxy.extraParams = null;
    },
    getValue: function () {
        var me = this;
        me.validateForm();
        var items = me.items.items;
        var data = {};
        Ext.Array.each(items, function (item) {
            if (item.xtype == 'treefield') {
                data[item.name] = item.getSubmitValue();
                data.designType = data[item.name].designType;
                data.predesignObject = data[item.name].predesignObject;
                delete data[item.name];
            } else if (item.xtype == 'singlegridcombo') {
                data[item.name] = item.getSingleValue();
            } else {
                data[item.name] = item.getValue();
            }
        });
        data.pageContentSchema = {
            _id: data.pageContentSchemaId,
            idReference: 'PageContentSchema',
            clazz: domainObj['PageContentSchema']
        };
        data.mainVariableDataSource = {
            _id: data.mainVariableDataSourceId,
            idReference: 'IVariableDataSource',
            clazz: 'domain.variableData.IVariableDataSource'
        };
        return data;
    },

    refreshData: function (data) {
        var me = this;
        var items = me.items.items;
        console.log('aaa');
        Ext.Array.each(items, function (item) {
            if (item.xtype == 'treefield') {
                item.setSubmitValue(data)
            } else if (item.xtype == 'singlegridcombo') {
                item.setSingleValue(data[item.name]);
            } else {
                item.setValue(data[item.name]);
            }
        })
    },

    copy: function (data) {
        var me = this;
        me.getComponent('id').setValue("");
        data.id = null;
    }

});
