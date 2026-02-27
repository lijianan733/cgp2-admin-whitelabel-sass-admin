/**
 * Created by nan on 2022/1/6
 */
Ext.Loader.syncRequire([
    'CGP.material.store.Material'
])
Ext.define('CGP.common.field.MaterialSelectField', {
    extend: 'Ext.ux.tree.UxTreeComboHasPaging',
    alias: 'widget.materialselectfield',
    displayField: 'name',
    valueField: '_id',
    haveReset: true,
    treeWidth: 450,
    editable: false,
    selType: 'rowmodel',
    rootVisible: false,
    selectChildren: false,
    canSelectFolders: true,
    multiselect: false,
    vtype: '',//'onlySMT',
    isHiddenCheckSelected: true,
    infoUrl: adminPath + 'api/materials/{recordId}',
    pathUrl: adminPath + 'api/materials/{recordId}/path',
    baseFilter: [],//默认的过滤配置
    defaultColumnConfig: {
        renderer: function (value, metaData, record) {
            if (record.getId()) {
                return value + '(' + record.getId() + ')'
            }
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
                    type = '<div style="color: green">' + i18n.getKey('SMU') + '</div>'
                } else if (value == 'MaterialType') {
                    type = '<div style="color: blue">' + i18n.getKey('SMT') + '</div>'
                }
                return type;
            }
        }
    ],
    requestParamName: [
        {//查找类型的集合
            name: '按id查找',
            value: '{name:"id",type:"int"}'
        }, {
            name: '按物料名称查找',
            value: '{name:"name",type:"string"}'
        }, {
            name: '按物料分类id查找',
            value: '{name:"category",type:"string"}'
        }
    ],
    initComponent: function () {
        var me = this;
        me.store = me.store || Ext.create('CGP.material.store.Material');
        Ext.apply(Ext.form.VTypes, {
            onlySMT: function (value, treeCombo) {//验证方法名
                var selectNode = treeCombo.selectedRecords[0];
                if (selectNode) {
                    if (selectNode.get('clazz') == 'com.qpp.cgp.domain.bom.MaterialType') {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            },
            onlySMTText: '非MMT物料',
            onlySMU: function (value, treeCombo) {//验证方法名
                var selectNode = treeCombo.selectedRecords[0];
                if (selectNode) {
                    if (selectNode.get('clazz') == 'com.qpp.cgp.domain.bom.MaterialSpu') {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            },
            onlySMUText: '非MMU物料'
        });
        me.callParent();
        //处理使用非树结构的接口返回数据没leaf信息
        me.store.on('load', function (opt, parentNode, records) {
            if (records.length > 0) {
                for (var i = 0; i < records.length; i++) {
                    records[i].set('leaf', Ext.isEmpty(records[i].raw.leaf) || records[i].raw.leaf);
                }
            }
        });
    },
    doReset: function () {
        var materialSelectField = this.ownerCt.ownerCt.ownerTreeCombo;
        var info = this.ownerCt.items.items[0].getValue();
        info = Ext.JSON.decode(info);
        var treePanel = this.ownerCt.ownerCt;
        this.setValue(null);
        var store = treePanel.store;
        store.proxy.extraParams = {
            filter: Ext.JSON.encode(materialSelectField.baseFilter)
        };
        if (info.name == 'id') {
            store.proxy.url = adminPath + 'api/materials/root/childNodes';
        } else {
            store.proxy.url = adminPath + 'api/materials';
        }
        treePanel.store.load();
    },
    /**
     * 查询操作，需要处理切换查询目标时，切换接口
     */
    doSearch: function () {
        var materialSelectField = this.ownerCt.ownerCt.ownerTreeCombo;
        if (this.isValid() == false) {
            return;
        }
        var treePanel = this.ownerCt.ownerCt;
        var requestParamValue = this.getValue();
        var store = treePanel.store;
        store.proxy.extraParams = {
            filter: Ext.JSON.encode(materialSelectField.baseFilter)
        };
        if (!Ext.isEmpty(requestParamValue)) {
            var filter = null;
            var info = this.ownerCt.items.items[0].getValue();
            info = Ext.JSON.decode(info);
            if (info.name == 'id') {
                store.proxy.url = adminPath + 'api/materials/' + requestParamValue + '/childNodes';
                filter = Ext.JSON.encode([{
                    'name': 'isQueryChildren',
                    'value': false,
                    'type': 'boolean'
                }].concat(materialSelectField.baseFilter));

            } else if (info.name == 'name' || info.name == 'category') {
                store.proxy.url = adminPath + 'api/materials';
                filter = Ext.JSON.encode(
                    [{
                        'name': info.name,
                        'value': requestParamValue,
                        'type': info.type
                    }].concat(materialSelectField.baseFilter)
                );
            }
            store.proxy.extraParams.filter = filter;
            store.load({
                params: {
                    filter: filter,
                    page: 1,//加载时必须为第一页
                }
            })
        }
    },
})
