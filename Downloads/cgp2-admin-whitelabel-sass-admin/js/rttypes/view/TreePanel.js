Ext.syncRequire(['CGP.rttypes.model.RtType']);
Ext.define("CGP.rttypes.view.TreePanel", {
    extend: "Ext.tree.Panel",
    region: 'west',
    width: 340,
    config: {
        rootVisible: false,
        useArrows: true,
        viewConfig: {
            stripeRows: true,
            enableTextSelection: true
        }
    },
    autoScroll: true,
    children: null,
    itemId: 'rtTypeTree',
    initComponent: function () {
        var me = this;
        me.title = i18n.getKey('RtType');
        var controller = Ext.create('CGP.rttypes.controller.Controller');

        var rtTypeId = me.getQueryString('rtType');
        var params = null;
        if (rtTypeId) {//若选择了指定的物料类型了
            params = {
                filter: '[{"name":"isQueryChildren","value":false,"type":"boolean"}]'
            }
        }
        me.store = Ext.create('CGP.material.store.RtType', {
            root: {
                _id: rtTypeId ? rtTypeId : 'root',//有选择了RtType，和未选择物料
                name: rtTypeId ? rtTypeId : null
            },
            params: params
        });
        Ext.apply(Ext.form.field.VTypes, {
            number: function (val, field) {
                return Ext.isNumber(parseInt(val));
            },
            numberText: '请输入正确的id',
            numberMask: /^\d$/
        });
        me.store.on('load', function (store, node, records) {
            Ext.Array.each(records, function (item) {
                item.set('icon', '../material/category.png');
            });
        });
        me.bbar = Ext.create('Ext.PagingToolbar', {//底端的分页栏
            store: me.store,
            displayInfo: false, // 是否 ? 示， 分 ? 信息
            displayMsg: false, //?示的分?信息
            emptyMsg: i18n.getKey('noData')
        });
        me.tbar = {
            layout: {
                type: 'table',
                columns: 2
            },
            items: [
                {
                    xtype: 'trigger',
                    flex: 1,
                    //defaultValue:null//trigger无该配置项,使用originalValue
                    itemId: 'rtTypeNameSearch',
                    trigger1Cls: 'x-form-clear-trigger',
                    trigger2Cls: 'x-form-search-trigger',
                    checkChangeBuffer: 600,//延迟600毫秒
                    emptyText: '按名称查询RtType',
                    onTrigger1Click: function () {//按钮操作
                        var me = this;
                        var treePanel = me.ownerCt.ownerCt;
                        me.setValue(null);
                        var node = new (treePanel.store.model)({'_id': 'root'});
                        node.store = treePanel.store;
                        treePanel.store.proxy.extraParams = null;
                        treePanel.store.setRootNode(node);
                    },
                    onTrigger2Click: function () {//按钮操作
                        var me = this;
                        var treePanel = me.ownerCt.ownerCt;
                        var rtTypeName = me.getValue();
                        var store = treePanel.store;
                        if (!Ext.isEmpty(rtTypeName)) {
                            var oldUrl = store.proxy.url;
                            store.proxy.extraParams = {
                                filter: Ext.JSON.encode([
                                    {"name": "isQueryChildren", "value": true, "type": "boolean"},
                                    {"name": "name", "value": rtTypeName, "type": "string"}
                                ])
                            }
                            store.load();
                            store.proxy.url = oldUrl;
                        }
                    }
                },
                {
                    xtype: 'trigger',
                    vtype: 'number',
                    flex: 1,
                    //defaultValue:null//trigger无该配置项,使用originalValue
                    itemId: 'rtTypeSearch',
                    trigger1Cls: 'x-form-clear-trigger',
                    trigger2Cls: 'x-form-search-trigger',
                    minLength: 6,
                    checkChangeBuffer: 600,//延迟600毫秒
                    value: rtTypeId,
                    emptyText: '按Id查询RtType',
                    onTrigger1Click: function () {//按钮操作
                        var me = this;
                        var treePanel = me.ownerCt.ownerCt;
                        me.setValue(null);
                        var node = new (treePanel.store.model)({'_id': 'root'});
                        node.store = treePanel.store;
                        treePanel.store.proxy.extraParams = null;
                        treePanel.store.setRootNode(node);
                    },
                    onTrigger2Click: function () {//按钮操作
                        var me = this;
                        var treePanel = me.ownerCt.ownerCt;
                        var rtTypeId = me.getValue();
                        var store = treePanel.store;
                        if (!Ext.isEmpty(rtTypeId)) {
                            var oldUrl = store.proxy.url;
                            store.proxy.url = store.proxy.url.replace(/[{][a-zA-z]+[}]/, rtTypeId);
                            store.load({
                                params: {
                                    filter: '[{"name":"isQueryChildren","value":false,"type":"boolean"}]'
                                },
                                callback: function () {
                                    if (arguments[0] && arguments[0][0]) {
                                        treePanel.getSelectionModel().select(arguments[0][0]);
                                    }
                                }
                            });
                            store.proxy.url = oldUrl;
                        }

                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('addRtType'),
                    iconCls: 'icon_create',
                    flex: 1,
                    handler: function () {
                        controller.addSubRtType(me);
                    }
                },
            ]
        };
        me.columns = [
            {
                xtype: 'treecolumn',
                text: i18n.getKey('name'),
                flex: 3,
                dataIndex: 'name',
                //locked: true,
                renderer: function (value, metadata, record) {
                    return record.get("name") + '<font color="green"><' + record.get('_id') + '></font>';
                }
            }
        ];
        me.listeners = {
            select: function (rowModel, record) {
                rowModel.view.ownerCt.ownerCt.getComponent('infoTab').refreshData(record);
            },
            itemcontextmenu: function (view, record, item, index, e, eOpts) {
                var infoTab = view.ownerCt.ownerCt.getComponent('infoTab');
                controller.itemEventMenu(view, record, e);
            },
            afterrender: function () {
                var rtTypeId = me.getQueryString('rtType');
                if (rtTypeId) {
                    me.expandAll();
                }
            }
        };
        me.callParent(arguments);
    },
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
});