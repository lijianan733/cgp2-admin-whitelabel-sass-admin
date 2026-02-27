/**
 * Created by nan on 2020/3/26.
 */
Ext.define("CGP.virtualcontainertype.view.condition.LeftTreePanel", {
    extend: "Ext.tree.Panel",
    rawData: null,//原始值
    controller: Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.controller.Controller'),
    getValue: function () {
        //遍历整个数，把是叶子节点中的spuRtObjectMappingDTOConfig属性值取出
        var me = this;
        var result = [];
        var root = me.getRootNode();
        var mappingRules = me.rawData;
        root.cascadeBy(function (node) {
            if (node.isLeaf() == true) {//叶子节点
                var path = node.get('path');
                for (var i = 0; i < mappingRules.length; i++) {
                    if (path == mappingRules[i].key) {
                        var conditionValueDTO = mappingRules[i].mappingRules;
                        if (conditionValueDTO && conditionValueDTO.length > 0) {
                            result.push({
                                mappingRules: conditionValueDTO,
                                key: path
                            })
                        }
                    }
                }
            }
        })
        return result;
    },
    setValue: function (data) {
        var me = this;
        me.rawData = data;
    },
    height: '100%',
    rootVisible: false,
    spuRtObjectMappings: null,
    initComponent: function () {
        var me = this;
        me.rawData = [];
        //在树上的节点上，以spuRtObjectMappingDTOConfig来储存数据,使grid中的store指向同一个数组
        me.store = Ext.create('CGP.material.store.RtAttributeTree', {
            listeners: {
                beforeload: function (sto, operation, e) {
                    var type = operation.node.get('valueType');
                    var rtTypeId;
                    var customType = operation.node.get('customType');
                    if (customType) {
                        rtTypeId = customType['_id'];
                    }
                    if (type == 'CustomType') {
                        sto.proxy.url = adminPath + 'api/rtTypes/' + rtTypeId + '/rtAttributeDefs';
                    }
                },
                load: function (store, node, records) {
                    dealNode = function (records, parentNode) {
                        Ext.each(records, function (item) {
                            if (item.children) {
                                var parentName = parentNode.get('name');
                                var currentName = (parentName ? parentName + '.' : '') + item.get('name');
                                item.set('path', currentName);
                                dealNode(item.children, item);
                            } else {
                                var parentName = parentNode.get('name');
                                var currentName = (parentName ? parentName + '.' : '') + item.get('name');
                                item.set('path', currentName);
                            }
                        });
                    };
                    dealNode(records, node);
                }
            }
        });
        me.columns = [
            {
                xtype: 'treecolumn',
                text: i18n.getKey('attribute'),
                flex: 1,
                dataIndex: 'name',
                renderer: function (value, mateData, record) {
                    if (record.raw.rtAttributeDef) {
                        return value + '(' + record.raw.rtAttributeDef._id + ')';
                    } else {
                        return value;
                    }
                }
            },
        ];
        me.listeners = {
            afterrender: function () {
                me.expandAll();
            },
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
                var currentKey = record.get('path');
                var MappingRules = null;
                for (var i = 0; i < keyValueDTO.length; i++) {
                    var item = keyValueDTO[i];
                    if (item.key == currentKey) {
                        MappingRules = item.mappingRules;
                        continue;
                    }
                }
                if (Ext.isEmpty(MappingRules)) {
                    MappingRules = []
                    me.rawData.push({
                        key: currentKey,
                        mappingRules: MappingRules
                    });
                }
                centerGrid.refreshData(MappingRules, record);
            },
        }
        me.callParent();
    }
})
