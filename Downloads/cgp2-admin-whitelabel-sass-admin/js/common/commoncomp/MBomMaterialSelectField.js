/**
 * Created by nan on 2021/7/2
 */

Ext.define('CGP.common.commoncomp.MBomMaterialSelectField', {
    extend: 'Ext.ux.tree.UxTreeComboHasPaging',
    alias: 'widget.mbommaterialselectfield',
    displayField: 'name',
    valueField: '_id',
    flex: 1,
    haveReset: true,
    allowBlank: false,
    treeWidth: 450,
    editable: false,
    selType: 'rowmodel',
    rootVisible: false,
    selectChildren: false,
    canSelectFolders: true,
    multiselect: false,
    vtype: 'isMMU',
    isHiddenCheckSelected: true,
    selectedRecordsWindowWidth: 500,
    defaultColumnConfig: {
        renderer: function (value, metaData, record) {
            if (record.getId()) {
                return value + '(' + record.getId() + ')'
            }
        }
    },
    doSearch: function () {
        var treePanel = this.ownerCt.ownerCt;
        var requestParamValue = this.getValue();
        var store = treePanel.store;
        if (!Ext.isEmpty(requestParamValue)) {
            var oldUrl = store.proxy.url;
            store.proxy.url = store.proxy.url.replace(/[{][a-zA-z]+[}]/, requestParamValue);
            store.load({
                params: {
                    filter: Ext.JSON.encode([
                        {
                            "name": "clazz",
                            "type": "string",
                            "value": "com.qpp.cgp.domain.bom.MaterialType"
                        },
                        {
                            "name": "isQueryChildren",
                            "value": false,
                            "type": "boolean"
                        }
                    ]),
                    page: 1//加载时必须为第一页
                }
            });
            store.proxy.url = oldUrl;
        }
    },
    extraColumn: [
        {
            text: i18n.getKey('type'),
            flex: 1,
            dataIndex: 'type',
            renderer: function (value) {
                var type;
                if (value == 'MaterialSpu') {
                    type = '<div style="color: green">' + i18n.getKey('MMU') + '</div>'
                } else if (value == 'MaterialType') {
                    type = '<div style="color: blue">' + i18n.getKey('MMT') + '</div>'
                }
                return type;
            }
        }
    ],
    initComponent: function () {
        var me = this;
        me.store = me.store || Ext.create('CGP.mmaterialprocess.mbom.store.Material');
        me.callParent();
    }
}, function () {
    Ext.apply(Ext.form.VTypes, {
        isMMU: function (value, treeCombo) {//验证方法名
            var selectNode = treeCombo.selectedRecords[0];
            if (selectNode) {
                if (selectNode.get('clazz') == 'com.qpp.qris.eds.domain.material.MMType') {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        },
        isMMUText: '非MMU物料'
    });
})