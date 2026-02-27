/**
 * Created by nan on 2020/3/26.
 */
Ext.define("CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.MaterialBomMapping", {
    extend: "Ext.panel.Panel",
    material: null,//对应的物料
    autoScroll: true,
    rawData: null,
    controller: Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.controller.Controller'),
    tbar: [
        {
            xtype: 'button',
            text: i18n.getKey('add'),
            iconCls: 'icon_add',
            handler: function (btn) {
                var me = btn.ownerCt.ownerCt;
                console.log('me.material.childItems');
                //过滤掉已经配置了的BomItem
                var includeBomItemConfigIds = [];//已经配置了的BomItem的Id
                for (var i = 0; i < me.items.items.length; i++) {
                    includeBomItemConfigIds.push(me.items.items[i].bomItem._id);
                }
                var bomItemStore = Ext.create('Ext.data.Store', {
                    autoLoad: false,
                    fields: [
                        {
                            name: '_id',
                            type: 'string',
                            useNull: true
                        },
                        {
                            name: 'name',
                            type: 'string'
                        },
                        {
                            name: 'quantityStrategy',
                            type: 'string'
                        },
                        {
                            name: 'itemMaterial',
                            type: 'object'
                        },
                        {
                            name: 'code',
                            type: 'string'
                        },
                        {
                            name: 'clazz',
                            type: 'string'
                        }, {
                            name: 'type',
                            type: 'string',
                            convert: function (value, record) {
                                var clazz = record.get('clazz');
                                if (clazz == 'com.qpp.cgp.domain.bom.bomitem.UnassignBOMItem') {
                                    return 'UnassignBOMItem'
                                } else if (clazz == 'com.qpp.cgp.domain.bom.bomitem.FixedBOMItem') {
                                    return 'FixedBOMItem'
                                } else if (clazz == 'com.qpp.cgp.domain.bom.bomitem.OptionalBOMItem') {
                                    return 'OptionalBOMItem'
                                }
                            }
                        },
                        {
                            name: 'constraints',
                            type: 'array'
                        }, {
                            name: 'optionalMaterials',
                            type: 'array',
                        }, {
                            name: 'range',
                            type: 'object',
                        }, {
                            name: 'quantity',
                            type: 'int',
                            useNull: 'int'
                        }, {
                            name: 'quantityDesc',
                            type: 'object',
                        },
                        {
                            name: 'isCompleted',
                            type: 'boolean',
                        }
                    ],
                    data: me.material.childItems,
                    listeners: {
                        load: function (store, records) {
                            store.filter(function (item) {
                                return !Ext.Array.contains(includeBomItemConfigIds, item.get('_id'));
                            });
                        }
                    }
                });
                var win = Ext.create('Ext.window.Window', {
                    modal: true,
                    width: 400,
                    height: 150,
                    layout: {
                        type: 'vbox',
                        align: 'center',
                        pack: 'center'
                    },
                    title: i18n.getKey('select') + i18n.getKey('需配置的bomIem'),
                    items: [
                        {
                            name: 'bomItem',
                            xtype: 'gridcombo',
                            itemId: 'bomItem',
                            allowBlank: false,
                            fieldLabel: i18n.getKey('bomItem'),
                            multiSelect: false,
                            displayField: 'name',
                            valueField: '_id',
                            labelAlign: 'right',
                            labelWidth: 80,
                            editable: false,
                            store: bomItemStore,
                            matchFieldWidth: false,
                            gridCfg: {
                                height: 280,
                                width: 800,
                                columns: [
                                    {
                                        dataIndex: '_id',
                                        text: i18n.getKey('id'),
                                        width: 70,
                                        tdCls: 'vertical-middle',
                                        itemId: '_id'
                                    },
                                    {
                                        dataIndex: 'name',
                                        text: i18n.getKey('name'),
                                        width: 120,
                                        tdCls: 'vertical-middle',
                                        itemId: 'name',
                                        renderer: function (value, metadata) {
                                            metadata.tdAttr = 'data-qtip="' + value + '"';
                                            return value;
                                        }
                                    },
                                    {
                                        dataIndex: 'itemMaterial',
                                        text: i18n.getKey('itemMaterial'),
                                        width: 200,
                                        tdCls: 'vertical-middle',
                                        itemId: 'itemMaterial',
                                        renderer: function (v, metaData) {
                                            return v._id;
                                        }
                                    },
                                    {
                                        dataIndex: 'quantityStrategy',
                                        text: i18n.getKey('quantityStrategy'),
                                        width: 100,
                                        tdCls: 'vertical-middle',
                                        itemId: 'quantityStrategy'
                                    },
                                    {
                                        dataIndex: 'type',
                                        text: i18n.getKey('type'),
                                        width: 100,
                                        tdCls: 'vertical-middle',
                                        itemId: 'clazz',
                                        renderer: function (v, record) {
                                            if (v == 'FixedBOMItem') {
                                                return '固定件'
                                            } else if (v == 'UnassignBOMItem') {
                                                return '待定件'
                                            } else {
                                                return '可选件'
                                            }
                                        }
                                    },
                                    {
                                        dataIndex: 'constraints',
                                        text: i18n.getKey('constraints'),
                                        width: 270,
                                        xtype: 'arraycolumn',
                                        sortable: false,
                                        lineNumber: 1,
                                        tdCls: 'vertical-middle',
                                        itemId: 'constraints',
                                        renderer: function (v, record) {
                                            if (!Ext.isEmpty(v)) {
                                                var clazzSplit = v['clazz'].split('.');
                                                var clazz = clazzSplit.pop();
                                                if (clazz == 'FixedQuantityConstraint') {
                                                    return i18n.getKey(clazz) + ':' + '{' + i18n.getKey('quantity') + '：' + v['quantity'] + '}'
                                                } else if (clazz == 'RangeQuantityConstraint') {
                                                    return i18n.getKey(clazz) + ':' + '{' + i18n.getKey('predefineQuantity') + '：' + v['predefineQuantity'] + '&nbsp' +
                                                        i18n.getKey('step') + '：' + v['step'] + '}'
                                                } else if (clazz == 'CalculatedQuantityConstraint') {
                                                    return i18n.getKey(clazz) + ':' + '{' + i18n.getKey('expression') + '：' + v['expression'] + '}'
                                                } else if (clazz == 'FillQuantityConstraint') {
                                                    return i18n.getKey(clazz) + ':' + '{' + i18n.getKey('total') + '：' + v['total'] + '}'
                                                } else if (clazz == 'InsertRatioConstraint') {
                                                    return i18n.getKey(clazz) + ':' + '{' + i18n.getKey('numerator') + '：' + v['numerator'] + '&nbsp' +
                                                        i18n.getKey('denominator') + '：' + v['denominator'] + '}'
                                                }
                                            }
                                        }
                                    },
                                    {
                                        dataIndex: 'isCompleted',
                                        text: i18n.getKey('isCompleted'),
                                        tdCls: 'vertical-middle',
                                        itemId: 'constraints',
                                        width: 100,
                                        renderer: function (value) {
                                            return i18n.getKey(value);
                                        }
                                    }
                                ]
                            },
                            listeners: {
                                expand: function () {
                                    this.store.filter(function (item) {
                                        return !Ext.Array.contains(includeBomItemConfigIds, item.get('_id'));
                                    });
                                }
                            }
                        }
                    ],
                    bbar: [
                        '->',
                        {
                            xtype: 'button',
                            text: i18n.getKey('confirm'),
                            iconCls: 'icon_agree',
                            handler: function (btn) {
                                var win = btn.ownerCt.ownerCt;
                                var selectBom = win.getComponent('bomItem');
                                if (selectBom.isValid()) {
                                    var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.controller.Controller');
                                    var bomItem = selectBom.getArrayValue();
                                    var fieldSet = controller.addBomItemConfig(bomItem, me, win);
                                    fieldSet.expand();
                                    win.hide();
                                }

                            }
                        },
                        {
                            xtype: 'button',
                            text: i18n.getKey('cancel'),
                            iconCls: 'icon_cancel',
                            handler: function (btn) {
                                var win = btn.ownerCt.ownerCt;
                                win.close();
                            }
                        }
                    ]
                });
                win.show();

            }
        }
    ],
    expandedFieldSet: null,//记录当前展开的fieldSet
    refreshData: function (MMTDetail, materialMappingDTOConfig) {
        var me = this;
        me.setTitle(i18n.getKey('物料') + '(' + MMTDetail._id + ')' + '结构' + i18n.getKey('mapping') + i18n.getKey('config'));
        me.material = MMTDetail;
        me.expandedFieldSet = null;
        me.removeAll();
        var toolbar = me.getDockedItems('toolbar[dock="top"]')[0];
        var addBtn = toolbar.items.items[0];
        if (MMTDetail.clazz == 'com.qpp.cgp.domain.bom.MaterialSpu') {
            addBtn.setDisabled(true);
        } else {
            addBtn.setDisabled(false);
            if (materialMappingDTOConfig) {
                var bomItemMappings = materialMappingDTOConfig.bomItemMappings;
                if (bomItemMappings && bomItemMappings.length > 0) {
                    for (var i = 0; i < bomItemMappings.length; i++) {
                        var bomItem = null;
                        MMTDetail.childItems.forEach(function (item) {
                            if (item._id == bomItemMappings[i].sourceBOMItemId) {
                                bomItem = item;
                            }
                        });
                        me.controller.addBomItemConfig(bomItem, me, null, bomItemMappings[i])
                    }
                }
            }
            if (MMTDetail.childItems.length > 0) {
                me.tab.show();
                me.show();
            } else {
                me.tab.hide();
                me.hide();
            }

        }
    },
    setValue: function (data) {
        var me = this
    },
    getValue: function () {
        var me = this;
        var result = [];
        if (me.rendered == true) {
            me.items.items.forEach(function (item) {
                result.push(item.getValue());
            });
        } else {
            result = me.rawData;
        }
        return result;
    },
    isValid: function () {
        var me = this;
        var isValid = true;
        if (me.rendered == true) {
            me.items.items.forEach(function (item) {
                if (item.isValid() == false) {
                    isValid = false;
                }
            });
        }
        return isValid;
    },
    getFieldSetByBomItemId: function (BomItemId) {
        var me = this;
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.bomItem._id == BomItemId) {
                return item;
            }
        }
        return null;
    },
    initComponent: function () {
        var me = this;
        me.addEvents({
            "itemFieldSetExpand": true,
        });
        me.listeners = {
            //记录哪个fieldSet展开了，且把其他的fieldSet收起
            itemFieldSetExpand: function (expandedFieldSet) {
                var me = this;
                if (me.expandedFieldSet) {
                    if (me.expandedFieldSet == expandedFieldSet) {

                    } else {
                        if (me.expandedFieldSet.ownerCt) {//处理展开时，删除了这个bomItemConfig
                            me.expandedFieldSet.collapse();
                        } else {
                            me.expandedFieldSet = null;
                        }
                    }
                }
                me.expandedFieldSet = expandedFieldSet;
                me.body.setScrollTop(expandedFieldSet.getBox().top - 122);//100是当前iframe的x高度
                var leftBomTree = Ext.getCmp('leftBomTree');
                var parentNode = leftBomTree.getStore().getNodeById(me.ownerCt.materialPath.replace(/,/g, '-'));
                parentNode.expand(false, function (records) {
                    var bomItemNode = parentNode.findChild('id', expandedFieldSet.bomItem._id);
                    leftBomTree.getSelectionModel().select(bomItemNode, false, true);//不触发事件
                })
            }
        };
        me.callParent();
    }
})
