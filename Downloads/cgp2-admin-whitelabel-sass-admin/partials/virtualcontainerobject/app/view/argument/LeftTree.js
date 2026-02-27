/**
 * Created by miao on 2021/10/11.
 */
Ext.Loader.setPath('CGP.virtualcontainerobject', '../../../app');
Ext.define("CGP.virtualcontainerobject.view.argument.LeftTree", {
    extend: "Ext.tree.Panel",
    collapsible: true,
    width: '100%',
    config: {
        rootVisible: false,
        useArrows: true,
        viewConfig: {
            stripeRows: true,
            selectedItemCls: '',
            focusedItemCls: '',
            overItemCls: ''
        }
    },
    // autoScroll: true,
    children: null,
    selModel: {
        selType: 'rowmodel',
        checkOnly: true
    },
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
                _id: "root",
                children: []
            }
        });
        if (me.rtTypeId) {
            me.store.proxy.url = adminPath + 'api/rtTypes/' + me.rtTypeId + '/rtAttributeDefs';
        }
        // else {
        //     me.store.proxy.url = adminPath + 'api/rtTypes/rtAttributeDefs';
        // }
        me.store.on('load', function (store, node, records, succ, eOpts) {
            Ext.Array.each(records, function (item) {
                controller.organizeValueObject(me, node, item.data);
            });
            //me.getSelectionModel().selectAll();
        });
        me.columns = [
            {
                xtype: 'treecolumn',
                text: i18n.getKey('name'),
                //tdCls: 'vertical-middle',
                width: 350,
                dataIndex: 'name',
                renderer: function (value, metadata, record) {
                    return record.get('name').indexOf('item_') >= 0 ? record.get("name") : record.get("name") + '<font color="green"><' + record.get('_id') + '></font>';
                }
            },
            {
                text: i18n.getKey('value'),
                xtype: 'componentcolumn',
                width: 450,
                dataIndex: 'value',
                sortable: false,
                hidden: me.hiddenValue,
                renderer: function (value, metadata, record, a, b, c, view) {
                    return controller.createValueComp(record, me);
                }
            }
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
                if (!eOpts.isRoot() && eOpts.parentNode.isRoot()) {
                    eOpts.parentNode.childNodes.forEach(function (item) {
                        if (item != eOpts && item.isExpanded()) {
                            item.collapse();
                        }
                    })
                }
            },
            itemcontextmenu: function (view, record, item, index, e, eOpts) {
                me.itemEventMenu(view, record, item, e);
            },
            expand: function (node) {
                var tt = node;
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
        // me.down('toolbar').add();
        me.store.load({
            callback: function (records) {
                me.expandAll();
                //me.getSelectionModel().selectAll();
            }
        });
    },
    getJsonObjectValue: function () {
        var me = this;
        return me.valueJsonObject;
    },
    getValue: function () {
        var me = this;
        var rtTypeId = me.currRtType;
        var rtType = {_id: rtTypeId, idReference: 'RtType', clazz: domainObj['RtType']};
        var rtObjectData = {
            "_id": me.data?._id || JSGetCommonKey().toString(),
            "clazz": "com.qpp.cgp.domain.bom.runtime.RtObject",
            "idReference": "RtObject",
            "rtType": rtType,

        };
        if (me.itemRtType) {//repeat value 处理逻辑
            var repeatData = [];
            for (var k in me.valueJsonObject) {
                repeatData.push(me.valueJsonObject[k]);
            }
            rtObjectData["objectJSON"] = {"repeat": repeatData, "rtType": me.itemRtType};
        } else {
            rtObjectData["objectJSON"] = me.valueJsonObject;
        }
        var rtObjectString = JSON.stringify(rtObjectData);
        Ext.Ajax.request({
            url: adminPath + 'api/bom',
            method: 'POST',
            async: false,
            jsonData: [
                {
                    "entities": [rtObjectString],
                    "entityName": "RtObject"
                }
            ],
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (res) {
                var responseMessage = Ext.JSON.decode(res.responseText);
                if (!responseMessage.success) {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });
        return rtObjectData;

    },

    setValue: function (data) {
        var me = this;
        if (Ext.isEmpty(data) || Ext.Object.isEmpty(data)) {
            return false;
        }
        var controller = Ext.create('CGP.virtualcontainerobject.controller.VirtualContainerObject');
        me.data = data;
        me.valueJsonObject = {};
        me.objectJson = {};
        // me.rtTypeId=data?.rtType?._id;
        me.getRootNode().removeAll();
        if (data?.objectJSON?.rtType?._id) {//repeat set value
            var itemRtTypeId = data?.objectJSON?.rtType?._id || me.itemRtType;
            me.store.proxy.url = adminPath + 'api/rtTypes/' + itemRtTypeId + '/rtAttributeDefs';
            if (data?.objectJSON) {
                data.objectJSON.repeat.forEach(function (itemValue, index) {
                    me.valueJsonObject['item_' + index] = itemValue;
                    me.objectJson['item_' + index] = itemValue;
                    controller.addItemNode(me, data.objectJSON?.rtType, itemValue);
                })
            }
        } else {
            me.objectJson = data?.objectJSON;
            if (data?.objectJSON && !Ext.Object.isEmpty(data?.objectJSON)) {
                me.valueJsonObject = data?.objectJSON
            }
            var rtTypeId = me.data?.rtType?._id || me.rtTypeId;
            me.store.proxy.url = adminPath + 'api/rtTypes/' + rtTypeId + '/rtAttributeDefs';
            me.store.load();
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
                                    record.remove();
                                    delete me.valueJsonObject[record.get('name')];
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
