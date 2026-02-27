Ext.Loader.syncRequire([]);
Ext.define("CGP.product.view.productattributeprofile.EditTab", {
    extend: "Ext.tab.Panel",
    componentInit: false,
    region: 'center',
    itemId: 'infoTab',
    layout: 'fit',
    header: false,
    data: null,
    productId: null,
    initComponent: function () {
        var me = this;
        //me.title = i18n.getKey("materialInfo");
        var controller = Ext.create('CGP.product.view.productattributeprofile.controller.Controller');
        me.tbar = Ext.create('Ext.toolbar.Toolbar', {
            items: [
                {
                    itemId: 'btnSave',
                    text: i18n.getKey('save'),
                    disabled: true,
                    iconCls: 'icon_save',
                    handler: function (comp) {
                        var tab = comp.ownerCt.ownerCt;
                        var baseInfo = tab.getComponent('baseInfo');
                        var groupGrid = tab.getComponent('groupGrid');
                        var data = {};
                        data = Ext.Object.merge(data, baseInfo.getValues());
                        data.groups = groupGrid.getValue();
                        if (Ext.isEmpty(data.groups)) {
                            Ext.Msg.alert('提示', '分组不能为空！');
                            return;
                        }
                        if (baseInfo.isValid()) {
                            var resultData = Ext.Object.merge(me.data, data);
                            var mask = me.setLoading();
                            controller.saveAttributeProfile(resultData, mask);
                        } else {
                            var formValidArr = new Ext.util.MixedCollection();
                            formValidArr.add('baseInfo', baseInfo.isValid());
                            //formValidArr.add('rtType', rtTypeForm.isValid());
                            //formValidArr.add('spuRtType', spuRtTypeForm.isValid());
                            formValidArr.eachKey(function (key, item) {
                                if (item == false) {
                                    tab.setActiveTab(key);
                                    return;
                                }
                            });
                        }
                    }
                }
            ]
        });
        me.listeners = {
            render: function () {
                me.refreshData(me.data);
            }
        };

        me.callParent(arguments);
        me.on('afterrender', function () {
            var page = this;
            var productId = JSGetQueryString('productId');
            var isLock = JSCheckProductIsLock(productId);
            if (isLock) {
                JSLockConfig(page);
            }
        });
    },
    refreshData: function (data) {
        var me = this;
        var type = data.type;
        me.data = data;
        if (!me.componentInit)
            me.addItem(data);
        me.setTitle(i18n.getKey('material') + ':' + data.name);
        Ext.Array.each(me.items.items, function (item) {
            item.refreshData(data);
        });

        me.setActive(me.items.items[0]);

    },
    addItem: function (data) {
        var me = this;
        var saveButton = me.child("toolbar").getComponent("btnSave");
        saveButton.setDisabled(false);
        var productId = data.productId;
        var baseInfo = Ext.create('CGP.product.view.productattributeprofile.view.Information');
        var gridGroup = Ext.create('CGP.product.view.productattributeprofile.view.GroupGrid', {
            productId: productId,
            data: data
        });
        me.add([baseInfo, gridGroup]);

        me.componentInit = true;
    }
});
