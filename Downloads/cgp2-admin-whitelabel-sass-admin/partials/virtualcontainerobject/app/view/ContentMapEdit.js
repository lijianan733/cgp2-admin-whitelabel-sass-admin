Ext.define("CGP.virtualcontainerobject.view.ContentMapEdit", {
    extend: 'Ext.form.Panel',
    alias: 'widget.contentmapedit',
    requires: [],
    layout: {
        type: 'hbox',
    },
    defaults: {
        labelAlign: 'right',
        width: 380,
        labelWidth: 120,
        msgTarget: 'side',
        margin: '5 5'
    },
    autoScroll: false,
    scroll: 'vertical',
    data: null,
    initComponent: function () {
        var me = this;
        me.items = [
            {
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name',
                allowBlank: false,
                hidden: true
            },
            {
                name: 'childObject',
                xtype: 'vcocombo',
                fieldLabel: i18n.getKey('循环的内容(VCO)'),
                itemId: 'childObject',
                displayField: 'displayName',
                valueField: '_id',
                width: 380,
                editable: false,
                allowBlank: false,
                store: Ext.create('CGP.virtualcontainerobject.store.VirtualContainerObject', {
                    storeId: 'itemVCOStore',
                    listeners: {
                        load: function (store, rec, successful) {
                            if (successful && me.data) {
                                var itemVCOId = me.data['childObject']?._id;
                                if (itemVCOId) {
                                    me.getComponent('childObject').setSubmitValue(itemVCOId);
                                }
                            }
                        }
                    },
                }),
                matchFieldWidth: false,
                multiSelect: false,
                listeners: {
                    change: function (comp, newValue, oldValue) {

                        var leftTrees = Ext.ComponentQuery.query('[itemId="argument"] [itemId="leftTree"]');
                        leftTrees.forEach(function (item) {
                            item.itemRtType = Ext.Object.getValues(newValue)[0]?.containerType?.argumentType;
                            item.getRootNode().removeAll();
                            item.store.proxy.url = adminPath + 'api/rtTypes/-1/rtAttributeDefs';
                            item.store.load();
                            if (item.data) {
                                item.setValue(item.data);
                            }
                        })
                    }
                }
            },
            {
                xtype: 'button',
                itemId: 'addVCO',
                text: i18n.getKey('create') + i18n.getKey('VCO'),
                iconCls: 'icon_add',
                width: 120,
                ui: 'default-toolbar-small',
                handler: function (btn) {
                    var controller = Ext.create('CGP.virtualcontainerobject.controller.VirtualContainerObject');
                    controller.selectVCT(btn, 'itemAddVCO');
                }
            }
        ];
        me.callParent(arguments);
    },
    listeners: {
        // afterrender: function (comp) {
        //     if (!Ext.isEmpty(comp.data)) {
        //         comp.setValue(comp.data);
        //     }
        // }
    },

    isValid: function () {
        var me = this;
        var isValid = true;
        if (me.rendered == true) {
            me.items.items.forEach(function (item) {
                if (!item.hidden && item.itemId != 'addVCO' && item.isValid() == false) {
                    isValid = false;
                }
            });
        }
        return isValid;
    },
    setValue: function (data) {
        var me = this;
        if (Ext.isEmpty(data)) {
            return false;
        }
        me.data = data[0];

        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            if (item.itemId == 'childObject') {
                if (me.data[item.name]?._id) {
                    item.setInitialValue([me.data[item.name]?._id]);
                }
            } else if (item.itemId != 'addVCO') {
                item.setValue(me.data[item.name]);
            }
        })
    },
    getValue: function () {
        var me = this;
        var data = me.data || {};
        if (Ext.isEmpty(data._id)) {
            data._id = JSGetCommonKey();
            data.clazz = 'com.qpp.cgp.domain.pcresource.virtualcontainer.ContentMapItem';
        }
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            if (item.itemId == 'childObject') {
                var value0 = Ext.Object.getValues(item.getValue())[0]
                data[item.name] = {_id: value0._id, clazz: value0.clazz};
            } else if (item.itemId != 'addVCO') {
                data[item.name] = item.getValue();
            }

        });
        var result = [];
        result.push(data);
        return result;
    }
});
