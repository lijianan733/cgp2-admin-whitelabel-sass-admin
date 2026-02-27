Ext.define('CGP.materialviewtype.controller.Controller', {
    saveMaterialViewType: function (data, materialviewtype, mask, jsonEdit) {
        var me = this, method = "POST", url;
        /*var data = items[0].getValue();
        var jsonData ;
        if(!Ext.isEmpty(data)) {
            try {
                jsonData = JSON.parse(data);
            } catch(e) {
                Ext.Msg.alert(i18n.getKey('prompt'),i18n.getKey('illlegal json'));
                mask.hide();// error in the above string (in this case, yes)!
                return;
            }
        }*/
        /*var data = {};
        Ext.Array.each(items,function(item){
            if(item.name == 'rtObject' || item.name == 'pcsPlaceholders'){
                data[item.name] = item.getSubmitValue();
                if(item.name == 'rtObject'){
                    data.designType = data[item.name].designType;
                    data.predesignObject = data[item.name].predesignObject;
                    delete data[item.name];
                }
            }else{
                data[item.name] = item.getValue();
            }
        });*/
        if (!jsonEdit) {
            data.pageContentSchema = {
                _id: data.pageContentSchemaId,
                idReference: 'PageContentSchema',
                clazz: domainObj['PageContentSchema']
            };
            if (!Ext.isEmpty(data.dsDataSourceId)) {
                data.dsDataSource = {
                    _id: data.dsDataSourceId,
                    idReference: 'DsDataSource',
                    clazz: domainObj['DsDataSource']
                };
            }
            if (data.templateType == 'NONE' || Ext.isEmpty(data.templateType)) {
                delete data.dsDataSourceId;
                delete data.dsDataSource;
            }

            data.mainVariableDataSource = {
                _id: data.mainVariableDataSourceId,
                idReference: 'IVariableDataSource',
                clazz: 'com.qpp.cgp.domain.bom.datasource.LocalDataSource'
            };
        }
        data.clazz = 'com.qpp.cgp.domain.bom.MaterialViewType';
        var jsonData = data;
        /*if(!Ext.isEmpty(data)) {
            try {
                var jsonData = JSON.parse(data);
            } catch(e) {
                Ext.Msg.alert(i18n.getKey('prompt'),i18n.getKey('illlegal json'));
                mask.hide();// error in the above string (in this case, yes)!
                return;
            }
        }*/
//		object.promotionId = 1;
        url = adminPath + 'api/materialViewTypes';
        if (materialviewtype != null &&
            materialviewtype.modelName == "CGP.materialviewtype.model.Model"
            && materialviewtype.getId() != null) {

            jsonData._id = materialviewtype.get("_id");
            method = "PUT";
            url = url + "/" + jsonData._id;
        }

        Ext.Ajax.request({
            url: url,
            method: method,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: jsonData,
            success: function (response, options) {
                var resp = Ext.JSON.decode(response.responseText);
                if (resp.success) {
                    mask.hide();
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveSuccess'), function () {
                        var id = resp.data._id;
                        var htmlUrl = path + "partials/materialviewtype/edit.html?id=" + id;
                        JSOpen({
                            id: "materialviewtype_edit",
                            url: htmlUrl,
                            title: i18n.getKey('edit') + "_" + i18n.getKey('materialViewType'),
                            refresh: true
                        });
                    });
                } else {
                    mask.hide();
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + resp.data.message)
                }
            },
            failure: function (response, options) {
                var object = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + object.data.message);
            },
            callback: function () {
                mask.hide();
            }
        });
    },
    editPcsPlaceholder: function (editOrNew, store, record) {
        Ext.create('CGP.materialviewtype.view.EditPcsPlaceholder', {
            editOrNew: editOrNew,
            store: store,
            record: record
        }).show();
    },
    editVariableDataSourceQtyCfg: function (grid, record) {
        var wind = Ext.create("Ext.window.Window", {
            title: i18n.getKey('ValueEdit'),
            modal: true,
            layout: 'fit',
            items: [
                Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.ModifyVariableDataSourceQtyCfgForm', {
                    editOrNew: 'edit',
                    itemId: 'editVDQty',
                    listeners: {
                        afterrender: function (comp) {
                            comp.setValue(record.data);
                        }
                    }
                })
            ],
            bbar: [
                '->',
                {
                    xtype: 'button',
                    iconCls: 'icon_save',
                    text: i18n.getKey('confirm'),
                    handler: function (btn) {
                        var form = btn.ownerCt.ownerCt.getComponent('editVDQty');
                        if (form.isValid()) {
                            var data = {};
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
                            for (var i in data) {
                                record.set(i, data[i]);
                            }
                            wind.close();
                        }
                    }
                },
                {
                    xtype: 'button',
                    iconCls: 'icon_cancel',
                    text: i18n.getKey('cancel'),
                    handler: function (btn) {
                        var form = btn.ownerCt.ownerCt;
                        var win = form.ownerCt;
                        win.close();

                    }
                }
            ]
        });
        wind.show();
    },
    editPlaceHolderVdCfg: function (grid, index,) {
        Ext.create('Ext.window.Window', {
                title: Ext.isEmpty(record) ? i18n.getKey('add') : i18n.getKey('edit') + i18n.getKey('tag'),
                layout: 'fit',
                modal: true,
                items: [
                    {
                        xtype: 'errorstrickform',
                        itemId: 'form',
                        isValidForItems: true,
                        defaults: {
                            padding: '10 25 5 25',
                            width: 350,
                            allowBlank: false,
                            readOnly: me.readOnly,
                        },
                        overflowX: 'hidden',
                        overflowY: 'auto',
                        items: [
                            {
                                xtype: 'textfield',
                                readOnly: true,
                                itemId: 'pageContentItemPlaceholder',
                                fieldStyle: 'background-color:silver',
                                fieldLabel: i18n.getKey('pageContentItem PlaceHolderId'),
                                name: 'pageContentItemPlaceholder',
                                hidden: true
                            },
                            {
                                xtype: 'textfield',
                                readOnly: true,
                                itemId: 'itemSelector',
                                fieldLabel: i18n.getKey('itemSelector'),
                                fieldStyle: 'background-color:silver',
                                name: 'itemSelector'
                            },
                            {
                                xtype: 'textfield',
                                readOnly: true,
                                itemId: 'itemAttributes',
                                fieldLabel: i18n.getKey('itemAttributes'),
                                fieldStyle: 'background-color:silver',
                                name: 'itemAttributes',

                            },
                            {
                                xtype: 'textfield',
                                itemId: 'description',
                                allowBlank: false,
                                fieldLabel: i18n.getKey('description'),
                                name: 'description'
                            },
                            {
                                name: 'variableDataSource',
                                xtype: 'gridcombo',
                                itemId: 'dataSourceGridcombo',
                                allowBlank: true,
                                fieldLabel: i18n.getKey('variable DataSource'),
                                displayField: '_id',
                                valueField: '_id',
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
                        ],
                        listeners: {
                            afterrender: function (comp) {
                                if (!Ext.isEmpty(comp.data)) {
                                    comp.setValue(comp.data);
                                }
                            }
                        },
                    }
                ],
                bbar: [
                    '->',
                    {
                        xtype: 'button',
                        text: i18n.getKey('confirm'),
                        handler: function (btn) {
                            var win = btn.ownerCt.ownerCt;
                            var form = win.down('form');
                            if (!form.isValid()) {
                                return false;
                            }
                            var data = form.getValue();
                            if (index == undefined) {//Gridfield操作本地data
                                if (Ext.isEmpty(grid.store.proxy.data)) {
                                    grid.store.proxy.data = [];
                                }
                                grid.store.proxy.data.push(data);
                                index = grid.store.proxy.data.length - 1;
                            } else {
                                Ext.Array.splice(grid.store.proxy.data, index, 1, data);
                            }
                            grid.store.load();
                        }
                    },
                    {
                        xtype: 'button',
                        text: i18n.getKey('cancel'),
                        handler: function () {
                            this.ownerCt.ownerCt.close();
                        }
                    }
                ]
            }
        ).show();
    },

    checkQty: function (recData) {
        Ext.create('Ext.window.Window', {
                title: i18n.getKey('check') + i18n.getKey('VD') + i18n.getKey('Qty'),
                layout: 'fit',
                modal: true,
                items: [
                    {
                        xtype: 'errorstrickform',
                        itemId: 'form',
                        isValidForItems: true,
                        defaults: {
                            padding: '10 25 5 25',
                            width: 350
                        },
                        overflowX: 'hidden',
                        overflowY: 'auto',
                        data: recData,
                        items: [
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
                                        readOnly: true,
                                        commonPartFieldConfig: {
                                            defaultValueConfig: {
                                                type: 'Number',
                                                typeSetReadOnly: true,
                                            }
                                        }
                                    }
                                ]
                            }
                        ],
                        listeners: {
                            afterrender: function (comp) {
                                if (!Ext.isEmpty(comp.data)) {
                                    comp.setValue(comp.data);
                                }
                            }
                        }
                    }
                ]
            }
        ).show();
    },
    checkExpression: function (rec) {
        var win = Ext.create('CGP.common.valueExV3.view.SetExpressionValueWindow', {
            expressionValueStore: Ext.create('Ext.data.Store', {
                autoSync: true,
                fields: [
                    {name: 'clazz', type: 'string'},
                    {name: 'expression', type: 'string'},
                    {name: 'expressionEngine', type: 'string', defaultValue: 'JavaScript'},
                    {name: 'inputs', type: 'array'},
                    {name: 'resultType', type: 'string'},
                    {name: 'promptTemplate', type: 'string'},
                    {name: 'min', type: 'object', defaultValue: undefined},
                    {name: 'max', type: 'object', defaultValue: undefined},
                    {name: 'regexTemplate', type: 'string', defaultValue: undefined}
                ],
                data: rec.get('expression')
            }),//记录expressionValue的store
            readOnly: true,
            defaultClazz: 'com.qpp.cgp.expression.Expression',

        });
        win.show();
    }
})
;
