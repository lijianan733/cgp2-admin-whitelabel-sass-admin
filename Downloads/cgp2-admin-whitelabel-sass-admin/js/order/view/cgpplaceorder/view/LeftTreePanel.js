/**
 * Created by nan on 2019/9/3.
 * 根据ProductmaterialviewType中包含的各条记录的materialPath,组合成一颗需要定制物料组成的数，
 * 根节点为bom关联的物料
 * productMaterialViewTypes数组中的materialPath获取需定制的物料，重复说明有多个定制面
 * materials中获取物料对应的信息
 */
Ext.define('CGP.order.view.cgpplaceorder.view.LeftTreePanel', {
    extend: 'Ext.tree.Panel',
    region: 'west',
    width: 300,
    split: true,
    productConfig: '',//数据源
    rootVisible: false,
    viewConfig: {
        onItemMouseEnter: function (record, item, index, e) {//鼠标进入的事件处理
            if (record.isLeaf() == false) {
                return;
            }
            if (this.trackOver) {
                this.highlightItem(item);
            }
        },
        enableTextSelection: true
    },
    productMaterialViewTypes: null,
    materialViewTypes: null,
    productId: null,
    editOrCreate: 'create',
    currentShowPanel: null,//记录当前显示的panel
    //title: 'material',
    initComponent: function () {
        var me = this;
        //根据productMaterialViewTypes来组成树
        var treeData = {};
        var treeDataArr = [];
        var productMaterialViewTypes = me.productConfig.libraries.productMaterialViewTypes;
        var materials = me.productConfig.libraries.materials;
        var materialViewTypes = me.productConfig.libraries.materialViewTypes;
        var pageContentSchemas = me.productConfig.libraries.pageContentSchemas;
        for (var i = 0; i < productMaterialViewTypes.length; i++) {
            var item = productMaterialViewTypes[i];
            var materialId = item.materialPath.split(',').pop();
            var materialViewTypeId = item.materialViewType._id;
            var materialViewType = null;
            var pageContentSchemaId = null;
            var pageContentSchema = null;
            if (Ext.Object.isEmpty(treeData[materialId])) {
                for (var j = 0; j < materials.length; j++) {
                    if (materialId == materials[j]._id) {
                        var data = {
                            _id: materials[j]._id,
                            name: materials[j].name,
                            leaf: false,
                            icon: path + 'ClientLibs/extjs/resources/themes/images/ux/spumaterial.png',
                            children: []
                        }
                        treeData[materialId] = data;
                    }
                }
            }
            for (var j = 0; j < materialViewTypes.length; j++) {//查materialViewType
                if (materialViewTypeId == materialViewTypes[j]._id) {
                    materialViewType = materialViewTypes[j];
                }
            }
            for (var j = 0; j < materialViewTypes.length; j++) {//查materialViewType
                if (materialViewTypeId == materialViewTypes[j]._id) {
                    materialViewType = materialViewTypes[j];
                    pageContentSchemaId = materialViewType.pageContentSchema._id;
                }
            }
            for (var j = 0; j < materialViewTypes.length; j++) {//查pageContentSchema
                if (pageContentSchemaId == pageContentSchemas[j]._id) {
                    pageContentSchema = pageContentSchemas[j];
                }
            }
            if (!Ext.isEmpty(treeData[materialId])) {
                treeData[materialId].children.push({
                    _id: JSGetUUID(),
                    name: item.name,
                    leaf: true,
                    icon: path + 'ClientLibs/extjs/resources/themes/images/ux/category.png',
                    materialId: materialId,
                    productMaterialViewType: item,
                    materialViewType: materialViewType,
                    pageContentSchema: pageContentSchema
                });
            }
        }
        for (var i in treeData) {
            treeDataArr.push(treeData[i]);
        }
        me.store = Ext.create('Ext.data.TreeStore', {
            autoLoad: true,
            autoSync: true,
            fields: [
                'name',
                '_id',
                {
                    name: 'materialViewType',
                    type: 'object'
                },
                {
                    name: 'pageContentSchema',
                    type: 'object'
                },
                {
                    name: 'productMaterialViewType',
                    type: 'object'
                },
                'materialId'
            ],
            root: {
                expanded: true,
                name: 'root',
                children: treeDataArr
            }
        });
        me.columns = [{
            flex: 1,
            xtype: 'treecolumn',
            dataIndex: 'name',
            text: i18n.getKey('需要定制的productMaterialView'),
            renderer: function (value, meta, record) {
                if (record.isLeaf()) {
                    return value + ' <' + record.get('productMaterialViewType')._id + '><font color="green">-PMVT</font>';
                } else {
                    return value;
                }
            }
        }];
        me.listeners = {
            afterrender: function (panel) {
                panel.expandAll();
                console.log(panel)
                var centerPanel = me.ownerCt.getComponent('centerPanel');
                var rootNode = panel.getRootNode();
                rootNode.cascadeBy(function (record) {
                    var mvt = record.get('materialViewType');
                    if (record.isLeaf()) {
                        if (panel.editOrCreate == 'create') {
                            centerPanel.add({
                                xtype: 'cgpproductviewtypepanel',
                                title: record.get('name'),
                                header: false,
                                materialViewType: mvt,
                                hidden: true,
                                itemId: record.get('_id'),
                                productMaterialViewType: record.get('productMaterialViewType'),
                                width: record.get('pageContentSchema').width,
                                height: record.get('pageContentSchema').height,
                                minCount: mvt.pageContentRange ? eval('var a=' + mvt.pageContentRange.minExpression + ';a()') : 1,
                                maxCount: mvt.pageContentRange ? (mvt.pageContentRange.maxExpression ? eval('var a=' + mvt.pageContentRange.maxExpression + ';a()') : null) : null,
                            })
                        } else {
                            var photoData = null;
                            for (var i = 0; i < panel.productConfig.photos.length; i++) {
                                if (record.get('productMaterialViewType')._id == panel.productConfig.photos[i].productMaterialViewType_id) {
                                    photoData = panel.productConfig.photos[i];
                                    break;
                                }
                            }
                            centerPanel.add({
                                xtype: 'editorderlineitempanel',
                                title: record.get('name'),
                                photoData: photoData,
                                itemId: record.get('_id'),
                                hidden: true,
                                materialViewType: mvt,
                                width: record.get('pageContentSchema').width,
                                height: record.get('pageContentSchema').height,
                                productInstance: panel.productConfig,
                                productMaterialViewType: record.get('productMaterialViewType'),
                                minCount: mvt.pageContentRange ? eval('var a=' + mvt.pageContentRange.minExpression + ';a()') : 1,
                                maxCount: mvt.pageContentRange ? (mvt.pageContentRange.maxExpression ? eval('var a=' + mvt.pageContentRange.maxExpression + ';a()') : null) : null,
                            })
                        }
                    } else {
                       ;

                    }
                })

            },
            beforeselect: function (selModel, record, row) {
                if (record.isLeaf() == false) {/*
                    if (me.currentShowPanel) {
                        me.currentShowPanel.hide();
                    }*/
                    selModel.select(selModel.getLastSelected());
                    return false;
                }
            },
            beforedeselect: function (selModel, record, row) {
               
            },
            select: function (selmodel, record, row) {
                var me = this;
                var centerPanel = me.ownerCt.getComponent('centerPanel');
                for (var i = 0; i < centerPanel.items.items.length; i++) {
                    centerPanel.items.items[i].hide();
                }
                me.currentShowPanel = centerPanel.getComponent(record.get('_id'));
                me.currentShowPanel.show();
            }
        }
        me.callParent();
    }
})
