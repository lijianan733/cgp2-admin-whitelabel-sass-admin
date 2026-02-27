Ext.define('CGP.materialviewtype.view.editV2.VDConfig', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    layout: {
        type: 'table',
        columns: 1
    },
    bodyStyle: 'padding:20px',
    autoScroll: true,
    fieldDefaults: {
        labelAlign: 'right',
        width: 410,
        labelWidth: 150,
        msgTarget: 'side',
        validateOnChange: false,
        plugins: [
            {
                ptype: 'uxvalidation'
            }
        ]
    },

    initComponent: function () {
        var me=this;
        var controller = Ext.create('CGP.materialviewtype.controller.Controller');
        var placeholderStore = Ext.create('Ext.data.Store', {
            fields: [
                {
                    name: 'clazz',
                    type: 'string',
                    defaultValue: 'com.qpp.cgp.domain.bom.qty.PlaceHolderVdCfg'
                },
                {
                    name: 'variableDataSource',
                    type: 'object'
                },
                'expression',
                'description',
                'itemSelector',
                'itemAttributes',
                'variableDataIndexExpression',
                {
                    name: 'pageContentItemPlaceholder',
                    type: 'object'
                }
            ],
            proxy: {
                type: 'memory'
            },
            data: me.placeHolderVdCfgs
        });

        me.localPageContentItemPlaceholderStore = Ext.create('Ext.data.Store', {//部分的placeHolder
            model: 'CGP.materialviewtype.model.PageContentItemPlaceholderModel',
            data: [],
            proxy: {
                type: 'memory'
            }
        });

        me.variableDataSourceStore = Ext.create('Ext.data.Store', {
            model: 'CGP.variabledatasource.model.VariableDataSourceModel',
            data: [],
            proxy: {
                type: 'memory'
            }
        });
        var setVDStore=function (records){
            if (records) {
                var variableDataSourceMap = {};
                for (var i = 0; i < records.length; i++) {
                    var item = records[i].getData();
                    variableDataSourceMap[item.dataSource._id] = item.dataSource;
                }
                var variableDataSourceArr = [];
                for (var i in variableDataSourceMap) {
                    variableDataSourceArr.push(variableDataSourceMap[i]);
                }
                me.allVariableDataSource = Ext.clone(variableDataSourceArr);
                var excludeIds = [];
                var grid = me.getComponent('variableDataSourceQtyCfgs').gridConfig;
                if (grid && grid.store.getCount() > 0) {
                    //过滤掉已经添加的
                    for (var i = 0; i < grid.store.getCount(); i++) {
                        var id = grid.store.getAt(i).get('variableDataSource')._id;
                        excludeIds.push(id);
                    }
                    variableDataSourceArr = variableDataSourceArr.filter(function (item) {
                        if (Ext.Array.contains(excludeIds, item._id)) {
                            return false;
                        } else {
                            return true;
                        }
                    });
                }
                me.variableDataSourceStore.proxy.data = variableDataSourceArr;
                me.variableDataSourceStore.load();
            }
        }
        me.pageContentItemPlaceholderStore = Ext.create('CGP.materialviewtype.store.PageContentItemPlaceholderStore', {
            pageContentSchemaId: me.pageContentSchemaId,
            listeners: {
                load: function (store, records) {
                    var data = [];
                    me.localPageContentItemPlaceholderStore.proxy.data = [];
                    for (var i = 0; i < records.length; i++) {
                        data.push(records[i].getData());
                    }
                    var excludeIds = [];
                    var grid = me.getComponent('placeHolderVdCfgs').gridConfig;
                    if (grid && grid.store.getCount() > 0) {
                        //过滤掉已经添加的
                        for (var i = 0; i < grid.store.getCount(); i++) {
                            var id = grid.store.getAt(i).get('pageContentItemPlaceholder')._id;
                            excludeIds.push(id);
                        }
                        data = data.filter(function (item) {
                            if (Ext.Array.contains(excludeIds, item._id)) {
                                return false;
                            } else {
                                return true;
                            }
                        });
                    }
                    me.localPageContentItemPlaceholderStore.proxy.data = data;
                    me.localPageContentItemPlaceholderStore.load();
                    setVDStore(records);
                }
            }
        });
        var variableDataSourceStore = Ext.create('CGP.variabledatasource.store.VariableDataSourceStore', {});
        var vdQtyStore=Ext.create('Ext.data.Store', {
            fields: [
                {
                    name: 'clazz',
                    type: 'string',
                    defaultValue: 'com.qpp.cgp.domain.bom.qty.VariableDataSourceQtyCfg'
                },
                'variableDataSource',
                'vdQtyCfg',
                'qtyRange',
                'description'
            ],
            proxy: {
                type: 'memory'
            },
            data: me.variableDataSourceQtyCfgs
        });
        me.items=[
            {
                name: 'mainVariableDataSourceId',
                xtype: 'vdcombo',
                editable: false,
                itemId: 'mainVariableDataSourceId',
                fieldLabel: i18n.getKey('mainVariable')+i18n.getKey('DataSource'),
                haveReset:true
            },
            {
                xtype: 'toolbar',
                border: '0',
                margin: 0,
                getName: Ext.emptyFn,
                getValue: Ext.emptyFn,
                setValue: Ext.emptyFn,
                isValid: function () {
                    return true;
                },
                items: [
                    {
                        xtype: 'displayfield',
                        width: 100,
                        value: '<font color="green" style="font-weight: bold" >' + i18n.getKey('VD')+i18n.getKey('Qty')+i18n.getKey('config') + '</font>',
                    }
                ]
            },
            {
                xtype: 'gridfieldwithcrudv2',
                itemId: 'variableDataSourceQtyCfgs',
                name: 'variableDataSourceQtyCfgs',
                fieldLabel: '',
                labelStyle:"padding-left:20px;",
                hideLabel:true,
                minHeight: 100,
                width: 700,
                gridConfig: {
                    // renderTo:JSGetUUID(),
                    store: vdQtyStore,
                    addHandler:function (btn){
                        var grid = btn.ownerCt.ownerCt;
                        me.pageContentItemPlaceholderStore.load();
                        var win = Ext.create('Ext.window.Window', {
                            title: i18n.getKey('select') + i18n.getKey('要替换的variableDataSource'),
                            modal: true,
                            constrain: true,
                            layout: 'vbox',
                            items: [{
                                name: 'variableDataSource',
                                xtype: 'gridcombo',
                                margin: '10 20 10 20',
                                width: 500,
                                itemId: 'variableDataSource',
                                fieldLabel: i18n.getKey('variableDataSource'),
                                multiSelect: false,
                                displayField: '_id',
                                valueField: '_id',
                                allowBlank: false,
                                isComboQuery: true,
                                store: me.variableDataSourceStore,
                                editable: false,
                                labelWidth: 150,
                                matchFieldWidth: false,
                                gridCfg: {
                                    height: 280,
                                    width: 600,
                                    columns: [
                                        {
                                            text: i18n.getKey('id'),
                                            width: 100,
                                            dataIndex: '_id'
                                        },
                                        {
                                            text: i18n.getKey('selector'),
                                            dataIndex: 'selector',
                                            flex: 1
                                        }
                                    ]
                                }
                            }],
                            bbar: [
                                '->',
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('confirm'),
                                    iconCls: 'icon_agree',
                                    handler: function (btn) {
                                        var win = btn.ownerCt.ownerCt;
                                        var variableDataSourceField = win.getComponent('variableDataSource');
                                        if (variableDataSourceField.isValid()) {
                                            var variableDataSource = variableDataSourceField.getValue()[variableDataSourceField.getSubmitValue()[0]];
                                            grid.store.proxy.data.push({
                                                variableDataSource: variableDataSource,
                                                vdQtyCfg: null,
                                                description: '新建VariableDataSourceQtyCfg',
                                                qtyRange: {
                                                    clazz: 'com.qpp.cgp.domain.bom.QuantityRange',
                                                    rangeType: "FIX"
                                                }
                                            });
                                            grid.store.load();
                                            btn.ownerCt.ownerCt.close();
                                        }
                                    }
                                },
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('cancel'),
                                    iconCls: 'icon_cancel',
                                    handler: function (btn) {
                                        btn.ownerCt.ownerCt.close();
                                    }
                                }
                            ]
                        });
                        win.show();
                    },
                    // editHandler:function (view, rowIndex, colIndex, icon, event, record){
                    //     controller.editVariableDataSourceQtyCfg(view,record);
                    // },
                    columns: [
                        {
                            dataIndex: 'description',
                            width: 220,
                            sortable: false,
                            text: i18n.getKey('description'),
                            renderer: function (value, mateData, record) {
                                return '<div style="white-space:normal;word-wrap:break-word; overflow:hidden;">' + value + '</div>'
                            }
                        },
                        {
                            xtype: 'componentcolumn',
                            dataIndex: 'qtyRange',
                            flex: 1,
                            sortable: false,
                            text: i18n.getKey('VD上传')+i18n.getKey('Qty'),
                            renderer: function (value, mateData, record) {
                                return {
                                    xtype: 'displayfield',
                                    value: '<a href="#" id="click-check" style="color: blue">查看</a>',
                                    listeners: {
                                        render: function (display) {
                                            var clickElement = document.getElementById('click-check');
                                            clickElement.addEventListener('click', function () {
                                                controller.checkQty(record?.data);
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    ],
                },
                winConfig: {
                    winTitle: i18n.getKey('edit')+i18n.getKey('variableDataSourceQty'),
                    formConfig: {
                        items: [
                            {
                                xtype: 'textfield',
                                itemId: 'description',
                                name: 'description',
                                allowBlank: false,
                                fieldLabel: i18n.getKey('description')
                            },
                            {
                                xtype: 'uxfieldcontainer',
                                name: 'qtyRange',
                                fieldLabel: i18n.getKey('vd上传元素') + i18n.getKey('qty'),
                                defaults: {
                                    margin: '10 0 10 50',
                                    allowBlank: true,
                                    width: '100%',
                                },
                                items: [
                                    {
                                        fieldLabel: i18n.getKey('value') + i18n.getKey('type'),
                                        xtype: 'combo',
                                        valueField: 'value',
                                        itemId: 'rangeType',
                                        editable: false,
                                        displayField: 'name',
                                        queryMode: 'local',
                                        value: 'FIX',
                                        name: 'rangeType',
                                        store: Ext.create('Ext.data.Store', {
                                            fields: [
                                                'name', 'value'
                                            ],
                                            data: [
                                                {name: '固定值', value: 'FIX'},
                                                {name: '范围值', value: 'RANGE'}
                                            ]
                                        }),
                                        mapping: {
                                            common: ['rangeType', 'clazz'],
                                            FIX: ['vdQtyCfg'],
                                            RANGE: ['minExpression', 'maxExpression']
                                        },
                                        listeners: {
                                            change: function (comp, newValue, oldValue) {
                                                var fieldContainer = comp.ownerCt;
                                                if(!newValue&&Ext.Object.isEmpty(newValue)){
                                                    return false;
                                                }
                                                for (var i = 1; i < fieldContainer.items.items.length; i++) {
                                                    var item = fieldContainer.items.items[i];
                                                    if (Ext.Array.contains(comp.mapping['common'], item.itemId)) {
                                                    } else if (Ext.Array.contains(comp.mapping[newValue], item.itemId)) {
                                                        item.show();
                                                        item.setDisabled(false);
                                                    } else {
                                                        item.hide();
                                                        item.setDisabled(true);
                                                    }
                                                }
                                            }
                                        },
                                    },
                                    {
                                        fieldLabel: i18n.getKey('clazz'),
                                        hidden: true,
                                        itemId: 'clazz',
                                        value: 'com.qpp.cgp.domain.bom.QuantityRange',
                                        xtype: 'textfield',
                                        name: 'clazz'
                                    },
                                    {
                                        fieldLabel: i18n.getKey('minValue') + i18n.getKey('expression'),
                                        xtype: 'textarea',
                                        hidden: true,
                                        disabled: true,
                                        grow: true,
                                        itemId: 'minExpression',
                                        name: 'minExpression'
                                    },
                                    {
                                        fieldLabel: i18n.getKey('maxValue') + i18n.getKey('expression'),
                                        xtype: 'textarea',
                                        hidden: true,
                                        disabled: true,
                                        grow: true,
                                        itemId: 'maxExpression',
                                        name: 'maxExpression'
                                    },
                                    {
                                        name: 'vdQtyCfg',
                                        itemId: 'vdQtyCfg',
                                        xtype: 'valueexfield',
                                        fieldLabel: i18n.getKey('固定值'),
                                        commonPartFieldConfig: {
                                            defaultValueConfig: {
                                                type: 'Number',
                                                typeSetReadOnly: true,
                                            }
                                        },
                                        // listeners: {
                                        //     afterrender:function (comp){
                                        //         // if
                                        //     }
                                        // }
                                    }
                                ]
                            },
                            {
                                xtype: 'textfield',
                                itemId: 'variableDataSource',
                                name: 'variableDataSource',
                                hidden: true,
                                fieldLabel: i18n.getKey('variableDataSource')
                            },
                            {
                                xtype: 'textfield',
                                itemId: 'clazz',
                                name: 'clazz',
                                hidden: true,
                                fieldLabel: i18n.getKey('clazz')
                            }
                        ]
                    }
                }
            },
            {
                xtype: 'toolbar',
                border: '0',
                margin: 0,
                getName: Ext.emptyFn,
                getValue: Ext.emptyFn,
                setValue: Ext.emptyFn,
                isValid: function () {
                    return true;
                },
                items: [
                    {
                        xtype: 'displayfield',
                        width: 100,
                        value: '<font color="green" style="font-weight: bold" >' + i18n.getKey('placeHolderVdCfgs') + '</font>',
                    }
                ]
            },
            {
                xtype: 'gridfieldwithcrudv2',
                itemId: 'placeHolderVdCfgs',
                name: 'placeHolderVdCfgs',
                fieldLabel: '',
                labelStyle:"padding-left:20px;",
                hideLabel:true,
                minHeight: 100,
                width: 700,
                gridConfig: {
                    // renderTo:JSGetUUID(),
                    store: placeholderStore,
                    addHandler:function (btn){
                        var grid = btn.ownerCt.ownerCt;
                        me.pageContentItemPlaceholderStore.load();
                        var win = Ext.create('Ext.window.Window', {
                            title: i18n.getKey('select') + i18n.getKey('要替换的PageContentItemPlaceholder'),
                            modal: true,
                            constrain: true,
                            layout: 'vbox',
                            items: [
                                {
                                name: 'pageContentItemPlaceholder',
                                xtype: 'gridcombo',
                                margin: '10 20 10 20',
                                width: 400,
                                itemId: 'pageContentItemPlaceholder',
                                fieldLabel: i18n.getKey('pageContentItem Placeholder'),
                                multiSelect: false,
                                displayField: '_id',
                                valueField: '_id',
                                allowBlank: false,
                                isComboQuery: true,
                                store: me.localPageContentItemPlaceholderStore,
                                editable: false,
                                matchFieldWidth: false,
                                gridCfg: {
                                    height: 280,
                                    width: 600,
                                    columns: [
                                        {
                                            text: i18n.getKey('id'),
                                            width: 100,
                                            dataIndex: '_id'
                                        },
                                        {
                                            text: i18n.getKey('itemAttributes'),
                                            width: 150,
                                            dataIndex: 'itemAttributes'
                                        },
                                        {
                                            text: i18n.getKey('itemSelector'),
                                            flex: 1,
                                            dataIndex: 'itemSelector'
                                        }
                                    ]
                                }
                            }],
                            bbar: [
                                '->',
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('confirm'),
                                    iconCls: 'icon_agree',
                                    handler: function (btn) {
                                        var win = btn.ownerCt.ownerCt;
                                        var pageContentItemPlaceholder = win.getComponent('pageContentItemPlaceholder');
                                        if (pageContentItemPlaceholder.isValid()) {
                                            var pageContentItemPlaceholderValue = pageContentItemPlaceholder.getValue()[pageContentItemPlaceholder.getSubmitValue()[0]];
                                            var newRecord = grid.store.proxy.data.push({
                                                pageContentItemPlaceholder: pageContentItemPlaceholderValue,
                                                expression: null,
                                                description: '新建placeHolderVdCfg',
                                                itemSelector: pageContentItemPlaceholderValue.itemSelector,
                                                itemAttributes: pageContentItemPlaceholderValue.itemAttributes,
                                                variableDataIndexExpression: null,
                                                variableDataSource: null,
                                            });
                                            grid.store.load();

                                            btn.ownerCt.ownerCt.close();
                                        }
                                    }
                                },
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('cancel'),
                                    iconCls: 'icon_cancel',
                                    handler: function (btn) {
                                        btn.ownerCt.ownerCt.close();
                                    }
                                }
                            ]
                        });
                        win.show();
                    },
                    // editHandler:function (view, rowIndex, colIndex, icon, event, record) {
                    //     var grid = view.ownerCt;
                    //     controller.editPlaceHolderVdCfg(grid,rowIndex,record);
                    // },
                    columns: [
                        {
                            dataIndex: 'description',
                            flex: 1,
                            text: i18n.getKey('description'),
                            renderer: function (value, mateData, record) {
                                return '<div style="white-space:normal;word-wrap:break-word; overflow:hidden;">' + value + '</div>'
                            }
                        },
                        {
                            dataIndex: 'pageContentItemPlaceholder',
                            menuDisabled: true,
                            width: 100,
                            text: i18n.getKey('原placeHolderId'),
                            renderer: function (value, mateData, record) {
                                return value._id;
                            }
                        },
                        {
                            dataIndex: 'itemAttributes',
                            width: 160,
                            text: i18n.getKey('itemAttributes'),
                            renderer: function (value, mateData, record) {
                                return value;
                            }
                        },
                        {
                            dataIndex: 'itemSelector',
                            width: 160,
                            text: i18n.getKey('itemSelector'),
                            renderer: function (value, mateData, record) {
                                return value;
                            }
                        },
                        {
                            xtype: 'componentcolumn',
                            dataIndex: 'expression',
                            width: 60,
                            text: i18n.getKey('expression'),
                            renderer: function (value, mateData, record) {
                                if(record.get('expression')){
                                return {
                                    xtype: 'displayfield',
                                    value: '<a href="#" id="click-checkExp" style="color: blue">查看</a>',
                                    listeners: {
                                        render: function (display) {
                                            var clickElement = document.getElementById('click-checkExp');
                                            clickElement.addEventListener('click', function () {
                                                controller.checkExpression(record);
                                            });
                                        }
                                    }
                                }}
                                else{
                                    return null;
                                }
                            }
                        }
                    ],
                },
                winConfig: {
                    winTitle: i18n.getKey('placeHolder'),
                    formConfig: {
                        saveHandler:function (btn){
                            var form = btn.ownerCt.ownerCt;
                            var win = form.ownerCt;
                            if (form.isValid()) {
                                var data = {};
                                if(win.record){
                                    data=win.record.data;
                                }
                                form.items.items.forEach(function (item) {
                                    if (item.disabled == false) {
                                        //自定义获取值优先级高于普通getValue
                                        if (item.diyGetValue) {
                                            data[item.getName()] = item.diyGetValue();
                                        } else {
                                            data[item.getName()] = item.getValue();
                                        }
                                    }
                                });
                                if (win.createOrEdit == 'create') {
                                    win.outGrid.store.add(data);
                                } else {
                                    for (var i in data) {
                                        win.record.set(i, data[i]);
                                    }
                                }
                                win.close();
                            }
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                itemId: 'description',
                                fieldLabel: i18n.getKey('description'),
                                name: 'description',
                                allowBlank: false
                            },
                            {
                                name: 'pageContentItemPlaceholder',
                                xtype: 'gridcombo',
                                itemId: 'pageContentItemPlaceholder',
                                fieldLabel: i18n.getKey('pageContentItem Placeholder'),
                                multiSelect: false,
                                displayField: '_id',
                                valueField: '_id',
                                allowBlank: false,
                                isComboQuery: true,
                                // haveReset:true,
                                store: me.localPageContentItemPlaceholderStore,
                                editable: false,
                                matchFieldWidth: false,
                                gridCfg: {
                                    height: 280,
                                    width: 600,
                                    columns: [
                                        {
                                            text: i18n.getKey('id'),
                                            width: 100,
                                            dataIndex: '_id'
                                        },
                                        {
                                            text: i18n.getKey('itemAttributes'),
                                            width: 150,
                                            dataIndex: 'itemAttributes'
                                        },
                                        {
                                            text: i18n.getKey('itemSelector'),
                                            flex: 1,
                                            dataIndex: 'itemSelector'
                                        }
                                    ]
                                },
                                diyGetValue:function (){
                                    return this.getValue()[this.getSubmitValue()[0]];
                                },
                                // diySetValue:function (data){
                                //     this.setValue(data[this.getName()]._id);
                                // }
                            },
                            // {
                            //     xtype: 'textfield',
                            //     fieldLabel: i18n.getKey('pageContentItem PlaceHolderId'),
                            //     name: 'pageContentItemPlaceholder',
                            //     itemId: 'pageContentItemPlaceholder',
                            //     allowBlank: false,
                            //     diyGetValue:function (){
                            //         return {
                            //             _id: this.getValue(),
                            //             clazz: 'com.qpp.cgp.domain.bom.PageContentItemPlaceholder'
                            //         };
                            //     },
                            //     diySetValue:function (data){
                            //         this.setValue(data[this.getName()]._id);
                            //     }
                            // },
                            {
                                xtype: 'textfield',
                                itemId: 'itemSelector',
                                fieldLabel: i18n.getKey('itemSelector'),
                                name: 'itemSelector',
                                allowBlank: true,
                                readOnly: true,
                                fieldStyle: 'background-color:silver'
                            },
                            {
                                xtype: 'textfield',
                                itemId: 'itemAttributes',
                                fieldLabel: i18n.getKey('itemAttributes'),
                                name: 'itemAttributes',
                                readOnly: true,
                                fieldStyle: 'background-color:silver',
                                allowBlank: true
                            },
                            {
                                name: 'variableDataSource',
                                xtype: 'gridcombo',
                                itemId: 'dataSourceGridcombo',
                                allowBlank: true,
                                fieldLabel: i18n.getKey('variable DataSource'),
                                displayField: '_id',
                                valueField: '_id',
                                hidden:true,
                                editable: false,
                                haveReset: true,
                                store: variableDataSourceStore,
                                matchFieldWidth: false,
                                gridCfg: {
                                    height: 250,
                                    width: 600,
                                    columns: [
                                        {
                                            text: i18n.getKey('id'),
                                            width: 80,
                                            dataIndex: '_id'
                                        },
                                        {
                                            text: i18n.getKey('selector'),
                                            width: 200,
                                            dataIndex: 'selector',

                                        },
                                        {
                                            text: i18n.getKey('type'),
                                            dataIndex: 'clazz',
                                            flex: 1,
                                            renderer: function (value, metadata, record) {
                                                return value.split('.').pop();
                                            }
                                        }
                                    ],
                                    tbar: [
                                        {
                                            xtype: 'button',
                                            iconCls: 'icon_add',
                                            text: i18n.getKey('add'),
                                            handler: function () {
                                                JSOpen({
                                                    id: 'variableDataSource_edit',
                                                    url: path + "partials/variabledatasource/edit.html",
                                                    title: i18n.getKey('create') + '_' + i18n.getKey('variableDataSource'),
                                                    refresh: true
                                                });
                                            }
                                        }
                                    ],
                                    dockedItems: [
                                        {
                                            xtype: 'pagingtoolbar',
                                            store: variableDataSourceStore,
                                            dock: 'bottom',
                                            displayInfo: true
                                        }
                                    ]
                                }
                            },
                            {
                                xtype: 'expressionfield',
                                name: 'expression',
                                itemId: 'expression',
                                allowBlank: true,
                                fieldLabel: i18n.getKey('expression')
                            },
                            {
                                xtype: 'expressionfield',
                                itemId: 'variableDataIndexExpression',
                                name: 'variableDataIndexExpression',
                                allowBlank: true,
                                fieldLabel: i18n.getKey('variableData IndexExpression')
                            }
                        ]
                    }
                },
            }
        ]
        me.callParent(arguments);
    },
    listeners:{
        afterrender:function (comp){
            if(comp.data?.mainVariableDataSourceId){
                comp.getComponent('mainVariableDataSourceId').setSingleValue(comp.data?.mainVariableDataSourceId);
            }
        }
    }
})