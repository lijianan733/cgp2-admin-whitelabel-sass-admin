/**
 * Created by miao on 2021/10/11.
 */
Ext.Loader.setPath('CGP.virtualcontainerobject', '../../../app');
Ext.define("CGP.virtualcontainerobject.view.argumentbuilder.LeftTree", {
    extend: "Ext.tree.Panel",
    alias: 'widget.blefttree',
    collapsible: true,
    config: {
        rootVisible: false,
        useArrows: true,
        viewConfig: {
            stripeRows: true,
            // selectedItemCls: '',
            // focusedItemCls: '',
            // overItemCls: ''
        }
    },
    // autoScroll: true,
    children: null,
    selModel: {
        selType: 'rowmodel',
        checkOnly: true
    },
    multiSelect: false,
    valueJsonObject: {},
    objectJson: {},
    itemId: 'rtTypeObject',
    data: {},
    rtTypeId: null,//跟节点rtType
    currRtType: null,//当前vct rtType
    itemRtType: null,//repeat 子vct rtType
    hiddenValue: false,//是否隐藏Values列
    rootNode: 'root',
    hasReset: true,
    readOnly: false,
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.virtualcontainerobject.controller.VirtualContainerObject');

        me.title = i18n.getKey('rtObject');

        me.store = Ext.create('CGP.material.store.RtAttributeTree', {
            root: {
                _id: "root"
            }
        });
        if (me.rtTypeId) {
            me.store.proxy.url = adminPath + 'api/rtTypes/' + me.rtTypeId + '/rtAttributeDefs';
        }
        me.store.on('load', function (store, node, records) {
            Ext.Array.each(records, function (item) {
                me.setConditionValue(item);
            });
        });
        me.columns = [
            {
                xtype: 'treecolumn',
                text: i18n.getKey('name'),
                //tdCls: 'vertical-middle',
                flex: 1,
                dataIndex: 'name',
                renderer: function (value, metadata, record) {
                    return record.get('name').indexOf('item_') >= 0 ? record.get("name") : record.get("name") + '<font color="green"><' + record.get('_id') + '></font>';
                }
            },
        ];
        me.listeners = {
            afterrender: function () {
                //me.expandAll();
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
                } else {
                    //sto.proxy.url = adminPath + 'api/admin/runtimeType/rtTypes/{id}/rtAttributeDefs';
                }
            },
            beforeitemexpand: function (eOpts) {
                // console.log(eOpts);
                if (!eOpts.isRoot() && eOpts.parentNode.isRoot()) {
                    eOpts.parentNode.childNodes.forEach(function (item) {
                        if (item != eOpts && item.isExpanded()) {
                            item.collapse();
                        }
                    })
                }
                //me.getSelectionModel().selectAll();
            },
            beforeselect: function (rowModel, record) {
                var leftTree = rowModel.view.ownerCt;
                var conditionValueGrid = leftTree.ownerCt.getComponent('conditionValueGrid');
                if (conditionValueGrid && conditionValueGrid.getValue() > 0 && conditionValueGrid.isDirty) {
                    var saveBtn = conditionValueGrid.getDockedItems('toolbar[dock="top"]')[0].getComponent('saveBtn');
                    Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('是否保存当前的修改?'), function (selector) {
                        if (selector == 'yes') {
                            saveBtn.handler(saveBtn);

                        } else {
                            conditionValueGrid.isDirty = false;
                        }
                    })
                    return false;
                } else {
                    return true;
                }

            },
            select: function (rowModel, record, index, eOpts) {
                var leftBomTree = rowModel.view.ownerCt;
                var outcenterpanel = leftBomTree.ownerCt.down('outcenterpanel');
                for (var item of outcenterpanel.items.items) {
                    if (item.hidden) {
                        continue;
                    }
                    if (record.isLeaf()) {
                        item.refreshData(record.data);
                    } else {
                        item.refreshData();
                    }
                }
            },
            itemcontextmenu: function (view, record, item, index, e, eOpts) {
                me.itemEventMenu(view, record, item, e);
            },
        };
        me.tbar = [
            {
                xtype: 'displayfield',
                width: 2
            },
            {
                xtype: 'button',
                itemId: 'addRepeat',
                text: i18n.getKey('add') + i18n.getKey('repeat') + i18n.getKey('rtType'),
                disabled: true,
                hidden: true,
                // handler:function (btn){
                //     var ttt=Ext.ComponentQuery.query('toolbar [itemId="addRepeat"]');
                // }
            }
        ];
        me.callParent(arguments);

        // me.down('toolbar').add(rtTypeTreeCombo, checkRtType);
        me.store.load({
            callback: function (records) {
                me.expandAll();
                //me.getSelectionModel().selectAll();
            }
        });
    },

    getValue: function () {
        var me = this, data = null;
        data = me.data || {};
        var controller = Ext.create('CGP.virtualcontainerobject.controller.VirtualContainerObject');
        var rtTypeId = me.currRtType;
        var rtType = {_id: rtTypeId, idReference: 'RtType', clazz: domainObj['RtType']};
        var rtTypeData = {};
        if (Ext.isEmpty(rtTypeId)) {
            return rtTypeData;
        }
        var root = me.getRootNode();
        var mappingRules = [];
        data['map'] = [];
        // var
        var getPathValue = function (node) {
            node.childNodes.forEach(function (nodeItem) {
                if (nodeItem.isLeaf()) {
                    if (nodeItem.data.conditionValue && !Ext.Object.isEmpty(nodeItem.data.conditionValue)) {
                        var rule = {
                            key: nodeItem.getPath('name'),
                            mappingRules: nodeItem.data.conditionValue,
                        };
                        mappingRules.push(rule);
                    }
                } else {
                    getPathValue(nodeItem);
                }
            });
        }
        var getMapValue = function (node) {
            var result = [];
            node.childNodes.forEach(function (nodeItem) {
                if (nodeItem.isLeaf()) {
                    if (nodeItem.data.conditionValue && !Ext.Object.isEmpty(nodeItem.data.conditionValue)) {
                        result.push({
                            key: nodeItem.getPath('name').replace(/item_{1}\d*\//,'').replace('//', '$.').replace(/\//g, '.'),
                            value: nodeItem.data.conditionValue,
                        });
                    }
                } else {
                    getPathValue(nodeItem);
                }
            });
            return result;
        }
        if (me.isRepeat) {
            root.childNodes.forEach(function (nodeItem) {
                data['map'].push({
                    key: 'repeat', value:
                        {
                            "clazz": "com.qpp.cgp.domain.pcresource.virtualcontainer.ExpressionValue",
                            "valueEx": {
                                "clazz": "com.qpp.cgp.value.ExpressionValueEx",
                                'constraints':[],
                                'expression':{
                                    "clazz": "com.qpp.cgp.expression.Expression",
                                    "expressionEngine": "JavaScript",
                                    "inputs": [],
                                    "expression": 'function expression(args) { return ' + JSON.stringify(getMapValue(nodeItem)) + '; }',
                                    "resultType": "Array",
                                    "promptTemplate": ""
                                }
                            }
                        }
                });
            })
        } else {
            getPathValue(root);
            data["mappingRules"] = mappingRules;
            data['map'] = controller.mapKeyValue(mappingRules, me);
        }

        return data;
    },
    setValue: function (data) {
        var me = this;
        if (Ext.isEmpty(data) || Ext.Object.isEmpty(data)) {
            return false;
        }
        var isRepeat=data[0]?.key=='repeat';
        var rtTypeId = me.rtTypeId;
        var controller = Ext.create('CGP.virtualcontainerobject.controller.VirtualContainerObject');

        if (isRepeat) {//repeat set value
            me.repeatData=[];
            var itemRtTypeId = me.currRtType;
            me.store.proxy.url = adminPath + 'api/rtTypes/' + itemRtTypeId + '/rtAttributeDefs';
            if (data) {
                data.forEach(function (item, index) {
                    var itemF=new Function('return '+item.value?.valueEx?.expression?.expression)();
                    var itemValue=Ext.isFunction(itemF)?itemF():[];
                    itemValue=itemValue.map(function (el){
                        el.key=el.key.replace('$.','//').replace(/\./g, '/').replace('//',('//'+'item_' + index+'/'));
                        return el;
                    })
                    me.repeatData=me.repeatData.concat(itemValue);
                    me.valueJsonObject['item_' + index] = itemValue;
                    me.objectJson['item_' + index] = itemValue;
                    controller.addItemNode(me, me.itemRtType, itemValue);
                })
            }
        }
        else{
            me.data = data;
            me.store.proxy.url = adminPath + 'api/rtTypes/' + rtTypeId + '/rtAttributeDefs';
            me.store.load();
        }

    },
    setConditionValue: function (rec) {
        var me = this;
        var path = rec.getPath('name');
        // var path = rec.getPath('name').replace('//', '$.').replace(/\//g, '.');
        if (me.data && me.data.length>0) {
            if (!Ext.isArray(me.data)) {
                return false;
            }
            me.data.forEach(function (item) {
                if (path == item.key) {
                    rec.data.conditionValue = item.mappingRules;
                }
            })
        }
        else if(me.repeatData&&me.repeatData.length>0){
            if (!Ext.isArray(me.repeatData)) {
                return false;
            }
            me.repeatData.forEach(function (item) {
                if (path == item.key) {
                    rec.data.conditionValue = item.value;
                }
            })
        }
    },
    itemEventMenu: function (view, record, item, e) {
        var me = this;
        e.stopEvent();
        if (record.get('name').indexOf('item_') == 0) {
            var menu = Ext.create('Ext.menu.Menu', {
                items: [
                    {
                        text: i18n.getKey('delete'),
                        disabledCls: 'menu-item-display-none',
                        hidden: record.get('leaf'),
                        itemId: 'delete',
                        handler: function (btn) {
                            Ext.Msg.confirm(i18n.getKey('info'),i18n.getKey('deleteConfirm'), function (select) {
                                if (select == 'yes') {
                                    var nodeName=record.get('name');
                                    me.repeatData.forEach(function (item){
                                        if(item.key.indexOf(nodeName)>=0){
                                            Ext.Array.remove(me.repeatData,item);
                                        }
                                    });
                                    record.remove();
                                }
                            });
                        }
                    },
                ]
            });
            menu.showAt(e.getXY());
        }
    },
})
;
