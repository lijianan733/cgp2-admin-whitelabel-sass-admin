/**
 * Created by nan on 2021/10/11
 */
Ext.Loader.setPath({
    "CGP.resource": path + 'partials/resource/app'
});
Ext.Loader.syncRequire([
    'CGP.pagecontentschema.view.canvas.model.IntentionModel',
    'CGP.pagecontentschema.view.canvas.view.ElementFilter',
    'CGP.resource.store.CompositeDisplayObject',
    'CGP.businesstype.store.BusinessTypeStore',
    'CGP.pagecontentschema.view.canvas.config.Config'
])
Ext.define('CGP.pagecontentschema.view.canvas.view.IntentionGrid', {
    extend: 'Ext.ux.grid.GridWithCRUD',
    alias: 'widget.intentiongrid',
    resourceName: i18n.getKey('intention'),//管理的资源名
    store: {
        xtype: 'store',
        model: 'CGP.pagecontentschema.view.canvas.model.IntentionModel',
        data: [],
        proxy: {
            type: 'memory'
        }
    },
    columns: [
        {
            text: i18n.getKey('intention'),
            dataIndex: 'intention',
            width: 250,
            renderer: function (value) {
                var PcsOperationIntention = CGP.pagecontentschema.view.canvas.config.Config.PcsOperationIntention;
                var result = '';
                PcsOperationIntention.map(function (item) {
                    if (item.value == value) {
                        result = item.display;
                    }
                });
                return result;
            }
        },
        {
            text: i18n.getKey('template'),
            dataIndex: 'template',
            width: 250,
            renderer: function (value) {
                return value._id;
            }
        },
        {
            text: i18n.getKey('businessType'),
            dataIndex: 'businessLibFilter',
            width: 250,
            valueField: 'name',
            lineNumber: 2,
            xtype: 'arraycolumn'
        },
        {
            text: i18n.getKey('element'),
            sortable: false,
            dataIndex: 'element',
            flex: 1,
            renderer: function (value, metadata, record) {
                metadata.tdAttr = 'data-qtip=' + value;
                var filter = value.filter;
                var items = [];
                for (var i in filter) {
                    items.push({
                        title: i,
                        value: filter[i]
                    })
                }
                return JSCreateHTMLTable(items);
            }
        },
    ],
    setValue: function (data) {
        var me = this;
        me.store.removeAll();
        me.store.proxy.data = data;
        me.store.load();
    },
    getValue: function () {
        var me = this;
        var result = [];
        var store = me.store;
        for (var i = 0; i < store.getCount(); i++) {
            var record = store.getAt(i);
            result.push(record.getData());
        }
        return result;

    },
    initComponent: function () {
        var me = this;
        var compositeDisplayObject = Ext.create('CGP.resource.store.CompositeDisplayObject');
        var businessTypeStore = Ext.create('CGP.businesstype.store.BusinessTypeStore');
        me.winConfig = {
            formConfig: {
                isValidForItems: true,
                items: [
                    {
                        xtype: 'combo',
                        name: 'intention',
                        itemId: 'intention',
                        fieldLabel: i18n.getKey('intention'),
                        displayField: 'display',
                        valueField: 'value',
                        editable: false,
                        store: {
                            xtype: 'store',
                            fields: [
                                {name: 'display', type: 'string'},
                                {name: 'value', type: 'string'}
                            ],
                            data: CGP.pagecontentschema.view.canvas.config.Config.PcsOperationIntention
                        },
                    },
                    {
                        xtype: 'gridcombo',
                        name: 'template',
                        itemId: 'template',
                        fieldLabel: i18n.getKey('template'),
                        displayField: 'name',
                        valueField: '_id',
                        autoScroll: true,
                        editable: false,
                        allowBlank: true,
                        store: compositeDisplayObject,
                        matchFieldWidth: false,
                        multiSelect: false,
                        gridCfg: {
                            height: 400,
                            width: 700,
                            columns: [
                                {
                                    xtype: 'rownumberer'
                                },
                                {
                                    text: i18n.getKey('id'),
                                    dataIndex: '_id'
                                },
                                {
                                    text: i18n.getKey('name'),
                                    width: 200,
                                    dataIndex: 'name',
                                    renderer: function (value, metadata) {
                                        metadata.tdAttr = 'data-qtip="' + value + '"';
                                        return value;
                                    }
                                },
                                {
                                    text: i18n.getKey('description'),
                                    width: 200,
                                    dataIndex: 'description',
                                    renderer: function (value, metadata) {
                                        metadata.tdAttr = 'data-qtip="' + value + '"';
                                        return value;
                                    }
                                },
                                {
                                    text: i18n.getKey('width') + i18n.getKey('height'),
                                    dataIndex: 'sourceContainerWidth',
                                    xtype: 'gridcolumn',
                                    flex: 1,
                                    renderer: function (value, metadata, record) {
                                        var result = '宽:' + value + ' , ';
                                        result += '高:' + record.get('sourceContainerHeight')
                                        metadata.tdAttr = 'data-qtip="' + result + '"';
                                        return result;
                                    }
                                }
                            ],
                            bbar: {
                                xtype: 'pagingtoolbar',
                                store: compositeDisplayObject,
                            }
                        },
                        valueType: 'idReference',
                        haveReset: true,
                        diyGetValue: function () {
                            return this.getArrayValue();
                        },
                        diySetValue: function (data) {
                            if (data) {
                                this.setInitialValue([data._id]);
                            }
                        },
                    },
                    {
                        xtype: 'gridcombo',
                        name: 'businessLibFilter',
                        itemId: 'businessLibFilter',
                        editable: false,
                        valueField: '_id',
                        displayField: 'name',
                        fieldLabel: i18n.getKey('businessType'),
                        multiSelect: true,
                        matchFieldWidth: false,
                        haveReset: true,
                        store: businessTypeStore,
                        gridCfg: {
                            width: 600,
                            selType: 'checkboxmodel',
                            columns: [
                                {
                                    text: i18n.getKey('id'),
                                    dataIndex: '_id'
                                },
                                {
                                    text: i18n.getKey('name'),
                                    width: 250,
                                    dataIndex: 'name'
                                }, {
                                    text: i18n.getKey('resources') + i18n.getKey('type'),
                                    flex: 1,
                                    dataIndex: 'type',
                                    renderer: function (value) {
                                        return value.split('.').pop();
                                    }
                                }],
                            bbar: {
                                xtype: 'pagingtoolbar',
                                store: businessTypeStore
                            }
                        }
                    },
                    {
                        xtype: 'uxfieldset',
                        fieldLabel: i18n.getKey('element'),
                        name: 'element',
                        allowBlank: true,
                        itemId: 'element',
                        title: i18n.getKey('targetSelector'),
                        defaults: {
                            allowBlank: false,
                            width: '100%'
                        },
                        legendItemConfig: {
                            disabledBtn: {
                                hidden: false,
                                disabled: false,
                                isUsable: false,//初始化时，是否是禁用

                            }
                        },
                        extraButtons: {
                            addBtn: {
                                xtype: 'button',
                                margin: '-2 0 0 5',
                                tooltip: '该配置允许为空,为空时表示该意图配置应用于containPath选择的容器',
                                componentCls: 'btnOnlyIcon',
                                iconCls: 'icon_add',
                                icon: path + 'ClientLibs/extjs/resources/themes/images/shared/fam/help.png',
                            }
                        },
                        items: [
                            {
                                xtype: 'combo',
                                editable: false,
                                name: 'clazz',
                                itemId: 'clazz',
                                value: 'ClassCanvasElementFilter',
                                valueField: 'value',
                                displayField: 'display',
                                fieldLabel: i18n.getKey('type'),
                                store: {
                                    xtype: 'store',
                                    fields: [
                                        'value', 'display'
                                    ],
                                    data: [
                                        {
                                            value: 'ClassCanvasElementFilter',
                                            display: 'ClassCanvasElementFilter'
                                        },
                                        {
                                            value: 'IdCanvasElementFilter',
                                            display: 'IdCanvasElementFilter'
                                        }

                                    ]
                                },
                                listeners: {
                                    change: function (combo, newValue, oldValue) {
                                        var className = combo.ownerCt.getComponent('className');
                                        var elementId = combo.ownerCt.getComponent('elementId');
                                        if (newValue == 'ClassCanvasElementFilter') {
                                            className.show();
                                            className.setDisabled(false);
                                            elementId.hide();
                                            elementId.setDisabled(true);
                                        } else {
                                            elementId.show();
                                            elementId.setDisabled(false);
                                            className.hide();
                                            className.setDisabled(true);
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'checkbox',
                                name: 'isInclude',
                                fieldLabel: i18n.getKey('isInclude'),
                                itemId: 'isInclude',
                            },
                            {
                                xtype: 'combo',
                                name: 'className',
                                editable: true,
                                fieldLabel: i18n.getKey('className'),
                                itemId: 'className',
                                valueField: 'value',
                                displayField: 'display',
                                store: {
                                    xtype: 'store',
                                    fields: [
                                        'value', 'display'
                                    ],
                                    data: [
                                        {
                                            value: 'Text',
                                            display: 'Text'
                                        },
                                        {
                                            value: 'Picture',
                                            display: 'Picture'
                                        },
                                        {
                                            value: 'MultiLineText',
                                            display: 'MultiLineText'
                                        }
                                    ]
                                }
                            },
                            {
                                name: 'elementId',
                                xtype: 'treecombo',
                                fieldLabel: i18n.getKey('elementId'),
                                itemId: 'elementId',
                                store: Ext.data.StoreManager.getByKey('layerTreeStore'),
                                displayField: '_id',
                                valueField: '_id',
                                hidden: true,
                                disabled: true,
                                editable: false,
                                rootVisible: false,
                                multiselect: false,
                                listeners: {
                                    expand: function (field) {
                                        var recursiveRecords = [];

                                        function recursivePush(node, setIds) {
                                            addRecRecord(node);
                                            node.eachChild(function (nodesingle) {
                                                if (nodesingle.hasChildNodes() == true) {
                                                    recursivePush(nodesingle, setIds);
                                                } else {
                                                    addRecRecord(nodesingle);
                                                }
                                            });
                                        };

                                        function addRecRecord(record) {
                                            for (var i = 0, j = recursiveRecords.length; i < j; i++) {
                                                var item = recursiveRecords[i];
                                                if (item) {
                                                    if (item.getId() == record.getId()) return;
                                                }
                                            }
                                            if (record.getId() <= 0) return;
                                            recursiveRecords.push(record);
                                        };
                                        var node = field.tree.getRootNode();
                                        recursivePush(node, false);
                                        Ext.each(recursiveRecords, function (record) {
                                            var id = record.get(field.valueField);
                                            if (field.getValue() == id && !Ext.isEmpty(field.getValue())) {
                                                field.tree.getSelectionModel().select(record);
                                            }
                                        });
                                    },
                                    afterrender: function (comp) {
                                        comp.tree.expandAll();
                                    }
                                },
                                defaultColumnConfig: {
                                    renderer: function (value, madate, record) {
                                        return record.get('clazz') + '(' + record.get('_id') + ')';
                                    }
                                },
                            }
                        ],
                        diyGetValue: function () {
                            var me = this;
                            return {
                                filter: me.getValue(),
                            }
                        },
                        diySetValue: function (data) {
                            var me = this;
                            if (data && data.filter) {
                                me.setValue(data.filter);
                            }

                        }
                    },
                ]
            },
        };
        me.callParent(arguments);
    }
})