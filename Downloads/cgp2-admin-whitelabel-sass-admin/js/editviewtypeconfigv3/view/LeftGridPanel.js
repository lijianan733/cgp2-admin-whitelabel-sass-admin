/**
 * Created by nan on 2020/7/29.
 */
Ext.define('CGP.editviewtypeconfigv3.view.LeftGridPanel', {
        extend: "Ext.grid.Panel",
        region: 'west',
        header: false,
        split: true,
        viewConfig: {
            markDirty: false
        },
        areaTypes: ['Top', 'Left', 'Right', 'Bottom', 'DocumentView'],
        listeners: {
            afterrender: function (gridpanel) {
                var data = [];
                for (var i = 0; i < gridpanel.areaTypes.length; i++) {
                    data.push({
                        sizeValue: null,
                        components: null,
                        checked: null,
                        layoutPosition: gridpanel.areaTypes[i],
                    })
                }
                gridpanel.store.loadData(data);
            },
            select: function (rowModel, record) {
                var centerFormPanel = rowModel.view.ownerCt.ownerCt.getComponent('centerFormPanel');
                var areaType = record.get('layoutPosition');
                centerFormPanel.suspendLayouts();
                for (var i = 0; i < centerFormPanel.items.items.length; i++) {
                    var item = centerFormPanel.items.items[i];
                    if (item.areaType == areaType) {
                        item.expand();
                    } else {
                        item.collapse();
                    }
                }
                centerFormPanel.resumeLayouts();
                centerFormPanel.doLayout();

            }
        },
        tbar: {
            layout: 'vbox',
            flex: 1,
            items: [
                {
                    fieldLabel: i18n.getKey('id'),
                    xtype: 'textfield',
                    flex: 1,
                    readOnly: true,
                    hidden: true,
                    fieldStyle: 'background-color: silver',//设置文本框的样式
                    allowBlank: false,
                    name: 'id',
                    itemId: 'id'
                },
                {
                    fieldLabel: i18n.getKey('配置描述'),
                    xtype: 'textarea',
                    flex: 1,
                    grow: true,
                    allowBlank: false,
                    name: 'description',
                    itemId: 'description'
                }
            ]
        },
        setValue: function (data) {
            var me = this;
            var store = me.store;
            var description = me.getDockedItems('toolbar[dock="top"]')[0].getComponent('description');
            var id = me.getDockedItems('toolbar[dock="top"]')[0].getComponent('id');
            description.setValue(data.description);
            id.setValue(data._id);
            id.show();
            for (var i = 0; i < data.areas.length; i++) {
                var areaData = data.areas[i];
                for (var j = 0; j < store.getCount(); j++) {
                    var record = store.getAt(j)
                    var recordData = record.getData();
                    if (areaData.layoutPosition == recordData.layoutPosition) {
                        record.set('checked', true);
                    }
                }
            }
        },
        getValue: function () {
            var me = this;
            var id = me.getDockedItems('toolbar[dock="top"]')[0].getComponent('id');
            var description = me.getDockedItems('toolbar[dock="top"]')[0].getComponent('description');
            return {
                description: description.getValue(),
                _id: id.getValue()
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
                        name: 'sizeValue',
                        type: 'number'
                    }, {
                        name: 'components',
                        type: 'array'
                    }, {
                        name: 'layoutPosition',
                        type: 'string'
                    }, {
                        name: '_id',
                        type: 'string'
                    }, {
                        name: 'checked',
                        type: 'boolean',
                        useNull:true,
                    }
                ],
                data: []
            });
            me.columns = [
                {
                    text: i18n.getKey('layoutPosition'),
                    dataIndex: 'layoutPosition',
                    width: 200,
                    sortable: false
                },
                {
                    text: i18n.getKey('是否启用'),
                    flex: 1,
                    xtype: 'componentcolumn',
                    dataIndex: 'checked',
                    sortable: false,
                    renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                        var area = record.get('layoutPosition');
                        var checked = Ext.isEmpty(value) ? (area == 'Top' || area == 'DocumentView') : value;
                        return {
                            xtype: 'checkbox',
                            inputValue: true,
                            readOnly: area == 'DocumentView',
                            checked: checked,
                            disabled: (area == 'DocumentView') ? 'background-color:silver' : null,
                            removeCls: function (cls) {
                                var me = this,
                                    el = me.rendered ? me.el : me.protoEl;
                                if (el && el.removeCls) {
                                    el.removeCls.apply(el, arguments);
                                }
                                return me;
                            },
                            addCls: function (cls) {
                                var me = this,
                                    el = me.rendered ? me.el : me.protoEl;
                                if (el && el.addCls) {
                                    el.addCls.apply(el, arguments);
                                }
                                return me;
                            },
                            listeners: {
                                afterrender: function () {
                                    //阻止事件传递到父组件上，使之不会触发gridPanel的itemSelect事件
                                    this.el.on("mousedown", function (event, targetEl) {
                                        console.log("阻止冒泡");
                                        event.stopPropagation();
                                    });
                                },
                                change: function (checkbox, newValue, oldValue) {
                                    record.set('checked', newValue);
                                    var centerFormPanel = gridView.ownerCt.ownerCt.getComponent('centerFormPanel');
                                    var areaType = record.get('layoutPosition');
                                    for (var i = 0; i < centerFormPanel.items.items.length; i++) {
                                        var item = centerFormPanel.items.items[i];
                                        if (item.areaType == areaType) {
                                            item.checked = newValue;
                                            if (newValue) {
                                                item.setDisabled(false);
                                            } else {
                                                item.setDisabled(true);
                                            }
                                            break;
                                        }
                                    }

                                }
                            }
                        };
                    }
                },
            ];
            me.callParent(arguments);
        }
    }
)
