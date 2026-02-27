Ext.define('CGP.virtualcontainerobject.view.Edit', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    alias: 'widget.vcoedit',
    isValidForItems: true,
    bodyStyle: "overflow-x:hidden;overflow-y:auto;",
    fieldDefaults: {
        labelAlign: 'left',
    },
    initComponent: function () {
        var me = this;
        me.vcoId = JSGetQueryString('id');

        me.tbar = [
            {
                itemId: 'btnSave',
                text: i18n.getKey('save'),
                iconCls: 'icon_save',
            },
            {
                xtype: 'button',
                itemId: "copy",
                text: i18n.getKey('copy'),
                iconCls: 'icon_copy',
                disabled: me.vcoId == null,

            }
        ];

        me.items = [
            // {
            //     name: '_id',
            //     xtype: 'numberfield',
            //     fieldLabel: i18n.getKey('id'),
            //     itemId: '_id',
            //     hidden: true
            // },
            {
                name: 'clazz',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('clazz'),
                itemId: 'clazz',
                hidden: true,
                value: 'com.qpp.cgp.domain.pcresource.virtualcontainer.VirtualContainerObject',
                margin: '5 20',
            },
            {
                name: 'description',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('description'),
                itemId: 'description',
                width: 380,
                allowBlank: false,
                margin: '5 20'
            },
            {
                name: 'containerType',
                xtype: 'gridcombo',
                fieldLabel: i18n.getKey('containerType'),
                itemId: 'containerType',
                displayField: 'displayName',
                valueField: '_id',
                width: 380,
                margin: '5 20',
                editable: false,
                readOnly: true,
                fieldStyle: 'background-color:silver',
                store: Ext.create('CGP.virtualcontainertype.store.VirtualContainerTypeStore', {
                    storeId: 'vctStore',
                }),
                matchFieldWidth: false,
                multiSelect: false,
                autoScroll: true,
                gridCfg: {
                    store: Ext.data.StoreManager.lookup('vctStore'),
                    height: 300,
                    width: 600,
                    autoScroll: true,
                    //hideHeaders : true,
                    columns: [
                        {
                            text: i18n.getKey('id'),
                            width: 100,
                            dataIndex: '_id',
                            renderer: function (value, metaData) {
                                metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                return value;
                            }
                        },
                        {
                            text: i18n.getKey('description'),
                            flex: 1,
                            dataIndex: 'description'
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
                                fieldLabel: i18n.getKey('_id'),
                                name: 'id',
                                isLike: false,
                                labelWidth: 40
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('description'),
                                name: 'description',
                                labelWidth: 40
                            },
                            {
                                xtype: 'button',
                                text: i18n.getKey('search'),
                                width: 80,
                                handler: function () {
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
                            },
                            {
                                xtype: 'button',
                                text: i18n.getKey('clear'),
                                handler: function () {
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
                                width: 80
                            }
                        ]
                    },
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: Ext.data.StoreManager.lookup('vctStore'),
                        displayInfo: true, // 是否 ? 示， 分 ? 信息
                        displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                        emptyMsg: i18n.getKey('noData')
                    })
                },
                listeners: {
                    afterrender: function (comp) {
                        var vctId = JSGetQueryString('vctId');
                        if (vctId) {
                            comp.setInitialValue([vctId]);
                        }
                    },
                    change: function (comp) {
                        var value0 = Ext.Object.getValues(comp.getValue())[0];
                        var vcc = value0?.virtualContainerContents;
                        var addRepeats = comp.ownerCt.query('toolbar [itemId="addRepeat"]');
                        var leftTrees = Ext.ComponentQuery.query('[itemId="argument"] [itemId="leftTree"]');
                        // if (vcc && vcc.length > 0) {
                        var vcoItem = comp.ownerCt.getComponent('contentMapItems');
                        var contentMapEdit = vcoItem.getComponent('contentMapEdit');
                        var contentMapGrid = vcoItem.getComponent('contentMapGrid');
                        var layoutSet = comp.ownerCt.getComponent('layoutSet');
                        if (vcc.length == 1 && value0.compile?.name == 'repeat') {//repeat 处理逻辑
                            me.setRepeatComp(true);
                            if (value0.layout) {
                                layoutSet.setValue(value0.layout);
                            }
                            vcc[0].name = 'repeat';
                            if (Ext.isEmpty(me.vcoId)) {
                                contentMapEdit.setValue(vcc);
                            }
                            leftTrees.forEach(function (item) {
                                item.currRtType = value0?.argumentType?._id;
                                item.rtTypeId = -1;
                                item.isRepeat=true;
                                if (Ext.isEmpty(me.data)) {
                                    item.store.load();
                                }
                                else if (item.ownerCt.itemId == 'builderArgument') {
                                    if (me.data?.argumentBuilder) {
                                        item.setValue(me.data?.argumentBuilder.map);
                                    }
                                }
                            });
                        } else {//固定item处理逻辑
                            me.setRepeatComp(false);
                            var store = contentMapGrid.getStore();
                            var data = [];
                            data = vcc.map(function (item) {
                                return {
                                    _id: JSGetCommonKey(),
                                    clazz: 'com.qpp.cgp.domain.pcresource.virtualcontainer.ContentMapItem',
                                    name: item['name'],
                                    required: item['required'],
                                    replace: item['replace']
                                };
                            });
                            if (Ext.isEmpty(me.vcoId)) {
                                store.loadData(data);
                                store.filter([{property: "required", value: true}]);
                            }
                            contentMapGrid.rawvctItems = data;
                            contentMapGrid.setItemAdd();
                            leftTrees.forEach(function (item) {
                                item.currRtType = value0?.argumentType?._id;
                                item.rtTypeId = value0?.argumentType?._id;
                                item.getRootNode().removeAll();
                                item.store.proxy.url = adminPath + 'api/rtTypes/' + item.rtTypeId + '/rtAttributeDefs';
                                if (Ext.isEmpty(me.data)) {
                                    item.store.load();
                                } else if (item.ownerCt.itemId == 'builderArgument') {
                                    if (me.data?.argumentBuilder) {
                                        item.setValue(me.data?.argumentBuilder.mappingRules);
                                    }
                                    // else {
                                    //     item.store.load();
                                    // }
                                }
                            });
                        }
                        // }
                        // else {
                        //     addRepeats.forEach(function (item) {
                        //         item.disable();
                        //         // item.hide();
                        //     });
                        //     leftTrees.forEach(function (item) {
                        //         item.currRtType = value0?.argumentType?._id;
                        //         item.rtTypeId = value0?.argumentType?._id;
                        //         item.getRootNode().removeAll();
                        //         item.store.proxy.url = adminPath + 'api/rtTypes/' + item.rtTypeId + '/rtAttributeDefs';
                        //         if (Ext.Object.isEmpty(me.data)) {
                        //             item.store.load();
                        //         }
                        //     });
                        // }
                    }
                }
            },
            // {
            //     xtype: 'layoutset',
            //     name: 'layout',
            //     itemId: 'layoutSet',
            //     minValue: 0,
            //     width: 600,
            //     title: i18n.getKey('margin'),
            //     margin: 15,
            //     padding: 5,
            //     hidden: true,
            //     disabled: true
            // },
            {
                xtype: 'pclayoutfieldset',
                itemId: 'layoutSet',
                title: i18n.getKey('margin'),
                name: 'layout',
                minValue: 0,
                width: 600,
                margin: 15,
                padding: 5,
                hidden: true,
                disabled: true
            },
            {
                xtype: 'displayfield',
                labelStyle: 'font-weight: bold',
                value: '<font color="green" style="font-weight: bold" >' + i18n.getKey('contentMapItems') + '</font>',
                itemId: 'contentMapItemsDis',
                fieldStyle: 'color:black;font-weight: bold',
                padding: '20 0 0 0',
                margin: '5 20',
            },
            {
                xtype: 'contentmapitems',
                itemId: 'contentMapItems',
                name: 'contentMapItems',
                bodyStyle: 'border-width: 1px 0 0 0;',
                flex: 1,
            },
            {
                xtype: 'displayfield',
                labelStyle: 'font-weight: bold',
                value: '<font color="green" style="font-weight: bold" >' + i18n.getKey('argument') + '</font>',
                itemId: 'argumentDis',
                fieldStyle: 'color:black;font-weight: bold',
                padding: '20 0 0 0',
                margin: '5 20',
            },
            {
                xtype: 'argument',
                itemId: 'argument',
                bodyStyle: 'border-width: 1px 0 0 0;',
                isRepeat: false,
                flex: 1,
            }

        ];
        me.callParent(arguments);
        // var containerTypeStore = Ext.data.StoreManager.lookup('vctStore');
        // containerTypeStore.on('load', function (store, rec, successful) {
        //     if (successful) {
        //         var vctId = JSGetQueryString('vctId');
        //         if (vctId) {
        //             me.getComponent('containerType').setSubmitValue(vctId);
        //         }
        //     }
        // }, {once: true});
        if (me.vcoId) {
            me.vcoModel = Ext.ModelManager.getModel("CGP.virtualcontainerobject.model.VirtualContainerObject");
            me.vcoModel.load(parseInt(me.vcoId), {
                success: function (record, operation) {
                    var containerType = record.get('containerType');
                    if (containerType) {
                        containerType.displayName = '<' + containerType._id + '>' + containerType.description;
                        record.set('containerType', containerType);
                    }
                    me.diySetValue(record.data);
                }
            });
        }

    },
    listeners: {
        afterrender: function (comp) {
        }
    },

    setRepeatComp: function (isRepeat) {
        var me = this;
        var addRepeats = me.query('toolbar [itemId="addRepeat"]');
        var vcoItem = me.getComponent('contentMapItems');
        var contentMapEdit = vcoItem.getComponent('contentMapEdit');
        var contentMapGrid = vcoItem.getComponent('contentMapGrid');
        var builderArgument = me.query('panel [itemId="outCenterPanel"]')[0];
        var conditionvaluegrid = builderArgument.down('conditionvaluegrid'),
            repeatvalueex = builderArgument.down('repeatvalueex');

        var layoutSet = me.getComponent('layoutSet');
        if (isRepeat) {
            vcoItem.triggerShow(contentMapEdit, contentMapGrid);
            layoutSet.enable();
            layoutSet.show();
            JSTriggerShow(repeatvalueex, conditionvaluegrid);
            addRepeats.forEach(function (item) {
                item.enable();
                item.show();
            });
        } else {
            vcoItem.triggerShow(contentMapGrid, contentMapEdit);
            layoutSet.disable();
            layoutSet.hide();
            JSTriggerShow(conditionvaluegrid, repeatvalueex);
            addRepeats.forEach(function (item) {
                item.disable();
                item.hide();
            });
        }

    },
    isValid: function () {
        var me = this;
        var isValid = true;
        if (me.rendered == true) {
            me.items.items.forEach(function (item) {
                if (!item.hidden && item.isValid() == false) {
                    isValid = false;
                }
            });
        }
        return isValid;
    },
    diySetValue: function (data) {
        var me = this;
        if (Ext.isEmpty(data) || Ext.Object.isEmpty(data)) {
            return false;
        }
        if (data.containerType?.compile?.name == 'repeat') {
            me.setRepeatComp(true);
        } else {
            me.setRepeatComp(false);
        }
        me.data = data;
        var items = me.items.items;
        for (var item of items) {
            if (item.xtype == 'displayfield' || item.disabled) {
                continue;
            }
            if (item.xtype == 'argument') {
                item.setValue(data);
            } else {
                item.diySetValue ? item.diySetValue(data[item.name]) : item.setValue(data[item.name]);
            }
        }
    },
    diyGetValue: function () {
        var me = this;
        var data = me.data || {};
        var items = me.items.items;
        for (var item of items) {
            if (item.xtype == 'displayfield' || item.disabled) {
                continue;
            }
            if (item.xtype == 'argument') {
                delete data["argument"];
                delete data["argumentBuilder"];
                data = Ext.merge(data, item.getValue());
            } else if (item.itemId == 'containerType') {
                var itemData = Ext.Object.getValues(item.getValue())[0];
                data[item.name] = {_id: itemData._id, clazz: itemData.clazz};
            } else {
                data[item.name] = item.diyGetValue ? item.diyGetValue() : item.getValue();
            }
        }
        return data;
    }
});