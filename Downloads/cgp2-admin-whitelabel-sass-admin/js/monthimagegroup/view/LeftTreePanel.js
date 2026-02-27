/**
 * Created by nan on 2021/2/3
 */

Ext.define('CGP.monthimagegroup.view.LeftTreePanel', {
    extend: "Ext.grid.Panel",
    alias: 'widget.lefttreepanel',
    region: 'west',
    header: false,
    split: true,
    viewConfig: {
        markDirty: false
    },
    languageStore: null,
    tbar: {
        layout: 'vbox',
        padding: '6px 0px 0px 0px',
        items: [
            {
                xtype: 'textfield',
                hidden: true,
                name: '_id',
                itemId: '_id'
            },
            {
                fieldLabel: i18n.getKey('配置描述'),
                xtype: 'textarea',
                width: '100%',
                margin: '5 10 5 25',
                grow: true,
                allowBlank: false,
                name: 'description',
                itemId: 'description'
            },
            {
                xtype: 'component',
                border: 5,
                width: '110%',
                height: '5px',
                style: {
                    backgroundColor: '#3892d3'
                }
            },
            {
                xtype: 'button',
                margin: '5 0 5 10',
                text: i18n.getKey('add'),
                iconCls: 'icon_add',
                handler: function (btn) {
                    var me = this;
                    var toolbar = btn.ownerCt;
                    var treePanel = toolbar.ownerCt;
                    treePanel.checkConfigInfo(null, treePanel);

                }
            }
        ]
    },
    listeners: {
        select: function (rowModel, record) {
            var centerFormPanel = rowModel.view.ownerCt.ownerCt.getComponent('centerGridPanel');
            centerFormPanel.refreshData(record.raw.images);
        },
        deselect: function () {
           ;

        },
        beforedeselect: function (rowModel, record, index) {
            var centerFormPanel = rowModel.view.ownerCt.ownerCt.getComponent('centerGridPanel');
            var images = centerFormPanel.getValue();
            if (centerFormPanel.isValid()) {
                record.raw.images = images;
                return true;
            } else {
                return false;
            }
            console.log(images);
        },
    },
    checkConfigInfo: function (record, treePanel) {
        var win = Ext.create('Ext.window.Window', {
            title: '月份图配置',
            modal: true,
            constrain: true,
            items: [
                {
                    xtype: 'errorstrickform',
                    defaults: {
                        width: 450,
                        allowBlank: false,
                        margin: '5 25 5 25'
                    },
                    getValue: function () {
                        var me = this;
                        var result = {};
                        if (me.rendered == true) {
                            for (var i = 0; i < me.items.items.length; i++) {
                                var item = me.items.items[i];
                                if (item.diyGetValue) {
                                    result[item.name] = item.diyGetValue();
                                } else if (item.getValue) {
                                    result[item.name] = item.getValue();
                                }
                            }
                            return result;
                        } else {
                            return me.rawData;
                        }
                    },
                    items: [
                        {
                            name: 'language',
                            xtype: 'gridcombo',
                            fieldLabel: i18n.getKey('language'),
                            allowBlank: false,
                            itemId: 'language',
                            displayField: 'name',
                            valueField: 'id',
                            msgTarget: 'side',
                            store: treePanel.languageStore,
                            matchFieldWidth: false,
                            editable: false,
                            multiSelect: false,
                            gridCfg: {
                                store: treePanel.languageStore,
                                height: 280,
                                width: 600,
                                columns: [

                                    {
                                        text: i18n.getKey('id'),
                                        dataIndex: 'id',
                                        xtype: 'gridcolumn',
                                        itemId: 'id',
                                        sortable: true
                                    }, {
                                        text: i18n.getKey('name'),
                                        dataIndex: 'name',
                                        xtype: 'gridcolumn',
                                        itemId: 'name',
                                        sortable: true
                                    }, {
                                        text: i18n.getKey('locale'),
                                        dataIndex: 'locale',
                                        xtype: 'gridcolumn',
                                        itemId: 'locale',
                                        sortable: true,
                                        renderer: function (v) {
                                            if (v) {
                                                return v.name + '(' + v.code + ')';
                                            }
                                        }
                                    }, {
                                        text: i18n.getKey('code'),
                                        dataIndex: 'code',
                                        xtype: 'gridcolumn',
                                        itemId: 'code',
                                        sortable: true,
                                        renderer: function (v) {
                                            return v.code;
                                        }
                                    }, {
                                        text: i18n.getKey('image'),
                                        dataIndex: 'image',
                                        xtype: 'gridcolumn',
                                        minWidth: 120,
                                        itemId: 'image',
                                        sortable: true,
                                        renderer: function (v) {
                                            var url = imageServer + v + '/64/64/png';
                                            return '<img src="' + url + '" />';
                                        }
                                    }, {
                                        text: i18n.getKey('directory'),
                                        dataIndex: 'directory',
                                        xtype: 'gridcolumn',
                                        itemId: 'directory',
                                        sortable: true
                                    }, {
                                        text: i18n.getKey('sortOrder'),
                                        dataIndex: 'sortOrder',
                                        xtype: 'gridcolumn',
                                        itemId: 'sortOrder',
                                        sortable: true
                                    }
                                ],
                                bbar: {
                                    xtype: 'pagingtoolbar',
                                    store: treePanel.languageStore,
                                }
                            },
                            diySetValue: function (data) {
                                var me = this;
                                if (data) {
                                    me.setInitialValue([data.id]);
                                }
                            },
                            diyGetValue: function () {
                                var me = this;
                                var data = me.getArrayValue();
                                if (data) {
                                    data = {
                                        clazz: 'com.qpp.cgp.domain.common.Language',
                                        id: data.id
                                    }
                                    return data;
                                } else {
                                    return null;
                                }
                            }
                        },
                        {
                            xtype: 'combo',
                            name: 'firstDateOfWeek',
                            fieldLabel: i18n.getKey('firstDateOfWeek'),
                            valueField: 'value',
                            displayField: 'display',
                            editable: false,
                            itemId: 'firstDateOfWeek',
                            store: Ext.create('Ext.data.Store', {
                                fields: [
                                    'value', 'display'
                                ],
                                data: [
                                    {
                                        value: 0,
                                        display: i18n.getKey('sunday')
                                    },
                                    {
                                        value: 1,
                                        display: i18n.getKey('monday')
                                    }
                                ]
                            })
                        },
                        {
                            xtype: 'textfield',
                            name: 'clazz',
                            itemId: 'clazz',
                            hidden: true,
                            value: 'com.qpp.cgp.domain.preprocess.holiday.MonthImageCondition',
                            fieldLabel: i18n.getKey('clazz'),
                        },
                    ],
                    bbar: [
                        '->',
                        {
                            xtype: 'button',
                            text: i18n.getKey('confirm'),
                            iconCls: 'icon_agree',
                            handler: function (btn) {
                                var form = btn.ownerCt.ownerCt;
                                var win = form.ownerCt;
                                if (form.isValid()) {
                                    var data = form.getValue();
                                    if (record) {
                                        var index = record.index;
                                        for (var i = 0; i < treePanel.store.proxy.data.length; i++) {
                                            //修改
                                            if (i == index) {
                                            } else {
                                                var item = treePanel.store.proxy.data[i];
                                                if (item.firstDateOfWeek == data.firstDateOfWeek && item.language.id == data.language.id) {
                                                    Ext.Msg.alert(i18n.getKey('prompt'), '不允许存在多条语言和' + i18n.getKey('firstDateOfWeek') + '相同的配置');
                                                    return;
                                                }
                                            }
                                        }
                                        treePanel.store.proxy.data[index] = Ext.Object.merge(treePanel.store.proxy.data[index], data);
                                    } else {
                                        //新建
                                        data.images = [];
                                        for (var i = 0; i < treePanel.store.proxy.data.length; i++) {
                                            var item = treePanel.store.proxy.data[i];
                                            if (item.firstDateOfWeek == data.firstDateOfWeek && item.language.id == data.language.id) {
                                                Ext.Msg.alert(i18n.getKey('prompt'), '不允许存在多条语言和' + i18n.getKey('firstDateOfWeek') + '相同的配置');
                                                return;
                                            }
                                        }
                                        treePanel.store.proxy.data.push(data);
                                    }
                                    treePanel.store.load();
                                    win.close();
                                }
                            }
                        },
                        {
                            xtype: 'button',
                            text: i18n.getKey('cancel'),
                            iconCls: 'icon_cancel',
                            handler: function (btn) {
                                var form = btn.ownerCt.ownerCt;
                                var win = form.ownerCt;
                                win.close();
                            }
                        }
                    ],
                    listeners: {
                        afterrender: function () {
                            var form = this;
                            if (record) {
                                form.setValue(record.getData());
                            }
                        }
                    }
                }
            ]
        })
        win.show();
    },
    setValue: function (data) {
        var me = this;
        var description = me.getDockedItems('toolbar[dock="top"]')[0].getComponent('description');
        var id = me.getDockedItems('toolbar[dock="top"]')[0].getComponent('_id');
        description.setValue(data.description);
        id.setValue(data._id);
        me.store.proxy.data = data.monthImageConditions || [];
        me.store.load();
    },
    getValue: function () {
        var me = this;
        var id = me.getDockedItems('toolbar[dock="top"]')[0].getComponent('_id');
        var description = me.getDockedItems('toolbar[dock="top"]')[0].getComponent('description');
        return {
            description: description.getValue(),
            _id: id.getValue(),
            monthImageConditions: me.store.proxy.data,
            clazz: 'com.qpp.cgp.domain.preprocess.holiday.MonthImageGroup'
        };
    },
    isValid: function () {
        var me = this;
        var description = me.getDockedItems('toolbar[dock="top"]')[0].getComponent('description');
        return description.isValid();
    },
    initComponent: function () {
        var me = this;
        me.store = Ext.create('Ext.data.Store', {
            proxy: {
                type: 'memory'
            },
            fields: [
                {
                    name: 'language',
                    type: 'object'
                },
                {
                    name: 'firstDateOfWeek',
                    type: 'number',
                },
                {
                    name: 'images',
                    type: 'array',
                },
                {
                    name: 'clazz',
                    type: 'string'
                }
            ],
            data: []
        });
        me.columns = [
            {
                xtype: 'rownumberer',
                width: 40
            },
            {
                xtype: 'actioncolumn',
                width: 50,
                items: [
                    {
                        iconCls: 'icon_edit icon_margin',  // Use a URL in the icon config
                        tooltip: 'Edit',
                        handler: function (view, rowIndex, colIndex, a, b, record) {
                            var grid = view.ownerCt;
                            grid.checkConfigInfo(record, grid);
                        }
                    },
                    {
                        iconCls: 'icon_remove icon_margin',
                        tooltip: 'Delete',
                        handler: function (view, rowIndex, colIndex, a, b, record) {
                            var store = record.store;
                            var index = record.index;
                            Ext.Msg.confirm('提示', '确定删除？', callback);

                            function callback(id) {
                                if (id === 'yes') {
                                    var selectedRecord = view.getSelectionModel().getSelection()[0];
                                    if (record == selectedRecord) {
                                        var centerFormPanel = view.ownerCt.ownerCt.getComponent('centerGridPanel');
                                        centerFormPanel.refreshData();
                                    }
                                    store.proxy.data.splice(index, 1);
                                    store.load();
                                }
                            }
                        }
                    }
                ]
            },
            {
                dataIndex: 'language',
                text: i18n.getKey('language'),
                renderer: function (value, mateData, record, rowIndex, colIndex, store, gridView) {
                    var grid = gridView.ownerCt;
                    var id = value.id;
                    var languageRecord = grid.languageStore.getById(id + '');
                    return (languageRecord.get('name'));
                }
            },
            {
                dataIndex: 'firstDateOfWeek',
                text: i18n.getKey('firstDateOfWeek'),
                flex: 1,
                renderer: function (value, mateData, record, rowIndex, colIndex, store, gridView) {
                    if (value == 0) {
                        return i18n.getKey('sunday');

                    } else {
                        return i18n.getKey('monday');
                    }
                }
            },
        ];
        me.bbar = {
            xtype: 'pagingtoolbar',
            store: me.store
        }
        me.callParent(arguments);
    }
})
