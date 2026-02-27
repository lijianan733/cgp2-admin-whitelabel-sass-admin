Ext.Loader.syncRequire(['Ext.ux.form.GridField', 'CGP.material.model.BomItem', 'CGP.material.override.NodeInterface', 'CGP.material.override.Model', 'CGP.material.override.TreeStore']);
Ext.define("CGP.material.view.InfoTab", {
    extend: "Ext.tab.Panel",
    alias: 'widget.materialinfo',
    componentInit: false,
    region: 'center',
    itemId: 'infoTab',
    layout: 'fit',
    header: false,
    bomTreeRecord: null,//记录在bomTreePanel中选择的节点
    initComponent: function () {
        var me = this;
        //me.title = i18n.getKey("materialInfo");
        var controller = Ext.create('CGP.material.controller.Controller');
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
                        var bomItem = tab.getComponent('bomItem');
                        var treePanel = tab.ownerCt.getComponent('materialTree') || tab.ownerCt.getComponent('bomTree');
                        //var materialViewType = tab.getComponent('mtViews').getValue();
                        //var rtTypeForm = tab.getComponent('rtType').down('form');
                        var rtType = tab.getComponent('rtTypeObject').getValue();
                        var spuRtType = tab.getComponent('spuRtTypeObject').getValue();
                        if (spuRtType === true) {
                            //Ext.Msg.alert(i18n.getKey('prompt'),i18n.getKey("material's spuRtObject necessary attribute can't null !"));
                            /*tab.setActiveTab('spuRtTypeObject');*/
                            return;
                        }
                        var data = baseInfo.getValues();
                        data.childItems = bomItem.getValue();
                        //data.defaultViewTypes = materialViewType;
                        data.category = me.data.category;
                        data.clazz = me.data.clazz;
                        Ext.Object.merge(rtType, spuRtType);
                        Ext.Object.merge(data, rtType);
                        if (Ext.isEmpty(data.parentId)) {
                            delete data.parentId;
                        } else {
                            data.parentMaterialType = {
                                _id: data.parentId,
                                idReference: 'Material',
                                clazz: 'com.qpp.cgp.domain.bom.MaterialType'
                            }
                        }
                        if (baseInfo.isValid()) {
                            var resultData = Ext.Object.merge(me.data, data);
                            controller.updateMaterial(resultData, treePanel, me.bomTreeRecord);
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
                },
                {
                    itemId: 'reset',
                    text: i18n.getKey('reset'),
                    iconCls: 'icon_reset',
                    handler: function () {
                        Ext.Msg.confirm('提示', '是否恢复成上次保存的数据？', callback);

                        function callback(id) {
                            if (id === 'yes') {
                                me.refreshData(me.data, me.data.isLeaf)
                            }
                        }
                    }
                }
            ]
        });
        me.listeners = {
            tabchange: function (comp, newTab) {
                if (newTab.itemId == 'rtTypeObject' || newTab.itemId == 'spuRtTypeObject') {
                    newTab.getStore().initSortable();
                    newTab.getStore().sort('value', 'DESC');
                }
            }
        };

        var materialId = me.getQueryString('materialId');
        var isLeaf = me.getQueryString('isLeaf');
        var parentId = me.getQueryString('parentId');
        var isOnly = me.getQueryString('isOnly');
        me.callParent(arguments);
        if (isOnly == 'true') {
            controller.showMaterialInfo(me, materialId, isLeaf, parentId);
        }
    },
    refreshData: function (data, isLeaf, parentId) {
        var me = this;
        var type = data.type;
        me.data = data;
        data.isLeaf = isLeaf;
        if (!me.componentInit)
            me.addItem(data);
        me.setTitle(i18n.getKey('sell') + i18n.getKey('material') + ':' + data.name);
        Ext.Array.each(me.items.items, function (item) {
            item.refreshData(data);
        });

        me.setActive(me.items.items[0]);

    },
    addItem: function (data) {
        var me = this;
        var saveButton = me.child("toolbar").getComponent("btnSave");
        saveButton.setDisabled(false);
        var baseInfo = Ext.create('CGP.material.view.information.BaseInfo');
        var bomItem = Ext.create('CGP.material.view.information.BomItem', {
            data: data
        });
        /*var spuRtType = Ext.create('CGP.material.view.information.RtTypeDetail', {
         itemId: 'spuRtType'
         });*/
        var spuRtType = Ext.create('CGP.material.view.information.SpuRtTypeObject');
        var rtType = Ext.create('CGP.material.view.information.RtTypeObject');
        var viewType = Ext.create('CGP.material.view.information.MtViews');
        me.add([baseInfo, bomItem, rtType, spuRtType/*, viewType*/]);

        me.componentInit = true;
    },
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
});
