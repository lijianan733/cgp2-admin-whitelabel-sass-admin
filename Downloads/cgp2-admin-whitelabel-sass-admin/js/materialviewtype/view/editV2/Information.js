Ext.Loader.syncRequire(["CGP.materialviewtype.model.Model",
    "CGP.materialviewtype.model.PageContentItemPlaceholderModel",
    "CGP.variabledatasource.model.VariableDataSourceModel",
    "CGP.variabledatasource.view.VariableDataSourceCombo"
]);
Ext.define('CGP.materialviewtype.view.editV2.Information', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    layout: {
        type: 'table',
        columns: 1
    },
    itemId: 'information',
    bodyStyle: 'padding:10px',
    autoScroll: true,
    fieldDefaults: {
        labelAlign: 'right',
        width: 400,
        labelWidth: 140,
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
                fieldLabel: i18n.getKey('name'),
                itemId: 'name',
                width: 350,
                allowBlank: false
            },
            {
                name: "pageContentSchemaId",
                xtype: 'singlegridcombo',
                id: 'pageContentSchemaId',
                fieldLabel: i18n.getKey('pageContentSchema'),
                itemId: 'pageContentSchemaId',
                allowBlank: false,
                displayField: '_id',
                valueField: '_id',
                editable: false,
                haveReset:true,
                matchFieldWidth: false,
                multiSelect: false,
                autoScroll: true,
                width: 350,
                store: pageContentSchema,
                gridCfg: {
                    store: pageContentSchema,
                    height: 300,
                    width: 550,
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
                            dataIndex: '_id',
                            menuDisabled:true,
                            width: 80,
                            renderer: function (value, metaData) {
                                metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                return value;
                            }
                        },
                        {
                            text: i18n.getKey('name'),
                            dataIndex: 'name',
                            menuDisabled:true,
                            flex: 1,
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
                        var vdConfig = tabPanel.getComponent('VDConfig');
                        var pageContentSchemaId = gridCombo.getSubmitValue()[0];
                        var data = gridCombo.getValue()[pageContentSchemaId];
                        tabPanel.remove(vdConfig);
                        if (data?.pageContentItemPlaceholders?.length > 0) {
                            tabPanel.add(Ext.create('CGP.materialviewtype.view.editV2.VDConfig',
                                {
                                    itemId: 'VDConfig',
                                    title: i18n.getKey('VD') + i18n.getKey('config'),
                                    pageContentSchemaId:pageContentSchemaId,
                                    placeHolderVdCfgs: tabPanel.data.placeHolderVdCfgs || [],
                                    variableDataSourceQtyCfgs: tabPanel.data.variableDataSourceQtyCfgs || [],
                                    data:me.ownerCt.data
                                })
                            );
                        } else {
                            delete tabPanel.data.placeHolderVdCfgs;
                            delete tabPanel.data.variableDataSourceQtyCfgs;
                        }
                    }
                }
            },
            {
                xtype: 'radiogroup',
                fieldLabel: i18n.getKey('templateType'),
                name: 'templateType',
                columns: 2,
                items: [
                    {boxLabel: 'DYNAMIC_SIZE', name: 'templateType', inputValue: 'DYNAMIC_SIZE'},
                    {boxLabel: 'NONE', name: 'templateType', inputValue: 'NONE', checked: true}
                ],
                listeners: {
                    change: function (comp, newValue, oldValue) {
                        var tabPanel = comp.ownerCt.ownerCt;
                        tabPanel.remove('dsForm');
                        if (newValue.templateType == 'DYNAMIC_SIZE') {
                            var EditTab = tabPanel.add(
                                Ext.create('CGP.materialviewtype.view.editV2.DSConfig', {
                                    id: 'dsForm',
                                    title: i18n.getKey('DS') + i18n.getKey('config'),
                                    data:me.ownerCt.data
                                    // closable: true
                                })
                            );
                            if(!id){
                                tabPanel.setActiveTab(EditTab);
                            }

                        }
                    }
                }
            },
            // {
            //     name: 'config',
            //     xtype: 'textarea',
            //     itemId: 'config',
            //     width: 700,
            //     fieldLabel: 'config'
            // },
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
    // getValue: function () {
    //     var me = this;
    //     me.validateForm();
    //     var items = me.items.items;
    //     var data = {};
    //     Ext.Array.each(items, function (item) {
    //         if (item.xtype == 'treefield') {
    //             data[item.name] = item.getSubmitValue();
    //             data.designType = data[item.name].designType;
    //             data.predesignObject = data[item.name].predesignObject;
    //             delete data[item.name];
    //         } else if (item.xtype == 'singlegridcombo') {
    //             data[item.name] = item.getSingleValue();
    //         } else {
    //             data[item.name] = item.getValue();
    //         }
    //     });
    //     data.pageContentSchema = {
    //         _id: data.pageContentSchemaId,
    //         idReference: 'PageContentSchema',
    //         clazz: domainObj['PageContentSchema']
    //     };
    //     data.mainVariableDataSource = {
    //         _id: data.mainVariableDataSourceId,
    //         idReference: 'IVariableDataSource',
    //         clazz: 'domain.variableData.IVariableDataSource'
    //     };
    //     return data;
    // },
    //
    // refreshData: function (data) {
    //     var me = this;
    //     var items = me.items.items;
    //     console.log('aaa');
    //     Ext.Array.each(items, function (item) {
    //         if (item.xtype == 'treefield') {
    //             item.setSubmitValue(data)
    //         } else if (item.xtype == 'singlegridcombo') {
    //             item.setSingleValue(data[item.name]);
    //         } else {
    //             item.setValue(data[item.name]);
    //         }
    //     })
    // },

    copy: function (data) {
        var me = this;
        me.getComponent('id').setValue("");
        data.id = null;
    }

});
