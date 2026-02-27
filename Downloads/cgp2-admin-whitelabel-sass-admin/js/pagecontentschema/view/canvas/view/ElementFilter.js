/**
 * Created by nan on 2021/10/11
 * 筛选组件
 */
Ext.define('CGP.pagecontentschema.view.canvas.view.ElementFilter', {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.elementfilter',
    initComponent: function () {
        var me = this;
        me.items = [
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
        ];
        me.callParent();
    }
})
