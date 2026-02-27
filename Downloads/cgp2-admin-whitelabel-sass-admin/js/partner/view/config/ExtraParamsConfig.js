Ext.define('CGP.partner.view.config.ExtraParamsConfig', {
    extend: 'Ext.window.Window',

    modal: true,
    height: 150,
    width: 450,
    autoScroll: true,
    autoShow: true,
    recordData: null,

    initComponent: function () {
        var me = this;
        var fieldText = null;
        me.title = i18n.getKey('extraParams')+i18n.getKey('config');
        me.itemId = 'ExtraParamsConfig';
        me.id = 'ExtraParamsConfig';
        var myMask = new Ext.LoadMask(me, {
            msg: "加载中..."
        });
        me.listeners = {
            show: function () {
                myMask.show();
            }
        };
        var store = Ext.create('CGP.partner.store.PartnerConfigStore', {
            partnerId: me.partnerId,
            groupId: me.groupId,
            websiteId: me.websiteId,
            listeners: {
                load: function () {
                    myMask.hide();
                }
            }
        });

        var bbar = Ext.create('Ext.toolbar.Toolbar', {
            items: [
                '->', {
                    itemId: 'btnSave',
                    text: i18n.getKey('save'),
                    iconCls: 'icon_save',
                    handler: function () {
                        if(me.form.isValid()){
                            var data = me.form.getComponent('RtType').getValue();
                            me.controller.modifyConfiguration(data,me.recordData)
                        }
                    }
                }, {
                    itemId: 'btnReset',
                    text: i18n.getKey('reset'),
                    iconCls: 'icon_reset',
                    handler: function () {
                        //重置保存的配置
                        store.load();
                    }
                }
            ]
        });
        var page = Ext.create("Ext.form.Panel", {
            header: false,
            //height: 400,
            width: '100%',
            padding: 10,
            border: false,
            layout: {
                type: 'table',
                columns: 2
            },
            defaults: {
                labelAlign: 'right',
                width: 300
            },
            items: [
                {
                    name: 'RtType',
                    xtype: 'treecombo',
                    fieldLabel: i18n.getKey('customTypeId'),
                    itemId: 'RtType',
                    store: Ext.create('CGP.common.store.RtType'),
                    displayField: 'name',
                    valueField: '_id',
                    rootvisible: false,
                    selectChildren: false,
                    canSelectFolders: true,
                    width: 380,
                    allowBlank: false,
                    multiselect: false,
                    listeners: {
                        //展开时显示选中状态
                        expand: function (field) {
                            var recursiveRecords = [];

                            function recursivePush(node, setIds) {
                                addRecRecord(node);
                                node.eachChild(function (nodesingle) {
                                    if (nodesingle.hasChildNodes() == true) {
                                        recursivePush(nodesingle, setIds);
                                    } else {
                                        addRecRecord(nodesingle);
                                    }
                                });
                            };
                            function addRecRecord(record) {
                                for (var i = 0, j = recursiveRecords.length; i < j; i++) {
                                    var item = recursiveRecords[i];
                                    if (item) {
                                        if (item.getId() == record.getId()) return;
                                    }
                                }
                                if (record.getId() <= 0) return;
                                recursiveRecords.push(record);
                            };
                            var node = field.tree.getRootNode();
                            recursivePush(node, false);
                            Ext.each(recursiveRecords, function (record) {
                                var id = record.get(field.valueField);
                                if (field.getValue() == id && !Ext.isEmpty(field.getValue())) {
                                    field.tree.getSelectionModel().select(record);
                                }
                            });
                        },
                        afterrender: function(comp){
                            comp.tree.expandAll();
                        }
                    }
                }
            ]

        });
        store.on('load', function (store, records) {
            var record = null;
            Ext.each(records, function (item) {
                if (item.get('key') == 'PARTNER_' + me.partnerId + '_CONFIG_KEY_ORDER_EXTRA_PARAM_RT_TYPE') {
                    record = item;
                    me.recordData = record.data;
                }
            });
            if (!Ext.isEmpty(record)) {
                var rtType = page.getComponent('RtType');
                //page.getComponent('RtType').on('render',function(comp){
                rtType.setValue(record.get('value'));
                //})
            } else {
                Ext.Msg.confirm(i18n.getKey('prompt'), "额外属性配置为空，是否新建?", callback);
                function callback(id) {
                    var data = {
                        "title": "partner default address",
                        "description": "partner default address",
                        "key": 'PARTNER_' + me.partnerId + '_CONFIG_KEY_ORDER_EXTRA_PARAM_RT_TYPE',
                        "value": "",
                        "groupId": 24,
                        "websiteId": 11,
                        "sortOrder": 0
                    };
                    if (id == 'yes') {
                        me.controller.createConfiguration(data, me)
                    } else {
                        me.close();
                    }
                }
            }
        });
        store.load();
        me.items = [page];
        me.bbar = bbar;

        me.callParent(arguments);
        me.form = me.down('form');
    }
});




