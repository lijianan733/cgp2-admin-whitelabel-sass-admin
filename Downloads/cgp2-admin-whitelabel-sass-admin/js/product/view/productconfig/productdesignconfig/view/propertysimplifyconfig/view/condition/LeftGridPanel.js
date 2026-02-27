/**
 * Created by nan on 2020/3/26.
 */
Ext.define("CGP.product.view.productconfig.productdesignconfig.view.propertysimplifyconfig.view.condition.LeftGridPanel", {
    extend: "Ext.grid.Panel",
    rawData: null,//原始值
    controller: Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.controller.Controller'),
    height: '100%',
    spuRtObjectMappings: null,
    productId: null,
    includeIds: null,
    getValue: function () {
        //遍历整个数，把是叶子节点中的spuRtObjectMappingDTOConfig属性值取出
        var me = this;
        var result = [];
        var mappingRules = me.rawData;
        for (var i = 0; i < me.store.getCount(); i++) {
            var notSkuAttribute = me.store.getAt(i).getData();
            for (var j = 0; j < mappingRules.length; j++) {
                if (notSkuAttribute.id == mappingRules[j].notSkuAttribute.id) {
                    result.push(mappingRules[j]);
                    break;
                }
            }
        }
        return result;
    },
    setValue: function (data) {
        if (data) {
            var me = this;
            me.rawData = data;
            var gridData = [];
            for (var i = 0; i < me.rawData.length; i++) {
                gridData.push(me.rawData[i].notSkuAttribute);
            }
            me.store.proxy.data = gridData;
            me.store.load();

            //一个bug,保存后是新的数据源了，但界面上还是用旧的数据源，更新界面显示的数据源
            var selected = me.getSelectionModel().getSelection()[0];
            if (selected) {
                var MappingRules = [];
                var skuId = selected.getId();
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    if (item.notSkuAttribute.id == skuId) {
                        MappingRules = item.mappingRules;
                        break;
                    }
                }
                var centerGrid = me.ownerCt.getComponent('centerGrid');
                centerGrid.refreshData(MappingRules, selected);
            }
        }
    },
    isValid: function () {
        var me = this;
        var isValid = true;
        var mappingRules = me.rawData;
        for (var i = 0; i < me.store.getCount(); i++) {
            isValid = false;
            var notSkuAttribute = me.store.getAt(i).getData();
            for (var j = 0; j < mappingRules.length; j++) {
                if (notSkuAttribute.id == mappingRules[j].notSkuAttribute.id) {
                    if (mappingRules[j].mappingRules.length > 0) {
                        isValid = true;
                        break;
                    }
                }
            }
        }
        return isValid;
    },
    deleteRecord: function (deleteIds) {
        var me = this;
        var store = me.getStore();
        Ext.Msg.confirm('提示', '确定删除？', callback);

        function callback(id) {
            if (id === 'yes') {
                for (var i = 0; i < deleteIds.length; i++) {
                    var skuId = deleteIds[i];
                    //处理被选择记录被删除的情况
                    var selectedRecord = me.getSelectionModel().getSelection()[0];
                    var centerGrid = me.ownerCt.getComponent('centerGrid');
                    if (selectedRecord) {
                        if (selectedRecord.getId() == skuId) {
                           ;
                            centerGrid.refreshData();
                        }
                    }
                    //同时删除被删配置对应的条件配置
                    var keyValueDTO = me.rawData
                    for (var j = 0; j < keyValueDTO.length; j++) {
                        var item = keyValueDTO[j];
                        if (item.notSkuAttribute.id == skuId) {
                            keyValueDTO.splice(j, 1);
                            break;
                        }
                    }
                }
                store.proxy.data = store.proxy.data.filter(function (item) {
                    if (!Ext.Array.contains(deleteIds, item.id)) {
                        return true;
                    }
                });
                store.load();
            }
        }

    },
    initComponent: function () {
        var me = this;
        me.rawData = [];
        me.includeIds = [];
        //在树上的节点上，以spuRtObjectMappingDTOConfig来储存数据,使grid中的store指向同一个数组
        me.store = Ext.create('Ext.data.Store', {
            fields: ['id', 'displayName'],
            data: [],
        });
        Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.store.ProductAttributeStore', {
            storeId: 'attributeStore',
            productId: me.productId
        })
        var attributeStore = Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.store.ProductAttributeStore', {
            filters: [
                {
                    property: 'isSku',
                    value: false
                },
                {
                    filterFn: function (item) {
                        var id = item.raw.id;
                        if (me.store.findRecord('id', id)) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                }
            ],
            productId: me.productId
        });
        me.columns = {
            defaults: {
                menuDisabled: true,
            },
            items: [
                {
                    xtype: 'actioncolumn',
                    width: 30,
                    items: [
                        {
                            iconCls: 'icon_remove icon_margin',
                            tooltip: 'Delete',
                            handler: function (view, rowIndex, colIndex, a, b, record) {
                                var store = view.getStore();
                                Ext.Msg.confirm('提示', '确定删除？', callback);

                                function callback(id) {
                                    if (id === 'yes') {
                                        view.ownerCt.deleteRecord([record.getId()]);
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    text: i18n.getKey('product') + i18n.getKey('非SKU') + i18n.getKey('attribute'),
                    width: 180,
                    dataIndex: 'name',
                    renderer: function (value, mateData, record) {
                        return record.get('displayName') + '(' + record.get('id') + ')';
                    }
                },
                {
                    text: i18n.getKey('状态'),
                    flex: 1,
                    renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                        var unSkuId = record.get('id');
                        var leftGrid = gridView.ownerCt;
                        var isConfig = false;
                        for (var i = 0; i < leftGrid.rawData.length; i++) {
                            var config = leftGrid.rawData[i];
                            if (config.notSkuAttribute.id == unSkuId) {
                                if (config.mappingRules && config.mappingRules.length > 0) {
                                    isConfig = true;
                                }
                                break;
                            }
                        }
                        if (isConfig) {
                            return ' <img  style="width: 16px;height: 16px;vertical-align: middle;"' +
                                ' src=' + path + 'ClientLibs/extjs/resources/themes/images/shared/32_32/accept.png>';

                        } else {
                            return ' <img  style="width: 16px;height: 16px;vertical-align: middle;" ' +
                                'src=' + path + 'ClientLibs/extjs/resources/themes/images/shared/32_32/cog_add.png>';
                        }
                    }
                }
            ]
        };
        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('add') + i18n.getKey('非SKU属性'),
                iconCls: 'icon_add',
                handler: function (btn) {
                    var leftGrid = btn.ownerCt.ownerCt;
                    var includeIds = leftGrid.includeIds;
                    attributeStore.load();
                    var win = Ext.create('Ext.window.Window', {
                        modal: true,
                        constrain: true,
                        layout: 'fit',
                        width: 800,
                        height: 500,
                        title: i18n.getKey('非SKU属性'),
                        items: [{
                            xtype: 'grid',
                            selType: 'checkboxmodel',
                            simpleSelect: true,
                            columns: [
                                {
                                    dataIndex: 'id',
                                    width: 80,
                                    text: i18n.getKey('id')
                                },
                                {
                                    dataIndex: 'attribute',
                                    width: 80,
                                    xtype: "componentcolumn",
                                    text: i18n.getKey('attributeId'),
                                    renderer: function (value, metadata, record) {
                                        metadata.tdAttr = 'data-qtip="' + i18n.getKey('check') + i18n.getKey('attribute') + '"';
                                        if (value) {
                                            return {
                                                xtype: 'displayfield',
                                                value: '<a href="#")>' + value.id + '</a>',
                                                listeners: {
                                                    render: function (display) {
                                                        display.getEl().on("click", function () {
                                                            JSOpen({
                                                                id: 'attributepage',
                                                                url: path + 'partials/attribute/attribute.html?attributeId=' + value.id,
                                                                title: i18n.getKey('attribute'),
                                                                refresh: true
                                                            });
                                                        });
                                                    }
                                                }
                                            };
                                        }
                                    }
                                },
                                {
                                    text: i18n.getKey('displayName'),
                                    dataIndex: 'displayName',
                                    renderer: function (value, metadata) {
                                        metadata.tdAttr = 'data-qtip="' + value + '"';
                                        return value;
                                    }
                                },
                                {
                                    dataIndex: 'valueType',
                                    text: i18n.getKey('valueType'),
                                    renderer: function (value, metadata, record) {
                                        return record.get('attribute').valueType;
                                    }
                                },
                                {
                                    dataIndex: 'selectType',
                                    text: i18n.getKey('selectType'),
                                    renderer: function (value, metadata, record) {
                                        var selectType = record.get('attribute').selectType;
                                        var str = '';
                                        if (selectType == 'NON') {
                                            str = '输入型';
                                        } else if (selectType == 'MULTI') {
                                            str = '多选型';
                                        } else {
                                            str = '单选型';
                                        }
                                        return str;
                                    }
                                },
                                {
                                    text: i18n.getKey('options'),
                                    dataIndex: 'options',
                                    tdCls: 'vertical-middle',
                                    itemId: 'options',
                                    width: 300,
                                    renderer: function (value, metadata, record) {
                                        var v = [];
                                        for (var i = 0; i < value.length; i++) {
                                            var data = value[i];
                                            if ((i + 1) % 3 == 0) {
                                                v.push(data.name + '<br>');
                                            } else {
                                                v.push(data.name);
                                            }
                                        }
                                        if (record.get('attribute').inputType == 'Color') {//颜色类型
                                            var color = [];
                                            for (var i = 0; i < v.length; i++) {
                                                var c = v[i];
                                                color.push(c.split(':')[0] + '<a class=colorpick style="background-color:' + c.split(':')[0] + '"></a>');
                                            }
                                            v = color;
                                        }
                                        console.log(v);
                                        v = v.join(',');
                                        return v;
                                    }
                                },
                            ],
                            store: attributeStore
                        }],
                        bbar: {
                            xtype: 'bottomtoolbar',
                            saveBtnCfg: {
                                handler: function (btn) {
                                    var win = btn.ownerCt.ownerCt;
                                    var grid = win.items.items[0];
                                    var selections = grid.getSelectionModel().getSelection();
                                    if (selections.length > 0) {
                                        for (var i = 0; i < selections.length; i++) {
                                            leftGrid.store.proxy.data.push({
                                                id: selections[i].getId(),
                                                displayName: selections[i].get('displayName')
                                            })
                                        }
                                        leftGrid.store.load();
                                        win.close();
                                    }
                                }
                            }
                        }
                    });
                    win.show();
                }
            },
            {
                xtype: 'button',
                iconCls: 'icon_delete',
                text: i18n.getKey('clear'),
                handler: function (btn) {
                    var leftGrid = btn.ownerCt.ownerCt;
                    var deleteIds = leftGrid.getStore().data.keys;
                    leftGrid.deleteRecord(deleteIds)
                }
            }
        ];
        me.listeners = {
            select: function (rowModel, record) {
                var me = this;
                var leftBomTree = rowModel.view.ownerCt;
                var centerGrid = leftBomTree.ownerCt.getComponent('centerGrid');
                var keyValueDTO = me.rawData;
                //新建
                if (Ext.isEmpty(keyValueDTO)) {
                    me.rawData = [];
                    keyValueDTO = me.rawData;
                }
                //查出对应节点的数据
                var skuId = record.get('id');
                var MappingRules = null;
                for (var i = 0; i < keyValueDTO.length; i++) {
                    var item = keyValueDTO[i];
                    if (item.notSkuAttribute.id == skuId) {
                        MappingRules = item.mappingRules;
                        continue;
                    }
                }
                if (MappingRules) {

                } else {
                    MappingRules = []
                    me.rawData.push({
                        notSkuAttribute: {
                            id: record.get('id'),
                            displayName: record.get('displayName')
                        },
                        mappingRules: MappingRules
                    });
                }
                centerGrid.refreshData(MappingRules, record);
            },
        };
        me.callParent();
    }
})
