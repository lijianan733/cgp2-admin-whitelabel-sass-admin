/**
 * Created by nan on 2020/3/26.
 */
Ext.define("CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.SpuAttributeLeftTree", {
    extend: "Ext.tree.Panel",
    split:true,
    controller: Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.controller.Controller'),
    refreshData: function (MMTDetail, materialMappingDTOConfig) {
        var me = this;
        if (MMTDetail.clazz == 'com.qpp.cgp.domain.bom.MaterialSpu') {
            me.getRootNode().removeAll();
            /*    me.getStore().proxy.url = adminPath + 'api/rtTypes/root/rtAttributeDefs';
                me.getStore().load();*/
        } else {
            me.getRootNode().removeAll();
            var spuRtObjectMappings = materialMappingDTOConfig ? materialMappingDTOConfig.spuRtObjectMappings : [];
            me.spuRtObjectMappings = spuRtObjectMappings;
            var childrenNode = me.controller.getMaterialUnSetValueAttribute(MMTDetail._id, me.getRootNode(), spuRtObjectMappings, 'v2');
            if (childrenNode.length > 0) {
                me.ownerCt.tab.show();
                me.ownerCt.show();
                me.getRootNode().appendChild(childrenNode);
                me.expandAll()

            } else {
                me.ownerCt.tab.hide();
                me.ownerCt.hide();
                /*
                                me.ownerCt.ownerCt.setActiveTab(1);
                */
            }
            /* */
            /*  me.getStore().load({
                  callback: function (records) {
                      me.expandAll();
                      if (records.length > 0) {
                      } else {
                          me.ownerCt.tab.hide();
                          me.ownerCt.hide();
                          me.ownerCt.ownerCt.setActiveTab(1);
                      }
                  }
              })*/
        }
    },
    height: '100%',
    rootVisible: false,
    spuRtObjectMappings: null,
    getValue: function () {
        //遍历整个数，把是叶子节点中的spuRtObjectMappingDTOConfig属性值取出
        var me = this;
        var result = [];
        var root = me.getRootNode();
        root.cascadeBy(function (node) {
            if (node.isLeaf() == true) {//叶子节点
                var mappingRules = node.get('spuRtObjectMappingDTOConfig');
                if (mappingRules.length > 0) {
                    var path = node.get('path');
                    result.push({
                        clazz: "com.qpp.cgp.domain.product.config.material.mapping2dto.SpuRtObjectMappingDTOConfig",
                        mappingRules: mappingRules,
                        spuAttributePath: path
                    })
                }
            }
        })
        return result;
    },
    initComponent: function () {
        var me = this;
        //在树上的节点上，以spuRtObjectMappingDTOConfig来储存数据,使grid中的store指向同一个数组
        me.store = Ext.create('Ext.data.TreeStore', {
            storeId: 'rtAttributeTreeStore',
            idReference: 'id',
            root: {
                _id: "root",
                id: 'root'
            },
            fields: [
                'name',
                'id',
                'children',
                'path',
                'leaf',
                'rtAttributeDef',
                'spuRtObjectMappingDTOConfig',
                {
                    name: 'icon',
                    type: 'string',
                    defaultValue: path + 'partials/material/category.png'
                }
            ],
            proxy: {
                type: 'memory'
            },

            /*
                        listeners: {
                            'load': function (store, node, records) {
                                Ext.each(records, function (item) {
                                    item.setId(item.data.parentId + ',' + item.data._id);
                                    var path = item.get('name');
                                    item.set('path', (item.parentNode.get('name') ? item.parentNode.get('name') + ',' : '') + item.get('name'));
                                    item.commit();
                                });
                                Ext.Array.each(records, function (item) {
                                    var path = item.getPath('name');
                                    var array = path.split('/');
                                    var valuePath = '$';
                                    Ext.Array.each(array, function (item) {
                                        if (!Ext.isEmpty(item)) {
                                            valuePath += '.' + item;
                                        }
                                    });
                                });
                                Ext.each(records, function (item) {
                                    item.set('spuRtObjectMappingDTOConfig', [])
                                    if (me.spuRtObjectMappings.length > 0) {
                                        for (var i = 0; i < me.spuRtObjectMappings.length; i++) {
                                            var spuRtObjectMapping = me.spuRtObjectMappings[i];
                                            if (spuRtObjectMapping.spuAttributePath == item.get('path')) {
                                                item.set('spuRtObjectMappingDTOConfig', spuRtObjectMapping.mappingRules);
                                            }
                                        }
                                    }
                                    item.commit();
                                });
                            }
                        }
            */
        });
        me.store.proxy.url = adminPath + 'api/rtTypes/root/rtAttributeDefs';
        me.columns = [
            {
                xtype: 'treecolumn',
                text: i18n.getKey('Spu') + i18n.getKey('attribute'),
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
            {
                text: i18n.getKey('required'),
                width: 80,
                renderer: function (value, mateData, record) {
                    if (record.raw) {
                        return record.raw.requiredToRtType;
                    } else {
                        return value;
                    }
                }
            }
        ];
        me.listeners = {
            afterrender: function () {
                me.expandAll();
            },
            select: function (rowModel, record) {
                var leftBomTree = rowModel.view.ownerCt;
                var spuAttributeMappingGrid = leftBomTree.ownerCt.getComponent('spuAttributeMappingGrid');
                console.log(record.raw)
                if (record.isLeaf()) {
                    var data = record.getData();
                    console.log(data.spuRtObjectMappingDTOConfig);
                    spuAttributeMappingGrid.refreshData(data);
                } else {
                    spuAttributeMappingGrid.refreshData();
                }

            },
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
            }
        }
        me.callParent();
    }
})
