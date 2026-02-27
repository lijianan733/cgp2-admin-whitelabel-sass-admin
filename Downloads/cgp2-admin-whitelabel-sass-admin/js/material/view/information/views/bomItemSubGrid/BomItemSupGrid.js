Ext.define("CGP.material.view.information.views.bomItemSubGrid.BomItemSupGrid", {
    extend: "Ext.grid.Panel",
    defaults: {
        width: 150
    },
    autoScroll: true,
    store: Ext.create("CGP.material.store.BomItem", {
        data: []
    }),
    minHeight: 120,
    bodyStyle: 'border-color:silver;',
    header: {
        style: 'background-color:white;',
        color: 'black',
        border: '0 0 0 0'
    },
    viewConfig: {
        enableTextSelection: true
    },
    itemMaterialInfo: {},//关联物料信息
    constructor: function (config) {
        var me = this;
        //设置一个全局的方法
        if (!window.controller) {
            window.controller = Ext.create('CGP.material.controller.Controller');
        }
        me.columns = [
            {
                xtype: 'actioncolumn',
                itemId: 'actioncolumn',
                sortable: false,
                resizable: false,
                width: 70,
                tdCls: 'vertical-middle',
                menuDisabled: true,
                items: [
                    {
                        iconCls: 'icon_edit icon_margin',
                        tooltip: i18n.getKey('update'),
                        handler: function (view, rowIndex, colIndex, a, b, record) {
                            var store = me.store;
                            var editOrNew = 'modify';
                            var bomItemType = record.get('clazz');
                            var isLeaf = arguments[0].ownerCt.data.isLeaf == true || arguments[0].ownerCt.data.isLeaf == 'true';//这是传进来的data配置
                            var parentId = arguments[0].ownerCt.data.parentId == 'root' || arguments[0].ownerCt.data.parentId == null;
                            var isCanSave = !(isLeaf && parentId);
                            window.controller.editBomItem(store, record, editOrNew, me.data, bomItemType, null, isCanSave);
                        }
                    },
                    {
                        iconCls: 'icon_remove icon_margin',
                        itemId: 'actiondelete',
                        tooltip: i18n.getKey('remove'),
                        isDisabled: function (gridView, rowIndex, colIndex, dom, record) {
                            var bomItemPanel = arguments[0].ownerCt.ownerCt;
                            if (bomItemPanel.isCreate) {
                                //新建流程中,继承的bomItem不能删除，只能转换为固定件,根据记录里面是否有isExtend来判断是否为继承的bomItem
                                return record.raw.isExtend;

                            } else {
                                //叶子节点，或者该物料没父节点
                                var isLeaf = arguments[0].ownerCt.data.isLeaf == true || arguments[0].ownerCt.data.isLeaf == 'true';
                                var parentId = arguments[0].ownerCt.data.parentId == 'root' || arguments[0].ownerCt.data.parentId == null;
                                var isHide = isLeaf && parentId;
                                return !isHide;
                            }
                        },
                        handler: function (view, rowIndex, colIndex, a, b, record) {
                            var store = view.store;
                            var supStoreRecord = '';
                            var supStore = Ext.data.StoreManager.getByKey('BomItem');
                            for (var i = 0; i < supStore.getCount(); i++) {
                                supStoreRecord = supStore.getAt(i);
                                if (supStoreRecord.get('_id') == record.get('_id')) {
                                    break;
                                }
                            }
                            Ext.Msg.confirm('提示', '确定删除？', callback);

                            function callback(id) {
                                if (id === 'yes') {
                                    store.removeAt(rowIndex);
                                    supStore.remove(supStoreRecord);
                                    me.setVisible(me.store.getCount());
                                }
                            }
                        }
                    },
                    {
                        iconCls: 'icon_config icon_margin',
                        itemId: 'actionconfig',
                        tooltip: i18n.getKey('deployFixed'),
                        isDisabled: function () {
                            var isLeaf = arguments[0].ownerCt.data.leaf == true || arguments[0].ownerCt.data.leaf == 'true';
                            var isHide = isLeaf && arguments[4].get('clazz') != 'com.qpp.cgp.domain.bom.bomitem.FixedBOMItem';
                            return !isHide;
                        },
                        handler: function (view, rowIndex, colIndex, a, b, record) {
                            var materialType = me.data.type;
                            var store = view.store;
                            if (record.get('clazz') == 'com.qpp.cgp.domain.bom.bomitem.OptionalBOMItem') {
                                window.controller.deployFixed(store, record, rowIndex, materialType);
                            } else if (record.get('clazz') == 'com.qpp.cgp.domain.bom.bomitem.UnassignBOMItem') {
                                window.controller.createFixed(store, record, rowIndex, materialType);
                            }
                        }
                    }
                ]
            },
            {
                dataIndex: '_id',
                text: i18n.getKey('id'),
                width: 100,
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
                    var value = v['_id'];
                    metaData.tdAttr = 'data-qtip="' + value + '"';
                    var parentId = '';
                    var material = {};
                    var itemMaterialInfo = this.itemMaterialInfo;
                    if (itemMaterialInfo[value]) {
                        material = itemMaterialInfo[value];
                    } else {
                        Ext.Ajax.request({
                            url: adminPath + 'api/materials/' + v['_id'],
                            method: 'GET',
                            async: false,
                            params: {
                                page: 1,
                                limit: 10
                            },
                            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                            success: function (res) {
                                var responseMessage = Ext.JSON.decode(res.responseText);
                                material = responseMessage.data;
                                itemMaterialInfo[v['_id']] = material;
                                if (responseMessage.success) {
                                } else {
                                    Ext.Msg.alert('提示', '请求错误：' + responseMessage.data.message);
                                    return;
                                }

                            },
                            failure: function (resp) {
                                var response = Ext.JSON.decode(resp.responseText);
                                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                return;
                            }
                        })
                    }
                    if (material.parentMaterialType) {
                        parentId = material.parentMaterialType['_id'];
                    }
                    return '<a style="text-decoration: none;" onclick="javascript:controller.checkMaterial(' + material['_id'] + ',' + material.leaf + ',' + parentId + ')" href="#">' + material.name + '<' + material['_id'] + '>' + '</a>';
                }
            },
            /* {
                 dataIndex: 'quantityStrategy',
                 text: i18n.getKey('quantityStrategy'),
                 width: 100,
                 tdCls: 'vertical-middle',
                 itemId: 'quantityStrategy'
             },*/
            {
                dataIndex: 'quantity',
                text: i18n.getKey('quantity'),
                itemId: 'quantity',
                width: 100,
                xtype: 'componentcolumn',
                tdCls: 'vertical-middle',
                renderer: function (value, metadata, record) {
                    //var returnStr = null;
                    var quantityDesc = record.get('quantityDesc');
                    if ((Ext.isEmpty(value) || value == 0) && !Ext.isEmpty(quantityDesc)) {
                        var id = JSGetUUID();
                        return {
                            //displayfield无click事件，故无法直接添加监听
                            xtype: 'displayfield',
                            fieldLabel: i18n.getKey('quantityDesc'),
                            value: '<a href="#" id=' + id + '>' + '查看' + '</a>',
                            listeners: {
                                render: function (display) {
                                    var clickElement = document.getElementById(id);
                                    if (!Ext.isEmpty(clickElement)) {
                                        clickElement.addEventListener('click', function () {
                                            var valueString = JSON.stringify(quantityDesc, null, "\t");
                                            var win = Ext.create("Ext.window.Window", {
                                                id: "quantityDesc",
                                                modal: true,
                                                layout: 'fit',
                                                title: i18n.getKey('quantityDesc'),
                                                items: [
                                                    {
                                                        xtype: 'textarea',
                                                        fieldLabel: false,
                                                        width: 800,
                                                        height: 500,
                                                        value: valueString
                                                    }
                                                ]
                                            });
                                            win.show();
                                        }, false);
                                    }
                                }
                            }
                        };
                    } else {
                        if (value != 0) {
                            return value;
                        } else {
                            return '';
                        }
                    }
                }
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
        me.callParent(arguments)
    },
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        var store = me.getStore();
        store.on('datachanged', function (thisStore) {
            var count = thisStore.getCount();
            me.setVisible(count);
        })
    }

})
